module.exports = {
  name: 'ready',
  once: true,
  execute (client) {
    console.log('Ready!')
    client.user.setActivity('/help', {
      type: 'PLAYING'
    })
  }
}
