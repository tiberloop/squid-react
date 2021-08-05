import React, { useState, useEffect, useRef, ReactElement } from "react";
import axios from 'axios';
import Message from 'components/Message'
import { getToken } from 'services/authenticationService'
import LoadingSpinner from "components/helpers/LoadingSpinner";
import CreateChannelModal from "components/CreateChannel";
import RoomsList from "components/RoomsList";
import { useLocation } from 'react-router-dom';
import store from 'store';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { useAppSelector } from "hooks";
import { IMessageToDeliver, ISquidMessage, ISquidRoom, ISquidUser } from "utils/apiObjects";
import { getAllRooms, getRoomMessages, addUsersToRoom, getDM, getUsersList } from "utils/apiHelper";
import { reactToMessage, setAsTyping, setAsNotTyping } from 'store/socket/actions';
import { sendMessage, setRoom } from "store/rooms/actions";

interface IRoomStateType {
  room: ISquidRoom;
}

function Room(props: IRoomDispatchProps) {
  const currentRoom: ISquidRoom = useLocation<IRoomStateType>().state.room;



  const [createChannelOpen, setCreateChannelOpen] = useState(false)
  const loggedInUser: ISquidUser = useAppSelector((state) => state.userState.user);
  const [roomIds, setRoomIds] = useState<any>([])
  const [rooms, setRooms] = useState<any>([])
  const [allUsers, setAllUsers] = useState<any>([])
  const [messagesDict, setMessagesDict] = useState<any>({})
  const [user, setUser] = useState<any>(null)
  const [currentRoomMessages, setCurrentRoomMessages] = useState<ISquidMessage[]>([])
  const [loading, setLoading] = useState<any>(false)
  const [message, setMessage] = useState<string>('')

  const roomsInState: ISquidRoom[] = useAppSelector((state) => state.roomState.rooms); // will update when the state changes

  const chatRoomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUser(loggedInUser);
  })
  useEffect(() => {
    if (currentRoom) {
      console.log(roomsInState); // this is definitely changing
      var tempRoom = roomsInState.find((room) => room.room_id === currentRoom.room_id );
      
      if (tempRoom) {
        // setCurrentRoomMessages([...tempRoom.messages.slice(0,tempRoom.messages.length-1), tempRoom.messages[tempRoom.messages.length-1]]); // this defnitely SHOULD be changing. new reference and new contents
        setCurrentRoomMessages([...tempRoom.messages]); // this defnitely SHOULD be changing. new reference and new contents
        scrollToBottom();
      }
    }
  }, [roomsInState]);

  const scrollToBottom = () => {
    
    if (chatRoomRef && chatRoomRef.current) {

      chatRoomRef.current.scrollTop = chatRoomRef.current.scrollHeight;
    }
  };


  const dms = allUsers && allUsers.slice(1, allUsers.length)

  const channels = rooms && rooms.filter((r: any) => !r.is_dm)

  const updateMessages = (message: ISquidMessage) => {
    setCurrentRoomMessages([...currentRoomMessages, message]);
  }

  useEffect(() => {
    if (currentRoom) {
      setLoading(true);
      // debugger;
      if (currentRoom.bucket_number != 0) {
        getRoomMessages(currentRoom.room_id, currentRoom.bucket_number).then(
          (messages: ISquidMessage[]) => {
            // var messages: string[] = parseMessages(res.data.reverse());
            setCurrentRoomMessages(messages);
            // console.log('res.data.messages', messages);
            scrollToBottom()
            setLoading(false)
          },
          error => {
            console.log("This room has no messages.");
            setLoading(false);
          })
      }
      else {
        setCurrentRoomMessages([]);
        scrollToBottom()
        setLoading(false)
      }
    }
  }, [currentRoom])

  // useEffect(() => {
  //   socket.on('receive_message', function (data: any) {
  //     console.log('RECEIVE_MESSAGE', data);
  //     setCurrentRoomMessages([...currentRoomMessages, data]);
  //     scrollToBottom()
  //   })

  //   return () => {
  //     socket.off('receive_message', () => { });
  //   };
  // }, [currentRoomMessages]);

  const [someonesTyping, setSomeonesTyping] = useState(false)

  // useEffect(() => {
  //   socket.on('someones_typing', function (data: any) {
  //     console.log('someones_typing')
  //     setSomeonesTyping(true)
  //   })
  // }, [])

  const [imTyping, setImTyping] = useState(false)

  const type = (message: string, roomId: string) => {
    setMessage(message)
    // console.log('message', message)
    if (!imTyping) {
      setTimeout(() => {
        props.setAsNotTyping(roomId);
        console.log('im_not_typing')
      }, 5000) }

    // setImTyping(true)
    // socket.emit('im_typing')
    // console.log('im_typing')
  }

  const sendMessage = () => {
    if (message.length && currentRoom) {
      props.sendMessage({
                          username: user.username,
                          room: currentRoom.room_id,
                          text: message,
                        });
    }
    console.log("messageSent");
    document.getElementById('composeMessageBox')?.setAttribute('value', ''); // doesn't work
    scrollToBottom()
    setMessage('')
  }

  const onEnterPress = (e: any) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      sendMessage();
    }
  }

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

  const nameToDisplay = () => {
    if (currentRoom) {
      if (currentRoom.is_dm) {
        return currentRoom.display_name;
      }
      return currentRoom.name;
    }
    return "No room selected"
  }
  /*
  parse the messages from the bucketed messages return
  */
  const parseMessages = (data: object[]) => {
    var roomMessages: string[] = [];
    data.forEach((messageMetadata: any) => roomMessages.push(messageMetadata.text));
    return roomMessages;
  }

  return (
    <div className="flex min-h-full flex-grow border-gray-300">

      <div
        className={`bg-white dark:bg-primaryDark flex flex-grow flex-col border-gray-300 ${isMobile ? !menuOrChat ? 'hidden' : '' : ''}`}
      >
        <div className="flex justify-between border-b border-gray-300">
          <div className="flex">
            
            <span className="p-2">{ nameToDisplay() }</span>
          </div>
          <button className="p-2 hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
        <div
          className='squid-scrollable'
          ref={chatRoomRef}
          style={{ flexGrow: 5 }}
        >
          {loading && (
            <div className="squidload w-full h-full flex justify-center justify-items-center items-center">
              {/* <LoadingSpinner className="m-auto" /> */}
            </div>
          )}
          {!Boolean(currentRoomMessages.length) ? `This is the beginning of your messages with ${nameToDisplay()}` : ""}
          {Boolean(currentRoomMessages) && Boolean(currentRoomMessages.length) && currentRoomMessages.map((m: any, i: any) => (
            <Message message={m} index={i} key={i}/>
          ))}
        </div>
        <div className="flex-grow flex flex-col">
          { currentRoom ?
            <div className="p-2 pb-0">
              
              <textarea
              id="messageBox"
              value={message}
              onKeyDown={onEnterPress}
              onChange={(e) => { type(e.target.value, currentRoom?.room_id) }}
              className="border p-1 border-gray-600 bg-gray-100 dark:bg-primaryDarkContrast flex-grow w-full"
              placeholder={currentRoom ? (!currentRoom.is_dm ? `Send message to #${currentRoom.name}` : `Send message to ${currentRoom.display_name}`) : ''}
            ></textarea>
            <button className="w-full flex-grow border border-gray-600 hover:bg-gray-200 bg-gray-100 dark:bg-primaryDarkContrast" type="button" onClick={() => { sendMessage(); scrollToBottom() }}>Send Message</button>
            
              
            </div>
            :
            <div/>
          }
          <span className="px-2 pb-2">{someonesTyping && ('someone is typing...')}</span>
        </div>
      </div>
    </div>
  )
}

