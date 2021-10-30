import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import { ethereum } from '../../utils/walletconn'; 
import { signer } from '../../utils/contract'
import LoadingIndicator from "../LoadingIndicator/index"
import { CONTRACT_ADDRESS, transformCharacterData } from '../../utils/constants';
import myEpicGame from '../../utils/MyEpicGame.json';
import './Arena.css';

const Arena = ({ characterNFT, setCharacterNFT }) => {

// Handle methods ******************************************************************

const runAttackAction = async () => {
    try {
        if (gameContract) {
          setAttackState('attacking');
          console.log('Attacking boss...');
          const attackTxn = await gameContract.attackBoss();
          await attackTxn.wait();
          console.log('attackTxn:', attackTxn);
          setAttackState('hit');
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
          }, 5000);          
        }
      } catch (error) {
        console.error('Error attacking boss:', error);
        setAttackState('');
      }
};

// on load methods ******************************************************************
 /*
 * We pass in our characterNFT metadata so we can a cool card in our UI
 */

  // State
  const [gameContract, setGameContract] = useState(null)
  const [boss, setBoss] = useState(null)
  const [attackState, setAttackState] = useState('');
  const [showToast, setShowToast] = useState(false);

  // UseEffects
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

  /*  Setup async function that will get the boss from our contract and sets in state  */
  useEffect(() => {
    const fetchBoss = async () => {
      const bossTxn = await gameContract.getBigBoss();
      console.log('Boss:', bossTxn);
      setBoss(transformCharacterData(bossTxn));
    };
    const onAttackComplete = (newBossHp, newPlayerHp) => {
        const bossHp = newBossHp.toNumber();
        const playerHp = newPlayerHp.toNumber();

        console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

        /*
        * Update both player and boss Hp
        */
        setBoss((prevState) => {
            return { ...prevState, hp: bossHp };
        });

        setCharacterNFT((prevState) => {
            return { ...prevState, hp: playerHp };
        });
    };  
    if (gameContract) {
      /*   gameContract is ready to go! Let's fetch our boss   */
      fetchBoss();
      gameContract.on('AttackComplete', onAttackComplete);
      return () => {
        if (gameContract) {
            gameContract.off('AttackComplete', onAttackComplete);
        }
    }      
    }
  }, [gameContract, setCharacterNFT]);

  return (
    <div className="arena-container">
    {boss && showToast && (
      <div id="toast" className="show">
        <div id="desc">{`💥 ${boss.name} was hit for ${characterNFT.attackDamage}!`}</div>
      </div>
    )}      
     {boss && (
      <div className="contenedor-jefe">
      <div className="boss-container">
        <div className={`boss-content ${attackState}`}>
          <h2>🔥 {boss.name} 🔥</h2>
          <div className="image-content">
            <img src={boss.imageURI} alt={`Boss ${boss.name}`} />
            <div className="health-bar">
              <progress value={boss.hp} max={boss.maxHp} />
              <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
            </div>
          </div>
        </div>
        <div className="attack-container">
          <button 
          style={{marginLeft:'100px', marginTop: '80px'}}
          className="cta-button" 
          onClick={runAttackAction}
          >
            {`💥 Attack ${boss.name}`}
          </button>
        </div>
        </div>
        { 
          attackState === 'attacking' && (
          <div className="loading-indicator" style={{marginLeft: '450px'}}>
            <span style= {{display:'flex'}}>
            <LoadingIndicator />
            <p className= "blink" style={{marginLeft:'20px',marginTop:'50px'}}>Attacking ⚔️</p>
            </span>
          </div>
        )}        
      </div>
    )}

      {/* Character NFT */}
      {characterNFT && (
      <div className="players-container">
        <div className="player-container">
          <div className="player">
            <div className="image-content">
              <h2>{characterNFT.name}</h2>
              <img
                src={characterNFT.imageURI}
                alt={`Character ${characterNFT.name}`}
              />
              <div className="health-bar">
                <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
              </div>
            </div>
            <div className="stats">
                <span> 
                    <h3><strong> &#9760; </strong> {` Attack Damage: ${characterNFT.attackDamage} `} <strong> &#9760; </strong></h3>
                </span>
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  );
};

export default Arena;