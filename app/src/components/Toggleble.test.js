/* eslint-disable no-undef */
React
import '@testing-library/jest-dom/'
import { fireEvent, render } from '@testing-library/react'
import Toggleble from './Toggleble'
import React from 'react'

describe('<Toggleble', () => {
    let component
    beforeEach(() => {
        component = render(
            <Toggleble buttonLable="show">
                <div>Test children</div>
            </Toggleble>
        )
    })

    test('render its children', () => {
        expect(component.container).toHaveTextContent('show')
    })
    test('Toggleble displays the correct button label', () => {
        // Busca el botón usando el texto 'show'
        const children = component.getByText('Test children')
        expect(children).toBeInTheDocument()
        expect(children.parentNode).toHaveStyle('display: none')
    })
    test('Toggleble displays the correct button label: do not show', () => {
        // Busca el botón usando el texto 'show'
        const button = component.getByText('show')
        fireEvent.click(button)
        expect(button).toBeInTheDocument()
        expect(button.parentNode).not.toHaveStyle('display: none')
    })
})
