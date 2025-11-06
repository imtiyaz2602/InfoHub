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

      if (!res.ok) {
        setError(j.error || 'Failed to fetch quote');
      } else {
        setQuote(j);
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="quote-module">
      <div className="quote-controls">
        <button className="quote-btn" onClick={getQuote}>
          Get Quote
        </button>
      </div>

      {isLoading && <div className="loading">Loading...</div>}

      {error && <div className="quote-error">{error}</div>}

      {quote && (
        <div className="quote-card">
          <p className="quote-text">“{quote.quote}”</p>
          <p className="quote-author">— {quote.author}</p>
        </div>
      )}
    </div>
  );
}
