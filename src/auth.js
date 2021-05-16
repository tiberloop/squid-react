import axios from 'axios'

export function useToken() {
    return localStorage.getItem('jwt')
}

export function handleSuccesssfulLogin(token) {
    localStorage.setItem('jwt', token)
}

export async function checkAuthentication() {
    const token = localStorage.getItem('jwt')
    if (token) await handleAuthentication(token)
  }

export async function handleAuthentication(token) {
    axios.defaults.headers.common['Authorization'] = token
}