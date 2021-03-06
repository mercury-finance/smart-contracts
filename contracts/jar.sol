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
*/

contract Jar {
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
  uint256 public spread; // Distribution time     [sec]
  uint256 public endTime; // Time "now" + spread   [sec]
  uint256 public rate; // Emission per second   [wad]
  uint256 public tps; // USB tokens per share  [wad]
  uint256 public lastUpdate; // Last tps update       [sec]
  uint256 public exitDelay; // User unstake delay    [sec]
  // solhint-disable-next-line var-name-mixedcase
  address public USB; // The USB Stable Coin

  mapping(address => uint256) public tpsPaid; // USB per share paid
  mapping(address => uint256) public rewards; // Accumulated rewards
  mapping(address => uint256) public withdrawn; // Capital withdrawn
  mapping(address => uint256) public unstakeTime; // Time of Unstake

  uint256 public live; // Active Flag

  // --- Events ---
  event Initialized(address indexed token, uint256 indexed duration, uint256 indexed exitDelay);
  event Replenished(uint256 reward);
  event SpreadUpdated(uint256 newDuration);
  event ExitDelayUpdated(uint256 exitDelay);
  event Join(address indexed user, uint256 indexed amount);
  event Exit(address indexed user, uint256 indexed amount);
  event Redeem(address[] indexed user);
  event Cage();

  // --- Init ---
  constructor(string memory _name, string memory _symbol) {
    wards[msg.sender] = 1;
    live = 1;
    name = _name;
    symbol = _symbol;
  }

  // --- Math ---
  function _min(uint256 a, uint256 b) internal pure returns (uint256) {
    return a < b ? a : b;
  }

  // --- Mods ---
  modifier update(address account) {
    tps = tokensPerShare();
    lastUpdate = lastTimeRewardApplicable();
    if (account != address(0)) {
      rewards[account] = earned(account);
      tpsPaid[account] = tps;
    }
    _;
  }

  // --- Views ---
  function lastTimeRewardApplicable() public view returns (uint256) {
    return _min(block.timestamp, endTime);
  }

  function tokensPerShare() public view returns (uint256) {
    if (totalSupply <= 0 || block.timestamp <= lastUpdate) {
      return tps;
    }
    uint256 latest = lastTimeRewardApplicable();
    return tps + (((latest - lastUpdate) * rate * 1e18) / totalSupply);
  }

  function earned(address account) public view returns (uint256) {
    uint256 perToken = tokensPerShare() - tpsPaid[account];
    return ((balanceOf[account] * perToken) / 1e18) + rewards[account];
  }

  function redeemable(address account) public view returns (uint256) {
    return balanceOf[account] + earned(account);
  }

  function getRewardForDuration() external view returns (uint256) {
    return rate * spread;
  }

  function getAPR() external view returns (uint256) {
    if (spread == 0 || totalSupply == 0) {
      return 0;
    }
    return ((rate * 31536000 * 1e18) / totalSupply) * 100;
  }

  // --- Administration ---
  function initialize(
    address _usbToken,
    uint256 _spread,
    uint256 _exitDelay
  ) public auth {
    require(spread == 0);
    USB = _usbToken;
    spread = _spread;
    exitDelay = _exitDelay;
    emit Initialized(USB, spread, exitDelay);
  }

  function replenish(uint256 wad) external update(address(0)) {
    if (block.timestamp >= endTime) {
      rate = wad / spread;
    } else {
      uint256 remaining = endTime - block.timestamp;
      uint256 leftover = remaining * rate;
      rate = (wad + leftover) / spread;
    }
    lastUpdate = block.timestamp;
    endTime = block.timestamp + spread;

    IERC20(USB).safeTransferFrom(msg.sender, address(this), wad);
    emit Replenished(wad);
  }

  function setSpread(uint256 _spread) external auth {
    require(block.timestamp > endTime, "Jar/rewards-active");
    require(_spread > 0, "Jar/duration-non-zero");
    spread = _spread;
    emit SpreadUpdated(_spread);
  }

  function setExitDelay(uint256 _exitDelay) external auth {
    exitDelay = _exitDelay;
    emit ExitDelayUpdated(_exitDelay);
  }

  function cage() external auth {
    live = 0;
    emit Cage();
  }

  // --- User ---
  function join(uint256 wad) external update(msg.sender) {
    require(live == 1, "Jar/not-live");

    balanceOf[msg.sender] += wad;
    totalSupply += wad;

    IERC20(USB).safeTransferFrom(msg.sender, address(this), wad);
    emit Join(msg.sender, wad);
  }

  function exit(uint256 wad) external update(msg.sender) {
    require(live == 1, "Jar/not-live");
    require(wad > 0);

    balanceOf[msg.sender] -= wad;
    totalSupply -= wad;
    withdrawn[msg.sender] += wad;
    unstakeTime[msg.sender] = block.timestamp + exitDelay;

    emit Exit(msg.sender, wad);
  }

  function redeemBatch(address[] memory accounts) external {
    // Target is to allow direct and on-behalf redemption
    require(live == 1, "Jar/not-live");

    for (uint256 i = 0; i < accounts.length; i++) {
      if (block.timestamp < unstakeTime[accounts[i]]) continue;

      uint256 _amount = rewards[accounts[i]] + withdrawn[accounts[i]];
      if (_amount > 0) {
        rewards[accounts[i]] = 0;
        withdrawn[accounts[i]] = 0;
        IERC20(USB).safeTransfer(accounts[i], _amount);
      }
    }

    emit Redeem(accounts);
  }
}
