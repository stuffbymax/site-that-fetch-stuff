import { useState, useEffect } from 'react';
function Weathermeo() {
  const [city, setCity] = useState('');
  const [cityOptions, setCityOptions] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState(null);
  const [coatOfArmsData, setCoatOfArmsData] = useState([]);
  const [showImage, setShowImage] = useState(false);
  const [selectedCoat, setSelectedCoat] = useState(null);

  // Fetch coat of arms data once
  useEffect(() => {
    fetch('https://raw.githubusercontent.com/stuffbymax/coats/refs/heads/main/db.json')
      .then((res) => res.json())
      .then((data) => {
        setCoatOfArmsData(data.coatOfArms || []);
      })
      .catch((err) => console.error('Failed to fetch coat of arms data:', err));
  }, []);

  // Function to get city options
  async function getCityOptions() {
    if (!city.trim()) {
      alert('Please enter a city name');
      return;
    }

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        setWeather(null);
        setCityOptions([]);
        setWeatherError('City not found. Try again.');
        return;
      }

      if (geoData.results.length === 1) {
        handleCitySelection(geoData.results[0]);
      } else {
        setCityOptions(geoData.results);
        setWeather(null);
        setWeatherError(null);
      }
    } catch (err) {
      setWeather(null);
      setCityOptions([]);
      setWeatherError('Failed to fetch city data.');
    }
  }

  // Function to fetch weather for a selected city
async function handleCitySelection(cityData) {
  setSelectedCity(cityData);
  setCityOptions([]);
  setCity(cityData.name);

  try {
    const weatherRes = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${cityData.latitude}&longitude=${cityData.longitude}&current_weather=true&hourly=temperature_2m,windspeed_10m,relativehumidity_2m&timezone=auto`
    );
    const weatherData = await weatherRes.json();

    console.log('Fetched weather data:', weatherData);

    let temperature = null, wind_speed = null, weather_code = null, humidity = null;

    if (weatherData.current_weather) {
      temperature = weatherData.current_weather.temperature;
      wind_speed = weatherData.current_weather.windspeed;
      weather_code = weatherData.current_weather.weathercode;

      const idx = weatherData.hourly?.time?.indexOf(weatherData.current_weather.time);
      humidity = (weatherData.hourly?.relativehumidity_2m && idx !== -1)
        ? weatherData.hourly.relativehumidity_2m[idx]
        : weatherData.hourly?.relativehumidity_2m?.[0] ?? null;
    } else if (weatherData.hourly) {
      temperature = weatherData.hourly.temperature_2m[0];
      wind_speed = weatherData.hourly.windspeed_10m?.[0] ?? null;
      humidity = weatherData.hourly.relativehumidity_2m?.[0] ?? null;
    }

    setWeather({
      name: cityData.name,
      temperature,
      wind_speed,
      weather_code,
      humidity,
    });

    setWeatherError(weatherData.current_weather ? null : 'Current weather not available. Showing nearest hourly data.');
  } catch (err) {
    console.error(err);
    setWeather(null);
    setWeatherError('Failed to fetch weather data.');
  }
}


  // Simple weather code to description mapper
  function weatherDescription(code) {
    const mapping = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      56: 'Light freezing drizzle',
      57: 'Dense freezing drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      66: 'Light freezing rain',
      67: 'Heavy freezing rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      77: 'Snow grains',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      85: 'Slight snow showers',
      86: 'Heavy snow showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail',
    };
    return mapping[code] || 'Unknown';
  }

  return (
    <div className="app">
      <h1>Weather APP (Open-Meteo)</h1>
      <input
        type="text"
        placeholder="Enter city name"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <button onClick={getCityOptions}>Get Weather</button>

      <div id="result">
        {cityOptions.length > 1 && (
          <div className="city-options-box">
            <h4>Select your city:</h4>
            <ul>
              {cityOptions.map((c) => (
                <li key={`${c.name}-${c.latitude}-${c.longitude}`}>
                  <button onClick={() => handleCitySelection(c)}>
                    {c.name}, {c.country} {c.admin1 ? `(${c.admin1})` : ''}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {weather && (
          <>
            <h2>{weather.name}</h2>
            <p>{weatherDescription(weather.weather_code)}</p>
            <p>
              🌡️ Temp: {weather.temperature}°C{' '}
              {weather.temperature < 20 ? '🥶 It\'s cold!' : '🥵 It\'s warm!'}
            </p>
            <p>💨 Wind: {weather.wind_speed} m/s</p>
            <p>💧 Humidity: {weather.humidity}%</p>
          </>
        )}

        {weatherError && <p style={{ color: 'red' }}>{weatherError}</p>}

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

export default Weathermeo;
