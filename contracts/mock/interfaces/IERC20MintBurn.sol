// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IERC20MintBurn is IERC20 {
  function mintMe(uint256 amount) external;

  function mint(address account, uint256 amount) external;

  function burnBe(uint256 amount) external;

  function burn(address account, uint256 amount) external;
}
