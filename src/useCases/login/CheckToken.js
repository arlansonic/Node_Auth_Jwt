const jwt = require('jsonwebtoken')
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
module.exports = checkToken;