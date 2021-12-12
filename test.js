import {
  getUserInput,
  pointsTable,
  Toss,
  getRealOverVal,
  getTeamPosition,
  ballsToOvers
} from './utils.js'



let state = {
  firstTeam: null,
  secondTeam: null,
  position: null,
  tossResult: null,
  runScored: null,
  totalOvers: null,
  desiredPosition: null
}

async function main() {

  const {
    firstTeam,
    secondTeam,
    desiredPosition,
    position,
    tossResult,
    runScored,
    totalOvers
  } = await getUserInput(state, pointsTable.length)

  const filteredTable = pointsTable.filter((team) => ![firstTeam.teamName, secondTeam.teamName].includes(team.teamName))

  

  if ( desiredPosition.points > firstTeam.points + 2) {
    console.log('sorry you cannot reach at this position')
    return
  }

  if (tossResult === Toss.batFirst){
    let maxScore = null
    let miniRunRate = null
    let maxRunRate = null
    let minimumScore = null
    let rate = null
    let preRate = null

      let end = runScored - 1
      while (end >= 0) {

        let team1 = {
          forRuns: firstTeam.for.runs + runScored,
          forOvers: getRealOverVal(firstTeam.for.overs) + totalOvers,
          againstRuns: firstTeam.against.runs + end,
          againstOvers: getRealOverVal(firstTeam.against.overs) + totalOvers
        }

        let team2 = {
          forRuns: secondTeam.for.runs + end,
          forOvers: getRealOverVal(secondTeam.for.overs) + totalOvers,
          againstRuns: secondTeam.against.runs + runScored,
          againstOvers: getRealOverVal(secondTeam.against.overs) + totalOvers
        }

        preRate = rate

        const {
          firstTeamPosition,
          firstTeamNrr
        } = getTeamPosition(filteredTable, team1, team2, firstTeam, secondTeam)

        rate = firstTeamNrr

        if (maxScore === null && firstTeamPosition === position) {
            maxRunRate = firstTeamNrr
            maxScore = end 
        }

        if ( minimumScore === null && firstTeamPosition < position) {
          miniRunRate = preRate
          minimumScore = end + 1
          break;
        }

        end--
      }

      console.log(`
        If Rajasthan Royals score ${runScored} runs in ${totalOvers} overs, Rajasthan Royals need to
        restrict Delhi Capitals between ${minimumScore || 0} to ${maxScore} runs in ${totalOvers}.
        Revised NRR of Rajasthan Royals will be between ${miniRunRate} to ${maxRunRate}.
      `)
  } 

  if (tossResult === Toss.ballFirst) {
    let totalBalls = totalOvers * 6
    let maxBalls = null
    let minBalls = null
    let miniRunRate = null
    let maxRunRate = null
    let rate = null
    let preRate = null

    while(totalBalls >= 0) {
      
      let team1 = {
        forRuns: firstTeam.for.runs + runScored + 1,
        forOvers: getRealOverVal(firstTeam.for.overs) + (totalBalls / 6),
        againstRuns: firstTeam.against.runs + runScored, 
        againstOvers: getRealOverVal(firstTeam.against.overs) + totalOvers
      }

      let team2 = {
        forRuns: secondTeam.for.runs + runScored,
        forOvers: getRealOverVal(secondTeam.for.overs) + totalOvers,
        againstRuns: secondTeam.against.runs + runScored + 1,
        againstOvers: getRealOverVal(secondTeam.against.overs) + ( totalBalls / 6 )
      }

      preRate = rate

      const {
        firstTeamPosition,
        firstTeamNrr
      } = getTeamPosition(filteredTable, team1, team2, firstTeam, secondTeam)

       rate = firstTeamNrr

      if (maxBalls === null && firstTeamPosition === position) {
        maxRunRate = firstTeamNrr
        maxBalls = totalBalls 
      }


      if (minBalls === null && firstTeamPosition < position) {
        miniRunRate = rate
        minBalls = totalBalls - 1
        break;
      }

      totalBalls--
    }

    console.log(`
    ${firstTeam.teamName} needs to chase ${runScored} between ${ballsToOvers(minBalls)} and ${ballsToOvers(maxBalls)} Overs.
    Revised NRR for X_team_name will be between ${miniRunRate} to ${maxRunRate}`)

  }
}

main()

























