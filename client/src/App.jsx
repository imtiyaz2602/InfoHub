// src/App.jsx
import React, { useState, useEffect, lazy, Suspense } from 'react';
import './index.css';

// Lazy load modules
const WeatherModule = lazy(() => import('./components/WeatherModule'));
const CurrencyConverter = lazy(() => import('./components/CurrencyConverter'));
const QuoteGenerator = lazy(() => import('./components/QuoteGenerator'));

export default function App() {
  const [activeTab, setActiveTab] = useState('Weather');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  // 🌓 Apply theme and add fade transition when it changes
  useEffect(() => {
    const root = document.documentElement;

    // Add temporary fade effect class
    root.classList.add('theme-fade');
    const t = setTimeout(() => root.classList.remove('theme-fade'), 400);

    // Apply theme mode
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Store preference
    localStorage.setItem('theme', theme);

    return () => clearTimeout(t);
  }, [theme]);

  return (
    <div className="app-container">
      {/* Header Section */}
      <header className="app-header">
        <h1 className="app-title">InfoHub App</h1>

        {/* Theme Switcher Button */}
        <div className="theme-switcher">
          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          >
            {theme === 'light' ? (
              <>
                🌞 <span>Light Mode</span>
              </>
            ) : (
              <>
                🌙 <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="tabs">
        {['Weather', 'Currency', 'Quote'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Dynamic Content */}
      <div className="content">
        <Suspense fallback={<div className="loading">Loading...</div>}>
          {activeTab === 'Weather' && <WeatherModule />}
          {activeTab === 'Currency' && <CurrencyConverter />}
          {activeTab === 'Quote' && <QuoteGenerator />}
        </Suspense>
      </div>
    </div>
  );
}
