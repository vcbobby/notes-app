/* eslint-disable react/prop-types */
React
import React from 'react'
import Toggleble from './Toggleble'

export default function LoginForm({
    username,
    password,
    handleUsername,
    handlePassword,
    handleLogin,
}) {
    return (
        <Toggleble buttonLable={'Iniciar sesión'}>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    name="Username"
                    placeholder="Username"
                    value={username}
                    onChange={handleUsername}
                />
                <input
                    type="password"
                    name="Password"
                    placeholder="Password"
                    value={password}
                    onChange={handlePassword}
                />
                <button>Login</button>
            </form>
        </Toggleble>
    )
}
