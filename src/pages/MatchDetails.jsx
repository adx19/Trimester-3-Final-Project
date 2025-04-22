import React, { useEffect, useState } from "react";
import { getMatchId } from "../context/context";
import { getMatchDetails, getMatchStatistics, getTeamData } from "../url/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

function MatchDetails() {
  const [matchData, setMatchData] = useState(null);
  const { id, getId } = getMatchId();
  const [homeTeamLogo, setHomeTeamLogo] = useState(null);
  const [awayTeamLogo, setAwayTeamLogo] = useState(null);
  const [statistics, setStatistics] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      const data = await getMatchDetails(id);
      setMatchData(data?.event);
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

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      const data = await getMatchStatistics(id);
      if (!data || !isMounted) return;
      setStatistics(data);
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, [id]);

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
    "Semifinals",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-[90vw] max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button
          className="absolute top-4 right-4 text-emerald-500 text-xl"
          onClick={() => getId(null)}
        >
          <FontAwesomeIcon icon={faCircleXmark} />
        </button>

        <div className="flex flex-col items-center font-bold text-emerald-600 w-full space-y-4">
          <div>
            {matchData.roundInfo.name || `MatchDay ${matchData.roundInfo.round}`}
          </div>
          <div className="text-2xl">
            {matchData.homeTeam.name} vs {matchData.awayTeam.name}
          </div>
          <div className="text-gray-500 text-sm">
            {matchData.startTimestamp
              ? `${
                  new Date(matchData.startTimestamp * 1000)
                    .toISOString()
                    .split("T")[0]
                } || `
              : "TBD"}
            {matchData.startTimestamp
              ? new Date(matchData.startTimestamp * 1000).toLocaleTimeString(
                  [],
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )
              : "TBD"}
          </div>
          <div className="text-sm text-gray-600">
            {matchData.venue?.name || "Unknown Venue"}
          </div>

          <div className="grid grid-cols-3 items-start w-full px-6 font-bold gap-4">
            <div className="flex flex-col items-center justify-start h-full">
              <img
                src={homeTeamLogo}
                alt="home"
                className="w-[100px] h-[100px] object-contain"
              />
              <div className="text-emerald-500 text-sm text-center mt-2 max-h-[80px] overflow-y-auto">
                {statistics?.homeTeamGoalScorers?.map((scorer, index) => (
                  <div key={index}>
                    <span className="text-emerald-500">⚽</span>
                    {scorer.minute}" {scorer.player}
                  </div>
                ))}
                {statistics?.homeTeamRedCardReceivers?.map(
                  (receiver, index) => (
                    <div key={index}>
                      🟥{receiver.minute}" {receiver.player}
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center h-[100px] text-3xl font-semibold text-emerald-500">
              <div>
                {matchData.homeScore.current ?? "-"} -{" "}
                {matchData.awayScore.current ?? "-"}
              </div>
              {rounds.find((e) => e.includes(matchData.roundInfo.name)) ? (
                <div className="text-xs text-gray-600">
                  ({matchData.homeScore.aggregated} -{" "}
                  {matchData.awayScore.aggregated})
                </div>
              ) : null}
            </div>
            <div className="flex flex-col items-center justify-start h-full">
              <img
                src={awayTeamLogo}
                alt="away"
                className="w-[100px] h-[100px] object-contain"
              />
              <div className="text-emerald-500 text-sm text-center mt-2 max-h-[80px] overflow-y-auto">
                {statistics?.awayTeamGoalScorers?.map((scorer, index) => (
                  <div key={index}>
                    <span className="text-emerald-500">⚽</span>
                    {scorer.minute}" {scorer.player}
                  </div>
                ))}
                {statistics?.awayTeamRedCardReceivers?.map(
                  (receiver, index) => (
                    <div key={index}>
                      🟥{receiver.minute}' {receiver.player}
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </div>

        {matchData.status?.type != 'notstarted' && <div className="mt-5">
          <div className="flex items-center justify-center font-bold">
            <div className="bg-emerald-500 text-white rounded-xl w-[100px] text-center">
              STATS
            </div>
          </div>

          <div className="flex flex-row justify-evenly text-emerald-500 font-bold my-2">
            <div className="flex flex-1 justify-center">
              {statistics?.possession?.home}
            </div>
            <div className="flex flex-1 justify-center">Possession</div>
            <div className="flex flex-1 justify-center">
              {statistics?.possession?.away}
            </div>
          </div>

          <div className="flex flex-row justify-evenly text-emerald-500 font-bold my-2">
            <div className="flex flex-1 justify-center">
              {statistics?.totalShots?.home} ({statistics?.shotsOnTarget?.home})
            </div>
            <div className="flex flex-1 justify-center">Shots</div>
            <div className="flex flex-1 justify-center">
              {statistics?.totalShots?.away} ({statistics?.shotsOnTarget?.away})
            </div>
          </div>

          <div className="flex flex-row justify-evenly text-emerald-500 font-bold my-2">
            <div className="flex flex-1 justify-center">
              {statistics?.passes?.home}
            </div>
            <div className="flex flex-1 justify-center">Passes</div>
            <div className="flex flex-1 justify-center">
              {statistics?.passes?.away}
            </div>
          </div>

          <div className="flex flex-row justify-evenly text-emerald-500 font-bold my-2">
            <div className="flex flex-1 justify-center">
              {statistics?.accuratePasses?.home}
            </div>
            <div className="flex flex-1 justify-center">Accurate Passes</div>
            <div className="flex flex-1 justify-center">
              {statistics?.accuratePasses?.away}
            </div>
          </div>

          <div className="flex flex-row justify-evenly text-emerald-500 font-bold my-2">
            <div className="flex flex-1 justify-center">
              {`${(
                (statistics?.accuratePasses?.home / statistics?.passes?.home) *
                100
              ).toFixed(0)}%`}
            </div>
            <div className="flex flex-1 justify-center">Pass Accuracy</div>
            <div className="flex flex-1 justify-center">
              {`${(
                (statistics?.accuratePasses?.away / statistics?.passes?.away) *
                100
              ).toFixed(0)}%`}
            </div>
          </div>

          <div className="flex flex-row justify-evenly text-emerald-500 font-bold my-2">
            <div className="flex flex-1 justify-center">
              {statistics?.saves?.home}
            </div>
            <div className="flex flex-1 justify-center">Saves</div>
            <div className="flex flex-1 justify-center">
              {statistics?.saves?.away}
            </div>
          </div>

          <div className="flex flex-row justify-evenly text-emerald-500 font-bold my-2">
            <div className="flex flex-1 justify-center">
              {statistics?.yellowCards?.home}
            </div>
            <div className="flex flex-1 justify-center">Yellow Card</div>
            <div className="flex flex-1 justify-center">
              {statistics?.yellowCards?.away}
            </div>
          </div>

          <div className="flex flex-row justify-evenly text-emerald-500 font-bold my-2">
            <div className="flex flex-1 justify-center">
              {statistics?.redCards?.home}
            </div>
            <div className="flex flex-1 justify-center">Red Card</div>
            <div className="flex flex-1 justify-center">
              {statistics?.redCards?.away}
            </div>
          </div>
        </div>}
      </div>
    </div>
  );
}

export default MatchDetails;