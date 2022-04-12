const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('flip')
    .setDescription('Flip a coin'),
  async execute (interaction) {
    await interaction.deferReply()
    const coin = ['Heads', 'Tails']
    const random = array => {
      return array[Math.floor(Math.random() * array.length)]
    }
    const embed = new MessageEmbed()
      .setColor('#5865F2')
      .setTitle('Flip')
      .setDescription(random(coin))
    await interaction.editReply({ embeds: [embed] })
  }
}
