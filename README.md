# InfoHub — ByteXL Coding Challenge

Small full-stack app combining Weather, Currency (INR→USD/EUR) and Motivational Quotes.

## What’s included
- `client/` — React (Vite) frontend
  - `src/components/WeatherModule.jsx`
  - `src/components/CurrencyConverter.jsx`
  - `src/components/QuoteGenerator.jsx`
- `server/` — Node.js + Express backend
  - `server.js` exports 3 endpoints:
    - `GET /api/weather?city=...`
    - `GET /api/currency?amount=...`
    - `GET /api/quote`
- `.env` (local, not committed) holds `OPENWEATHER_KEY` for live weather.

## Local development (recommended)
1. Clone the repo:
   ```bash
   git clone <repo-url>
   cd InfoHub-Challenge
