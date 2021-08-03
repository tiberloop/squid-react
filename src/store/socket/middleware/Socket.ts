/**
Defines the Socket class that provides the necessary functionality for a web socket
*/

import io from 'socket.io-client';
import { apiUrl } from '../../../constants/apiUrl';
import { IMessageToDeliver, IMessageToReceive } from 'utils/apiObjects';
const EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  SEND_MESSAGE: 'send_message',
  SET_AS_TYPING: 'im_typing',
  SET_AS_NOT_TYPING: 'im_not_typing',
  REACT: 'send_react'
};

export default class Socket {
  public user: string;
  private onChange: (isConnected: boolean) => void;
  private onMessage: (message: IMessageToReceive) => void;
  private onUserActive: (user_id: string) => void;
  private onUserInactive: (user_id: string) => void;
  private socket: any;

  constructor(onChange: (isConnected: boolean) => void,
              onMessage: (message: IMessageToReceive) => void,
              onUserActive: (user_id: string) => void,
              onUserInactive: (user_id: string) => void,
              ) {
    this.onChange = onChange;
    this.onMessage = onMessage;
    this.onUserActive = onUserActive;
    this.onUserInactive = onUserInactive;
    this.socket = {};
    this.user = '';
  }

  public connect = (user: string) => {
    this.user = user;
    // change apiUrl to connect locally
    this.socket = io(apiUrl, {extraHeaders: {
      tasty_token: `Bearer ${localStorage.getItem('jwt')}`
    }});
    this.socket.emit('new_session');

    this.socket.on(EVENTS.CONNECT, this.onConnected);
  };

  public onConnected = () => {
    // verify all of the listener events needed for this socket
    console.log('Socket has connected: ', this.socket.connected);
    this.socket.on('disconnect', this.disconnect);
    this.socket.on('receive_message', this.onMessage);
    this.socket.on('someones_typing', this.someoneIsTyping);
    this.socket.on('receive_react', this.receiveReact);
    this.socket.on('avatar_changed', this.avatarChanged);
    this.socket.on('user_online', this.onUserActive);
    this.socket.on('user_offline', this.onUserInactive);
    this.onChange(true);
  };

  public sendMessage = (message: IMessageToDeliver) => {
    if (this.socket.connected) {
      this.socket.emit(EVENTS.SEND_MESSAGE, message);
      // console.log("message sent?");
    } else {
      console.error('Cannot emit socket messages. Socket.io not connected.');
    }
  };

  public setAsTyping = (room_id: string) => {
    if (this.socket.connected) {
      this.socket.emit(EVENTS.SET_AS_TYPING, room_id);
    } else {
      console.error('Cannot set as typing. Socket.io not connected.');
    }
  }

  public setAsNotTyping = (room_id: string) => {
    if (this.socket.connected) {
    this.socket.emit(EVENTS.SET_AS_NOT_TYPING, room_id);
    } else {
      console.error('Cannot set as not typing. Socket.io not connected.');
    }
  }

  public sendReact = (reactionObject: {reaction: string, message_id: string}) => {
    if (this.socket.connected) {
      this.socket.emit(EVENTS.SEND_MESSAGE, reactionObject);
    } else {
      console.error('Cannot react to message. Socket.io not connected.');
    }
  }

  public someoneIsTyping = (username: string) => {
    // do something, but need a room too...
    console.log(username, "is typing");
  }

  public receiveReact = (reactionObject: {  message_id: string,
                                              reaction: any, 
                                               user_id: string,
                                              username: string }) => {
    // do something
    console.log(reactionObject.username, "reacted to message", reactionObject.message_id);
  }

  public avatarChanged = (change: {user_id: string, image_id: string}) => {
    // do something
    console.log(change.user_id, "change their avatar");
  }

  public disconnect = () => {
    this.socket.close();
    this.onChange(false);
  }
}

// if front is served on same domain as server, we can use
// export const socket = io()
// otherwise
// export const socket = io(apiUrl, {
//   extraHeaders: {
//     tasty_token: `Bearer ${localStorage.getItem('jwt')}`
//   }
// })
// const manager = new Manager("ws://127.0.0.1:5000/sockets", {
//   transports: ["websocket"],
//   extraHeaders: {
//     tasty_token: `Bearer ${localStorage.getItem('jwt')}`
//   }
// })

// export const socket = manager.socket("/", {

//   });


// const s = new WebSocket('https://squid.chat/sockets')