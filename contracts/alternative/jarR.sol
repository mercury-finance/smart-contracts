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
    uint public exitDelay;  // User unstake delay   [sec]

    uint256 public ratio;
    address public USB;

    mapping(address => uint) public redeemables;  // Capital + Rewards
    mapping(address => uint) public unstakeTime;  // Time of Unstake

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
        wards[msg.sender] = 1;
        live = 1;

        USB = _USB;
        name = _name;
        symbol = _symbol;

        vat = _vat;
        vow = _vow;
        usbJoin = _usbJoin;
        VatLike(vat).hope(usbJoin);

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
        
        VatLike(vat).move(vow, address(this),wad * 1e27);
        UsbJoinLike(usbJoin).exit(address(this), wad);
    } 
    function cage() external auth {
        live = 0;
        emit Cage();
    }

    // --- User ---
    function join(uint256 wad) public { // amount in USBs
        require(live == 1, "Jar/not-live");

        uint bal = (wad * ratio) / 1e18; // hUSBs
        balanceOf[msg.sender] += bal;
        totalSupply += bal;

        DSTokenLike(USB).transferFrom(msg.sender, address(this), wad);
        emit Join(msg.sender, bal);
    }
    function exit(uint256 wad) public { // amount in hUSBs
        require(live == 1, "Jar/not-live");

        uint bal = (wad * 1e18) / ratio; // USBs
        balanceOf[msg.sender] -= wad;
        totalSupply -= wad;
        redeemables[msg.sender] += bal;  // USBs
        unstakeTime[msg.sender] = block.timestamp + exitDelay;

        emit Exit(msg.sender, bal);
    }
    function redeem() internal {
        require(live == 1, "Jar/not-live");
        require(block.timestamp >= unstakeTime[msg.sender], "Jar/time-not-reached");

        uint bal = redeemables[msg.sender];
        redeemables[msg.sender] = 0;

        DSTokenLike(USB).transfer(msg.sender, bal);
        emit Redeem(msg.sender, bal);
    }
}