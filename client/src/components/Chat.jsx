import { useEffect, useState } from "react";
import ChatMembers from "./ChatMembers";
import ChatMessages from "./ChatMessages";

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState([]);

  const showOnlinePeople = (peopleArray) => {
    const people = {};
    peopleArray.forEach(({ username, userId }) => {
      people[userId] = username;
    });
    console.log(people);
    setOnlinePeople(people);
  };

  const handleMessage = (e) => {
    const messageData = JSON.parse(e.data);
    console.log(messageData);
    if ("online" in messageData) {
      // console.log(messageData.online);
      showOnlinePeople(messageData.online);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("Token");
    const ws = new WebSocket(`ws://localhost:5000?token=${token}`);
    setWs(ws);
    ws.addEventListener("message", handleMessage);

    return () => {
      // Clean up WebSocket connection
      ws.removeEventListener("message", handleMessage);
      ws.close();
    };
  }, []);
  return (
    <div className="flex h-screen w-screen bg-black">
      <div className="bg-white w-1/3">
        <ChatMembers onlinePeople={onlinePeople} />
      </div>
      <div className="bg-blue-200 w-2/3">
        <ChatMessages />
      </div>
    </div>
  );
};

export default Chat;
