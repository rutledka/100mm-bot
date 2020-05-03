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
        } - ${runner.miles}\n`
    })
    return message
}
