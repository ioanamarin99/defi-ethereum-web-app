import logo from './logo.svg';
import './App.css';
import Login from "./components/Login";
import { BlockchainProvider } from './context/BlockchainContext';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import AccountInfo from './components/AccountInfo';
import SendETH from './components/SendETH';
import Transactions from './components/Transactions';
import FlashLoan from './components/FlashLoan';
import Lending from './components/Lending';
import Borrowing from './components/Borrowing';
import RealEstate from './components/RealEstate';

function App() {
  return (
    <BlockchainProvider>
      <Router>
      <Navbar/>
      <Routes>
      <Route path='/' exact element={<Login/>} />
      <Route path='/login' element={<Login/>} />
      <Route path='/accountInfo' element={<AccountInfo/>} />
      <Route path='/sendETH' element={<SendETH/>} />
      <Route path='/lending' element={<Lending/>} />
      <Route path='/borrowing' element={<Borrowing/>} />
      <Route path='/flashLoan' element={<FlashLoan/>}></Route>
      <Route path='/realEstate' element={<RealEstate/>}></Route>
      <Route path='/transactions' element={<Transactions/>}></Route>
      </Routes>
      </Router>
      </BlockchainProvider>
  );
}

export default App;
