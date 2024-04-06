import React, { useState, useEffect } from "react";
import "./FindUserPage.css"; // Importar o arquivo de estilos CSS

/* Componentes */
import SidebarMenu from "../../pages/perfil/SidebarMenu/index";
import Footer from "../../components/Footer/footer";
import { useTranslation } from "react-i18next"; // Importar o hook useTranslation para tradução

const FindUserPage = () => {
  const { t } = useTranslation(); // Usar o hook useTranslation para tradução
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [typingTimeout, setTypingTimeout] = useState(null);

  useEffect(() => {
    const cleanedUsername = username.trim().replace(/\s+/g, " ");

    if (cleanedUsername === "") {
      setUsers([]);
      setError(null);
      return;
    }

    // Aguardar 500ms após o usuário parar de digitar antes de buscar usuários
    const timeout = setTimeout(() => {
      const fetchUsers = async () => {
        try {
          const response = await fetch(
            `http://localhost:3000/find/${cleanedUsername}`
          );
          if (!response.ok) {
            throw new Error(t("users_not_found")); // Traduzir a mensagem de erro
          }
          const userData = await response.json();
          setUsers(userData);
          setError(null);
        } catch (error) {
          console.error("Erro ao buscar usuários:", error);
          setError(error.message);
          setUsers([]);
        }
      };

      fetchUsers();
    }, 500);

    // Limpar o timeout anterior se o usuário ainda estiver digitando
    return () => clearTimeout(timeout);
  }, [username, t]); // Adicionar t como dependência para atualizar a tradução quando a linguagem for alterada

  return (
    <div className="find-user-container">
      {" "}
      {/* Container principal */}
      <SidebarMenu />
      <div className="find-user-content">
        {" "}
        {/* Conteúdo da página */}
        <h1 className="details-users-details">{t("find_user_title")}</h1> {/* Traduzir o título */}
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={t("username_placeholder")} // Traduzir o placeholder
          className="username-input" // Adicionando classe para estilização específica
        />
        {users.length > 0 && (
          <div>
            <div className="user-list">
              {" "}
              {/* Lista de usuários */}
              {users.map((user) => (
                <div key={user._id} className="user-item-user">
                  {" "}
                  {/* Item de usuário */}
                  <a href={`/profile/${user._id}`} className="user-link-user">
                    {" "}
                    {/* Link para o perfil do usuário */}
                    <div>
                      {user.profileImageUrl ? ( // Verifica se há uma imagem de perfil
                        <img
                          src={user.profileImageUrl}
                          alt={`${t("profile_picture_alt")} ${user.username}`} // Traduzir o texto alternativo da imagem
                          className="user-avatar"
                        /> // Mostra a imagem de perfil
                      ) : (
                        <div className="profile-frame"></div> // Mostra a moldura se não houver imagem de perfil
                      )}{" "}
                      <div className="check-user-check">{user.username}</div>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
        {error && <p className="error-message-error">{t("error")}: {error}</p>}{" "} {/* Mensagem de erro */}
        <Footer />
      </div>
    </div>
  );
};

export default FindUserPage;