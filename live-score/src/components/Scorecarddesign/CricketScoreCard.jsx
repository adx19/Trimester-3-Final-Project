import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { countryDetails, latestfixturescric } from "../../url/api";
function CricketScoreCard() {
  const [team1, setTeam1] = useState(null)
  const [team2, setTeam2] = useState(null)

  const [team1Flag, setTeam1Flag] = useState(null)
  const [team2Flag, setTeam2Flag] = useState(null) 

  useEffect(() => {
    const fixture = async () => {
      const matchtest = await latestfixturescric();
      if(matchtest){
        countryDetails(matchtest.teams[0]);
        countryDetails(matchtest.teams[1]);
        console.log(matchtest.teams[0]);
        setTeam1(matchtest.teams[0]);
        setTeam2(matchtest.teams[1]);
      }

    }

    fixture();
  }, [])
  
  
  return (
    <>
      <div className="border-3 rounded-2xl border-emerald-500 w-[300px] h-[300px] m-[20px]">
        <div className="flex flex-col">
          <div className="text-xl font-bold flex flex-row mt-[10px] ml-[10px]">
            <img
              src={team1Flag}
              className="h-[60px]"
            ></img>
            <div className="mt-[20px]">{team1} - </div>
            <div className="mt-[20px] ml-[10px]">146/4</div>
          </div>
        </div>
        <div className="font-bold text-blue-500 ml-[25px] mt-[5px]">
          <div>
            <FontAwesomeIcon
              icon={faCircle}
              className="text-blue-500 mr-[5px] text-xs"
            ></FontAwesomeIcon>
            KL Rahul : 68*(43)
          </div>
          <div className="mt-[5px] ml-[20px]">T.Stubbs : 0*(0)</div>
        </div>
        <div className="text-lg font-bold flex flex-row mt-[15px] ml-[10px]">
          <img
            src="https://upload.wikimedia.org/wikipedia/en/thumb/2/2b/Chennai_Super_Kings_Logo.svg/1200px-Chennai_Super_Kings_Logo.svg.png"
            className="h-[60px]"
          ></img>
          <div className="mt-[15px]">{team2} - </div>
          <div className="mt-[15px] ml-[10px]">16.1(20)</div>
        </div>
        <div className="font-bold text-yellow-500 ml-[25px]">
          K.Ahmed : 2/18(3.2)
        </div>

        <div className="font-bold  ml-[5px]">
          17th over:
          <div className="flex flex-row font-bold justify-start mt-[4px]">
            <div className="font-bold bg-yellow-500 text-red-500 w-[25px] rounded-lg border-2 border-yellow-500 flex flex-row justify-center mr-[5px]">W</div>
            <div className="font-bold bg-blue-500 text-black-500 w-[25px] rounded-lg flex flex-row justify-center mr-[5px]">2</div>
            <div className="font-bold bg-blue-500 w-[25px] rounded-lg flex flex-row justify-center mr-[5px]">4</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CricketScoreCard;
