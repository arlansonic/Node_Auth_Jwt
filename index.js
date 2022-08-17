require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000;

// Credencials
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

// Rota Principal
app.get('/', (req, res) => {
    res.status(200).json({
        message: `Server is Running on port ${port}`
    })
})
// Conexão com o Banco de Dados
mongoose.connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.bo8jwjr.mongodb.net/?retryWrites=true&w=majority`).then(() => {
    app.listen(port, () => console.log(`Server is Running on port ${port}!`));
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
})

// Registro de Usuário

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

app.post('/auth/login', (req, res) => {
    const { email, password } = req.body

    // Validação de campos

    if(!email) {
        return res.status(442).json({
            message: 'Email is required'
        })
    }

    if(!password) {
        return res.status(442).json({
            message: 'Password is required'
        })
    }

    // Check if user exists
    const userExists = await User.findOne({ email: email })
    
})
