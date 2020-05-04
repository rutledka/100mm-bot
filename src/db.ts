require('dotenv').config()
// import runners from '../json/runners.json'
// import fs from 'fs'
import { Runner, FireBaseDB, User } from './types'
import * as admin from 'firebase-admin'
// import { collection, get /*, add, set, update*/ } from 'typesaurus'

const app = admin.initializeApp({
    credential: admin.credential.cert(
        process.env.GOOGLE_APPLICATION_CREDENTIALS || ''
    ),
    databaseURL: process.env.FIREBASE_DATABASE_URL || ''
})

const database = app.database()

export const getRunner = async (user: User): Promise<Runner> => {
    let runner: Runner = {
        id: user.id,
        username: user.username,
        totalMiles: 0,
        lastCheckedIn: new Date(Date.now()).toUTCString(),
        checkInCount: 0
    }
    await database
        .ref(`users/${user.id}`)
        .once('value')
        .then((snapshot) => {
            runner = snapshot.val()
        })
        .catch((e) => {
            console.error(e)
        })
    return runner
}

export const getAllRunners = async (): Promise<Runner[]> => {
    let runners: FireBaseDB = {}
    await database
        .ref('users/')
        .once('value')
        .then((snapshot) => (runners = snapshot.val()))
    return Object.keys(runners).map((key) => runners[key] as Runner)
}

export const updateRunner = async (
    user: User,
    mileage: number
): Promise<number> => {
    const runner = await getRunner(user)
    const newMileage = Number(runner.totalMiles) + mileage
    const newRunner = {
        ...runner,
        totalMiles: newMileage,
        lastCheckedIn: new Date(Date.now()).toUTCString(),
        checkInCount: runner.checkInCount + 1
    }
    let didError = false
    await database.ref(`users/${user.id}`).set(newRunner, (err) => {
        if (err) {
            didError = true
            console.error('Error while updating runner in firebase')
        }
    })

    return didError ? NaN : newMileage
}
