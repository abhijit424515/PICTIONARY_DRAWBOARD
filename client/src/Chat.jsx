import { useState } from "react"
import io from "socket.io-client"
const server = "http://localhost:5001";

const socket = io(server)

function ChatBubble({name, msg}){
  return (
    <div className="flex flex-row">
      <span>{name}</span>
      <span>{msg}</span>
    </div>
  )
}

export default function App() {
  const [chats, setChats] = useState(["hello", "world", "history"]);
  const [msg,setMsg] = useState("");
  function sendMessage(msg){
    setChats(chats.concat(msg));
    console.log(chats)
    socket.emit('chat', msg)
    setMsg("")
  }
  socket.on('chat', message => {
    setChats(chats.concat(message));
  })
  const bubbles = chats.map((item)=> <ChatBubble name="a" msg={item} />);
  return (<>
    <div className="w-[50vw] h-[50vh] bg-blue-700 p-4">
      <div className="h-4/5 w-full bg-red-700 chat-content">
        {bubbles}
      </div>
      <input placeholder="Type here" value={msg} onChange={(event) => {setMsg(event.target.value)}} onKeyPress={(event) => {
        if (event.key === 'Enter'){
          sendMessage(msg);
        }
      }}/>

    </div>
  </>
  )
}
