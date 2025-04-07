import axios from 'axios';

const BASE_URL = 'https://api.sofascore.com/api/v1';
const BASE_URL_CRIC = 'https://api.cricapi.com/v1'
const API_KEY = import.meta.env.VITE_API_KEY;


export const getTeamData = async (teamName) => {
  const data = await axios.get(`${BASE_URL}/searchteams.php?t=${teamName}`)

  return data.data.teams?.[res.data.events.length - 1];
}
export const getLiveFootballMatches = async () => {
  try {
    // Get yesterday’s date in YYYY-MM-DD
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split("T")[0]; // "2025-04-06"

    // Fetch all scheduled football events for yesterday
    const response = await axios.get(`${BASE_URL}/sport/football/scheduled-events/${dateStr}`);
    const events = response.data.events;

    // Filter Premier League matches
    const premierLeagueMatches = events.filter(event =>
      event.tournament?.slug === "premier-league"
    );

    // Format and return
    return premierLeagueMatches.map((event) => ({
      team1: event.homeTeam?.name,
      team2: event.awayTeam?.name,
      team1Logo: `https://api.sofascore.app/api/v1/team/${event.homeTeam?.id}/image`,
      team2Logo: `https://api.sofascore.app/api/v1/team/${event.awayTeam?.id}/image`,
      score: `${event.homeScore?.current ?? "-"} - ${event.awayScore?.current ?? "-"}`,
      venue: event.venue?.stadium?.name || "Unknown Venue",
      date: dateStr,
      time: event.startTimestamp
        ? new Date(event.startTimestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : "TBD",
      status: event.status?.type || "TBD",
    }));
  } catch (error) {
    console.error("Failed to fetch Premier League matches:", error.message);
    return [];
  }
};


export const getLatestCricketMatches = async () => {
  try {
    const response = await axios.get(`${BASE_URL_CRIC}/matches`, {
      params: {
        apikey: API_KEY,
        offset: 0,
      },
    });

    const matches = response?.data?.data || [];

    return matches.map((match) => ({
      team1: match.teams?.[0] || "TBD",
      team2: match.teams?.[1] || "TBD",
      team1Logo: "", // CricAPI does not offer logos
      team2Logo: "",
      score: match.score || "-",
      venue: match.venue || "Unknown",
      date: match.date || "TBD",
      time: match.time || "TBD",
      status: match.status || "TBD",
    }));
  } catch (error) {
    console.error("Error fetching cricket matches:", error.message);
    return [];
  }
};

// Get cricket country/team details (filtered by name)
export const getCricketCountryDetails = async (countryName) => {
  try {
    const response = await axios.get(`${BASE_URL_CRIC}/countries`, {
      params: {
        apikey: API_KEY,
        offset: 0,
      },
    });

    const country = response?.data?.data.find(team =>
      team.name.toLowerCase().includes(countryName.toLowerCase())
    );

    return country || null;
  } catch (error) {
    console.error("Error fetching country details:", error.message);
    return null;
  }
};

export const countryDetails = async (countryName) => {
  const response = await axios.get(`${BASE_URL_CRIC}/countries?apikey=${API_KEY}&offset=0`);

  const res = response.data?.data.find(team =>
    team.name.toLowerCase().includes(countryName.toLowerCase())
  );

  return res;
}

export const latestfixturescric = async () => {
  try {
    const response = await axios.get(`${BASE_URL_CRIC}/matches?apikey=${API_KEY}&offset=0`);
    const matchList = response?.data?.data;

    if (!Array.isArray(matchList) || matchList.length === 0) return null;

    const match = matchList.find(m => m.teams?.length === 2);
    return match || null;
  } catch (error) {
    console.error("Error fetching cricket match:", error.message);
    return null;
  }
};
