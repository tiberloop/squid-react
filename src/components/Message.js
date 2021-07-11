import React, { useState } from "react";
import axios from "axios";
import { format } from 'date-fns'

function Message(props) {
  const { message, index } = props
  const [src, setSrc] = useState('https://res.cloudinary.com/dk-find-out/image/upload/q_70,c_pad,w_1200,h_630,f_auto/DCTM_Penguin_UK_DK_AL639403_k3qity.jpg')

  // if (index === 1) {
  //     axios.get(`/uploads/${message.avatar_id}`, { responseType: "blob" }).then(res => {
  //     const srcurl = URL.createObjectURL(res.data)
  //     setSrc(srcurl)
  //   })
  // }

  const timeSentFormatted = format(new Date(message.time_sent), 'p')

  return (
  <div className={`flex p-1 ${(index % 2) && 'bg-gray-100'}`}>
    {/* <div className="bg-green-300" style={{ height: '32px', width: '32px' }}></div> */}
    <div className="bg-gray-200 rounded">
      <img src={src} alt="Avatar" style={{ height: '32px', width: '32px' }} />
    </div>
    <div className="ml-1">
      <p><strong>{message.username}</strong> <i>{timeSentFormatted}</i></p>
      <p>
        {message.text}
      </p>
    </div>
  </div>
  )
}

export default Message;