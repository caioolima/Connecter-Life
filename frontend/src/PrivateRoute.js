import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./hooks/use-auth";

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            // Se o usuário estiver autenticado, redirecione para a rota '/profile' com o ID do usuário
            window.location.href = `/profile/${user.id}`;
        }
    }, [user]);

    // Renderiza o componente Navigate apenas quando o usuário estiver autenticado (para evitar erros)
    return user ? <Navigate to={`/profile/${user.id}`} /> : null;
};

export default PrivateRoute;
