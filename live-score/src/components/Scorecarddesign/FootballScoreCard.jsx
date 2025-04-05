import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { latestfixture } from "../../url/api";
function FootballScoreCard() {
  const [Event, setEvent] = useState(null)
  const [HomeTeamBadge ,setHomeTeamBadge] = useState(null)
  const [AwayTeamBadge ,setAwayTeamBadge] = useState(null)
  const [homeScore, setHomeScore] = useState(null)
  const [awayScore, setAwayScore] = useState(null)
  const [Venue, setVenue] = useState(null)
  const [Date, setDate] = useState(null)

  useEffect(() => {
    const fixture = async () =>{
      const lastfixture = await latestfixture();

      if(lastfixture){
        setEvent(lastfixture.strEvent)
        setHomeTeamBadge(lastfixture.strHomeTeamBadge)
        setAwayTeamBadge(lastfixture.strAwayTeamBadge)
        setHomeScore(lastfixture.intHomeScore)
        setAwayScore(lastfixture.intAwayScore)
        setVenue(lastfixture.strVenue)
        setDate(lastfixture.dateEvent)
      }

    }

    fixture();
  }, []);

  return (
    <>
      
        <div className="border-3 rounded-2xl border-emerald-500 w-[300px] h-[220px] flex font-bold flex-col items-center m-[20px]">
          <div className="mt-2 text-xl">{Event}</div>
          <div className="text-mg">{Venue}</div>
          <div className="text-mg">{Date}</div>
          <div className="flex flex-row items-evenly mt-[10px]">
            <img src={`${HomeTeamBadge}`} className="mr-[20px] w-[80px]"/>
            <div className="mt-4 text-3xl">{homeScore} - {awayScore}</div>
            <img src={`${AwayTeamBadge}`} className="ml-[23px] w-[80px]"/>
          </div>
          <div className="flex flex-row -ml-[8px]">
            <FontAwesomeIcon
              icon={faCircle}
              className="text-red-500 text-mg mt-[5px] text-xs"
            />
            <div className="ml-[3px]">LIVE</div>
          </div>
        </div>
    </>
  );
}

export default FootballScoreCard;
