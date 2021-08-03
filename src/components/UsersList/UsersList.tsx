import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGhost, faHeartbeat, faComment } from '@fortawesome/free-solid-svg-icons';
import { ISquidMessage, ISquidRoom, ISquidUser } from "utils/apiObjects";
import { useAppSelector } from "hooks";
import { getUsersList, getUserAvatar, getDM } from "utils/apiHelper";
import { useHistory } from 'react-router-dom';

function UsersList() {
  const history = useHistory();
  const isMobile = false;
  const menuOrChat = false;
  const [allUsers, setAllUsers] = useState<any>([]);
  const [allAvatars, setAllAvatars] = useState<{[id: string]: string}>({});
  const loggedInUser: ISquidUser = useAppSelector((state) => state.userState.user);

  useEffect(() => {
    var avatars: {[id: string]: string} = {};
    getUsersList().then((users: ISquidUser[]) => {
      users.forEach(
        (user: ISquidUser) => getUserAvatar(user.ID).then(
          avatar => {
            avatars[user.ID] = avatar;
          }));
      setAllUsers(users.filter((user) => (user.ID !== loggedInUser.ID)));
    }).then(r => setAllAvatars(avatars))
  }, []);

  const navigateToUser = (user: ISquidUser) => {
    history.push({pathname:`/profile/${user.username}`, state: {userId: user.ID}});
  }

  const isActive = (userId: string) => {
    // check state to see if user is active
    return true;
  }

  // function to retrieve dms
  const selectDM = (userId: any) => {
    getDM(userId).then((room: ISquidRoom) => {
      console.log(room.room_id);
      history.push({pathname: `/rooms/${room.name}`, state: {room: room}});
    })
  }

  return (
    <div className={`${isMobile ? 'flex-grow' : 'flex w-1/6 mr-0'}`} style={{maxHeight: 'inherit'}}>
      <div className={`bg-white dark:bg-primaryDark border-l border-r h-auto border-gray-300 w-full ${isMobile ? '' : 'max-w-lg'}`}>
        <div className="flex justify-between border-b border-gray-300">
          <strong className="p-2">Users</strong>
          
        </div>
        <div className="h-5/6 border-b border-gray-300 squid-scrollable">
            {allUsers && allUsers.map((user: ISquidUser) => (
              <div className="flex flex-row items-center px-2 py-0.5" key={user.username}>
                <div className="relative w-9 h-9">
                {allAvatars[user.ID] ? <img src={`data: image/png; base64,${allAvatars[user.ID]}`} className="flex-shrink-0 b-2 rounded-full w-8 h-8 min-w-8 min-h-8"/> : <span/>}
                <FontAwesomeIcon className="absolute right-0 bottom-0 pl-0.5 pt-0.5" icon={isActive(user.ID) === true ? faHeartbeat  : faGhost} color={isActive(user.ID) === true ? "green" :"#444444"} />
                </div>  
                <button className="p-2 text-left block box-border" onClick={() => navigateToUser(user)}>
                  {user.username}
                </button>
                <FontAwesomeIcon className="ml-auto cursor-pointer" icon={faComment} onClick={() => selectDM(user.ID)}/>
              </div>
            ))}
          </div>
      </div>
    </div>
  )

// {isMobile && (
//   <button className="p-2 hover:bg-gray-200" onClick={() => setMenuOrChat(false)}>
//     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
//     </svg>
//   </button>
// )}
}

export default UsersList;