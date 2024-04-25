import { useContext, useEffect, useState, useCallback } from "react";
import ChatMembers from "./ChatMembers";
import ChatMessages from "./ChatMessages";
import {
  MessageToDisplayContext,
  UserInfoContext,
  UserSelectionContext,
} from "../contexts/UserInfoContext";

const Chat = () => {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const { setMessage } = useContext(MessageToDisplayContext);
  const { userInfo } = useContext(UserInfoContext);
  const { selectedId } = useContext(UserSelectionContext);

  const showOnlinePeople = (peopleArray) => {
    const people = {};
    peopleArray.forEach(({ username, userId }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  };

  const handleMessage = (ev) => {
    const messageData = JSON.parse(ev.data);
    if ("online" in messageData) {
      showOnlinePeople(messageData.online);
    } else if ("message" in messageData) {
      setMessage((prev) => [
        ...prev,
        {
          message: messageData.message[0].message.textMessage,
          sender: messageData.sender,
          recipient: messageData.recipient,
          // myId: userInfo._id,
          _id: Date.now(),
        },
      ]);
    }
  };

  const connect = useCallback(() => {
    const token = localStorage.getItem("Token");
    const newWs = new WebSocket(`ws://localhost:5000?token=${token}`);
    setWs(newWs);

    newWs.addEventListener("message", handleMessage);
    newWs.addEventListener("close", handleConnectionClose);
    newWs.addEventListener("error", handleConnectionError);

    return () => {
      newWs.close();
    };
  }, []);

  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);
  // const fetchMessages = async () => {
  //   console.log(selectedId);
  //   const token = localStorage.getItem("Token");
  //   try {
  //     const response = await fetch(
  //       `http://localhost:5000/api/messages/${selectedId}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     // console.log(response);
  //     if (response.ok) {
  //       const data = await response.json();
  //       setMessage(data);
  //       console.log(data);
  //     } else {
  //       console.log(response);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   console.log(selectedId);
  //   fetchMessages();
  // }, [selectedId]);

  const handleConnectionClose = () => {
    // Handle WebSocket connection close
    console.log("WebSocket connection closed");
  };

  const handleConnectionError = (error) => {
    // Handle WebSocket connection error
    console.error("WebSocket error:", error);
  };

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
