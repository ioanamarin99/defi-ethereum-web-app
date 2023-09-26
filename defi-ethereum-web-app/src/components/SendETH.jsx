import React from "react";
import { useContext,useEffect } from "react";
import { BlockchainContext } from "../context/BlockchainContext";
import {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBInput
} from 'mdb-react-ui-kit';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

export default function SendETH() {

    const { transactionFormData, performTransaction, setTransactionFormData,handleChangeInTransactionForm,accountChanged} = useContext(BlockchainContext);

    const resetForms = () => {
        setTransactionFormData({...transactionFormData, ["addressTo"]:""});
        setTransactionFormData({...transactionFormData, ["amount"]:""});
        setTransactionFormData({...transactionFormData, ["description"]:""});
        setTransactionFormData({...transactionFormData, ["message"]:""}); 
   }

    useEffect(() =>{
        accountChanged()
    },[]);

    return (

        <div className="container">
            <MDBCard className="custom-card">
                <MDBCardBody className="card-content">
                    <MDBCardTitle className="modern-card-title">P2P Exchange: Send ETH</MDBCardTitle>

                    <TextField InputLabelProps={{style: { color: '#fff' }}} id="AddressTo" name="addressTo" label="Address to" variant="outlined" 
                    value={transactionFormData.addressTo} onChange={handleChangeInTransactionForm} className="modern-card-input" sx={{ marginBottom: 2 }}/>

                    <TextField InputLabelProps={{style: { color: '#fff' }}} id="Amount" name="amount" label="Amount" variant="outlined"
                     value={transactionFormData.amount} onChange={handleChangeInTransactionForm} className="modern-card-input" sx={{ marginBottom: 2 }}/>

                    <TextField InputLabelProps={{style: { color: '#fff' }}} id="Description" name="description" label="Description" variant="outlined" 
                    value={transactionFormData.description} onChange={handleChangeInTransactionForm}  className="modern-card-input" sx={{ marginBottom: 2}}/>

                    <TextField InputLabelProps={{style: { color: '#fff' }}} id="Message" name="message" label="Message" variant="outlined" 
                    value={transactionFormData.message} onChange={handleChangeInTransactionForm} className="modern-card-input" sx={{ marginBottom: 2 }}/>

                    <button className="property__buy" onClick={() => {performTransaction();resetForms()}}>Send</button>
                </MDBCardBody>
            </MDBCard>
        </div>
    );
} 