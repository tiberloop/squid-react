import axios from 'axios'

export function useToken() {
  const token = localStorage.getItem('jwt')
  return token
}

export function handleSuccesssfulLogin(token: string) {
    localStorage.setItem('jwt', token)
    handleAuthentication(token)
}

export async function checkAuthentication() {
    const token = localStorage.getItem('jwt')
    if (token) { 
      handleAuthentication(token)
      return true 
    }
    return false
  }

export function handleAuthentication(token: string) {
    axios.defaults.headers.common['tasty_token'] = `Bearer ${token}`
}