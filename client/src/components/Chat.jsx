import { useContext, useEffect, useState } from "react";
import ChatMembers from "./ChatMembers";
import ChatMessages from "./ChatMessages";
import { MessageToDisplayContext } from "../contexts/UserInfoContext";

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const { setMessage } = useContext(MessageToDisplayContext);

  const showOnlinePeople = (peopleArray) => {
    const people = {};
    peopleArray.forEach(({ username, userId }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  };

  useEffect(() => {
    const token = localStorage.getItem("Token");
    const ws = new WebSocket(`ws://localhost:5000?token=${token}`);
    setWs(ws);

    ws.onopen = () => {
      console.log("WebSocket connected");
    };
    ws.addEventListener("message", (ev) => {
      const messageData = JSON.parse(ev.data);
      console.log({ messageData, ev });
      console.log(messageData.message);
      if ("online" in messageData) {
        showOnlinePeople(messageData.online);
      } else if ("message" in messageData) {
        console.log(
          "Received message:",
          messageData.message[0].message.textMessage
        );
        setMessage((prev) => [
          ...prev,
          {
            text: messageData.message[0].message.textMessage,
            isMsgOurs: false, // This should be false for received messages
          },
        ]);
        // Handle incoming message (messageData.messageData contains the actual message)
      } else {
        console.error("Received unexpected message:", messageData);
      }
    });

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Clean up WebSocket connection
    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="flex h-screen w-screen bg-black">
      <div className="bg-white w-1/3">
        <ChatMembers onlinePeople={onlinePeople} />
      </div>
      <div className="bg-blue-200 w-2/3">
        <ChatMessages ws={ws} />
      </div>
    </div>
  );
};

export default Chat;
