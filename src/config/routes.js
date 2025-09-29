const express = require('express')
module.exports = function(server) {
    // url base para todsa as rotas
    const router = express.Router()
    server.use('/api', router)

    // Rotas de Ciclo de Pagamentos
    const BillingCycle = require('../api/billingCycle/billingCycleService')
    BillingCycle.register(router, '/billingCycles')
}