import * as readline from 'readline';
import _ from 'lodash'
import { stdin as input, stdout as output } from 'process';

const rl = readline.createInterface({ input, output });

export const Toss = {
    batFirst: 'batting',
    ballFirst: "balling"
  }


export function question(theQuestion) {
    return new Promise(resolve => rl.question(theQuestion, answer => {
      resolve(answer)
    }))
  }
  
  function tester(regex) {
    const regExp = new RegExp(regex)
  
   return (input) => {
       let result = regExp.test(parseInt(input))
  
     return result
   }
  }

  
  function getInput(gameQuestion, tester) {
  
    //for take valid input
    return new Promise(async (resolve) => {
      pointsTable
      let result = null
  
      while (true) {
  
        result = await question(gameQuestion)
  
        if (result && tester(result)) {
          resolve(parseInt(result))
  
          break;
        } else {
  
          console.log('invalid input ...')
        }
      }
  
    })
  }
  

  export async function getUserInput(state, noOfTeams) {
  
    let selectTeam = pointsTable.map((team, index) => {
      return `press ${index + 1} for ${team.teamName}`
    })

  
 
    selectTeam.push(' :- ')
    selectTeam = selectTeam
    
    let firstTeam = await getInput(
      selectTeam.join('\n'),
      tester(`^[0-${noOfTeams}]$`),
    )
    
  
    let secondTeam = await getInput(
      selectTeam.join('\n'),
      (team) => tester(`^[0-${noOfTeams}]$`)(team) && team != firstTeam
    )
  
    let position = await getInput(
      'Desired Position for Your Team in Points Table :- ',
      tester(`^[0-${noOfTeams}]$`),
    )
  
    let tossResult =  await getInput(
      `Toss Result : press 0 for ${Toss.batFirst} and 1 for ${Toss.ballFirst} :- `,
      tester(`^[0-1]$`),
    )

    state.tossResult = tossResult === 0 ? Toss.batFirst : Toss.ballFirst
  
    state.runScored = await getInput(
      'run scored :-',
      tester('^[0-9]+$'),
    )

    state.totalOvers =  await getInput(
        'Total overs :-',
        tester('^[0-9]+$'),
      )

    rl.close()

    state.firstTeam = pointsTable[firstTeam - 1]
    state.secondTeam = pointsTable[secondTeam - 1]
    state.desiredPosition = pointsTable[position - 1]

    state.position = position
    return state
  }
  
export function getRealOverVal(overString) {

  let overs = overString.split('.')
  return parseInt(overs[0]) + (overs[1] ? parseInt(overs[1]) / 6  : 0)
}
4
 export const pointsTable = [
    {
      teamName: 'Chennai Super Kings',
      matches: 7,
      nrr: 0.771,
      points: 10,
      for: {
        runs: 1130,
        overs: '133.1'
      },
      against: {
        runs: 1071,
        overs: '138.5'
      }
    }, {
      teamName: 'Royal Challengers Bangalore',
      matches: 7,
      nrr: 0.597,
      points: 8,
      for: {
        runs: 1217,
        overs: '140'
      },
      against: {
        runs: 1066,
        overs: '131.4'
      }
    }, {
      teamName: 'Delhi Capitals',
      matches: 7,
      nrr: 0.319,
      points: 8,
      for: {
        runs: 1085,
        overs: '126'
      },
      against: {
        runs: 1136,
        overs: '137'
      }
    }, {
      teamName: 'Rajasthan Royals',
      matches: 7,
      nrr: 0.331,
      points: 6,
      for: {
        runs: 1066,
        overs: '128.2'
      },
      against: {
        runs: 1094,
        overs: '137.1'
      }
    }, {
      teamName: 'Mumbai Indians',
      matches: 7,
      nrr: -1.75,
      points: 6,
      for: {
        runs: 1003,
        overs: '155.2'
      },
      against: {
        runs: 1134,
        overs: '138.1'
      }
      
    },
  ]  

  
  export function calculateNrr(forRuns ,forOvers, againstRuns ,againstOvers) {
    return (forRuns / forOvers) - (againstRuns / againstOvers)
  }

  export function getPointsTable(array) {
    return _.orderBy(array, ['points', 'nrr'], ['desc', 'desc'])
  }

  export function  getTeamPosition(
    filteredTable,
    team1,
    team2,
    firstTeam,
    secondTeam
    ) {
    

    let firstTeamNrr = calculateNrr(
      team1.forRuns,
      team1.forOvers,
      team1.againstRuns,
      team1.againstOvers
    )

    let secondTeamNrr = calculateNrr(
      team2.forRuns,
      team2.forOvers,
      team2.againstRuns,
      team2.againstOvers
    )

    let table = getPointsTable([
      ...filteredTable,
      {...firstTeam, nrr: firstTeamNrr, points: firstTeam.points + 2, },
      {...secondTeam, nrr: secondTeamNrr, points: secondTeam.points, }
    ])  

    console.table(table)

    const {
      firstTeamPosition,
      secondTeamPosition
    } = getTeamPositionByName(table, firstTeam.teamName, secondTeam.teamName)

    return {
      firstTeamPosition,
      firstTeamNrr
    }
    

  }


  export function getTeamPositionByName(pointsTable, firstTeamName, secondTeamName) {
  let firstTeamPosition
  let secondTeamPosition

  for (let i = 0; !(firstTeamPosition && secondTeamPosition); i++) {

    const element = pointsTable[i];

    if(element.teamName === firstTeamName) {
      firstTeamPosition = i + 1
    }

    if(element.teamName === secondTeamName) {
      secondTeamPosition = i + 1
    }
  }
  
  return {
    firstTeamPosition,
    secondTeamPosition
  }
}


export function ballsToOvers(balls) {
  if ((balls % 6) === 0) {
    return balls / 6
  }

  let i = 0

  while((balls + i) % 6 != 0) {
    i++
  }

  return `${parseInt(balls / 6)}.${6 - i}`
}