// SPDX-License-Identifier: AGPL-3.0-or-later

/// jar.sol -- Usb distribution farming

// Copyright (C) 2022 Qazawat <xirexor@gmail.com>
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.
//
// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/*
   "Put rewards in the jar and close it".
   This contract lets you deposit USBs from usb.sol and earn
   USB rewards. The USB rewards are deposited into this contract
   and distributed over a timeline. Users can redeem rewards
   after exit delay.
   
   Note: This approach is an alternative to per second rewards.
   Rewards are confirmed after every ratio change.
*/

contract JarR {
  // --- Wrapper ---
  using SafeERC20 for IERC20;

  // --- Auth ---
  mapping(address => uint256) public wards;

  function rely(address guy) external auth {
    wards[guy] = 1;
  }

  function deny(address guy) external auth {
    wards[guy] = 0;
  }

  modifier auth() {
    require(wards[msg.sender] == 1, "Jar/not-authorized");
    _;
  }

  // --- Derivative ---
  string public name;
  string public symbol;
  uint8 public decimals = 18;
  uint256 public totalSupply;
  mapping(address => uint256) public balanceOf;

  // --- Reward Data ---
  uint256 public spread; // Distribution time    [sec]
  uint256 public usbDeposit; // Total USBs in farm   [wad]
  uint256 public exitDelay; // User unstake delay   [sec]

  uint256 public ratio;
  // solhint-disable-next-line var-name-mixedcase
  address public USB;

  mapping(address => uint256) public redeemables; // Capital + Rewards
  mapping(address => uint256) public unstakeTime; // Time of Unstake

  uint256 public live; // Active Flag

  // --- Events ---
  event Initialized(uint256 indexed duration, uint256 indexed exitDelay);
  event Replenished(uint256 reward);
  event Join(address indexed user, uint256 indexed amount);
  event Exit(address indexed user, uint256 indexed amount);
  event Redeem(address[] indexed user);
  event Cage();

  // --- Init ---
  constructor(
    address _usb,
    string memory _name,
    string memory _symbol
  ) {
    wards[msg.sender] = 1;
    live = 1;

    USB = _usb;
    name = _name;
    symbol = _symbol;

    ratio = 1e18;
  }

  // --- Mods ---
  modifier update() {
    if (totalSupply != 0) {
      require(usbDeposit > 0, "Jar/denominator-is-0");
      ratio = (totalSupply * 1e18) / usbDeposit;
    }
    _;
  }

  // --- Views ---
  function balanceOfWithRewards(address account) public view returns (uint256) {
    return (balanceOf[account] * 1e18) / ratio;
  }

  // --- Aministration ---
  function initialize(uint256 _spread, uint256 _exitDelay) public auth {
    spread = _spread;
    exitDelay = _exitDelay;
    emit Initialized(spread, exitDelay);
  }

  function replenish(uint256 wad) public update {
    usbDeposit += wad;

    IERC20(USB).safeTransferFrom(msg.sender, address(this), wad);
    emit Replenished(wad);
  }

  function cage() external auth {
    live = 0;
    emit Cage();
  }

  // --- User ---
  function join(uint256 wad) public {
    // amount in USBs
    require(live == 1, "Jar/not-live");

    uint256 bal = (wad * ratio) / 1e18; // hUSBs
    balanceOf[msg.sender] += bal;
    totalSupply += bal;
    usbDeposit += wad;

    IERC20(USB).safeTransferFrom(msg.sender, address(this), wad);
    emit Join(msg.sender, bal);
  }

  function exit(uint256 wad) public {
    // amount in hUSBs
    require(live == 1, "Jar/not-live");

    uint256 bal = (wad * 1e18) / ratio; // USBs
    balanceOf[msg.sender] -= wad;
    totalSupply -= wad;
    redeemables[msg.sender] += bal; // USBs
    usbDeposit -= bal;
    unstakeTime[msg.sender] = block.timestamp + exitDelay;

    emit Exit(msg.sender, bal);
  }

  function redeemBatch(address[] memory accounts) external {
    require(live == 1, "Jar/not-live");

    for (uint256 i = 0; i < accounts.length; i++) {
      if (block.timestamp < unstakeTime[accounts[i]]) continue;

      uint256 redeemable = redeemables[accounts[i]];
      if (redeemable > 0) {
        redeemables[accounts[i]] = 0;
        IERC20(USB).safeTransfer(accounts[i], redeemable);
      }
    }

    emit Redeem(accounts);
  }
}
