import SearchBar from "../components/SearchBar";
import FootballScoreCard from "../components/Scorecarddesign/FootballScoreCard";
import MatchList from "../components/MatchList";
import { useSearch } from "../context/context";
import { leagueSlugToId } from "../assets/league-names/league-names";

function Previous() {
  const { search } = useSearch();
  const topLeagues = Object.keys(leagueSlugToId);

  return (
    <div>
      {search ? (
        <MatchList leagueName={search} />
      ) : (
        topLeagues.map((league, idx) => (
          <FootballScoreCard leagueName={league} key={idx} />
        ))
      )}
    </div>
  );
}

export default Previous;
