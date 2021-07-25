import axios from 'axios'
import { UserInterface } from './apiObjects';

export interface IResponse {
  (data: any): void
} 
/** POST: Gets user Authentication Token and Refresh Token. Returns a response like this: 
 * {"Token": string, "Refresh": string}*/
export async function login(username: string, password: string): Promise<any> {
  let param = { username: username, password: password }
  axios.post(
    '/login',
    param,
  ).then(
    response => {
      if (response && response.data) {
        return response.data;
      }
      return {};
    },
    error => {
      return error;
    }
  )
}

/** GET:  Returns paginated lists of messages sent for the given room.
 * Use a URL query to ask for the specific bucket_number; this defaults to 0.*/
export async function getRoomMessages(roomId: string): Promise<any> {
  axios.get(
    `/rooms/${roomId}/messages`
  ).then(
    response => {
      if (response && response.data) {
        return response.data;
      }
      return {};
    },
    error => {
      return error;
    }
  )
}

/** GET: Returns a user given their ID.  */
export function getUser(userId: string): UserInterface | null {
  axios.get(
    `/users/${userId}`
  ).then(
    response => {
      if (response && response.data) {
        return response.data;
      }
    },
    error => {
      return null;
    }
  )
  return null;
}

/** GET: Returns an upload given its ID. */
// export function getUserAvatar(userId: string, callback: IResponse) {
//   debugger;
//   axios.get(
//     `/avatar/${userId}`,
//     {
//       responseType: 'arraybuffer'
//     }
//   ).then(response => {
//     callback(Buffer.from(response.data, 'binary').toString('base64'))
//   },
//     error => {
//       console.log(error)
//     }
//   )
// }
export function getUserAvatar(userId: string): Promise<string> {
  return new Promise((resolve, reject) => {
    axios.get(
      `/avatar/${userId}`,
      {
        responseType: 'arraybuffer'
      }
    ).then(response => {
        resolve(Buffer.from(response.data, 'binary').toString('base64'));
      }
    ).catch(error => reject(error));
  })
}