import { ethers, upgrades } from "hardhat";

const main = async () => {
  // Deploying

  // Upgrading
  // const Interaction = await ethers.getContractFactory("DAOInteraction");
  // const interaction = await Interaction.deploy()
  // await interaction.deployed();
  // console.log(interaction.address);

  const interaction = await ethers.getContractAt(
    "DAOInteraction",
    "0xE8A954826660a78FFf62652FeD243E3fef262014"
  );
  // await interaction.approve();
  let res = await interaction.upgradeTo(
    "0x9E8Ce0a44dC73C3885c7d30AF4D624BC02b09Ac2"
  );
  res = res.wait();
  console.log(res.hash);
};

main();
