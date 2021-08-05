/**
handles the appropriate responses to the actions
*/
import { SET_WINDOW_SIZE } from './actions';

interface IEnvState {
  isMobile: boolean,
}
const INITIAL_STATE: IEnvState = {
  isMobile: false
};

function environmentReducer(state = INITIAL_STATE, action: { isMobile: boolean, type: string }): IEnvState {
  switch (action.type) {

    case SET_WINDOW_SIZE:
      return {
        ...state,
        isMobile: action.isMobile
      }
    default:
      return state;
  }
}

export default environmentReducer;