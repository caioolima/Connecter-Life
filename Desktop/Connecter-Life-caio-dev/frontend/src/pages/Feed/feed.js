import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../hooks/use-auth";
import "./feedPage.css"; // Importando o arquivo de estilos
import { AiFillFire, AiOutlineFire } from "react-icons/ai"; // Importe o ícone de fogo
import "../perfil/PublicationDetailsModal/style.css";
import SidebarMenu from "../perfil/SidebarMenu/";
import { AiOutlineUser } from "react-icons/ai"; // Importando o ícone de usuário padrão
import { FaBookmark, FaRegBookmark } from "react-icons/fa"; // Importe os ícones de salvar (cheio e vazio)

const FeedPage = () => {
  const { user } = useAuth();
  const [userId, setUserId] = useState(null);
  const [feed, setFeed] = useState([]);
  const [error, setError] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null); // Estado para armazenar o ID do dono do post selecionado
  const [isLiked, setIsLiked] = useState(); // Estado para indicar se a imagem foi curtida pelo usuário
  const [likedUsers, setLikedUsers] = useState([]); // Estado para armazenar os usuários que curtiram o post
  const [modalOpen, setModalOpen] = useState(false); // Estado para controlar se o modal está aberto
  const [modalUsers, setModalUsers] = useState([]); // Estado para armazenar os usuários para exibir no modal

  useEffect(() => {
    if (user) {
      setUserId(user.id);
    }
  }, [user]);

  useEffect(() => {
    const fetchFeedAndCheckSaved = async () => {
      if (userId) {
        try {
          const response = await fetch(
            `http://localhost:3000/feedRoutes/feed/${userId}`
          );
          if (!response.ok) {
            throw new Error("Erro ao carregar o feed");
          }
          const data = await response.json();
          // Mapear os posts e definir isLoading como true inicialmente
          const updatedFeed = data.map((post) => ({
            ...post,
            isLoading: true,
          }));
          setFeed(updatedFeed);

          // Verificar e atualizar o estado de salvamento de cada post
          await Promise.all(
            updatedFeed.map(async (post) => {
              await checkSaved(post, post.userId._id); // Corrigido para passar o postOwnerId
            })
          );
        } catch (err) {
          setError("Erro ao carregar o feed");
        }
      }
    };
    fetchFeedAndCheckSaved();
  }, [userId]);

  const likePost = async (postId, ownerUserId, imageUrl, likerId) => {
    try {
      checkLike();
      const response = await fetch(
        `http://localhost:3000/feedRoutes/feed/${ownerUserId}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl, likerId }),
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao curtir a postagem");
      }
      // Atualize o feed após curtir
      const updatedFeed = feed.map((post) => {
        if (post._id === postId) {
          return { ...post, isLiked: true }; // Marque a postagem como curtida
        }
        return post;
      });
      setFeed(updatedFeed);
      setIsLiked(true); // Atualize o estado isLiked para true
    } catch (err) {
      console.error(err);
    }
  };

  const unlikePost = async (postId, ownerUserId, imageUrl, likerId) => {
    try {
      checkLike();
      const response = await fetch(
        `http://localhost:3000/feedRoutes/feed/${ownerUserId}/unlike`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl, likerId }),
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao descurtir a postagem");
      }
      // Atualize o feed após descurtir
      const updatedFeed = feed.map((post) => {
        if (post._id === postId) {
          return { ...post, isLiked: false }; // Marque a postagem como não curtida
        }
        return post;
      });
      setFeed(updatedFeed);
      setIsLiked(false); // Atualize o estado isLiked para false
    } catch (err) {
      console.error(err);
    }
  };

  const [checkedLike, setCheckedLike] = useState(false);
  useEffect(() => {
    if (!checkedLike && feed.length > 0) {
      checkLike();
      setCheckedLike(true);
    }
  }, [checkedLike, feed]);

  const checkLike = async () => {
    try {
      const updatedFeed = await Promise.all(
        feed.map(async (post) => {
          const response = await fetch(
            `http://localhost:3000/feedRoutes/feed/${user.id}/checkLikes`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ imageUrl: post.url }),
            }
          );
          if (!response.ok) {
            throw new Error("Erro ao verificar status de curtida");
          }
          const data = await response.json();
          return { ...post, isLiked: data.isLikedByUser };
        })
      );
      setFeed(updatedFeed);
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewLikes = async (postId) => {
    try {
      const response = await fetch(
        "http://localhost:3000/feedRoutes/likedUsers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ imageUrl: postId }),
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao obter usuários que curtiram o post");
      }
      const data = await response.json();
      setModalUsers(data.likedUsersNames); // Atualiza o estado com a lista de usuários
      openModal();
    } catch (err) {
      console.error(err);
    }
  };

  const openModal = () => {
    setModalOpen(true); // Abre o modal
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalOpen(false); // Fecha o modal
    document.body.style.overflow = "auto";
  };
  const [loadedImages, setLoadedImages] = useState({});

  // Dentro da função que manipula o carregamento da imagem
  const handleImageLoaded = (imageUrl, postId) => {
    setLoadedImages((prevLoadedImages) => ({
      ...prevLoadedImages,
      [imageUrl]: true,
    }));

    // Define isLoading como false para a postagem atual
    setFeed((prevFeed) =>
      prevFeed.map((post) =>
        post._id === postId ? { ...post, isLoading: false } : post
      )
    );
  };

  const handleSave = async (postId, postOwnerId, post) => {
    try {
      const response = await fetch(
        `http://localhost:3000/feedRoutes/savePost`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            postOwnerId: postOwnerId,
            imageUrl: post,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao salvar a postagem");
      }

      // Atualize o estado local do post salvo
      setFeed((prevFeed) =>
        prevFeed.map((prevPost) =>
          prevPost._id === postId ? { ...prevPost, isSaved: true } : prevPost
        )
      );

      // Pode ser útil retornar algo daqui, se necessário
      return response.json();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaved = async (post, postOwnerId, imageUrl, postId) => {
    try {
      const response = await fetch(`http://localhost:3000/feedRoutes/saved`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          postOwnerId: postOwnerId,
          imageUrl: post.url,
        }),
      });
      if (!response.ok) {
        throw new Error("Erro ao excluir a postagem dos salvos");
      }

      // Atualize o estado local apenas para a postagem que foi removida dos salvos
      setFeed((prevFeed) =>
        prevFeed.map((prevPost) =>
          prevPost.url === imageUrl ? { ...prevPost, isSaved: false } : prevPost
        )
      );

      // Pode ser útil retornar algo daqui, se necessário
      return response.json();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchFeedAndCheckSaved = async () => {
      if (userId) {
        try {
          const response = await fetch(
            `http://localhost:3000/feedRoutes/feed/${userId}`
          );
          if (!response.ok) {
            throw new Error("Erro ao carregar o feed");
          }
          const data = await response.json();
          // Mapear os posts e definir isLoading como true inicialmente
          const updatedFeed = data.map((post) => ({
            ...post,
            isLoading: true,
          }));
          setFeed(updatedFeed);

          // Verificar e atualizar o estado de salvamento de cada post
          await Promise.all(
            updatedFeed.map(async (post) => {
              await checkSaved(post, post.userId._id); // Corrigido para passar o postOwnerId
            })
          );
        } catch (err) {
          setError("Erro ao carregar o feed");
        }
      }
    };
    fetchFeedAndCheckSaved();
  }, [userId]);

  // Função para verificar se a postagem foi salva e atualizar o estado local
  const checkSaved = async (post, postOwnerId) => {
    try {
      const response = await fetch(
        "http://localhost:3000/feedRoutes/SavedPost",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.id,
            postOwnerId: postOwnerId,
            imageUrl: post.url,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao verificar se a postagem foi salva");
      }
      const data = await response.json();
      setFeed((prevFeed) =>
        prevFeed.map((prevPost) =>
          prevPost._id === post._id
            ? { ...prevPost, isSaved: data.isSaved }
            : prevPost
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <main className="feed-page-container">
      <div className="feed-page">
        <h1 className="welcome-explore">Bem-vindo ao Explorar.</h1>
        <SidebarMenu /> {/* Menu */}
        {feed.map((post) => (
          <div
            key={post._id}
            className={`post ${post.isLoading ? "loading-skeleton" : ""}`}
          >
            <div className="post-header">
              {post.userId.profileImageUrl ? (
                <a href={`/profile/${post.userId._id}`}>
                  <img
                    src={post.userId.profileImageUrl}
                    alt={`${post.userId.firstName} ${post.userId.lastName}`}
                    className={`profile-image-feed ${
                      post.isLoading ? "loading-skeleton" : ""
                    }`}
                    onLoad={() => handleImageLoaded(post.url)}
                  />
                </a>
              ) : (
                <a href={`/profile/${post.userId._id}`}>
                  <AiOutlineUser className="profile-icon-profile" />
                </a>
              )}
              <a href={`/profile/${post.userId._id}`}>
                <p
                  className={`username-feed ${
                    post.isLoading ? "loading-skeleton" : ""
                  }`}
                  onClick={() => setSelectedUserId(post.userId._id)}
                >
                  {`${post.userId.username}`}
                </p>
              </a>
            </div>
            <img
              src={post.url}
              alt="Imagem da galeria"
              className={`post-image ${
                post.isLoading ? "loading-skeleton" : ""
              }`}
              style={{
                opacity: loadedImages[post.url] ? 1 : 0,
                transition: "opacity 0.5s",
              }}
              onLoad={() => handleImageLoaded(post.url)}
            />
            <div className="post-info">
              <div className="contain-like-feed">
                <button
                  onClick={() => {
                    if (post.isLiked) {
                      unlikePost(post._id, post.userId._id, post.url, user.id);
                    } else {
                      likePost(post._id, post.userId._id, post.url, user.id);
                    }
                  }}
                >
                  {post.isLiked ? (
                    <>
                      <AiFillFire
                        className="like filled"
                        style={{
                          opacity: loadedImages[post.url] ? 1 : 0,
                          transition: "opacity 0.5s",
                        }}
                        onLoad={() => handleImageLoaded(post.url)}
                      />
                    </>
                  ) : (
                    <>
                      <AiOutlineFire
                        className="like-feed"
                        style={{
                          opacity: loadedImages[post.url] ? 1 : 0,
                          transition: "opacity 0.5s",
                        }}
                        onLoad={() => handleImageLoaded(post.url)}
                      />
                    </>
                  )}
                </button>
              </div>
              <button
                className={`view-likes-button ${
                  post.isLoading ? "loading-skeleton" : ""
                }`}
                onClick={() => handleViewLikes(post.url)}
                style={{
                  opacity: loadedImages[post.url] ? 1 : 0,
                  transition: "opacity 0.5s",
                }}
                onLoad={() => handleImageLoaded(post.url)}
              >
                Ver quem curtiu
              </button>
              {post.isSaved ? (
                <FaBookmark
                  className={`save-icon saved ${
                    post.isLoading ? "loading-skeleton" : ""
                  }`}
                  style={{
                    opacity: loadedImages[post.url] ? 1 : 0,
                    transition: "opacity 0.5s",
                  }}
                  onClick={() =>
                    handleSaved(post, post.userId._id, post.url, post._id)
                  }
                />
              ) : (
                <FaRegBookmark
                  className={`save-icon ${
                    post.isLoading ? "loading-skeleton" : ""
                  }`}
                  style={{
                    opacity: loadedImages[post.url] ? 1 : 0,
                    transition: "opacity 0.5s",
                  }}
                  onClick={() =>
                    handleSave(post._id, post.userId._id, post.url)
                  }
                />
              )}

              <p
                className={`post-date-feed ${
                  post.isLoading ? "loading-skeleton" : ""
                }`}
                style={{
                  opacity:
                    loadedImages[post.postedAt] !== undefined
                      ? loadedImages[post.postedAt]
                        ? 1
                        : 0
                      : 1,
                  transition: "opacity 0.9s",
                }}
                onLoad={() => handleImageLoaded(post.postedAt)}
              >
                Publicado em: {new Date(post.postedAt).toLocaleString()}
              </p>
            </div>
            {modalOpen && (
              <div className="feed-modal">
                <div className="modal-content-feed">
                  <span className="close-feed-modal" onClick={closeModal}>
                    &times;
                  </span>

                  {modalUsers.length > 0 ? (
                    <ul className="feed-modal-list">
                      {" "}
                      <h2
                        className="feed-modal-title"
                        onLoad={() => handleImageLoaded(post.userId)}
                      >
                        Usuários que curtiram o post:
                      </h2>
                      {modalUsers.map((user) => (
                        <li className="feed-modal-item" key={user.userId}>
                          {post.userId.profileImageUrl ? (
                            <a href={`/profile/${user.userId._id}`}>
                              <img
                                src={user.profileImageUrl}
                                alt="Imagem da galeria"
                                className="rounded-image-message-feed"
                              />
                            </a>
                          ) : (
                            <a href={`/profile/${user.userId._id}`}>
                              <AiOutlineUser className="profile-icon-profile" />
                            </a>
                          )}
                          <a href={`/profile/${user.userId._id}`}>
                            {user.username}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="no-likes">
                      Nenhum usuário curtiu esta postagem ainda.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <h1 className="end-explore">Você chegou no fim.</h1>
    </main>
  );
};

export default FeedPage;
