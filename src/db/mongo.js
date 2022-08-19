const mongoose = require('mongoose');

// Credencials
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

// Conexão com o Banco de Dados
const dbmongo = async () => {
    mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.bo8jwjr.mongodb.net/?retryWrites=true&w=majority`).then(() => {
        console.log('Connected to MongoDB');
    }).catch((err) => {
        console.log(err);
    })
}

module.exports = dbmongo