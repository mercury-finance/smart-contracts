// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { ERC20 } from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockERC20 is ERC20 {
  constructor(string memory name, string memory symbol) ERC20(name, symbol) {}

  function mintMe(uint256 amount) external {
    _mint(msg.sender, amount);
  }

  function mint(address account, uint256 amount) external {
    _mint(account, amount);
  }

  function burnBe(uint256 amount) external {
    _burn(msg.sender, amount);
  }

  function burn(address account, uint256 amount) external {
    _burn(account, amount);
  }
}
