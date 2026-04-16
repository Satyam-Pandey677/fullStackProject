import { useEffect, useState } from 'react'
import {io} from "socket.io-client";
import './App.css'
const socket = io("http://localhost:5000",{
  autoConnect:false
});

function App() {
  const [time, setTime] = useState(0);
  
  useEffect(() =>{

    socket.connect();

  socket.on("connection", () => {
    console.log("connected", socket.id);
  })

  socket.emit("message", "hello Server")

  socket.on("reply", (data)=>{
    console.log(data)
  })

  socket.on("countdown", (t) => {
      setTime(t);
    })
  },[])

  const start = () =>{
    socket.emit("startTimer",20);
    console.log("clicked")
  }

  const safeTimer = Math.max(0, time) 
  const sec = Math.floor(safeTimer/1000)%60;
  const min = Math.floor(safeTimer/(1000*60))

  return (
    <div>
      hello

      <h1>{min}:{sec}</h1>
      <button onClick={start}>Start</button>
    </div>
  )
}

export default App
