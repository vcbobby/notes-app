import { useState, useEffect } from 'react'
import './App.css'
import Note from './components/Note'
import { getAllNotes } from './services/notes/getAllNotes'
import Notification from './components/Notification'
import loginService from './services/login/login'
import { createNote } from './services/notes/createNote'
import LoginForm from './components/LoginForm'
import CreateNote from './components/CreateNote'

function App() {
    const [notes, setNotes] = useState([]) // Inicializa con un array vacío
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)
    const [errorMessage, setErrorMessage] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [titleValue, setTitleValue] = useState('')
    const [descriptionValue, setDescriptionValue] = useState('')

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedNoteAppUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
        }
    }, [])

    // Manejo de Login
    const handleLogin = async (e) => {
        e.preventDefault()
        try {
            const user = await loginService({
                username,
                password,
            })

            window.localStorage.setItem(
                'loggedNoteAppUser',
                JSON.stringify(user)
            )
            setUser(user)
            setPassword('')
            setUsername('')
        } catch (error) {
            setErrorMessage('Credenciales incorrectas')
            setTimeout(() => {
                setErrorMessage('')
            }, 5000)
        }
    }

    // Manejo de logout
    const handleLogout = () => {
        setUser(null)
        window.localStorage.removeItem('loggedNoteAppUser')
    }

    // Manejo de creación de notas
    const handleSubmit = async (e) => {
        e.preventDefault()
        const newNote = {
            title: titleValue,
            body: descriptionValue,
        }

        try {
            const note = await createNote(newNote, user.token)
            setNotes((prevNotes) => prevNotes.concat(note))
            setTitleValue('')
            setDescriptionValue('')
        } catch (error) {
            setErrorMessage('Error al crear la nota')
            setTimeout(() => {
                setErrorMessage('')
            }, 5000)
        }
    }

    // Cargar las notas al cargar el componente
    useEffect(() => {
        setLoading(true)
        getAllNotes()
            .then((notes) => {
                // Validar que la respuesta sea un array
                if (Array.isArray(notes)) {
                    setNotes(notes)
                } else {
                    setErrorMessage(
                        'Error: Las notas no están en el formato esperado'
                    )
                }
                setLoading(false)
            })
            .catch((error) => {
                setErrorMessage('Error al cargar las notas')
                setLoading(false)
            })
    }, [])

    return (
        <main className="App">
            <h1>Notes</h1>
            {loading && (
                <Notification align="center" msg="Cargando, por favor espere" />
            )}

            {user === null ? (
                <LoginForm
                    username={username}
                    password={password}
                    handleUsername={(e) => setUsername(e.target.value)}
                    handlePassword={(e) => setPassword(e.target.value)}
                    handleLogin={handleLogin}
                />
            ) : (
                <CreateNote
                    handleLogout={handleLogout}
                    handleSubmit={handleSubmit}
                    handleTitle={(e) => setTitleValue(e.target.value)}
                    titleValue={titleValue}
                    handleDescription={(e) =>
                        setDescriptionValue(e.target.value)
                    }
                    descriptionValue={descriptionValue}
                />
            )}

            <Notification color="red" msg={errorMessage} />

            {notes.length === 0 && !loading ? (
                <Notification msg="No hay notas que mostrar aún" />
            ) : (
                <ul>
                    {notes.map((note) => (
                        <li key={note.id}>
                            <Note note={note} />
                        </li>
                    ))}
                </ul>
            )}
        </main>
    )
}

export default App
