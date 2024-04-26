import React from "react";

const Avatar = ({ username, userId, online }) => {
  console.log(username);
  const colors = [
    "bg-red-200",
    "bg-blue-200",
    "bg-teal-200",
    "bg-purple-200",
    "bg-yellow-200",
  ];

  // Alternative color selection method using a hash function
  const hashCode = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
  };

  const colorIndex = Math.abs(hashCode(userId)) % colors.length;
  const color = colors[colorIndex];

  return (
    <div>
      <div
        className={
          " relative h-10 w-10 rounded-full border flex justify-center items-center text-md font-semibold " +
          color
        }
      >
        {username[0].toUpperCase()}
        {online && (
          <div className="absolute w-3 h-3 bottom-0 right-0 bg-green-400  rounded-full border border-white"></div>
        )}
        {!online && (
          <div className="absolute w-3 h-3 bg-gray-400 bottom-0 right-0 rounded-full border border-white"></div>
        )}
      </div>
    </div>
  );
};

export default Avatar;
