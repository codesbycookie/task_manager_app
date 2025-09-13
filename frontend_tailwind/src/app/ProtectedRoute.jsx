import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getCookie } from "../utils/CookieService";
import { toast } from "sonner";

export default function ProtectedRoute({ children, routeType }) {
  const location = useLocation();
  const admin_uid = getCookie("admin_uid");

  const isAdmin = !!admin_uid;

  useEffect(() => {
    if (!isAdmin && (routeType === "admin")) {
      toast("This page is restricted to admins only");
    }
  }, [routeType, isAdmin]);

  if (routeType === "login" && isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  if (routeType === "admin" && !isAdmin) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
