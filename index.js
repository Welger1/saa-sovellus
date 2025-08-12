const express = require('express');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = 3001;

app.use(express.static('public'));

app.get('/forecast', async (req, res) => {
  const city = req.query.city;
  const apiKey = process.env.API_KEY;

  try {
    const result = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`);
    res.json(result.data);
  } catch (error) {
    res.status(500).send('Virhe haettaessa säätietoja.');
  }
});

app.listen(PORT, () => {
  console.log(`Palvelin käynnissä osoitteessa http://localhost:${PORT}`);
});
