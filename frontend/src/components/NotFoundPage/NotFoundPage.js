// NotFoundPage.js
import React from "react";

/* Estilos */
import "./NotFoundPage.css"; // Importe o arquivo de estilo CSS

/* Componentes */
import SidebarMenu from "../perfil/SidebarMenu/index";

function NotFoundPage() {
  return (
    <div className="not-found-page">
      <SidebarMenu />
      <div className="not-found-content">
        <h1>404 - Página não encontrada</h1>
        <p>A página que você está procurando não existe.</p>
      </div>
    </div>
  );
}

export default NotFoundPage;
