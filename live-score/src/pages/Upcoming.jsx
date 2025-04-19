import SearchBar from "../components/SearchBar";
import UpcomingEvent from "../components/Scorecarddesign/UpcomingEvent";
import MatchList from "../components/MatchList";
import { useSearch } from "../context/context";
import { leagueSlugToId } from "../../public/league names/league-names";

function Upcoming() {
  const { search } = useSearch();
  const topLeagues = Object.keys(leagueSlugToId);

  return (
    <div>
      {search ? (
        <MatchList leagueName={search} />
      ) : (
        topLeagues.map((league, idx) => (
          <UpcomingEvent leagueName={league} key={idx} />
        ))
      )}
    </div>
  );
}

export default Upcoming;
