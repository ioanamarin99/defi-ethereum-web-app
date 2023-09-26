//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

import {IERC20} from "../node_modules/@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol";
import {Pool} from "../node_modules/@aave/core-v3/contracts/protocol/pool/Pool.sol";
import {IPool} from "../node_modules/@aave/core-v3/contracts/interfaces/IPool.sol";

contract SimpleLending{

    address payable owner;
    address private immutable lendingPoolAddress = 0xE7EC1B0015eb2ADEedb1B7f9F1Ce82F9DAD6dF08;

    IPool constant lendingPool = IPool(address(0xE7EC1B0015eb2ADEedb1B7f9F1Ce82F9DAD6dF08));

    constructor (){
        owner = payable(msg.sender);
    }

    function approval(uint256 _amount, address _tokenAddress) external returns (bool) {
        IERC20 token = IERC20(_tokenAddress);
        return token.approve(lendingPoolAddress, _amount);
    }

    function allowance(address _tokenAddress) external view returns (uint256) {
        IERC20 token = IERC20(_tokenAddress);
        return token.allowance(address(this), lendingPoolAddress);
    }

    function getBalance(address _tokenAddress) external view returns (uint256) {
        return IERC20(_tokenAddress).balanceOf(address(this));
    }

    function withdraw(address _tokenAddress, uint256 _amount) payable public onlyOwner(){
        uint256 result = lendingPool.withdraw(_tokenAddress, _amount, msg.sender);
    }

    modifier onlyOwner() {
        require( msg.sender == owner,"Only the contract owner can call this function");
        _;
    }

    function deposit(uint256 _amount, address _tokenAddress) public{
        uint16 referral_code = 0;
        lendingPool.supply(_tokenAddress, _amount, msg.sender, referral_code);
    }

    receive() external payable {}
}


 