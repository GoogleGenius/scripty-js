const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with bot latency'),
  async execute (interaction) {
    await interaction.deferReply()
    const embed = new MessageEmbed()
      .setColor('#5865F2')
      .setTitle('Ping')
      .setDescription(`Pong! \`${interaction.client.ws.ping}ms\``)
    await interaction.editReply({ embeds: [embed] })
  }
}
