import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/user/login", {
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
      console.log("Error occured while loggin in a user: ", error);
    }
  };
  return (
    <div className="w-full h-full flex justify-center items-center ">
      <form
        onSubmit={() => {}}
        className="w-96 h-auto  border-2 py-12 p-8 m-8 bg-slate-600 rounded-xl"
      >
        <h1 className="text-start text-4xl text-white mb-6">Login</h1>
        <input
          type="text"
          name="username"
          id="username"
          className="w-full p-2 mb-4 border-2 rounded-md text-xl active:border-blue-400"
          placeholder="Username"
          value={user.username}
          onChange={handleChange}
        />
        <input
          type="password"
          name="password"
          id="password"
          className="w-full p-2 mb-4 border-2 rounded-md text-xl active:border-blue-400"
          placeholder="Password"
          value={user.password}
          onChange={handleChange}
        />
        <button
          className="w-full bg-blue-500 p-2 my-8 text-white text-xl hover:bg-blue-799"
          onClick={handleLogin}
        >
          Register
        </button>
        <p className="font-md text-white ">
          Not Registered Yet?{" "}
          <span
            className="italics text-red-500 hover:text-red-700 cursor-pointer"
            onClick={() => navigate("/register")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
};
