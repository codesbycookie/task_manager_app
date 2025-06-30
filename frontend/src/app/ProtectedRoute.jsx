import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCookie } from "../utils/CookieService";
import { toast } from "react-toastify";

export default function ProtectedRoute({ children, routeType }) {
  const location = useLocation();
  const admin_uid = getCookie("admin_uid");
  const user_uid = getCookie("user_uid");

  const isAdmin = !!admin_uid;
  const isUser = !!user_uid;
  const isLoggedIn = isAdmin || isUser;

  useEffect(() => {
    if (isLoggedIn){
 if (routeType === "admin" && !isAdmin) {
      toast.error("This page is restricted for users");
    } else if (routeType === "user" && !isUser) {
      toast.error("This page is restricted for admins");
    } 
    } else return;

   
  }, [routeType, isAdmin, isUser, isLoggedIn]);

  // 🔐 LOGIN ROUTE
  if (routeType === "login" && isLoggedIn) {
    const redirectPath = isAdmin ? "/admin" : "/user";
    return <Navigate to={redirectPath} replace />;
  }

  // 🔐 ADMIN ROUTE BLOCK
  if (routeType === "admin" && (!isAdmin && isLoggedIn)) {
    return <Navigate to="/user" state={{ from: location }} replace />;
  }

  // 🔐 USER ROUTE BLOCK
  if (routeType === "user" && (!isUser && isLoggedIn)) {
    return <Navigate to="/admin" state={{ from: location }} replace />;
  }

  // 🔐 Not logged in trying to access user/admin route
  if ((routeType === "admin" || routeType === "user") && !isLoggedIn) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
