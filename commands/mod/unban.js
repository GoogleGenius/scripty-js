const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, Permissions } = require('discord.js')
const { scriptyError } = require('../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unban a user from server')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('Input user ID')
        .setRequired(true)),
  permissions: [Permissions.FLAGS.BAN_MEMBERS],
  async execute (interaction) {
    await interaction.deferReply()

    const user = interaction.options.getUser('user')

    let banned = null
    try {
      banned = await interaction.guild.bans.fetch({ user, force: true })
      if (banned) {
        interaction.guild.members.unban(user)
        const embed = new MessageEmbed()
          .setColor('#57F287')
          .setTitle('Unban')
          .setDescription(`Unbanned **${user.tag}**`)
        await interaction.editReply({ embeds: [embed] })
      }
    } catch (error) {
      if (!banned) {
        const embed = new MessageEmbed()
          .setColor('#ED4245')
          .setAuthor({ name: 'Unban Error', iconURL: scriptyError })
          .setDescription('You cannot unban user that is not banned!')
        await interaction.editReply({ embeds: [embed] })
      }
    }
  }
}
