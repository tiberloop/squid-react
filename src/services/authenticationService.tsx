/**
File containing the necessary functions that handle authorization for a user
*/

import axios from 'axios'
import { Dispatch } from 'redux';
import { connectSocket } from 'store/socket/actions';
import store from 'store';
import { updateUser } from 'store/user/actions';
import { UserInterface } from 'utils/apiObjects';

/**  grab the JWT token from local storage */
export function getToken(): string {
  const token = localStorage.getItem('jwt')
  if (token) return token
  return ''
}

/** if a user logs in or creates a new account, call this function after the api returns successful response*/
export function handleSuccesssfulLogin(responseBody: any): void {
  if (responseBody && responseBody.Token && responseBody.Refresh) {
    localStorage.setItem('jwt', responseBody.Token);
    localStorage.setItem('refresh', responseBody.Refresh);
    handleAuthentication(responseBody.Token);
    establishSocketConnection();
    setUser(); // TODO: Decouple set user from authenticationService
  } else {
    console.log("Error: Unable to retrieve tokens.");
  }
}

/** verify that the user has signed in before and the jwt is still valid */
export async function checkAuthentication(): Promise<boolean> {
  const token = getToken();
  if (token !== '') { 
    handleAuthentication(token);
    establishSocketConnection();
    return true 
  }
  return false
}

/** Assign the valid JWT token in the header of all axios api calls */
export function handleAuthentication(token: string): void {
    axios.defaults.headers.common['tasty_token'] = `Bearer ${token}`
}

/** makes calls to api to refresh the jwt token */
export async function refreshTokenEvent(): Promise<void> {
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
          setUser(); // TODO: Decouple stored user from authentication
        }
      },
      error => {
        console.log(error);
      })
  }
  else {
    console.log("RefreshTokenEvent Error: Unable to retrieve valid Refresh token. Has it expired?");
  }
}

/** remove the jwt and refresh tokens from local storage */
export function logOut(): void {
  localStorage.removeItem('jwt');
  localStorage.removeItem('refresh');
}

/** calls the socket store action that calls the Socket middleware `connect` function */
export function establishSocketConnection(): void {
  dispatchSocketConnection(store.dispatch).connectToSockets();
}

/** defines the type of the dispatchSocketConnection action variable */
interface SocketConnectProps {
  connectToSockets: () => void;
}

/** takes the dispatch as an argument and returns an executable function that will establish the connection to the socket */
const dispatchSocketConnection = (dispatch: Dispatch<any>): SocketConnectProps => ({
  connectToSockets: () => dispatch(connectSocket())
});

/** call the api to get information on the current user */
export function setUser(): void {
  axios.get('/users/me').then(res => {
    setUserInStore(res.data);
  })
}
/** calls the user store action to add user to the store */
export function setUserInStore(user: UserInterface): void {
  // dispatchUser(store.dispatch, user).setUser();
  store.dispatch(updateUser(user));
}
/** defines the type of the dispatchSocketConnection action variable */
// interface UserProps {
//   setUser: () => void;
// }

// const dispatchUser = (dispatch: Dispatch<any>, user: UserInterface): UserProps => ({
//   setUser: () => dispatch(updateUser(user))
// });