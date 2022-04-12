const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rickroll')
    .setDescription('😉'),
  async execute (interaction) {
    await interaction.deferReply()
    await interaction.editReply('https://youtu.be/dQw4w9WgXcQ')
  }
}
