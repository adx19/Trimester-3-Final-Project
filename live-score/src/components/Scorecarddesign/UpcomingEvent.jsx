import React, { useEffect, useState } from "react";
import { getSeasonId, getUpcomingMatches } from "../../url/api";

function UpcomingEvent({leagueName}) {
  const [fixtures, setFixtures] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const seasonDate = await getSeasonId(leagueName);
      const data = await getUpcomingMatches(leagueName, seasonDate);
      setFixtures(data);
    };
  
    fetchData();
  }, [leagueName]); // Add dependency
  

  return (
    <div>
      <div className="flex flex-col flex-wrap items-center font-bold text-2xl text-emerald-500">
        {leagueName.toUpperCase()} - Upcoming:
        <div className="font-bold flex flex-row justify-start flex-wrap gap-15 p-4 ml-[30px] overflow-y-hidden webkit-scrollbar::none mb-[30px] border-b-[2px] w-full border-b-[2px] border-emerald-500">
          {fixtures.map((match, idx) => (
            <div
              key={idx}
              className="border-2 rounded-2xl border-emerald-500 w-[320px] h-[260px] flex flex-col items-center justify-between p-4 shadow-lg"
            >
              <div className="text-xl font-bold">
                {match.team1} vs {match.team2}
              </div>
              <div className="text-sm text-gray-600">{match.venue}</div>
              <div className="text-sm text-gray-600">{match.time}</div>
              <div className="flex items-center justify-around w-full mt-2">
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
      </div>
    </div>
  );
}

export default UpcomingEvent;
