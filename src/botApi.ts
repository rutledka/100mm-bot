import { User, Command } from './types'
import { getAllRunners, updateRunner, getRunner } from './db'
import { buildLeaderboard, buildMileageResponse } from './utils'

export const doAdd = async (
    user: User,
    remainingArgs: string[]
): Promise<string> => {
    if (!remainingArgs) {
        return 'No miles to be added, please run this command again with a distance'
    }
    const hasValidUnit =
        remainingArgs[0]?.slice(-2) === 'km' ||
        remainingArgs[0]?.slice(-2) === 'mi'
    const unit = hasValidUnit ? remainingArgs[0].slice(-2) : 'mi'
    const distance = hasValidUnit
        ? Number(remainingArgs[0].slice(0, -2))
        : Number(remainingArgs[0])
    const newMileage = await updateRunner(
        user,
        unit === 'km' ? distance / 1.6 : distance
    )
    console.log('newMileage', newMileage)
    return isNaN(newMileage)
        ? `There was a problem adding your entry, please try again later`
        : buildMileageResponse(newMileage)
}

export const doLeaderboard = async (): Promise<string> => {
    const runners = await getAllRunners()
    runners.sort((a, b) => b.totalMiles - a.totalMiles)
    return buildLeaderboard(runners)
}

export const doMileage = async (user: User): Promise<string> => {
    const runner = await getRunner(user)
    return buildMileageResponse(runner.totalMiles)
}

export const doHelp = (): string => {
    return `__Help Menu__
Available Commands:
> **!add** [miles][unit]
>   - ex. !add 1.5mi OR !add 2km
>   - add miles to your total, defaults to miles if no unit is added
> **!mileage**
>   - view your total mileagex
> **!leaderboard**
>   - view the leaderboard
> **!help**
>   - view the help menu
`
}

export const createReply = async (
    command: keyof typeof Command,
    user: User,
    remainingArgs: string[] = []
): Promise<string> => {
    console.log(`processing command: ${command}`)
    switch (command) {
        case Command.add:
            return await doAdd(user, remainingArgs)
        case Command.leaderboard:
            return doLeaderboard()
        case Command.mileage:
            return doMileage(user)
        case Command.help:
            return doHelp()
        default:
            return Promise.resolve('')
    }
}
