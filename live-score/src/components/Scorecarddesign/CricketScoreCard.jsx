import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { countryDetails, latestfixturescric } from "../../url/api";

function CricketScoreCard() {
  const [match, setMatch] = useState(null);
  const [team1Flag, setTeam1Flag] = useState(null);
  const [team2Flag, setTeam2Flag] = useState(null);

  useEffect(() => {
    const fetchMatchData = async () => {
      const match = await latestfixturescric();
  
      if (match && match.teams?.length === 2) {
        setMatch(match); // <-- ✅ Set the match data in state
  
        const flag1 = await countryDetails(match.teams[0]);
        const flag2 = await countryDetails(match.teams[1]);
  
        setTeam1Flag(flag1?.flag || "/default-logo.png");
        setTeam2Flag(flag2?.flag || "/default-logo.png");
      }
    };
  
    fetchMatchData();
  }, []);
  
  

  if (!match) return null;

  return (
    <div className="border-3 rounded-2xl border-emerald-500 w-[340px] h-[330px] m-[20px]">
      <div className="flex flex-col">
        <div className="text-xl font-bold flex flex-row mt-[10px] ml-[10px]">
          <img src={team1Flag} className="h-[60px]" alt="Team 1 Flag" />
          <div className="mt-[20px]">{match.teams[0] || "Team 1"} </div>
          <div className="mt-[20px] ml-[10px]">Score Unavailable</div>
        </div>
      </div>
      <div className="font-bold text-blue-500 ml-[25px] mt-[5px]">
        <FontAwesomeIcon icon={faCircle} className="text-blue-500 mr-[5px] text-xs" />
        Status: {match.status}
      </div>
      <div className="text-lg font-bold flex flex-row mt-[15px] ml-[10px]">
        <img src={team2Flag} className="h-[60px]" alt="Team 2 Flag" />
        <div className="mt-[15px]">{match.teams[1] || "Team 2"} </div>
        <div className="mt-[15px] ml-[10px]">Overs Unavailable</div>
      </div>
      <div className="font-bold text-yellow-500 ml-[25px]">
        Venue: {match.venue || "TBD"}
      </div>
      <div className="font-bold ml-[5px]">
        Start Time:
        <div className="flex flex-row font-bold justify-start mt-[4px]">
          {match.dateTimeGMT
            ? new Date(match.dateTimeGMT).toLocaleString()
            : "TBD"}
        </div>
      </div>
    </div>
  );
}

export default CricketScoreCard;
