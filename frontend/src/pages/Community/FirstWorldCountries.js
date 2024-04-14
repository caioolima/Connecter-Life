import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth"; // Importe o hook de autenticação

const FirstWorldCountries = () => {
  const firstWorldCountries = [
    "Estados Unidos",
    "Canadá",
    "Reino Unido",
    "Alemanha",
    "Japão",
  ]; // Exemplo de países de primeiro mundo
  const [userId, setUserId] = useState(null); // Estado para armazenar o ID do usuário logado
  const [communityData, setCommunityData] = useState({}); // Estado para armazenar os dados da comunidade
  const { user } = useAuth(); // Use o hook de autenticação para obter informações do usuário logado

  useEffect(() => {
    // Quando o componente monta, configure o ID do usuário logado
    if (user) {
      setUserId(user.id);
    }
  }, [user]); // Execute sempre que o usuário mudar

  useEffect(() => {
    // Função para buscar os dados da comunidade
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/communities/comunidade`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Adicione o token de autorização
          },
        });
        const data = await response.json();
        setCommunityData(data);
      } catch (error) {
        console.error("Erro ao buscar dados da comunidade:", error);
      }
    };

    fetchData(); // Chama a função de busca ao montar o componente
  }, []); // Executa apenas uma vez, ao montar o componente

  const joinCommunity = async (countryName) => {
    try {
      // Verifica se o usuário já faz parte da comunidade
      if (communityData[countryName] && communityData[countryName].usuarios.includes(userId)) {
        console.log("Usuário já faz parte da comunidade do país.");
        // Atualiza o estado do botão para "Joined"
        setCommunityData(prevData => ({
          ...prevData,
          [countryName]: { usuarios: [...(prevData[countryName]?.usuarios || []), userId] }
        }));
        return;
      }

      // Se o usuário não faz parte da comunidade, adicione-o
      const addResponse = await fetch(
        `http://localhost:3000/communities/comunidade/${countryName}/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Adicione o token de autorização
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (addResponse.ok) {
        console.log("Usuário adicionado à comunidade do país com sucesso.");
        // Atualiza o estado do botão para "Joined"
        setCommunityData(prevData => ({
          ...prevData,
          [countryName]: { usuarios: [...(prevData[countryName]?.usuarios || []), userId] }
        }));
      } else {
        console.error(
          "Erro ao adicionar usuário à comunidade do país:",
          addResponse.statusText
        );
      }
    } catch (error) {
      console.error("Erro ao adicionar usuário à comunidade do país:", error);
    }
  };

  return (
    <div>
      <h3>Comunidades</h3>
      <ul>
        {firstWorldCountries.map((country, index) => (
          <li key={index}>
            <Link to={`/community/${country}`}>{country}</Link>
            {communityData[country] && communityData[country].usuarios.includes(userId) ? (
              <span style={{ marginLeft: "10px" }}>Joined</span>
            ) : (
              <button onClick={() => joinCommunity(country)}>Join</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FirstWorldCountries;
