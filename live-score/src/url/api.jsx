import axios, { all } from "axios";
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

    const matchedTeam = teams.find(
      (t) => t.entity?.name?.toLowerCase() === teamName.toLowerCase()
    ) || teams[0];

    return matchedTeam.entity?.id || null;
  } catch (error) {
    console.error("Error fetching team data:", error);
    return null;
  }
};


import { leagueSlugToId } from "../../public/league names/league-names";

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

    const filteredEvents = liveEvents.filter((event) => {
      const tournamentId = event.tournament?.uniqueTournament?.id;
      const tournamentName = event.tournament?.uniqueTournament?.slug;

      return Object.entries(leagueSlugToId).some(([slug, id]) => {
        if (id) {
          return tournamentId === id;
        } else {
          return tournamentName === slug;
        }
      });
    });

    const enrichedMatches = filteredEvents.map((event) => {
      const minute = event.time?.minute;
      const injuryTime = event.time?.injuryTime;
      let timeInMatch = "";

      if (["inprogress", "live"].includes(event.status?.type)) {
        timeInMatch = injuryTime
          ? `${minute}+${injuryTime}'`
          : `${minute}'`;
      } else if (event.status?.type === "halftime") {
        timeInMatch = "HT";
      } else if (event.status?.type === "finished") {
        timeInMatch = "FT";
      } else {
        timeInMatch = "LIVE";
      }

      return {
        id: event.id,
        team1: event.homeTeam?.name,
        team2: event.awayTeam?.name,
        team1Logo: `${BASE_URL}/team/${event.homeTeam?.id}/image`,
        team2Logo: `${BASE_URL}/team/${event.awayTeam?.id}/image`,
        score: `${event.homeScore?.current ?? "-"} - ${event.awayScore?.current ?? "-"}`,
        date: new Date(event.startTimestamp * 1000).toLocaleDateString(),
        venue: event.venue?.name || "Unknown", // ✅ get venue directly
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


const corsProxy = "https://cors-anywhere.herokuapp.com/";

export const getTeamMatches = async (teamName, pageNo) => {
  if (!teamName) {
    console.warn("No team name provided");
    return [];
  }

  try {
    const searchRes = await axios.get(
      `${BASE_URL}/search/all/`,
      {
        params: { q: teamName },
        headers: { Accept: "application/json" },
      }
    );
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
    const response = await axios.get(
      `https://api.sofascore.com/api/v1/event/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching match details:", error);
    throw error;
  }
};
