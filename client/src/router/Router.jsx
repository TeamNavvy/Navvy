import { Routes, Route } from "react-router-dom";
import { UserProvider } from "../UserContext";
import { Login } from "../pages/Login";
import { Home } from "../pages/Home";
import { ProtectedRoute } from "../ProtectedRoute";

export const Router = () => {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        {/* <Route path="*" element={<Page404 />} /> */}
      </Routes>
    </UserProvider>
  );
};
