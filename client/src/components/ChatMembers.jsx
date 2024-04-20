import { useContext, useState } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import {
  UserInfoContext,
  UserSelectionContext,
} from "../contexts/UserInfoContext";

const ChatMembers = (props) => {
  const { onlinePeople } = props;
  const { userInfo } = useContext(UserInfoContext);
  console.log(onlinePeople);
  const { selectedId, setSelectedId } = useContext(UserSelectionContext);
  const onlinePeopleExcludingUser = { ...onlinePeople };
  delete onlinePeopleExcludingUser[userInfo._id];
  console.log(userInfo._id);
  console.log(onlinePeopleExcludingUser[userInfo._id]);
  console.log(onlinePeopleExcludingUser);
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
              (selectedId === userId ? "bg-blue-50" : "")
            }
          >
            {/* <Avatar username={onlinePeople[userId]} userId={userId} /> */}
            <div className="">{onlinePeople[userId]}</div>
          </div>
        ))}
    </div>
  );
};

export default ChatMembers;
