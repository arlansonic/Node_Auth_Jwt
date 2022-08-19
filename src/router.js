const CreateUserController = require('./useCases/createUser/CreateUserController');
const Router = require('express');

const router = Router()
const port = 3000

const createUserController = new CreateUserController()

// Rota para criar um usuário
router.post('/auth/register', createUserController.handle)
router.get('/', (req, res) => res.json({ message: `Server is Running ${port}`}))

module.exports = router
