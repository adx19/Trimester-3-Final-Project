import SearchBar from "../components/SearchBar";
import PlayingNow from "../components/PlayingNow";
import MatchList from "../components/MatchList";
import { useSearch } from "../context/context";

function Live() {
  const { search } = useSearch();

  return (
    <div>
      {search ? <MatchList leagueName={search} /> : <PlayingNow />}
    </div>
  );
}

export default Live;
