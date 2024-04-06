import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./hooks/use-auth";

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();

    return !user ? children : <Navigate to={`/profile/${user.id}`} />;
};

export default PrivateRoute;
