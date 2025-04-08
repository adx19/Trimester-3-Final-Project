import React from "react";
import SearchBar from "../components/SearchBar";
import Scorecard from "../components/Scorecard";
import { useSport } from "../context/context";
import PlayingNow from "../components/PlayingNow";
import { topLeagues } from "../../public/league names/league-names";
import UpcomingEvent from "../components/Scorecarddesign/UpcomingEvent";
topLeagues
function Home() {
  const { sport } = useSport();
  return (
    <>
      <div className="overflow-y-scroll scrollbar-hide">
        <SearchBar />
        <PlayingNow />
        {topLeagues.map((league, idx) => (
          <Scorecard key={idx} gametype={sport} footballLeague={league} />
        ))}
        {topLeagues.map((league, idx) => (
          <UpcomingEvent leagueName={league} key={idx} />
        ))}
      </div>
    </>
  );
}

export default Home;
