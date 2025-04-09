import axios from "axios";
import { topLeagues } from "../../public/league names/league-names";
const BASE_URL = "https://api.sofascore.com/api/v1";

export const getTeamData = async (teamName) => {
  const data = await axios.get(`${BASE_URL}/searchteams.php?t=${teamName}`);
  return data.data.teams?.[res.data.events.length - 1];
};

const normalize = (str) => str?.toLowerCase().replace(/[^a-z]/g, "");

export const getleaugeMatches = async (leagueSlug) => {
  const maxLookbackDays = 15;

  try {
    let date = new Date();
    const now = Date.now();

    for (let i = 0; i < maxLookbackDays; i++) {
      const dateStr = date.toISOString().split("T")[0];

      const response = await axios.get(
        `${BASE_URL}/sport/football/scheduled-events/${dateStr}`
      );

      const events = response.data.events || [];

      const leagueMatches = events.filter((event) => {
        const tournamentSlug = event.tournament?.slug?.toLowerCase() || "";
        const categorySlug =
          event.tournament?.category?.slug?.toLowerCase() || "";
        const isMatchEarlier = event.startTimestamp * 1000 <= now;
        return (
          isMatchEarlier &&
          (tournamentSlug.includes(leagueSlug.toLowerCase()) ||
            categorySlug.includes(leagueSlug.toLowerCase()))
        );
      });

      if (leagueMatches.length > 0) {
        return leagueMatches.map((event) => ({
          team1: event.homeTeam?.name,
          team2: event.awayTeam?.name,
          team1Logo: `https://api.sofascore.app/api/v1/team/${event.homeTeam?.id}/image`,
          team2Logo: `https://api.sofascore.app/api/v1/team/${event.awayTeam?.id}/image`,
          score: `${event.homeScore?.current ?? "-"} - ${
            event.awayScore?.current ?? "-"
          }`,
          venue:
            event.venue?.stadium?.name || event.venue?.name || "Unknown Venue",
          date: dateStr,
          time: event.startTimestamp
            ? new Date(event.startTimestamp * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "TBD",
          status: event.status?.type || "TBD",
        }));
      }

      date.setDate(date.getDate() - 1);
    }

    console.warn(`No recent league matches found for: ${leagueSlug}`);
    return [];
  } catch (error) {
    console.error("Failed to fetch league matches:", error.message);
    return [];
  }
};

export const getSeasonId = async (leagueSlug) => {
  const res = await axios.get(
    `${BASE_URL}/unique-tournament/${leagueSlug}/seasons`
  );

  return res.data.seasons?.[0]?.id;
};
export const getUpcomingMatches = async (leagueSlug) => {
  const maxForwardDays = 10;

  try {
    let date = new Date();
    const now = Date.now(); // current timestamp in ms

    for (let i = 0; i < maxForwardDays; i++) {
      const dateStr = date.toISOString().split("T")[0];

      const response = await axios.get(
        `${BASE_URL}/sport/football/scheduled-events/${dateStr}`
      );

      const events = response.data.events || [];

      const leagueMatches = events.filter((event) => {
        const tournamentSlug = event.tournament?.slug?.toLowerCase() || "";
        const categorySlug =
          event.tournament?.category?.slug?.toLowerCase() || "";
        const isMatchLater = event.startTimestamp * 1000 > now;
        return (
          isMatchLater &&
          (tournamentSlug.includes(leagueSlug.toLowerCase()) ||
            categorySlug.includes(leagueSlug.toLowerCase()))
        );
      });

      if (leagueMatches.length > 0) {
        return leagueMatches.map((event) => ({
          team1: event.homeTeam?.name,
          team2: event.awayTeam?.name,
          team1Logo: `https://api.sofascore.app/api/v1/team/${event.homeTeam?.id}/image`,
          team2Logo: `https://api.sofascore.app/api/v1/team/${event.awayTeam?.id}/image`,
          score: "- : -",
          venue:
            event.venue?.stadium?.name || event.venue?.name || "Unknown Venue",
          date: dateStr,
          time: event.startTimestamp
            ? new Date(event.startTimestamp * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "TBD",
          status: "UPCOMING",
        }));
      }

      date.setDate(date.getDate() + 1);
    }

    console.warn(`No upcoming matches found for: ${leagueSlug}`);
    return [];
  } catch (error) {
    console.error("Failed to fetch upcoming matches:", error.message);
    return [];
  }
};

export const getLiveFootballMatches = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/sport/football/events/live`);
    const liveEvents = response.data.events || [];

    const filteredEvents = liveEvents.filter((event) => {
      const eventSlug = normalize(event.tournament?.slug);
      return topLeagues.some((league) => eventSlug.includes(normalize(league)));
    });

    return filteredEvents.map((event) => {
      const minute = event.time?.minute;
      const injuryTime = event.time?.injuryTime;
      let timeInMatch = "";

      if (["inprogress", "live"].includes(event.status?.type)) {
        timeInMatch = injuryTime ? `${minute}+${injuryTime}'` : `${minute}'`;
      } else if (event.status?.type === "halftime") {
        timeInMatch = "HT";
      } else if (event.status?.type === "finished") {
        timeInMatch = "FT";
      } else {
        timeInMatch = "LIVE";
      }
      const today = new Date();
      const dateOnly = today.toISOString().split("T")[0];

      return {
        team1: event.homeTeam?.name,
        team2: event.awayTeam?.name,
        team1Logo: `${BASE_URL}/team/${event.homeTeam?.id}/image`,
        team2Logo: `${BASE_URL}/team/${event.awayTeam?.id}/image`,
        score: `${event.homeScore?.current ?? "-"} - ${
          event.awayScore?.current ?? "-"
        }`,
        date: `${dateOnly}`,
        venue: event.venue?.stadium?.name || "Unknown Venue",
        time:
          new Date() - event.startTimestamp
            ? new Date(event.startTimestamp * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "TBD",
        status: event.status?.description || "TBD",
        tournament: event.tournament?.name || "",
        minutesInMatch: event.time?.minute,
      };
    });
  } catch (error) {
    console.error("Error fetching live matches:", error.message);
    return [];
  }
};
export const getTeamMatches = async (teamName, pageNo) => {
  if (!teamName) {
    console.warn("No team name provided");
    return [];
  }

  try {
    const searchRes = await axios.get(`${BASE_URL}/search/all`, {
      params: { q: teamName },
      headers: { Accept: "application/json" },
    });
    const results = searchRes.data.results;
    if (!results || results.length === 0) {
      console.warn(`No search results for: ${teamName}`);
      return [];
    }

    // Step 2: Extract team
    const teamId = searchRes.data.results
      .filter((r) => r.type === "team")
      .map((r) => r.entity)[0]?.id;
    const matchRes = await axios.get(
      `${BASE_URL}/team/${teamId}/events/last/${pageNo}`
    );

    const events = matchRes.data.events.reverse();
    console.log(`Fetched ${events.length} events for team ${teamName}`);

    return events.map((event) => ({
      team1: event.homeTeam.name,
      team2: event.awayTeam.name,
      team1Logo: `https://api.sofascore.app/api/v1/team/${event.homeTeam.id}/image`,
      team2Logo: `https://api.sofascore.app/api/v1/team/${event.awayTeam.id}/image`,
      score: `${event.homeScore?.current ?? "-"} - ${
        event.awayScore?.current ?? "-"
      }`,
      venue: event.venue?.name || "Unknown",
      date: new Date(event.startTimestamp * 1000).toISOString().split("T")[0],
      time: new Date(event.startTimestamp * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: event.status?.type?.toUpperCase() || "TBD",
    }));
  } catch (error) {
    console.error("Error fetching match history:", error);
    return [];
  }
};
