const hre = require("hardhat");

const { VAT,
    SPOT,
    aBNBc,
    USB,
    UsbJoin,
    aBNBcJoin,
    Oracle,
    JUG,
    REAL_ABNBC,
    REALaBNBcJoin,
} = require('../../addresses.json');
const {ethers} = require("hardhat");

async function main() {
    console.log('Running deploy script');

    this.Interaction = await hre.ethers.getContractFactory("DAOInteraction");

    const interaction = await this.Interaction.deploy(
        VAT,
        SPOT,
        USB,
        UsbJoin,
        JUG
    );
    await interaction.deployed();
    console.log("interaction deployed to:", interaction.address);

    this.Vat = await hre.ethers.getContractFactory("Vat");
    console.log("Vat...");

    let vat = this.Vat.attach(VAT);
    await vat.rely(interaction.address);

    console.log('Validating code');

    await hre.run("verify:verify", {
        address: interaction.address,
        constructorArguments: [
            VAT,
            SPOT,
            USB,
            UsbJoin,
            JUG,
        ],
    });

    console.log('Adding collateral types');
    let collateral = ethers.utils.formatBytes32String("aBNBc");
    let collateral2 = ethers.utils.formatBytes32String("aBNBc2");

    await interaction.setCollateralType(aBNBc, aBNBcJoin, collateral);
    await interaction.setCollateralType(REAL_ABNBC, REALaBNBcJoin, collateral2);

    console.log('Finished');
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
