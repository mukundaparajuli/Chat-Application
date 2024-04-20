import "./App.css";
import { Register } from "./components/Register";
import { Login } from "./components/Login";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import {
  UserInfoContext,
  UserSelectionContext,
} from "./contexts/UserInfoContext";
import { useState } from "react";
import Chat from "./components/Chat";
import ProtectedRoutes from "./utils/ProtectedRoutes";

function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const router = createBrowserRouter([
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoutes>
          <Chat />
        </ProtectedRoutes>
      ),
    },
  ]);
  return (
    <div>
      <UserInfoContext.Provider value={{ userInfo, setUserInfo }}>
        <UserSelectionContext.Provider value={{ selectedId, setSelectedId }}>
          <RouterProvider router={router} />
        </UserSelectionContext.Provider>
      </UserInfoContext.Provider>
    </div>
  );
}

export default App;
