import React, { useEffect, useState } from 'react';
import { getUpcomingMatches } from '../../url/api';
import { getMatchId } from '../../context/context';

function UpcomingEvent({ leagueName }) {
  const [fixtures, setFixtures] = useState([]);
  const{getId} = getMatchId();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getUpcomingMatches(leagueName);
      setFixtures(data);
    };

    getId(null);
    fetchData();
  }, []);

  return (
    <div>
      <div className="flex flex-col items-center font-bold text-2xl text-emerald-500">
        {leagueName.toUpperCase()} - Upcoming:
        <div className="font-bold flex flex-wrap gap-4 p-4 ml-[30px]  mt-[8px] border-b-2 w-full border-emerald-500">
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
              <div className="text-sm text-gray-600">{match.date} || {match.time}</div>
              <div className="flex items-center justify-around w-full mt-2">
                <img
                  src={match.team1Logo}
                  alt={match.team1}
                  className="w-16 h-16 object-contain"
                />
                <img
                  src={match.team2Logo}
                  alt={match.team2}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div className="flex items-center mt-2">
                <span className="text-gray-500 text-sm">{match.status.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default UpcomingEvent;