const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setDescription('Replies with bot uptime'),
  async execute (interaction) {
    await interaction.deferReply()
    let totalSeconds = interaction.client.uptime / 1000
    const days = Math.floor(totalSeconds / 86400)
    totalSeconds %= 86400
    const hours = Math.floor(totalSeconds / 3600)
    totalSeconds %= 3600
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)
    const embed = new MessageEmbed()
      .setColor('#5865F2')
      .setTitle('Uptime')
      .setDescription(
        `\`${days}\` days, \`${hours}\` hours, \`${minutes}\` minutes & \`${seconds}\` seconds`
      )
    await interaction.editReply({ embeds: [embed] })
  }
}
