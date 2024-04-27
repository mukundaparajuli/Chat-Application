import { useContext, useEffect } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import {
  UserInfoContext,
  UserSelectionContext,
  MessageToDisplayContext,
} from "../contexts/UserInfoContext";
import { useNavigate } from "react-router-dom";

const ChatMembers = (props) => {
  const navigate = useNavigate();
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

  // logout
  const handleLogout = async () => {
    const token = localStorage.getItem("Token");
    try {
      const response = await fetch("http://localhost:5000/api/user/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        localStorage.removeItem("Token");
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedId]);

  return (
    <div className="flex flex-col flex-grow h-full relative">
      <div>
        <Logo />
        {Object.keys(onlinePeople).map((userId) => (
          <div
            onClick={() => setSelectedId(userId)}
            key={userId}
            className={
              "flex gap-2 px-4 items-center p-2 mb-2 m-2 font-semibold text-xl shadow-sm cursor-pointer " +
              (selectedId === userId
                ? "bg-blue-50 border-l-8 border-blue-700 rounded-sm px-4"
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
      <div className="bottom-0 left-0 p-4 w-full h-24 border flex absolute items-center justify-between">
        <div className="flex justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8"
          >
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-bold text-2xl p-3">{userInfo.username}</span>
        </div>
        <div>
          <button
            className="font-bold text-white bg-blue-600 p-2 rounded-md shadow-md"
            onClick={() => handleLogout()}
          >
            LogOut
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatMembers;
