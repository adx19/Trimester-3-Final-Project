import React, { useEffect, useState } from "react";
import { getLiveFootballMatches } from "../url/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { getMatchId } from "../context/context";

function PlayingNow() {
  const [fixtures, setFixtures] = useState([]);
  const {getId} = getMatchId();
  useEffect(() => {
    const fetchData = async () => {
      const matches = await getLiveFootballMatches();
      setFixtures(matches);
    };
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);
  

  return (
    <div>
      <div className="flex flex-col flex-wrap items-center font-bold text-2xl text-emerald-500">
        LIVE:
        <div className="font-bold flex flex-row justify-start flex-wrap gap-14 p-4 ml-[30px] webkit-scrollbar::none mt-[8px] border-b-[2px] w-full border-b-[2px] border-emerald-500 ">
          {fixtures.map((match, idx) => (
            <div
              key={idx}
              className="border-2 rounded-2xl border-emerald-500 w-[320px] h-[260px] flex flex-col items-center justify-between p-4 shadow-lg transition-transform duration-300 hover:-translate-y-5 -translate-x-5 cursor-pointer"
              onClick={() => {
                getId(match.id)
              }}
            >
              <div className="text-xl font-bold">
                {match.team1} vs {match.team2}
              </div>
              <div className="text-sm text-gray-600">{match.venue}</div>
              <div className="text-sm text-gray-600">
                {match.date} || {match.time}
              </div>

              <div className="text-sm text-red-600 font-semibold -mb-2">
                {match.timeInMatch}
              </div>

              <div className="flex items-center justify-around w-full">
                <img
                  src={match.team1Logo}
                  alt={match.team1}
                  className="w-16 h-16 object-contain"
                />
                <div className="text-3xl font-semibold">{match.score}</div>
                <img
                  src={match.team2Logo}
                  alt={match.team2}
                  className="w-16 h-16 object-contain"
                />
              </div>

              <div className="flex items-center mt-2">
                {match.status == "LIVE" ? (
                  <>
                    <FontAwesomeIcon
                      icon={faCircle}
                      className="text-red-500 text-xs mr-2"
                    />
                    <span className="text-red-500 font-medium">LIVE</span>
                  </>
                ) : (
                  <span className="text-gray-500 text-sm">
                    {match.status.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PlayingNow;  