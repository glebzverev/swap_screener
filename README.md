# Swap-Screner

## Schema  
![alt text](https://github.com/glebzverev/swap-screener/blob/main/docs/example.jpg?raw=true)

## Quick start
1. Download packages
```shell
npm i -d
```
2. Create .env file
```text
PRIVATE_KEY = <"YOUR METAMASK PRIVATE KEY">
URL = <"ETHEREUM RPC YRL">
API_KEY_ETHERSCAN = = <"API KEY ETHERSCAN">
ALCHEMY_SOCKET = <"ALCHEMY_SOCKET_KEY">
DB data ...
```
3. Compile contracts
```shell
npx hardhat compile
```
4. Running node
```shell
npx hardhat run scripts/uniListener.js
npx hardhat run scripts/sushiListener.js
npx hardhat run server.js
```
5. Deploy contracts

http://localhost:3000/swaps
