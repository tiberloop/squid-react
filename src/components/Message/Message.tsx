import React, { useEffect, useState } from "react";
import { useStore } from 'store/reactive'
import axios from "axios";
import { format } from 'date-fns'
import { ISquidMessage } from "utils/apiObjects";
import { getImageUpload } from "utils/apiHelper";
import UserCardModal from "components/UserCard/";
import './Message.css';

interface IMessageProps  {
  message: ISquidMessage,
  index: number
}
function Message(props: IMessageProps) {
  const { message, index } = props
  
  const [src, setSrc] = useState('https://res.cloudinary.com/dk-find-out/image/upload/q_70,c_pad,w_1200,h_630,f_auto/DCTM_Penguin_UK_DK_AL639403_k3qity.jpg')
  const [open, setOpen] = useState(false)
  const [img, setImg] = useState('');

  useEffect(() => {
    // if (message.image_id) {
    //   getImageUpload(message.image_id).then(
    //     response => {
    //       // debugger;
    //       console.log(response);
    //     }
    //   )
    // }
  }, [])
  // if (index === 1) {
  //     axios.get(`/uploads/${message.avatar_id}`, { responseType: "blob" }).then(res => {
  //     const srcurl = URL.createObjectURL(res.data)
  //     setSrc(srcurl)
  //   })
  // }
  const [avatars, setAvatars] = useStore('avatars')


  useEffect(() => {
    if (message.image_id !== 'None' && message.image_id) {
      axios.get(`/uploads/${message.image_id}`, { responseType: "blob" })
        .then(res => {
          setImg(URL.createObjectURL(res.data))
        })
    }
  }, [message.image_id])

  useEffect(() => {
    const avatar = avatars.find((a: any) => a.userId === message.user_id)
    if (avatar) {
      setSrc(URL.createObjectURL(avatar.src))
    }
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
  <div className={`flex p-1 ${(index % 2) && 'bg-gray-100 dark:bg-primaryDarkContrast'}`}>
    <UserCardModal open={open} setOpen={setOpen} userId={message.user_id} />
    <div className="h-full flex-shrink-0">
      <div onClick={() => setOpen(true)} className="hover:border-white border border-transparent cursor-pointer rounded">
        <img className="rounded object-cover" src={src} alt="Avatar" style={{ height: '32px', width: '32px' }} />
      </div>
    </div>
    <div className="message-sender ml-1">
      <p><strong className="hover:underline cursor-pointer" onClick={() => setOpen(true)}>{message.username}</strong> <small>{timeSentFormatted}</small></p>
      <p className='message-text'>
        {message.text}
      </p>
      {img && <img alt="attachment" src={img}/>}
    </div>
  </div>
  )
}

export default Message;