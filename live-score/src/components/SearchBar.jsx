import React, { useEffect } from "react";
import Image from "../assets/image.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useSearch, useStatus } from "../context/context";

function SearchBar() {
  const{setStatus} = useStatus();
  const {setSearch} = useSearch();

  function renderSearch(){
    const element = document.querySelector('input').value;
    setSearch(element.trim());
  }
  

  function handleStatus(set){
    setStatus(set);
    setSearch(null);
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      renderSearch();
    }
  };
  
  useEffect(() => {
    async function testSearch() {
      try {
        const response = await fetch(
          "https://api.sofascore.com/api/v1/search/all?query=Manchester%20City"
        );
        const data = await response.json();
        console.log("Direct fetch test response:", data);
      } catch (error) {
        console.error("Fetch test failed:", error);
      }
    }
  
    testSearch();
  }, []);
  return (
    <>
      <div className="flex flex-row  w-full border-b-4 border-emerald-500">
        <div className="flex flex-row items-center">
          <img src={Image} className="h-[150px]"></img>
        </div>
        <div className="mt-[50px] ml-[100px] flex flex-row justify-evenly text-emerald-500 text-3xl font-bold">
          <div onClick={() => handleStatus("live")} className="cursor-pointer">Now Playing</div>
          <div className="ml-[50px] cursor-pointer" onClick={() => handleStatus("previous")}>Past Matches</div>
          <div className="ml-[50px] cursor-pointer" onClick={() => handleStatus("upcoming")}>Upcoming Matches</div>
        </div>
        <div className="mt-[50px] ml-[80px]">
          <input
            type="input"
            placeholder=" Search Team Name"
            className="h-10 text-green-700 text-lg  font-bold w-200 rounded-xl border-2 border-emerald-500 focus:border-emerald-500 focus:outline-none"
            onKeyDown={handleKeyPress}
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="ml-[15px] text-emerald-500 font-bold text-xl cursor-pointer"
            onClick={() => renderSearch()}
          />
        </div>
      </div>
    </>
  );
}

export default SearchBar;
