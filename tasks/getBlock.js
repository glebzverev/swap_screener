const { serializeTransaction } = require("ethers/lib/utils");
const DEX = require("../DEX.json");
const { task } = require("hardhat/config");

require("@nomiclabs/hardhat-ethers");

// task action function receives the Hardhat Runtime Environment as second argument
task(
  "blockNumber",
  "Prints the current block number",
  async (_, { ethers }) => {
    await ethers.provider.getBlockNumber().then((blockNumber) => {
      console.log("Current block number: " + blockNumber);
    });
  }
);

task("transaction",
"Prints the current block number",
async (_, { ethers }) => {
    await ethers.provider.getTransactionReceipt("0xbce280a2273ed6ca3ce4c1162eac22db929ef336206a92cbdac224c06e4cdc84").then((transaction) => {
        console.log('topics');
        console.log(transaction['logs'][0]['topics']);
        console.log('transaction');
        console.log(transaction);
    });
}
);

task("events",
"Prints the current block number",
async (_, { ethers }) => {
    const abi = [
        `    event Swap(
            address indexed sender,
            uint amount0In,
            uint amount1In,
            uint amount0Out,
            uint amount1Out,
            address indexed to
        );`
      ];
      const pair = await ethers.getContractAt("IUniswapV2Pair", DEX["Pools"]["Uniswap"])

      async function event() {
        let res = await pair.filters.Swap(null);
      console.log(res)
      return res;
    }
     
    ethers.provider.on(event(), (blockNumber) => {
        console.log(blockNumber);
    })

    

})



module.exports = {};