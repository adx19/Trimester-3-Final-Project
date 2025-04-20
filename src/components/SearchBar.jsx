import React from "react";
import Image from "../assets/image.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useSearch} from "../context/context";
import { useNavigate } from "react-router-dom";

function SearchBar() {
  const { setSearch } = useSearch();
  const navigate = useNavigate();

  function renderSearch() {
    const element = document.querySelector('input').value;
    setSearch(element.trim());

    if (element.trim()) {
      navigate(`/search/${element.trim()}`);
    }
  }

  function handleStatus(set) {
    setSearch(null);

    if (set === "live") {
      navigate("/live");
    } else if (set === "previous") {
      navigate("/previous");
    } else if (set === "upcoming") {
      navigate("/upcoming");
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      renderSearch();
    }
  };

  return (
    <>
      <div className="flex flex-row w-full border-b-4 border-emerald-500">
        <div className="flex flex-row items-center">
          <img src={Image} className="h-[150px] cursor-pointer" alt="logo"  onClick={() => handleStatus("live")} />
        </div>
        <div className="mt-[50px] ml-[100px] flex flex-row justify-evenly text-emerald-500 text-3xl font-bold">
          <div onClick={() => handleStatus("live")} className="cursor-pointer">Now Playing</div>
          <div className="ml-[50px] cursor-pointer" onClick={() => handleStatus("previous")}>Past Matches</div>
          <div className="ml-[50px] cursor-pointer" onClick={() => handleStatus("upcoming")}>Upcoming Matches</div>
        </div>
        <div className="mt-[50px] ml-[80px]">
          <input
            type="input"
            placeholder="Search Team Name"
            className="h-10 text-green-700 text-lg font-bold w-200 rounded-xl border-2 border-emerald-500 focus:border-emerald-500 focus:outline-none"
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
