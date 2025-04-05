import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
function CricketScoreCard() {
  return (
    <>
      <div className="border-3 rounded-2xl border-emerald-500 w-[300px] h-[300px] m-[20px]">
        <div className="flex flex-col">
          <div className="text-xl font-bold flex flex-row mt-[10px] ml-[10px]">
            <img
              src="https://upload.wikimedia.org/wikipedia/en/thumb/2/2f/Delhi_Capitals.svg/1200px-Delhi_Capitals.svg.png"
              className="h-[60px]"
            ></img>
            <div className="mt-[20px]">DC - </div>
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
          <div className="mt-[15px]">CSK - </div>
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
