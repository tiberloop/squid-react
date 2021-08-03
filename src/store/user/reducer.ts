/**
handles the appropriate responses to the actions for a user
*/
import { I_LOGGED_IN, I_LOGGED_OUT, USER_BECAME_ACTIVE, USER_BECAME_INACTIVE } from './actions';
import { ISquidUser } from 'utils/apiObjects';

interface IUserState {
  user: ISquidUser,
  isLoggedIn: boolean,
  activeUsers: string[]
}

const INITIAL_STATE: IUserState = {
  user: {
    ID: "ID",
    avatar: '',
    email: "default@email.com",
    previous_avatars: [],
    real_name: "Squid",
    username: "squid_user",
  },
  isLoggedIn: false,
  activeUsers: []
};

function userReducer(state = INITIAL_STATE, action: {user?: ISquidUser, type: string, user_id?: string}) {
  switch (action.type) {
    case I_LOGGED_IN:
      // make update to user store and update the DB
      return Object.assign({},
        state, {user: action.user, isLoggedIn: true}
      );
    case I_LOGGED_OUT:
      // remove user from store
      return Object.assign({},
        state, {user: INITIAL_STATE.user, isLoggedIn: false}
      );
    case USER_BECAME_ACTIVE:
      if (action.user_id) {
        return {
          ...state, // copy current state
          activeUsers: state.activeUsers.concat(action.user_id)
        };
      }
      return state;
    case USER_BECAME_INACTIVE:
      return {
        ...state, // copy current state
        activeUsers: state.activeUsers.filter(userId => userId !== action.user_id)
      };
    default:
      return state;
  }
}

export default userReducer;