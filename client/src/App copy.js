import React from 'react';
import "./App.css";

function App() {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => setData(data['info']));
  }, []);

  console.log(data)

  return (
    <div className="App">
      <header className="App-header">
      {data ?
      Object.entries(data).map((data, index) => (
        <div key={index} className="Liste">
          <img src={data[1]['image'] ? data[1]['image'] : ''} width="100" height="150" alt="pokemon"/>
        </div>
      )):'Waiting...'}
      </header>
    </div>
  );
}

export default App;