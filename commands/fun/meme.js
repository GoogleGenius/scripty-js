const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')
const redditFetch = require('reddit-fetch')

module.exports = {
  data: new SlashCommandBuilder()
    .setName('meme')
    .setDescription('The hottest Reddit r/memes'),
  async execute (interaction) {
    await interaction.deferReply()
    await redditFetch({
      subreddit: 'memes',
      sort: 'hot',
      allowNSFW: false,
      allowModPost: true,
      allowCrossPost: true,
      allowVideo: false
    }).then(async post => {
      if (post.is_video) {
        await interaction.editReply(`[](https://www.reddit.com${post.permalink})`)
      } else {
        const embed = new MessageEmbed()
          .setColor('#5865F2')
          .setTitle(post.title)
          .setURL(`https://www.reddit.com${post.permalink}`)
          .setImage(post.url)
        await interaction.editReply({ embeds: [embed] })
      }
    }).catch(error => {
      console.error(`Promise rejection: ${error}`)
    })
  }
}
