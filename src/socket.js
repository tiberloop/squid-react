import io from "socket.io-client";

//  "https://squid.chat/sockets/" 
//  "wss://squid.chat/"
//  http://127.0.0.1:5000/sockets/

// https://squid.chat/sockets

export const socket = io.connect("http://127.0.0.1:5000"  , {
  extraHeaders: {
    tasty_token: `Bearer ${localStorage.getItem('jwt')}`
  }
})

// const manager = new Manager("ws://127.0.0.1:5000/sockets", {
//   transports: ["websocket"],
//   extraHeaders: {
//     tasty_token: `Bearer ${localStorage.getItem('jwt')}`
//   }
// })

// export const socket = manager.socket("/", {

//   });

socket.emit('new_session')

// const s = new WebSocket('https://squid.chat/sockets')