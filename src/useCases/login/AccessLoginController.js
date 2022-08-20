const AccessUseLogin = require('../login/AccessUseLogin')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../../models/User')

class AcessLoginController {
    async handle(req, res) {
        const { email, password } = req.body

        const accessUseLogin = new AccessUseLogin()

        const user = await accessUseLogin.execute({
            email,
            password
        })

        if (!email) {
            return res.status(400).json({
                message: 'Email is required'
            })
        }

        if (!password) {
            return res.status(400).json({
                message: 'Password is required'
            })
        }

        // Check if user exists
        const userExists = await User.findOne({ email: email })
        if (!userExists) {
            return res.status(400).json({
                message: 'User not found'
            })
        }

        // Checar se a senha está correta
        const isPasswordCorrect = await bcrypt.compare(password, userExists.password)
        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: 'Password is incorrect'
            })
        }

        try {
            const secret = process.env.SECRET
            const token = jwt.sign({ id: userExists._id }, secret)
            return res.status(200).json({
                msg: "Logged in successfully",
                token: token
            })
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = AcessLoginController