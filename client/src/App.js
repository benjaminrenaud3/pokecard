import React, { useState, useEffect } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import "./App.css";
import pokeball from './assets/Pokeball.png';

function App() {
  const [data, setData] = useState(null);
  const [names, setNames] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [filtres, setFiltres] = useState({
    Names: ["Bulbizarre"],
    Generation: 1,
    Possede: ""
  });

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/getall")
      const data = await response.json()
      setData(data['cachedData'])
    }
    async function fetchNames() {
      const response = await fetch("/getnames")
      const data = await response.json()
      setNames(data['cachedData'])
      setIsLoading(false)
    }
    fetchData();
    fetchNames();
  }, []);

  function handleFilterChange(key, value, setFiltres) {
    setFiltres(prevState => ({
      ...prevState,
      [key]: value
    }));
  }

  const handleRecherche = async () => {
    console.log(filtres.Generation, filtres.Names)
    const response = await fetch(`/getone?generation=${filtres.Generation}&names=${filtres.Names}`)
    const data = await response.json()
    setData(data['filtered'])
  };


  // Object.entries(data).map((data, index) => (
  //   <div key={index} className="Liste">
  //     {console.log(data)}
  //   </div>
  // ))

  // console.log(names)

  return (
    <div className="App">
      <header className="App-header">
        <div className='Selection'>
        {!isLoading ?
          <div>
            <Autocomplete className='SelectionName'
            multiple
            id="tags-standard"
            name="Names"
            options={names}
            getOptionLabel={(option) => option}
            defaultValue={[names[0]]}
            onChange={(event, value) => handleFilterChange("Names", value, setFiltres)}
            renderInput={(params) => (
              <TextField
                {...params}
                variant="standard"
                size="large"
                label="Names"
                placeholder="Pokemon"
              />
            )}
            />
            <Select
              variant="standard"
              name='Generation'
              className='SelectionGen'
              onChange={(event) => handleFilterChange("Generation", event.target.value, setFiltres)}
              label="Generation"
              value={filtres.Generation}
            >
              <MenuItem value={1}>1er Gen</MenuItem>
              <MenuItem value={2}>2eme Gen</MenuItem>
              <MenuItem value={3}>3eme Gen</MenuItem>
              <MenuItem value={4}>4eme Gen</MenuItem>
              <MenuItem value={5}>5eme Gen</MenuItem>
              <MenuItem value={6}>6eme Gen</MenuItem>
              <MenuItem value={7}>7eme Gen</MenuItem>
              <MenuItem value={8}>8eme Gen</MenuItem>
            </Select>
          </div>
        : ''}
        <Button variant="contained" className='SelectionSearch' onClick={handleRecherche}>Rechercher</Button>
        </div>
        <div className="Liste">
          {data && !isLoading ?
          Object.entries(data).map((data, index) => (
            <div key={index} className="ListeOfCard">
              <img src={data[1]['image'] ? data[1]['image'] : 'https://images.pokemontcg.io/'} width="100" height="150" alt="pokemon"/>
            </div>
          )):
          <img src={pokeball} alt="waiting ball" className='pokeball'></img>}
        </div>
      </header>
    </div>
  );
}

export default App;