import React, { useEffect, useState } from "react";
import { getMatchId } from "../context/context";
import { getMatchDetails, getTeamData } from "../url/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

function MatchDetails() {
  const [matchData, setMatchData] = useState(null);
  const { id, getId } = getMatchId();
  const [homeTeamLogo, setHomeTeamLogo] = useState(null);
  const [awayTeamLogo, setAwayTeamLogo] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const data = await getMatchDetails(id);
      setMatchData(data?.event);  // make sure to access `.event`
    };
    fetchData();
  }, [id]);
  
  useEffect(() => {
    const fetchLogos = async () => {
      if (!matchData) return;
      const homeId = await getTeamData(matchData.homeTeam.name);
      const awayId = await getTeamData(matchData.awayTeam.name);
      setHomeTeamLogo(`https://api.sofascore.app/api/v1/team/${homeId}/image`);
      setAwayTeamLogo(`https://api.sofascore.app/api/v1/team/${awayId}/image`);
    };
    fetchLogos();
  }, [matchData]);
  

  if (!matchData) return null;

  const rounds = [
    "Preliminary Round",
    "First Qualifying Round",
    "Second Qualifying Round",
    "Third Qualifying Round",
    "Play-offs",
    "Round of 32",
    "Round of 16",
    "Quarterfinals",
    "Semifinals"
  ];

  return (
    <div className="flex flex-row">
      <div className="flex flex-col items-center font-bold text-emerald-600 space-y-4 w-full">
        <div>
          {matchData.roundInfo.name || `MatchDay ${matchData.roundInfo.round}`}
        </div>
        <div className="text-2xl">
          {matchData.homeTeam.name} vs {matchData.awayTeam.name}
        </div>
        <div className="text-gray-500 text-sm">
          {matchData.startTimestamp
            ? new Date(matchData.startTimestamp * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "TBD"}
        </div>
        <div className="text-sm text-gray-600">
          {matchData.venue?.name || "Unknown Venue"}
        </div>
        <div>
          
          
        </div>
        <div className="flex items-center justify-around w-full px-4">
          <img src={homeTeamLogo} alt="home" className="w-[80px]" />
          <div className="flex flex-col items-center">
          <div className="text-3xl font-semibold">
            {matchData.homeScore.current ?? "-"} -{" "}
            {matchData.awayScore.current ?? "-"}
          </div>
          {rounds.find(e => e.includes(matchData.roundInfo.name)) ? `(${matchData.homeScore.aggregated} - ${matchData.awayScore.aggregated})` : <></>}
          </div>
          <img src={awayTeamLogo} alt="away" className="w-[80px]" />
        </div>
      </div>
      <div className=" top-0 right-0">
        <button className="rounded-xl text-red-500 cursor-pointer" onClick={() => getId(null)}>
          <FontAwesomeIcon icon={faCircleXmark} />
        </button>
      </div>
    </div>
  );
}

export default MatchDetails;
