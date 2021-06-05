import React, { useState, useEffect } from "react";
import axios from 'axios';
import Message from './components/Message'

function Main() {
  const [roomIds, setRoomIds] = useState([])
  const [rooms, setRooms] = useState([])
  const [messagesDict, setMessagesDict] = useState({})

  const [currentRoom, setCurrentRoom] = useState(null)
  const [currentRoomMessages, setCurrentRoomMessages] = useState([])

  //Load room data
  if (!rooms.length) {
    axios.get('/rooms/all').then(res => {
      setRooms(res.data.list)
    })
  }

  // if (!roomIds.length) axios.get('/rooms/list').then(res => { 
  //   setRoomIds(res.data.rooms)
  //   roomIds.forEach(i => {
  //     const roomData = axios.get(`/rooms/${i}`).data
  //     const newRoomArray = rooms[i] = roomData
  //     setRooms(newRoomArray)
  //     console.log('rooms', rooms)

  //     const messages = axios.get(`/rooms/${i}/messages`).data
  //     let newMessagesDict = messagesDict
  //     newMessagesDict[i] = []
  //     console.log('newMessagesDict[i]', newMessagesDict[i])
  //     setMessagesDict(newMessagesDict)
  //   })
  // })

  useEffect(() => {
    if (currentRoom) {
      axios.get(`/rooms/${currentRoom}/messages`).then(res => {
        setCurrentRoomMessages(res.data.messages)
        console.log(res.data)
      })

    }
  }, [currentRoom])

  return (
  <div className="flex border min-h-full flex-grow border-gray-300">
    <div className="m-1 rounded bg-white p-2 max-w-lg border border-gray-300">
      {rooms && rooms.map(r => (
        <button className="block hover:underline" onClick={() => setCurrentRoom(r._id)}>{r.name}</button>
      ))}
    </div>
    <div className="m-1 rounded bg-white flex-grow flex border flex-col border-gray-300">
      <p className="p-2 border-b border-gray-300">{currentRoom || 'No room selected'}</p>
      <div
        id="messages"
        className="flex-grow overflow-y-scroll"
      >
        {currentRoomMessages && currentRoomMessages.length && currentRoomMessages.map((m, i) => (
          <Message message={m} index={i} />
        ))}
      </div>
      <textarea 
        className="border border-gray-200 w-full"
      />
    </div>
    <div className="m-1 rounded bg-white p-2 max-w-lg border border-gray-300">
      hey
    </div>
  </div>
  )
}

export default Main;