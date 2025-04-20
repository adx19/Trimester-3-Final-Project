import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Import useParams to capture the leagueName
import { getTeamMatches } from "../url/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { getMatchId } from "../context/context";

function MatchList() {
const { leagueName } = useParams(); // Get leagueName from the URL
const [fixtures, setfixtures] = useState([]);
const [count, setcount] = useState(1);
const { id , getId } = getMatchId();

function increment() {
  setcount(count + 1);
}

function decrement() {
  setcount(count - 1);
}

function handleMatchClick(matchId){
  getId(matchId);
}

useEffect(() => {
  getId(null)
}, [])

useEffect(() => {
  const fetchData = async () => {
    if (!leagueName) return;
    const matches = await getTeamMatches(leagueName, count - 1); // keep -1 if API is 0-indexed
    setfixtures(matches);
  };
  fetchData();
}, [leagueName, count]);

return (
  <div>
    <div className="flex flex-col flex-wrap items-center font-bold text-2xl text-emerald-500">
      <div className="font-bold flex flex-row justify-start flex-wrap gap-15 p-4 ml-[30px] webkit-scrollbar::none mt-[8px] border-b-[2px] w-full border-b-[2px] border-emerald-500">
        {fixtures.map((match, idx) => (
          <div
            key={idx}
            className="border-2 rounded-2xl border-emerald-500 w-[320px] h-[260px] flex flex-col items-center justify-between p-4 shadow-lg transition-transform duration-300 hover:-translate-y-5 -translate-x-5 cursor-pointer"
            onClick={() => {
              handleMatchClick(match.id)
              console.log(match.id)
            }}
          >
            <div className="text-xl font-bold">
              {match.team1} vs {match.team2}
            </div>
            <div className="text-sm text-gray-600">{match.venue}</div>
            <div className="text-sm text-gray-600">
              {match.date} || {match.time}
            </div>
            <div className="text-sm text-red-600 font-semibold">
              {match.minutesInMatch}
            </div>
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
            <div className="flex items-center " >
              {match.status === "LIVE" ? (
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
      <div className="flex justify-center text-2xl text-emerald-500 font-bold h-[5vh] mb-[20px] mt-[20px] gap-8 flex-row items-center">
        {count > 1 && (
          <button onClick={() => decrement()} disabled={count === 1}>
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        )}
        <p>{count}</p>
        <button onClick={() => increment()}>
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  </div>
);
}

export default MatchList;