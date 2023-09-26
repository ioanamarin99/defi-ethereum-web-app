import React from 'react';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
  NavBtn,
  NavBtnLink,
} from './NavbarElements';

import {
  MDBTabs,
  MDBTabsItem,
  MDBTabsLink,
  MDBTabsContent,
  MDBTabsPane
} from 'mdb-react-ui-kit';
import { useState } from 'react';

export default function  Navbar() {
  
  return (
    <>
      <Nav>
        <Bars/>
        <NavMenu>
        <NavLink to='/login' activestyle="true">
            Login
          </NavLink>
          <NavLink to='/accountInfo' activestyle="true">
            Account Info
          </NavLink>
          <NavLink to='/sendETH' activestyle="true">
            P2P Exchange
          </NavLink>
          <NavLink to='/lending' activestyle="true">
            Lending
          </NavLink>
          <NavLink to='/borrowing' activestyle="true">
            Borrowing
          </NavLink>
          {/* <NavLink to='/flashLoan' activestyle="true">
            Flash Loan
          </NavLink> */}
          <NavLink to='/realEstate' activestyle="true">
            Real Estate
          </NavLink>
           <NavLink to='/transactions' activestyle="true">
            Transactions
          </NavLink>
          {/* // <NavLink to='/logout' activeStyle>
          //   Logout
          // </NavLink> */}

        </NavMenu>
        {/* <NavBtn>
          <NavBtnLink to='/login'>Login</NavBtnLink>
        </NavBtn> */}
      </Nav>
    </>
  );
}
