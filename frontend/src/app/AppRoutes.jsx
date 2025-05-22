import { Route, Routes } from "react-router-dom";
import Sheets from "../pages/Admin/Sheets/Sheets";
import Dashboard from "../pages/Admin/Dashboard/Dashboard";

export default function AppRoutes() {
  const Component = ({ component }) => {
    return <h1>{component}</h1>;
  };

return (
    <Routes>
    <Route
      path="/user/login"
      element={<Component component={"user login"} />}
    />
    <Route
      path="/user/register"
      element={<Component component={"user register"} />}
    />
    <Route
      path="/admin/login"
      element={<Component component={"admin login"} />}
    />
    <Route
      path="/admin/register"
      element={<Component component={"admin register"} />}
    />
    <Route
      path="/user/dashboard"
      element={<Component component={"user dashboard"} />}
    />
    <Route
      path="/admin/dashboard"
      element={<Dashboard/>}
    />
  </Routes>
)
}
