const { SlashCommandBuilder } = require('@discordjs/builders')
const { Permissions } = require('discord.js')
const { MessageEmbed } = require('discord.js')
const ms = require('ms')
const { scriptyError } = require('../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Timeout member in server')
    .addSubcommand(subcommand =>
      subcommand
        .setName('set')
        .setDescription('Set timeout for member')
        .addUserOption((option) =>
          option
            .setName('member')
            .setDescription('Select a member')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName('duration')
            .setDescription('Enter duration of timeout')
            .setRequired(true)
        )
        .addStringOption((option) =>
          option.setName('reason').setDescription('Reason for timeout')
        ))
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove timeout from member')
        .addUserOption((option) =>
          option
            .setName('member')
            .setDescription('Select a member')
            .setRequired(true)
        )),
  permissions: [Permissions.FLAGS.MODERATE_MEMBERS],
  async execute (interaction) {
    await interaction.deferReply()

    const member = interaction.options.getMember('member')
    const user = interaction.options.getUser('member')
    const duration = interaction.options.getString('duration')
    const reason = interaction.options.getString('reason') || 'None'

    if (interaction.options.getSubcommand() === 'set') {
      const timeMs = ms(duration)
      if (!member) {
        const embed = new MessageEmbed()
          .setColor('#ED4245')
          .setAuthor({ name: 'Invalidation Error', iconURL: scriptyError })
          .setDescription('Invalid member!')
        await interaction.editReply({ embeds: [embed] })
      } else if (member.permissions.has(this.permissions)) {
        const embed = new MessageEmbed()
          .setColor('#ED4245')
          .setAuthor({ name: 'Permissions Error', iconURL: scriptyError })
          .setDescription('You cannot timeout a moderator!')
        await interaction.editReply({ embeds: [embed] })
      } else if (!timeMs) {
        const embed = new MessageEmbed()
          .setColor('#ED4245')
          .setAuthor({ name: 'Invalidation Error', iconURL: scriptyError })
          .setDescription('Invalid duration! Please format ex. `10m` or `2h`')
        await interaction.editReply({ embeds: [embed] })
      } else if (timeMs <= 4 * 7 * 24 * 60 * 60 * 1000) {
        member.timeout(timeMs, reason)
        const embed = new MessageEmbed()
          .setColor('#57F287')
          .setTitle('Timeout')
          .setDescription(
            `Timed out **${user.tag}** for \`${ms(timeMs, {
              long: false
            })}\` \nReason: \`${reason}\``
          )
        await interaction.editReply({ embeds: [embed] })
      } else if (timeMs > 4 * 7 * 24 * 60 * 60 * 1000) {
        const embed = new MessageEmbed()
          .setColor('#ED4245')
          .setAuthor({ name: 'Limitation Error', iconURL: scriptyError })
          .setDescription(
            'Duration `exceeds` Discord limits! \nPlease input duration less than or equal to `28 days`'
          )
        await interaction.editReply({ embeds: [embed] })
      }
    } else if (interaction.options.getSubcommand() === 'remove') {
      if (!member) {
        const embed = new MessageEmbed()
          .setColor('#ED4245')
          .setAuthor({ name: 'Invalidation Error', iconURL: scriptyError })
          .setDescription('Invalid member!')
        await interaction.editReply({ embeds: [embed] })
      } else if (!member.isCommunicationDisabled()) {
        const embed = new MessageEmbed()
          .setColor('#ED4245')
          .setAuthor({ name: 'Timeout Error', iconURL: scriptyError })
          .setDescription('You cannot remove timeout from member that is not timed out!')
        await interaction.editReply({ embeds: [embed] })
      } else {
        member.timeout(null)
        const embed = new MessageEmbed()
          .setColor('#57F287')
          .setTitle('Timeout')
          .setDescription(`Removed timeout from **${user.tag}**`)
        await interaction.editReply({ embeds: [embed] })
      }
    }
  }
}
