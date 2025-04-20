import axios, { all } from "axios";
import { leagueSlugToId } from "../assets/league names/league-names";
const BASE_URL = "https://api.sofascore.com/api/v1";

export const getTeamData = async (teamName) => {
  if (!teamName) {
    console.warn("No team name provided");
    return null;
  }

  try {
    const res = await axios.get(`${BASE_URL}/search/all/`, {
      params: { q: teamName },
      headers: { Accept: "application/json" },
    });

    const teams = res.data.results?.filter((item) => item.type === "team");

    if (!teams || teams.length === 0) {
      console.warn(`No teams found for: ${teamName}`);
      return null;
    }

    const matchedTeam =
      teams.find(
        (t) => t.entity?.name?.toLowerCase() === teamName.toLowerCase()
      ) || teams[0];

    return matchedTeam.entity?.id || null;
  } catch (error) {
    console.error("Error fetching team data:", error);
    return null;
  }
};

export const getleaugeMatches = async (leagueSlug) => {
  const leagueId = leagueSlugToId[leagueSlug];
  const maxLookbackDays = 15;
  if (!leagueId) {
    console.warn(`No league ID found for slug: ${leagueSlug}`);
    return [];
  }

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
        const tournamentId = event.tournament?.uniqueTournament?.id;
        const isMatchEarlier = event.startTimestamp * 1000 < now;
        const isMatchFinished = event.status?.type === "finished";

        return isMatchEarlier && isMatchFinished && tournamentId === leagueId;
      });

      if (leagueMatches.length > 0) {
        const enrichedMatches = await Promise.all(
          leagueMatches.map(async (event) => {
            let venueName = "Unknown Venue";
            try {
              const detailRes = await axios.get(
                `${BASE_URL}/event/${event.id}`
              );
              venueName =
                detailRes.data?.event?.venue?.stadium?.name ||
                detailRes.data?.event?.venue?.name ||
                "Unknown Venue";
            } catch (e) {
              console.warn(`No venue found for event ${event.id}`);
            }

            return {
              id: event.id,
              team1: event.homeTeam?.name,
              team2: event.awayTeam?.name,
              team1Logo: `https://api.sofascore.app/api/v1/team/${event.homeTeam?.id}/image`,
              team2Logo: `https://api.sofascore.app/api/v1/team/${event.awayTeam?.id}/image`,
              score: `${event.homeScore?.current ?? "-"} - ${
                event.awayScore?.current ?? "-"
              }`,
              venue: venueName,
              date: dateStr,
              time: event.startTimestamp
                ? new Date(event.startTimestamp * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "TBD",
              status: event.status?.type || "TBD",
            };
          })
        );

        return enrichedMatches;
      }

      date.setDate(date.getDate() - 1);
    }

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
  const leagueId = leagueSlugToId[leagueSlug];
  const maxForwardDays = 15;

  if (!leagueId) {
    console.warn(`No league ID found for slug: ${leagueSlug}`);
    return [];
  }

  try {
    let date = new Date();
    const now = Date.now();

    for (let i = 0; i < maxForwardDays; i++) {
      const dateStr = date.toISOString().split("T")[0];

      const response = await axios.get(
        `${BASE_URL}/sport/football/scheduled-events/${dateStr}`
      );

      const events = response.data.events || [];

      const upcomingMatches = events.filter((event) => {
        const tournamentId = event.tournament?.uniqueTournament?.id;
        const isMatchLater = event.startTimestamp * 1000 > now;
        return isMatchLater && tournamentId === leagueId;
      });

      if (upcomingMatches.length > 0) {
        const enrichedMatches = await Promise.all(
          upcomingMatches.map(async (event) => {
            let venueName = "TBD";
            try {
              const detailRes = await axios.get(
                `${BASE_URL}/event/${event.id}`
              );
              venueName = detailRes.data?.event?.venue?.name || "TBD";
            } catch (e) {
              console.warn(`No venue found for event ${event.id}`);
            }

            return {
              id: event.id,
              team1: event.homeTeam?.name,
              team2: event.awayTeam?.name,
              team1Logo: `https://api.sofascore.app/api/v1/team/${event.homeTeam?.id}/image`,
              team2Logo: `https://api.sofascore.app/api/v1/team/${event.awayTeam?.id}/image`,
              score: "-",
              venue: venueName,
              date: dateStr,
              time: event.startTimestamp
                ? new Date(event.startTimestamp * 1000).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "TBD",
              status: event.status?.type || "TBD",
            };
          })
        );

        return enrichedMatches;
      }

      date.setDate(date.getDate() + 1);
    }

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

    if (!liveEvents.length) return [];

    const now = Math.floor(Date.now() / 1000);
    const allowedLeagueIds = Object.values(leagueSlugToId);

    const filteredMatches = liveEvents.filter((event) =>
      allowedLeagueIds.includes(event.tournament?.uniqueTournament?.id)
    );

    const enrichedMatches = filteredMatches.map((event) => {
      const startTimestamp = event.startTimestamp;
      const currentPeriodStart = event.time?.currentPeriodStartTimestamp;
      const lastPeriod = event.lastPeriod;

      const statusType = event.status?.type;
      const isSecondHalf = lastPeriod === "period2";

      const injuryTime = isSecondHalf
        ? event.time?.injuryTime2 || 0
        : event.time?.injuryTime1 || 0;

      let minute = null;
      let timeInMatch = "";

      if (statusType === "halftime") {
        timeInMatch = "HT";
        minute = "—";
      } else if (statusType === "finished") {
        timeInMatch = "FT";
        minute = "—";
      } else if (currentPeriodStart && now > currentPeriodStart) {
        const minutesElapsed = Math.floor((now - currentPeriodStart) / 60) + 1;
        const totalMinutes = isSecondHalf
          ? 45 + minutesElapsed
          : minutesElapsed;
        minute = totalMinutes;

        const inInjuryTime =
          (totalMinutes > 45 && totalMinutes <= 45 + injuryTime) ||
          (totalMinutes > 90 && totalMinutes <= 90 + injuryTime);

        if (inInjuryTime) {
          const injuryBase = totalMinutes > 90 ? 90 : 45;
          const extra = totalMinutes - injuryBase;
          timeInMatch = `${injuryBase}+${extra}'`;
        } else {
          timeInMatch = `${totalMinutes}'`;
        }
      } else {
        timeInMatch = "LIVE";
        minute = "—";
      }

      return {
        id: event.id,
        team1: event.homeTeam?.name,
        team2: event.awayTeam?.name,
        team1Logo: `${BASE_URL}/team/${event.homeTeam?.id}/image`,
        team2Logo: `${BASE_URL}/team/${event.awayTeam?.id}/image`,
        score: `${event.homeScore?.current ?? "-"} - ${
          event.awayScore?.current ?? "-"
        }`,
        date: new Date(event.startTimestamp * 1000).toISOString().split("T")[0],
        time: new Date(event.startTimestamp * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        venue: event.venue?.name || "Unknown",
        status: event.status?.description || "TBD",
        tournament: event.tournament?.name || "",
        minutesInMatch: minute,
        timeInMatch,
      };
    });

    return enrichedMatches;
  } catch (error) {
    console.error("Error in getLiveFootballMatches:", error.message);
    return []; // Don't throw – return safe fallback
  }
};

