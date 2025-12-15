import { useState, useEffect } from 'react';
function CoatOfArmsFetcher() {
  const [city, setCity] = useState('');
  const [coatOfArmsData, setCoatOfArmsData] = useState([]);
  const [selectedCoat, setSelectedCoat] = useState(null);

  // Fetch coat of arms data once on mount
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/stuffbymax/coats/refs/heads/main/db.json')
      .then((res) => res.json())
      .then((data) => {
        setCoatOfArmsData(data.coatOfArms || []);
      })
      .catch((err) => console.error('Failed to fetch coat of arms data:', err));
  }, []);

  function handleSearch() {
    if (!city.trim()) {
      alert('Please enter a city name');
      return;
    }

    const matchedCoat = coatOfArmsData.find(
      (coat) => coat.name.toLowerCase() === city.trim().toLowerCase()
    );

    if (matchedCoat) {
      setSelectedCoat(matchedCoat);
    } else {
      alert('No coat of arms found for that city.');
      setSelectedCoat(null);
    }
  }

// add here if original eg czech etc = null do not display it

// also rename czech to original 


  return (
    <div>
      <h1>Coat of Arms Finder</h1>
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={handleSearch}>Show Coat of Arms</button>

      {selectedCoat && (
        <div style={{ marginTop: '20px' }}>
          <h2>{selectedCoat.name}</h2>
          <img
            src={selectedCoat.image}
            alt={`Coat of Arms of ${selectedCoat.name}`}
            style={{ maxWidth: '400px', height: 'auto' }}
          />
          <p>{selectedCoat.description}</p>
          <p><strong>API image ID</strong> <strong>{selectedCoat.id}</strong></p>
          <p><strong>created</strong> {selectedCoat.createdAt}</p>
          <p><strong>Latin:</strong> {selectedCoat.motto.latin}</p>
          <p><strong>English:</strong> {selectedCoat.motto.english}</p>
          <p><strong>czech:</strong> {selectedCoat.motto.czech}</p>
          <p><strong>designer</strong> {selectedCoat.designer}</p>
          {/* <p><strong>symbols</strong> {selectedCoat.symbols.type}</p>
          <p><strong>symbols</strong> {selectedCoat.symbols.position}</p>
          <p><strong>symbols</strong> {selectedCoat.symbols.color}</p>
          <p><strong>symbols</strong> {selectedCoat.shieldShape}</p> */}
          
        </div>
      )}
    </div>
  );
}

export default CoatOfArmsFetcher;
