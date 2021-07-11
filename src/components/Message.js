import React, { useEffect, useState } from "react";
import { useStore } from '../store/reactive'
import axios from "axios";
import { format } from 'date-fns'
import UserCardModal from "./UserCardModal";

function Message(props) {
  const { message, index } = props
  
  const [src, setSrc] = useState('https://res.cloudinary.com/dk-find-out/image/upload/q_70,c_pad,w_1200,h_630,f_auto/DCTM_Penguin_UK_DK_AL639403_k3qity.jpg')
  const [open, setOpen] = useState(false)

  // if (index === 1) {
  //     axios.get(`/uploads/${message.avatar_id}`, { responseType: "blob" }).then(res => {
  //     const srcurl = URL.createObjectURL(res.data)
  //     setSrc(srcurl)
  //   })
  // }

  const [avatars, setAvatars] = useStore('avatars')

  useEffect(() => {
    const avatar = avatars.find(a => a.userId === message.user_id)
    if (avatar) { setSrc(URL.createObjectURL(avatar.src)) }
  }, [avatars])


  const timeSentFormatted = format(new Date(message.time_sent), 'p')

  return (
  <div className={`flex p-1 ${(index % 2) && 'bg-gray-100'}`}>
    <UserCardModal open={open} setOpen={setOpen} userId={message.user_id} />
    <div onClick={() => setOpen(true)} className="rounded">
      <img className="rounded object-cover" src={src} alt="Avatar" style={{ height: '32px', width: '32px' }} />
    </div>
    <div className="ml-1">
      <p><strong className="hover:underline cursor-pointer" onClick={() => setOpen(true)}>{message.username}</strong> <small>{timeSentFormatted}</small></p>
      <p>
        {message.text}
      </p>
    </div>
  </div>
  )
}

export default Message;