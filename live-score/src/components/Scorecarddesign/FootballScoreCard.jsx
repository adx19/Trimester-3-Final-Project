import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { latestfixture } from "../../url/api";
function FootballScoreCard() {
  const [eachFixture, setEachFixture] = useState([]);

  useEffect(() => {
    const fixture = async () => {
      const lastfixture = await latestfixture();
      if (lastfixture) {
        setEachFixture(lastfixture);
      }
    };

    fixture();
  }, []);

  return (
    <>
      <div className="flex flex-row flex-wrap gap-4">
        {eachFixture.map((game, idx) => {
          return (
            <div className="border-3 rounded-2xl border-emerald-500 w-[400px] h-[220px] flex font-bold flex-col items-center m-[20px]">
              <div className="mt-2 text-xl">{game.strEvent}</div>
              <div className="text-mg">{game.strVenue}</div>
              <div className="text-mg">
                {game.dateEvent} | {game.strTime}
              </div>
              <div className="flex flex-row items-evenly mt-[10px]">
                <img
                  src={`${game.strHomeTeamBadge}`}
                  className="mr-[20px] w-[80px]"
                />
                <div className="mt-4 text-3xl">
                  {game.intHomeScore} - {game.intAwayScore}
                </div>
                <img
                  src={`${game.strAwayTeamBadge}`}
                  className="ml-[23px] w-[80px]"
                />
              </div>
              <div className="flex flex-row -ml-[8px]">
                {["1H", "2H"].includes(game.strStatus) ? (
                  <>
                    <FontAwesomeIcon
                      icon={faCircle}
                      className="text-red-500 text-mg mt-[5px] text-xs"
                    />
                    <div className="ml-[3px]">LIVE</div>
                  </>
                ) : (
                  <>{game.strStatus}</>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

export default FootballScoreCard;
