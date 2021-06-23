import io from "socket.io-client";

//  "https://squid.chat/sockets/" 
//  "wss://squid.chat/"
//  http://127.0.0.1:5000/sockets/

export const socket = io("https://squid.chat/sockets/"  , {
    extraHeaders: {
      tasty_token: `Bearer ${localStorage.getItem('jwt')}`
    }
  });

socket.emit('new_session')