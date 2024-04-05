import React, { useEffect } from "react";
import Header from "../Header/header"; // Atualize o caminho para Header.js
import Form from "../Form/form"; // Atualize o caminho para Form.js
import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import Footer from "../Footer/footer.jsx";

function HomeScreen() {
    const { user } = useAuth();
    const handleLogin = () => {
        console.log("Tentativa de login");
    };
;

    if (user) {
        // Se o usuário estiver logado, redirecione para a rota de perfil
        return <Navigate to={`/profile/${user.id}`} />;
    }
else{
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
}
   

export default HomeScreen;
