const User = require('../../models/User');
const bcrypt = require('bcrypt');

class CreateUserUseCase {
    async execute({ name, email, password, confirmpassword }) {
        try {

            const salt = await bcrypt.genSalt(12)
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create User
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword
            })           
            // Check if user exists
            const userExists = await User.findOne({ email: email })

            if (userExists) {
                console.log('User already exists')
            }
            else {
                console.log('Usuário Cadastrado com Sucesso')
                await user.save()
            }

            return name, email, password, confirmpassword, userExists, user

        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = CreateUserUseCase;