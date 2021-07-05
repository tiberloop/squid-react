import React, { useState } from "react";
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { handleSuccesssfulLogin } from './auth.js'

function Profile() {
  const history = useHistory()

  const logout = () => {
    localStorage.removeItem('jwt')
    history.push('/login')
  }

  return (
    <div className="p-5 mt-16 border border-gray-8 bg-white rounded mx-auto" style={{ maxWidth: '400px' }}>
      <h1 className="text-xl mb-8">Welcome</h1>
      <div></div>
      <button className="border borer-gray-200 rounded p-2" onClick={() => logout()}>Log out</button>
      {/* <form>
        <label>New Avatar</label>
        <input type="file" />
      </form> */}
    </div>
  )
}

export default Profile;