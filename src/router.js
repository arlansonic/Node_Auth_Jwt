const CreateUserController = require('./useCases/createUser/CreateUserController');
const AccessLoginController = require('./useCases/login/AccessLoginController')
const Router = require('express');
const User = require('./models/User');
const checkToken = require('./useCases/login/CheckToken');

const router = Router()
const port = 3000

const createUserController = new CreateUserController()
const accessLoginController = new AccessLoginController()

// Rota para criar um usuário
router.post('/auth/register', createUserController.handle)
router.post('/auth/login', accessLoginController.handle)
router.get('/user/:id', checkToken, async(req, res) => {
    const id = req.params.id;
    // Check if user exists
    const user = await User.findById(id, '-password');
    if (!user) return res.status(404).json({message: 'User not found'})    
    res.status(200).json({ user })
})
router.get('/', (req, res) => res.json({ message: `Server is Running ${port}`}))

module.exports = router
