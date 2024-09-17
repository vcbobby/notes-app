const bcrypt = require('bcrypt')
const User = require('../models/User')
const supertest = require('supertest')
const app = require('../api/app')
const mongoose = require('mongoose')

const api = supertest(app)

test('Obtain all users', async () => {
    await api
        .get('/api/users')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

describe('Creating a new user', () => {
    beforeEach(async () => {
        await User.deleteMany({})
        const passwordHash = await bcrypt.hash('casablanca', 10)
        const user = new User({
            name: 'Andres',
            username: 'antonio',
            passwordHash,
        })
        await user.save()
    })

    test('Create a fresh user', async () => {
        const usersDB = await User.find({})
        const usersAtStart = usersDB.map((user) => user.toJSON())

        const newUser = {
            name: 'Maria',
            username: 'Marialv',
            password: 'pswd',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersDbAfter = await User.find({})
        const usersAtEnd = usersDbAfter.map((user) => user.toJSON())

        expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

        const usernames = usersAtEnd.map((u) => u.username)
        expect(usernames).toContain(newUser.username)
    })

    test('Creation fails if username is taken', async () => {
        const newUser = {
            name: 'Maria',
            username: 'Marialv',
            password: 'pswd',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const newUser2 = {
            name: 'Maria',
            username: 'Marialv',
            password: 'pswd',
        }

        const result = await api
            .post('/api/users')
            .send(newUser2)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(result.body.errors.username.message).toContain(
            'Error, expected `username` to be unique. Value: `Marialv`'
        )

        const usersDbAfter = await User.find({})
        const usersAtEnd = usersDbAfter.map((user) => user.toJSON())

        expect(usersAtEnd).toHaveLength(2) // One initial user and one successfully created user
    })
})

afterAll(() => {
    mongoose.connection.close()
})
