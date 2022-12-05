require("dotenv").config();
const ethers = require("ethers")

const Pool = require('pg').Pool;
const pool = new Pool({
  user: process.env.user,
  host: process.env.host,
  database: process.env.database,
  password: process.env.password,
  port: process.env.port,
});
 
async function dropTable(){
    pool.query(`DROP TABLE IF EXISTS swaps;`).then((results, error) => {
        if (error) {
          console.log(error);
        } else {
        console.log(results.command);
        }
    });
}

async function createSwapsTable(){
    pool.query(`CREATE TABLE IF NOT EXISTS swaps  (
        "dex_name" varchar(20) NOT NULL,
        "price" FLOAT NOT NULL,
        "size" FLOAT NOT NULL,
        "side" varchar(20) NOT NULL,
        "timestamp" INT NOT NULL
    );`).then((results, error) => {
        if (error) {
          console.log(error);
        } else {
        console.log(results);
        }
    });
}

async function addSwap(s1, s2,s3, s4, s5){
    pool.query(`
    INSERT INTO swaps
    VALUES ('${s1}', ${s2},${s3},'${s4}',${s5});
    `)
    .then((results, error) => {
        if (error) {
          return (error);
        } else {
            return (results); 
        }
    });
}

async function watchThousand(){
    const provider = new ethers.providers.WebSocketProvider(
        `wss://eth-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_SOCKET}`
    )
    let block = await provider.getBlockNumber()

    let res = await pool.query(`
    SELECT * FROM swaps WHERE timestamp > ${block-1000};
    `)
    return res.rows
}

exports.addSwap = addSwap;
exports.watchThousand = watchThousand;



