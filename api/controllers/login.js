const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/User')
const { PRIVATE_KEY } = process.env

loginRouter.post('/', async (req, res) => {
    try {
        const { username, password } = req.body

        // Validar que username y password estén presentes
        if (!username || !password) {
            return res.status(400).json({
                error: 'Username or password missing',
            })
        }

        const user = await User.findOne({ username })
        const passwordCorrect =
            user === null
                ? false
                : await bcrypt.compare(password, user.passwordHash)

        if (!(user && passwordCorrect)) {
            return res.status(401).json({
                error: 'Invalid username or password',
            })
        }

        const userForToken = {
            id: user._id,
            username: user.username,
        }

        // Generar el token con expiración
        const token = jwt.sign(userForToken, PRIVATE_KEY, { expiresIn: '1h' })

        // Responder con los datos del usuario y el token
        res.send({
            name: user.name,
            username: user.username,
            token,
        })
    } catch (error) {
        // Manejar errores inesperados
        res.status(500).json({ error: 'Something went wrong' })
    }
})

module.exports = loginRouter
