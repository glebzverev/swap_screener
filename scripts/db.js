require("dotenv").config();
// const types = require('pg').types;
const ethers = require("ethers")


const Pool = require('pg').Pool;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ozma',
  password: 'password',
  port: 5432,
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

async function main(){
    // await watchThousand().then(console.log);
}

exports.addSwap = addSwap;
exports.watchThousand = watchThousand;

// main().catch((error) => {
//     console.error(error);
//     process.exitCode = 1;
//   });

