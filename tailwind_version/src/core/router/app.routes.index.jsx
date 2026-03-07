import { Routes, Route } from "react-router-dom";

import Login from "@/pages/Auth/Login";

// import AdminProfile from "@/pages/Admin/Profile/Profile";
// import AddUser from "@/pages/Admin/AddUser/AddUser";
// import Users from "@/pages/Admin/Users/Users";
// import Branches from "@/pages/Admin/Branches/Branches";
// import AdminSheets from "@/pages/Admin/Sheets/Sheets";
// import AddTask from "@/pages/Admin/AddTask/AddTask";
// import AddBranch from "@/pages/Admin/AddBranch/AddBranch";
// import EditBranch from "@/pages/Admin/EditBranch/EditBranch";
// import EditTask from "@/pages/Admin/EditTask/EditTask";

// import NotFound from "@/pages/Components/NotFound";

export default function AppRoutes() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />

      {/* <Route path="/admin" element={<AdminProfile />} />

      <Route path="/admin/users" element={<Users />} />
      <Route path="/admin/add-user" element={<AddUser />} />

      <Route path="/admin/branches" element={<Branches />} />
      <Route path="/admin/add-branch" element={<AddBranch />} />
      <Route path="/admin/edit-branch" element={<EditBranch />} />

      <Route path="/admin/add-task" element={<AddTask />} />
      <Route path="/admin/edit-task" element={<EditTask />} />

      <Route path="/admin/users/sheets/:userId" element={<AdminSheets />} />

      <Route path="*" element={<NotFound />} /> */}

    </Routes>
  );
}