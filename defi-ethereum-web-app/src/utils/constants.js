import transactions from './Transactions.json';
import flashloan from './FlashLoan.json';
import simpleLending from './SimpleLending.json';
import lending from './Lending';
import borrowing from './Borrowing.json';
import realEstate from './RealEstate.json';
import escrow from './Escrow.json';
import AToken from './AToken.json';

export const transactionsContractABI = transactions.abi;
export const transactionsContractAddress = '0xc8A84F2b3e6A9a32156B36047eF6fB294fB3f9da';

export const flashloanContractABI = flashloan.abi;
export const flashloanContractAddress = '0x19bfac6072fcbE197149BAbEeb5fb08578C7Ca6e';

export const simpleLendingContractABI = simpleLending.abi;
export const simpleLendingContractAddress = '0x1cB4e18BFEb2e84DbbdbfD7f3f165998226B7ac6';


export const lendingContractABI = lending.abi;
//export const lendingContractAddress = '0x9F8f533e77A2b2026134Fd8E30A3C9a04ddfA2B3';
//export const lendingContractAddress = '0xfD6b413287B2def166a0FC2402b84fa33FE1C971';
export const lendingContractAddress = '0xeB8dcAE7cC6C08F6F9827b327f4a2A48684c6d4d';

export const borrowingContractABI = borrowing.abi;
export const borrowingContractAddress = '0x721a214228cC84490Cc91167eEf8A9ACebe61320';

export const realEstateContractABI = realEstate.abi;
export const realEstateContractAddress = '0xF730Eb7F4179256bBf43668E8dcDCF3EDa733A3A';

export const escrowContractABI = escrow.abi;
export const escrowContractAddress = '0xF10810BC421f8872C728df6b8A5872611AF0512C';

export const USDCtokenContractAddress = '0xda9d4f9b69ac6C22e444eD9aF0CfC043b7a7f53f';
export const DAItokenContractAddress = '0x68194a729C2450ad26072b3D33ADaCbcef39D574';

export const aDAITokenContractABI = AToken.abi;
export const aDAItokenContractAddress = '0x67550Df3290415611F6C140c81Cd770Ff1742cb9';

export const tokens = [{'symbol' : 'USDC', 'address': USDCtokenContractAddress, 'decimals': 6}, {'symbol' : 'DAI', 'address': DAItokenContractAddress, 'decimals': 18}, {'symbol' : 'aDAI', 'address': aDAItokenContractAddress, 'decimals': 18}];