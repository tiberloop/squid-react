/**
handles the appropriate responses to the actions for a user
*/
import { USER_LOGGED_IN, USER_LOGGED_OUT } from './actions';
import { ISquidUser } from 'utils/apiObjects';

const INITIAL_STATE = {
  user: {
    ID: "ID",
    avatar: '',
    email: "default@email.com",
    previous_avatars: [],
    real_name: "Squid",
    username: "squid_user",
  },
  isLoggedIn: false
};

function userReducer(state = INITIAL_STATE, action: {user?: ISquidUser, type: string}) {
  switch (action.type) {
    case USER_LOGGED_IN:
      // make update to user store and update the DB
      return Object.assign({},
        state, {user: action.user, isLoggedIn: true}
      );
    case USER_LOGGED_OUT:
      // remove user from store
      return Object.assign({},
        state, {user: INITIAL_STATE.user, isLoggedIn: false}
      );
    default:
      return state;
  }
}

export default userReducer;