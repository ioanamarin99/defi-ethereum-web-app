import React, {useState, useEffect, createContext} from 'react';
import {ethers,formatEther,parseEther,parseUnits,formatUnits,verifyMessage,signMessage,randomBytes} from 'ethers';

import {transactionsContractABI, transactionsContractAddress, flashloanContractABI, flashloanContractAddress, USDCtokenContractAddress, simpleLendingContractABI, simpleLendingContractAddress, escrowContractABI, escrowContractAddress, DAItokenContractAddress, aDAItokenContractAddress,tokens, realEstateContractAddress, realEstateContractABI,borrowingContractABI,borrowingContractAddress} from '../utils/constants.js';

export const BlockchainContext = createContext();


export const  BlockchainProvider = ({children}) =>{

    const [currentAccount, setCurrentAccount] = useState('');
    const [userBalance, setUserBalance] = useState('');
    const [userTransactionCount, setTransactionCount] = useState('');
    const [userTransactions, setUserTransactions] = useState([]);

    const [isAuthenticated, setAuthenticated] = useState(false);

    const [transactionFormData, setTransactionFormData] = useState({addressTo:"", amount:"", description:"", message: ""});

    
    const [flashLoanTokenBalance, setFlashLoanTokenBalance] = useState(0);

    const [properties, setProperties] = useState([]);
    const [escrow, setEscrow] = useState(null);

    const [loading, setLoading] = useState(true);

    const checkWalletConnection = async () => {
        try {
            if (window.ethereum == null){ 
                return alert("Please install Metmask!");
            }

            const provider =  new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const accounts = await provider.send("eth_accounts");

            if (accounts.length) {

                setCurrentAccount(accounts[0]);

                const address = await signer.getAddress();
                const balance = await provider.getBalance(address);
                setUserBalance(formatEther(balance));

                const transactionCount = await provider.getTransactionCount(address);
                setTransactionCount(transactionCount);

                getAllTransactions();

            } else {
                console.log("No accounts found!")
            }
        } catch (error) {
            console.log(error)
        }
    }

    const accountChanged = async() => {
        window.ethereum.on('accountsChanged', async () => {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

            const provider =  new ethers.BrowserProvider(window.ethereum);
            console.log(provider)
            const signer = await provider.getSigner();
            console.log(signer)

            const account = await signer.getAddress();

            setCurrentAccount(account);
            handleChangedAccount(signer,provider);
          });
    }  

    const handleWalletConnection = async() =>{

        try {
            if(window.ethereum == null){
                return alert("Please install MetaMask!");
            }
    
            const provider =  new ethers.BrowserProvider(window.ethereum);
            console.log(provider)
            const signer = await provider.getSigner();

            const randomMessage = randomBytes(32);
            const signedMessage = await signer.signMessage(randomMessage);
                
            console.log(signedMessage);
            const verifySigner = verifyMessage(randomMessage,signedMessage);

            try {
                console.log("SIGNER " + verifySigner);
                handleChangedAccount(signer,provider);
                setAuthenticated(true);
                console.log("AUTH " + isAuthenticated);
              } catch (err) {
                console.log("Something went wrong while verifying your message signature: " + err);
              }
            
        } catch (error) {
            console.log(error);
        }
       
    }

    const handleChangedAccount = async(newAccount,provider) =>{

        const address = await newAccount.getAddress();
        setCurrentAccount(address);

        getUserBalance(provider, address);   
        
        const transactionCount = await provider.getTransactionCount(address);
        setTransactionCount(transactionCount);

        getAllTransactions();
    }

    const getUserBalance = async(provider,address) =>{

        const balance = await provider.getBalance(address);
        setUserBalance(formatEther(balance));
    }

    const handleChangeInTransactionForm = (event) =>{
       // console.log(event)
        const { name, value } = event.target;
        console.log(value)
        setTransactionFormData({...transactionFormData, [name]:value});

    }

    const loadContract = async(contractAddress, contractABI) =>{

        try {
            if(window.ethereum){

                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const contract = new ethers.Contract(contractAddress,contractABI,signer);

                return contract;

            } else{
                console.log("No ethereum object");
            }
        } catch (error) {
            
            console.log(error);
        }
    }
    
    const performTransaction = async() =>{

        try{

       if(window.ethereum){

           const provider =  new ethers.BrowserProvider(window.ethereum);
           const signer = await provider.getSigner();

            if(!transactionFormData.addressTo || !transactionFormData.amount || !transactionFormData.description || !transactionFormData.message){
                return alert("Please fill all the forms!");
            }

            const transactionsContract = await loadContract(transactionsContractAddress,transactionsContractABI);

            if(transactionsContract){   
            const addressTo = transactionFormData.addressTo;
            const parsedAmount = parseEther(transactionFormData.amount);
            const description = transactionFormData.description;
            const message = transactionFormData.message;
       
            const tx = await signer.sendTransaction({
                to: addressTo,
                value: parsedAmount
            });

            await tx.wait();

            const contractTx = await transactionsContract.addToBlockchain(addressTo, parsedAmount, description, message);
            await contractTx.wait();

            console.log("Done! Transaction added to blockchain.")

            const transactionCount = await provider.getTransactionCount(currentAccount);
            setTransactionCount(transactionCount);
            }
        }
       else {
           console.log("No ethereum object");
       }
         }catch(error){
             console.log(error);
        }
    }

    const addTransactionsToBlockchain = async(addressTo,amount, description, message) => {
        try {
            if(window.ethereum){

                const provider =  new ethers.BrowserProvider(window.ethereum);
                const transactionsContract = await loadContract(transactionsContractAddress,transactionsContractABI);
                
                if(transactionsContract){
                    const parsedAmount = parseEther(amount);
                    const contractTx = await transactionsContract.addToBlockchain(addressTo, parsedAmount, description, message);
                    await contractTx.wait();

                    const transactionCount = await provider.getTransactionCount(currentAccount);
                    setTransactionCount(transactionCount);
                }
            }else console.log("No ethereum object");
            
        } catch (error) {
            console.log(error);
        }
    }

    const getAllTransactions = async() =>{

        try {
                const transactionsContract = await loadContract(transactionsContractAddress,transactionsContractABI);

                if(transactionsContract){

                const returnedTransactions = await transactionsContract.getAllTransactions();

                //msg.sender,receiver, amount, message, block.timestamp, description
                const mappedTransactions = returnedTransactions.map((transaction) => ({
                     addressTo : transaction.receiver,
                     addressFrom : transaction.sender,
                     timestamp: transaction.timestamp,
                     amount : transaction.amount,
                     description : transaction.description,
                     message : transaction.message
                })
                )

                console.log(mappedTransactions);
                setUserTransactions(mappedTransactions);
            }
     
        } catch (error) {
            
            console.log(error);
        }
    }

    const parseAmount = (amount,symbol) =>{

        let identifiedToken = tokens.find(token => token.symbol == symbol);
        const parsedAmount = parseUnits(amount, identifiedToken.decimals);
        return parsedAmount;
    }

    const formatAmount = (amount,symbol) =>{

        let identifiedToken = tokens.find(token => token.symbol == symbol);
        const formattedAmount = formatUnits(amount, identifiedToken.decimals);
        return formattedAmount;
    }

    const getTokenAddress = (symbol) => {

        let identifiedToken = tokens.find(token => token.symbol == symbol);
        const tokenAddress = identifiedToken.address;
        return tokenAddress;
    }


    const requestAaveFlashLoan = async(requestedAmount) =>{

        try{
                if(!requestedAmount){
                    return alert("Please select an amount!");
                }
                const flashloanContract = await loadContract(flashloanContractAddress,flashloanContractABI);

                if(flashloanContract){

                const parsedRequestedAmount = parseUnits(requestedAmount,6);
                await flashloanContract.requestFlashLoan(USDCtokenContractAddress,parsedRequestedAmount);
                }

        }catch (error) {
            console.log(error);
        }
    }

    const getFlashLoanContractTokenBalance = async() =>{

        try {
            const flashloanContract = await loadContract(flashloanContractAddress,flashloanContractABI);

            if(flashloanContract){
            const balance = await flashloanContract.getBalance(USDCtokenContractAddress); //USDC Sepolia contract address
            setFlashLoanTokenBalance(formatUnits(balance,6));
            }
            
        } catch (error) {

            console.log(error);
        }
    }

    const loadProperties = async() => {

        try {
            const realEstateContract = await loadContract(realEstateContractAddress,realEstateContractABI);

            if(realEstateContract){
                
                const totalSupply = await realEstateContract.totalSupply();
                console.log("TOTAL SUPPLY: " + totalSupply.toString());
                const properties = [];
                
                for (let i = 1; i <= totalSupply; i++){
                    const uri = await realEstateContract.tokenURI(i);
                    const response = await fetch(uri);
                    const metadata = await response.json();
                    properties.push(metadata);
                }

                setProperties(properties);
                setLoading(false);
                
                const escrowContract = await loadContract(escrowContractAddress, escrowContractABI);
                setEscrow(escrowContract);

            }
            
        } catch (error) {

            console.log(error);
        }
    }


    // useEffect(() => {
    //     checkWalletConnection()
    // },[currentAccount]);


    return(
        <BlockchainContext.Provider value={{handleWalletConnection,currentAccount,userBalance,userTransactionCount,transactionFormData,setTransactionFormData,getUserBalance,performTransaction,handleChangeInTransactionForm,getAllTransactions,userTransactions, isAuthenticated,requestAaveFlashLoan,getFlashLoanContractTokenBalance,flashLoanTokenBalance, loadProperties, properties, escrow, loadContract, parseAmount,getTokenAddress,formatAmount,accountChanged,addTransactionsToBlockchain,loading,setLoading}}>
            {children}
        </BlockchainContext.Provider>
    );
}