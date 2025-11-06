import React, { useState } from 'react';

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1000);
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function convert() {
    setLoading(true);
    setError('');
    setData(null);

    try {
      const res = await fetch(`/api/currency?amount=${encodeURIComponent(amount)}`);
      const j = await res.json();

      if (!res.ok) setError(j.error || 'Failed to fetch rates');
      else setData(j);
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="converter">
      <h3 className="weather-title">Currency Converter</h3>

      <div className="converter-form">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="converter-input"
          placeholder="Amount (INR)"
        />

        <button className="converter-btn" onClick={convert}>
          Convert (INR →)
        </button>
      </div>

      {isLoading && <div className="loading">Loading...</div>}
      {error && <div className="converter-error">{error}</div>}

      {data && (
        <div className="converter-result">
          <div>USD: <strong>{data.usd}</strong></div>
          <div>EUR: <strong>{data.eur}</strong></div>
          <div className="converter-note">
            Rates: USD={data.rateUsd} EUR={data.rateEur}{' '}
            {data.note ? `(${data.note})` : ''}
          </div>
        </div>
      )}
    </div>
  );
}
