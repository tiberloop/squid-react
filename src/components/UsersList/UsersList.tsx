import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGhost, faHeartbeat, faComment } from '@fortawesome/free-solid-svg-icons';
import { ISquidMessage, ISquidRoom, ISquidUser } from "utils/apiObjects";
import { useAppSelector } from "hooks";
import { getUsersList, getUserAvatar, getDM } from "utils/apiHelper";
import { Link, useHistory } from 'react-router-dom';

function UsersList() {
  const history = useHistory();
  const menuOrChat = false;
  const [allUsers, setAllUsers] = useState<any>([]);
  const [allAvatars, setAllAvatars] = useState<{[id: string]: string}>({});
  const loggedInUser: ISquidUser = useAppSelector((state) => state.userState.user);
  const isMobile: boolean = useAppSelector(state => state.environmentState.isMobile);

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
  }, [isMobile]);

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
      // debugger;
      console.log(room.room_id);
      history.push({pathname: `/rooms/${room.display_name}`, state: {room: room}});
    })
  }

  return (
    <div className={`${isMobile ? 'flex w-full' : 'flex w-1/6 mr-0'}`} style={{maxHeight: 'inherit'}}>
      <div className={`bg-white dark:bg-primaryDark border-l border-b border-r h-auto flex flex-col border-gray-300 w-full ${isMobile ? '' : 'max-w-lg'}`}>
        <div className="flex justify-between border-b border-gray-300">
          <strong className="p-2">Users</strong>
          
        </div>
        <div className="border-b border-gray-300 squid-scrollable">
            {allUsers && allUsers.map((user: ISquidUser) => (
              <div className="flex flex-row justify-between items-center px-2 py-0.5" key={user.username +"userslist"}>
                
                <div className="flex truncate">
                  <div className="relative w-9 h-9">
                    <img src={`data: image/png; base64,${allAvatars[user.ID]}`} className="flex-shrink-0 object-cover b-2 rounded-full w-8 h-8 min-w-8 min-h-8"/>
                    {/* <FontAwesomeIcon className="absolute right-0 bottom-0 pl-0.5 pt-0.5" icon={isActive(user.ID) === true ? faHeartbeat  : faGhost} color={isActive(user.ID) === true ? "green" :"#444444"} /> */}
                    <div className={`absolute rounded w-2 h-2 right-0 bottom-0 pl-0.5 pt-0.5 ${isActive(user.ID) ? 'bg-green-600' : 'bg-gray-400'}`} />
                  </div>

                  {/* history.push({pathname:`/profile/${user.username}`, state: {userId: user.ID}}); */}
                  <Link 
                    className="p-2 hover:underline truncate text-left block box-border"
                    to={{
                      pathname: `/profile/${user.username}`,
                      state: {userId: user.ID}
                    }}
                  >
                    {user.username}
                  </Link>
                  
                  {/* <button className="hover:underline pointer-cursor p-2 text-left block box-border" onClick={() => navigateToUser(user)}>
                    
                  </button> */}
                </div>

                <button className="py-1 px-2 rounded hover:border-gray-500 border border-transparent" onClick={() => selectDM(user.ID)}>
                  <FontAwesomeIcon className="ml-auto cursor-pointer" icon={faComment} />
                </button>
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