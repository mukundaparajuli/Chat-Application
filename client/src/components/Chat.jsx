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
  const [offlinePeople, setOfflinePeople] = useState({});
  const { setMessage } = useContext(MessageToDisplayContext);
  const { userInfo } = useContext(UserInfoContext);
  const { selectedId } = useContext(UserSelectionContext);

  const showOnlinePeople = (peopleArray) => {
    const people = {};
    peopleArray.forEach(({ username, userId }) => {
      people[userId] = username;
    });
    const onlinePeopleExcludingUser = { ...people };
    delete onlinePeopleExcludingUser[userInfo._id];
    setOnlinePeople(onlinePeopleExcludingUser);
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
          _id: Date.now(),
        },
      ]);
    }
  };

  const showOfflinePeople = async () => {
    const token = localStorage.getItem("Token");
    try {
      const response = await fetch("http://localhost:5000/api/user/people", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const offlineUsers = data
          .filter((p) => p._id !== userInfo._id)
          .filter((p) => !Object.keys(onlinePeople).includes(p._id));
        console.log(offlineUsers);
        const offlinePeople = {};
        offlineUsers.forEach((p) => (offlinePeople[p._id] = p));
        setOfflinePeople(offlinePeople);
        console.log(offlinePeople);
      }
    } catch (err) {
      console.log("An error has encountered fetching users: ", err);
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
    showOfflinePeople();
  }, [onlinePeople]);

  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);

  const handleConnectionClose = () => {
    console.log("WebSocket connection closed");
  };

  const handleConnectionError = (error) => {
    console.error("WebSocket error:", error);
  };

  return (
    <div className="flex h-screen w-screen bg-black">
      <div className="bg-white w-1/3 h-[100vh]">
        <ChatMembers
          onlinePeople={onlinePeople}
          offlinePeople={offlinePeople}
        />
      </div>
      <div className="bg-blue-200 w-2/3">
        <ChatMessages ws={ws} />
      </div>
    </div>
  );
};

export default Chat;
