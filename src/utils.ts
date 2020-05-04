import { Runner } from './types'

const commandRegex = RegExp('^!.[a-z]')

export const parseCommand = (testString: string): boolean =>
    commandRegex.test(testString)

export const buildLeaderboard = (runners: Runner[]): string => {
    let message = ''
    runners.forEach((runner, index) => {
        const stringIndex = String(index + 1)
        message += `${stringIndex.padStart(3 - stringIndex.length, '0')} - ${
            runner.username
        } - ${runner.totalMiles} miles\n`
    })
    return message
}

export const buildMileageResponse = (miles: number): string =>
    `You've run ${miles} miles total! ${100 - miles} miles remaining!`
