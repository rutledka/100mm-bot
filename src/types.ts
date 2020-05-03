/* eslint-disable @typescript-eslint/member-delimiter-style */
export enum Command {
    add = 'add',
    mileage = 'mileage',
    leaderboard = 'leaderboard',
    help = 'help'
}

export type User = {
    id: string
    username: string
}

export type Runner = {
    id: string
    username: string
    miles: number
    lastCheckedIn: string
}

export type DB = {
    [key: string]: Runner
}
