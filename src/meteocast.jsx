import { useState, useEffect } from 'react';
//this is still just for testing
function Opencast() {
  // No API key needed for Open‑Meteo itself
  const [city, setCity] = useState('Halifax, UK');
  const [forecast, setForecast] = useState([]);  // daily forecast
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Geocode city name to lat/lon using a free geocoding service (e.g. Nominatim)
  const geocodeCity = async (cityName) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Geocoding failed');
    const data = await res.json();
    if (!data || data.length === 0) {
      throw new Error('City not found');
    }
    const { lat, lon } = data[0];
    return { lat: parseFloat(lat), lon: parseFloat(lon) };
  };

  // Fetch forecast from Open‑Meteo
  const fetchForecast = async (lat, lon) => {
    // We request daily forecast (max/min temperature, weather code, etc.)
    const params = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      daily: 'weathercode,temperature_2m_max,temperature_2m_min',
      timezone: 'auto',  // so times are in local timezone
    });
    const url = `https://api.open-meteo.com/v1/forecast?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error('Forecast is not available');
    }
    const data = await res.json();
    if (!data.daily || !data.daily.time) {
      throw new Error('Invalid forecast data');
    }

    // Combine arrays into objects for ease of rendering
    const days = data.daily.time.map((dateStr, idx) => ({
      date: dateStr,
      max: data.daily.temperature_2m_max[idx],
      min: data.daily.temperature_2m_min[idx],
      weathercode: data.daily.weathercode[idx],  // you can map this code to an icon/text
    }));
    return days;
  };

  const getWeather = async (cityName = city) => {
    try {
      setLoading(true);
      setError(null);
      setForecast([]);

      //  Geocode to lat/lon
      const { lat, lon } = await geocodeCity(cityName);

      // Fetch forecast
      const days = await fetchForecast(lat, lon);
      setForecast(days);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWeather();
  }, []);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      getWeather(city);
    }
  };

  // A helper to map weather codes to a description or icon (very minimal)
  const weatherCodeToText = (code) => {
    const mapping = {
      0: 'Clear',
      1: 'Mainly Clear',
      2: 'Partly Cloudy',
      3: 'Overcast',
      61: 'Rain',
      63: 'Heavy Rain',
      71: 'Snow',
      95: 'Thunderstorm',
      //to do add more mappings based on Open‑Meteo docs
    };
    return mapping[code] || `Code ${code}`;
  };

  return (
    <div className="app">
      <h1>7-Day Forecast (Open‑Meteo)</h1>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={handleKeyPress}
          style={{ padding: '0.5rem', marginRight: '0.5rem' }}
        />
        <button onClick={() => getWeather(city)} disabled={loading}>
          {loading ? 'Loading...' : 'Get Weather'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {forecast.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem',
          }}
        >
          {forecast.map((day, i) => (
            <div
              key={i}
              style={{
                background: '#302525ff',
                padding: '1rem',
                borderRadius: '10px',
                width: '140px',
                textAlign: 'center',
              }}
            >
              <p>
                {new Date(day.date).toLocaleDateString(undefined, {
                  weekday: 'short',
                })}
              </p>
              <p>{day.date}</p>
              <p>Max: {Math.round(day.max)}°C</p>
              <p>Min: {Math.round(day.min)}°C</p>
              <p>{weatherCodeToText(day.weathercode)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Opencast;
