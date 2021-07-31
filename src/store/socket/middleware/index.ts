/**
Custom Socket Middleware for our Redux Store
*/
import Socket from "./Socket";
import { CONNECT_SOCKET,
         connectionChanged,
         REACT_REQUEST,
         SET_AS_TYPING_REQUEST,
         SET_AS_NOT_TYPING_REQUEST } from "../actions";
import { messageReceived, SEND_MESSAGE_REQUEST, sendMessage } from "store/rooms/actions";
import { useAppSelector } from "hooks";
import { IMessageToReceive } from "utils/apiObjects";
// import { messageSent, SEND_MESSAGE_REQUEST } from "store/message/actions";

const socketMiddleware = (store: any) => {
  
  const onConnectionChange = (isConnected: boolean) => {
    store.dispatch(connectionChanged(isConnected));
  };

  const onIncomingMessage = (message: IMessageToReceive) => store.dispatch(messageReceived(message));

  const socket = new Socket(onConnectionChange, onIncomingMessage);

  return (next: any) => (action: any) => {
    const userState = store.getState().userState;

    switch (action.type) {
      case CONNECT_SOCKET:
        socket.connect(userState.user);
        break;

      case SEND_MESSAGE_REQUEST:
        // debugger;
        // sendMessage(action.message);
        socket.sendMessage(action.message);
        break;
      
      case REACT_REQUEST:
        socket.sendReact(action.reactionObject);
        break;

      case SET_AS_TYPING_REQUEST:
        socket.setAsTyping(action.roomId);
        break;

      case SET_AS_NOT_TYPING_REQUEST:
        socket.setAsNotTyping(action.roomId);
        break;

      default:
        break;
    }

    return next(action)
  };
};

export default socketMiddleware;