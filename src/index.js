require('dotenv').config()
const express = require('express')
const router = require('./router')
const dbmongo = require('./db/mongo')
// Inicializando Função de Conexão com o Banco de Dados
dbmongo()

const port = 3000
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router)

app.listen(port, () => console.log(`Server is Running on port ${port}!`));