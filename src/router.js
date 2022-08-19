const CreateUserController = require('./useCases/createUser/CreateUserController');
const AccessLoginController = require('./useCases/login/AccessLoginController')
const Router = require('express');

const router = Router()
const port = 3000

const createUserController = new CreateUserController()
const accessLoginController = new AccessLoginController()

// Rota para criar um usuário
router.post('/auth/register', createUserController.handle)
router.post('/auth/login', accessLoginController.handle)
router.get('/', (req, res) => res.json({ message: `Server is Running ${port}`}))

module.exports = router
