/* eslint-disable react/prop-types */
import React from 'react'
import { useRef } from 'react'

import Toggleble from './Toggleble'

export default function CreateNote({
    handleLogout,
    handleSubmit,
    handleTitle,
    titleValue,
    handleDescription,
    descriptionValue,
}) {
    const togglebleRef = useRef()

    const handleClick = () => {
        togglebleRef.current.toggleVisible()
    }

    return (
        <>
            <div>
                <button onClick={handleLogout}>Cerrar Sesión</button>
            </div>
            <Toggleble buttonLable={'Crear nota'} ref={togglebleRef}>
                <form style={{ paddingBottom: '50px' }} onSubmit={handleSubmit}>
                    <input
                        onChange={handleTitle}
                        type="text"
                        placeholder="Escribe el titulo de tu nota"
                        value={titleValue}
                    />
                    <input
                        onChange={handleDescription}
                        type="text"
                        placeholder="Escribe la descripcion de tu nota"
                        value={descriptionValue}
                    />
                    <button onClick={handleClick}>Crear nota</button>
                </form>
            </Toggleble>
        </>
    )
}
