//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

contract CollateralizedBorrowing {
    mapping(address => uint256) public collateral;
    mapping(address => uint256) public debt;
    uint256 public collateralRatio;
    
    event DepositCollateral(address indexed borrower, uint256 amount);
    event WithdrawCollateral(address indexed borrower, uint256 amount);
    event Borrow(address indexed borrower, uint256 amount);
    event Repay(address indexed borrower, uint256 amount);
    
    constructor(uint256 _collateralRatio) {
        require(_collateralRatio > 0, "Collateral ratio must be greater than 0");
        collateralRatio = _collateralRatio;
    }
    
    function depositCollateral(uint256 amount) external payable {
        require(amount > 0, "Collateral amount must be greater than 0");
        collateral[msg.sender] += amount;
        emit DepositCollateral(msg.sender, amount);
    }
    
    function withdrawCollateral(uint256 amount) external {
        require(amount > 0, "Withdrawal amount must be greater than 0");
        require(amount <= collateral[msg.sender], "Insufficient collateral");
        collateral[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
        emit WithdrawCollateral(msg.sender, amount);
    }
    
    function borrow(uint256 amount) external {
        require(amount > 0, "Borrow amount must be greater than 0");
        require(collateral[msg.sender] >= (amount * collateralRatio)/100, "Insufficient collateral");
        debt[msg.sender] += amount;
        payable(msg.sender).transfer(amount);
        emit Borrow(msg.sender, amount);
    }
    
    function repay(uint256 amount) external payable {
        require(amount > 0, "Repay amount must be greater than 0");
        require(amount <= debt[msg.sender], "Cannot repay more than the debt");
        debt[msg.sender] -= amount;
        if (msg.value > 0) {
            require(msg.value == amount, "Sent ETH must match the repayment amount");
        } else {
            require(amount <= address(this).balance, "Insufficient contract balance");
        }
        emit Repay(msg.sender, amount);
    }
    
    function getCollateralBalance() external view returns (uint256) {
        return collateral[msg.sender];
    }
    
    function getDebt() external view returns (uint256) {
        return debt[msg.sender];
    }

    receive() external payable {}
}