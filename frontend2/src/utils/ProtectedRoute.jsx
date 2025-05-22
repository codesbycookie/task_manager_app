import { Navigate, Outlet } from 'react-router-dom';

const useAuth = () => {
  localStorage.setItem("user", JSON.stringify({ role: "admin" })); // Mock user data for testing
  const user = JSON.parse(localStorage.getItem("user")); 
  return user;
}

const PrivateRoute = ({ role }) => {
  const user = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/user" replace />;  
  }

  return <Outlet />; 
};

export default PrivateRoute;
