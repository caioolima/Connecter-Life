import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; 
import { useAuth } from "../../hooks/use-auth";
import "./community.css";
import BrasilFlag from "./flags/brasil.jpeg";
import AlemanhaFlag from "./flags/alemanha.png";
import SidebarMenu from "../perfil/SidebarMenu/index";
import JapaoFlag from "./flags/japao.png";

const CountryDetails = () => {
  const { user } = useAuth();
  const [userId, setUserId] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true); // Novo estado para controlar o carregamento
  const { countryId, communityId } = useParams();
  const normalizedCountryId = countryId.toLowerCase();
  
  useEffect(() => {
    if (user) {
      setUserId(user.id);
      checkMembership(user.id, communityId);
    }
  }, [user, communityId]);

  useEffect(() => {
    if (userId) {
      checkMembership(userId, communityId);
    }
  }, [userId, communityId]);

  const checkMembership = async (userId, communityId) => {
    try {
      const response = await fetch(`http://localhost:3000/communities/comunidade/verificar/${userId}/${communityId}`);
      if (response.ok) {
        const { message } = await response.json();
        setIsMember(message === 'Usuário está na comunidade');
      } else {
        throw new Error("Erro ao verificar a associação do usuário com a comunidade");
      }
    } catch (error) {
      console.error("Erro ao verificar a associação do usuário com a comunidade:", error);
    } finally {
      setLoading(false); // Indica que a verificação está completa
    }
  };

  const handleJoinCommunity = async () => {
    try {
      const response = await fetch(`http://localhost:3000/communities/comunidade/entrar/${userId}/${communityId}`, {
        method: "POST",
      });

      if (response.ok) {
        setIsMember(true);
      } else {
        throw new Error("Falha ao entrar na comunidade");
      }
    } catch (error) {
      console.error("Erro ao entrar na comunidade:", error);
    }
  };

  const flagMappings = {
    brasil: BrasilFlag,
    alemanha: AlemanhaFlag,
    japao: JapaoFlag,
  };
  
  const countryFlag = flagMappings[normalizedCountryId];

  return (
    <div>
      {!loading && (
        <div className="flag" style={{ backgroundImage: `url(${countryFlag})` }}>
          <div className="country-details-container"> 
            <SidebarMenu />
            <h2 className="country-details-title">Detalhes do País</h2>
            <p className="country-id">{countryId}</p>
            <h3 className="community-rules-title">Regras da Comunidade:</h3>
            <ul className="community-rules-list">
              <li>Proibido conteúdo ofensivo;</li>
              <li>Proibido xingamentos;</li>
              <li>Respeite as opiniões dos outros membros;</li>
              <li>Mantenha as discussões relacionadas ao país.</li>
            </ul>
            {!loading && ( // Exibe os botões somente quando a verificação estiver completa
              isMember ? (
                <Link to={`/comunidade/${countryId}/${communityId}/chat`} className="join-button">
                  Entrar
                </Link>
              ) : (
                <button className="join-button" onClick={handleJoinCommunity}>
                  Participar da Comunidade
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryDetails;