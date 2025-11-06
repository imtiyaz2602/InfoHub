import React, { useState } from 'react';

export default function WeatherModule() {
  const [city, setCity] = useState('');
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function fetchWeather() {
    if (!city.trim()) {
      setError('Please enter a city name');
      return;
    }

    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const text = await res.text();

      let j;
      try {
        j = JSON.parse(text);
      } catch {
        j = { error: text };
      }

      console.log('Weather response:', res.status, j);

      if (!res.ok) {
        setError(j.error || `Server returned ${res.status}`);
      } else {
        setData(j);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(`Network error: ${err.message || 'Failed to fetch'}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="weather-module">
      <div className="weather-header">
        <h3 className="weather-title">Weather Info</h3>
      </div>

      <div className="weather-controls">
        <input
          className="weather-input"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city name"
        />
        <button className="weather-btn" onClick={fetchWeather}>
          Search
        </button>
      </div>

      {isLoading && <div className="loading">Loading...</div>}

      {error && (
        <div className="weather-error" style={{ color: 'crimson', marginTop: '10px' }}>
          {error}
        </div>
      )}

      {!isLoading && !error && data && (
        <div className="weather-card" style={{ marginTop: '16px' }}>
          <div className="weather-icon">🌤️</div>
          <div className="weather-main">
            <div className="weather-temp">
              {data.temp_c === null || data.temp_c === undefined ? 'N/A' : `${data.temp_c} °C`}
            </div>
            <div className="weather-desc">{data.description || 'N/A'}</div>
            <div className="weather-meta">City: {data.city}</div>
          </div>
        </div>
      )}
    </div>
  );
}
