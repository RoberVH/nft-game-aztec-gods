import React, { useState, useEffect } from 'react';
import twitterLogo from './assets/twitter-logo.svg'
import ReactPlayer from 'react-player/youtube'
import SelectCharacter from './Components/SelectCharacter';
import { checkMMAccounts, getEthAddress, ethereum, networks  } from './utils/walletconn'
import Tezcalegend from './Components/Tezcalegend'
import { volumeon } from './assets/volumeon'
import { volumeoff } from './assets/volumeoff'
import  alarmicon  from './assets/alarmicon.svg'
import aztecskull from './assets/aztecskull.png'

import './App.css';


// Constants
const TWITTER_HANDLE = 'RoberVH';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
// State Vars
  const [musicOn, setMusicOn] = useState(true)
  const [ethAddress, setEthAddress] = useState(undefined)
  const [canConnectWallet, setCanConnect] = useState(false)
  const [networkRinkeby, setNetworkRinkeby] = useState()
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);

// Utility methods
const reloadBrowser = (opc) => {
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
  setCanConnect(ethereum) 
}, [ethAddress])

// If exist metamask, load and installed exit unload Metamask event listeners
useEffect ( ()=> {
function maskListeners() {
if (ethereum) {
  ethereum.on("chainChanged", ()=> reloadBrowser(1))
  ethereum.on("accountsChanged", ()=> reloadBrowser(2))
  ethereum.on('connect', (ConnectInfo) => ()=> reloadBrowser(3));
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
const handleConnect = async () => {
  const result = await getEthAddress()
  if (result.opcode)  {
      setEthAddress(result.value[0])
      console.log('Connected')
  } else {
      alert(result.message)
  }
}

  return (
    <div className="App">
      {!networkRinkeby && canConnectWallet &&
      <div className="rinkeby-alert-msg">
          <img  src={alarmicon} alt="alarm icon"  /> 
          <label style= {{marginLeft: '10px', marginTop: '-5px'}}>
            Network is  {networks[ethereum.networkVersion]?networks[ethereum.networkVersion]:'unknown'}, please change it to Rinkeby Network in Metamask !!! 
          </label>
      </div>}
      <div className="container">
        <div className="header-container">
             <img src={aztecskull} alt="aztec skull" heigth='80' width='80'/> 
          <h4 className="header">Aztec Gods Battle</h4>
        </div>
          <p className="sub-text">
            Help saving the Aztec Fifth Sun, defeat  dark lord of the Tenochcas' Underworld Tezcatlipoca
          </p>
          <button 
            className= "button-music" 
            onClick = {() => setMusicOn(!musicOn)}
            > 
                {!musicOn ? volumeon:volumeoff} 
          </button>
          <div className= "story-presentation">
            <div className='intro-video'>
                <ReactPlayer 
                  url='https://www.youtube.com/watch?v=L7a8hmoOsx0'
                  playing='true'
                  loop='true'
                  muted={musicOn}
                  controls='false'
                  width={840}
                  height={573 }
                  />
            </div>
            <div id="tezcadiv" className= "tezcaframe">
                <Tezcalegend />
            </div>   
          </div>
          <div className="connect-wallet-container">
            <button 
              className= "connect-wallet-button"
              disabled={!canConnectWallet}
              onClick={handleConnect}> 
                
            {  canConnectWallet?'Connect Wallet':'Install Metamask!'}
            </button>
          </div>
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
