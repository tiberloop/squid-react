/**
store/socket/middleware/Socket.ts

Defines the Socket class that provides the necessary functionality for a web socket
*/

import io from 'socket.io-client';
import { apiUrl } from '../../../constants/apiUrl';
const EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  MESSAGE: 'message'
};

export default class Socket {
  public user: string;
  public port: string;
  private onChange: (isConnected: boolean) => void;
  private onMessage: (message: { from: string, content: string }) => void;
  private socket: any;

  constructor(onChange: (isConnected: boolean) => void, onMessage: (message: { from: string, content: string }) => void) {
    this.onChange = onChange;
    this.onMessage = onMessage;
    this.socket = '';
    this.user = '';
    this.port = '';
  }

  public connect = (user: string, port: string) => {
    this.user = user;
    this.port = port;
    // change apiUrl to connect locally
    this.socket = io(apiUrl, {auth: {
      tasty_token: `Bearer ${localStorage.getItem('jwt')}`
    }});

    this.socket.on(EVENTS.CONNECT, this.onConnected);
  };

  public onConnected = () => {
    this.socket.on(EVENTS.MESSAGE, this.onMessage);
    this.onChange(true);
  };

  public sendMessage = (message: {  username: string,
                                        room: string,
                                        text: string,
                                        image_id: null  }) => {
    if (typeof this.socket.emit === 'function') {
      this.socket.emit(EVENTS.MESSAGE, message)
    } else {
      console.error('Cannot emit socket messages. Socket.io not connected.');
    }
  };

  public disconnect = () => this.socket.close();
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