require('dotenv').config()
const express = require('express')
const cors = require('cors')
const { readFile } = require('./utils/file')

const app = express()
const bridgeRouter = express.Router({ mergeParams: true })

app.use(cors())

app.get('/favicon.ico', (req, res) => res.sendStatus(204))
app.use('/:bridgeName', bridgeRouter)

bridgeRouter.get('/:file(validators|eventsStats|alerts|mediators|stuckTransfers|failures)?', async (req, res, next) => {
  try {
    const { bridgeName, file } = req.params
    const results = await readFile(`./responses/${bridgeName}/${file || 'getBalances'}.json`)
    res.json(results)
  } catch (e) {
    // this will eventually be handled by your error handling middleware
    next(e)
  }
})

const port = process.env.MONITOR_PORT || 3003
app.set('port', port)
app.listen(port, () => console.log(`Monitoring app listening on port ${port}!`))
