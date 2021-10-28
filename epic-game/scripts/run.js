const main = async () => {
  const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
  const gameContract = await gameContractFactory.deploy(
    ["Quetzalcoatl", "Tlaloc", "Xochipilli"],       // Names
    ["https://www.mexicolore.co.uk/images-6/610_06_2.jpg", // Images
    "https://www.mexicolore.co.uk/images-6/610_08_2.jpg", 
    "https://www.mexicolore.co.uk/images-6/610_12_2.jpg"],
    [500, 250, 200],                    // HP values
    [80, 110, 120],                       // Attack damage values
    "Tezcatlipoca", // Boss name
    "https://www.mexicolore.co.uk/images-6/610_07_2.jpg", // Boss image
    1000, // Boss hp
    50 // Boss attack damage    
  );
  await gameContract.deployed();
  console.log("Contract deployed to:", gameContract.address);
  let txn;
  // We only have three characters.
  // an NFT w/ the character at index 2 of our array,  This is Xochipilli God!
  txn = await gameContract.mintCharacterNFT(2);
  await txn.wait();
  
  // Get the value of the NFT's URI.
  // let returnedTokenUri = await gameContract.tokenURI(1);
  // console.log("Token URI:", returnedTokenUri);  
  
  txn = await gameContract.attackBoss();
  await txn.wait();  
  txn = await gameContract.attackBoss();
  await txn.wait();    
};


const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();