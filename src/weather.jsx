import { useState, useEffect } from 'react';
function Weather() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(null);
  const [coatOfArmsData, setCoatOfArmsData] = useState([]);
  const [showImage, setShowImage] = useState(false);
  const [selectedCoat, setSelectedCoat] = useState(null);

  // Fetch the coat of arms data once on mount
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/stuffbymax/coats/refs/heads/main/db.json')
      .then((res) => res.json())
      .then((data) => {
        setCoatOfArmsData(data.coatOfArms || []);
      })
      .catch((err) => console.error('Failed to fetch coat of arms data:', err));
  }, []);

  async function getWeather() {
    if (!city.trim()) {
      alert('Please enter a city name');
      return;
    }

    // Find coat of arms by name (case-insensitive)
    const matchedCoat = coatOfArmsData.find(
      (coat) => coat.name.toLowerCase() === city.trim().toLowerCase()
    );

    if (matchedCoat) {
      setSelectedCoat(matchedCoat);
      setShowImage(true);
    } else {
      setSelectedCoat(null);
      setShowImage(false);
    }

    const apiKey = '3c91cc9ee330c7941f1e6e32f162356e'; // Your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${apiKey}`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.cod === 200) {
        setWeather(data);
        setWeatherError(null);
      } else {
        setWeather(null);
        setWeatherError('City not found. Try again.');
      }
    } catch (err) {
      setWeather(null);
      setWeatherError('Failed to fetch weather data.');
    }
    // to do add forecast and humidity
  }

  return (
    <div className="app">
      <h1>Weather APP (open weather api)</h1>
      <h4>
        Note: if the city name exists in multiple countries (e.g. Halifax), type it like Halifax,UK
      </h4>
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={getWeather}>Get Weather</button>

      <div id="result">
        {weather && (
          <>
            <h2>{weather.name}</h2>
            <p>
              {weather.weather[0].main} - {weather.weather[0].description}
            </p>
            <p>
              🌡️ Temp: {weather.main.temp}°C{' '}
              {weather.main.temp < 20 ? (
                <span className="coldContainer">
                  <span className="coldMessage">🥶 It's cold!</span>
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="particle coldParticle"
                      style={{
                        left: `${i * 15}px`,
                        animationDuration: `${2 + i}s`,
                        animationDelay: `${i * 0.5}s`,
                      }}
                    />
                  ))}
                </span>
              ) : (
                <span className="warmContainer">
                  <span className="warmMessage">🥵 It's warm!</span>
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className="particle warmParticle"
                      style={{
                        left: `${i * 15}px`,
                        animationDuration: `${1.5 + i}s`,
                        animationDelay: `${i * 0.3}s`,
                      }}
                    />
                  ))}
                </span>
              )}
            </p>
            <p>💨 Wind: {weather.wind.speed} m/s</p>
          </>
        )}

        {weatherError && <p style={{ color: 'red' }}>{weatherError}</p>}

        {/* Show image only if showImage=true and selectedCoat is set */}
        {showImage && selectedCoat && (
          <div style={{ marginTop: '20px' }}>
            <h3>Coat of Arms</h3>
            <img
              src={selectedCoat.image}
              alt={selectedCoat.name}
              style={{ maxWidth: '400px', height: 'auto' }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Weather;
