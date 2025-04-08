import React from 'react'
import FootballScoreCard from './Scorecarddesign/FootballScoreCard'
import CricketScoreCard from './Scorecarddesign/CricketScoreCard'

function Scorecard({gametype, footballLeague}) {
  return (
    <>
    {gametype == "football" ? <FootballScoreCard leagueName={footballLeague}/> : <CricketScoreCard />}
    </>
  )
}

export default Scorecard