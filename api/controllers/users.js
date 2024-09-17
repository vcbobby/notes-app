const bcrypt = require('bcryptjs')
const usersRouter = require('express').Router()
const User = require('../models/User')

usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('notes', {
        title: 1,
        body: 1,
    })
    res.json(users)
})

usersRouter.post('/', async (req, res) => {
    try {
        const { body } = req
        const { username, name, password } = body
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)
        const user = new User({
            name,
            username,
            passwordHash,
        })

        const savedUser = await user.save()
        res.status(201).json(savedUser)
    } catch (error) {
        res.status(400).json(error)
    }
})

module.exports = usersRouter
