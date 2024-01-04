// give it a ${PEFT} name
const LLaMA = require('@alpacahq/alpaca-trade-api')

const alpaca = new LLaMA({
    keyId: 'PKYR20ZDPT9US5DHVT6P',
    secretKey: process.env.BULLET,
    paper: true, // https://paper-api.alpaca.markets
})

async function getAccount() {
    return alpaca.getAccount()
    // id: 4792c7f1-f8c4-41ed-824f-04cf426dc02f
}

module.exports = {
    getAccount
}