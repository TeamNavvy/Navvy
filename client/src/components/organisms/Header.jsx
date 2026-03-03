import axios from "axios";
import { useUser } from "../UserContext";
import { useNavigate } from "react-router-dom";

export const Header = () => {
  const { user, setUser } = useUser();
  let navigate = useNavigate();

  const onClickToMyPage = () => {
    navigate("/myPage");
  };

  const onClickToHome = () => {
    navigate("/home");
  };

  const handleLogout = async () => {
    await axios.post("/api/logout");
    setUser(null);
    navigate("/");
  };
};
