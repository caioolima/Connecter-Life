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
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import PrivateRoute from "./PrivateRoute.js";
import FirstWorldCountries from "./pages/Community/World Community/FirstWorldCountries.js";
import Community from "./pages/Community/Community Services/Community.js";
import ChatScreen from "./pages/Community/Chat/ChatScreen.js";
import FeedPage from "./pages/Feed/feed.js";
import NewPassword from "./pages/ResetPassword/NewPassword.jsx"
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
      <Route
        path="/comunidade/:countryId/:communityId/chat"
        element={<ChatScreen />}
      />
      <Route
        path="/community/:countryId/:communityId"
        element={<Community />}
      />
      <Route path="/feed/:userId" element={<FeedPage />}></Route>
      <Route
        path="/newpassword/:token" // Defina o caminho da rota com um parâmetro de token para identificar a solicitação de redefinição de senha
        element={
          <AuthLayout>
            <NewPassword />{" "}
            {/* Renderize o componente NewPassword quando a rota for correspondida */}
          </AuthLayout>
        }
      />
    </Routes>
  );
}

export default App;