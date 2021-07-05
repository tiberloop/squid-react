import React, { useState } from "react";
import axios from "axios";

function Message(props) {
  const { message, index } = props
  const [src, setSrc] = useState('https://res.cloudinary.com/dk-find-out/image/upload/q_70,c_pad,w_1200,h_630,f_auto/DCTM_Penguin_UK_DK_AL639403_k3qity.jpg')

  // if (index === 1 ) {
  //     axios.get("/uploads/squidimage.jpg").then(res => {
  //     console.log('image', res.data)
  //     setSrc(res.data)
  //   })
  // }

  return (
  <div className={`flex p-1 ${(index % 2) && 'bg-gray-100'}`}>
    {/* <div className="bg-green-300" style={{ height: '32px', width: '32px' }}></div> */}
    <div>
      <img src={src} alt="Avatar" style={{ height: '32px', width: '32px' }} />
    </div>
    <div className="ml-1">
      <p><strong>{message.username}</strong> <i>{message.time_sent}</i></p>
      <p>
        {message.text}
      </p>
    </div>
  </div>
  )
}

export default Message;