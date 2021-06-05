import axios from 'axios'

export function useToken() {
  const token = localStorage.getItem('jwt')
  handleAuthentication(token)
  return token
}

export function handleSuccesssfulLogin(token) {
    localStorage.setItem('jwt', token)
}

export async function checkAuthentication() {
    const token = localStorage.getItem('jwt')
    if (token) { 
      handleAuthentication(token)
      return true 
    }
    return false
  }

export function handleAuthentication(token) {
    axios.defaults.headers.common['tasty_token'] = `Bearer ${token}`
    console.log('axios.defaults.headers.common[tasty_token]', axios.defaults.headers.common['tasty_token'])
}