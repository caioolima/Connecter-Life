import "./style.css";
import { useRef, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMyContext } from "../../../contexts/profile-provider";
import useEventsModals from "../hooks/useEventsModals";
import { useAuth } from "../../../hooks/use-auth";
import {
  FaArrowAltCircleRight,
  FaArrowAltCircleLeft,
  FaEllipsisH,
} from "react-icons/fa";

import { AiFillFire, AiOutlineFire } from "react-icons/ai"; // Importe o ícone de fogo

const PublicationDetailsModal = () => {
  const { userId } = useParams();
  const {
    previousButtonDisabled,
    selectedImageLoaded,
    userPhotos,
    currentImageIndex,
    nextButtonDisabled,
    profileImage,
    username,
    fadeState,
    setDeleting,
    showDeleteModal,
    setShowDeleteModal,
  } = useMyContext();

  const { handleClosePhotoModal, goToPreviousImage, goToNextImage } =
    useEventsModals();

  const [postTime, setPostTime] = useState(""); // Estado para armazenar o tempo de postagem formatado
  const { user } = useAuth();
  const isOwner = user && user.id === userId;
  const [isLiked, setIsLiked] = useState(false); // Estado para indicar se a imagem foi curtida pelo usuário
  const [isModalLoaded, setIsModalLoaded] = useState(false); // Estado para indicar se o modal está carregado

  useEffect(() => {
    setIsModalLoaded(true); // Altera o estado para indicar que o modal está carregado
    calculatePostTime(); // Chama a função para calcular o tempo de postagem formatado
    checkLikeStatus(); // Verifica o status de curtida quando o modal é aberto
  }, [currentImageIndex]); // Chama checkLikeStatus sempre que currentImageIndex mudar

  // Função para calcular o tempo de postagem formatado
  const calculatePostTime = () => {
    const postedAt = userPhotos[currentImageIndex].postedAt;
    const currentTime = new Date().getTime();
    const difference = currentTime - new Date(postedAt).getTime();
    const seconds = Math.floor(difference / 1000);
    let timeAgo = "";

    if (seconds < 60) {
      timeAgo = `${seconds} segundo${seconds === 1 ? "" : "s"} atrás`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      timeAgo = `${minutes} minuto${minutes === 1 ? "" : "s"} atrás`;
    } else if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      timeAgo = `${hours} hora${hours === 1 ? "" : "s"} atrás`;
    } else if (seconds < 2592000) {
      const days = Math.floor(seconds / 86400);
      timeAgo = `${days} dia${days === 1 ? "" : "s"} atrás`;
    } else if (seconds < 31536000) {
      const months = Math.floor(seconds / 2592000);
      timeAgo = `${months} mês${months === 1 ? "" : "es"} atrás`;
    } else {
      const years = Math.floor(seconds / 31536000);
      timeAgo = `${years} ano${years === 1 ? "" : "s"} atrás`;
    }

    setPostTime(timeAgo);
  };

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const imageRef = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const difference = touchEndX.current - touchStartX.current;
      if (Math.abs(difference) > 50) {
        // Se o movimento for maior que 50 pixels
        if (difference > 0) {
          // Arrastado para a direita
          if (!showDeleteModal) {
            goToNextImage();
            checkLikeStatus();
          }
        } else {
          // Arrastado para a esquerda
          if (!showDeleteModal) {
            goToPreviousImage();
            checkLikeStatus();
          }
        }
      }
    }
    touchStartX.current = null; // Reseta a posição inicial do toque
    touchEndX.current = null; // Reseta a posição final do toque
  };

  const handleOpenDeleteModal = () => {
    setShowDeleteModal(true); // Define o estado para mostrar o modal de exclusão ao clicar no botão
  };

  const handleDeleteImage = async () => {
    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      const url = `http://localhost:3000/${userId}/gallery`;
  
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          url: userPhotos[currentImageIndex].url,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Erro ao excluir imagem");
      }
  
      console.log("Imagem excluída com sucesso!");
      handleClosePhotoModal();
      window.location.reload();
    } catch (error) {
      console.error("Erro ao excluir imagem:", error);
    } finally {
      setDeleting(false);
    }
  };
  

  const handleOverlayClick = () => {
    // Fecha o modal de publicação apenas se o modal de exclusão não estiver aberto
    if (!showDeleteModal) {
      handleClosePhotoModal();
    }
  };

  const handleCloseButtonClick = () => {
    // Fecha o modal de publicação apenas se o modal de exclusão não estiver aberto
    if (!showDeleteModal) {
      handleClosePhotoModal();
    }
  };

  const handleLikeImage = async () => {
    try {
      if (isLiked) {
        console.log("Você já curtiu esta imagem.");
        return; // Não faz nada se o usuário já curtiu a imagem
      }
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/${userId}/gallery/like`, // Ajuste a URL para corresponder à rota correta
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Adicione cabeçalhos de autenticação, se necessário
          },
          body: JSON.stringify({
            url: userPhotos[currentImageIndex].url,
            likerId: user.id,
          }), // Envie a URL da imagem e o ID do usuário que curtiu
        }
      );

      if (response.ok) {
        setIsLiked(true); // Atualize o estado para refletir que o usuário curtiu a imagem
      } else {
        const data = await response.json();
        console.error("Erro ao curtir imagem:", data.message);
      }
    } catch (error) {
      console.error("Erro ao curtir imagem:", error);
    }
  };

    // Função para descurtir a imagem
    const handleUnlikeImage = async () => {
      try {
        if (!isLiked) {
          console.log("Você não curtiu esta imagem.");
          return; // Não faz nada se o usuário não curtiu a imagem
        }
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/${userId}/gallery/unlike`, // Ajuste a URL para corresponder à rota correta
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Adicione cabeçalhos de autenticação, se necessário
            },
            body: JSON.stringify({
              url: userPhotos[currentImageIndex].url,
              likerId: user.id,
            }), // Envie a URL da imagem e o ID do usuário que descurtiu
          }
        );
  
        if (response.ok) {
          setIsLiked(false); // Atualize o estado para refletir que o usuário descurtiu a imagem
        } else {
          const data = await response.json();
          console.error("Erro ao descurtir imagem:", data.message);
        }
      } catch (error) {
        console.error("Erro ao descurtir imagem:", error);
      }
    };
    
  // Função para verificar o status de curtida
  // const checkLikeStatus = async () => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     const response = await fetch(
  //       `http://localhost:3000/${userId}/gallery/${encodeURIComponent(
  //         userPhotos[currentImageIndex].url
  //       )}/check-like/${user.id}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );
  //     if (response.ok) {
  //       const data = await response.json();
  //       setIsLiked(data.userLiked); // Atualiza o estado com base na resposta da API
  //     } else {
  //       console.error("Erro ao verificar status do like:", response.statusText);
  //     }
  //   } catch (error) {
  //     console.error("Erro ao verificar status do like:", error);
  //   }
  // };
  // Função para verificar se o usuário curtiu a imagem
  const checkLikeStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/gallery/${userId}/gallery/likes`, 
        {
          method: "POST", // A API espera um método POST para verificar likes
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Adicione cabeçalhos de autenticação, se necessário
          },
          body: JSON.stringify({ ImageUrl: userPhotos[currentImageIndex].url }) // Envie a URL da imagem no corpo da requisição
        }
      );
      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.userLiked); // Atualiza o estado com base na resposta da API
      } else {
        console.error("Erro ao verificar status do like2:", response.statusText);
      }
    } catch (error) {
      console.error("Erro ao verificar status do like2:", error);
    }
  };
  return (
    <>
      {isModalLoaded && (
        <>
          <div className="overlay" onClick={handleOverlayClick}></div>
          <div className="post-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-image-container">
              <div className="content-post">
                <div className="image-contain">
                  <button
                    className="modal-close"
                    onClick={handleCloseButtonClick}
                  >
                    &times;
                  </button>
                  {/* Botão de navegação esquerdo */}
                  <button
                    className={`nav-button left ${
                      previousButtonDisabled || showDeleteModal
                        ? "disabled"
                        : ""
                    }`}
                    onClick={!showDeleteModal ? goToPreviousImage : undefined}
                    disabled={previousButtonDisabled || showDeleteModal}
                  >
                    <FaArrowAltCircleLeft className="arrows" />
                  </button>
                  {selectedImageLoaded ? (
                    <img
                      src={userPhotos[currentImageIndex].url}
                      alt="Imagem selecionada"
                      className={`selected-publication-photo ${fadeState}`}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      onLoad={() =>
                        console.log("Imagem carregada com sucesso!")
                      }
                    />
                  ) : (
                    <div className="loading-text">Carregando...</div>
                  )}

                  {/* Botão de navegação direito */}
                  <button
                    className={`nav-button right ${
                      nextButtonDisabled || showDeleteModal ? "disabled" : ""
                    }`}
                    onClick={!showDeleteModal ? goToNextImage : undefined}
                    disabled={nextButtonDisabled || showDeleteModal}
                  >
                    <FaArrowAltCircleRight className="arrows" />
                  </button>
                </div>
                {/* Detalhes do usuário */}
                <div className="user-details">
                  <Link to={`/profile/${userId}`}>
                    <img
                      className="rounded-image"
                      src={profileImage}
                      alt="Profile"
                    />
                  </Link>
                  <div className="text-content">
                    <p className="details-user">
                      <Link to={`/profile/${userId}`}>{username}</Link>
                    </p>
                    {/* Exibir tempo de postagem */}
                    <p className="post-time">{postTime}</p>
                  </div>
                  <div className="contain-like">
                    {/* Renderiza o botão de like */}
                    <button
                      onClick={isLiked ? handleUnlikeImage : handleLikeImage}
                    >
                      {isLiked ? (
                        <AiFillFire className="like filled" />
                      ) : (
                        <AiOutlineFire className="like" />
                      )}
                    </button>
                  </div>
                  {/* Botão para excluir a imagem se o usuário for o proprietário */}
                  {isOwner && (
                    <div className="delete-menu">
                      <button
                        className="delete-menu-button"
                        onClick={handleOpenDeleteModal}
                      >
                        <FaEllipsisH />
                      </button>
                      {/* Modal de exclusão de imagem */}
                      {showDeleteModal && (
                        <div className="modal-modal">
                          <div className="modal-content-modal">
                            <p className="text-delete-modal">
                              Deseja realmente excluir esta imagem?
                            </p>
                            <div className="modal-buttons-modal">
                              <button onClick={handleDeleteImage}>Sim</button>
                              <button onClick={() => setShowDeleteModal(false)}>
                                Não
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default PublicationDetailsModal;
