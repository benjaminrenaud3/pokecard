const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

const callExcel = require("../src/GetAll")
const NodeCache = require("node-cache");
const cache = new NodeCache();

app.get("/api", async (req, res) => {
    const key = "data"
    const cachedData = cache.get(key)

    if (cachedData) {
        console.log("is in cache")
        res.json({cachedData});
    }
    else {
        console.log("is not in cache")
        const info = await callExcel.getImage()
        cache.set(key, info, 3600)
        res.json({info});
    }
  //   info = {"0":{"Generation":1,"Num":1,"Nom":"Bulbizarre","Présents":"oui","ID":"pl3-93","image":"https://images.pokemontcg.io/pl3/93.png"},
  //   "1":{"Generation":1,"Num":2,"Nom":"Bulbizarre","Présents":"oui","ID":"pl3-93","image":"https://images.pokemontcg.io/pl3/93.png"}}
  });

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

