require("dotenv").config();
require("@nomiclabs/hardhat-etherscan");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require('hardhat-contract-sizer');
require("solidity-coverage");

module.exports = {
	solidity: {
		compilers: [
			{
				version: '0.8.10',
				settings: {
					optimizer: {
						enabled: true,
						runs: 100
					}
				}
			},
		]
	},
	
	networks: {
		hardhat: {
      // allowUnlimitedContractSize: true,
			forking: {
				url: "https://rpc.ftm.tools",
				accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY}`],
				blockNumber: 32968090
			}
		},
    bsc: {
      url: `https://speedy-nodes-nyc.moralis.io/${process.env.MORALIS_PROJECT_ID}/bsc/mainnet`,
      chainId: 56,
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY}`]
    },
    bsc_testnet: {
      url: `https://speedy-nodes-nyc.moralis.io/${process.env.MORALIS_PROJECT_ID}/bsc/testnet`,
      chainId: 97,
      accounts: [`0x${process.env.DEPLOYER_PRIVATE_KEY}`]
    },
	},

	etherscan: {
		apiKey: {
			bsc: process.env.BSC_API_KEY,
			bscTestnet: process.env.BSC_API_KEY
		}
	},

	mocha: {
		grep: '^(?!.*; using Ganache).*'
	},

  contractSizer: {
      alphaSort: true,
      runOnCompile: true,
      disambiguatePaths: false,
  },

  gasReporter: {
    enabled: process.env.REPORT_GAS ? true : false,
    currency: 'USD',
  },
};