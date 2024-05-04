import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import HomeScreen from "./pages/HomeScreen/HomeScreen";
import ResetPassword from "./pages/ResetPassword/ResetPassword";
import AuthLayout from "./components/AuthLayout/auth";
import Terms from "./pages/Terms/terms";
import Service from "./pages/Terms/service";
import Privacy from "./pages/Terms/privacy";
import UserProfileContainer from "./pages/perfil/UserProfileContainer";
import Introduction from "./pages/ConnecterHome/introduction";
import SearchUser from "./pages/SearchUser/SearchUser";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage"; // Importe a página de erro 404
import PrivateRoute from "./PrivateRoute.js";
import FirstWorldCountries from "./pages/Community/FirstWorldCountries.js";
import Community from "./pages/Community/Community.js";
import ChatScreen from "./pages/Community/ChatScreen.js";
import { useAuth } from "./hooks/use-auth";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Introduction />
          </PrivateRoute>
        }
      />
      <Route
        path="/home"
        element={
          <PrivateRoute>
            <AuthLayout>
              <HomeScreen />
            </AuthLayout>{" "}
          </PrivateRoute>
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
      <Route path="/worldcommunity" element={<FirstWorldCountries />} />
      <Route path="/comunidade/:countryId/:communityId/chat" element={<ChatScreen />} />
      <Route
        path="/community/:countryId/:communityId"
        element={<Community />}
      />{" "}
      {/* Rota para a página da comunidade */}
    </Routes>
  );
}

export default App;
