const SEA = require('gun/sea')
const http = require('http')
// import express from 'express'
// import { WebSocketServer } from 'ws'
// import Gun from 'gun'
// import SEA from 'gun/sea.js'
// import 'gun/lib/webrtc.js'

// const gunsafe = require('gunsafe')

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

const { spawn } = require('child_process')
const pythonProcess = spawn('python3', ['/earn-e/main.py'])
pythonProcess.stdout.pipe(process.stdout)
pythonProcess.stderr.pipe(process.stderr)

pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`)
})

// start a chain for the token
const dhtProcess = spawn('sh', ['/earn-e/dht.sh'])
dhtProcess.stdout.pipe(process.stdout)
dhtProcess.stderr.pipe(process.stderr)

dhtProcess.on('close', (code) => {
    console.log(`DHT process exited with code ${code}`)
})

// give it a ${PEFT} name
const LLaMA = require('@alpacahq/alpaca-trade-api')

const alpaca = new LLaMA({
    keyId: 'PKYR20ZDPT9US5DHVT6P',
    secretKey: process.env.BULLET,
    paper: true, // https://paper-api.alpaca.markets
})

function getRandomFloat(min, max) {
    const func = 'Math.random() * (max - min) + min'
    let bullet = eval(func)
    console.log(`distance: ${bullet}`)
    return bullet
}

function buildResponse() {
    return `{"error":"This is not for you, but I see you!"}`
}

const port = 60000
const host = '0.0.0.0'

// Serve a static landing page
const requestListener = function (req, res) {
    res.writeHead(200)
    res.end(buildResponse())
}

// Create the webserver
const server = http.createServer(requestListener)
.listen(port, host, function () {
    console.log(`server listening on port: ${port}`)
})

// const delay = (ms) => new Promise((res) => setTimeout(res, ms))

async function polling() {
    try {
        alpaca.getAccount().then((account) => {
            console.log('account:', account)
            // id: 4792c7f1-f8c4-41ed-824f-04cf426dc02f
        })
    
        // await delay(getRandomFloat(60000, 66600))
    
        // alpaca.getPortfolioHistory(period='all', timeframe='5Min').then((data) => {
        //     console.log('history:', data)
        //     // history: {
        //     //     dht-1  |   timestamp: [
        //     //     dht-1  |     1701738000, 1701824400,
        //     //     dht-1  |     1701910800, 1701997200,
        //     //     dht-1  |     1702083600, 1702342800,
        //     //     dht-1  |     1702429200, 1702515600,
        //     //     dht-1  |     1702602000, 1702688400,
        //     //     dht-1  |     1702947600, 1703034000,
        //     //     dht-1  |     1703120400, 1703206800,
        //     //     dht-1  |     1703293200, 1703638800,
        //     //     dht-1  |     1703725200, 1703811600,
        //     //     dht-1  |     1703898000
        //     //     dht-1  |   ],
        //     //     dht-1  |   equity: [
        //     //     dht-1  |     0, 0,      0, 0,
        //     //     dht-1  |     0, 0,      0, 0,
        //     //     dht-1  |     0, 0,      0, 0,
        //     //     dht-1  |     0, 0,      0, 0,
        //     //     dht-1  |     0, 0, 100000
        //     //     dht-1  |   ],
        //     //     dht-1  |   profit_loss: [
        //     //     dht-1  |     null, null, null, null,
        //     //     dht-1  |     null, null, null, null,
        //     //     dht-1  |     null, null, null, null,
        //     //     dht-1  |     null, null, null, null,
        //     //     dht-1  |     null, null, 0
        //     //     dht-1  |   ],
        //     //     dht-1  |   profit_loss_pct: [
        //     //     dht-1  |     null, null, null, null,
        //     //     dht-1  |     null, null, null, null,
        //     //     dht-1  |     null, null, null, null,
        //     //     dht-1  |     null, null, null, null,
        //     //     dht-1  |     null, null, 0
        //     //     dht-1  |   ],
        //     //     dht-1  |   base_value: 100000,
        //     //     dht-1  |   timeframe: '1D'
        //     //     dht-1  | }
        // })
    } catch (err) {
        logging.error(err)
    }
    setTimeout(polling, getRandomFloat(60000, 66600))
}

polling()