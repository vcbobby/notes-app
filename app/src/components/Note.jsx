/* eslint-disable react/prop-types */
import React from 'react'

React
const Note = ({ note }) => {
    return (
        <>
            <h2 style={{ marginLeft: '20px', textAlign: 'left' }}>
                {note.title}
            </h2>
            <p style={{ marginLeft: '20px', textAlign: 'left' }}>{note.body}</p>
        </>
    )
}

export default Note
