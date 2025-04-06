import axios from 'axios';

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';
const BASE_URL_CRIC = 'https://api.cricapi.com/v1'
const API_KEY = import.meta.env.VITE_API_KEY;


export const getTeamData = async (teamName) => {
  const data = await axios.get(`${BASE_URL}/searchteams.php?t=${teamName}`)

  return data.data.teams?.[res.data.events.length - 1];
}

export const latestfixture = async () =>{
  const data = await axios.get(`${BASE_URL}/eventsround.php?id=4335&r=33&s=2024-2025`)

  return data.data.events;
}

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
    console.log("Full response from cricapi /matches:", response.data);

    const matchList = response?.data?.data;

    if (Array.isArray(matchList) && matchList.length > 0) {
      return matchList[0];
    } else {
      console.warn("No matches found in response");
      return null;
    }
  } catch (error) {
    console.error("Error in latestfixturescric:", error.message);
    return null;
  }
};