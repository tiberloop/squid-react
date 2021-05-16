import React, { useState } from "react";
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { handleSuccesssfulLogin } from './auth.js'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginOrSignup, setLoginOrSignup] = useState(true)
  const history = useHistory()

  const login = () => {
    let param = { username: username, password: password}
    axios.post(
      'http://localhost:5000/login',
      param,
    )
      .then(res => {
        console.log(res)
        handleSuccesssfulLogin(res.data.Token)
        console.log('done')
        history.push('/')
      })
  }

  return (
    <div className="p-5 mt-16 border border-gray-8 bg-white rounded mx-auto" style={{ maxWidth: '400px' }}>
      <form className="mx-auto" onSubmit={(e) => e.preventDefault()}>
        <label className="flex mb-2">
        <span className="mr-2">Username</span>
          <input className="flex-grow p-1 border border-gray-200" onChange={(e) => { setUsername(e.target.value) }} type="text" id="username" />
        </label>
        <label className="mb-2 flex">
          <span className="mr-2">Password</span>
          <input className="flex-grow p-1 border border-gray-200" onChange={(e) => { setPassword(e.target.value) }} type="password" id="password" />
        </label>
        <button className="w-full p-2 rounded bg-blue-900 text-white" type="button" onClick={() => login()}>
          Login
        </button>
      </form>
    </div>
  )
}

export default Login;