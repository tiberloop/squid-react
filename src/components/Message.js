import React, { useState } from "react";
import axios from "axios";

function Message(props) {
  const { message, index } = props
  const [src, setSrc] = useState('')

  axios.get(`/avatar/6576996505964455225`).then(res => {
    console.log(res.data)
    setSrc(res.data)
  })

  return (
  <div className={`p-1 ${(index % 2) && 'bg-gray-100'}`}>
    {/* <div className="bg-green-300" style={{ height: '32px', width: '32px' }}></div> */}
    <img src={src} style={{ height: '32px', width: '32px' }} />
    <p>
      {message.text}
    </p>
  </div>
  )
}

export default Message;