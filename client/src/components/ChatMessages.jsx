import { useContext, useState, useEffect, useRef } from "react";
import {
  MessageToDisplayContext,
  UserInfoContext,
  UserSelectionContext,
} from "../contexts/UserInfoContext";
import { uniqBy } from "lodash";

const ChatMessages = ({ ws }) => {
  const { selectedId } = useContext(UserSelectionContext);
  const [newMessageText, setNewMessageText] = useState("");
  const { message, setMessage } = useContext(MessageToDisplayContext);
  const { userInfo } = useContext(UserInfoContext);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [message]);

  const handleMessageSubmit = (ev, file = null) => {
    if (ev) ev.preventDefault();
    // if (newMessageText.trim() !== "") {
    // if (ws.readyState === WebSocket.OPEN) {
    ws.send(
      JSON.stringify({
        message: {
          recipient: selectedId,
          textMessage: newMessageText,
          file,
        },
      })
    );
    if (file) {
      const getMessage = async () => {
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
            console.log(data);
          }
        } catch (err) {
          console.log(err);
        }
      };
      getMessage();
    }
    setMessage((prev) => [
      ...prev,
      {
        message: newMessageText,
        sender: userInfo._id,
        recipient: selectedId,
        _id: Date.now(),
      },
    ]);
    setNewMessageText("");
    // } else {
    //   console.error("WebSocket is not open!");
    // }
    // } else {
    // console.error("Message text is empty!");
    // }
  };

  const messagesWithoutDupes = uniqBy(message, "_id");

  const sendFile = (ev) => {
    const reader = new FileReader();
    console.log(reader);
    reader.readAsDataURL(ev.target.files[0]);
    reader.onload = () => {
      handleMessageSubmit(null, {
        name: ev.target.files[0].name,
        data: reader.result,
      });
    };
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
      {console.log(message)}
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
                    {/* <p>My Id: {messageItem._id}</p> */}
                  </div>
                </div>
              );
            } else {
              return null;
            }
          })}
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
