import { useContext } from "react";
import { UserSelectionContext } from "../contexts/UserInfoContext";

const ChatMessages = () => {
  const { selectedId } = useContext(UserSelectionContext);
  return (
    <div className="flex flex-col flex-grow h-screen ">
      {!selectedId && (
        <div className="h-full flex items-center justify-center text-lg text-slate-600">
          &larr; No User Selected
        </div>
      )}
      <div className="flex items-center gap-2 mx-2 ">
        <input
          type="text"
          name="message"
          id="message"
          className="p-2 m-2 w-5/6 border flex flex-grow bg-white text-slate-800 rounded-md"
          placeholder="Your message here"
        />
        <button className="text-white bg-blue-500 p-2 m-2 rounded-md">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ChatMessages;
