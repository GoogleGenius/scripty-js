const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Display the help interface'),
  async execute (interaction) {
    await interaction.deferReply()
    const embed = new MessageEmbed()
      .setColor('#5865F2')
      .setTitle('Help')
      .setDescription(
        'Post Traumatic Ship Disorder is real. Please contact Dr. Hrishikesh Kondiboyina PhD Psychology as soon as possible.'
      )
    await interaction.editReply({ embeds: [embed] })
  }
}
