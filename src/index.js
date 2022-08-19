require('dotenv').config();
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
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

// Registro de Usuário
/*
app.post('/auth/register', async (req, res) => {
    const { name, email, password, confirmpassword } = req.body

    // Validação de campos
    if (!name) {
        return res.status(442).json({
            message: 'Name is required'
        })
    }

    if (!email) {
        return res.status(442).json({
            message: 'Email is required'
        })
    }

    if (!password) {
        return res.status(442).json({
            message: 'Password is required'
        })
    }

    if (password !== confirmpassword) {
        return res.status(442).json({
            message: 'Password and Confirm Password must be the same'
        })
    }

    // Check if user exists
    const userExists = await User.findOne({ email: email })

    if (userExists) {
        return res.status(442).json({
            message: 'User already exists'
        })
    }

    // Create Password
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const user = new User({
        name: name,
        email: email,
        password: hashedPassword
    })

    // Save User
    try {
        await user.save()
        res.status(201).json({
            message: 'User created successfully'
        })
    } catch (err) {
        console.log(err);
    }
})
*/
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body

    // Validação de campos

    if (!email) {
        return res.status(442).json({
            message: 'Email is required'
        })
    }

    if (!password) {
        return res.status(442).json({
            message: 'Password is required'
        })
    }

    // Check if user exists
    const userExists = await User.findOne({ email: email })

    if (!userExists) {
        return res.status(404).json({
            message: 'User not found'
        })
    }
    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, userExists.password)

    if (!isPasswordCorrect) {
        return res.status(442).json({
            message: 'Password is incorrect'
        })
    }

    try {
        const secret = process.env.SECRET;

        const token = jwt.sign({
            id: userExists._id
        }, secret)
        res.status(200).json({ msg: "Logged in successfully", token: token })
    } catch (err) {
        console.log(err);
    }



})
