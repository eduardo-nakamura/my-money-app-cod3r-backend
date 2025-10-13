const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost/mymoney'
module.exports = mongoose.connect('MONGO_URL',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })


// module.exports = mongoose.connect('mongodb://localhost/mymoney', {
//     useMongoClient: true
// })

mongoose.Error.messages.general.required = "O atributo '{PATH}' é obrigatório"
mongoose.Error.messages.Number.min = "O '{VALUE}' informado é menor que o limite mínimo de '{MIN}'"
mongoose.Error.messages.Number.max = "O '{VALUE}' informado é maior que o limite mínimo de '{MAX}'"
mongoose.Error.messages.String.enum = "O '{VALUE}' não é válido para o atributo '{PATH}'"