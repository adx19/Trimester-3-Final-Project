import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Previous from "./pages/Previous";
import Upcoming from "./pages/Upcoming";
import MatchDetails from "./pages/MatchDetails";
import Live from "./pages/LIVE";
import MatchList from "./components/MatchList";
import SearchBar from "./components/SearchBar";
import { getMatchId } from "./context/context";
import "./App.css";

function App() {
  const location = useLocation();
  const { id } = getMatchId();

  return (
    <>
      <SearchBar />

      <div className={`content-container ${id ? 'blur-sm pointer-events-none' : ''}`}>
        <Routes location={location}>
          <Route index element={<Navigate to="/live" />} />
          <Route path="/live" element={<Live />} />
          <Route path="/previous" element={<Previous />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/search/:leagueName" element={<MatchList />} />
        </Routes>
      </div>

      {id && <MatchDetails />}
    </>
  );
}

export default App;
