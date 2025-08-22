import React, { useState } from "react";
import SearchBar from "../components/SearchBar";
import { getMatchId, useSearch, useStatus } from "../context/context";
import PlayingNow from "../components/PlayingNow";
import { leagueSlugToId } from "../../public/league names/league-names";
import UpcomingEvent from "../components/Scorecarddesign/UpcomingEvent";
import FootballScoreCard from "../components/Scorecarddesign/FootballScoreCard";
import MatchList from "../components/MatchList";
import MatchDetails from "./MatchDetails";

function Home() {
  const { status } = useStatus();
  const { search } = useSearch();
  const { id, setId } = getMatchId();
  const topLeagues = leagueSlugToId;

  console.log('Selected Match ID:', id)

  return (
    <div>
      <SearchBar />
      <div>
        {!search && status === "live" && <PlayingNow />}
        {!search && status === "previous" && (
          <>
            {topLeagues.map((league, idx) => (
              <FootballScoreCard leagueName={league} key={idx} />
            ))}
          </>
        )}
        {!search && status === "upcoming" && (
          <>
            {topLeagues.map((league, idx) => (
              <UpcomingEvent leagueName={league} key={idx} />
            ))}
          </>
        )}
        {search && <MatchList leagueName={search} />}
        {id && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-[90vw] max-w-2xl max-h-[90vh] overflow-y-auto relative">
              <MatchDetails />
            </div>
          </div>
          
        )}
      </div>
    </div>
  );
}

export default Home;
