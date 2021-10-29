import React, { useState, useEffect } from 'react';
import twitterLogo from './assets/twitter-logo.svg'
// import StoryPresentation from './Components/storypresentation'
import { renderContent } from './Components/renderContent';
import { checkMMAccounts, getEthAddress, ethereum, networks  } from './utils/walletconn'
import  EthAccount from './Components/EthAccount'
import  alarmicon  from './assets/alarmicon.svg'
import aztecskull from './assets/aztecskull.png'

import './App.css';


// Constants
const TWITTER_HANDLE = 'RoberVH';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
// State Vars
  const [ethAddress, setEthAddress] = useState(undefined)
  const [canConnectWallet, setCanConnect] = useState(false)
  const [networkRinkeby, setNetworkRinkeby] = useState(undefined)
  // const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);

// Utility methods
const reloadBrowser = () => {
  window.location.reload();
};

// on Load methods *******************************************

// If we do have Metamask, check if already an account is connected (from previous executions) 
// if there is a connected Eth address, read Ceramic profile, and refresh data to UI
useEffect ( () => { 
  async function getEthAccount() {
    const {opcode, errorMsg, value} = await checkMMAccounts()
    if (opcode) {
      if (value && value[0].length > 0) {
          setEthAddress(value[0])
          setNetworkRinkeby(ethereum.networkVersion === '4') 
        }
        else 
          alert(errorMsg) 
    } 
  }
  getEthAccount()
},[])


// if there is Metamask but not ethereum address connected,enable connect button
useEffect ( () =>  { 
  if (ethereum) {
    setCanConnect(ethereum) 
    setNetworkRinkeby(ethereum.chainId === '0x4') 
}
}, [])


// If exist metamask, load and installed exit unload Metamask event listeners
useEffect ( ()=> {
function maskListeners() {
if (ethereum) {
  ethereum.on("chainChanged", ()=> reloadBrowser())
  ethereum.on("accountsChanged", ()=> reloadBrowser())
  ethereum.on('connect', (ConnectInfo) => ()=> reloadBrowser());
  ethereum.on('message', (message) => {console.log('message',message )});
}
return (() => {
  if (ethereum) {
    ethereum.removeListener("chainChanged", reloadBrowser);
    ethereum.removeListener("accountsChanged",reloadBrowser);
    ethereum.removeListener("connect",reloadBrowser);
  }
})
}
maskListeners()
},[])  

// handling methods
// const handleConnect = async () => {
//   const result = await getEthAddress()
//   if (result.opcode)  {
//       setEthAddress(result.value[0])
//       console.log('Connected')
//   } else {
//       alert(result.message)
//   }
// }

  return (
    <div className="App">
      {(ethAddress && !networkRinkeby && canConnectWallet) &&
      <div className="rinkeby-alert-msg">
          <img  src={alarmicon} alt="alarm icon"  /> 
          <label style= {{marginLeft: '10px', marginTop: '-5px'}}>
            Network is  {networks[ethereum.chainId]? networks[ethereum.chainId]: 'unknown'}, please change it to Rinkeby Network in Metamask !!! 
          </label>
      </div>}
      <div className="container">
          { ethAddress && <EthAccount account={ethAddress}/>}
        <div className="header-container">
             <img src={aztecskull} alt="aztec skull" heigth='80' width='80'/> 
          <h4 className="header">Aztec Gods Battle</h4>
        </div>
          <p className="sub-text">
            Save Aztec Fifth Sun, defeat  dark lord of the Tenochcas' Underworld Tezcatlipoca
          </p>
          {  renderContent (ethAddress, setEthAddress, canConnectWallet, characterNFT, setCharacterNFT) }
          {/* <StoryPresentation /> */}
          {/* <div className="connect-wallet-container">
            <button 
              className= "connect-wallet-button"
              disabled={!canConnectWallet}
              onClick={handleConnect}> 
            {  canConnectWallet?'Connect Wallet':'Install Metamask!'}
            </button>
          </div> */}
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
            >{`@${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
