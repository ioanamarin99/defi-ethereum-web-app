//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract RealEstate is ERC721URIStorage{

using Counters  for Counters.Counter;
Counters.Counter private _tokenIds;

constructor() ERC721("RealEstate", "REAL"){}

function mint(string memory tokenURI) public returns(uint256){

    uint256 randomId = uint256(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender)));
    randomId = randomId % (10 ** 15); // limit the maximum token ID to 15 digits
    _tokenIds.increment();

    _mint(msg.sender, randomId);
    _setTokenURI(randomId, tokenURI);

    return randomId;
}

function totalSupply() public view returns (uint256){
    return _tokenIds.current();
}
}