//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

interface IERC721 {
    function transferFrom(
        address _from,
        address _to,
        uint256 _id
    )external;
}

contract Escrow{

    address public nftAddress;
    address payable public seller;
    address payable public inspector;
    address public lender;

 
    mapping(uint256 => bool) public isListed; //key-value
    mapping(uint256 => uint256) public purchasePrice;
    mapping(uint256 => uint256) public escrowAmount;
    mapping(uint256 => uint256) public inspectionPrice;
    mapping(uint256 => address) public buyer;
    mapping(uint256 => bool) public inspectionPassed;
    mapping(uint256 => mapping(address => bool)) public approval;
    mapping(address => bool) public isPayed;

    modifier onlySeller() {
        require( msg.sender == seller,"Only the seller can call this function!");
        _;
    }

    modifier onlyBuyer(uint256 _nftId) {
        require( msg.sender == buyer[_nftId],"Only the buyer can call this function!");
        _;
    }

    modifier onlyInspector() {
        require( msg.sender == inspector,"Only the inspector can call this function!");
        _;
    }

    modifier onlyLender() {
        require( msg.sender == lender,"Only the lender can call this function!");
        _;
    }

    constructor(address _nftAddress, address payable _seller, address payable _inspector, address _lender){
        nftAddress = _nftAddress;
        seller = _seller;
        inspector = _inspector;
        lender = _lender;
    }

    function listProperty(uint256 _nftId, address _buyer, uint256 _purchasePrice, uint256 _escrowAmount, uint256 _inspectionPrice) public payable onlySeller{
        //Transfter NFT from seller to this contract
        IERC721(nftAddress).transferFrom(msg.sender, address(this), _nftId);
        isListed[_nftId] = true;
        purchasePrice[_nftId] = _purchasePrice;
        escrowAmount[_nftId] = _escrowAmount;
        inspectionPrice[_nftId] = _inspectionPrice;
        buyer[_nftId] = _buyer;

    }

    // Deposit earnest in the escrow to show good faith (only buyer)
    function depositEarnest(uint256 _nftId) public payable onlyBuyer(_nftId){
        require(msg.value >= escrowAmount[_nftId]);
    }

    // Property inspection => needs to be payed (only inspector)
    function propertyInspection(uint256 _nftId, bool _passed) public onlyInspector{
        inspectionPassed[_nftId] = _passed;  
    }

    // Rest of the amount payed by the lender (only lender)
    function finalizePayment(uint256 _nftId) public payable onlyLender{
        require(msg.value >= purchasePrice[_nftId] - escrowAmount[_nftId], "Insufficent amount to finalize the payment!");
    }

    function approveSale(uint256 _nftId) public{
        approval[_nftId][msg.sender] = true;
    }

    function getBalance() public view returns (uint256){
        return address(this).balance;
    }

    function paySeller() public{
        payable(seller).transfer(address(this).balance);
        isPayed[seller] = true;
    }

    //all conditions met => funds are sent to seller, buyer becomes the new owner of the property
    function finalizeSale(uint256 _nftId) public{
        require(inspectionPassed[_nftId], "Property inspection not passed!");
        require(approval[_nftId][lender]);
        require(approval[_nftId][buyer[_nftId]], "Buyer did not approve the sale!");
        require(approval[_nftId][seller], "Seller did not approve the sale!");
        require(address(this).balance >= purchasePrice[_nftId], "Not enough funds to pay the purchase price!");

        isListed[_nftId] = false;

        paySeller();
        require(isPayed[seller], "Seller has not been payed!");

        IERC721(nftAddress).transferFrom(address(this), buyer[_nftId], _nftId);
    }

    //in case the sale conditions are not met, refund to the buyer
    function cancelSale(uint256 _nftId) public{
        if(inspectionPassed[_nftId] == false || approval[_nftId][buyer[_nftId]] == false || approval[_nftId][seller] == false){
            payable(buyer[_nftId]).transfer(address(this).balance);
        }
    }

    receive() external payable{}

}