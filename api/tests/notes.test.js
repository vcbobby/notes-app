const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../api/app')
const Note = require('../models/Note')
const User = require('../models/User')

const api = supertest(app)

const initialUsers = [
    { username: 'user1', name: 'name1', password: 'password1' },
    { username: 'user2', name: 'name2', password: 'password2' },
]

const initialNotes = [
    {
        title: 'Titulo1 nota inicial para test',
        body: 'Body1 nota inicial para test',
    },
    {
        title: 'Titulo2 nota inicial para test',
        body: 'Body2 nota inicial para test',
    },
]

beforeEach(async () => {
    // Clean up database
    await Note.deleteMany({})
    await User.deleteMany({})

    // Create initial users
    const userObjects = initialUsers.map((user) => new User(user))
    const savedUsers = await Promise.all(userObjects.map((user) => user.save()))

    // Assign valid user IDs to the notes
    initialNotes[0].userId = savedUsers[0]._id
    initialNotes[1].userId = savedUsers[1]._id

    // Create initial notes
    const noteObjects = initialNotes.map((note) => new Note(note))
    await Promise.all(noteObjects.map((note) => note.save()))
})

describe('Test path api/notes', () => {
    test('Notes are returned as json', async () => {
        await api
            .get('/api/notes')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('there are two notes', async () => {
        const response = await api.get('/api/notes')
        expect(response.body).toHaveLength(initialNotes.length)
    })

    test('One note is about the first title', async () => {
        const response = await api.get('/api/notes')

        const titles = response.body.map((note) => note.title)
        expect(titles).toContain('Titulo1 nota inicial para test')
    })

    test('A valid note can be added', async () => {
        const newUser = new User({ username: 'user3', password: 'password3' })
        const savedUser = await newUser.save()

        const newNote = {
            title: 'Probando enviar una nota',
            body: 'Test del post del backend',
            userId: savedUser._id,
        }

        await api
            .post('/api/notes')
            .send(newNote)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/notes')

        const titles = response.body.map((note) => note.title)
        expect(response.body).toHaveLength(initialNotes.length + 1)
        expect(titles).toContain(newNote.title)
    })

    test('An empty note cannot be added', async () => {
        const newNote = {
            body: 'Test del post del backend',
        }

        await api.post('/api/notes').send(newNote).expect(400)

        const response = await api.get('/api/notes')

        expect(response.body).toHaveLength(initialNotes.length)
    })
})

describe('Test path api/notes/:id', () => {
    test('Get a note by its id', async () => {
        const newUser = new User({ username: 'user4', password: 'password4' })
        const savedUser = await newUser.save()

        const noteData = {
            title: 'note by id',
            body: 'note by id body',
            userId: savedUser._id,
        }

        // Crear una nueva nota y obtener su ID
        const postResponse = await api
            .post('/api/notes')
            .send(noteData)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const createdNote = postResponse.body

        // Obtener la nota por su ID
        const getResponse = await api
            .get(`/api/notes/${createdNote.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const fetchedNote = getResponse.body

        // Verificar que la nota obtenida tenga el título correcto
        expect(fetchedNote.title).toBe(noteData.title)
        expect(fetchedNote.body).toBe(noteData.body)
        expect(fetchedNote.userId.toString()).toBe(noteData.userId.toString())
    })

    test('Modify a note by its id', async () => {
        const newUser = new User({ username: 'user5', password: 'password5' })
        const savedUser = await newUser.save()

        const noteData = {
            title: 'note by id for put',
            body: 'note by id body for put',
            userId: savedUser._id,
        }

        // Crear una nueva nota y obtener su ID
        const postResponse = await api
            .post('/api/notes')
            .send(noteData)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const createdNote = postResponse.body

        // Datos actualizados para la nota
        const updatedNoteData = {
            title: 'updated note title',
            body: 'updated note body',
        }

        // Modificar la nota por su ID
        await api
            .put(`/api/notes/${createdNote.id}`)
            .send(updatedNoteData)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        // Obtener la nota modificada por su ID
        const getResponse = await api
            .get(`/api/notes/${createdNote.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const fetchedNote = getResponse.body

        // Verificar que la nota obtenida tenga los datos actualizados
        expect(fetchedNote.title).toBe(updatedNoteData.title)
        expect(fetchedNote.body).toBe(updatedNoteData.body)
    })

    test('Delete a note by its id', async () => {
        const newUser = new User({ username: 'user6', password: 'password6' })
        const savedUser = await newUser.save()

        const noteData = {
            title: 'note by id for delete',
            body: 'note by id body for delete',
            userId: savedUser._id,
        }

        // Crear una nueva nota y obtener su ID
        const postResponse = await api
            .post('/api/notes')
            .send(noteData)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const createdNote = postResponse.body

        // Borrar la nota por su ID
        await api.delete(`/api/notes/${createdNote.id}`).expect(204)

        const response = await api.get('/api/notes')
        expect(response.body).toHaveLength(initialNotes.length)
    })
})

afterAll(() => {
    mongoose.connection.close()
})
