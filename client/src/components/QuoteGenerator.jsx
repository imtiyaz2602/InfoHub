import React, { useState } from 'react';

export default function QuoteGenerator() {
  const [quote, setQuote] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function getQuote() {
    setLoading(true);
    setError('');
    setQuote(null);
    try {
      const res = await fetch('/api/quote');
      const j = await res.json();
      if (!res.ok) setError(j.error || 'Failed to fetch quote');
      else setQuote(j);
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button onClick={getQuote} style={{ padding: '8px 12px', marginBottom: 12 }}>Get Quote</button>
      {isLoading && <div>Loading...</div>}
      {error && <div style={{ color: 'crimson' }}>{error}</div>}
      {quote && (
        <blockquote style={{ fontStyle: 'italic', marginTop: 12 }}>
          “{quote.quote}” — <strong>{quote.author}</strong>
        </blockquote>
      )}
    </div>
  );
}
