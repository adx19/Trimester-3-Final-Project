import axios from 'axios';

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';

export const getTeamData = async (teamName) => {
  const data = await axios.get(`${BASE_URL}/searchteams.php?t=${teamName}`)

  return data.data.teams?.[res.data.events.length - 1];
}

export const latestfixture = async () =>{
  const data = await axios.get(`${BASE_URL}/eventsround.php?id=4335&r=11&s=2024-2025`)

  return data.data.events?.[1];
} 
