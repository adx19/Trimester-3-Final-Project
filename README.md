# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

<<<<<<< HEAD
## Expanding the ESLint configuration
=======
- **Live Match Scores**  
  Instantly view scores from top leagues around the world in real-time.

- **Past Week Match Results**  
  Easily access match outcomes from the past 7 days for all major leagues.

- **Upcoming Fixtures**  
  Stay informed about matches scheduled in the next 7 days.

- **Team-based Search**  
  Type in any team's name and get a full list of matches they’ve played — from their most recent game to the oldest one in our database.

- **Score Cards with Popup Details**  
  Each match is displayed in a clean, minimal card format showing:
  - Team names
  - Logos
  - Final score (if available)
  - Date and time of the match  

  Clicking on a card brings up a **popup** with full match stats:
  - Ball possession
  - Total shots & shots on target
  - Saves
  - Number of passes & pass accuracy
  - Yellow and red cards (including player and timing)
  - Goal scorers with the minute of scoring

---

## 🧩 Tech Stack

- **Frontend Framework:** React (with Vite)
- **Styling:** Tailwind CSS
- **State Management & Data Fetching:** Axios, React hooks
- **Match Data Source:** SofaScore  
  > ℹ️ *Note: This app uses a custom-built scraper API to fetch data from SofaScore. As SofaScore does not provide an official public API, the scraper is limited in scope and may be rate-limited or blocked occasionally.(The api may take time to load due to data fetching issue)(I fixed the issue it was the issue that I was using the same wifi. That is why I had late commit You can check my final commit Nothing changed)*

---

## 📸 Screenshots
    > ℹ️ *Note: I added screenShots in case api is not working.Also Deployment is showing CORS issue which I tried to solve but was unable to do it*
![LiveMatch](./screenshots/live.png)
![PreviousMatches](./screenshots/past%20Matches.png)
![UpcomingMatches](./screenshots/upcoming%20matches.png)
![TeamSearchResult](./screenshots/team.png)
![CompleteMatchDetails](./screenshots/MatchDetails.png)

---
>>>>>>> b73453f (Fix Vite build path)

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
