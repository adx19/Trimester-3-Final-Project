import React from "react";
import SearchBar from "../components/SearchBar";
import { useSearch, useStatus } from "../context/context";
import PlayingNow from "../components/PlayingNow";
import { leagueSlugToId } from "../../public/league names/league-names";
import UpcomingEvent from "../components/Scorecarddesign/UpcomingEvent";
import FootballScoreCard from "../components/Scorecarddesign/FootballScoreCard";
import MatchList from "../components/MatchList";

function Home() {
  const { status } = useStatus();
  const { search } = useSearch();
  console.log("Home.jsx Status:", status); 
  const topLeagues = Object.keys(leagueSlugToId);


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
      </div>
    </div>
  );
}

export default Home;
