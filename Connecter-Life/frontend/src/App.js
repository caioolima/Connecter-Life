// App.js
import React from "react";
import { Route, Routes } from "react-router-dom";
import HomeScreen from "./components/HomeScreen/HomeScreen";
import ResetPassword from "./components/Reset Password/ResetPassword";
import AuthLayout from "./components/AuthLayout/auth";
import Terms from "./components/Terms/terms";
import Service from "./components/Terms/service";
import Privacy from "./components/Terms/privacy";
import UserProfileContainer from "./components/perfil/UserProfileContainer";


function App() {
    return (
        <Routes>
            <Route
                path="/"
                element={
                    <HomeScreen />
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
                path="/terms" // Qualquer caminho iniciando com "/terms/" será redirecionado para o componente Terms
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

            <Route
                path="/profile/:userId" // Defina o caminho da rota para incluir o parâmetro de ID do usuário
                element={<UserProfileContainer />}
            />
            
        </Routes>
    );
}

export default App;
