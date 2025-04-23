import React, { useEffect } from 'react';
import Icons from "./Icons";
import "./msg.css";

const Message = ({ status, setStatus }) => {


  const Exit = () => {
    setStatus({ show: false, msg: ""});
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setStatus({ show: false, msg: ""});
    }, 3000);
    return () => clearTimeout(timeout);
  } ,[setStatus]);

  return (
    <div className='message-overlay' >
       <div id='msg-container' >
        <div className='msg'><Icons name={"message"} /> <p>{status.msg}</p> </div> <div className='exit-icon' onClick={ () => Exit()}><Icons name={"X"} className={"icon"}/></div>
    </div>
    </div>
   
  )
}

export default Message