import React, { useState, useEffect, useRef } from 'react';
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
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
  const [selectedCarte, setSelectedCarte] = useState(null);
  const [isOrdered, setOrder] = useState('');
  const [scrollPosition, setScrollPosition] = useState(0);

  const [filtres, setFilter] = useState({
    Names: [],
    Generation: 1,
    Possede: ""
  });

  const listRef = useRef(null);

  useEffect(() => {
    fetchData();
    fetchNames();
  }, []);

  async function fetchData() {
    const response = await fetch("/getall")
    const data = await response.json()
    setData(data['cachedData'])
    setOrder('')
  }

  async function fetchNames() {
    const response = await fetch("/getnames")
    const data = await response.json()
    setNames(data['cachedData'])
    setIsLoading(false)
  }

  function handleFilterChange(key, value) {
    setFilter(prevState => ({
      ...prevState,
      [key]: value
    }));
  }

  const handleRecherche = async () => {
    const response = await fetch(`/getone?generation=${filtres.Generation}&names=${filtres.Names}`)
    const data = await response.json()
    setData(data['filtered'])
  };

  async function handleOrdered(key, value) {
    const response = await fetch(`/getordered?type=${value}`)
    const data = await response.json()
    setData(data['Ordered'])
    setOrder(value)
  }

  function clearNames() {
    setFilter({
      Names: [],
      Generation: 1,
      Possede: ""
    });
  }

  function handleCarteClick(carte) {
    //console.log(listRef.current.scrollTop)
    setScrollPosition(listRef.current.scrollTop);
    setSelectedCarte(carte);
  }

  function handleBackToList() {
    //console.log(scrollPosition)
    setSelectedCarte(null);
    listRef.current.scrollTop = scrollPosition;
  }

  // Object.entries(data).map((data, index) => (
  //   <div key={index} className="Liste">
  //     {console.log(data)}
  //   </div>
  // ))

  //console.log(data)
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
            value={filtres.Names}
            options={names}
            getOptionLabel={(option) => option}
            defaultValue={[]}
            onChange={(event, value) => handleFilterChange("Names", value)}
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
            <div className='ClearName'>
            <Button variant="contained" color="primary" size="small" onClick={clearNames}>Clear names</Button>
            </div>

            <Select
              variant="standard"
              name='Generation'
              className='SelectionGen'
              onChange={(event) => handleFilterChange("Generation", event.target.value)}
              label="Generation"
              value={filtres.Generation}
            >
              <MenuItem value={1}>1st Gen</MenuItem>
              <MenuItem value={2}>2nd Gen</MenuItem>
              <MenuItem value={3}>3rd Gen</MenuItem>
              <MenuItem value={4}>4th Gen</MenuItem>
              <MenuItem value={5}>5th Gen</MenuItem>
              <MenuItem value={6}>6th Gen</MenuItem>
              <MenuItem value={7}>7th Gen</MenuItem>
              <MenuItem value={8}>8th Gen</MenuItem>
              <MenuItem value={9}>9th Gen</MenuItem>
            </Select>
          </div>
        : ''}
        <div className='SelectionSearch'>
          <Button variant="contained" onClick={handleRecherche}>Search</Button>
        </div>
        
        <div className='ClassOrderDiv'>
        <FormControl variant="standard" >
        <InputLabel id="classorder-label">Order By</InputLabel>
          <Select
            className='ClassOrder'
            name = "Order"
            value={isOrdered}
            label="Order"
            onChange={(event) => handleOrdered("Order", event.target.value)}
            >
            <MenuItem value={1}>Alphabetic order</MenuItem>
            <MenuItem value={2}>Reverse alphabetic order</MenuItem>
            <MenuItem value={3}>Price ascending</MenuItem>
            <MenuItem value={4}>Price descending</MenuItem>
            <MenuItem value={5}>Rarity ascending</MenuItem>
            <MenuItem value={6}>Rarity descending</MenuItem>
          </Select>
        </FormControl>
        </div>

        <div className='SelectionSearch'>
          <Button variant="contained" className='SelectionSearch' onClick={fetchData}>Display All</Button>
        </div>

        </div>
        <div className="Liste" ref={listRef}>
          {selectedCarte ? (
            <div className="ListeOfCard selected" onClick={() => handleBackToList()}>
              <img title={selectedCarte.Nom} src={selectedCarte.image ? selectedCarte.image : 'https://images.pokemontcg.io/'} width="100%" alt={selectedCarte.Nom} />
              <div className="carte-info">
                <p><strong>Name:</strong> {selectedCarte.name}</p>
                <p><strong>Description:</strong> {selectedCarte.desc}</p>
                <p><strong>Card ID:</strong> {selectedCarte.setid}</p>
                <p><strong>Card Set:</strong> {selectedCarte.setname}</p>
                <p><strong>Rarity:</strong> {selectedCarte.rarity}</p>
                <p><strong>Price Trend on Cardmarket:</strong> {selectedCarte.pricecardmarket}e</p>
                <p><strong>Market Price on TCGplayer:</strong> {selectedCarte.pricetcgplayer}e</p>
              </div>
            </div>
          ) : (
            data && !isLoading ?
            Object.entries(data).map((carte, index) => (
              <div key={index} className="ListeOfCard" onClick={() => handleCarteClick(carte[1])}>
                <img title={carte[1]["Nom"]} src={carte[1]['image'] ? carte[1]['image'] : 'https://images.pokemontcg.io/'} width="100" height="150" alt="pokemon"/>
              </div>
            )):
            <img src={pokeball} alt="waiting ball" className='pokeball'></img>
            )
          }
        </div>
      </header>
    </div>
  );
}

export default App;