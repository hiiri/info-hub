const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const axios = require('axios');

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/electricity-price', async (req, res) => {
  try {
    const response = await axios.get('https://api.spot-hinta.fi/JustNow');
    const price = response.data.PriceWithTax;
    const dateTime = response.data.DateTime;

    console.log(response.data);

    res.json({ price, dateTime });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 5123;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));