import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppDispatch } from "./store/hooks";
import { checkSession } from "./store/authSlice";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BlogList from "./pages/BlogList";
import ProtectedRoute from "./components/ProtectedRoute";
import "./App.css";

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/blogs" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/blogs"
        element={
          <ProtectedRoute>
            <BlogList />
          </ProtectedRoute>
        }
      />
      {/* More blog routes will be added later */}
    </Routes>
  );
}

export default App;
