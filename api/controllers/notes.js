const notesRouter = require('express').Router()
const userExtractor = require('../middlewares/userExtractor')
const Note = require('../models/Note')
const User = require('../models/User')

notesRouter.get('/', async (req, res, next) => {
    try {
        const notes = await Note.find({}).populate('userId', {
            name: 1,
            username: 1,
        })
        res.json(notes)
    } catch (err) {
        next(err)
    }
})

notesRouter.get('/:id', async (req, res, next) => {
    const { id } = req.params

    try {
        const note = await Note.findById(id)
        if (note) {
            res.json(note)
        } else {
            res.status(404).end() // Respond with 404 if note not found
        }
    } catch (err) {
        next(err)
    }
})

notesRouter.put('/:id', userExtractor, async (req, res, next) => {
    const { id } = req.params
    const note = req.body
    const newNoteInfo = {
        title: note.title,
        body: note.body,
    }

    try {
        const note = await Note.findByIdAndUpdate(id, newNoteInfo, {
            new: true,
        })
        res.json(note)
    } catch (err) {
        next(err)
    }
})

notesRouter.delete('/:id', userExtractor, async (req, res, next) => {
    const { id } = req.params

    try {
        const note = await Note.findByIdAndDelete(id)
        if (note) {
            res.status(204).end()
        } else {
            res.status(404).json({ error: 'Note not found' })
        }
    } catch (err) {
        next(err)
    }
})

notesRouter.post('/', userExtractor, async (req, res, next) => {
    const { title, body } = req.body

    const { userId } = req

    if (!title || !body || !userId) {
        return res.status(400).json({
            error: 'The content of note is incomplete',
        })
    }

    try {
        const user = await User.findById(userId)

        if (!user) {
            return res.status(400).json({
                error: 'User not found',
            })
        }

        const newNote = new Note({
            title: title,
            body: body,
            userId: user._id,
        })

        const noteToAdd = await newNote.save()
        user.notes = user.notes.concat(noteToAdd._id)
        await user.save()
        res.json(noteToAdd)
    } catch (err) {
        next(err)
    }
})

module.exports = notesRouter
