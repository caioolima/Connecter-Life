import { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      axios.defaults.headers.common.authorization = `Bearer ${token}`;

      axios
        .get("http://localhost:3000/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setUser({ ...response.data, id: response.data._id });
        })
        .catch(() => {
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, []);

  async function signIn({ email, password }) {
    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      if (response.data.token) {
        setUser({ id: response.data.userId });
        localStorage.setItem("token", response.data.token);
      }

      return { userId: response.data.userId };
    } catch (error) {
      throw error;
    }
  }

  function signOut() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
