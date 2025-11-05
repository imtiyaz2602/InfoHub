import React, { useState } from 'react';

export default function WeatherModule() {
  const [city, setCity] = useState('hyd');
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function fetchWeather() {
    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
      const text = await res.text();

      // parse JSON if possible, otherwise treat as text
      let j;
      try { j = JSON.parse(text); } catch (e) { j = { error: text }; }

      // debug log
      console.log('Weather response status:', res.status, 'body:', j);

      if (!res.ok) {
        // show server-provided error, or a fallback message
        setError(j.error || `Server returned ${res.status}`);
      } else {
        setData(j);
      }
    } catch (err) {
      // Network-level error (no response from server)
      console.error('Fetch error:', err);
      setError(`Network error: ${err.message || 'Failed to fetch'}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="city"
          style={{ padding: '8px', marginRight: 8 }}
        />
        <button onClick={fetchWeather} style={{ padding: '8px 12px' }}>Search</button>
      </div>

      {isLoading && <div>Loading...</div>}

      {error && <div style={{ color: 'crimson' }}>{error}</div>}

      {!isLoading && !error && data && (
        <div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>{data.city}</div>
          <div style={{ marginTop: 8 }}>
            <span>Temperature: </span>
            <strong>{data.temp_c === null || data.temp_c === undefined ? 'N/A' : `${data.temp_c} °C`}</strong>
          </div>
          <div style={{ marginTop: 4 }}>Condition: {data.description || 'N/A'}</div>
        </div>
      )}
    </div>
  );
}
