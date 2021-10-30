import React from 'react'
import StoryPresentation from "./storypresentation"
import SelectCharacter from "./SelectCharacter/index"
import LoadingIndicator from "./LoadingIndicator/index"
import Arena from "./Arena"
import { getEthAddress  } from "../utils/walletconn"
import '../App.css'

export const  renderContent = (
        currentAccount, 
        setEthAddress, 
        canConnectWallet,
        characterNFT,
        setCharacterNFT,
        isLoading        ) => {
            console.log('character:', characterNFT)
    // handling methods
    const handleConnect = async () => {
        const result = await getEthAddress()
        if (result.opcode)  {
            setEthAddress(result.value[0])
            console.log('Connected')
        } else {
            alert(result.message)
        }
    };
    if (!currentAccount) {
    /*Scenario 1 */        
    return (
        <div>
            <StoryPresentation />
            { isLoading && <LoadingIndicator /> }
            <div className="connect-wallet-container">
                <button 
              className= "connect-wallet-button"
              disabled={!canConnectWallet}
              onClick={handleConnect}> 
            {  canConnectWallet?'Connect Wallet':'Install Metamask!'}
            </button>
            </div>
        </div>
            );
            /* Scenario #2 */
        } else if (currentAccount && !characterNFT) {
            return <SelectCharacter setCharacterNFT={setCharacterNFT}  />;
        } else if (currentAccount && characterNFT) {
            return <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT}/>;
          }
  };            
