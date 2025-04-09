import React from "react";
import Image from "../assets/image.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useStatus } from "../context/context";

function SearchBar() {
  const{setStatus} = useStatus();
  return (
    <>
      <div className="flex flex-row  w-full border-b-4 border-emerald-500">
        <div className="flex flex-row items-center">
          <img src={Image} className="h-[150px]"></img>
        </div>
        <div className="mt-[50px] ml-[100px] flex flex-row justify-evenly text-emerald-500 text-3xl font-bold">
          <div onClick={() => setStatus("live")} className="cursor-pointer">Now Playing</div>
          <div className="ml-[50px] cursor-pointer" onClick={() => setStatus("previous")}>Past Matches</div>
          <div className="ml-[50px] cursor-pointer" onClick={() => setStatus("upcoming")}>Upcoming Matches</div>
        </div>
        <div className="mt-[50px] ml-[80px]">
          <input
            type="input"
            placeholder=" Search Match"
            className="h-10 text-green-700 text-lg  font-bold w-200 rounded-xl border-2 border-emerald-500 focus:border-emerald-500 focus:outline-none"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="ml-[15px] text-emerald-500 font-bold text-xl"
          />
        </div>
      </div>
    </>
  );
}

export default SearchBar;
