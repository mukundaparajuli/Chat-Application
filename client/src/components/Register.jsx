import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    username: "",
    password: "",
  });
  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });
      if (response.ok) {
        const result = await response.json();
        console.log(result);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="w-full h-full flex justify-center items-center ">
      <form className="w-96 h-auto  border-2 py-12 p-8 m-8 bg-slate-600 rounded-xl">
        <h1 className="text-start font-semibold text-4xl text-white mb-6">
          Register
        </h1>
        <input
          type="email"
          name="email"
          id="email"
          className="w-full p-2 mb-4 border-2 rounded-md text-lg active:border-blue-400"
          placeholder="Email"
          value={user.email}
          onChange={handleChange}
        />
        <input
          type="text"
          name="username"
          id="username"
          className="w-full p-2 mb-4 border-2 rounded-md text-lg active:border-blue-400"
          placeholder="Username"
          value={user.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          id="password"
          className="w-full p-2 mb-8 border-2 rounded-md text-lg active:border-blue-400"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
        />
        <button
          className="w-full bg-blue-500 font-bold p-2 mb-8 text-white text-xl hover:bg-blue-700"
          onClick={handleRegisterUser}
        >
          Register
        </button>
        <p className="font-md text-white ">
          Already Registered?{" "}
          <span
            className="italics text-red-500 hover:text-red-700 cursor-pointer"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};
