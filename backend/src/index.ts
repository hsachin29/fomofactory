import axios from 'axios';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();
const port = 3000;
const mongoUri = 'mongodb://127.0.0.1:27017';
const apiEndpoint = 'https://api.livecoinwatch.com/coins/list' ;
const apiKey = 'dd075aa6-bb04-4cc8-a18f-01ea2f6e7183'; // Replace with your Live Coin Watch API key

console.log(mongoUri, apiEndpoint, apiKey);


import dotenv from 'dotenv';

dotenv.config();

// Define Mongoose schema and model
const deltaSchema = new mongoose.Schema({
  hour: Number,
  day: Number,
  week: Number,
  month: Number,
  quarter: Number,
  year: Number,
}, { _id: false });

const dataSchema = new mongoose.Schema({
  rate: Number,
  volume: Number,
  cap: Number,
  delta: deltaSchema,
}, { _id: false });

const priceSchema = new mongoose.Schema({
  crypto: { type: String, required: true },
  data: dataSchema,
  lastUpdated: { type: Date, default: Date.now },
});

const Price = mongoose.model('Price', priceSchema);

// Connect to MongoDB
mongoose.connect(mongoUri, {});

app.use(cors());
app.use(express.json());

// Fetch and store prices
async function fetchAndStorePrices() {
  try {
    // Fetch data from Live Coin Watch API
    const response = await axios.post(apiEndpoint, {
      currency: 'USD',
      sort: 'rank',
      order: 'ascending',
      offset: 0,
      limit: 20,
      meta: true
    }, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      }
    });

    const prices = response.data;
    await Price.deleteMany({}); // Clear existing data
    // Store data in MongoDB
    for (const price of prices) {
      await Price.updateOne(
        { crypto: price.code },
        {
          crypto: price.name,
          data: {
            rate: price.rate,
            volume: price.volume,
            cap: price.cap,
            delta: {
              hour: price.delta.hour,
              day: price.delta.day,
              week: price.delta.week,
              month: price.delta.month,
              quarter: price.delta.quarter,
              year: price.delta.year,
            },
          },
          lastUpdated: new Date(),
        },
        { upsert: true }
      );
    }

    console.log('Top 20 prices fetched and stored successfully!');
  } catch (error) {
    console.error('Error fetching or storing prices:', error);
  }
}

// Set an interval to fetch and store prices every 5 seconds
setInterval(fetchAndStorePrices, 5000);

// API endpoint to get prices
app.get('/api/prices', async (req, res) => {
  try {
    const prices = await Price.find();
    res.json(prices);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
