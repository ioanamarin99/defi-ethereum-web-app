import React, { useEffect } from "react";
import { useContext,useState } from "react";
import { BlockchainContext } from "../context/BlockchainContext";
import CircularProgress from '@mui/material/CircularProgress';

import Property from "./Property";


export default function RealEstate(){

const {loadProperties, properties, escrow, currentAccount,accountChanged,addTransactionsToBlockchain,loading} = useContext(BlockchainContext);

const [property, setProperty] = useState({});
const [toggle, setToggle] = useState(false);
const [owner, setOwner] = useState('');

const toggleProperty = (_property) =>{
    setProperty(_property);
    toggle ? setToggle(false) : setToggle(true);
}

const getPropertyOwner = async() =>{
        
  if(await escrow.isListed(property.id))
      return;
  
  const owner = await escrow.buyer(property.id);
  setOwner(owner);
}


useEffect(() =>{
    loadProperties(); accountChanged(); getPropertyOwner()
},[]);
   
    return(
      loading ? (<div style={{ display: "flex",justifyContent: "center", alignItems: "center" , paddingTop: "30px" }}>{<CircularProgress></CircularProgress>}</div>) :(
        <div>
        <h3 className="centered-h-custom">Real Estate - Property Sales</h3>

        <div className='cards__section'>

        <div className='cards'>
          {properties.map((property, index) => (
            <div className='card_reale' key={index} onClick={() => toggleProperty(property)}>
              <div className='card__image'>
                <img src={property.image} alt="Home" />
              </div>
              <div className='card__info'>
                <h4>{property.attributes[0].value} ETH</h4>
                <p>
                  <strong>{property.attributes[4].value}</strong> bds |
                  <strong>{property.attributes[5].value}</strong> ba |
                  <strong>{property.attributes[6].value}</strong> sqft
                </p>
                <p>{property.address}</p>
              </div>
            </div>
          ))}
        </div>
            {toggle && (<Property property={property} toggleProperty={toggleProperty} escrow={escrow} currentAccount={currentAccount}></Property>)}
      </div>
      </div>
      )
 );
}