import React, { useState } from 'react';
import viteLogo from './assets/logo.svg'
import Weather from './weather';
import Catvoter from './catvoter';
import Poke from './poke';
import ImageFetcher from './image';
import Meteocast from './meteocast';
import Weathermeo from './weather_meteo';
import './App.css'

// if you dont want a specific api (function) delete the import <function> and then delete <button></button> that links to the function
// also the css isnt optimised for phones so expect different behaviors so i recomend you to just delete the App.css or update it. 
// also some functions may have some CSS included  

function App() {
  const [activeComponent, setActiveComponent] = useState('weather_meteo');

  const renderComponent = () => {
    switch (activeComponent) {
      case 'weather':
        return <Weather />;
      case 'catvoter':
        return <Catvoter />;
      case 'pokedex':
        return <Poke/>;
      case 'image':
        return <ImageFetcher/>;
      case 'meteocast':
        return <Meteocast/>;
      case 'opencast':
        return <Opencast/>;
      case 'weather_meteo':
        return <Weathermeo/>;
      default:
        return <div>Select a component</div>;
    }
  };

  return (
    <div>
      <nav>
        <button onClick={() => setActiveComponent('weather_meteo')}>Weather(Open-Meteo)</button>
        <button onClick={() => setActiveComponent('weather')}>Weather (OpenWeatherAPI)</button>
        <button onClick={() => setActiveComponent('catvoter')}>cat voter</button>
        <button onClick={() => setActiveComponent('pokedex')}>pokedex</button>
        <button onClick={() => setActiveComponent('image')}>Coats of arms Fetcher</button>
        <button onClick={() => setActiveComponent('meteocast')}>7 Day Wether Cast (metroAPI)</button>
        
      </nav>
      <div style={{ marginTop: '2px' }}>
        {renderComponent()}
      </div>
    </div>
  );
}

export default App;
