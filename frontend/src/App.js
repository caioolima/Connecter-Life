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
import Introduction from "./components/ConnecterHome/introduction";

function App() {
    return (
        <Routes>
            <Route path="/introduction" element={<Introduction />}/>
                
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
        </Routes>
    );
}

export default App;
