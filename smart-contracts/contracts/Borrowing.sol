//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

import {IERC20} from "../node_modules/@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol";
import {Pool} from "../node_modules/@aave/core-v3/contracts/protocol/pool/Pool.sol";
import {IPool} from "../node_modules/@aave/core-v3/contracts/interfaces/IPool.sol";

contract Borrowing{

    address payable owner;
    address private immutable lendingPoolAddress = 0xE7EC1B0015eb2ADEedb1B7f9F1Ce82F9DAD6dF08;

    IPool constant lendingPool = IPool(address(0xE7EC1B0015eb2ADEedb1B7f9F1Ce82F9DAD6dF08));

    
    constructor (){
        owner = payable(msg.sender);
    }

    modifier onlyOwner() {
        require( msg.sender == owner,"Only the contract owner can call this function!");
        _;
    }

    function approval(uint256 _amount, address _tokenAddress) external returns (bool) {
        IERC20 token = IERC20(_tokenAddress);
        return token.approve(lendingPoolAddress, _amount);
    }

    function allowance(address _tokenAddress) external view returns (uint256) {
        IERC20 token = IERC20(_tokenAddress);
        return token.allowance(address(this), lendingPoolAddress);
    }

    function getContractBalance(address _tokenAddress) external view returns (uint256) {
        return IERC20(_tokenAddress).balanceOf(address(this));
    }

    function getUserBalance(address _tokenAddress) external view returns (uint256) {
        return IERC20(_tokenAddress).balanceOf(owner);
    }

    function depositCollateral(address _tokenAddress, uint256 _amount) public onlyOwner{
        uint16 referral_code = 0;
        lendingPool.supply(_tokenAddress, _amount, msg.sender, referral_code);
        //bool useAsCollateral = true;
        //lendingPool.setUserUseReserveAsCollateral(_tokenAddress,useAsCollateral);
    }

    function setCollateral(address _tokenAddress) public onlyOwner{
        bool useAsCollateral = true;
        lendingPool.setUserUseReserveAsCollateral(_tokenAddress,useAsCollateral);

    }
    function borrow(address _tokenAddress) public onlyOwner{
        uint256 _amount = 1 * 1e18;
        uint256 interestRateMode = 2;
        uint16 referralCode = 0;
        lendingPool.borrow(_tokenAddress, _amount, interestRateMode, referralCode, owner);
    }

    function repayLoan(address _tokenAddress, uint256 _amount) public onlyOwner{
        uint256 interestRateMode = 2;
        lendingPool.repay(_tokenAddress, _amount, interestRateMode, owner);
    }

    function withdrawCollateral(address _tokenAddress, address _aTokenAddress) public onlyOwner{
        uint256 tokenBalance = IERC20(_aTokenAddress).balanceOf(address(this));
        lendingPool.withdraw(_tokenAddress, tokenBalance, owner);
    }

    function getUserData(address userAddress) external view onlyOwner returns(uint256,uint256,uint256,uint256,uint256,uint256){
      uint256 totalCollateralBase;
      uint256 totalDebtBase;
      uint256 availableBorrowsBase;
      uint256 currentLiquidationThreshold;
      uint256 ltv;
      uint256 healthFactor;

      (totalCollateralBase, totalDebtBase, availableBorrowsBase, currentLiquidationThreshold, ltv, healthFactor) = lendingPool.getUserAccountData(userAddress);
        return (totalCollateralBase, totalDebtBase, availableBorrowsBase, currentLiquidationThreshold, ltv, healthFactor);
    }

    receive() external payable {}
}
