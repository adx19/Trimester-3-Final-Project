import React from "react";
import SearchBar from "../components/SearchBar";
import { useStatus } from "../context/context";
import PlayingNow from "../components/PlayingNow";
import { topLeagues } from "../../public/league names/league-names";
import UpcomingEvent from "../components/Scorecarddesign/UpcomingEvent";
import FootballScoreCard from "../components/Scorecarddesign/FootballScoreCard";

function Home() {
  const { status } = useStatus();

  console.log("Home.jsx Status:", status); // ✅ Debug

  return (
    <div>
      <SearchBar />
      <div>
        {status == "live" && (
          <>
            <PlayingNow/>
          </>
        )}

        {status == "previous" && (
          <>
            {topLeagues.map((league, idx) => (
              <FootballScoreCard leagueName={league} key={idx} />
            ))}
          </>
        )}

        {status == "upcoming" && (
          <>
            {topLeagues.map((league, idx) => (
              <UpcomingEvent leagueName={league} key={idx} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default Home;
