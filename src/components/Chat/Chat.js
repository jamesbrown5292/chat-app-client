import React, { useState, useEffect } from 'react';
import queryString from 'query-string';
import './Chat.css'
import TextContainer from '../TextContainer/TextContainer';
import InfoBar from '../InfoBar/InfoBar'
import Input from '../Input/Input'
import Messages from '../Messages/Messages'

let socket;

const Chat = ({ location }) => {
  
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [users, setUsers] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  
  const ENDPOINT = 'http://localhost:3001'// example

  // socket = new WebSocket(pass in url - ws:// )
  // socket. (send, onmessage)

  // 

  useEffect(() => {
    const {name, room} = queryString.parse(location.search);
    // socket = io(ENDPOINT, {
    //   path: '/chat/'
    // })

    // New approach to establish WebSocket
    socket = new WebSocket('ws://localhost:3001/chat')
    console.log("socket est.", socket)
    setName(name)
    setRoom(room)


    // socket.emit('join', { name, room }, (error) => {
    //   if (error) alert(error);
    // });
    // Question
    socket.onopen = function(event) {

      socket.send(JSON.stringify({type: 'join', payload: "Client connected"}))

    };


    // return () => {
    //   socket.emit('disconnect');
    //   socket.off();
    // }

    socket.onclose = function(event) {
      console.log("server disconnected")
    }

  }, [ENDPOINT, location.search]);

  useEffect(() => {

    // socket.onmessage = function(event) {
    //   console.log("event received from ws", event)
    // }

    socket.onmessage = message => {
      console.log("received pre parse", message)
      const data = JSON.parse(message.data);
      console.log("data received", data)
      console.log("emessage received", message.data)
      if (data.type === 'join') { /* do something */ }
      if (data.type === 'leave') { /* do something */ }
      if (data.type === 'message') {
        setMessages([...messages, data.payload]);
      }
      if (data.type === 'friend-request') { /* do something */ }
    };

    // socket.on('message', (message) => {
    //   setMessages([...messages, message]);
    // })

    // socket.on('roomData', ( {users}) => {
    //   setUsers(users);
    // })

  }, [messages])

  // function for sending messages
  const sendMessage = (event) => {
    event.preventDefault();
    if(message) {
      const msg = {type: 'message', payload: message}
      socket.send(JSON.stringify(msg));
      setMessage('')
    }
  }

  console.log(message, messages)

  return(
    <div className="outerContainer">
      <div className="container">
        <InfoBar room={room} />
        <Messages messages={messages} name={name}/>
        <Input 
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
      <TextContainer users={users} />
    </div>
  )
}

export default Chat