// /api/sofascore.js
import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  try {
    const response = await axios.get('https://www.sofascore.com/football/livescore', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36',
      },
    });
    
    const html = response.data;
    const $ = cheerio.load(html);

    const matches = [];

    $('.event-row').each((i, el) => {
      const team1 = $(el).find('.cell__content').eq(0).text().trim();
      const team2 = $(el).find('.cell__content').eq(1).text().trim();
      const score = $(el).find('.cell__content').eq(2).text().trim();

      matches.push({ team1, team2, score });
    });

    res.status(200).json({ matches });
  } catch (err) {
    console.error('Error scraping SofaScore:', err.message);
    res.status(500).json({ error: 'Scraping failed' });
  }
}
