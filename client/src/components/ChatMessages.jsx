import { useContext, useState, useEffect, useRef } from "react";
import {
  MessageToDisplayContext,
  UserInfoContext,
  UserSelectionContext,
} from "../contexts/UserInfoContext";
import { uniqBy } from "lodash";
import axios from "axios";

const ChatMessages = ({ ws }) => {
  // Set the base URL for Axios requests
  axios.defaults.baseURL = "http://localhost:5000";

  // Get context values
  const { selectedId } = useContext(UserSelectionContext);
  const { message, setMessage } = useContext(MessageToDisplayContext);
  const { userInfo } = useContext(UserInfoContext);

  // State for new message text
  const [newMessageText, setNewMessageText] = useState("");

  // Ref for scrolling to bottom
  const messagesEndRef = useRef(null);

  // Function to scroll to the bottom of the chat
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Scroll to bottom when message changes
  useEffect(() => {
    scrollToBottom();
  }, [message]);

  // Function to handle message submission
  const handleMessageSubmit = async (ev, file = null) => {
    if (ev) ev.preventDefault();
    try {
      // Send message via WebSocket
      ws.send(
        JSON.stringify({
          message: {
            recipient: selectedId,
            textMessage: newMessageText,
            file,
          },
        })
      );

      // If a file is attached, fetch updated messages from the server
      if (file) {
        const token = localStorage.getItem("Token");
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
          console.log("Data: ", data);
        }
      } else {
        setMessage((prev) => [
          ...prev,
          {
            sender: userInfo._id,
            recipient: selectedId,
            message: newMessageText,
            file: file ? file.name : null,
            _id: Date.now(),
          },
        ]);
      }
      console.log(message);

      // Clear the input field
      setNewMessageText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Remove duplicate messages
  const messagesWithoutDupes = uniqBy(message, "_id");

  // Function to handle file upload
  const sendFile = (ev) => {
    const reader = new FileReader();
    reader.readAsDataURL(ev.target.files[0]);
    reader.addEventListener("load", () => {
      handleMessageSubmit(null, {
        name: ev.target.files[0].name,
        data: reader.result,
      });
    });
  };

  return (
    <div className="relative flex flex-col h-full">
      <div className="flex-grow">
        {!selectedId && (
          <div className="h-full flex items-center justify-center text-lg text-slate-600">
            &larr; No User Selected
          </div>
        )}
      </div>
      {!!selectedId && (
        <div className="overflow-y-auto flex-grow">
          {messagesWithoutDupes.map((messageItem, index) => {
            if (
              (messageItem.sender === userInfo._id ||
                messageItem.recipient === userInfo._id) &&
              (messageItem.sender === selectedId ||
                messageItem.recipient === selectedId)
            ) {
              const isMessageMine = messageItem.sender === userInfo._id;
              const messageClass = isMessageMine
                ? "flex justify-end"
                : "flex justify-start";
              const messageColor = isMessageMine
                ? "bg-blue-500 text-white"
                : "bg-gray-700 text-white";

              return (
                <div key={index} className={messageClass}>
                  <div className={`${messageColor} rounded-lg p-3 m-2`}>
                    <p className="text-lg">{messageItem.message}</p>
                    <p>Recipient: {messageItem.recipient}</p>
                    <p>Sender: {messageItem.sender}</p>
                    {messageItem.file && (
                      <div className="">
                        <a
                          target="_blank"
                          className="flex items-center gap-1 border-b"
                          href={
                            axios.defaults.baseURL +
                            "/uploads/" +
                            messageItem.file
                          } // Construct the URL manually
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4"
                          >
                            <path
                              fillRule="evenodd"
                              d="M18.97 3.659a2.25 2.25 0 00-3.182 0l-10.94 10.94a3.75 3.75 0 105.304 5.303l7.693-7.693a.75.75 0 011.06 1.06l-7.693 7.693a5.25 5.25 0 11-7.424-7.424l10.939-10.94a3.75 3.75 0 115.303 5.304L9.097 18.835l-.008.008-.007.007-.002.002-.003.002A2.25 2.25 0 015.91 15.66l7.81-7.81a.75.75 0 011.061 1.06l-7.81 7.81a.75.75 0 001.054 1.068L18.97 6.84a2.25 2.25 0 000-3.182z"
                              clipRule="evenodd"
                            />
                          </svg>
                          {messageItem.file}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            } else {
              return null;
            }
          })}
          <div ref={messagesEndRef} /> {/* Empty div for scrolling to bottom */}
        </div>
      )}
      {!!selectedId && (
        <form onSubmit={handleMessageSubmit} className="mb-4">
          <div className=" bottom-0 left-0 right-0 p-2 flex items-center">
            <input
              type="text"
              name="message"
              id="message"
              value={newMessageText}
              onChange={(ev) => setNewMessageText(ev.target.value)}
              className="p-2 w-full border bg-white text-slate-800 rounded-md"
              placeholder="Your message here"
            />
            <label
              htmlFor="file"
              className="text-white bg-blue-500 p-2 rounded-md ml-2"
            >
              <input
                type="file"
                name="file"
                id="file"
                className="hidden"
                onChange={sendFile}
              />
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
                  d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                />
              </svg>
            </label>
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
