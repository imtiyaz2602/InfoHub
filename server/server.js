const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const express = require('express');
const cors = require('cors');
const axios = require('axios');

console.log('DOTENV loaded? OPENWEATHER_KEY present:', !!process.env.OPENWEATHER_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// Simple logger (dev)
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.url);
  next();
});

const PORT = process.env.PORT || 3001;

// --- Mock / fallback data ---
const QUOTES = [
  { quote: "Dream big, start small.", author: "Robin Sharma" },
  { quote: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { quote: "Do the best you can until you know better. Then when you know better, do better.", author: "Maya Angelou" },
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" }
];

const FALLBACK_RATES = { USD: 0.012, EUR: 0.011 };

/** Helper: safe JSON response */
function sendJson(res, obj, status = 200) {
  return res.status(status).json(obj);
}

/** Health check */
app.get('/api/health', (req, res) => sendJson(res, { ok: true, uptime: process.uptime() }));

/** Quote */
app.get('/api/quote', (req, res) => {
  try {
    const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    return sendJson(res, { ok: true, ...q });
  } catch (err) {
    console.error('Quote error:', err?.message || err);
    return sendJson(res, { error: 'Could not fetch quote' }, 500);
  }
});

/** Weather: /api/weather?city=... */
app.get('/api/weather', async (req, res) => {
  const city = (req.query.city || '').trim();
  if (!city) return sendJson(res, { error: 'city query param required' }, 400);

  const key = process.env.OPENWEATHER_KEY;

  try {
    if (key) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${key}`;
      const r = await axios.get(url, { timeout: 8000 });
      const d = r.data;
      // defensive extraction
      const temp_c = typeof d?.main?.temp === 'number' ? d.main.temp : null;
      const description = d?.weather?.[0]?.description || '';
      const name = d?.name || city;
      return sendJson(res, { ok: true, city: name, temp_c, description });
    } else {
      // fallback mock
      const temps = [18.3, 20.5, 23.1, 25.0, 27.2];
      const desc = ['clear sky', 'few clouds', 'scattered clouds', 'light rain', 'overcast'];
      const temp_c = temps[Math.floor(Math.random() * temps.length)];
      const description = desc[Math.floor(Math.random() * desc.length)];
      return sendJson(res, { ok: true, city, temp_c, description });
    }
  } catch (err) {
    // detailed debug log (safe for dev)
    console.error('Weather error message:', err?.message);
    console.error('Weather error response status:', err?.response?.status);
    console.error('Weather error response data:', err?.response?.data);

    const status = err?.response?.status;

    if (status === 401) {
      return sendJson(res, { error: 'Invalid OpenWeather API key. Please set OPENWEATHER_KEY in server/.env.' }, 401);
    }
    if (status === 404) {
      return sendJson(res, { error: 'city not found' }, 404);
    }

    const providerMsg = err?.response?.data?.message;
    if (providerMsg) {
      return sendJson(res, { error: `Provider error: ${providerMsg}` }, status || 500);
    }

    return sendJson(res, { error: 'Could not fetch weather data.' }, 500);
  }
});

/** Currency: /api/currency?amount=100 */
app.get('/api/currency', async (req, res) => {
  const raw = req.query.amount;
  if (raw === undefined) return sendJson(res, { error: 'amount query param required' }, 400);

  const amount = Number(raw);
  if (Number.isNaN(amount) || amount < 0) return sendJson(res, { error: 'amount must be a non-negative number' }, 400);

  try {
    const url = `https://api.exchangerate.host/latest?base=INR&symbols=USD,EUR`;
    const r = await axios.get(url, { timeout: 7000 });
    const rates = r.data?.rates || {};
    const rateUsd = typeof rates.USD === 'number' ? rates.USD : FALLBACK_RATES.USD;
    const rateEur = typeof rates.EUR === 'number' ? rates.EUR : FALLBACK_RATES.EUR;

    const usd = Number((amount * rateUsd).toFixed(4));
    const eur = Number((amount * rateEur).toFixed(4));

    return sendJson(res, { ok: true, from: 'INR', amount, usd, eur, rateUsd, rateEur });
  } catch (err) {
  console.warn('Exchange fetch failed, using fallback rates:', err?.message || err);
  const rateUsd = FALLBACK_RATES.USD;
  const rateEur = FALLBACK_RATES.EUR;
  const usd = Number((amount * rateUsd).toFixed(4));
  const eur = Number((amount * rateEur).toFixed(4));
  return sendJson(res, {
    error: 'Could not fetch live exchange rates; returned fallback values',
    ok: false,
    from: 'INR',
    amount,
    usd,
    eur,
    rateUsd,
    rateEur
  }, 500);
}

});


/** Start server */
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
