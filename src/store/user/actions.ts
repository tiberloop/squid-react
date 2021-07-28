/**
File defining the necessary actions for a user
*/
import { ISquidUser } from "utils/apiObjects";
import { logOut } from "services/authenticationService";
export const USER_LOGGED_IN = 'USER_LOGGED_IN';
export const USER_LOGGED_OUT = 'USER_LOGGED_OUT';

/** call this action when the user logs out */
export const logoutUser = () => {
  logOut();
  return {
    type: USER_LOGGED_OUT,
    isError: false
  };
};

/** call this action when user logs in or changes their username, email, avatar, or real name */
export const updateUser = (user: ISquidUser) => {
  return {
    type: USER_LOGGED_IN,
    user
  };
};