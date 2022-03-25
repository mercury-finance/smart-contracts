//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "../jug.sol";

contract BatchCaller is Ownable {

    address jug;
    constructor(address _jug) {
        jug = _jug;
    }
    function jugInitFile(bytes32 _gem, bytes32 _what, uint256 _rate) external onlyOwner {
        Jug(jug).init(_gem);
        Jug(jug).file(_gem, _what, _rate);
    }
}
