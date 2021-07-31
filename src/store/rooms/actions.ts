import { IMessageToDeliver, IMessageToReceive, ISquidRoom } from "utils/apiObjects";

/**
File defining the necessary actions for sending/receiving messages
*/
export const MESSAGE_RECEIVED = 'MESSAGE_RECEIVED';
export const MESSAGE_SENT = 'MESSAGE_SENT';
export const SEND_MESSAGE_REQUEST = 'SEND_MESSAGE_REQUEST';
export const USER_CHANGED = 'USER_CHANGED';
export const SET_ROOM = 'SET_ROOM'


export const sendMessage = (message: IMessageToDeliver) => {
  return {
    type: SEND_MESSAGE_REQUEST,
    message
  };
};

export const messageReceived = (message: IMessageToReceive) => {
  return {
    type: MESSAGE_RECEIVED,
    message
  };
};

export const setRoom = (room: ISquidRoom) => {
  return {
    type: SET_ROOM,
    room
  };
}
