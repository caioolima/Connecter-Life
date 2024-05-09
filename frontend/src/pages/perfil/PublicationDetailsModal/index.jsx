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

  const {
    handleClosePhotoModal,
    goToPreviousImage,
    goToNextImage,
  } = useEventsModals();

  const [postTime, setPostTime] = useState(""); // Estado para armazenar o tempo de postagem formatado

  // Adicione uma nova variável de estado para armazenar o ID do usuário que fez a postagem
  const [postUserId, setPostUserId] = useState("");
  const { user } = useAuth();
  const isOwner = user && user.id === userId;

  useEffect(() => {
    calculatePostTime(); // Chame a função para calcular o tempo de postagem formatado
  }, []);

  // Atualize o useEffect para configurar o ID do usuário que fez a postagem
  useEffect(() => {
    if (userPhotos[currentImageIndex]) {
      setPostUserId(userPhotos[currentImageIndex].userId);
    }
  }, [currentImageIndex, userPhotos]);

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
          }
        } else {
          // Arrastado para a esquerda
          if (!showDeleteModal) {
            goToPreviousImage();
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
      const url = `http://localhost:3000/${userId}/gallery-image/${encodeURIComponent(
        userPhotos[currentImageIndex].url
      )}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir imagem");
      }

      // Atualize o estado da galeria do usuário após a exclusão, se necessário
      // Isso pode envolver uma chamada à API para obter as imagens atualizadas após a exclusão
      console.log("Imagem excluída com sucesso!");
      handleClosePhotoModal(); // Feche o modal após a exclusão, se necessário
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

  return (
    <>
      <div className="overlay" onClick={handleOverlayClick}></div>
      <div className="post-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-image-container">
          <div className="content-post">
            <div className="image-contain">
              <button className="modal-close" onClick={handleCloseButtonClick}>
                &times;
              </button>
              {/* Botão de navegação esquerdo */}
              <button
                className={`nav-button left ${
                  previousButtonDisabled || showDeleteModal ? "disabled" : ""
                }`}
                onClick={!showDeleteModal ? goToPreviousImage : undefined}
                disabled={previousButtonDisabled || showDeleteModal}
              >
                <FaArrowAltCircleLeft className="arrows" />
              </button>
              {selectedImageLoaded ? (
                <img
                  ref={imageRef}
                  src={userPhotos[currentImageIndex].url}
                  alt="Imagem selecionada"
                  className={`selected-publication-photo ${fadeState}`}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onLoad={() => console.log("Imagem carregada com sucesso!")}
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
  );
};

export default PublicationDetailsModal;
