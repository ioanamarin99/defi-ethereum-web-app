import React, { useEffect } from "react";
import { useContext, useState } from "react";
import { BlockchainContext } from "../context/BlockchainContext";
import { ethers, formatEther, parseEther } from 'ethers';
import { borrowingContractABI, borrowingContractAddress, DAItokenContractAddress, aDAItokenContractAddress } from '../utils/constants.js';
import {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBInput
} from 'mdb-react-ui-kit';
import TextField from '@mui/material/TextField';

export default function Borrowing() {

    const { loadContract, parseAmount, getTokenAddress, formatAmount, currentAccount,accountChanged } = useContext(BlockchainContext);

    const [formData, setFormData] = useState({collateral:"", borrowedAmount:"", loan:"", withdrawnCollateral: ""});

    const [displayDebt, setDisplayDebt] = useState();
    const [displayCollateral, setDisplayCollateral] = useState();


    const handleChangeInForms = (event) =>{
         const { name, value } = event.target;
         setFormData({...formData, [name]:value});
 
        }

    const resetForms = (name) => {
         setFormData({...formData, [name]:""});
    }

    const getUserData = async () => {
        try {
            const borrowingContract = await loadContract(borrowingContractAddress, borrowingContractABI);

            if (borrowingContract) {

                const debt = await borrowingContract.getDebt();
                const formattedDebt = formatEther(debt);

                const collateral = await borrowingContract.getCollateralBalance();
                const formattedCollateral = formatEther(collateral);
            
                setDisplayDebt(formattedDebt);
                setDisplayCollateral(formattedCollateral);
            }

        } catch (error) {
            console.log(error);
        }
    }

    
    const depositCollateral = async () => {

        try {
            const borrowingContract = await loadContract(borrowingContractAddress, borrowingContractABI);
            if (borrowingContract) {

                const parsedCollateral = parseEther(formData.collateral);

                let tx = await borrowingContract.depositCollateral(parsedCollateral);
                tx.wait().then(async() => {
                    getUserData()
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    const borrow = async () => {

        try {
            const borrowingContract = await loadContract(borrowingContractAddress, borrowingContractABI);
            if (borrowingContract) {

                const parsedBorrowedAmount = parseEther(formData.borrowedAmount);

                let tx = await borrowingContract.borrow(parsedBorrowedAmount);
                tx.wait().then(async() => {
                    getUserData();
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    const repayLoan = async () => {

        try {
            const borrowingContract = await loadContract(borrowingContractAddress, borrowingContractABI);
            if (borrowingContract) {

                const parsedLoan = parseEther(formData.loan);

                let tx = await borrowingContract.repay(parsedLoan);
                tx.wait().then(async() => {
                    getUserData();
                });

            }
        } catch (error) {
            console.log(error)
        }
    }

    const withdrawCollateral = async () => {

        try {
            const borrowingContract = await loadContract(borrowingContractAddress, borrowingContractABI);
            if (borrowingContract) {

                const parsedCollateral = parseEther(formData.withdrawnCollateral);

                let tx = await borrowingContract.withdrawCollateral(parsedCollateral);
                tx.wait().then(async() => {
                    getUserData();
                });
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        accountChanged();getUserData()
    }, [displayCollateral]);

    return (
   
        <div>
        <h3 className="centered-h-custom">Current debt: {displayDebt} ETH</h3>
        <h3 className="centered-h-custom">Available collateral: {displayCollateral} ETH</h3>
        <h3 className="centered-h-custom">Collateral ratio: 50%</h3>
        <div className="container">
            <div className="card-container">
                <MDBCard className="custom-card2">
                    <MDBCardBody className="card-content">
                        <MDBCardTitle className="modern-card-title">Borrow ETH</MDBCardTitle>

                        <TextField InputLabelProps={{ style: { color: '#fff' } }} id="amount" name="collateral" label="amount" variant="outlined"
                            className="modern-card-input" sx={{ marginBottom: 2 }} value={formData.collateral} onChange={handleChangeInForms}/>
                        <button className="property__buy" onClick={() => {depositCollateral(); resetForms('collateral')}}>Deposit collateral</button>

                        <TextField InputLabelProps={{ style: { color: '#fff' } }} id="loan" name="borrowedAmount" label="amount" variant="outlined"
                            value={formData.borrowedAmount} onChange={handleChangeInForms} className="modern-card-input" sx={{ marginBottom: 2 }} />
                        <button className="property__buy" onClick={() => {borrow(); resetForms('borrowedAmount')}}>Borrow</button>
                    </MDBCardBody>
                </MDBCard>


                <MDBCard className="custom-card2">
                    <MDBCardBody className="card-content">
                    <MDBCardTitle className="modern-card-title">Loan repayment</MDBCardTitle>
                        <TextField InputLabelProps={{ style: { color: '#fff' } }} id="loanPayment" name="loan" label="amount" variant="outlined"
                            value={formData.loan} onChange={handleChangeInForms} className="modern-card-input" sx={{ marginBottom: 2 }} />
                        <button className="property__buy" onClick={() => {repayLoan();resetForms('loan')}}>Pay loan</button>

                        <TextField InputLabelProps={{ style: { color: '#fff' } }} id="loanPayment" name="withdrawnCollateral" label="amount" variant="outlined"
                            value={formData.withdrawnCollateral} onChange={handleChangeInForms} className="modern-card-input" sx={{ marginBottom: 2 }} />
                        <button className="property__buy" onClick={() => { withdrawCollateral();resetForms('withdrawnCollateral')}}>Withdraw collateral</button>
                    </MDBCardBody>
                </MDBCard>

            </div>
        </div>
        </div>
    );
}