// Import keepAlive from server.js and create web server
const keepAlive = require('./server')

const fs = require('fs')
const { Client, Collection, Intents } = require('discord.js')
const token = process.env.TOKEN

const client = new Client({ intents: [Intents.FLAGS.GUILDS] })

// Slash command handler
client.commands = new Collection()

const commandFolders = fs
  .readdirSync('./commands')

for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter((file) => file.endsWith('.js'))

  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`)
    client.commands.set(command.data.name, command)
  }
}

const testCommandFiles = fs
  .readdirSync('./test-commands')
  .filter((file) => file.endsWith('.js'))

for (const file of testCommandFiles) {
  const command = require(`./test-commands/${file}`)
  client.commands.set(command.data.name, command)
}

// Event handler
const eventFiles = fs
  .readdirSync('./events')
  .filter(file => file.endsWith('.js'))

for (const file of eventFiles) {
  const event = require(`./events/${file}`)
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args))
  } else {
    client.on(event.name, (...args) => event.execute(...args))
  }
}

// Call function for web server using Express
keepAlive()

client.login(token)
