/**
File defining the necessary actions for a connecting to a socket and status of socket connection
*/
export const CONNECTION_CHANGED = 'CONNECTION_CHANGED';
export const CONNECT_SOCKET = 'CONNECT_SOCKET';
export const SEND_MESSAGE_REQUEST = 'SEND_MESSAGE_REQUEST';
export const SET_AS_TYPING_REQUEST = 'SET_AS_TYPING_REQUEST';
export const SET_AS_NOT_TYPING_REQUEST = 'SET_AS_NOT_TYPING_REQUEST';
export const REACT_REQUEST = 'REACT_REQUEST';
export const SOMEONE_IS_TYPING = 'SOMEONE_IS_TYPING';
export const REACT_RECEIVE = 'REACT_RECEIVE';
export const AVATAR_CHANGED = 'AVATAR_CHANGED';
export const USER_ONLINE = 'USER_ONLINE';
export const USER_OFFLINE = 'USER_OFFLINE';
export const DISCONNECT = 'DISCONNECT';

export const connectionChanged = (isConnected: boolean) => {
  return {
    type: CONNECTION_CHANGED,
    connected: isConnected,
    isError: false
  };
};

export const connectSocket = () => {
  return {
    type: CONNECT_SOCKET
  };
};

export const reactToMessage = (reactionObject: {reaction: string, message_id: string}) => {
  return {
    type: REACT_REQUEST,
    reactionObject
  };
};

export const setAsTyping = (roomId: string) => {
  return {
    type: SET_AS_TYPING_REQUEST,
    roomId
  };
};

export const setAsNotTyping = (roomId: string) => {
  return {
    type: SET_AS_NOT_TYPING_REQUEST,
    roomId
  };
};

// export const someoneIsTyping = (username: string) => {
//   return {
//     type: SOMEONE_IS_TYPING,
//     username
//   }
// }

// export const receiveReact = (reactionObject: {  message_id: string,
//                                             reaction: any, 
//                                              user_id: string,
//                                             username: string }) => {
//   return {
//     type: REACT_RECEIVE,
//     reactionObject
//   }
// }

// export const avatarChanged = (change: {user_id: string, image_id: string}) => {
//   return {
//     type: AVATAR_CHANGED,
//     change
//   }
// }

// export const userCameOnline = (user_id: string) => {
//   return {
//     type: USER_ONLINE,
//     user_id
//   }
// }

// export const userWentOffline = (user_id: string) => {
//   return {
//     type: USER_OFFLINE,
//     user_id
//   }
// }

export const disconnect = () => {
  return {

  }
}