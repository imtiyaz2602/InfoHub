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
    <div>
      <div style={{ marginBottom: 12 }}>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          style={{ padding: 8, width: 160, marginRight: 8 }}
        />
        <button onClick={convert} style={{ padding: '8px 12px' }}>Convert (INR →)</button>
      </div>

      {isLoading && <div>Loading...</div>}
      {error && <div style={{ color: 'crimson' }}>{error}</div>}

      {data && (
        <div>
          <div>USD: <strong>{data.usd}</strong></div>
          <div>EUR: <strong>{data.eur}</strong></div>
          <div style={{ marginTop: 8, color: '#666', fontSize: 13 }}>
            Rates: USD={data.rateUsd} EUR={data.rateEur} {data.note ? `(${data.note})` : ''}
          </div>
        </div>
      )}
    </div>
  );
}
