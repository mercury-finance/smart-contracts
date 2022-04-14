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

/*
   "Put rewards in the jar and close it".
   This contract lets you deposit USBs from usb.sol and earn
   USB rewards. The USB rewards are deposited into this contract
   and distributed over a timeline. Users can claim rewards anytime
   but initial deposit follows the lock time.
*/

interface VatLike {
    function move(address,address,uint256) external;
}

contract Jar {
    // --- Auth ---
    mapping (address => uint) public wards;
    function rely(address guy) external auth { wards[guy] = 1; }
    function deny(address guy) external auth { wards[guy] = 0; }
    modifier auth {
        require(wards[msg.sender] == 1, "Jar/not-authorized");
        _;
    }

    // --- Data ---
    struct Plate {
        uint rate;    // Food per second        [wad]
        uint start;   // Start of distribution  [sec]
        uint end;     // End of distribution    [sec]
        uint check;   // Last reward time       [sec]
        uint fps;     // Food Per Share         [ray]
        uint Pile;    // Total join deposits    [wad]
    }
    struct Person {
        uint pile;   // Join Deposit       [wad]
        uint ate;    // Claimed Rewards    [wad]
        uint spoon;  // Claimable Rewards  [wad]
    }

    mapping (uint => Plate) public plates;
    mapping (uint => mapping (address => Person)) public people;

    uint public current;  // Plate eaten from
    uint public Eaten;    // Total claimed rewards  [wad]
    
    VatLike public vat;  // CDP Engine
    address public vow;  // Vow Surplus

    uint public live;  // Active Flag

    // --- Init ---
    constructor(address vat_, address vow_) {
        wards[msg.sender] = 1;
        vat = VatLike(vat_);
        vow = vow_;
        live = 1;
    }

    // --- Math ---
    uint256 constant ONE = 10 ** 27;
    
    function _rmul(uint x, uint y) internal pure returns (uint z) {
        unchecked {
            z = _mul(x, y) / ONE;
        }
    }
    function _add(uint x, uint y) internal pure returns (uint z) {
        unchecked {
            require((z = x + y) >= x);
        }
    }
    function _sub(uint x, uint y) internal pure returns (uint z) {
        unchecked {
            require((z = x - y) <= x);
        }
    }
    function _mul(uint x, uint y) internal pure returns (uint z) {
        unchecked {
            require(y == 0 || (z = x * y) / y == x);
        }
    }

    // --- Administration ---
    function file(bytes32 what, uint256 wad, uint256 start, uint256 end) external auth {
        require(live == 1, "Jar/not-live");    
        require(start < end, "Jar/wrong-interval");
        if (what == "plate") {
            current++;
            Plate memory plate = plates[current];
            plate.rate = wad / _sub(end, start);
            plate.start = start;
            plate.end = end; 
            plate.check = start;
            plates[current] = plate;
        } else revert("Jar/file-unrecognized-param");
        vat.move(vow, address(this), _mul(wad, ONE));
    }
    function cage() external auth {
        live = 0;
    }

    // --- Usb Farming ---
    function updatePlate(uint plate_) internal {
        Plate storage plate = plates[plate_];
        uint timestamp = block.timestamp;
        if (timestamp >= plate.end) timestamp = plate.end;
        if (timestamp <= plate.check) return;
        if (plate.Pile <= 0) { plate.check = timestamp; return;}

        uint cookedFood = _mul(_sub(timestamp, plate.check), plate.rate); 

        plate.fps = _add(plate.fps, _mul(cookedFood, ONE) / plate.Pile);
        plate.check = timestamp;
    }
    function join(uint wad) external {
        // system is live
        require(live == 1, "Jar/not-live");    

        Plate storage plate = plates[current];
        Person storage person = people[current][msg.sender];

        updatePlate(current);
        uint spoon = _sub(_rmul(person.pile, plate.fps), person.ate);
        person.spoon = _add(person.spoon, spoon);

        plate.Pile = _add(plate.Pile, wad);
        person.pile = _add(person.pile, wad);
        person.ate = _rmul(person.pile, plate.fps);

        vat.move(msg.sender, address(this), _mul(wad, ONE));
    }
    function exit(uint plate_, uint wad) external {
        // system is live
        require(live == 1, "Jar/not-live");    

        Plate storage plate = plates[plate_];
        Person storage person = people[plate_][msg.sender];

        // respect withdraw lock period
        if (wad != 0) require(block.timestamp >= plate.end, "Jar/plate-not-ended");
        require(person.pile >= wad, "Jar/insufficient-balance");

        updatePlate(plate_);
        uint spoon = _sub(_rmul(person.pile, plate.fps), person.ate);
        spoon = _add(person.spoon, spoon);
        Eaten = _add(Eaten, spoon);
        delete person.spoon;
        vat.move(address(this), msg.sender, _mul(spoon, ONE));

        plate.Pile = _sub(plate.Pile, wad);
        person.pile = _sub(person.pile, wad);
        person.ate = _rmul(person.pile, plate.fps);

        vat.move(address(this), msg.sender, _mul(wad, ONE));
    }
}