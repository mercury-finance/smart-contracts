const hre = require("hardhat");

const { VAT,
    SPOT,
    aBNBc,
    USB,
    UsbJoin,
    aBNBcJoin,
    MANAGER} = require('../../addresses.json');
const {ethers} = require("hardhat");

async function main() {
    console.log('Running deploy script');

    this.Interaction = await hre.ethers.getContractFactory("DAOInteraction");

    const interaction = await this.Interaction.deploy(
        VAT,
        SPOT,
        aBNBc,
        USB,
        aBNBcJoin,
        UsbJoin,
        MANAGER
    );
    await interaction.deployed();
    console.log("interaction deployed to:", interaction.address);


    console.log('Validating code');

    await hre.run("verify:verify", {
        address: interaction.address,
        constructorArguments: [
            VAT,
            SPOT,
            aBNBc,
            USB,
            aBNBcJoin,
            UsbJoin,
            MANAGER
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
