import { createContext, useState, useEffect } from "react";
import axios from 'axios';
import { Navigate, useNavigate } from "react-router-dom";
export const AuthContext = createContext({})


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("erro request")
    const token = localStorage.getItem('token');

    if (token) {
      
      axios.defaults.headers.common.authorization = `Bearer ${token}`;

      axios.get('http://localhost:3000/profile', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then(response => {
        setUser({ ...response.data, id: response.data._id });
  
      })
      .catch(e => {
        
        navigate("/")
      })
    }
    else{
      navigate("/")
    }
    
  }, []);

  async function signIn({ email,password }) {
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      if (response.data.token) {
        setUser({ id: response.data.userId })
        localStorage.setItem('token', response.data.token);
      }

      return { userId: response.data.userId }
    } catch (error) {
      throw error;
    }
  }

  function signOut() {
    // Limpar o token do localStorage
    localStorage.removeItem('token');

    // Resetar o estado do usuário para null
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}