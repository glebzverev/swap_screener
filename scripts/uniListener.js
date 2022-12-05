const ethers = require("ethers")
pairABI = require("../abi/Pair.json");
DEX = require("../DEX.json")
const {addSwap} = require("./db.js");


async function uniListener(){
    const uniPair = DEX["Pools"]["Uniswap"];
    const provider = new ethers.providers.WebSocketProvider(
        `wss://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_SOCKET}`
    )
    console.log("provider is on!")
    const contract = new ethers.Contract(uniPair, pairABI, provider);
    contract.on("Swap", async (  sender,  amount0In, amount1In,amount0Out,amount1Out,to, event) =>{
        let info = {
            amount0In: ethers.utils.formatUnits(amount0In, 18),
            amount1In: ethers.utils.formatUnits(amount1In, 6),
            amount0Out: ethers.utils.formatUnits(amount0Out, 18),
            amount1Out:ethers.utils.formatUnits(amount1Out, 6)
        }
        // console.log(JSON.stringify(info, null, 4));
        side = (ethers.utils.formatUnits(amount0In, 18)==0) ? "buy" : "sell";
        price = (side=="buy") ? info["amount1In"]/info["amount0Out"] : info["amount1Out"]/info["amount0In"]
        size = (side=="buy") ? info["amount1In"] : info["amount1Out"]
        let Info = {
            dex_name:"uniswap", 
            price:price,
            size: size,
            side: side,
            timestamp: event['blockNumber']
        }
        console.log(JSON.stringify(Info, null, 5));
        try{
            await addSwap(
            Info["dex_name"],
            Info["price"],
            Info["size"],
            Info["side"],
            Info["timestamp"],            
        ).then(()=> {console.log("added")})}
        catch(err){
            console.log(`error ${err}`)
        }
    })
}

uniListener();