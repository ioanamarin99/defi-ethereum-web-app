
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

contract Lending {
    struct Account {
        uint256 balance;
        uint256 depositTimestamp;
    }

    mapping(address => Account) private accounts;
    uint256 private interestRate = 10; // 10% interest rate
	uint256 interestRatePerMonth = interestRate / 12;

    event Deposit(address indexed accountAddress, uint256 amount);
    event Withdraw(address indexed accountAddress, uint256 amount);

    function deposit(uint256 amount) external payable {
        require(amount > 0, "Amount must be greater than zero");
        Account storage account = accounts[msg.sender];
        account.balance += amount;
        account.depositTimestamp = block.timestamp;
        emit Deposit(msg.sender,amount);
    }

    function withdraw(uint256 amount) external {
        Account storage account = accounts[msg.sender];
        //require(account.balance >= amount, "Insufficient balance");
        //require(block.timestamp >= account.depositTimestamp + 1 days, "Funds locked for 24 hours");
		
		uint256 elapsedMonths = (block.timestamp - account.depositTimestamp) / 30 days;
		uint256 interestEarned = (account.balance * elapsedMonths * interestRatePerMonth) / 100;
		
		// Apply the interest to the withdrawal amount
		uint256 withdrawAmount = amount + interestEarned;

        account.balance -= amount;
        payable(msg.sender).transfer(withdrawAmount);
        emit Withdraw(msg.sender, withdrawAmount);
    }

    function getBalance() external view returns (uint256) {
        Account storage account = accounts[msg.sender];
        uint256 elapsedMonths = (block.timestamp - account.depositTimestamp) / 30 days;
		uint256 interestEarned = (account.balance * elapsedMonths * interestRatePerMonth) / 100;

        uint256 actualBalance = accounts[msg.sender].balance + interestEarned;
        return actualBalance;
    }

    function getInterestRate() external view returns (uint256) {
        return interestRate;
    }

    receive() external payable {}
}
