import { Routes, Route } from "react-router-dom";
import UserProfile from "../pages/User/Profile/Profile";
import UserNavbar from "../pages/User/Navbar/Navbar";
import UserSheets from "../pages/User/Sheets/Sheets";
import AdminNavbar from "../pages/Admin/Navbar/Navbar";
import AdminProfile from "../pages/Admin/Profile/Profile";
import Login from "../pages/Login/Login";
import AddUser from "../pages/Admin/AddUser/AddUser";
import Users from "../pages/Admin/Users/Users";
import Branches from "../pages/Admin/Branches/Branches";
import AdminSheets from "../pages/Admin/Sheets/Sheets";
import AddTask from "../pages/Admin/AddTask/AddTask";
import AddBranch from "../pages/Admin/AddBranch/AddBranch";
import EditBranch from "../pages/Admin/EditBranch/EditBranch";
import EditTask from "../pages/Admin/EditTask/EditTask";
import EditProfile from "../pages/User/EditProfile/EditProfile";
import ChangePassword from "../pages/User/ChangePassword/ChangePassword";

import { ApiProvider, useApi } from "../context/ApiContext";
import { AuthProvider } from "../context/AuthContext";

import ProtectedRoute from "./ProtectedRoute";

import NotFound from "../pages/Components/NotFound";
import Loader from "../pages/Components/Loader";

function AppRoutesWithApi() {
  const { loading } = useApi();

  if (loading) return <Loader />;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute routeType="login">
            <Login />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute routeType="admin">
            <AdminNavbar />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminProfile />} />
        <Route path="add-user" element={<AddUser />} />
        <Route path="users" element={<Users />} />
        <Route path="branches" element={<Branches />} />
        <Route path="add-task" element={<AddTask />} />
        <Route path="edit-task" element={<EditTask />} />
        <Route path="add-branch" element={<AddBranch />} />
        <Route path="edit-branch" element={<EditBranch />} />
        <Route path="users/sheets/:userId" element={<AdminSheets />} />
      </Route>
      <Route
        path="/user"
        element={
          <ProtectedRoute routeType="user">
            <UserNavbar />
          </ProtectedRoute>
        }
      >
        <Route index element={<UserProfile />} />
        <Route path="edit-profile" element={<EditProfile />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="sheets" element={<UserSheets />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default function AppRoutes() {
  return (
    <AuthProvider>
      <ApiProvider>
        <AppRoutesWithApi />
      </ApiProvider>
    </AuthProvider>
  );
}
