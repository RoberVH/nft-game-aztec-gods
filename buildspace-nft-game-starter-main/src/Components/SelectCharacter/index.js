import React, { useEffect, useState } from 'react';
import eagleknight  from '../../assets/eagleknight2.png'
import './SelectCharacter.css';

/*
 * Don't worry about setCharacterNFT just yet, we will talk about it soon!
 */
const SelectCharacter = ({ setCharacterNFT }) => {
  return (
    <div className="select-character-container">
      <span style={{marginTop: '30px', display:'flex', flexDirection:'row'}}>
      <img   src={eagleknight} alt='Eagle Knight' height='80' width='80' />
      <h2 style={{marginTop:'40px', marginLeft:'20px'}}> Mint Your Aztec God, choose wisely Cuāuhpipiltin (Eagle Knight)</h2>
      </span>
    </div>
  );
};

export default SelectCharacter;