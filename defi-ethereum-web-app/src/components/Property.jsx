import React, { useEffect } from "react";
import { useContext,useState } from "react";
import { ethers } from "ethers";
import { BlockchainContext } from "../context/BlockchainContext";

import close from '../assets/close.svg';

export default function Property({property,toggleProperty,escrow,currentAccount}){


    const [buyer, setBuyer] = useState('');
    const [seller, setSeller] = useState('');
    const [lender, setLender] = useState('');
    const [inspector, setInspector] = useState('');
    const [owner, setOwner] = useState('')

    const [hasBought, setHasBought] = useState(false);
    const [hasSold, setHasSold] = useState(false);
    const [hasLended, setHasLended] = useState(false);
    const [hasInspected, setHasInspected] = useState(false);

    const getDetails = async() =>{

        try{
        const buyer = await escrow.buyer(property.id);
        setBuyer(buyer);
        const hasBought = escrow.approval(property.id, buyer);
        setHasBought(hasBought);

        const seller = await escrow.seller();
        setSeller(seller);
        const hasSold = escrow.approval(property.id, seller);
        setHasSold(hasSold);

        const lender = await escrow.lender();
        setLender(lender);
        const hasLended = escrow.approval(property.id, lender);
        setHasLended(hasLended);

        const inspector = await escrow.inspector();
        setInspector(inspector);
        const hasInspected = escrow.inspectionPassed(property.id);
        setHasInspected(hasInspected);

        }catch(error){
            console.log(error);
        }
  
    }

    const getPropertyOwner = async() =>{
        
        if(await escrow.isListed(property.id))
            return;
        
        const owner = await escrow.buyer(property.id);
        setOwner(owner);
    
    }


    const buyHandler = async() => {

        try{
            const provider =  new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const escrowAmount = await escrow.escrowAmount(property.id);

            let transaction = await escrow.connect(signer).depositEarnest(property.id, {value: escrowAmount});
            await transaction.wait();

            transaction = await escrow.connect(signer).approveSale(property.id);
            await transaction.wait();

            setHasBought(true);

        }catch(error){
            console.log(error);
        }

    }

    const sellHandler = async() =>{
        try {
            const provider =  new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            let transaction = await escrow.connect(signer).approveSale(property.id);
            await transaction.wait();

            transaction = await escrow.connect(signer).finalizeSale(property.id);
            await transaction.wait();

            setHasSold(true);

        } catch (error) {
            console.log(error);
        }
    }

    const lendHandler = async() => {
        
        try {
            const provider =  new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            let transaction = await escrow.connect(signer).approveSale(property.id);
            await transaction.wait();

            const purchasePrice = await escrow.purchasePrice(property.id);
            const escrowAmount = await escrow.escrowAmount(property.id)
            const amount = purchasePrice - escrowAmount; 

            transaction = await escrow.connect(signer).finalizePayment(property.id, {value : amount});
            await transaction.wait();

            setHasLended(true);

        } catch (error) {
            console.log(error);
        }
    }

    const inspectHandler = async() => {
        
        try {
            const provider =  new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();

            const transaction = await escrow.connect(signer).propertyInspection(property.id, true);
            await transaction.wait();

            setHasInspected(true);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getDetails()
        getPropertyOwner()
    },[hasSold]);

return (

    <div className="property">
        <div className="property__details">
            <div className="property__image">
            <img src={property.image}></img>
            </div>
            <div className="property__overview">
                <h1>{property.name}</h1>
                <p>
                    <strong>{property.attributes[4].value}</strong> bds |
                    <strong>{property.attributes[5].value}</strong> ba |
                    <strong>{property.attributes[6].value}</strong> sqft
                </p>

                <p>{property.address}</p>
                <h2>{property.attributes[0].value} ETH</h2>


                    {owner ? (
                        <div className='property__owned'>
                            Owned by {owner.slice(0, 6) + '...' + owner.slice(38, 42)}
                        </div>
                    ) : (
                        <div>
                            {(currentAccount.toLowerCase() === inspector.toLowerCase()) ? (
                                <button className='property__buy' onClick={() => inspectHandler()}>
                                    Approve Inspection
                                </button>
                            ) : (currentAccount.toLowerCase() === lender.toLowerCase()) ? (
                                <button className='property__buy' onClick={() => lendHandler()}>
                                    Approve & Lend
                                </button>
                            ) : (currentAccount.toLowerCase() === seller.toLowerCase()) ? (
                                <button className='property__buy' onClick={() => sellHandler()}>
                                    Approve & Sell
                                </button>
                            ) : (
                                <button className='property__buy' onClick={() => buyHandler()}>
                                    Buy
                                </button>
                            )}


                        </div>
                    )}


                <hr/>
                    <h2>Overview</h2>
                     <p>{property.description}</p>
                 <hr/>

                    <h2>Facts and features</h2>

                <ul>
                     {property.attributes.map((attribute, index) => (
                         <li key={index}><strong>{attribute.trait_type}</strong> : {attribute.value}</li>
                     ))}
                </ul>
            </div>
            <button onClick={toggleProperty} className="property__close">
                <img src={close}></img>
            </button>
        </div>

    </div>
);
}