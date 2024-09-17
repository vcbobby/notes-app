/* eslint-disable no-undef */
React
import '@testing-library/jest-dom/'
import { render } from '@testing-library/react'
import Note from './Note'
import React from 'react'

test('Verificar si test esta renderizando', () => {
    const note = {
        title: 'Titulo test',
        body: 'Body test',
    }

    const view = render(<Note note={note} />)
    // view.getByText('Titulo test')
    // view.getByText('Body test')
    expect(view.container).toHaveTextContent(note.title)
})
