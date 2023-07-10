const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();


app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/electricity-price', async (req, res) => {
  try {
    const response = await axios.get('https://api.spot-hinta.fi/JustNow');
    const price = response.data.PriceWithTax;
    const dateTime = response.data.DateTime;

    console.log({ price, dateTime });
    res.json({ price, dateTime });
  } catch (error) {
    console.error(error);

    res.status(500).json({ message: error.message });
  }
});

app.get('/weather/:city', async (req, res) => {
  const city = req.params.city;

  try {
    const forecastResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${process.env.OPENWEATHERMAP_API_KEY}`
    );
    const currentResponse = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.OPENWEATHERMAP_API_KEY}`
    );

    const weatherData = {
      forecast: forecastResponse.data,
      current: currentResponse.data,
    };

    res.json(weatherData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


const PORT = process.env.PORT || 5123;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));