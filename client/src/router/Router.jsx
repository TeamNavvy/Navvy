import { Routes, Route } from "react-router-dom";
import { UserProvider } from "../components//UserContext";
import { Login } from "../components/pages/Login";
import { Home } from "../components//pages/Home";
import { ProtectedRoute } from "..//components/ProtectedRoute";
import { Mypage } from "../components//pages/Mypage";
import { Register } from "../components//pages/Register";

export const Router = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/myPage"
          element={
            <ProtectedRoute>
              <Mypage />
            </ProtectedRoute>
          }
        />
        {/* <Route path="*" element={<Page404 />} /> */}
      </Routes>
    </UserProvider>
  );
};
