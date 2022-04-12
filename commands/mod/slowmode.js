const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, Permissions } = require('discord.js')
const ms = require('ms')
const { scriptyError } = require('../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('Set channel slowmode')
    .addSubcommand(subcommand =>
      subcommand
        .setName('enable')
        .setDescription('Enable channel slowmode')
        .addStringOption((option) =>
          option
            .setName('duration')
            .setDescription('Enter duration of slowmode')
            .setRequired(true)
        ))
    .addSubcommand(subcommand =>
      subcommand
        .setName('disable')
        .setDescription('Disable channel slowmode')),
  permissions: [Permissions.FLAGS.MANAGE_CHANNELS],
  async execute (interaction) {
    await interaction.deferReply()

    if (interaction.options.getSubcommand() === 'enable') {
      const duration = interaction.options.getString('duration')
      const timeMs = ms(duration)
      const timeSecs = timeMs / 1000

      if (!timeMs) {
        const embed = new MessageEmbed()
          .setColor('#ED4245')
          .setAuthor({ name: 'Invalidation Error', iconURL: scriptyError })
          .setDescription('Invalid duration. Please format ex. `10m` or `2h`')
        await interaction.editReply({ embeds: [embed] })
        return
      }

      if (timeMs <= 6 * 60 * 60 * 1000) {
        await interaction.channel.setRateLimitPerUser(timeSecs)
        const embed = new MessageEmbed()
          .setColor('#57F287')
          .setTitle('Slowmode')
          .setDescription(
            `Slowmode in ${interaction.channel} set to \`${ms(timeMs, { long: false })}\``
          )
        await interaction.editReply({ embeds: [embed] })
        return
      }

      if (timeMs > 6 * 60 * 60 * 1000) {
        const embed = new MessageEmbed()
          .setColor('#ED4245')
          .setAuthor({ name: 'Limitation Error', iconURL: scriptyError })
          .setDescription(
            'Duration `exceeds` Discord limits! \nPlease input duration less than or equal to `6 hours`'
          )
        await interaction.editReply({ embeds: [embed] })
      }
    } else if (interaction.options.getSubcommand() === 'disable') {
      if (interaction.channel.rateLimitPerUser === 0) {
        const embed = new MessageEmbed()
          .setColor('#ED4245')
          .setAuthor({ name: 'Slowmode Error', iconURL: scriptyError })
          .setDescription(
          `Slowmode is already disabled in ${interaction.channel}!`
          )
        await interaction.editReply({ embeds: [embed] })
        return
      }

      await interaction.channel.setRateLimitPerUser(0)
      const embed = new MessageEmbed()
        .setColor('#57F287')
        .setTitle('Slowmode')
        .setDescription(
          `Disabled slowmode in ${interaction.channel}`
        )
      await interaction.editReply({ embeds: [embed] })
    }
  }
}
