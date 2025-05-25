import { Routes, Route } from "react-router-dom";
import UserProfile from "../pages/User/Profile/Profile";
import UserNavbar from "../pages/User/Navbar/Navbar";
import UserSheets from "../pages/User/Sheets/Sheets";

//ADMIN IMPORTS

import AdminNavbar from "../pages/Admin/Navbar/Navbar";
import AdminProfile from "../pages/Admin/Profile/Profile";


import Login from "../pages/Login/Login";
import { ApiProvider } from "../context/ApiContext";
import { AuthProvider } from "../context/AuthContext";
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

export default function AppRoutes() {
  return (
    <AuthProvider>
      <ApiProvider>
        <Routes>
         <Route path="/" element={<Login />} />       
          <Route path="/admin" element={<AdminNavbar />}>
            <Route index element={<AdminProfile />} />{" "}
            <Route path="add-user" element={<AddUser/>} />
            <Route path="users" element={<Users />} />
            <Route path="branches" element={<Branches/>}/>
            <Route path='add-task' element={<AddTask/>}/>
            <Route path='edit-task' element={<EditTask/>}/>
            <Route path='add-branch' element={<AddBranch/>}/>
            <Route path='edit-branch' element={<EditBranch/>}/>
            <Route path="users/sheets/:userId" element={<AdminSheets />} />
           {/*  <Route path="notifications" element={<Notifications />} /> */}
          </Route>
          {/* User Layout Routes */}
          <Route path="/user" element={<UserNavbar />}>
            <Route index element={<UserProfile />} />
                        <Route path="edit-profile" element={<EditProfile />} />
                                   <Route path="change-password" element={<ChangePassword />} />

            <Route path="sheets" element={<UserSheets />} />
          </Route>
        </Routes>           
      </ApiProvider>
    </AuthProvider>
  );
}
