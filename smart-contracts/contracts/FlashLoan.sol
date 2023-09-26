//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

import {FlashLoanSimpleReceiverBase} from '../node_modules/@aave/core-v3/contracts/flashloan/base/FlashLoanSimpleReceiverBase.sol';
import {IPoolAddressesProvider} from "../node_modules/@aave/core-v3/contracts/interfaces/IPoolAddressesProvider.sol";
import {IERC20} from "../node_modules/@aave/core-v3/contracts/dependencies/openzeppelin/contracts/IERC20.sol";

contract FlashLoan is FlashLoanSimpleReceiverBase{
    address payable owner;

    error NotEnoughFunds();

    constructor(address _poolAddress) 
    FlashLoanSimpleReceiverBase(IPoolAddressesProvider(_poolAddress))
    {
        owner = payable(msg.sender);
    }

    function executeOperation(
    address asset,
    uint256 amount,
    uint256 premium,
    address initiator,
    bytes calldata params
  ) external override returns (bool){
    // custom logic with borrowed funds

    uint256 owedAmount = amount + premium;
    IERC20 token = IERC20(asset);
    if(token.balanceOf(address(this)) < owedAmount) revert NotEnoughFunds();
    
    token.approve(address(POOL), owedAmount);

    return true;
  }

  function requestFlashLoan(address _token, uint256 _amount) public{

    address receiverAddress =  address(this);
    address asset = _token;
    uint256 amount = _amount;
    bytes memory params = "";
    uint16 referralCode = 0;

    POOL.flashLoanSimple(receiverAddress, asset, amount, params, referralCode);
  }

  function getBalance(address _tokenAddress) external view returns (uint256) {
        return IERC20(_tokenAddress).balanceOf(address(this));
  }

  function withdraw(address _tokenAddress) external onlyOwner{
    IERC20 token = IERC20(_tokenAddress);
    token.transfer(msg.sender, token.balanceOf(address(this)));
  }

  modifier onlyOwner(){
    require(msg.sender == owner, "Only the contract owner cand call this function");
    _;
  }

  receive() external payable{}
}