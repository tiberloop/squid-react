import io from "socket.io-client";

export const socket = io("ws://192.168.0.150:5000" , {
    extraHeaders: {
      tasty_token: `Bearer ${localStorage.getItem('jwt')}`
    }
  });

socket.emit('new_session', {
    tasty_token: `Bearer ${localStorage.getItem('jwt')}`
})