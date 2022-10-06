const main = async () => {
  console.log('Initiating deployment...')
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    console.log("Deployer Account balance:", (await deployer.getBalance()).toString());    
    const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
    const gameContract = await gameContractFactory.deploy(                     
        ["Quetzalcoatl", "Tlaloc", "Xochipilli"],       // Names
        ["https://www.mexicolore.co.uk/images-6/610_06_2.jpg", // Images
        "https://www.mexicolore.co.uk/images-6/610_08_2.jpg", 
        "https://www.mexicolore.co.uk/images-6/610_12_2.jpg"],
        [500, 400, 300],                    // HP values
        [80, 110, 100],                       // Attack damage values                   
        "Tezcatlipoca", // Boss name
        "https://www.mexicolore.co.uk/images-6/610_07_2.jpg", // Boss image
        10000, // Boss hp
        50 // Boss attack damage          
    );
    await gameContract.deployed();
    console.log("Contract deployed to:", gameContract.address);
    console.log("Done!");
  
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