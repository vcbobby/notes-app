/* eslint-disable react/prop-types */
import React from 'react'

const Notification = ({ msg, color, align }) => {
    return (
        <>
            <p
                style={{
                    marginLeft: '20px',
                    textAlign: align,
                    color: color,
                }}
            >
                {msg}
            </p>
        </>
    )
}

export default Notification
