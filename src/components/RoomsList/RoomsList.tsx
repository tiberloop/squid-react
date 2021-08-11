import React, { useState, useEffect, useRef } from "react";
import CreateChannelModal from "components/CreateChannel";
import { IMessageToDeliver, ISquidMessage, ISquidRoom, ISquidUser } from "utils/apiObjects";
import { useAppSelector } from "hooks";
import { sendMessage, setRoom } from "store/rooms/actions";
import { getAllRooms, getDM, getUsersList } from "utils/apiHelper";
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';

function RoomsList(props: IRoomListDispatchProps) {
  const history = useHistory();
  const [createChannelOpen, setCreateChannelOpen] = useState(false)
  const loggedInUser: ISquidUser = useAppSelector((state) => state.userState.user);
  const [roomIds, setRoomIds] = useState<any>([])
  const [rooms, setRooms] = useState<any>([])
  const [allUsers, setAllUsers] = useState<any>([])
  const [messagesDict, setMessagesDict] = useState<any>({})
  const [user, setUser] = useState<any>(null)
  const [currentRoom, setCurrentRoom] = useState<ISquidRoom | null>(null)
  const [currentRoomMessages, setCurrentRoomMessages] = useState<ISquidMessage[]>([])
  const [loading, setLoading] = useState<any>(false)
  const [message, setMessage] = useState<string>('')

  const roomsInState: ISquidRoom[] = useAppSelector((state) => state.roomState.rooms); // will update when the state changes

  const chatRoomRef: any = useRef<HTMLInputElement>();

  useEffect(() => { 
    // debugger;
    getAllRooms().then((rooms: ISquidRoom[]) => {
      setRooms(rooms || []);
      rooms.forEach(room => props.setRoom(room));
    })
    setUser(loggedInUser);
  }, [])

  useEffect(() => {
    var avatars: {[id: string]: string} = {};
    getUsersList().then((users: ISquidUser[]) => {
      setAllUsers(users.filter((user) => (user.ID !== loggedInUser.ID)));
    });
  }, []);

  // function to retrieve dms. currently has issues running locally
  const selectDM = (userId: any) => {
    setLoading(true);
    getDM(userId).then((room: ISquidRoom) => {
      // debugger;
      // props.setRoom(room);
      setLoading(false);
      setMenuOrChat(true);
      console.log(room.room_id);

      history.push({pathname: `/rooms/${room.name}`, state: {room: room}});
      setCurrentRoom(room);
    })
  }

  const selectChat = (room: ISquidRoom) => {
    setCurrentRoom(room);
    setMenuOrChat(true);
    history.push({pathname: `/rooms/${room.name}`, state: {room: room}});
  }


  const dms = allUsers && allUsers.slice(1, allUsers.length)

  const channels = rooms && rooms.filter((r: any) => !r.is_dm)

  const [imTyping, setImTyping] = useState(false)

  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
  });

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 640)
  const [menuOrChat, setMenuOrChat] = useState(false)
  const doStuff = () => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
      });

      setIsMobile(dimensions.width <= 640)
    }
    window.addEventListener('resize', handleResize);

    return (_: any) => {
      window.removeEventListener('resize', handleResize);
    };
  }
  useEffect(() => {
    doStuff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions.width]);

  
  /*
  parse the messages from the bucketed messages return
  */
  const parseMessages = (data: object[]) => {
    var roomMessages: string[] = [];
    data.forEach((messageMetadata: any) => roomMessages.push(messageMetadata.text));
    return roomMessages;
  }
  return (
    // <div className={`bg-white dark:bg-primaryDark border-l border-b border-r h-auto flex flex-col border-gray-300 w-full ${isMobile ? '' : 'max-w-lg'}`}>
    <div className={`flex w-1/6 mx-0 ${isMobile ? (menuOrChat ? 'hidden' : 'flex-grow') : ''}`}>
        <CreateChannelModal open={createChannelOpen} setOpen={setCreateChannelOpen} />
        <div className={`flex flex-col bg-white dark:bg-primaryDark border-l border-b border-r h-auto border-gray-300 w-full ${isMobile ? '' : 'max-w-lg'}`}>
          <div className="flex flex-col flex-grow overflow-hidden">
            <div className="flex justify-between border-b border-gray-300">
              <strong className="p-2">Channels</strong>
              <div className="flex">
                <button onClick={() => setCreateChannelOpen(true)} className="px-2 hover:bg-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
                {/* {currentRoom && isMobile && (
                  <button onClick={() => setMenuOrChat(true)} className="px-2 hover:bg-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )} */}
              </div>
            </div>

            <div className="border-b border-gray-300 squid-scrollable">
              {channels && channels.map((r: ISquidRoom) => (
                <button key={r.toString() +"another"} className="p-2 w-full text-left block hover:underline" onClick={() => selectChat(r)}>
                  #{r.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col flex-grow overflow-hidden">
            <p className="p-2 border-b border-gray-300"><strong>DMs</strong></p>
            
            <div className="flex-grow border-b border-gray-300 squid-scrollable">
              {dms && dms.map((u: any) => (
                <button key={u.toString() + "roomslist"} className="p-2 w-full text-left block hover:underline" onClick={() => selectDM(u.ID)}>
                  {u.username}
                </button>
              ))}
            </div>
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

interface IRoomListDispatchProps {
  setRoom: (room: ISquidRoom) => void;
}
const mapDispatchToProps = (dispatch: Dispatch<any>): IRoomListDispatchProps => ({

  setRoom: (room: ISquidRoom) => dispatch(setRoom(room))
});
// @ts-ignore // ignoring because it is not matching types in mapDispatchToProps
export default connect(null, mapDispatchToProps)(RoomsList);