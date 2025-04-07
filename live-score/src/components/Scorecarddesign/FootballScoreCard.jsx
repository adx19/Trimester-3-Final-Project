import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { getLiveFootballMatches } from "../../url/api";

function FootballScoreCard() {
  const [fixtures, setFixtures] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getLiveFootballMatches();
      setFixtures(data);
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-row flex-wrap justify-center gap-6 p-4">
      {fixtures.map((match, idx) => (
        <div
          key={idx}
          className="border-2 rounded-2xl border-emerald-500 w-[360px] h-[240px] flex flex-col items-center justify-between p-4 shadow-lg"
        >
          <div className="text-xl font-bold">
            {match.team1} vs {match.team2}
          </div>
          <div className="text-sm text-gray-600">{match.venue}</div>
          <div className="text-sm text-gray-600">
            {match.date} | {match.time}
          </div>

          <div className="flex items-center justify-around w-full mt-4">
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
            {match.status === "LIVE" ? (
              <>
                <FontAwesomeIcon
                  icon={faCircle}
                  className="text-red-500 text-xs mr-2"
                />
                <span className="text-red-500 font-medium">LIVE</span>
              </>
            ) : (
              <span className="text-gray-500 text-sm">{match.status}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default FootballScoreCard;
