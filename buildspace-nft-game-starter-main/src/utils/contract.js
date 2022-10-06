import { ethereum } from "../utils/walletconn"
import { ethers } from "ethers";
import { 
    CONTRACT_ADDRESS, 
    transformCharacterData 
} from './constants';
import myEpicGame from './MyEpicGame.json';

// Let's define ethers contract relate vars  here to use it globally once they are initialized at initialize method
export let provider;
export let signer;

export const initEthersVar = () => {
     provider = new ethers.providers.Web3Provider(ethereum);
     signer = provider.getSigner();
}

/* The function we will call that interacts with out smart contract to check if we have a minted Aztec
*   God NFT on account
*/
export const fetchNFTMetadata = async (accountAddress, setCharacterNFT) => {
    if (signer) {
        if (ethereum.chainId!=='0x5')
            { console.log ('Wrong Network, is not Goerli Network!!')
            return  // do nothing
         }
        console.log('Checking for Character NFT on address:', accountAddress);
        const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
        )
        const txn = await gameContract.checkIfUserHasNFT();
        console.log('txn', txn)
        if (txn.name) {
             console.log('User has character NFT');
             setCharacterNFT(transformCharacterData(txn));
            } else {
                console.log('No character NFT found!');
              }
    } else {
        console.log('Error, you call a method without initializing ethers vars!!')
    }
    
  };
