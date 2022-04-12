const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, Permissions } = require('discord.js')
const { scriptyError } = require('../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kick member from server')
    .addUserOption((option) =>
      option
        .setName('member')
        .setDescription('Select a member')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option.setName('reason').setDescription('Reason for kick')
    ),
  permissions: [Permissions.FLAGS.KICK_MEMBERS],
  async execute (interaction) {
    await interaction.deferReply()

    const member = interaction.options.getMember('member')
    const user = interaction.options.getUser('member')
    const reason = interaction.options.getString('reason') || 'None'

    if (!member) {
      const embed = new MessageEmbed()
        .setColor('#ED4245')
        .setAuthor({ name: 'Invalidation Error', iconURL: scriptyError })
        .setDescription('Invalid member!')
      await interaction.editReply({ embeds: [embed] })
      return
    }
    
    if (member.permissions.has(this.permissions)) {
      const embed = new MessageEmbed()
        .setColor('#ED4245')
        .setAuthor({ name: 'Permissions Error', iconURL: scriptyError })
        .setDescription('You cannot kick a moderator!')
      await interaction.editReply({ embeds: [embed] })
      return
    }

    member.kick(reason)
    const embed = new MessageEmbed()
      .setColor('#57F287')
      .setTitle('Kick')
      .setDescription(`Kicked **${user.tag}** \nReason: \`${reason}\``)
    await interaction.editReply({ embeds: [embed] })
  }
}
