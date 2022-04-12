const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, Permissions } = require('discord.js')
const { scriptyError } = require('../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Ban user from server')
    .addUserOption((option) =>
      option
        .setName('user')
        .setDescription('Select a user')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('reason')
        .setDescription('Reason for ban')
    ),
  permissions: [Permissions.FLAGS.BAN_MEMBERS],
  async execute (interaction) {
    await interaction.deferReply()

    const user = interaction.options.getUser('user')
    const member = interaction.options.getMember('user')
    const reason = interaction.options.getString('reason') || 'None'

    if (!member) {
      let banned = null
      try {
        banned = await interaction.guild.bans.fetch({ user, force: true })
        if (banned) {
          const embed = new MessageEmbed()
            .setColor('#ED4245')
            .setAuthor({ name: 'Ban Error', iconURL: scriptyError })
            .setDescription('You cannot ban a user that is already banned!')
          await interaction.editReply({ embeds: [embed] })
        }
      } catch (error) {
        if (!banned) {
          interaction.guild.members.ban(user, { reason: reason })
          const embed = new MessageEmbed()
            .setColor('#57F287')
            .setTitle('Ban')
            .setDescription(`Banned **${user.tag}** \nReason: \`${reason}\``)
          await interaction.editReply({ embeds: [embed] })
        }
      }
      return
    }

    if (member.permissions.has(this.permissions)) {
      const embed = new MessageEmbed()
        .setColor('#ED4245')
        .setAuthor({ name: 'Permissions Error', iconURL: scriptyError })
        .setDescription('You cannot ban a moderator!')
      await interaction.editReply({ embeds: [embed] })
      return
    }

    interaction.guild.members.ban(member, { reason: reason })
    const embed = new MessageEmbed()
      .setColor('#57F287')
      .setTitle('Ban')
      .setDescription(`Banned **${user.tag}** \nReason: \`${reason}\``)
    await interaction.editReply({ embeds: [embed] })
  }
}
