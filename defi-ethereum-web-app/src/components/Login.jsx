import React from "react";
//import * as React from 'react';
import { useContext,useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { BlockchainContext } from "../context/BlockchainContext";
import img from '../assets/b.png'

import {
    MDBCard,
    MDBCardBody,
    MDBCardTitle,
    MDBCardText,
    MDBCardImage,
    MDBBtn,
    MDBRipple
} from 'mdb-react-ui-kit';

export default function App() {

    const {handleWalletConnection,accountChanged,currentAccount,isAuthenticated} = useContext(BlockchainContext);
    const navigate = useNavigate();  

    const login = () => {
      navigate('/accountInfo');
    }

    useEffect(() =>{
     accountChanged()
  },[]);

    return(
        <div className="container">
        <MDBCard className="custom-card">
    <MDBCardBody className="card-content">
        <MDBCardImage className = "img-eth" src={img}></MDBCardImage>
      <MDBCardBody>
      </MDBCardBody>
      <button className="property__buy" onClick={() => {handleWalletConnection(); navigate('/accountInfo')}}>
                 { currentAccount? "Connected!" : "Authenticate" }  </button>
                 </MDBCardBody>
    </MDBCard>
    </div>
  );
}
