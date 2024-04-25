import { useContext, useEffect } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import {
  UserInfoContext,
  UserSelectionContext,
  MessageToDisplayContext,
} from "../contexts/UserInfoContext";

const ChatMembers = (props) => {
  const { onlinePeople } = props;
  const { message, setMessage } = useContext(MessageToDisplayContext);
  const { userInfo } = useContext(UserInfoContext);
  console.log(onlinePeople);
  const { selectedId, setSelectedId } = useContext(UserSelectionContext);
  const onlinePeopleExcludingUser = { ...onlinePeople };
  delete onlinePeopleExcludingUser[userInfo._id];
  console.log(userInfo._id);
  console.log(onlinePeopleExcludingUser[userInfo._id]);
  console.log(onlinePeopleExcludingUser);
  const fetchMessages = async () => {
    console.log("SelectedId", selectedId);
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
      // console.log(response);
      if (response.ok) {
        const data = await response.json();
        setMessage(data);
        console.log(data);
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
      {onlinePeople &&
        Object.keys(onlinePeopleExcludingUser).map((userId) => (
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
            <Avatar username={onlinePeople[userId]} userId={userId} />
            <div className="">{onlinePeople[userId]}</div>
          </div>
        ))}
    </div>
  );
};

export default ChatMembers;
