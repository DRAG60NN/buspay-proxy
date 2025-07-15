const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const store = {}; // Память: код → данные

// POST /store — сохраняем данные
app.post('/store', (req, res) => {
  const { code, result } = req.body;
  if (!code || !result) {
    return res.status(400).json({ error: 'Missing code or result' });
  }
  store[code] = {
    data: result,
    timestamp: Date.now()
  };
  res.json({ success: true });
});

// GET /get?code=ABC123 — получаем данные
app.get('/get', (req, res) => {
  const code = req.query.code;
  if (!code || !store[code]) {
    return res.status(404).json({ error: 'Code not found' });
  }

  // Автоудаление по времени (например, 5 минут)
  const maxAge = 1000 * 60 * 5;
  if (Date.now() - store[code].timestamp > maxAge) {
    delete store[code];
    return res.status(410).json({ error: 'Expired' });
  }

  res.json(store[code].data);
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
