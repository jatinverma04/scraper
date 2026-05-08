const { runScraper } = require('../scraper/hnScraper');

const triggerScrape = async (req, res) => {
  try {
    const result = await runScraper();
    res.json({ message: 'Scrape completed successfully', ...result });
  } catch (err) {
    res.status(500).json({ message: 'Scrape failed', error: err.message });
  }
};

module.exports = { triggerScrape };
