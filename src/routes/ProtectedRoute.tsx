// /routes/ProtectedRoute.tsx

import React from "react";
import { Navigate } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  allowedRoles: ("admin" | "employee")[];
  userRole: "admin" | "employee" | null;
}

const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles, userRole }) => {
  if (!userRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
