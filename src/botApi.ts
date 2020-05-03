import { User } from './types'
import { getAllRunners, updateRunner, getRunner } from './db'
import { buildLeaderboard } from './utils'

export const doAdd = (user: User, remainingArgs: string[]): string => {
    if (!remainingArgs) {
        return 'No miles to be added, please run this command again with a distance'
    }
    const hasValidUnit =
        remainingArgs[0].slice(-2) === 'km' ||
        remainingArgs[0].slice(-2) === 'mi'
    const unit = hasValidUnit ? remainingArgs[0].slice(-2) : 'mi'
    const distance = hasValidUnit
        ? Number(remainingArgs[0].slice(0, -2))
        : Number(remainingArgs[0])
    const newMileage = updateRunner(
        user,
        unit === 'km' ? distance / 1.6 : distance
    )
    return isNaN(newMileage)
        ? `There was a problem adding your entry, please try again later`
        : `Your current mileage is ${newMileage}`
}

export const doLeaderboard = (): string => {
    const runners = getAllRunners()
    runners.sort((a, b) => b.miles - a.miles)
    return buildLeaderboard(runners)
}

export const doMileage = (user: User): string => {
    const runner = getRunner(user)
    return `Your current mileage is ${runner.miles}`
}

export const doHelp = (): string => {
    return `__Help Menu__
        > Available Commands:
        > !add [miles][unit] ex. 1.5mi or 2km
        >       - add miles to your total
        > !mileage
        >       - view your total mileage
        > !leaderboard
        >       - view the leaderboard
        > !help
        >       - view the help menu
    `
}
