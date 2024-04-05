import React, { useState, useEffect } from 'react';
import "./FindUserPage.css"; // Importar o arquivo de estilos CSS

/* Componentes */
import SidebarMenu from "../perfil/SidebarMenu/index";

const FindUserPage = () => {
    const [username, setUsername] = useState('');
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [typingTimeout, setTypingTimeout] = useState(null);

    useEffect(() => {
        const cleanedUsername = username.trim().replace(/\s+/g, ' ');

        if (cleanedUsername === '') {
            setUsers([]);
            setError(null);
            return;
        }

        // Aguardar 500ms após o usuário parar de digitar antes de buscar usuários
        const timeout = setTimeout(() => {
            const fetchUsers = async () => {
                try {
                    const response = await fetch(`http://localhost:3000/find/${cleanedUsername}`);
                    if (!response.ok) {
                        throw new Error('Usuários não encontrados');
                    }
                    const userData = await response.json();
                    setUsers(userData);
                    setError(null);
                } catch (error) {
                    console.error('Erro ao buscar usuários:', error);
                    setError(error.message);
                    setUsers([]);
                }
            };

            fetchUsers();
        }, 500);

        // Limpar o timeout anterior se o usuário ainda estiver digitando
        return () => clearTimeout(timeout);
    }, [username]);

    return (
        <div className="find-user-container"> {/* Container principal */}
            <SidebarMenu/>
            <div className="find-user-content"> {/* Conteúdo da página */}
                <h1 className='details-users-details'>Encontrar Usuário</h1>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Digite o nome de usuário"
                    className="username-input" // Adicionando classe para estilização específica
                />

                {users.length > 0 && (
                    <div>
                        <div className="user-list"> {/* Lista de usuários */}
                            {users.map(user => (
                                <div key={user._id} className="user-item-user"> {/* Item de usuário */}
                                    <a href={`/profile/${user._id}`} className="user-link-user"> {/* Link para o perfil do usuário */}
                                        <div>
                                           
                                            {user.profileImageUrl ? ( // Verifica se há uma imagem de perfil
                                                <img src={user.profileImageUrl} alt={`Foto de ${user.username}`} className="user-avatar" /> // Mostra a imagem de perfil
                                            ) : (
                                                <div className="profile-frame"></div> // Mostra a moldura se não houver imagem de perfil
                                            )} <div className="check-user-check">{user.username}</div>
                                        </div>
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {error && <p className="error-message-error">Erro: {error}</p>} {/* Mensagem de erro */}
            </div>
        </div>
    );
};

export default FindUserPage;
