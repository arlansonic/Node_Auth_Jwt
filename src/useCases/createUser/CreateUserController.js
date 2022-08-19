const CreateUserUseCase = require('../createUser/CreateUserUseCase')
const User = require('../../models/User')

class CreateUserController {
    async handle(req, res) {
        const { name, email, password, confirmpassword } = req.body;

        const createUserUseCase = new CreateUserUseCase()

        const user = await createUserUseCase.execute({
            name,
            email,
            password,
            confirmpassword
        })

        if (!name) {
            return res.status(400).json({
                message: 'Name is required'
            })
        }
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
        if (password !== confirmpassword) {
            return res.status(400).json({
                message: 'Password and Confirm Password must be the same'
            })
        }

        const userExists = await User.findOne({ email: email })
        if (userExists) {
            return res.status(400).json({
                message: 'User already exists'
            })
        }
        await user.save()
        res.status(200).json({message: 'User created successfully'})
    }
}

module.exports = CreateUserController;