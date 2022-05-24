import "dotenv/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "hardhat-contract-sizer";
import "solidity-coverage";
import "hardhat-spdx-license-identifier";
import "hardhat-abi-exporter";
import "hardhat-storage-layout";
import "@openzeppelin/hardhat-upgrades";
import { HardhatUserConfig } from "hardhat/types";
import { subtask, task, types } from "hardhat/config";
import fs from "fs";

const privateKeys: string[] = [];

if (process.env.DEPLOYER_PRIVATE_KEY) {
  privateKeys.push(process.env.DEPLOYER_PRIVATE_KEY);
}

if (process.env.PRIVATE_KEY1) {
  privateKeys.push(process.env.PRIVATE_KEY1);
}

if (process.env.PRIVATE_KEY2) {
  privateKeys.push(process.env.PRIVATE_KEY2);
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.13",
        settings: {
          optimizer: {
            enabled: true,
            runs: 1,
          },
        },
      },
      {
        version: "0.8.6",
        settings: {
          optimizer: {
            enabled: true,
            runs: 100,
          },
        },
      },
    ],
  },

  networks: {
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56,
      accounts: privateKeys,
    },

    bsc_testnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      chainId: 97,
      accounts: privateKeys,
    },
  },

  etherscan: {
    apiKey: process.env.BSC_API_KEY,
  },

  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },

  gasReporter: {
    enabled: true,
    currency: "USD",
  },
};

const getSortedFiles = (dependenciesGraph: any) => {
  const tsort = require("tsort");
  const graph = tsort();

  const filesMap: any = {};
  const resolvedFiles = dependenciesGraph.getResolvedFiles();
  resolvedFiles.forEach((f: any) => (filesMap[f.sourceName] = f));

  for (const [from, deps] of dependenciesGraph.entries()) {
    for (const to of deps) {
      graph.add(to.sourceName, from.sourceName);
    }
  }

  const topologicalSortedNames = graph.sort();

  // If an entry has no dependency it won't be included in the graph, so we
  // add them and then dedup the array
  const withEntries = topologicalSortedNames.concat(resolvedFiles.map((f: any) => f.sourceName));

  const sortedNames = [...new Set(withEntries)];
  return sortedNames.map((n: any) => filesMap[n]);
};

const getFileWithoutImports = (resolvedFile: any) => {
  const IMPORT_SOLIDITY_REGEX = /^\s*import(\s+)[\s\S]*?;\s*$/gm;

  return resolvedFile.content.rawContent.replace(IMPORT_SOLIDITY_REGEX, "").trim();
};

subtask("flat:get-flattened-sources", "Returns all contracts and their dependencies flattened")
  .addOptionalParam("files", undefined, undefined, types.any)
  .addOptionalParam("output", undefined, undefined, types.string)
  .setAction(async ({ files, output }, { run }) => {
    const dependencyGraph = await run("flat:get-dependency-graph", { files });
    console.log(dependencyGraph);

    let flattened = "";

    if (dependencyGraph.getResolvedFiles().length === 0) {
      return flattened;
    }

    const sortedFiles = getSortedFiles(dependencyGraph);

    let isFirst = true;
    for (const file of sortedFiles) {
      if (!isFirst) {
        flattened += "\n";
      }
      flattened += `// File ${file.getVersionedName()}\n`;
      flattened += `${getFileWithoutImports(file)}\n`;

      isFirst = false;
    }

    // Remove every line started with "// SPDX-License-Identifier:"
    flattened = flattened.replace(/SPDX-License-Identifier:/gm, "License-Identifier:");

    flattened = `// SPDX-License-Identifier: MIXED\n\n${flattened}`;

    // Remove every line started with "pragma experimental ABIEncoderV2;" except the first one
    flattened = flattened.replace(
      /pragma experimental ABIEncoderV2;\n/gm,
      (
        (i) => (m: any) =>
          !i++ ? m : ""
      )(0)
    );
    // Remove every line started with "pragma abicoder v2;" except the first one
    flattened = flattened.replace(
      /pragma abicoder v2;\n/gm,
      (
        (i) => (m: any) =>
          !i++ ? m : ""
      )(0)
    );
    // Remove every line started with "pragma solidity ****" except the first one
    flattened = flattened.replace(
      /pragma solidity .*$\n/gm,
      (
        (i) => (m: any) =>
          !i++ ? m : ""
      )(0)
    );

    flattened = flattened.trim();
    if (output) {
      console.log("Writing to", output);
      fs.writeFileSync(output, flattened);
      return "";
    }
    return flattened;
  });

subtask("flat:get-dependency-graph")
  .addOptionalParam("files", undefined, undefined, types.any)
  .setAction(async ({ files }, { run }) => {
    const sourcePaths =
      files === undefined
        ? await run("compile:solidity:get-source-paths")
        : files.map((f: any) => fs.realpathSync(f));

    const sourceNames = await run("compile:solidity:get-source-names", {
      sourcePaths,
    });

    const dependencyGraph = await run("compile:solidity:get-dependency-graph", { sourceNames });

    return dependencyGraph;
  });

task("flat", "Flattens and prints contracts and their dependencies")
  .addOptionalVariadicPositionalParam("files", "The files to flatten", undefined, types.inputFile)
  .addOptionalParam("output", "Specify the output file", undefined, types.string)
  .setAction(async ({ files, output }, { run }) => {
    console.log(
      await run("flat:get-flattened-sources", {
        files,
        output,
      })
    );
  });

export default config;
