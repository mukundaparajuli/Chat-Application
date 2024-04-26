import { useContext, useEffect } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import {
  UserInfoContext,
  UserSelectionContext,
  MessageToDisplayContext,
} from "../contexts/UserInfoContext";

const ChatMembers = (props) => {
  const { onlinePeople, offlinePeople } = props;
  const { message, setMessage } = useContext(MessageToDisplayContext);
  const { userInfo } = useContext(UserInfoContext);
  const { selectedId, setSelectedId } = useContext(UserSelectionContext);

  const fetchMessages = async () => {
    const token = localStorage.getItem("Token");
    try {
      const response = await fetch(
        `http://localhost:5000/api/messages/${selectedId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setMessage(data);
      } else {
        console.log(response);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedId]);

  return (
    <div>
      <Logo />
      {Object.keys(onlinePeople).map((userId) => (
        <div
          onClick={() => setSelectedId(userId)}
          key={userId}
          className={
            "flex gap-2 px-4 items-center p-2 mb-2 m-2 font-semibold text-xl shadow-sm cursor-pointer " +
            (selectedId === userId
              ? "bg-blue-50 border-l-8 border-blue-700 rounded-sm"
              : "")
          }
        >
          <Avatar
            username={onlinePeople[userId]}
            userId={userId}
            online={true}
          />
          <div className="">{onlinePeople[userId]}</div>
        </div>
      ))}
      {Object.keys(offlinePeople).map((userId) => (
        <div
          onClick={() => setSelectedId(userId)}
          key={userId}
          className={
            "flex gap-2 px-4 items-center p-2 mb-2 m-2 font-semibold text-xl shadow-sm cursor-pointer " +
            (selectedId === userId
              ? "bg-blue-50 border-l-8 border-blue-700 rounded-sm"
              : "")
          }
        >
          <Avatar
            username={offlinePeople[userId].username}
            userId={userId}
            online={false}
          />
          <div className="">{offlinePeople[userId].username}</div>{" "}
        </div>
      ))}
    </div>
  );
};

export default ChatMembers;
