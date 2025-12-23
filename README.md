# Live Sports Score App

A React-based web application to view live football match data, past results, upcoming fixtures, and detailed match statistics.

---

## 🚀 Features

- **Live Match Scores**  
  View real-time scores from top football leagues.

- **Past Week Match Results**  
  Access match outcomes from the last 7 days.

- **Upcoming Fixtures**  
  See matches scheduled for the next 7 days.

- **Team-based Search**  
  Search for any team to view all their matches from most recent to oldest.

- **Score Cards with Popup Details**  
  Each match is shown in a clean card format with:
  - Team names & logos
  - Final score (if available)
  - Match date & time  

  Clicking a card opens a detailed popup showing:
  - Ball possession
  - Total shots & shots on target
  - Saves
  - Pass count & pass accuracy
  - Yellow & red cards (with player names and timings)
  - Goal scorers with minute of scoring

---

## 🧩 Tech Stack

- **Frontend:** React + Vite  
- **Styling:** Tailwind CSS  
- **Data Fetching:** Axios, React Hooks  
- **Data Source:** SofaScore (via custom scraper API)

> ⚠️ Note: SofaScore does not provide an official public API.  
> This app uses a custom scraper, which may be rate-limited or blocked due to CORS or network restrictions in production.

---

## 📸 Screenshots

> Screenshots are included in case the API is unavailable during review.

![Live Match](./screenshots/live.png)
![Past Matches](./screenshots/past%20Matches.png)
![Upcoming Matches](./screenshots/upcoming%20matches.png)
![Team Search](./screenshots/team.png)
![Match Details](./screenshots/MatchDetails.png)

---

## 🛠️ Setup & Run Locally

```bash
npm install
npm run dev
