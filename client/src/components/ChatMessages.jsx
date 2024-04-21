import { useContext, useState } from "react";
import {
  MessageToDisplayContext,
  UserSelectionContext,
} from "../contexts/UserInfoContext";
import { uniqBy } from "lodash";
const ChatMessages = ({ ws }) => {
  const { selectedId } = useContext(UserSelectionContext);
  const [newMessageText, setNewMessageText] = useState("");
  const { message, setMessage } = useContext(MessageToDisplayContext);

  const handleMessageSubmit = (ev) => {
    ev.preventDefault();
    // Check if the message is not empty
    if (newMessageText.trim() !== "") {
      // Check if the WebSocket connection is open
      if (ws.readyState === WebSocket.OPEN) {
        // Send the message
        console.log("sending...");
        ws.send(
          JSON.stringify({
            message: {
              recipient: selectedId,
              textMessage: newMessageText,
            },
          })
        );
        setMessage((prev) => [
          ...prev,
          { text: newMessageText, isMsgOurs: true },
        ]); // Store message text and flag
        console.log("Sent message:", newMessageText);

        // Clear the input after sending the message
        setNewMessageText("");
      } else {
        console.error("WebSocket is not open!");
      }
    } else {
      console.error("Message text is empty!");
    }
  };
  const messagesWithoutDups = uniqBy(message, "id");
  return (
    <div className="relative flex flex-col h-screen">
      <div className="flex-grow">
        {!selectedId && (
          <div className="h-full flex items-center justify-center text-lg text-slate-600">
            &larr; No User Selected
          </div>
        )}
      </div>
      {/* {!!selectedId && ( */}
      <div>
        {messagesWithoutDups.map((messageItem, index) => (
          <div
            key={index}
            className={messageItem.isMsgOurs ? "text-right" : "text-left"}
          >
            {console.log(messageItem.isMsgOurs)}
            {messageItem.text}
          </div>
        ))}
      </div>
      {/* )} */}
      {!!selectedId && (
        <form onSubmit={handleMessageSubmit}>
          <div className="bottom-0 left-0 right-0 p-2 flex items-center">
            <input
              type="text"
              name="message"
              id="message"
              value={newMessageText}
              onChange={(ev) => setNewMessageText(ev.target.value)}
              className="p-2 w-full border bg-white text-slate-800 rounded-md"
              placeholder="Your message here"
            />
            <button
              type="submit"
              className="text-white bg-blue-500 p-2 rounded-md ml-2"
            >
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
        </form>
      )}
    </div>
  );
};

export default ChatMessages;
