import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import RPlaceClone from "./Place";

const socket = io("http://localhost:3000");

function App() {
  const [messages, setMessages] = useState<
    | {
        message: string;
        user: string;
        timestamp: number;
      }[]
    | []
  >([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.connect();
    socket.on("message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("disconnect");
    };
  }, []);

  const handlePixelClick = (index: number, color: string) => {
    socket.emit("place", { index, color });
  };

  const sendMessage = () => {
    socket.emit("message", {
      message,
      user: socket.id,
      timestamp: Date.now(),
    });
  };

  return (
    <>
      <RPlaceClone handlePixelClickSocket={handlePixelClick} socket={socket}/>
      {messages.map((msg, index) => (
        <div key={index}>
          {msg.user}: {msg.message}
        </div>
      ))}
      <h1>Chat</h1>
      <input
        type="text"
        onChange={(e) => {
          setMessage(e.target.value);
        }}
      />
      <button onClick={sendMessage}>Send</button>
    </>
  );
}

export default App;
