/**
handles the appropriate responses to the socket actions
*/
import { CONNECTION_CHANGED } from './actions';

const INITIAL_STATE = {
  connected: false
};

function socketReducer(state = INITIAL_STATE, action: { type: string, port: string, connected: boolean }) {
  let reduced;
  switch (action.type) {
    case CONNECTION_CHANGED:
      reduced = Object.assign({}, state, {
        connected: action.connected,
        isError: false
      });
      break;
    default:
      reduced = state;
  }
  return reduced;
}

export default socketReducer;