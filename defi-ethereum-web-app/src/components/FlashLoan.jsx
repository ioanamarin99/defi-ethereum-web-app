import React, { useEffect } from "react";
import { useContext, useState } from "react";
import { BlockchainContext } from "../context/BlockchainContext";
import {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBInput
} from 'mdb-react-ui-kit';
import TextField from '@mui/material/TextField';


export default function FlashLoan() {

    const { requestAaveFlashLoan, getFlashLoanContractTokenBalance, flashLoanTokenBalance,accountChanged} = useContext(BlockchainContext);

    const [requestedAmount, setRequestedAmount] = useState('');

    const handleRequestedAmountChange = (event) => {
        const { value } = event.target;
        setRequestedAmount(value);
    }

    useEffect(() => {
        accountChanged();getFlashLoanContractTokenBalance();
    });

    return (
        //     <div>
        //     <h3>Flash Loan: Request flash loan using Aave Protocol</h3>
        //  <div className="flashloanForm">
        //     <div>
        //         Current amount: {flashLoanTokenBalance} USDC
        //     </div>
        //         <input placeholder="amount" type="text" name="amount" value={requestedAmount} onChange={handleRequestedAmountChange}></input>
        //     </div>

        //     <button onClick={() =>requestAaveFlashLoan(requestedAmount)}>Request flash loan</button> 
        //     </div>

        <div className="container">
            <MDBCard className="custom-card">
                <MDBCardBody className="card-content">
                    <MDBCardTitle className="modern-card-title">Request flash loan using Aave Protocol</MDBCardTitle>

                    <div className="div-other-info">
                        Current amount: {flashLoanTokenBalance} USDC
                    </div>
                    <TextField InputLabelProps={{ style: { color: '#fff' } }} id="amount" name="amount" label="amount" variant="outlined"
                        value={requestedAmount} onChange={handleRequestedAmountChange} className="modern-card-input" sx={{ marginBottom: 2 }} />

                    <button className="property__buy" onClick={() =>requestAaveFlashLoan(requestedAmount)}>Request flash loan</button>
                </MDBCardBody>
            </MDBCard>
        </div>
    );
}