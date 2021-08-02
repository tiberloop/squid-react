/**
File defining the necessary actions for a user
*/
import { ISquidUser } from "utils/apiObjects";
import { logOut } from "services/authenticationService";
export const I_LOGGED_IN = 'USER_LOGGED_IN';
export const I_LOGGED_OUT = 'USER_LOGGED_OUT';
export const USER_BECAME_ACTIVE = 'USER_BECAME_ACTIVE';
export const USER_BECAME_INACTIVE = 'USER_BECAME_INACTIVE';

/** call this action when the user logs out */
export const logoutUser = () => {
  logOut();
  return {
    type: I_LOGGED_OUT,
    isError: false
  };
};

/** call this action when user logs in or changes their username, email, avatar, or real name */
export const updateUser = (user: ISquidUser) => {
  return {
    type: I_LOGGED_IN,
    user
  };
};

/** call this action when socket emits 'user_online' */
export const userBecameActive = (user_id: string) => {
  return {
    type: USER_BECAME_ACTIVE,
    user_id
  };
}

/** call this action when socket emits 'user_offline' */
export const userBecameInactive = (user_id: string) => {
  return {
    type: USER_BECAME_INACTIVE,
    user_id
  };
}