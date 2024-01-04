const SEA = require('gun/sea')
const { spawn } = require('child_process')
const http = require('http')

// instead of
// const gunsafe = require('gunsafe')

// use:
import('gunsafe')
  .then((module) => {
    // the module here
    const gunsafe = module
    // ...
  })
  .catch((error) => {
    console.error('Error finding a gun cabinet:', error)
  })

// start the transformer
const backendProcess = spawn('python3', ['/earn-e/main.py'])
backendProcess.stdout.pipe(process.stdout)
backendProcess.stderr.pipe(process.stderr)

// start a chain for the token
const dhtProcess = spawn('sh', ['/earn-e/dht.sh'])
dhtProcess.stdout.pipe(process.stdout)
dhtProcess.stderr.pipe(process.stderr)

function getRandomFloat(min, max) {
    const func = 'Math.random() * (max - min) + min'
    let bullet = eval(func)
    console.warn(`WARNING:distance: ${bullet}`)
    return bullet
}

async function buildResponse(url) {
    const data = await queryMarkets(url)
    console.log(url)
    return `<body>${data}</body>`
}

async function queryMarkets(url) {
    let data = null
    try {
        const mod = require(`./markets${url}`)
        data = await mod.getAccount() 
    }
    catch (err) {
        console.error(err)
        data = `{"error":"This is not for you, but I see you!"}`
    }
    return serializeData(data)
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
    const response = await buildResponse(req.url)
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
        console.error(err)
    }
    setTimeout(polling, getRandomFloat(60000, 66600))
}

polling()