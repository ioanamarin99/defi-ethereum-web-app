import React, { useEffect } from "react";
import { useContext, useState } from "react";
import { ethers, formatEther, parseEther } from "ethers";
import { BlockchainContext } from "../context/BlockchainContext";
import {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBInput
} from 'mdb-react-ui-kit';
import TextField from '@mui/material/TextField';
import {simpleLendingContractABI, simpleLendingContractAddress,DAItokenContractAddress,aDAItokenContractAddress,aDAITokenContractABI,lendingContractAddress,lendingContractABI} from '../utils/constants.js';
import { Alert } from "@mui/material";

export default function Lending() {

    const {formatAmount,parseAmount,getTokenAddress,loadContract,currentAccount,accountChanged} = useContext(BlockchainContext);
    const [formData, setFormData] = useState({lentAmount:"", withdrawnAmount:""});

    const [balance, setBalance] = useState('');
    const [interestRate, setInterestRate] = useState('');

    const [lentAmount, setLentAmount] = useState('');

    const handleLentAmountChange = (event) => {
        const { value } = event.target;
        setLentAmount(value);
    }

    const handleChangeInForms = (event) =>{
        const { name, value } = event.target;
        setFormData({...formData, [name]:value});

       }

   const resetForms = (name) => {
        setFormData({...formData, [name]:""});
   }

    // const getBalance = async() =>{

    //     try{
    //         const lendingContract = await loadContract(simpleLendingContractAddress, simpleLendingContractABI);
            
    //         if(lendingContract){
 
    //          const _DAIbalance = await lendingContract.getBalance(DAItokenContractAddress);
    //          const formattedDAIbalance = formatAmount(_DAIbalance,'DAI');
    //          setDAIBalance(formattedDAIbalance);
 
    //          const aDAIContract = await loadContract(aDAItokenContractAddress, aDAITokenContractABI);
    //          const _ADAIbalance = await aDAIContract.balanceOf(currentAccount);
    //          const formattedADAIbalance = formatAmount(_ADAIbalance,'aDAI');
    //          console.log("adai" + aDAIbalance);
    //          setADAIbalance(formattedADAIbalance);
 
    //         }
 
    //      } catch(error){
    //          console.log(error);
    //      }
    // }
    const getBalance = async() =>{

        try{
            const lendingContract = await loadContract(lendingContractAddress, lendingContractABI);
            
            if(lendingContract){
 
             const balance = await lendingContract.getBalance();
             const formattedBalance = formatEther(balance);
             setBalance(formattedBalance);
             console.log("formatted b" + formattedBalance);
 
             const interestRate = await lendingContract.getInterestRate();
             setInterestRate(interestRate.toString());
             console.log("interest rate" + interestRate.toString());
 
            }
 
         } catch(error){
             console.log(error);
         }
    }

    const aaveTokenLending = async(lentAmount, tokenSymbol) => {

        try{
            if(!lentAmount){
                return alert("Please select an amount!");
            }
           const simpleLendingContract = await loadContract(simpleLendingContractAddress, simpleLendingContractABI);
           
           if(simpleLendingContract){

            const parsedLentAmount = parseAmount(lentAmount, tokenSymbol);
            const tokenAddress = getTokenAddress(tokenSymbol);

            let tx = await simpleLendingContract.approval(parsedLentAmount,tokenAddress);
            tx.wait().then(async() => {
                tx = await simpleLendingContract.deposit(parsedLentAmount, tokenAddress);
                tx.wait().then(async() =>{
                    getBalance();
                });
            });

           }

        } catch(error){
            console.log(error);
        }
    }

    // const withdrawDeposits = async(withdrawnAmount, tokenSymbol) => {

    //     try{
    //         if(!withdrawnAmount){
    //             return alert("Please select an amount!");
    //         }
    //        const simpleLendingContract = await loadContract(simpleLendingContractAddress, simpleLendingContractABI);
           
    //        if(simpleLendingContract){

    //         const parsedWithdrawnAmount = parseAmount(withdrawnAmount, tokenSymbol);
    //         const tokenAddress = getTokenAddress(tokenSymbol);

    //         let tx = await simpleLendingContract.withdraw(tokenAddress,parsedWithdrawnAmount);
    //         tx.wait().then(async() => {
    //                 getBalance();
    //         });
    //        }
    //     } catch(error){
    //         console.log(error);
    //     }
    // }
    const lending = async(lentAmount) => {

        try{
            const lendingContract = await loadContract(lendingContractAddress, lendingContractABI);
            
            if(lendingContract){
                const parsedLentAmount = parseEther(lentAmount);
                let tx = await lendingContract.deposit(parsedLentAmount);
                tx.wait().then(async() => {
                    getBalance();
                });
            }
 
         } catch(error){
             console.log(error);
             alert(error.reason);
         } 
    }
    const withdrawDeposits = async(amount) => {
        try{
            const lendingContract = await loadContract(lendingContractAddress, lendingContractABI);
            
            if(lendingContract){
                const parsedAmount = parseEther(amount);
                let tx = await lendingContract.withdraw(parsedAmount);
                tx.wait().then(async() => {
                    getBalance();
                });
            }
 
         } catch(error){
             console.log("ERROr" + error);
             alert(error.reason);
         } 
    }
   
    useEffect(() => {
        accountChanged(); getBalance();
    });

    return (
     
        <div className="container">
            <MDBCard className="custom-card">
                <MDBCardBody className="card-content">
                    <MDBCardTitle className="modern-card-title">Token lending</MDBCardTitle>
                    {/* <h className="title-header">Lend tokens using Aave Protocol and earn interest-tokens</h> */}
                     <div className="div-other-info">
                        Current deposits: {balance} ETH
                    </div> 
                    <div className="div-other-info">  Interest rate: {interestRate} %</div>

                    <TextField InputLabelProps={{ style: { color: '#fff' } }} id="amount" name="lentAmount" label="amount" variant="outlined"
                        value={formData.lentAmount} onChange={handleChangeInForms} className="modern-card-input" sx={{ marginBottom: 2 }} />
                    <button className="property__buy" onClick={() => {lending(formData.lentAmount); resetForms('lentAmount')}}>Approve&Lend</button>

                    <TextField InputLabelProps={{ style: { color: '#fff' } }} id="amount" name="withdrawnAmount" label="amount" variant="outlined"
                        value={formData.withdrawnAmount} onChange={handleChangeInForms} className="modern-card-input" sx={{ marginBottom: 2 }} />
                    <button className="property__buy" onClick={() => { withdrawDeposits(formData.withdrawnAmount); resetForms('withdrawnAmount')}}>Withdraw</button>
                </MDBCardBody>
            </MDBCard>
        </div>

    );
}