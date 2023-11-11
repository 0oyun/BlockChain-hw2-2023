// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract CarToken is ERC20, ERC20Permit {
    constructor() ERC20("Cartoken", "CT") ERC20Permit("Cartoken") {}

    function mint() public {
        uint256 r_amount = 10000;
        _mint(msg.sender, r_amount);
    }
}
