const axios = require('axios');
const cheerio = require('cheerio');
const Story = require('../models/Story');

const HN_URL = process.env.HN_URL || 'https://news.ycombinator.com';

const runScraper = async () => {
  try {
    const { data } = await axios.get(HN_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      timeout: 10000,
    });

    const $ = cheerio.load(data);
    const stories = [];

    $('.athing').slice(0, 10).each((i, el) => {
      const id = $(el).attr('id');
      const titleEl = $(el).find('.titleline > a').first();
      const title = titleEl.text().trim();
      const url = titleEl.attr('href') || `${HN_URL}/item?id=${id}`;

      const subEl = $(el).next();
      const pointsText = subEl.find('.score').text().trim();
      const points = pointsText
        ? parseInt(pointsText.replace(' points', '').replace(' point', ''))
        : 0;
      const author = subEl.find('.hnuser').text().trim() || 'unknown';
      const postedAt =
        subEl.find('.age').attr('title') ||
        subEl.find('.age').text().trim() ||
        '';

      if (id && title) {
        stories.push({ hnId: id, title, url, points, author, postedAt });
      }
    });

    if (stories.length === 0) {
      return { scraped: 0 };
    }

    let upsertCount = 0;
    for (const story of stories) {
      await Story.findOneAndUpdate(
        { hnId: story.hnId },
        { $set: story },
        { upsert: true, new: true }
      );
      upsertCount++;
    }
    return { scraped: upsertCount };
  } catch (err) {
    throw err;
  }
};

module.exports = { runScraper };
