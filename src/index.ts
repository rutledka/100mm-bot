require('dotenv').config()
import Discord from 'discord.js'
import { Command, User } from './types'
import { doAdd, doHelp, doLeaderboard, doMileage } from './botApi'
import { parseCommand } from './utils'

const client = new Discord.Client()

const createReply = (
    command: keyof typeof Command,
    user: User,
    remainingArgs: string[] = []
): string | void => {
    console.log(`processing command: ${command}`)
    switch (command) {
        case Command.add:
            return doAdd(user, remainingArgs)
        case Command.leaderboard:
            return doLeaderboard()
        case Command.mileage:
            return doMileage(user)
        case Command.help:
            return doHelp()
        default:
            return
    }
}

client.on('ready', () => {
    console.log(`Logged in as ${client?.user?.tag}!`)
})

client.on('message', (msg) => {
    const lines = msg.content.toLowerCase().split('\n')
    let message = ''
    let shouldRespond = false
    lines.forEach((line) => {
        const contentArray = line.split(' ')
        if (parseCommand(contentArray[0])) {
            shouldRespond = true
            const command = contentArray[0].slice(1)
            const remaining = contentArray.slice(1)
            const user = {
                id: msg.author.id,
                username: msg.author.username
            }
            message += `${createReply(command as Command, user, remaining)}\n`
        }
    })
    shouldRespond && msg.reply(`\n${message}`)
})

client.login(process.env.DISCORD_TOKEN)
