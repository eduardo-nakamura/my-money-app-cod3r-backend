const express = require('express')
const auth = require('./auth')

module.exports = function (server) {
    // Rota protegida
    const protectedApi = express.Router()
    server.use('/api', protectedApi)

    protectedApi.use(auth)

    const BillingCycle = require('../api/billingCycle/billingCycleService')
    BillingCycle.register(protectedApi, '/billingCycles')

    // Rota aberta
    const openApi = express.Router()
    server.use('/oapi', openApi)

    const AuthService = require('../api/user/authService')
    openApi.post('/login', AuthService.login)
    openApi.post('/signup', AuthService.signup)
    openApi.post('/validateToken', AuthService.validateToken)
    // // url base para todsa as rotas
    // const router = express.Router()
    // server.use('/api', router)

    // // Rotas de Ciclo de Pagamentos
    // const BillingCycle = require('../api/billingCycle/billingCycleService')
    // BillingCycle.register(router, '/billingCycles')
}