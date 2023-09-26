import React from "react";
import { useContext,useEffect } from "react";
import { BlockchainContext } from "../context/BlockchainContext";
import { FaRegArrowAltCircleDown } from "react-icons/fa";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Moment from 'moment';
import { formatEther } from "ethers";

export default function Transactions() {

    const { currentAccount, userTransactions,accountChanged } = useContext(BlockchainContext);

    const transactionList = userTransactions?.map(item => {
        return (
            <div>
                <p>
                    Address to: {item.addressTo} , Address from: {item.addressFrom}, Timestamp: {(item.timestamp).toString()}, Amount: {(item.amount).toString()}, Description: {item.description}, Message: {item.message}
                </p>
            </div>
        );
    })

    useEffect(() =>{
        accountChanged()
    },[]);

    return (
        currentAccount ? (
            // <div>
            //     <h3>Transactions</h3>
            //  <div className="transactions">
            //      <ul>{transactionList}</ul>
            //     </div>
            //     </div>
            // <div style={{ position: "relative", margin: "auto", width: "80vw" }}>
            <div className="table-container">
                <div className="custom-card3">
                    {/* <div className="table-container"> */}

                    {/* <div > */}
                    <TableContainer>
                        <Table aria-label='simple table'>
                            <TableHead style={{ backgroundColor: 'WhiteSmoke' }}>
                                <TableRow>
                                    <TableCell align='center'>Address to</TableCell>
                                    <TableCell align='center'>Address from</TableCell>
                                    <TableCell align='center'>Timestamp</TableCell>
                                    <TableCell align='center'>Amount</TableCell>
                                    <TableCell align='center'>Description</TableCell>
                                    <TableCell align='center'>Message</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {userTransactions.map((row, index) => (
                                    <TableRow key={index}>
                                        <TableCell align='center'><span style={{ color: "#f5f5f5" }}>{row.addressTo}</span></TableCell>
                                        <TableCell align='center'><span style={{ color: "#f5f5f5" }}>{row.addressFrom}</span></TableCell>
                                        <TableCell align='center'><span style={{ color: "#f5f5f5" }}>{Moment.unix(Number(row.timestamp.toString())).format('YYYY-MM-DD HH:mm:ss')}</span></TableCell>
                                        <TableCell align='center'><span style={{ color: "#f5f5f5" }}>{formatEther(row.amount).toString()}</span></TableCell>
                                        <TableCell align='center'><span style={{ color: "#f5f5f5" }}>{row.description}</span></TableCell>
                                        <TableCell align='center'><span style={{ color: "#f5f5f5" }}>{row.message}</span></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* </div> */}
                    {/* 
                </div> */}
                </div>
            </div>
        )
            : (<></>)
    );

} 