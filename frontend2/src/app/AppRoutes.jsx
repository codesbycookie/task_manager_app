import { Routes, Route } from "react-router-dom";
import Login from "../pages/Auth/Login/Login";
import Register from "../pages/Auth/Register/Register";
import AdminDashboard from "../pages/Admin/Dashboard/Dashboard";
import Notifications from "../pages/Admin/Notifications/Notifications";
import Users from "../pages/Admin/Users/Users";
import Sheets from "../pages/Admin/Sheets/Sheets";
import AddUser from "../pages/Admin/AddUser/AddUser";
import Profile from "../pages/Admin/Profile/Profile";
import { AuthProvider } from "../context/AuthContext";
import { ApiProvider } from "../context/ApiContext";

import UserDashboard from '../pages/User/Dashboard/Dashboard';
import Report from "../pages/User/Report/Report";
import UserSheets from "../pages/User/Sheets/Sheets";
import UserProfile from "../pages/User/Profile/Profile";
// import NotFound from '../pages/NotFound'; // create this later

export default function AppRoutes() {
  return (
    <AuthProvider>
      <ApiProvider>
        <Routes>
          {/* Auth */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Layout Routes */}
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<Profile />} />{" "}
            {/* Default route for admin dashboard */}
            <Route path="notifications" element={<Notifications />} />
            <Route path="users" element={<Users />} />
            <Route path="users/sheets/:userId" element={<Sheets />} />
            <Route path="add-user" element={<AddUser />} />
          </Route>

          {/* User Layout Routes */}
          <Route path="/user" element={<UserDashboard />}>
            <Route path="report" element={<Report />} />
            <Route path="sheets" element={<UserSheets />} />
            <Route path="profile" element={<UserProfile />} />
          </Route>

          {/* Catch-all */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </ApiProvider>
    </AuthProvider>
  );
}
