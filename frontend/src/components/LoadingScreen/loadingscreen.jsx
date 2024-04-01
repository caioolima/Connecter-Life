import React, { useState, useEffect } from "react";
import "./style.css"; // Importe o arquivo CSS para aplicar os estilos

const LoadingScreen = () => {

  return(
    <div className="loading-screen">
      <div className="loading-content">
        <div className="spinner"></div>
        <div className="loading-text">Connecter Life</div>
      </div>
    </div>
  ) 
};

export default LoadingScreen;