// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {Vat} from "./vat.sol";
import {GemJoin, UsbJoin} from "./join.sol";
import {Usb} from "./usb.sol";
import {Spotter, PipLike} from "./spot.sol";

import "hardhat/console.sol";

contract DAOInteraction {

    event Deposit(address indexed user, uint256 amount);
    event Borrow(address indexed user, uint256 amount);
    event Payback(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    Vat public vat;
    Spotter public spotter;
    IERC20 public abnbc;
    Usb public usb;
    GemJoin public abnbcJoin;
    UsbJoin public usbJoin;

    bytes32 ilk;

    uint256 private deposits;

    constructor(
        address vat_,
        address spot_,
        address abnbc_,
        address usb_,
        address abnbcJoin_,
        address usbJoin_) {

        vat = Vat(vat_);
        spotter = Spotter(spot_);
        abnbc = IERC20(abnbc_);
        usb = Usb(usb_);
        abnbcJoin = GemJoin(abnbcJoin_);
        usbJoin = UsbJoin(usbJoin_);

        ilk = stringToBytes32("aBNBc");

        vat.hope(usbJoin_);

        abnbc.approve(abnbcJoin_,
            115792089237316195423570985008687907853269984665640564039457584007913129639935);
        usb.approve(usbJoin_,
            115792089237316195423570985008687907853269984665640564039457584007913129639935);
    }

    function stringToBytes32(string memory source) public pure returns (bytes32 result) {
        bytes memory tempEmptyStringTest = bytes(source);
        if (tempEmptyStringTest.length == 0) {
            return 0x0;
        }

        assembly {
            result := mload(add(source, 32))
        }
    }

    function deposit(uint256 dink) external returns (uint256){
        abnbc.transferFrom(msg.sender, address(this), dink);
        abnbcJoin.join(msg.sender, dink);
        vat.behalf(msg.sender, address(this));
        vat.frob(ilk, msg.sender, msg.sender, msg.sender, int256(dink), 0);

        deposits += dink;
        emit Deposit(msg.sender, dink);
        return dink;
    }

    function borrow(uint256 dart) external returns(uint256) {
        vat.frob(ilk, msg.sender, msg.sender, msg.sender, 0, int256(dart));
        vat.move(msg.sender, address(this), dart * 10**27);
        usbJoin.exit(msg.sender, dart);

        emit Borrow(msg.sender, dart);
        return dart;
    }

    // Burn user's USB.
    // N.B. User collateral stays the same.
    function payback(uint256 dart) external returns(uint256) {
        usb.transferFrom(msg.sender, address(this), dart);
        usbJoin.join(msg.sender, dart);
        vat.frob(ilk, msg.sender, msg.sender, msg.sender, 0, -int256(dart));

        emit Payback(msg.sender, dart);
        return dart;
    }

    // Unlock and transfer to the user `dink` amount of aBNBc
    function withdraw(uint256 dink) external returns(uint256) {

        // User has `ink` amount of aBNBc as collateral
        // user has `art` amount of USB as debt;
        // total debt in $ = `art` * `rate`
        // thus collateral that can be unlocked = `ink` - (`art`*`rate` / `spot`)
//        uint256 debt = rate * art;
//        require(dink <= (urn.ink - )
//
//        + gem;
        uint256 unlocked = free(msg.sender);
        if (unlocked < dink) {
            int256 diff = int256(dink) - int256(unlocked);
            vat.frob(ilk, msg.sender, msg.sender, msg.sender, -diff, 0);
            vat.flux(ilk, msg.sender, address(this), uint256(diff));
        }
        abnbcJoin.exit(msg.sender, dink);
        deposits -= dink;

        emit Withdraw(msg.sender, dink);
        return dink;
    }


    /////////////////////////////////
    //// VIEW                    ////
    /////////////////////////////////

    // Price of the collateral asset(aBNBc) from Oracle
    function collateralPrice() public view returns (uint256) {
        (PipLike pip,) = spotter.ilks(ilk);
        (bytes32 price, bool has) = pip.peek();
        if (has) {
            return uint256(price);
        } else {
            return 0;
        }
    }

    // Returns the USB price in $
    function usbPrice() external view returns (uint256) {
        (, uint256 rate,,,) = vat.ilks(ilk);
        return rate / 10**9;
    }

    // Returns how much USB user can borrow for one token of collateral
    // i.e. 1 aBNBc worth `collateralRate` USB
    function collateralRate() external view returns (uint256) {
        (,,uint256 spot,,) = vat.ilks(ilk);
        return spot / 10**9;
    }

    // Total aBNBc deposited nominated in $
    function depositTVL() external view returns (uint256) {
        return deposits * collateralPrice();
    }

    // Total USB borrowed by all users
    function collateralTVL() external view returns (uint256) {
        (uint256 Art,,,,) = vat.ilks(ilk);
        return Art;
    }

    // Not locked user balance in aBNBc
    function free(address usr) public view returns (uint256) {
        return vat.gem(ilk, usr);
    }

    // User collateral in aBNBc
    function locked(address usr) external view returns (uint256) {
        (uint256 ink,) = vat.urns(ilk, usr);
        return ink;
    }

    // Total borrowed USB
    function borrowed(address usr) external view returns (uint256) {
        (, uint256 art) = vat.urns(ilk, usr);
        return art;
    }

    // Collateral minus borrowed. Basically free collateral (nominated in USB)
    function availableToBorrow(address usr) external view returns(int256) {
        (uint256 ink, uint256 art) = vat.urns(ilk, usr);
        (, uint256 rate, uint256 spot,,) = vat.ilks(ilk);
        uint256 collateral = ink * spot;
        uint256 debt = rate * art;
        return (int256(collateral) - int256(debt)) / 1e27;
    }

    // Collateral + `amount` minus borrowed. Basically free collateral (nominated in USB)
    // Returns how much usb you can borrow if provide additional `amount` of collateral
    function willBorrow(address usr, int256 amount) external view returns(int256) {
        (uint256 ink, uint256 art) = vat.urns(ilk, usr);
        (, uint256 rate, uint256 spot,,) = vat.ilks(ilk);
        require(amount >= -(int256(ink)), "Cannot withdraw more than current amount");
        if (amount < 0) {
            ink = uint256(int256(ink) + amount);
        } else {
            ink += uint256(amount);
        }
        uint256 collateral = ink * spot;
        uint256 debt = rate * art;
        return (int256(collateral) - int256(debt)) / 1e27;
    }

    // Price of aBNBc when user will be liquidated
    function currentLiquidationPrice(address usr) external view returns (uint256) {
        (uint256 ink, uint256 art) = vat.urns(ilk, usr);
        (, uint256 rate, uint256 spot,,) = vat.ilks(ilk);
        (,uint256 mat) = spotter.ilks(ilk);
        uint256 backedDebt = (art * rate / 10**36) * mat;
        return backedDebt / ink;
    }

    // Price of aBNBc when user will be liquidated with additional amount of aBNBc deposited/withdraw
    function estimatedLiquidationPrice(address usr, int256 amount) external view returns (uint256) {
        (uint256 ink, uint256 art) = vat.urns(ilk, usr);
        require(amount >= -(int256(ink)), "Cannot withdraw more than current amount");
        if (amount < 0) {
            ink = uint256(int256(ink) + amount);
        } else {
            ink += uint256(amount);
        }
        (, uint256 rate, uint256 spot,,) = vat.ilks(ilk);
        (,uint256 mat) = spotter.ilks(ilk);
        uint256 backedDebt = (art * rate / 10**36) * mat;
        return backedDebt / ink;
    }
}