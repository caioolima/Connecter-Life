import React, { useEffect } from "react";
import Header from "../Header/header"; // Atualize o caminho para Header.js
import Form from "../Form/form"; // Atualize o caminho para Form.js
import Footer from "../Footer/footer.jsx"

function HomeScreen() {
    const handleLogin = () => {
        console.log("Tentativa de login");
    };
;
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
