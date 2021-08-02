import React, { useEffect, useState } from "react";
import { useStore } from 'store/reactive'
import axios from "axios";
import { format } from 'date-fns'
import UserCardModal from "components/UserCard/";
import './Message.css';

function Message(props: any) {
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
    const avatar = avatars.find((a: any) => a.userId === message.user_id)
    if (avatar) { setSrc(URL.createObjectURL(avatar.src)) }
  }, [avatars])

  const formatTimeSent = (timeSent: number | null) => {
    if (message.time_sent != null)  {
      // first we have to create a new Date object
      // but python date time is in seconds, not milliseconds, so multiply by 1000
      var today = new Date(new Date().setHours(0,0,0,0)); // set "today" to nearest previous midnight
      var updatedTimeSent = new Date(message.time_sent*1000);
      var dayDifference = (today.getTime() - updatedTimeSent.getTime()) / (1000 * 3600 * 24);

      if (dayDifference > 6 ) {
        return format(updatedTimeSent.getTime(), 'eeee MMM do p');
      }
      else if (dayDifference > 1) {
        return format(updatedTimeSent.getTime(), 'eeee p');
      }
      else if (dayDifference > 0) {
        return format(updatedTimeSent.getTime(), "'Yesterday' p");
      }
      return format(updatedTimeSent, "'Today' p");

    }
    return null;
  }

  // const timeSentFormatted = message.time_sent != null ? format(new Date(message.time_sent*1000), 'p') : null;
  const timeSentFormatted = formatTimeSent(message.time_sent);

  return (
  <div className={`flex p-1 items-center ${(index % 2) && 'bg-gray-100 dark:bg-primaryDarkContrast'}`}>
    <UserCardModal open={open} setOpen={setOpen} userId={message.user_id} />
    <div onClick={() => setOpen(true)} className="rounded p-1">
      <img className="rounded object-cover" src={src} alt="Avatar" style={{ height: '32px', width: '32px' }} />
    </div>
    <div className="message-sender ml-1">
      <p><strong className="hover:underline cursor-pointer" onClick={() => setOpen(true)}>{message.username}</strong> <small>{timeSentFormatted}</small></p>
      <p className='message-text'>
        {message.text}
      </p>
    </div>
  </div>
  )
}

export default Message;