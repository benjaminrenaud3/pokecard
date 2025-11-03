const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

const callAll = require("../src/GetAll")
const callNames = require("../src/GetNames")
const callFiltered = require("../src/GetFiltered")

const path = require('path');

app.use(express.static(path.resolve(__dirname, '../../frontend/build')));

// Variable globale pour stocker les données en mémoire (sans cache avec TTL)
let globalData = null;

app.get("/getall", async (req, res) => {
    if (!globalData) {
        globalData = await callAll.getImage();
    }
    res.json({cachedData: globalData});
});

let globalNames = null;

app.get("/getnames", async (req, res) => {
  if (!globalNames) {
    globalNames = await callNames.getNames();
  }
  res.json({cachedData: globalNames});
});

app.get("/getone", async (req, res) => {
  // Convertir names en array si c'est une string
  let pokemon = req.query.names;
  if (typeof pokemon === 'string' && pokemon.length > 0) {
    pokemon = pokemon.split(',');
  } else if (!pokemon || pokemon.length === 0) {
    pokemon = [];
  }

  const generation = req.query.generation;

  // Utiliser les données globales
  if (!globalData) {
    globalData = await callAll.getImage();
  }

  let filtered = await callFiltered.getFiltered(pokemon, generation, globalData)
  res.json({filtered});
});

app.get("/getordered", async (req, res) => {
  const typeofOrdered = req.query.type

  // Utiliser les données globales
  if (!globalData) {
    globalData = await callAll.getImage();
  }

  let Ordered = await callFiltered.getOrdered(typeofOrdered, globalData)
  res.json({Ordered});
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/build/index.html'));
});