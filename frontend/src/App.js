import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import HomeScreen from "./components/HomeScreen/HomeScreen";
import ResetPassword from "./components/Reset Password/ResetPassword";
import AuthLayout from "./components/AuthLayout/auth";
import Terms from "./components/Terms/terms";
import Service from "./components/Terms/service";
import Privacy from "./components/Terms/privacy";
import UserProfileContainer from "./components/perfil/UserProfileContainer";
import Introduction from "./components/ConnecterHome/introduction";
import SearchUser from "./components/SearchUser/SearchUser";
import NotFoundPage from "./components/NotFoundPage/NotFoundPage"; // Importe a página de erro 404
import { useAuth } from "./hooks/use-auth";
import PrivateRoute from "./PrivateRoute"

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/introduction" element={
          <PrivateRoute>
            <Introduction />
          </PrivateRoute>
      } />
      <Route
        path="/home"
        element={
          <AuthLayout>
            <HomeScreen />
          </AuthLayout>
        }
      />
      <Route
        path="/reset"
        element={
          <AuthLayout>
            <ResetPassword />
          </AuthLayout>
        }
      />
      <Route
        path="/terms"
        element={
          <AuthLayout>
            <Terms />
          </AuthLayout>
        }
      />
      <Route
        path="/service"
        element={
          <AuthLayout>
            <Service />
          </AuthLayout>
        }
      />
      <Route
        path="/privacy"
        element={
          <AuthLayout>
            <Privacy />
          </AuthLayout>
        }
      />
      <Route path="/profile/:userId" element={<UserProfileContainer />} />
      <Route path="/search" element={<SearchUser />} />
      <Route path="*" element={<NotFoundPage />} /> {/* Rota de erro 404 */}
    </Routes>
  );
}

export default App;
