import { useUser } from "./UserContext";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  const { user } = useUser();
  if (!user) {
    return <Navigate to="/" />;
  }
  return children;
};
