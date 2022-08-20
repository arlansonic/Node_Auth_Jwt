const User = require('../../models/User');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


class AccessUseLogin {
    async execute({ email, password }) {

        if (!email) {
            return console.log('Email is required')
        }
        if (!password) {
            return console.log('Password is required')
        }

        const userExists = await User.findOne({ email: email })
        if (!userExists) {
            return console.log('User not found')
        }
        const isPasswordCorrect = await bcrypt.compare(password, userExists.password)
        if (!isPasswordCorrect) {
            return console.log('Password is incorrect')
        }
        try {
            const secret = process.env.SECRET
            const token = jwt.sign({ id: userExists._id }, secret)
            return console.log("Logged in successfully: ", userExists.name)
            // { msg: "Logged in successfully", token: token }
        }
        catch (err) {
            console.log(err)
        }
    }
}

module.exports = AccessUseLogin

// Rota de Login
// app.post('/auth/login', async (req, res) => {
//     const { email, password } = req.body

//     // Validação de campos

//     if (!email) {
//         return res.status(442).json({
//             message: 'Email is required'
//         })
//     }

//     if (!password) {
//         return res.status(442).json({
//             message: 'Password is required'
//         })
//     }

//     // Check if user exists
//     const userExists = await User.findOne({ email: email })

//     if (!userExists) {
//         return res.status(404).json({
//             message: 'User not found'
//         })
//     }
//     // Check if password is correct
//     const isPasswordCorrect = await bcrypt.compare(password, userExists.password)

//     if (!isPasswordCorrect) {
//         return res.status(442).json({
//             message: 'Password is incorrect'
//         })
//     }

//     try {
//         const secret = process.env.SECRET;

//         const token = jwt.sign({
//             id: userExists._id
//         }, secret)
//         res.status(200).json({ msg: "Logged in successfully", token: token })
//     } catch (err) {
//         console.log(err);
//     }
// })