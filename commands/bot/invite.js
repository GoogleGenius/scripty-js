const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('Replies with Scripty bot invite'),
  async execute (interaction) {
    await interaction.deferReply()
    const embed = new MessageEmbed()
      .setColor('#5865F2')
      .setTitle('Invite')
      .setDescription('Invite Scripty to your Discord Server!')
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setLabel('Add to Server')
        .setStyle('LINK')
        .setURL(
          'https://discord.com/api/oauth2/authorize?client_id=883496337616822302&permissions=8&scope=bot%20applications.commands'
        )
    )
    await interaction.editReply({ embeds: [embed], components: [row] })
  }
}
