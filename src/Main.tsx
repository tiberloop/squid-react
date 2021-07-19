import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { socket } from "./socket";
import Message from './components/Message'
import { useToken } from './auth'
import LoadingSpinner from "./components/LoadingSpinner";
import CreateChannelModal from "./components/CreateChannelModal";

function Main() {
  const [createChannelOpen, setCreateChannelOpen] = useState(false)

  const [roomIds, setRoomIds] = useState<any>([])
  const [rooms, setRooms] = useState<any>([])
  const [allUsers, setAllUsers] = useState<any>([])
  const [messagesDict, setMessagesDict] = useState<any>({})

  const [user, setUser] = useState<any>(null)

  const [currentRoom, setCurrentRoom] = useState<any>(null)
  const [currentRoomMessages, setCurrentRoomMessages] = useState<any>([])
  const [loading, setLoading] = useState<any>(false)

  const [message, setMessage] = useState<string>('')

  const chatRoomRef: any = useRef<HTMLInputElement>();

  useEffect(() => { // 
    axios.get('/rooms/all').then(res => {
      // debugger;
      setRooms(res.data.rooms || [])
    })
    axios.get('/users/list').then(res => {
      setUser(res.data[0])
      setAllUsers(res.data)
    })
  }, [])

  const selectDM = (userId: any) => {
    setLoading(true)
    axios.get(`/rooms/dm/${userId}`).then(res => {
      setLoading(false)
      console.log(res.data.room_id)
      setCurrentRoom(res.data.room_id)
    })
  }

  const selectChat = (room: any) => {
    setCurrentRoom(room)
    setMenuOrChat(true)
  }

  const scrollToBottom = () => {
    if (chatRoomRef && chatRoomRef.current) {

      chatRoomRef.current.scrollTop = chatRoomRef.current.scrollHeight;
    }
  };


  const dms = allUsers && allUsers.slice(1, allUsers.length)
  console.log('dms', dms)
  const channels = rooms && rooms.filter((r: any) => !r.is_dm)

  const updateMessages = (message: any) => {
    setCurrentRoomMessages({ currentRoomMessages: [...currentRoomMessages, message] });
  }

  useEffect(() => {
    if (currentRoom) {
      setLoading(true)
      axios.get(`/rooms/${currentRoom.room_id}/messages`).then(res => {
        // debugger;
        if (res && res.data) {
          // var messages: string[] = parseMessages(res.data.reverse());
          setCurrentRoomMessages(res.data);
          // console.log('res.data.messages', messages);
          scrollToBottom()
          setLoading(false)
        }
        else{
          console.log('There are no messages for this room yet.')
        }
      })

    }
  }, [currentRoom])

  useEffect(() => {
    socket.on('receive_message', function (data: any) {
      // debugger;
      console.log('RECEIVE_MESSAGE', data);
      setCurrentRoomMessages([...currentRoomMessages, data]);
      scrollToBottom()
    })

    return () => {
      socket.off('receive_message', () => { });
    };
  }, [currentRoomMessages]);

  const [someonesTyping, setSomeonesTyping] = useState(false)

  useEffect(() => {
    socket.on('someones_typing', function (data: any) {
      console.log('someones_typing')
      setSomeonesTyping(true)
    })
  }, [])

  // const [imTyping, setImTyping] = useState(false)

  const type = (message: string) => {
    setMessage(message)
    // console.log('message', message)
    // if (!imTyping) { setTimeout(() => { socket.emit('im_not_typing'); console.log('im_not_typing') }, 5000) }

    // setImTyping(true)
    // socket.emit('im_typing')
    // console.log('im_typing')
  }

  const sendMessage = () => {
    debugger;
    if (message.length) {
      socket.emit('send_message', {
        username: user.username,
        room: currentRoom.room_id,
        text: message,
        image_id: null
      })
    }
    scrollToBottom()
    setMessage('')
  }

  const onEnterPress = (e: any) => {
    if (e.keyCode === 13 && e.shiftKey === false) {
      sendMessage()
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
      <div className={`${isMobile ? menuOrChat ? 'hidden' : 'flex-grow' : ''}`}>
        <CreateChannelModal open={createChannelOpen} setOpen={setCreateChannelOpen} />
        <div className={`bg-white dark:bg-primaryDark border-l border-r h-auto border-gray-300 ${isMobile ? '' : 'max-w-lg'}`}>
          <div className="flex justify-between border-b border-gray-300">
            <strong className="p-2">Channels</strong>
            <div className="flex">
              <button onClick={() => setCreateChannelOpen(true)} className="px-2 hover:bg-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
              {currentRoom && isMobile && (
                <button onClick={() => setMenuOrChat(true)} className="px-2 hover:bg-gray-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>
          <div className="border-b border-gray-300">
            {channels && channels.map((r: any) => (
              <button className="p-2 w-full text-left block hover:underline" onClick={() => selectChat(r)}>
                #{r.name}
              </button>
            ))}
          </div>
          <p className="p-2 border-b border-gray-300"><strong>DMs</strong></p>
          <div className="border-b border-gray-300">
            {dms && dms.map((u: any) => (
              <button className="p-2 w-full text-left block hover:underline" onClick={() => selectDM(u.ID)}>
                {u.username}
              </button>
            ))}
          </div>
        </div>
      </div>






      <div
        className={`bg-white dark:bg-primaryDark flex flex-grow flex-col border-gray-300 ${isMobile ? !menuOrChat ? 'hidden' : '' : ''}`}
      >
        <div className="flex justify-between border-b border-gray-300">
          <div className="flex">
            {isMobile && (
              <button className="p-2 hover:bg-gray-200" onClick={() => setMenuOrChat(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            <span className="p-2">{rooms.find((r: any) => r.room_id === currentRoom?.room_id)?.name || 'No room selected'}</span>
          </div>
          <button className="p-2 hover:bg-gray-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
        <div
          id="messages"
          ref={chatRoomRef}
          style={{ flexGrow: 5 }}
        >
          {loading && (
            <div className="squidload w-full h-full flex justify-center justify-items-center items-center">
              {/* <LoadingSpinner className="m-auto" /> */}
            </div>
          )}
          {Boolean(currentRoomMessages) && Boolean(currentRoomMessages.length) && currentRoomMessages.map((m: any, i: any) => (
            <Message message={m} index={i} />
          ))}
        </div>
        <div className="flex-grow flex flex-col">
          <div className="p-2 pb-0">
            <textarea
              value={message}
              onKeyDown={onEnterPress}
              onChange={(e) => { type(e.target.value) }}
              className="border p-1 border-gray-600 bg-gray-100 dark:bg-primaryDarkContrast flex-grow w-full"
              placeholder={currentRoom ? `Send message to #${currentRoom.name}` : ''}
            ></textarea>
            <button className="w-full flex-grow border border-gray-600 hover:bg-gray-200 bg-gray-100 dark:bg-primaryDarkContrast" type="button" onClick={() => { sendMessage(); scrollToBottom() }}>Send Message</button>
          </div>
          <span className="px-2 pb-2">{someonesTyping && ('someone is typing...')}</span>
        </div>
      </div>
    </div>
  )
}

export default Main;