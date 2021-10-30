import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers'; 
import { ethereum } from '../../utils/walletconn'; 
import { signer } from '../../utils/contract'
import { transformCharacterData } from '../../utils/constants'
import { CONTRACT_ADDRESS } from '../../utils/constants';
import LoadingIndicator from "../LoadingIndicator/index"
import  myEpicGame from '../../utils/MyEpicGame.json'
import eagleknight  from '../../assets/eagleknight2.png'
import './SelectCharacter.css';


const SelectCharacter = ({ setCharacterNFT, setOpenSeaLink }) => {
  const [characters, setCharacters] = useState([]);
  const [gameContract, setGameContract] = useState(null);  
  const [mintingCharacter, setMintingCharacter] = useState(false)

  // Handle Actions methods ******************************************************************
const mintCharacterNFTAction = (characterId) => async () => {
  try {
    if (gameContract) {
      setMintingCharacter(true)
      console.log('Minting character in progress...');
      const mintTxn = await gameContract.mintCharacterNFT(characterId);
      await mintTxn.wait();
      console.log('mintTxn:', mintTxn);
      setMintingCharacter(false)
    }
  } catch (error) {
    console.warn('MintCharacterAction Error:', error);
    setMintingCharacter(false)
    alert( `MintCharacterAction Error:' ${error}`)
  }
};


  // on load methods ******************************************************************

  // get an object of type ethers.Contract and set it up on state var gameContract
  useEffect(() => {
    if (ethereum) {
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        myEpicGame.abi,
        signer
      );
      setGameContract(gameContract);
    } else {
      console.log('Ethereum object not found');
    }
  }, []);

  // check when gameContract changed and if is not null obtain the NFT aztec Gods from blockchain contract
  useEffect(() => { 
    const getCharacters = async () => {
      try {
        console.log('Getting contract characters to mint');
        /* Call contract to get all mint-able characters  */
        const charactersTxn = await gameContract.getAllDefaultCharacters();
        console.log('charactersTxn:', charactersTxn);
        /* Go through all of our characters and transform the data   */
        const characters = charactersTxn.map((characterData) => transformCharacterData(characterData))
        /*  Set all mint-able characters in state */
        setCharacters(characters);
      } catch (error) {
        console.error('Something went wrong fetching characters:', error);
      }
    };
    const onCharacterMint = async (sender, tokenId, characterIndex) => {
      console.log(
        `CharacterNFTMinted - sender: ${sender} tokenId: ${tokenId.toNumber()} characterIndex: ${characterIndex.toNumber()}`
      );
       /* Once our character NFT is minted we can fetch the metadata from our contract
       *  and set it in state to move onto the Arena  */
      if (gameContract) {
        const characterNFT = await gameContract.checkIfUserHasNFT();
        console.log('CharacterNFT: ', characterNFT);
        setCharacterNFT(transformCharacterData(characterNFT));
        alert(`Your NFT is all done -- see it here: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
      }
    };    
    /*  If our gameContract is ready (safety precaution in case is null), let's get characters!    */
    if (gameContract) {
        getCharacters();
        /* Setup NFT Minted Listener  */
        gameContract.on('CharacterNFTMinted', onCharacterMint);        
    }
    return () => {
      /* When your component unmounts, let;s make sure to clean up this listener   */
      if (gameContract) {
          gameContract.off('CharacterNFTMinted', onCharacterMint);
      }
    };    
  }, [gameContract, setCharacterNFT]); // fire this up when gameContract change to instantiated!

//  rendering methods
const renderCharacters = () =>
characters.map((character, index) => (
  <div className="character-item" key={character.name}>
    <div className="name-container">
      <p>{character.name}</p>
    </div>
    <img src={character.imageURI} alt={character.name} />
    <button
      type="button"
      className="character-mint-button"
      onClick={mintCharacterNFTAction(index)}
    >{`Mint ${character.name}`}</button>
  </div>
));

  return (
    <div className="select-character-container">
      <span style={{marginTop: '1px', display:'flex', flexDirection:'row', marginBottom:'40px'}}>
      <h2 style={{marginTop:'5px', marginRight:'20px'}}> Mint Your Aztec God, choose wisely Cuāuhpipiltin (Eagle Knight)</h2>
      <img   src={eagleknight} alt='Eagle Knight' height='60' width='60' />
      </span>
        {/* Only show this when there are characters in state */}
        {characters.length > 0 && (
          <div className="character-grid">{renderCharacters()}</div>
        )}  
    {/* Only show our loading state if mintingCharacter is true */}
    {mintingCharacter && (
      <div className="loading">
        <div className="indicator">
          <LoadingIndicator />
          <p style={{fontSize:'1.3em', color: 'yellow'}}>Minting In Progress, meanwhile build some muscle Cuāuhpipiltin!...</p>
        </div>
        <img
          src="https://media.giphy.com/media/Xd8X0Jziwj0eQ/giphy.gif"
          alt="Minting loading indicator"
          heigth='190'
          width='190'
        />
      </div>
    )}        
    </div>
  );
};

export default SelectCharacter;