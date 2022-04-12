const { MessageEmbed } = require('discord.js')
const { scriptyError } = require('../config.json')

module.exports = {
  name: 'interactionCreate',
  async execute (interaction) {
    if (!interaction.isCommand()) return

    const command = interaction.client.commands.get(interaction.commandName)

    if (!command) return

    try {
      if (!interaction.inGuild()) {
        await interaction.deferReply({ ephemeral: true })
        const embed = new MessageEmbed()
          .setColor('#ED4245')
          .setAuthor({ name: 'Interaction Error', iconURL: scriptyError })
          .setDescription('Unable to run commands in Direct Messages!')
        await interaction.editReply({ embeds: [embed] })
      } else if (command.permissions && command.permissions.length > 0) {
        if (!interaction.guild.me.permissions.has(command.permissions)) {
          await interaction.deferReply()
          const embed = new MessageEmbed()
            .setColor('#ED4245')
            .setAuthor({ name: 'Permissions Error', iconURL: scriptyError })
            .setDescription(
              'Scripty does not have the correct permissions to run this command. Please add `Administrator` privileges to the Scripty integration role or reinvite the bot'
            )
          await interaction.editReply({ embeds: [embed] })
        } else if (!interaction.member.permissions.has(command.permissions)) {
          await interaction.deferReply()
          const embed = new MessageEmbed()
            .setColor('#ED4245')
            .setAuthor({ name: 'Permissions Error', iconURL: scriptyError })
            .setDescription(
              'Permissions insufficient! User cannot execute command'
            )
          await interaction.editReply({ embeds: [embed] })
        } else await command.execute(interaction)
      } else await command.execute(interaction)
    } catch (error) {
      console.error(error)

      if (interaction.deferred) {
        const embed = new MessageEmbed()
          .setColor('#ED4245')
          .setAuthor({ name: 'Interaction Error', iconURL: scriptyError })
          .setDescription('This interaction failed pending execution')
        await interaction.editReply({ embeds: [embed] })
        return
      }

      await interaction.deferReply({ ephemeral: true })
      const embed = new MessageEmbed()
        .setColor('#ED4245')
        .setAuthor({ name: 'Interaction Error', iconURL: scriptyError })
        .setDescription('This interaction failed pending execution')
      await interaction.editReply({ embeds: [embed] })
    }
  }
}
