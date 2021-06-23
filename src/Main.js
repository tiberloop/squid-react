import React, { useState, useEffect, useRef } from "react";
import axios from 'axios';
import { socket } from "./socket";
import Message from './components/Message'
import { useToken } from './auth.js'
import LoadingSpinner from "./components/LoadingSpinner";

function Main() {

  const [roomIds, setRoomIds] = useState([])
  const [rooms, setRooms] = useState([])
  const [messagesDict, setMessagesDict] = useState({})

  const [user, setUser] = useState(null)

  const [currentRoom, setCurrentRoom] = useState(null)
  const [currentRoomMessages, setCurrentRoomMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const [message, setMessage] = useState('')

  const chatRoomRef = useRef()

  const scrollToBottom = () => {
		chatRoomRef.current.scrollTop = chatRoomRef.current.scrollHeight;
	};

  //Load room data
  if (!rooms.length) {
    axios.get('/rooms/all').then(res => {
      setRooms(res.data.rooms || [])
    })
    console.log('rooms', rooms)
  }

  if (!user) {
    axios.get('/whoami').then(res => {
      setUser(res.data.user)
    })
  }

  const dms = rooms && rooms.filter(r => r.is_dm)
  const channels = rooms && rooms.filter(r => !r.is_dm)

  const updateMessages = (message) => {
    // console.log('currentRoomMessages', currentRoomMessages)
    // let newMessages = currentRoomMessages
    // console.log('newMessages', newMessages)
    // newMessages.push(message)
    // setCurrentRoomMessages(newMessages)

    setCurrentRoomMessages({currentRoomMessages: [...currentRoomMessages, message]});
  }

  useEffect(() => {
    if (currentRoom) {
      setLoading(true)
      axios.get(`/rooms/${currentRoom}/messages`).then(res => {
        setCurrentRoomMessages(res.data.messages)
        scrollToBottom()
        setLoading(false)
      })

    }
  }, [currentRoom])

  useEffect(() => {
    socket.on('receive_message', function (data) {
      console.log('RECEIVE_MESSAGE', data);
      setCurrentRoomMessages([...currentRoomMessages, data]);
      scrollToBottom()
    })

    return () => {
      socket.off('receive_message', () => {});
   };
  }, [currentRoomMessages]);

  const sendMessage = () => {
    if (message.length) {
      setMessage('')
      socket.emit('send_message', {
          username: user,
          room: currentRoom,
          text: message,
          include_image: null,
          image_id: null
      })
    }
    scrollToBottom()
  }

  return (
  <div className="flex border min-h-full flex-grow border-gray-300">
    <div>
      <div className="m-1 rounded bg-white max-w-lg border h-auto border-gray-300">
        <p className="p-2 border-b border-gray-300"><strong>Channels</strong></p>
        <div className="border-b border-gray-300">
        {channels && channels.map(r => (
          <button className="p-2 w-full text-left block hover:underline" onClick={() => setCurrentRoom(r.room_id)}>
            #{r.name}
          </button>
        ))}
        </div>
        <p className="p-2 border-b border-gray-300"><strong>DMs</strong></p>
        <div className="border-b border-gray-300">
        {dms && dms.map(r => (
          <button className="p-2 w-full text-left block hover:underline" onClick={() => setCurrentRoom(r.room_id)}>
            {r.name}
          </button>
        ))}
        </div>
      </div>
    </div>






    <div className="m-1 rounded bg-white flex flex-grow border flex-col border-gray-300">
      <p className="p-2 border-b border-gray-300">{rooms.find(r => r.room_id === currentRoom)?.name || 'No room selected'}</p>
      <div
        id="messages"
        ref={chatRoomRef}
        style={{ flexGrow: 5 }}
        className="overflow-y-scroll"
      >
        {loading && (
          <div className="w-full h-full flex justify-center justify-items-center items-center">
            <LoadingSpinner className="m-auto" />
          </div>
        )}
        {Boolean(currentRoomMessages) && Boolean(currentRoomMessages.length) && currentRoomMessages.map((m, i) => (
          <Message message={m} index={i} />
        ))}
      </div>
      <div className="flex-grow flex flex-col">
        <textarea
          value={message}
          onChange={(e) => { setMessage(e.target.value) }}
          className="border border-gray-200 flex-grow w-full h-full"
        />
        <button className="w-full flex-grow border border-gray-300" type="button" onClick={() => { sendMessage(); scrollToBottom() }}>Send Message</button>
      </div>
    </div>
    {/* <div className="m-1 rounded bg-white p-2 max-w-lg border border-gray-300">
      hey
    </div> */}
  </div>
  )
}

export default Main;