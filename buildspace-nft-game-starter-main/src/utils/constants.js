//const CONTRACT_ADDRESS = '0x6dcF7C4C6460cA814bfDf3FcFd467F805FB72733'; En Rinkeby
// Deployed o Goerli (Sept. 2022) by test-3 0x6287fDD14C0F6bc4c6De77D025742687287Fba7d
const CONTRACT_ADDRESS = "0xc6705616aAAc304D9ee5E94dFb0Bfa64755fcdB4" 
/*
 * Add this method and make sure to export it on the bottom!
 */
const transformCharacterData = (characterData) => {
    return {
      name: characterData.name,
      imageURI: characterData.imageURI,
      hp: characterData.hp.toNumber(),
      maxHp: characterData.maxHp.toNumber(),
      attackDamage: characterData.attackDamage.toNumber(),
    };
  };
  
  export { CONTRACT_ADDRESS, transformCharacterData };