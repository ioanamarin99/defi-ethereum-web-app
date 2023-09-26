import React from "react";
import { useContext,useEffect} from "react";
import { BlockchainContext } from "../context/BlockchainContext";

import {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText
} from 'mdb-react-ui-kit';

export default function AccounntInfo() {

    useEffect(() =>{
        accountChanged()
    },[]);
    

    const { currentAccount, userBalance, userTransactionCount,accountChanged} = useContext(BlockchainContext);
    return (
        <div className="container">
        <MDBCard className="custom-card">
        <MDBCardBody className="card-content">
            <MDBCardTitle className="modern-card-title">Account info</MDBCardTitle>
           
                <MDBCardText className="modern-card-body-elem">Address: {currentAccount}</MDBCardText>
                <MDBCardText className="modern-card-body-elem">Wallet Amount: {userBalance} ETH</MDBCardText>
                <MDBCardText className="modern-card-body-elem">Transaction count: {userTransactionCount}</MDBCardText>
           </MDBCardBody>
        </MDBCard>
        </div>
    );
}