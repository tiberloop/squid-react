import React, { ReactElement, useEffect, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons'
import { RouteComponentProps, useHistory, useLocation } from 'react-router-dom';
// import { logOut } from "services/authenticationService";
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { logoutUser, updateUser as updateUserInStore } from 'store/user/actions';
import { useAppDispatch, useAppSelector } from "hooks";
import { UserInterface } from "utils/apiObjects";
import { getUser, getUserAvatar, updateUser } from 'utils/apiHelper';
import './Profile.css';
/** props for dispatching */
interface IProfileDispatchProps {
  logoutUser: () => void;
}

interface IProfileMatchProps {
  username: string
}
/** Props coming into the component */
interface IProfileProps extends RouteComponentProps<IProfileMatchProps> {
  userId: string;
}

interface IProfileStateType {
  userId: string;
}

function Profile(props: IProfileProps) {

  const history = useHistory()
  // const [user, setUser] = useState<any>(null)
  const loggedInUser: UserInterface = useAppSelector((state) => state.userState.user);
  const providedUsername: any = props.match.params.username;
  const providedUserId: any = useLocation<IProfileStateType>().state.userId;
  const isCurrentUser: boolean = providedUserId === loggedInUser.ID;
  var user: UserInterface | null = isCurrentUser ? loggedInUser : getUser(providedUserId);
  const dispatch = useAppDispatch();
  const [avatarImg, setAvatar] = useState<string>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [button, setButton] = useState<ReactElement>();
  const [newUsername, setUsername] = useState("");
  const [newRealName, setRealName] = useState("");
  const [newEmail, setEmail] = useState("");

  useEffect(() => {
    getUserAvatar(providedUserId).then(response => {
      setAvatar(response);
    })
    .catch(error => console.log(error.response));
  }, [providedUserId])
  
  
  useEffect(() => {
    debugger;
    user = loggedInUser;
  }, [loggedInUser])

  const logout = () => {
    dispatch(logoutUser());
    history.push('/login');
  }

  const cancelUpdateProfile = () => {
    setUsername("");
    setRealName("");
    setEmail("");
    setIsEditing(false)
  }
  
  const updateProfile = () => {
    if (user) {
      var username = getPureValue(newUsername, loggedInUser.username);
      var email = getPureValue(newEmail, loggedInUser.email);
      var realName = getPureValue(newRealName, loggedInUser.real_name);
      var updatedUser = {
        ID: user.ID,
        avatar: user.avatar,
        email: email,
        previous_avatars: user.previous_avatars,
        real_name: realName,
        username: username
      }
      updateUser(user.ID, 
        {
          username: newUsername,
          real_name: newRealName,
          email: newEmail
        })
        .then(response => {
          dispatch(updateUserInStore(
            updatedUser
          ));
          setIsEditing(false);
        })
        .catch(error => console.log(error))

    }
  }

  /** returns the original value for that parameter if the newValue is still empty */
  const getPureValue = (newValue: string, originalValue: string) => {
    return newValue !== "" ? newValue : originalValue;
  }

  // let button = <div/>;
  useEffect(() => {
    if (isCurrentUser) {
      if (isEditing) {
        setButton(
          <div className="text-center md:block flex flex-col-reverse">
            {/* <div className="py-4">               */}
              <a className="text-gray-700 dark:text-gray-300 hover:text-gray-500 cursor-pointer p-4" onClick={() => cancelUpdateProfile()}>Cancel</a>
            {/* </div> */}
          <button
          onClick={() => updateProfile()}
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Save
          </button>
          </div>
          
        )
      }
      else {
        setButton(
          <button
          onClick={() => logout()}
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Log Out
          </button>
        )
      }
    }
  }, [isEditing])
  
  return (
    <div onSubmit={(e) => e.preventDefault()} className="inline-block lg:max-w-xl m-2 sm:mx-auto align-bottom bg-white dark:bg-primaryDark rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
      <div className="bg-gray-50 dark:bg-primaryDark px-4 py-3 sm:px-6 sm:flex sm:flex-column justify-space-between">
      { isCurrentUser ?
        <span className="btn-edit" >
        <FontAwesomeIcon icon={faEdit} onClick={() => setIsEditing(true)}/>
        </span>
        : <span/>
      }
      {/* <div style={{
        display:"flex",
        justifyContent:"space-around",
        margin:"18px 0px",
        borderBottom:"1px solid black"
      }}> */}
      <div className="w-full dark:border-gray-500 border sm:flex sm:flex-column justify-space-between">
      <div className="bg-white dark:bg-primaryDark pt-5 pb-4 sm:p-6 sm:pb-4 md:block hidden">
          <img src={`data: image/png; base64,${avatarImg}`} className="flex-shrink-0 rounded-full lg:w-40 lg:h-40 min-w-100"/>
          <div className="sm:flex w-100 border-8 border-transparent text-left justify-center">
            <div className="grid grid-rows-3 gap-2">
              <div className="col-span-3 sm:col-span-2">
              {/* <div className="col-span-3 sm:col-span-2"> */}
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-500">
                  <span className="text-red-900 dark:text-red-100">420</span> SquidCoins
                </label>
              </div>
              <div className="col-span-3 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-500">
                  <span className="text-red-900 dark:text-red-100">420</span> Dislikes
                </label>
              </div>
              <div className="col-span-3 sm:col-span-2">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-500">
                  <span className="text-red-900 dark:text-red-100">420</span> Channels
                </label>
              </div>
              {/* </div> */}
            </div>
          </div>
        </div>

        <div className="flex justify-center bg-white w-full md:w-3/5 dark:bg-primaryDark px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="md:block flex md:items-stretch items-start w-full">
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <div className="flex flex-row">
                <div className="flex flex-shrink-0 justify-center items-center max-h-32 h-32 h-32 md:hidden">
                  <img src={`data: image/png; base64,${avatarImg}`} className="w-24 h-24 min-w-100 rounded-full"/>
                </div>
                <div className="m-auto">
                { !isEditing
                  ?
                    <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-gray-100">
                      {user ? user.username : ""}
                    </h3>
                  :
                  <div className="m-auto">
                    <label htmlFor="channel-name" className="block text-sm text-lg text-gray-700 dark:text-gray-300">
                      <i>Edit Username</i>
                    </label>
                    <input 
                    className="p-1 border-b border-gray-300 flex-1 block w-full rounded sm:text-sm dark:bg-primaryDark"
                    placeholder={user?.username}
                    value={newUsername} onChange={(e) => { setUsername(e.target.value) }}>
                      
                    </input>
                  </div>
              }
              </div>      
              </div>
              <div className="mt-2">
                <div className="grid md:grid-cols-3 grid-cols-2 gap-6">
                  <div className="col-span-2 md:col-span-3">
                    <label htmlFor="channel-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    { !isEditing ? "Name" : <i>Edit Name</i>}
                    </label>
                    <div className="mt-1 flex w-full rounded-md shadow-sm">
                      { !isEditing
                        ?
                        <div className="p-1 border border-gray-300 flex-1 block w-full rounded sm:text-sm dark:bg-primaryDark" >{user ? user.real_name : ""}</div>
                        :
                        <input
                        className="p-1 border-b border-gray-300 flex-1 block w-full rounded sm:text-sm dark:bg-primaryDark"
                        placeholder={user?.real_name}
                        value={newRealName} onChange={(e) => { setRealName(e.target.value) }} type="text" id="username" />
                      }
                      </div>
                  </div>
                  <div className="col-span-2 md:col-span-3">
                    <label htmlFor="channel-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    { !isEditing ? "Email" : <i>Edit Email</i>}
                    </label>
                    <div className="mt-1 flex w-full rounded-md shadow-sm">
                      { !isEditing
                        ?
                        <div className="p-1 border border-gray-300 flex-1 block w-full rounded sm:text-sm" >{user ? user.email : ""}</div>
                        :
                        <input
                        className="p-1 border-b border-gray-300 flex-1 block w-full rounded sm:text-sm dark:bg-primaryDark"
                        placeholder={user?.email}
                        value={newEmail} onChange={(e) => { setEmail(e.target.value) }} type="text" id="username" />
                      }
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-3">
                    <label htmlFor="channel-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Date Joned
                    </label>
                    <div className="mt-1 flex w-full rounded-md shadow-sm">
                      <div className="p-1 border border-gray-300 flex-1 block w-full rounded sm:text-sm" >8/06/2021</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        
      </div>
      <div className="bg-gray-50 dark:bg-primaryDark px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        {button}
      </div>
    </div>
  )
}

const mapDispatchToProps = (dispatch: Dispatch<any>): IProfileDispatchProps => ({
  logoutUser: () => dispatch(logoutUser())
});
// @ts-ignore // ignoring because it is not matching types in mapDispatchToProps
export default connect(null, mapDispatchToProps)(Profile);