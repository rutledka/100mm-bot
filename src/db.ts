import runners from '../json/runners.json'
import fs from 'fs'
import { Runner, DB, User } from './types'

export const getRunner = (user: User): Runner => {
    return (
        ((runners as unknown) as DB)[user.id] || {
            id: user.id,
            username: user.username,
            miles: 0,
            lastCheckedIn: new Date(Date.now()).toUTCString()
        }
    )
}

export const getAllRunners = (): Runner[] => {
    // Fix these later
    // @ts-ignore
    return Object.keys(runners).map((key) => runners[key] as Runner)
}

export const updateRunner = (user: User, mileage: number): number => {
    const runner = getRunner(user)
    const newMileage = runner.miles + mileage
    // @ts-ignore
    runners[user.id] = {
        ...runner,
        miles: newMileage,
        lastCheckedIn: new Date(Date.now()).toUTCString()
    }
    try {
        fs.writeFile(
            './json/runners.json',
            JSON.stringify(runners, null, 4),
            (err) => {
                if (err) throw err
            }
        )
    } catch (e) {
        console.error('Error writing to runners JSON file')
        return NaN
    }
    return newMileage
}
