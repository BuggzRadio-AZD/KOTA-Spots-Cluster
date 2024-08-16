const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/mapData', { useNewUrlParser: true, useUnifiedTopology: true });

// Define schema and model
const locationSchema = new mongoose.Schema({
  lat: Number,
  lon: Number,
  frequency: String,
  duration: Number
});

const Location = mongoose.model('Location', locationSchema);

// Create endpoint to add new location
app.post('/api/locations', async (req, res) => {
  const { lat, lon, frequency, duration } = req.body;
  const location = new Location({ lat, lon, frequency, duration });
  await location.save();
  res.status(201).send(location);
});

// Create endpoint to get all locations
app.get('/api/locations', async (req, res) => {
  const locations = await Location.find();
  res.send(locations);
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Start server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
