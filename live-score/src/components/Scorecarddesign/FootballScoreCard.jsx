import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { fetchSofaScoreData } from "../../../api/sofascore"; // adjust path as needed

function FootballScoreCard() {
  const [eachFixture, setEachFixture] = useState([]);

  useEffect(() => {
    const fetchFixture = async () => {
      const sofaData = await fetchSofaScoreData();
      setEachFixture(sofaData);
    };

    fetchFixture();
  }, []);

  return (
    <div className="flex flex-row flex-wrap gap-4">
      {eachFixture.map((game, idx) => (
        <div
          key={idx}
          className="border-3 rounded-2xl border-emerald-500 w-[400px] h-[220px] flex font-bold flex-col items-center m-[20px]"
        >
          <div className="mt-2 text-xl">{game.title || `${game.team1} vs ${game.team2}`}</div>
          <div className="text-mg">{game.venue || "Unknown Venue"}</div>
          <div className="text-mg">{game.date || "TBD"} | {game.time || "TBD"}</div>
          <div className="flex flex-row items-center mt-[10px]">
            <img src={game.team1Logo} alt="" className="mr-[20px] w-[80px]" />
            <div className="mt-4 text-3xl">{game.score || "-"}</div>
            <img src={game.team2Logo} alt="" className="ml-[23px] w-[80px]" />
          </div>
          <div className="flex flex-row -ml-[8px]">
            {["1H", "2H", "LIVE"].includes(game.status) ? (
              <>
                <FontAwesomeIcon
                  icon={faCircle}
                  className="text-red-500 text-mg mt-[5px] text-xs"
                />
                <div className="ml-[3px]">LIVE</div>
              </>
            ) : (
              <>{game.status}</>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default FootballScoreCard;
