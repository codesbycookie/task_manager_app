import { Routes, Route } from "react-router-dom";
import Login from "../pages/Auth/Login";
import { SidebarDemo } from "../pages/Admin/Layout/Layout";
import Dashboard from "../pages/Admin/Dashboard/Dashboard";
import AddUser from "@/pages/Admin/AddUser/AddUser";
import AddTask from "@/pages/Admin/AddTask/AddTask";
import Branch from "@/pages/Admin/Branch/Branch";
import Users from "@/pages/Admin/Users/Users";
import AdminProfile from "@/pages/Admin/Profile/Profile";
import AdminSheets from "@/pages/Admin/Sheets/Sheets";
import AddBranch from "@/pages/Admin/AddBranch/AddBranch";
import { AuthProvider } from "@/contexts/AuthContext";
import { ApiProvider } from "@/contexts/ApiContext";
import ProtectedRoute from "./ProtectedRoute"; // 👈 import it

export default function AppRoutes() {
  return (
    <AuthProvider>
      <ApiProvider>
        <Routes>
          {/* Login route */}
          <Route
            path="/"
            element={
              <ProtectedRoute routeType="login">
                <Login />
              </ProtectedRoute>
            }
          />

          {/* All /admin routes protected */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute routeType="admin">
                <SidebarDemo />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="add-user" element={<AddUser />} />
            <Route path="add-task" element={<AddTask />} />
            <Route path="add-branch" element={<AddBranch />} />
            <Route path="branch" element={<Branch />} />
            <Route path="users" element={<Users />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="users/sheets/:userId" element={<AdminSheets />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Login />} />
        </Routes>
      </ApiProvider>
    </AuthProvider>
  );
}
