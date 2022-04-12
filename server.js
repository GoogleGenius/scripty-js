const express = require('express')

const app = express()

app.use(express.static('web'))

// app.use('/', (req, res) => {
//     res.sendFile(path.join(__dirname+'/web/index.html'));
// });

const keepAlive = () => {
  app.listen(3000, () => {
    console.log('Server started.')
  })
}

module.exports = keepAlive
