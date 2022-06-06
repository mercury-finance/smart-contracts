// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { IERC20MintBurn } from "./interfaces/IERC20MintBurn.sol";

import "hardhat/console.sol";

interface IDao {
  function deposit(
    address,
    address,
    uint256
  ) external;

  function withdraw(
    address,
    address,
    uint256
  ) external;
}

contract MockHelioProvider {
  IERC20MintBurn public collateralToken;
  IERC20MintBurn public ceToken;
  IDao public dao;

  constructor(
    IERC20MintBurn _collateralToken,
    IERC20MintBurn _ceToken,
    IDao _dao
  ) {
    collateralToken = _collateralToken;
    ceToken = _ceToken;
    dao = _dao;
    ceToken.approve(address(dao), type(uint256).max);
  }

  function depositBNB() external payable {
    uint256 value = msg.value;
    ceToken.mintMe(value);
    dao.deposit(msg.sender, address(ceToken), value);
    collateralToken.mint(msg.sender, value);
  }

  function liquidation(address recipient, uint256 amount) external {
    dao.withdraw(address(this), address(ceToken), amount);
    console.log("aaaaaaaaa");
    collateralToken.burn(msg.sender, amount);
    console.log("bbbbbbbbb");
    ceToken.burn(msg.sender, amount);
    // solhint-disable-next-line avoid-low-level-calls
    (bool success, ) = recipient.call{ value: amount }("");
    require(success, "cannot send");
  }

  function daoBurn(address account, uint256 amount) external {
    collateralToken.burn(account, amount);
  }

  function daoMint(address, uint256) external {}
}
