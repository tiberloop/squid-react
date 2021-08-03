/**
MAYBE WILL NOT NEED THIS Custom Socket Middleware for our Redux Store
*/
import { MESSAGE_RECEIVED, SEND_MESSAGE_REQUEST, USER_CHANGED, SET_ROOM } from '../actions';
import { useAppSelector } from "hooks";
import { IMessageToReceive } from "utils/apiObjects";

const roomsMiddleware = (store: any) => (next: any) => (action: any) => {
  
  const socketState = store.getState().socketState;
  let syncActivityFinished = false;
  let actionQueue: any[] = [];

  function flushQueue() {
    actionQueue.forEach(a => store.dispatch(a)); // flush queue
    actionQueue = [];
  }

  function externalDispatch(action: any) {
    actionQueue = actionQueue.concat([action]);

    if (syncActivityFinished) {
      flushQueue();
    }
  }

  const actionWithExternalDispatch =
    Object.assign({}, action, { externalDispatch });

  const res = next(actionWithExternalDispatch);

  syncActivityFinished = true;
  flushQueue();

  return res;
};

export default roomsMiddleware;