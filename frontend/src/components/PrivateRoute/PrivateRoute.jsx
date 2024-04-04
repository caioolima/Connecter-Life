import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from "../../hooks/use-auth";
import axios from 'axios';

const PrivateRoute = () => {
  const { user } = useAuth();
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!user && !token) {
      // Usuário não autenticado e nenhum token de autenticação, redirecione para a página de introdução
      navigate('/introduction');
    } else if (token) {
      // Inclua o token de autenticação nos cabeçalhos de todas as solicitações
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, [user, location.pathname]); // Execute sempre que o usuário ou a localização mudar

  if (!user) {
    // Se o usuário não estiver autenticado, redirecione para a página de perfil
    return <Navigate to={`/profile/${userId}`} />;
  }
};

export default PrivateRoute;
