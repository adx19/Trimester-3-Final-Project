import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  try {
    const response = await axios.get('https://www.sofascore.com/football/livescore');
    const html = response.data;
    const $ = cheerio.load(html);

    const matches = [];

    $('.event-row').each((i, el) => {
      const team1 = $(el).find('.event__participant--home').text().trim();
      const team2 = $(el).find('.event__participant--away').text().trim();
      const score = $(el).find('.event__scores').text().trim() || "-";
      const status = $(el).find('.event__stage--block').text().trim() || "TBD";

      matches.push({
        team1,
        team2,
        score,
        status,
        venue: "SofaScore",
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        team1Logo: "/default-logo.png", // Placeholder
        team2Logo: "/default-logo.png", // Placeholder
      });
    });

    res.status(200).json({ matches });
  } catch (err) {
    console.error('Error scraping SofaScore:', err.message);
    res.status(500).json({ error: 'Scraping failed' });
  }
}
