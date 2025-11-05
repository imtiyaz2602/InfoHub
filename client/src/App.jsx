import React, { useState } from 'react';
import WeatherModule from './components/WeatherModule';
import CurrencyConverter from './components/CurrencyConverter';
import QuoteGenerator from './components/QuoteGenerator';

export default function App() {
  const [activeTab, setActiveTab] = useState('Weather');

  return (
    <div style={{ maxWidth: 700, margin: '24px auto', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <h1>InfoHub App</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        {['Weather', 'Currency', 'Quote'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 12px',
              borderRadius: 8,
              border: activeTab === tab ? '2px solid #333' : '1px solid #ddd',
              background: activeTab === tab ? '#f0f0f0' : '#fff'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      <div style={{ padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
        {activeTab === 'Weather' && <WeatherModule />}
        {activeTab === 'Currency' && <CurrencyConverter />}
        {activeTab === 'Quote' && <QuoteGenerator />}
      </div>
    </div>
  );
}
