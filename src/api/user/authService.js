// Requirements
const _ = require('lodash')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('./user')
const env = require('../../.env')

// validação email e password
const emailRegex = /\S+@\S+\.\S+/
const passwordRegex = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%]).{6,20})/

// metodo tratar erro banco de dados
const sendErrorsFromDB = (res, dbErrors) => {
    const errors = []
    _.forIn(dbErrors.errors, error => errors.push(error.message))
    return res.status(400).json({ errors })
}

// methodo login
const login = (req, res, next) => {
    const email = req.body.email || ''
    const password = req.body.password || ''
    User.findOne({ email }, (err, user) => {
        if (err) {
            return sendErrorsFromDB(res, err)
        } else if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign(user, env.authSecret, {
                expiresIn: "1 day"
            })
            const { name, email } = user
            res.json({ name, email, token })
        } else {
            return res.status(400).send({ errors: ['Usuário/Senha inválidos'] })
        }
    })
}

// validar token
const validateToken = (req, res, next) => {
    const token = req.body.token || ''
    jwt.verify(token, env.authSecret, function (err, decoded) {
        return res.status(200).send({ valid: !err })
    })
}

const signup = (req, res, next) => {
    // dados de criação de user
    const name = req.body.name || ''
    const email = req.body.email || ''
    const password = req.body.password || ''
    const confirmPassword = req.body.confirm_password || ''

    // validação email valido
    if (!email.match(emailRegex)) {
        return res.status(400).send({ errors: ['O e-mail informa está inválido'] })
    }

    // validação senha valida
    if (!password.match(passwordRegex)) {
        return res.status(400).send({
            errors: [
                "Senha precisar ter: uma letra maiúscula, uma letra minúscula, um número, uma caractere especial(@#$ %) e tamanho entre 6 - 20."
            ]
        })
    }

    // Compara se password e confirmPassword são os mesmos
    const salt = bcrypt.genSaltSync()
    const passwordHash = bcrypt.hashSync(password, salt)

    if (!bcrypt.compareSync(confirmPassword, passwordHash)) {
        return res.status(400).send({ errors: ['Senhas não conferem.'] })
    }

    // Compara se usuário já existe, caso não exista cadastra o usuario novo
    User.findOne({ email }, (err, user) => {
        if (err) {
            return sendErrorsFromDB(res, err)
        } else if (user) {
            return res.status(400).send({ errors: ['Usuário já cadastrado.'] })
        } else {
            const newUser = new User({ name, email, password: passwordHash })
            newUser.save(err => {
                if (err) {
                    return sendErrorsFromDB(res, err)
                } else {
                    login(req, res, next)
                }
            })
        }
    })
}

module.exports = { login, signup, validateToken}