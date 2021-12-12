import {getUserInput, pointsTable} from './utils.js'

async function  test(params) {
  console.log(await getUserInput({}, pointsTable.length))
}

test()