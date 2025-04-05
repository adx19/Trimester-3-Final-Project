import React from "react";
import SearchBar from "../components/SearchBar";
import Scorecard from "../components/Scorecard";
import { useSport } from "../context/context";

function Home() {
  const { sport } = useSport();
  return (
    <>
      <SearchBar />
      <Scorecard gametype={sport} />
    </>
  );
}

export default Home;
