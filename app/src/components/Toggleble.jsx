/* eslint-disable react/prop-types */
React
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import PropTypes from 'prop-types'

const Toggleble = forwardRef(({ children, buttonLable }, ref) => {
    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisible = () => setVisible(!visible)
    useImperativeHandle(ref, () => {
        return { toggleVisible }
    })

    return (
        <>
            <button style={hideWhenVisible} onClick={toggleVisible}>
                {buttonLable}
            </button>
            <div style={showWhenVisible}>{children}</div>
            <button style={showWhenVisible} onClick={toggleVisible}>
                Cancelar
            </button>
        </>
    )
})

Toggleble.displayName = 'Togglebe'

Toggleble.propTypes = {
    buttonLable: PropTypes.string.isRequired,
}

export default Toggleble
