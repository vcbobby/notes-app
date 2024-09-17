import axios from 'axios'

export const getAllNotes = async () => {
    const response = await axios.get('/api/notes')
    const { data } = response
    return data
}
