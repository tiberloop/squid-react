import axios from 'axios'

export function useToken() {
  const token = localStorage.getItem('jwt')
  return token
}

export function handleSuccesssfulLogin(responseBody: any) {
    if (responseBody && responseBody.Token && responseBody.Refresh) {
      localStorage.setItem('jwt', responseBody.Token);
      localStorage.setItem('refresh', responseBody.Refresh);
      handleAuthentication(responseBody.Token);
    } else {
      console.log("Error: Unable to retrieve tokens.");
    }
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

export async function refreshTokenEvent() {
  var refreshToken: any = localStorage.getItem('refresh'); // TODO: store refresh in cookie
  // TODO: add check to see if refresh token has expired
  if (refreshToken) {
    axios.get(
      `/refresh`,
      {
        headers: {
          'tasty_token': `Bearer ${refreshToken}`
        }
      } 
    )
    .then(
      res => {
        if (res.data && res.data.Token){
          localStorage.setItem('jwt', res.data.Token);
          handleAuthentication(res.data.Token);
        }
      },
      error => {
        console.log(error);
      })
  } else {
    console.log("RefreshTokenEvent Error: Unable to retrieve valid Refresh token. Has it expired?");
  }
}

export function logOut() {
  localStorage.removeItem('jwt');
  localStorage.removeItem('refresh');
}