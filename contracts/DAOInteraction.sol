// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {Vat} from "./vat.sol";
import {GemJoin, UsbJoin} from "./join.sol";
import {Usb} from "./usb.sol";
import {Spotter} from "./spot.sol";

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

    function free(address usr) public view returns (uint256) {
        return vat.gem(ilk, usr);
    }

    function locked(address usr) public view returns (uint256) {
        (uint256 ink,) = vat.urns(ilk, usr);
        return ink;
    }

    function borrowed(address usr) public view returns (uint256) {
        (, uint256 art) = vat.urns(ilk, usr);
        return art;
    }

    // Rate for calculations is 1/<return value>
    // i.e. If mat == 125000..000 => rate = 1 / 1.25 = 0.8 = 80%.
    function collateralRate() public view returns (uint256){
        (, uint256 mat) = spotter.ilks(ilk);
        return mat;
    }

    function availableToBorrow(address usr) public view returns(int256){
        (uint256 ink, uint256 art) = vat.urns(ilk, usr);
        (, uint256 rate, uint256 spot,,) = vat.ilks(ilk);
        uint256 collateral = ink * spot;
        uint256 debt = rate * art;
        return (int256(collateral) - int256(debt)) / 1e27;
    }

    function deposit(uint256 dink) external returns (uint256){
        abnbc.transferFrom(msg.sender, address(this), dink);
        abnbcJoin.join(msg.sender, dink);
        vat.behalf(msg.sender, address(this));
        vat.frob(ilk, msg.sender, msg.sender, msg.sender, int256(dink), 0);

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

//    // Collaterize only needed amount of aBNBc
//    // TODO: Need to implement some safe margin to avoid fast liquidation
//    function borrow(uint256 dart) external returns(uint256) {
//        // User can borrow this amount of `dart`
//        int256 collateral = availableToBorrow(msg.sender);
//        int256 sDart = int256(dart);
//        if (collateral < sDart) {
//            require(int256(vat.gem(ilk, msg.sender)) >= collateral - sDart, "Interaction/not-enough-collateral");
//            vat.frob(ilk, msg.sender, msg.sender, msg.sender, collateral - sDart, sDart);
//        } else {
//            vat.frob(ilk, msg.sender, msg.sender, msg.sender, 0, sDart);
//        }
//        vat.move(msg.sender, address(this), dart * 10**27);
//        usbJoin.exit(msg.sender, dart);
//
//        emit Borrow(msg.sender, dart);
//        return dart;
//    }

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

        emit Withdraw(msg.sender, dink);
        return dink;
    }

}