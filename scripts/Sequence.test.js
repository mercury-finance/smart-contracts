require('hardhat');

async function main() {

  const [deployer] = await ethers.getSigners();
  console.log("The deployer's address: " + deployer.address);

  // Get all contract factories
  const Vat = await ethers.getContractFactory("Vat");
  const Usb = await ethers.getContractFactory("Usb");

  // Deploy in sequence
  const vat = await Vat.deploy();
  await vat.deployed();
  const usb = await Usb.deploy(250);
  await usb.deployed();

  // Print out all the deployed addresses
  console.log("Vat       :", vat.address);
  console.log("Usb       :", usb.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
