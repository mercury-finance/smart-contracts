// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import {Vat} from "./vat.sol";
import {GemJoin, UsbJoin} from "./join.sol";
import {Usb} from "./usb.sol";
import {Spotter} from "./spot.sol";

contract DAOInteraction {

//    event VaultCreated(address indexed user, uint256 cdpId, address urnId);
    event Deposit(address indexed user, uint256 amount);
    event Borrow(address indexed user, uint256 amount);

    Vat public vat;
    Spotter public spot;
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
//        __Ownable_init();

        vat = Vat(vat_);
        spot = Spotter(spot_);
        abnbc = IERC20(abnbc_);
        usb = Usb(usb_);
        abnbcJoin = GemJoin(abnbcJoin_);
        usbJoin = UsbJoin(usbJoin_);

        ilk = stringToBytes32("aBNBc");

        vat.hope(usbJoin_);
    }
//
//    function openVault() public returns(uint256, address){
//        uint256 cdpId = manager.last(msg.sender);
//        if (cdpId == 0) {
//            cdpId = manager.open(ilk, msg.sender);
//        }
//
//        address urnId = manager.urns(cdpId);
//        emit VaultCreated(msg.sender, cdpId, urnId);
//
//        return (cdpId, urnId);
//    }
//
//    function deposit(uint256 dink) external returns(uint256){
//        //TODO use view function
//        (uint256 cdpId, address urnId) = openVault();
//        abnbc.transferFrom(msg.sender, address(this), dink);
//        abnbc.approve(address(abnbcJoin), dink);
//        abnbcJoin.join(urnId, dink);
//
//        // TODO rely manager on interaction contract
////        manager.cdpAllow(cdpId, address(this), 1);
//
//        emit Deposit(msg.sender, dink);
//        return cdpId;
//    }
//
//    function borrow(uint cdpId, uint256 dink, uint256 dart) external {
//        manager.frob(cdpId, int(dink), int256(dart));
//        manager.move(cdpId, address(this) , dart * 10**27);
//        usbJoin.exit(msg.sender, dart);
//
//        emit Borrow(msg.sender, dart);
//    }

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

    // Rate for calculations is 1/<return value>
    // i.e. If mat == 125000..000 => rate = 1 / 1.25 = 0.8 = 80%.
    function collateralRate() public view returns (uint256){
        (, uint256 mat) = spot.ilks(ilk);
        return mat;
    }

    function availableToBorrow(address usr) public view returns(int256){
        (uint256 ink, uint256 art) = vat.urns(ilk, usr);
        (, uint256 rate, uint256 spot,,) = vat.ilks(ilk);
        uint256 collateral = ink * spot;
        uint256 debt = rate * art;
        return int256(collateral) - int256(debt);
    }

    function deposit(uint256 dink) external returns (uint256){
        abnbc.transferFrom(msg.sender, address(this), dink);
        abnbc.approve(address(abnbcJoin), dink);
        abnbcJoin.join(msg.sender, dink);

        emit Deposit(msg.sender, dink);
        return dink;
    }

    function borrow(uint256 dink, uint256 dart) external returns(uint256) {
        vat.frob(ilk, msg.sender, msg.sender, msg.sender, int256(dink), int256(dart));
        vat.move(msg.sender, address(this), dart * 10**27);
        usbJoin.exit(msg.sender, dart);

        emit Borrow(msg.sender, dart);
        return dart;
    }
}