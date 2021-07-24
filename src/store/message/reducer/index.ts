/*
/store/message/reducer/index.ts

handles the appropriate responses to the actions
*/
import { SEND_MESSAGE_RESPONSE, MESSAGE_SENT, USER_CHANGED } from '../actions';
import { readRecord } from '../../../services/localStorageService';

const INITIAL_STATE = {
  username: readRecord('username') || 'guest0001',
  messages: []
};

function messageReducer(state = INITIAL_STATE, action: {username?: string, type: string, message: { from: string, content: string}}) {
  switch (action.type) {
    case USER_CHANGED:
      return Object.assign({},
        state, {username: action.username}
      );
    case SEND_MESSAGE_RESPONSE:
      const isMessageTypeSent = (action.message.from === state.username);
      action.message = Object.assign(action.message, {type: isMessageTypeSent ? 'sent'  : 'received'});
      return {
        ...state,
        messages: [...state.messages, action.message]
      };
    case MESSAGE_SENT:
      break;
    default:
      return state;
  }
}

export default messageReducer;