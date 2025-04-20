// api/matches.js

import {
  getLiveFootballMatches,
  getTeamMatches,
  getleaugeMatches,
  getSeasonId,
  getUpcomingMatches,
  getTeamData,
  getMatchDetails,
  getMatchStatistics
} from '../src/url/api.js'; 

export default async function handler(req, res) {
  console.log("API endpoint hit!");
  const { query } = req;
  const { type, teamName, pageNo, leagueSlug, matchId } = query;

  try {
    let data;

    switch (type) {
      case 'live':
        data = await getLiveFootballMatches();
        break;

      case 'teamMatches':
        if (!teamName || !pageNo) {
          return res.status(400).json({ error: 'Missing teamName or pageNo' });
        }
        data = await getTeamMatches(teamName, pageNo);
        break;

      case 'leagueMatches':
        if (!leagueSlug) {
          return res.status(400).json({ error: 'Missing leagueSlug' });
        }
        data = await getleaugeMatches(leagueSlug);
        break;

      case 'upcomingMatches':
        if (!leagueSlug) {
          return res.status(400).json({ error: 'Missing leagueSlug' });
        }
        data = await getUpcomingMatches(leagueSlug);
        break;

      case 'seasonId':
        if (!leagueSlug) {
          return res.status(400).json({ error: 'Missing leagueSlug' });
        }
        data = await getSeasonId(leagueSlug);
        break;

      case 'teamData':
        if (!teamName) {
          return res.status(400).json({ error: 'Missing teamName' });
        }
        data = await getTeamData(teamName);
        break;

      case 'matchDetails':
        if (!matchId) {
          return res.status(400).json({ error: 'Missing matchId' });
        }
        data = await getMatchDetails(matchId);
        break;

      case 'matchStatistics':
        if (!matchId) {
          return res.status(400).json({ error: 'Missing matchId' });
        }
        data = await getMatchStatistics(matchId);
        break;

      default:
        return res.status(400).json({ error: 'Invalid type specified' });
    }

    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}