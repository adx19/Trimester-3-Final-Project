import axios from "axios";
import { topLeagues } from "../../public/league names/league-names";
const BASE_URL = "https://api.sofascore.com/api/v1";
const BASE_URL_CRIC = "https://api.cricapi.com/v1";
const API_KEY = import.meta.env.VITE_API_KEY;

export const getTeamData = async (teamName) => {
  const data = await axios.get(`${BASE_URL}/searchteams.php?t=${teamName}`);
  return data.data.teams?.[res.data.events.length - 1];
};

export const getleaugeMatches = async (teamName) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split("T")[0];

    const response = await axios.get(
      `${BASE_URL}/sport/football/scheduled-events/${dateStr}`
    );
    const events = response.data.events;

    const premierLeagueMatches = events.filter(
      (event) => event.tournament?.slug === `${teamName}`
    );

    return premierLeagueMatches.map((event) => ({
      team1: event.homeTeam?.name,
      team2: event.awayTeam?.name,
      team1Logo: `https://api.sofascore.app/api/v1/team/${event.homeTeam?.id}/image`,
      team2Logo: `https://api.sofascore.app/api/v1/team/${event.awayTeam?.id}/image`,
      score: `${event.homeScore?.current ?? "-"} - ${event.awayScore?.current ?? "-"}`,
      venue: event.venue?.stadium?.name || "Unknown Venue",
      date: dateStr,
      time: event.startTimestamp
        ? new Date(event.startTimestamp * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "TBD",
      status: event.status?.type || "TBD",
    }));
  } catch (error) {
    console.error("Failed to fetch Premier League matches:", error.message);
    return [];
  }
};

export const getSeasonId = async (leagueSlug) => {
  const res = await axios.get(
    `https://api.sofascore.app/api/v1/unique-tournament/${leagueSlug}/seasons`

  )

  return res.data.seasons?.[0]?.id

}

export const getUpcomingMatches = async (leagueSlug, seasonId) => {
  try {
    const res = await axios.get(
      `https://api.sofascore.app/api/v1/unique-tournament/${leagueSlug}/season/${seasonId}/events/next/10`
    );

    const upcomingEvent = res.data.events;

    return upcomingEvent.map((event) => ({
      team1: event.homeTeam?.name,
      team2: event.awayTeam?.name,
      team1Logo: `https://api.sofascore.app/api/v1/team/${event.homeTeam?.id}/image`,
      team2Logo: `https://api.sofascore.app/api/v1/team/${event.awayTeam?.id}/image`,
      score: `${event.homeScore?.current ?? "-"} - ${event.awayScore?.current ?? "-"}`,
      venue: event.venue?.stadium?.name || "Unknown Venue",
      time: event.startTimestamp
        ? new Date(event.startTimestamp * 1000).toLocaleString([], {
            weekday: "short",
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "TBD",
      status: event.status?.description || "TBD",
      tournament: event.tournament?.name || "",
    }));
  } catch (error) {
    console.error("Error fetching upcoming matches:", error.message);
    return [];
  }
};


export const getLiveFootballMatches = async () => {
  try {
    const response = await axios.get(
      "https://api.sofascore.app/api/v1/sport/football/events/live"
    );

    const liveEvents = response.data.events;

    const filteredEvents = liveEvents.filter((event) => {
      const leagueSlug = event.tournament?.slug;
      return topLeagues.includes(leagueSlug);
    });

    return filteredEvents.map((event) => {
      const minute = event.time?.minute;
      const injuryTime = event.time?.injuryTime;
      let timeInMatch = "";

      if (["inprogress", "live"].includes(event.status?.type)) {
        if (minute !== undefined) {
          if (injuryTime !== undefined) {
            timeInMatch = `${minute}+${injuryTime}'`;
          } else {
            timeInMatch = `${minute}'`;
          }
        } else {
          timeInMatch = "LIVE";
        }
      } else if (event.status?.type === "halftime") {
        timeInMatch = "HT";
      } else if (event.status?.type === "finished") {
        timeInMatch = "FT";
      }

      return {
        team1: event.homeTeam?.name,
        team2: event.awayTeam?.name,
        team1Logo: `https://api.sofascore.app/api/v1/team/${event.homeTeam?.id}/image`,
        team2Logo: `https://api.sofascore.app/api/v1/team/${event.awayTeam?.id}/image`,
        score: `${event.homeScore?.current ?? "-"} - ${event.awayScore?.current ?? "-"}`,
        venue: event.venue?.stadium?.name || "Unknown Venue",
        time: event.startTimestamp
          ? new Date(event.startTimestamp * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "TBD",
        status: event.status?.description || "TBD",
        tournament: event.tournament?.name || "",
        minutesInMatch: timeInMatch,
      };
    });
  } catch (error) {
    console.error("Error fetching live matches:", error.message);
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
      team1Logo: "",
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

export const getCricketCountryDetails = async (countryName) => {
  try {
    const response = await axios.get(`${BASE_URL_CRIC}/countries`, {
      params: {
        apikey: API_KEY,
        offset: 0,
      },
    });

    const country = response?.data?.data.find((team) =>
      team.name.toLowerCase().includes(countryName.toLowerCase())
    );

    return country || null;
  } catch (error) {
    console.error("Error fetching country details:", error.message);
    return null;
  }
};

export const countryDetails = async (countryName) => {
  const response = await axios.get(
    `${BASE_URL_CRIC}/countries?apikey=${API_KEY}&offset=0`
  );

  return response.data?.data.find((team) =>
    team.name.toLowerCase().includes(countryName.toLowerCase())
  );
};

export const latestfixturescric = async () => {
  try {
    const response = await axios.get(
      `${BASE_URL_CRIC}/matches?apikey=${API_KEY}&offset=0`
    );
    const matchList = response?.data?.data;

    const matchId = "29045c7d-13a0-45c2-921c-8af486968d7e";
    const match = matchList.find((m) => m.id === matchId);

    if (match) {
      return match;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching cricket data:", error.message);
    return null;
  }
};
