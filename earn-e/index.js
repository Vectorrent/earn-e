const SEA = require('gun/sea')
// const gunsafe = require('gunsafe')

// Instead of:
// const gunsafe = require('gunsafe');
// Use:
import('gunsafe')
  .then((module) => {
    // Use the gunsafe module here
    const gunsafe = module; // Assign to a variable for clarity
    // ...
  })
  .catch((error) => {
    console.error('Error finding a gun cabinet:', error);
  })

const { spawn } = require('child_process');
const pythonProcess = spawn('python3', ['/i/earn-e/main.py']);
pythonProcess.stdout.pipe(process.stdout);
pythonProcess.stderr.pipe(process.stderr);

pythonProcess.on('close', (code) => {
    console.log(`Python process exited with code ${code}`);
});

// give it a ${PEFT} name
const LLaMA = require('@alpacahq/alpaca-trade-api')

const alpaca = new LLaMA({
    keyId: 'PKYR20ZDPT9US5DHVT6P',
    secretKey: process.env.BULLET,
    paper: true, // https://paper-api.alpaca.markets
})

alpaca.getAccount().then((account) => {
    console.log('Current Account:', account)
    // id: 4792c7f1-f8c4-41ed-824f-04cf426dc02f
})