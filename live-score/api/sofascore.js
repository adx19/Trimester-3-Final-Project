const axios = require('axios');
const cheerio = require('cheerio');

export default async function handler(req, res) {
  try {
    const response = await axios.get("https://www.sofascore.com/football/livescore", {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Dummy example logic — replace this with your own logic
    const matches = [];

    $(".event__match").each((_, element) => {
      const team1 = $(element).find(".event__participant--home").text().trim();
      const team2 = $(element).find(".event__participant--away").text().trim();
      const score = $(element).find(".event__scores").text().trim();
      const status = $(element).find(".event__stage").text().trim();

      matches.push({
        team1,
        team2,
        score,
        status,
      });
    });

    res.status(200).json({ matches });
  } catch (err) {
    console.error("Scraping failed:", err.message);
    res.status(500).json({
      error: "Scraping failed",
      details: err.message,
    });
  }
}
