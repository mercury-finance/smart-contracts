// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/utils/Address.sol";

contract HelioToken is ERC20 {

    event Start();
    event Stop();

    bool public  stopped;

    address public helioRewards;
    address public owner;

    modifier stoppable {
        require(!stopped, "helio-is-stopped");
        _;
    }

    modifier auth {
        require(msg.sender == helioRewards || msg.sender == owner, "Forbidden");
        _;
    }

    constructor(address helioRewards_) ERC20("Helio Reward token", "HELIO"){
        helioRewards = helioRewards_;
        owner = msg.sender;
    }

    function mint(address _to, uint256 _amount) external auth stoppable returns(bool) {
        _mint(_to, _amount);
        return true;
    }

    function burn(uint256 _amount) external auth stoppable returns(bool) {
        _burn(msg.sender, _amount);
        return true;
    }

    function stop() public auth {
        stopped = true;
        emit Stop();
    }

    function start() public auth {
        stopped = false;
        emit Start();
    }
}
