const fs = require('fs')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const clientId = process.env.CLIENT_ID
const guildId = process.env.GUILD_ID
const token = process.env.TOKEN

const rest = new REST({ version: '9' }).setToken(token)

const commands = []
const commandFolders = fs.readdirSync('./commands')

for (const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`./commands/${folder}`).filter((file) => file.endsWith('.js'))
  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`)
    commands.push(command.data.toJSON())
  }
}

(async () => {
  try {
    console.log('Started refreshing application (/) commands.')

    await rest.put(Routes.applicationCommands(clientId), {
      body: commands
    })

    console.log('Successfully reloaded application (/) commands.')
  } catch (error) {
    console.error(error)
  }
})()

const testCommands = []
const testCommandFiles = fs
  .readdirSync('./test-commands')
  .filter((file) => file.endsWith('.js'))

for (const file of testCommandFiles) {
  const command = require(`./test-commands/${file}`)
  testCommands.push(command.data.toJSON())
}

(async () => {
  try {
    console.log('Started refreshing application guild (/) commands.')

    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: testCommands
    })

    console.log('Successfully reloaded application guild (/) commands.')
  } catch (error) {
    console.error(error)
  }
})()

// Delete Guild Commands
// rest.get(Routes.applicationGuildCommands(clientId, guildId))
//     .then(data => {
//         const promises = [];
//         for (const command of data) {
//             const deleteUrl = `${Routes.applicationGuildCommands(clientId, guildId)}/${command.id}`;
//             promises.push(rest.delete(deleteUrl));
//         }
//         return Promise.all(promises);
//     });
