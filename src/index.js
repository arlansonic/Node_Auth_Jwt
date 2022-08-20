require('dotenv').config()
const express = require('express')
const User = require('./models/User')
const router = require('./router')
const dbmongo = require('./db/mongo')
dbmongo()
const port = 3000

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router)

app.listen(port, () => console.log(`Server is Running on port ${port}!`));

// Função para verificar se o token é válido

const checkToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res.status(401).json({
            message: 'Access denied. No token provided'
        })
    }

    try {
        const secret = process.env.SECRET
        jwt.verify(token, secret)
        next()
    } catch (err) {
        return res.status(400).json({
            message: 'Error while verifying token'
        })
    }
}

// Public Route
app.get('/user/:id', checkToken, async (req, res) => {
    const id = req.params.id;

    // Check if user exists
    const user = await User.findById(id, '-password');
    if (!user) {
        return res.status(404).json({
            message: 'User not found'
        })
    }

    res.status(200).json({ user })
})