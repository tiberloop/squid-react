import io from "socket.io-client";

export const socket = io("wss://squid.chat/" , {
    extraHeaders: {
      tasty_token: `Bearer ${localStorage.getItem('jwt')}`
    }
  });

socket.emit('new_session', {
    tasty_token: `Bearer ${localStorage.getItem('jwt')}`
})