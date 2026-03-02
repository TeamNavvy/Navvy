import { Routes, Route } from "react-router-dom";
import { UserProvider } from "../UserContext";
import { Login } from "../pages/Login";
import { Home } from "../pages/Home";
import { ProtectedRoute } from "../ProtectedRoute";
import { Mypage } from "../pages/Mypage";
import { Register } from "../pages/Register";

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
