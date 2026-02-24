const isProd = window.location.hostname !== "localhost";
import leagueDemo from "../demo/league.json";
import liveDemo from "../demo/live.json";
import matchDetailsDemo from "../demo/matchDetails.json";
import axios from "axios";
import { leagueSlugToId } from "../assets/league names/league-names";
const BASE_URL = "https://api.sofascore.com/api/v1";

export const getTeamData = async (teamName) => {
  if (!teamName) return null;

  try {
    const res = await axios.get(`${BASE_URL}/search/all`, {
      params: { q: teamName },
      headers: { Accept: "application/json" },
    });

    const teams = res.data.results?.filter((item) => item.type === "team");

    if (!teams || teams.length === 0) return null;

    const matchedTeam =
      teams.find(
        (t) => t.entity?.name?.toLowerCase() === teamName.toLowerCase()
      ) || teams[0];

    return matchedTeam.entity?.id || null;
  } catch {
    return null;
  }
};

export const getTeamStadiumName = async (teamId) => {
  try {
    const res = await axios.get(`${BASE_URL}/team/${teamId}`);
    return res.data.team.venue?.name || "Stadium information not available.";
  } catch {
    return "Something went wrong. Try again.";
  }
};

export const getleaugeMatches = async (leagueSlug) => {
  if (isProd) {
    const leagueId = leagueSlugToId[leagueSlug];

    return (leagueDemo.events || [])
      .filter(
        (event) =>
          event.tournament?.uniqueTournament?.id === leagueId
      )
      .slice(0, 10)
      .map((event) => ({
        id: event.id,
        team1: event.homeTeam?.name,
        team2: event.awayTeam?.name,
        team1Logo: `https://api.sofascore.com/api/v1/team/${event.homeTeam?.id}/image`,
        team2Logo: `https://api.sofascore.com/api/v1/team/${event.awayTeam?.id}/image`,
        score: `${event.homeScore?.current ?? "-"} - ${event.awayScore?.current ?? "-"}`,
        venue: event.venue?.name || "Unknown",
        date: new Date(event.startTimestamp * 1000).toISOString().split("T")[0],
        time: new Date(event.startTimestamp * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: event.status?.type || "TBD",
        tournament: event.tournament?.name || "",
      }));
  }

  const leagueId = leagueSlugToId[leagueSlug];
  const maxLookbackDays = 7;

  if (!leagueId) return [];

  try {
    const now = Date.now();
    const allMatchesMap = new Map();

    for (let i = 0; i < maxLookbackDays; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];

      const response = await axios.get(`${BASE_URL}/sport/football/scheduled-events/${dateStr}`);
      const events = response.data?.events || [];

      const leagueMatches = events.filter((event) => {
        const tournamentId = event.tournament?.uniqueTournament?.id;
        const isMatchEarlier = event.startTimestamp * 1000 < now;
        const isMatchFinished = event.status?.type === "finished";
        return isMatchEarlier && isMatchFinished && tournamentId === leagueId;
      });

      leagueMatches.forEach((event) => {
        if (!allMatchesMap.has(event.id)) {
          allMatchesMap.set(event.id, {
            id: event.id,
            team1: event.homeTeam?.name,
            team2: event.awayTeam?.name,
            team1Logo: `${BASE_URL}/team/${event.homeTeam?.id}/image`,
            team2Logo: `${BASE_URL}/team/${event.awayTeam?.id}/image`,
            score: `${event.homeScore?.current ?? "-"} - ${event.awayScore?.current ?? "-"}`,
            venue: "Unknown",
            date: dateStr,
            time: new Date(event.startTimestamp * 1000).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            status: event.status?.type || "TBD",
            tournament: event.tournament?.name || "",
          });
        }
      });
    }

    return Array.from(allMatchesMap.values());
  } catch {
    return [];
  }
};
export const getSeasonId = async (leagueSlug) => {
  const res = await axios.get(`${BASE_URL}/unique-tournament/${leagueSlug}/seasons`);
  return res.data.seasons?.[0]?.id;
};

