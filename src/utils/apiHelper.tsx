import axios from 'axios'
import { ISquidUser, ISquidRoom } from './apiObjects';

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

/** GET: todo */
export function getAllRooms(): Promise<ISquidRoom[]> {
  return new Promise((resolve, reject) => {
  axios.get(
    '/rooms/all'
    ).then(
      response => {
        if (response && response.data) {
          resolve(response.data);
        }
      },
      error => {
        reject(error);
      }
    )
  })
}

/** GET: todo */
export function getAllUsers(): Promise<ISquidUser[]> {
  return new Promise((resolve, reject) => {
    axios.get(
      '/users/list'
    ).then(
      response => {
        if (response && response.data) {
          resolve(response.data);
        }
      },
      error => {
        reject(error);
      }
    )
  })
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
export function getUser(userId: string): Promise<ISquidUser> {
  return new Promise((resolve, reject) => {
    axios.get(
      `/users/${userId}`
    ).then(
      response => {
        if (response && response.data) {
          resolve(response.data);
        }
      },
      error => {
        reject(error);
      }
    )
  })
}

/** GET: Returns a Base64 encoded image given a user's ID. */
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

/** POST: update a user's username, real_name, and/or email */
export function updateUser(userId: string,
                           params: {username:  string,
                                    real_name: string,
                                    email:     string}): Promise<any> {
  return new Promise((resolve, reject) => {
    // debugger;
    axios.post(
      `/users/${userId}`,
      {user: params},
    ).then(
      response => {
        resolve(response);
    },
    error => {
        reject(error);
      }
    ).catch(error => reject(error));
  })
}

/** GET: Returns a List of Users. */
export function getUsersList(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    axios.get(
      '/users/list'
    ).then(
      response => {
        resolve(response.data);
    },
    error => {
        reject(error);
      }
    ).catch(error => reject(error));
  })
}