const hre = require("hardhat");

const { VAT } = require('../../addresses.json');

async function main() {
    console.log('Running deploy script');
    const spotterFactory = await hre.ethers.getContractFactory("Spotter");
    const spotter = await spotterFactory.deploy(VAT);
    await spotter.deployed();
    console.log("Spot deployed to:", spotter.address);

    console.log('Validating code');
    await hre.run("verify:verify", {
        address: spotter.address,
        constructorArguments: [
            VAT
        ],
    });
    console.log('Finished');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