export const getUpcomingMatches = async (leagueSlug) => {
  const leagueId = leagueSlugToId[leagueSlug];
  const maxForwardDays = 7;

  if (!leagueId) return [];
  if (isProd) {
  const leagueId = leagueSlugToId[leagueSlug];

  return (leagueDemo.events || [])
    .filter(
      (event) =>
        event.tournament?.uniqueTournament?.id === leagueId &&
        event.status?.type !== "finished"
    )
    .slice(0, 10)
    .map((event) => ({
      id: event.id,
      team1: event.homeTeam?.name,
      team2: event.awayTeam?.name,
      team1Logo: `https://api.sofascore.com/api/v1/team/${event.homeTeam?.id}/image`,
      team2Logo: `https://api.sofascore.com/api/v1/team/${event.awayTeam?.id}/image`,
      score: "-",
      venue: event.venue?.name || "Unknown",
      date: new Date(event.startTimestamp * 1000).toISOString().split("T")[0],
      time: new Date(event.startTimestamp * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "Scheduled",
      tournament: event.tournament?.name || "",
    }));
}

  try {
    const now = Date.now();

    for (let i = 0; i < maxForwardDays; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split("T")[0];

      const response = await axios.get(`${BASE_URL}/sport/football/scheduled-events/${dateStr}`);
      const events = response.data.events || [];

      const upcomingMatches = events.filter((event) => {
        const tournamentId = event.tournament?.uniqueTournament?.id;
        const isMatchLater = event.startTimestamp * 1000 > now;
        return isMatchLater && tournamentId === leagueId;
      });

      if (upcomingMatches.length > 0) {
        return upcomingMatches.map((event) => ({
          id: event.id,
          team1: event.homeTeam?.name,
          team2: event.awayTeam?.name,
          team1Logo: `${BASE_URL}/team/${event.homeTeam?.id}/image`,
          team2Logo: `${BASE_URL}/team/${event.awayTeam?.id}/image`,
          score: "-",
          venue: "Unknown",
          date: dateStr,
          time: new Date(event.startTimestamp * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: event.status?.type || "Unknown",
          tournament: event.tournament?.name || "",
        }));
      }
    }

    return [];
  } catch {
    return [];
  }
};

export const getLiveFootballMatches = async () => {
  try {
    if (isProd) return liveDemo.events || [];

    const response = await axios.get(`${BASE_URL}/sport/football/events/live`);
    const liveEvents = response.data.events || [];

    if (!liveEvents.length) return [];

    const allowedLeagueIds = Object.values(leagueSlugToId);

    const filteredMatches = liveEvents.filter((event) =>
      allowedLeagueIds.includes(event.tournament?.uniqueTournament?.id)
    );

    return filteredMatches.map((event) => ({
      id: event.id,
      team1: event.homeTeam?.name,
      team2: event.awayTeam?.name,
      team1Logo: `${BASE_URL}/team/${event.homeTeam?.id}/image`,
      team2Logo: `${BASE_URL}/team/${event.awayTeam?.id}/image`,
      score: `${event.homeScore?.current ?? "-"} - ${event.awayScore?.current ?? "-"}`,
      date: new Date(event.startTimestamp * 1000).toISOString().split("T")[0],
      time: new Date(event.startTimestamp * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      venue: event.venue?.name || "Unknown",
      status: event.status?.description || "TBD",
      tournament: event.tournament?.name || "",
    }));
  } catch {
    return [];
  }
};

export const getTeamMatches = async (teamName, pageNo) => {
  if (!teamName) return [];

  if (isProd) {
    const matches = leagueDemo.events || [];

    return matches
      .filter(
        (e) =>
          e.homeTeam?.name?.toLowerCase().includes(teamName.toLowerCase()) ||
          e.awayTeam?.name?.toLowerCase().includes(teamName.toLowerCase())
      )
      .slice(0, 10)
      .map((event) => ({
        id: event.id,
        team1: event.homeTeam?.name,
        team2: event.awayTeam?.name,
        team1Logo: `https://api.sofascore.com/api/v1/team/${event.homeTeam?.id}/image`,
        team2Logo: `https://api.sofascore.com/api/v1/team/${event.awayTeam?.id}/image`,
        score: `${event.homeScore?.current ?? "-"} - ${event.awayScore?.current ?? "-"}`,
        venue: event.venue?.name || "Unknown",
        date: new Date(event.startTimestamp * 1000).toISOString().split("T")[0],
        time: new Date(event.startTimestamp * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: event.status?.description || "TBD",
        tournament: event.tournament?.name || "",
      }));
  }

  try {
    const searchRes = await axios.get(`${BASE_URL}/search/all?q=${teamName}`);
    const results = searchRes.data.results;

    if (!results || results.length === 0) return [];

    const teamId = results.filter((r) => r.type === "team").map((r) => r.entity)[0]?.id;

    const matchRes = await axios.get(`${BASE_URL}/team/${teamId}/events/last/${pageNo}`);
    const events = matchRes.data.events.reverse();

    return events.map((event) => ({
      id: event.id,
      team1: event.homeTeam?.name,
      team2: event.awayTeam?.name,
      team1Logo: `${BASE_URL}/team/${event.homeTeam?.id}/image`,
      team2Logo: `${BASE_URL}/team/${event.awayTeam?.id}/image`,
      score: `${event.homeScore?.current ?? "-"} - ${event.awayScore?.current ?? "-"}`,
      venue: event.venue?.name || "Unknown",
      date: new Date(event.startTimestamp * 1000).toISOString().split("T")[0],
      time: new Date(event.startTimestamp * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: event.status?.description || "TBD",
      tournament: event.tournament?.name || "",
    }));
  } catch {
    return [];
  }
};

export const getMatchDetails = async (id) => {
  try {
   if (isProd) {
  return (
    leagueDemo.events.find((e) => e.id === id) ||
    matchDetailsDemo
  );
}
    const response = await axios.get(`${BASE_URL}/event/${id}`);
    return response.data;
  } catch {
    return null;
  }
};

export const getMatchStatistics = async (id) => {
  try {
    if (isProd) return null;

    const incidentsRes = await axios.get(`${BASE_URL}/event/${id}/incidents`);
    const incidentsData = incidentsRes?.data?.incidents || [];

    const homeTeamGoalScorers = [];
    const awayTeamGoalScorers = [];
    const homeTeamRedCardReceivers = [];
    const awayTeamRedCardReceivers = [];

    incidentsData.forEach((incident) => {
      if (incident.incidentType === "goal") {
        const goal = {
          player: incident.player?.name || "Unknown",
          minute: incident.time || "Unknown",
        };
        incident.isHome ? homeTeamGoalScorers.push(goal) : awayTeamGoalScorers.push(goal);
      }

      if (incident.incidentClass === "red") {
        const red = {
          player: incident.player?.name || "Unknown",
          minute: incident.time || "Unknown",
        };
        incident.isHome
          ? homeTeamRedCardReceivers.push(red)
          : awayTeamRedCardReceivers.push(red);
      }
    });

    const statsRes = await axios.get(`${BASE_URL}/event/${id}/statistics`);
    const statisticsData = statsRes?.data?.statistics || [];

    const stats = {
      totalShots: { home: 0, away: 0 },
      shotsOnTarget: { home: 0, away: 0 },
      possession: { home: "0%", away: "0%" },
      saves: { home: 0, away: 0 },
      passes: { home: 0, away: 0 },
      accuratePasses: { home: 0, away: 0 },
      yellowCards: { home: 0, away: 0 },
      redCards: { home: 0, away: 0 },
    };

    statisticsData.forEach((group) => {
      group.groups.forEach((subgroup) => {
        subgroup.statisticsItems.forEach((stat) => {
          const key = stat.key;
          const homeVal = stat.homeValue || stat.home || 0;
          const awayVal = stat.awayValue || stat.away || 0;

          switch (key) {
            case "ballPossession":
              stats.possession.home = stat.home || "0%";
              stats.possession.away = stat.away || "0%";
              break;
            case "totalShotsOnGoal":
              stats.totalShots.home = homeVal;
              stats.totalShots.away = awayVal;
              break;
            case "shotsOnGoal":
              stats.shotsOnTarget.home = homeVal;
              stats.shotsOnTarget.away = awayVal;
              break;
            case "goalkeeperSaves":
              stats.saves.home = homeVal;
              stats.saves.away = awayVal;
              break;
            case "passes":
              stats.passes.home = homeVal;
              stats.passes.away = awayVal;
              break;
            case "accuratePasses":
              stats.accuratePasses.home = homeVal;
              stats.accuratePasses.away = awayVal;
              break;
            case "yellowCards":
              stats.yellowCards.home = homeVal;
              stats.yellowCards.away = awayVal;
              break;
            case "redCards":
              stats.redCards.home = homeVal;
              stats.redCards.away = awayVal;
              break;
            default:
              break;
          }
        });
      });
    });

    return {
      homeTeamGoalScorers,
      awayTeamGoalScorers,
      homeTeamRedCardReceivers,
      awayTeamRedCardReceivers,
      ...stats,
    };
  } catch {
    return null;
  }
};