export const getTeamMatches = async (teamName, pageNo) => {
  if (!teamName) return [];

  try {
    const searchRes = await axios.get(`${BASE_URL}/search/all/`, {
      params: { q: teamName },
      headers: { Accept: "application/json" },
    });

    const results = searchRes.data.results;

    if (!results || results.length === 0) return [];

    const teamId = results
      .filter((r) => r.type === "team")
      .map((r) => r.entity)[0]?.id;

    if (!teamId) return [];

    const matchRes = await axios.get(
      `${BASE_URL}/team/${teamId}/events/last/${pageNo}`,
      { headers: { Accept: "application/json" } }
    );

    const events = matchRes.data.events.reverse(); // Most recent first

    const enrichedMatches = events.map((event) => {
      return {
        id: event.id,
        team1: event.homeTeam?.name,
        team2: event.awayTeam?.name,
        team1Logo: `${BASE_URL}/team/${event.homeTeam?.id}/image`,
        team2Logo: `${BASE_URL}/team/${event.awayTeam?.id}/image`,
        score: `${event.homeScore?.current ?? "-"} - ${
          event.awayScore?.current ?? "-"
        }`,
        venue: event.venue?.name || "Unknown",
        date: new Date(event.startTimestamp * 1000).toISOString().split("T")[0],
        time: new Date(event.startTimestamp * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: event.status?.description || "TBD",
      };
    });

    return enrichedMatches;
  } catch (error) {
    console.error("Error in getTeamMatches:", error.message);
    return []; // Safe fallback
  }
};

export const getMatchDetails = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/event/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error in getMatchDetails:", error.message);
    return null; // Consistent and safe fallback
  }
};

export const getMatchStatistics = async (id) => {
  try {
    const responseIncidents = await axios.get(
      `${BASE_URL}/event/${id}/incidents`
    );
    const incidentsData = responseIncidents?.data?.incidents || [];

    const homeTeamGoalScorers = [];
    const awayTeamGoalScorers = [];
    const homeTeamRedCardReceivers = [];
    const awayTeamRedCardReceivers = [];

    incidentsData.forEach((incident) => {
      if (incident.incidentType === "goal") {
        const goalScorer = {
          player: incident.player?.name || "Unknown",
          minute: incident.time || "Unknown",
        };

        if (incident.isHome) {
          homeTeamGoalScorers.push(goalScorer);
        } else {
          awayTeamGoalScorers.push(goalScorer);
        }
      }

      if (incident.incidentClass === "red") {
        const redCardReceiver = {
          player: incident.player?.name || "Unknown",
          minute: incident.time || "Unknown",
        };

        if (incident.isHome) {
          homeTeamRedCardReceivers.push(redCardReceiver);
        } else {
          awayTeamRedCardReceivers.push(redCardReceiver);
        }
      }
    });

    const responseStats = await axios.get(`${BASE_URL}/event/${id}/statistics`);
    const statisticsData = responseStats?.data?.statistics || [];

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
  } catch (error) {
    console.warn("Error in getMatchStatistics:", error.message);
    return null;
  }
};
