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

interface DSTokenLike {
    function balanceOf(address) external returns(uint);
    function transfer(address,uint) external;
    function transferFrom(address,address,uint) external;
}
interface VatLike {
    function move(address,address,uint256) external;
    function hope(address) external;
}

interface UsbJoinLike {
    function exit(address,uint) external;
}

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
    // --- Auth ---
    mapping (address => uint) public wards;
    function rely(address guy) external auth { wards[guy] = 1; }
    function deny(address guy) external auth { wards[guy] = 0; }
    modifier auth {
        require(wards[msg.sender] == 1, "Jar/not-authorized");
        _;
    }

    // --- Derivative ---
    string public name;
    string public symbol;
    uint public decimals = 18;
    uint public totalSupply;
    mapping(address => uint) public balanceOf;

    // --- Reward Data ---
    uint public spread;     // Distribution time    [sec]
    uint public startTime;  // Start of spread      [sec]
    uint public endTime;    // startTime + spread   [sec]
    uint public exitDelay;  // User unstake delay   [sec]

    uint256 public ratio;
    address public USB;

    mapping(address => uint) public redeemables;  // Capital + Rewards
    mapping(address => uint) public unstakeTime;  // Time of Unstake
    mapping(address => uint) public flag;         // Flag for force redemption

    address public vat;      // CDP Engine
    address public vow;      // Vow Surplus
    address public usbJoin;  // Usb Join
    uint    public live;     // Active Flag

    // --- Events ---
    event Join(address indexed user, uint indexed amount);
    event Exit(address indexed user, uint indexed amount);
    event Redeem(address indexed user, uint indexed amount);
    event Cage();

    // --- Init ---
    constructor(address _USB, string memory _name, string memory _symbol, address _vat, address _vow, address _usbJoin) {
        USB = _USB;
        name = _name;
        symbol = _symbol;

        vat = _vat;
        vow = _vow;
        usbJoin = _usbJoin;

        ratio = 1e18;
    }

    // --- Mods ---
    modifier update() {
        if(totalSupply != 0) {
            uint256 denominator = DSTokenLike(USB).balanceOf(address(this));
            require(denominator > 0, "Jar/denominator-is-0");
            ratio = (totalSupply * 1e18) / denominator;
        }
        _;
    } 

    // --- Views ---
    function multiplyAndDivide(uint256 a, uint256 b, uint256 c) internal pure returns (uint256) {
        return (a / c) * b + ((a % c) * b) / c;
    }
    function balanceWithRewardsOf(address account) public view returns (uint256) {
        uint256 shares = balanceOf[account];
        return multiplyAndDivide(shares, 1e18, ratio);
    }

    // --- Aministration ---
    function replenish(uint wad) public auth update {
        startTime = block.timestamp;
        endTime = block.timestamp + spread;

        VatLike(vat).move(vow, address(this),wad * 1e27);
        UsbJoinLike(usbJoin).exit(address(this), wad);
    } 
    function cage() external auth {
        live = 0;
        emit Cage();
    }

    // --- User ---
    function join(uint256 amount) public {
        require(live == 1, "Jar/not-live");
        require(flag[msg.sender] == 0, "Jar/not-redeemed");
        require(block.timestamp >= startTime, "Jar/not-started");
        require(block.timestamp < endTime, "Jar/finished");

        uint bal = amount * ratio;
        balanceOf[msg.sender] += bal;
        totalSupply += bal;
        unstakeTime[msg.sender] = 0;

        emit Join(msg.sender, bal);
    }
    function exit() public {
        require(live == 1, "Jar/not-live");
        require(balanceOf[msg.sender] > 0, "Jar/no-balance");
        require(flag[msg.sender] == 0, "Jar/not-redeemed");

        uint bal = balanceOf[msg.sender] / ratio;
        redeemables[msg.sender] += bal;
        totalSupply -= balanceOf[msg.sender];
        balanceOf[msg.sender] = 0;
        unstakeTime[msg.sender] = block.timestamp + exitDelay;
        flag[msg.sender] = 1;

        emit Exit(msg.sender, bal);
    }
    function redeem() internal {
        require(live == 1, "Jar/not-live");
        require(flag[msg.sender] == 1, "Jar/not-exit");
        require(unstakeTime[msg.sender] != 0, "Jar/not-unstaked");
        require(block.timestamp >= unstakeTime[msg.sender], "Jar/time-not-reached");

        uint bal = redeemables[msg.sender];
        redeemables[msg.sender] = 0;
        flag[msg.sender] = 0;

        DSTokenLike(USB).transfer(msg.sender, bal);
        emit Redeem(msg.sender, bal);
    }
}