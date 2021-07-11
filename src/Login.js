import React, { useState } from "react";
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { handleSuccesssfulLogin } from './auth.js'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginOrSignup, setLoginOrSignup] = useState(true)
  const history = useHistory()

  const [registerUsername, setRegisterUsername] = useState('')
  const [registerPassword, setRegisterPassword] = useState('')
  const [registerEmail, setRegisterEmail] = useState('')
  const [registerName, setRegisterName] = useState('')

  const login = () => {
    let param = { username, password }
    axios.post(
      '/login',
      param,
    )
      .then(res => {
        handleSuccesssfulLogin(res.data.Token)
        history.push('/')
      })
  }

  const signup = () => {
    let param = { username: registerUsername, password: registerPassword, email: registerEmail, name: registerName }
    axios.post(
      '/signup',
      param,
    )
      .then(res => {
        handleSuccesssfulLogin(res.data.Token)
        history.push('/')
      })
  }

  return (
    <div className="p-5 mt-16 border border-gray-8 bg-white rounded mx-auto" style={{ maxWidth: '400px' }}>
      {loginOrSignup ?
      (
      <form className="mx-auto" onSubmit={(e) => e.preventDefault()}>
        <h1 className="text-xl mb-8">Login</h1>
        <label className="flex mb-2 items-center">
        <span className="mr-2">Username</span>
          <input className="flex-grow p-1 border border-gray-200" onChange={(e) => { setUsername(e.target.value) }} type="text" id="username" />
        </label>
        <label className="mb-2 flex items-center">
          <span className="mr-2">Password</span>
          <input className="flex-grow p-1 border border-gray-200" onChange={(e) => { setPassword(e.target.value) }} type="password" id="password" />
        </label>
        <div className="flex mt-8 justify-between items-center">
          <button className="p-1 px-3 rounded hover:bg-blue-800 bg-blue-900 text-white" type="button" onClick={() => login()}>
            Login
          </button>
          {!loginOrSignup ? (
            <button className="underline text-gray-500" type="button" onClick={() => setLoginOrSignup(!loginOrSignup)}>I already have an account</button>
          ) : (
            <button className="underline text-gray-500" type="button" onClick={() => setLoginOrSignup(!loginOrSignup)}>Create an account</button>
          )}
        </div>
      </form>
      ) : (
      <form className="mx-auto" onSubmit={(e) => e.preventDefault()}>
        <h1 className="text-xl mb-8">Sign Up</h1>
        <label className="flex mb-2 items-center">
        <span className="mr-2">Username</span>
          <input className="flex-grow p-1 border border-gray-200" onChange={(e) => { setRegisterUsername(e.target.value) }} type="text" id="registerUsername" />
        </label>
        <label className="mb-2 flex items-center">
          <span className="mr-2">Password</span>
          <input className="flex-grow p-1 border border-gray-200" onChange={(e) => { setRegisterPassword(e.target.value) }} type="password" id="registerPassword" />
        </label>
        <label className="mb-2 flex items-center">
          <span className="mr-2">Email</span>
          <input className="flex-grow p-1 border border-gray-200" onChange={(e) => { setRegisterEmail(e.target.value) }} type="email" id="registerEmail" />
        </label>
        <label className="mb-2 flex items-center">
          <span className="mr-2">Full Name</span>
          <input className="flex-grow p-1 border border-gray-200" onChange={(e) => { setRegisterName(e.target.value) }} type="text" id="registerName" />
        </label>
        <div className="flex mt-8 justify-between items-center">
          <button className="p-1 px-3 rounded hover:bg-blue-800 bg-blue-900 text-white" type="button" onClick={() => signup()}>
            Sign Up
          </button>
          {!loginOrSignup ? (
            <button className="underline text-gray-500" type="button" onClick={() => setLoginOrSignup(!loginOrSignup)}>I already have an account</button>
          ) : (
            <button className="underline text-gray-500" type="button" onClick={() => setLoginOrSignup(!loginOrSignup)}>Create an account</button>
          )}
        </div>
      </form>
      )}
    </div>
  )
}

export default Login;