const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { runScraper } = require('./scraper/hnScraper');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/stories', require('./routes/stories'));
app.use('/api/scrape', require('./routes/scrape'));

app.get('/', (req, res) => {
  res.json({ message: 'HN Scraper API is running' });
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    await runScraper();
    app.listen(PORT);
  })
  .catch((err) => {
    process.exit(1);
  });
