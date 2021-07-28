/**
Defines the User class
*/

import { apiUrl } from 'constants/apiUrl';
import { ISquidUser } from 'utils/apiObjects';
import axios from 'axios'
import { logOut as logoutAuth, handleSuccesssfulLogin } from 'services/authenticationService';

export default class User {
  public user: ISquidUser;

  constructor(user: ISquidUser) {
    this.user = user;
  }

  /** update the user's password */
  public changePassword = (oldPassword: string, newPassword: string) => {
    // TODO: encrypt the password
    var param = {
      new_password: newPassword,
      old_password: oldPassword
    }
    axios.post(
      `/users/${this.user.ID}/password`,
      param,
    )
  }

  /** update the user's username, real name, or email address */
  public updateUser = (params: {username:  string,
                                real_name: string,
                                email:     string}) => {
    axios.post(
      `/users/${this.user.ID}`,
      params,
    )
  };

  /** reset the default user in the store and clear tokens */
  public logout = () => {
    // TODO: watch update to API service of the blacklisted live tokens
    logoutAuth();
  }
}