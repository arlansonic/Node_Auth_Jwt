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

// Função para Login com autenticação

const checkToken = async (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split('')[1]
    
    if(!token){
        return res.status(401).json({
            message: 'Access denied. No token provided'
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
