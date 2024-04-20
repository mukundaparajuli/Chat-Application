import { useContext, useEffect } from "react";
import { Login } from "../components/Login";
import { useNavigate } from "react-router-dom";
import { UserInfoContext } from "../contexts/UserInfoContext";
import Chat from "../components/Chat";

const ProtectedRoutes = () => {
  const navigate = useNavigate();
  const userInfo = useContext(UserInfoContext);
  console.log(userInfo);

  useEffect(() => {
    console.log(userInfo.userInfo);
    if (!userInfo) {
      navigate("/login");
    }
  }, []);

  return userInfo && userInfo.userInfo ? <Chat /> : <Login />;
};

export default ProtectedRoutes;
