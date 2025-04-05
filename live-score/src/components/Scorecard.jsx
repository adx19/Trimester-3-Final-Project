import React from 'react'
import FootballScoreCard from './Scorecarddesign/FootballScoreCard'
import CricketScoreCard from './Scorecarddesign/CricketScoreCard'

function Scorecard({gametype}) {
  return (
    <>
    {gametype == "football" ? <FootballScoreCard /> : <CricketScoreCard />}
    </>
  )
}

export default Scorecard