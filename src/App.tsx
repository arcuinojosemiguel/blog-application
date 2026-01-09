import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAppDispatch } from "./store/hooks";
import { checkSession } from "./store/authSlice";
import Login from "./pages/Login";
import Register from "./pages/Register";
import BlogList from "./pages/BlogList";
import CreateBlog from "./pages/CreateBlog";
import BlogDetail from "./pages/BlogDetail";
import EditBlog from "./pages/EditBlog";
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
      <Route
        path="/blogs/create"
        element={
          <ProtectedRoute>
            <CreateBlog />
          </ProtectedRoute>
        }
      />
      <Route
        path="/blogs/:id"
        element={
          <ProtectedRoute>
            <BlogDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/blogs/:id/edit"
        element={
          <ProtectedRoute>
            <EditBlog />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
