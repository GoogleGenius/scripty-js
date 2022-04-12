const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed, Permissions } = require('discord.js')
const { scriptyError } = require('../../config.json')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete')
    .setDescription('Purge messages')
    .addIntegerOption((option) =>
      option
        .setName('amount')
        .setDescription('Enter an amount')
        // .setMinValue(1)
        // .setMaxValue(100)
        .setRequired(true)
    ),
  permissions: [Permissions.FLAGS.MANAGE_MESSAGES],
  async execute (interaction) {
    await interaction.deferReply({ ephemeral: true })

    const amount = interaction.options.getInteger('amount')

    if (amount <= 0) {
      const embed = new MessageEmbed()
        .setColor('#ED4245')
        .setAuthor({ name: 'Invalidation Error', iconURL: scriptyError })
        .setDescription(
          'Amount is invalid! Please input a `positive integer`'
        )
      await interaction.editReply({ embeds: [embed] })
      return
    }

    if (amount === 1) {
      await interaction.channel.bulkDelete(amount)
      const embed = new MessageEmbed()
        .setColor('#57F287')
        .setTitle('Delete')
        .setDescription(`\`${amount} message\` deleted`)
      await interaction.editReply({ embeds: [embed] })
      return
    }

    if (amount > 100) {
      const embed = new MessageEmbed()
        .setColor('#ED4245')
        .setAuthor({ name: 'Limitation Error', iconURL: scriptyError })
        .setDescription(
          'Amount `exceeds` Discord limits! \nPlease input integer less than or equal to `100`'
        )
      await interaction.editReply({ embeds: [embed] })
      return
    }

    await interaction.channel.bulkDelete(amount, {filterOld: true})
    const embed = new MessageEmbed()
      .setColor('#57F287')
      .setTitle('Delete')
      .setDescription(`\`${amount} messages\` deleted`)
    await interaction.editReply({ embeds: [embed] })
  }
}
