import axios from 'axios'

export const createNote = async ({ title, body }, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    }
    const response = await axios.post(
        '/api/notes',
        {
            title,
            body,
        },
        config
    )
    const { data } = response
    return data
}
