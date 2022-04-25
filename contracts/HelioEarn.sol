// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./jar.sol";

interface VowLike {
    function permit(address jar, uint8 permit_) external;
}

contract HelioEarn is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    mapping (address => uint) public wards;
    function rely(address usr) external auth { wards[usr] = 1; }
    function deny(address usr) external auth { wards[usr] = 0; }
    modifier auth {
        require(wards[msg.sender] == 1, "HelioEarn/not-authorized");
        _;
    }

    event PoolCreated(address poolId, uint256 size, uint256 start, uint256 end);
    event EnteredEarn(address indexed user, uint256 amount);

    address[] jars;

    VatLike public vat;
    VowLike public vow;
    Jar public jar;

    function initialize(address vat_,
        address vow_) public initializer {
        __Ownable_init();

        wards[msg.sender] = 1;

        vat = VatLike(vat_);
        vow = VowLike(vow_);
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}

    function createPool(uint256 poolSize, uint256 start, uint256 end) external onlyOwner returns(address) {
        jar = new Jar(address(vat), address(vow));
        vow.permit(address(jar), 1);
        jar.file(stringToBytes32("plate"), poolSize, start, end);

        emit PoolCreated(address(jar), poolSize, start, end);
        return address(jar);
    }

    function enterPool(uint256 amount) public {
//        vat.behalf(msg.sender, address(this));
        jar.join(amount);

        emit EnteredEarn(msg.sender, amount);
    }

    function cage() external onlyOwner {
        jar.cage();
    }

    function rate() public view returns(uint256) {
        uint256 currentPlate = jar.current();
        (uint256 rate,,,,,) = jar.plates(currentPlate);
        return rate;
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
}