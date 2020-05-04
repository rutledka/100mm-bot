require('dotenv').config()
import Discord from 'discord.js'
import { Command } from './types'
import { createReply } from './botApi'
import { parseCommand } from './utils'

const client = new Discord.Client()

client.on('ready', () => {
    console.log(`Logged in as ${client?.user?.tag}!`)
})

client.on('message', (msg) => {
    if (msg.author.id === client.user?.id) {
        return
    }
    const lines = msg.content.toLowerCase().split('\n')
    const message: string[] = []
    let shouldRespond = false
    lines.forEach(async (line, index) => {
        const contentArray = line.split(' ')
        if (parseCommand(contentArray[0])) {
            shouldRespond = true
            const command = contentArray[0].slice(1)
            const remaining = contentArray.slice(1)
            const user = {
                id: msg.author.id,
                username: msg.author.username
            }
            await createReply(command as Command, user, remaining).then((msg) =>
                message.push(msg)
            )
            index === lines.length - 1 &&
                shouldRespond &&
                msg.reply(`\n${message.join('\n')}`)
        }
    })
})

client.login(process.env.DISCORD_TOKEN)
