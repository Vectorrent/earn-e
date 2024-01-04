const SEA = require('gun/sea')
const { spawn } = require('child_process')
const http = require('http')

// Instead of:
// const gunsafe = require('gunsafe')

// Use:
import('gunsafe')
  .then((module) => {
    // Use the gunsafe module here
    const gunsafe = module // Assign to a variable for clarity
    // ...
  })
  .catch((error) => {
    console.error('Error finding an empty gun cabinet:', error)
  })

const backendProcess = spawn('python3', ['/earn-e/main.py'])
backendProcess.stdout.pipe(process.stdout)
backendProcess.stderr.pipe(process.stderr)

backendProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`)
})

// start a chain for the token
const dhtProcess = spawn('sh', ['/earn-e/dht.sh'])
dhtProcess.stdout.pipe(process.stdout)
dhtProcess.stderr.pipe(process.stderr)

dhtProcess.on('close', (code) => {
    console.log(`DHT process exited with code ${code}`)
})

function getRandomFloat(min, max) {
    const func = 'Math.random() * (max - min) + min'
    let bullet = eval(func)
    console.log(`distance: ${bullet}`)
    return bullet
}

async function buildResponse() {
    const data = await queryMarkets()
    return `<body>${data}</body>`
}

async function queryMarkets() {
    const input = require('./markets/alpaca')
    const output = await input.getAccount() 
    return serializeData(output)
}

function serializeData(data) {
    console.log(data)
    return JSON.stringify(data)
}

const port = 60000
const host = '0.0.0.0'

// Serve a static landing page
const requestListener = async function (req, res) {
    res.writeHead(200)
    const response = await buildResponse()
    res.end(response)
}

// Create the webserver
http.createServer(requestListener)
.listen(port, host, function () {
    console.log(`server listening on port: ${port}`)
})

// delay for x seconds
const delay = (ms) => new Promise((res) => setTimeout(res, ms))

async function polling() {
    try {
        await delay(getRandomFloat(60000, 66600))
    } catch (err) {
        logging.error(err)
    }
    setTimeout(polling, getRandomFloat(60000, 66600))
}

polling()