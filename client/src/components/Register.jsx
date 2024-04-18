export const Register = () => {
  return (
    <div className="w-full h-full flex justify-center items-center ">
      <form
        onSubmit={() => {}}
        className="w-96 h-96  border-2 py-12 p-8 m-8 bg-slate-600 rounded-xl"
      >
        <input
          type="email"
          name="email"
          id="email"
          className="w-full p-2 mb-4 border-2 rounded-md font-semibold text-xl active:border-blue-400"
          placeholder="Email"
        />
        <input
          type="text"
          name="username"
          id="username"
          className="w-full p-2 mb-4 border-2 rounded-md font-semibold text-xl active:border-blue-400"
          placeholder="Username"
        />
        <input
          type="password"
          name="password"
          id="password"
          className="w-full p-2 mb-8 border-2 rounded-md font-semibold text-xl active:border-blue-400"
          placeholder="Password"
        />
        <button className="w-full bg-blue-500 p-2 mb-8 font-semibold text-white text-xl hover:bg-blue-799">
          Register
        </button>
        <p className="font-md text-white ">
          Already Registered?{" "}
          <span className="italics text-red-500 hover:text-red-700">Login</span>
        </p>
      </form>
    </div>
  );
};
