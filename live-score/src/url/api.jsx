import axios, { all } from "axios";
const BASE_URL = "https://api.sofascore.com/api/v1";

import { leagueSlugToId } from "../../public/league names/league-names";

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
        return isMatchEarlier && tournamentId === leagueId;
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

    if (!liveEvents.length) {
      console.log("No live events found");
      return [];
    }

    const now = Math.floor(Date.now() / 1000);

    const filteredMatches = liveEvents.filter((event) => {
      const leagueSlug = event.tournament?.slug;
      return leagueSlug && leagueSlugToId[leagueSlug];
    });

    const enrichedMatches = filteredMatches.map((event) => {
      const startTimestamp = event.startTimestamp;
      const currentPeriodStart = event.time?.currentPeriodStartTimestamp;
      const injuryTime =
        event.lastPeriod === "period1"
          ? event.time?.injuryTime1 || 0
          : event.lastPeriod === "period2"
          ? event.time?.injuryTime2 || 0
          : 0;

      let minute = null;
      let timeInMatch = "";

      const statusType = event.status?.type;

      if (statusType === "halftime") {
        timeInMatch = "HT";
      } else if (statusType === "finished") {
        timeInMatch = "FT";
      } else if (startTimestamp && now > startTimestamp) {
        const minutesElapsed = Math.floor((now - startTimestamp) / 60) + 1;
        minute = minutesElapsed;

        const inInjuryTime =
          (minutesElapsed > 45 && minutesElapsed <= 45 + injuryTime) ||
          (minutesElapsed > 90 && minutesElapsed <= 90 + injuryTime);

        if (inInjuryTime) {
          const injuryBase = minutesElapsed > 90 ? 90 : 45;
          const extra = minutesElapsed - injuryBase;
          timeInMatch = `${injuryBase}+${extra}'`;
        } else {
          timeInMatch = `${minutesElapsed}'`;
        }
      } else {
        timeInMatch = "LIVE";
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
        venue: event.venue?.name || "Unknown",
        time: new Date(event.startTimestamp * 1000).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: event.status?.description || "TBD",
        tournament: event.tournament?.name || "",
        minutesInMatch: minute ?? "—",
        timeInMatch,
      };
    });

    return enrichedMatches;
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
    const searchRes = await axios.get(`${BASE_URL}/search/all/`, {
      params: { q: teamName },
      headers: { Accept: "application/json" },
    });
    const results = searchRes.data.results;

    if (!results || results.length === 0) {
      console.warn(`No search results for: ${teamName}`);
      return [];
    }

    const teamId = results
      .filter((r) => r.type === "team")
      .map((r) => r.entity)[0]?.id;

    if (!teamId) {
      console.warn("No team ID found");
      return [];
    }

    const matchRes = await axios.get(
      `${BASE_URL}/team/${teamId}/events/last/${pageNo}`,
      {
        headers: { Accept: "application/json" },
      }
    );

    const events = matchRes.data.events.reverse(); // Reverse to get the most recent match first
    console.log(`Fetched ${events.length} events for team ${teamName}`);

    if (events.length > 0) {
      const enrichedMatches = events.map((event) => {
        let venueName = event.venue?.name || "Unknown"; // Directly fetch venue from event
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
          date: new Date(event.startTimestamp * 1000)
            .toISOString()
            .split("T")[0], // Format: YYYY-MM-DD
          time: new Date(event.startTimestamp * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: event.status?.description || "TBD",
        };
      });

      return enrichedMatches;
    }

    return [];
  } catch (error) {
    console.error("Error fetching past matches:", error.message);
    if (error.response) {
      console.error("Response error status:", error.response.status);
      console.error("Response error data:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error setting up request:", error.message);
    }
    return [];
  }
};

export const getMatchDetails = async (id) => {
  try {
    const response = await axios.get(`${BASE_URL}/event/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching match details:", error);
    throw error;
  }
};

export const getMatchStatistics = async (id) => {
  try {
    const responseIncidents = await axios.get(`${BASE_URL}/event/${id}/incidents`);
    const incidentsData = responseIncidents?.data?.incidents || [];

    const homeTeamGoalScorers = [];
    const awayTeamGoalScorers = [];
    const homeTeamRedCardReceivers = [];
    const awayTeamRedCardReceivers = [];  
    console.log(responseIncidents.data)

    incidentsData.forEach((incident) => {
      if (incident.incidentType === 'goal') {
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

      if (incident.incidentClass === 'red') {
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

    let totalShots = { home: 0, away: 0 };
    let shotsOnTarget = { home: 0, away: 0 };
    let possession = { home: "0%", away: "0%" };
    let saves = { home: 0, away: 0 };
    let passes = { home: 0, away: 0 };
    let accuratePasses = { home: 0, away: 0 }; 
    let yellowCards = { home: 0, away: 0 };
    let redCards = { home: 0, away: 0 };

    statisticsData.forEach(group => {
      group.groups.forEach(subgroup => {
        subgroup.statisticsItems.forEach(stat => {
          switch (stat.key) {
            case 'ballPossession':
              possession.home = stat.home || "0%";
              possession.away = stat.away || "0%";
              break;
            case 'totalShotsOnGoal':
              totalShots.home = stat.homeValue || 0;
              totalShots.away = stat.awayValue || 0;
              break;
            case 'shotsOnGoal':
              shotsOnTarget.home = stat.homeValue || 0;
              shotsOnTarget.away = stat.awayValue || 0;
              break;
            case 'goalkeeperSaves':
              saves.home = stat.homeValue || 0;
              saves.away = stat.awayValue || 0;
              break;
            case 'passes':
              passes.home = stat.homeValue || 0;
              passes.away = stat.awayValue || 0;
              break;
            case 'accuratePasses': // capture accurate passes
              accuratePasses.home = stat.homeValue || 0;
              accuratePasses.away = stat.awayValue || 0;
              break;
            case 'yellowCards':
              yellowCards.home = stat.homeValue || 0;
              yellowCards.away = stat.awayValue || 0;
              break;
            case 'redCards': // ← New case
              redCards.home = stat.homeValue || 0;
              redCards.away = stat.awayValue || 0;
              console.log(redCards)
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
      totalShots,
      shotsOnTarget,
      possession,
      saves,
      passes,
      yellowCards,
      accuratePasses,
      redCards,
    };
  } catch (error) {
    console.warn("Error in getMatchStatistics:", error);
    return null;
  }
};

