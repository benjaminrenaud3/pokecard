const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

const callAll = require("../src/GetAll")
const callNames = require("../src/GetNames")
const callFiltered = require("../src/GetFiltered")

const NodeCache = require("node-cache");
const cache = new NodeCache();

const path = require('path');

app.use(express.static(path.resolve(__dirname, '../../frontend/build')));

app.get("/getall", async (req, res) => {
    const key = "data"
    const cachedData = cache.get(key)

    if (cachedData) {
      res.json({cachedData});
    }
    else {
      const cachedData = await callAll.getImage()
      cache.set(key, cachedData, 259200)
      res.json({cachedData});
    }
});

app.get("/getnames", async (req, res) => {
  const key = "names"
  const cachedData = cache.get(key)

  if (cachedData) {
    res.json({cachedData});
  }
  else {
    const cachedData = await callNames.getNames()
    cache.set(key, cachedData, 3600)
    res.json({cachedData});
  }
});

app.get("/getone", async (req, res) => {
  const pokemon = req.query.names;
  const generation = req.query.generation;

  const key = "data"
  const cachedData = cache.get(key)

  let filtered = await callFiltered.getFiltered(pokemon, generation, cachedData)
  res.json({filtered});
});

app.get("/getordered", async (req, res) => {
  const typeofOrdered = req.query.type

  const key = "data"
  const cachedData = cache.get(key)

  let Ordered = await callFiltered.getOrdered(typeofOrdered, cachedData)
  res.json({Ordered});
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/build/index.html'));
});