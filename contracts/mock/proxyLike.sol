//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../makerdaoCore/jug.sol";
import "../makerdaoCore/vat.sol";
import "hardhat/console.sol";

interface GemLike {
  function approve(address, uint256) external;

  function transfer(address, uint256) external;

  function transferFrom(
    address,
    address,
    uint256
  ) external;

  function deposit() external payable;

  function withdraw(uint256) external;
}

interface DaiJoinLike {
  function dai() external returns (GemLike);

  function join(address, uint256) external payable;

  function exit(address, uint256) external;
}

contract ProxyLike is Ownable {
  uint256 internal constant RAY = 10**27;
  address internal jug;
  address internal vat;

  constructor(address _jug, address _vat) {
    jug = _jug;
    vat = _vat;
  }

  function sub(uint256 x, uint256 y) internal pure returns (uint256 z) {
    unchecked {
      require((z = x - y) <= x, "sub-overflow");
    }
  }

  function mul(uint256 x, uint256 y) internal pure returns (uint256 z) {
    unchecked {
      require(y == 0 || (z = x * y) / y == x, "mul-overflow");
    }
  }

  function jugInitFile(
    bytes32 _gem,
    bytes32 _what,
    uint256 _rate
  ) external onlyOwner {
    Jug(jug).init(_gem);
    Jug(jug).file(_gem, _what, _rate);
  }
}
