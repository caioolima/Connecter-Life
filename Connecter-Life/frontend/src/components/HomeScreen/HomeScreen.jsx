import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../Header/header"; // Atualize o caminho para Header.js
import Form from "../Form/form"; // Atualize o caminho para Form.js
import { useAuth } from "../../hooks/use-auth";
import Footer from "../Footer/footer.jsx"

function HomeScreen() {
    const { user } = useAuth();
    const handleLogin = () => {
        console.log("Tentativa de login");
    };

    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate(`/profile/${user.id}`);
        }
    }, [user, navigate]);

    return (
        <div className="container-home">
            <div className="content">
                <Header />
                <Form onSubmit={handleLogin} buttonText="Entrar" />
            </div>
            <Footer/>
        </div>
    );
}

export default HomeScreen;
