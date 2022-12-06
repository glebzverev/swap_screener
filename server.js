const express = require("express");
const bodyParser = require('body-parser')
const {watchThousand} = require("./scripts/db.js");

const app = express();
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
  
app.get("/", function (request, response) {
    response.sendFile(__dirname + "/index.html");
});

function checkBoth(val){
    var uni = false 
    var sushi = false 
    console.log(val)
    val.forEach((v)=>{
        if (v[0] == "uniswap")
            uni = true;
        if (v[0] == 'sushiswap')
            sushi = true;
    })
    console.log(sushi, uni);
    return uni & sushi
}

app.get("/swaps", async (request, response) => {
    let res = await watchThousand()
    var timestamp = {}
    res.forEach((val)=>{
        if (! (val['timestamp'] in timestamp)){
            timestamp[val['timestamp']] = {"buy":[], "sell":[]}
        }
            if (val['side'] == 'buy'){
                timestamp[val['timestamp']]['buy'].push([val['dex_name'], val])
            }else{
                timestamp[val['timestamp']]['sell'].push([val['dex_name'], val])
            }
        })
    var selected = {'buy':[], 'sell':[]}
    for (var i in timestamp){
        var val = timestamp[i]
        if (checkBoth(val['buy'])){
            selected['buy'].push(val['buy'])
        }
        
        if (checkBoth(val['sell'])){
            selected['sell'].push(val['sell'])
        }
    }
    console.log(timestamp);
    console.log(selected);

    response.status(200).json({
        "all_swaps": res,
        "selected_swaps": selected
    }); 

});
   
app.listen(80, ()=>console.log("Сервер запущен..."));