interface IRoomStateProps {
  roomState: {
    rooms: []
  }
}
interface IRoomDispatchProps {
  sendMessage: (message:  IMessageToDeliver) => void;
  reactToMessage: (reactionObject:  {
                                      reaction: string;
                                      message_id: string;
                                    }) => void;
  setAsTyping: (roomId: string) => void;
  setAsNotTyping: (roomId: string) => void;
  setRoom: (room: ISquidRoom) => void;
}

const mapDispatchToProps = (dispatch: Dispatch<any>): IRoomDispatchProps => ({
  sendMessage: (message:  IMessageToDeliver) => dispatch(sendMessage(message)),
  reactToMessage: (reactionObject:  {
                                      reaction: string;
                                      message_id: string;
                                    }) => dispatch(reactToMessage(reactionObject)),
  setAsTyping: (roomId: string) => dispatch(setAsTyping(roomId)),
  setAsNotTyping: (roomId: string) => dispatch(setAsNotTyping(roomId)),
  setRoom: (room: ISquidRoom) => dispatch(setRoom(room))
});

const mapStateToProps = (state: IRoomStateProps) => ({
  rooms: state.roomState.rooms
});
// @ts-ignore // ignoring because it is not matching types in mapDispatchToProps
export default connect(mapStateToProps, mapDispatchToProps)(Room);