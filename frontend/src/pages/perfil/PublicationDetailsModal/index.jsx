import "./style.css";
import { useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useMyContext } from "../../../contexts/profile-provider";
import useEventsModals from "../hooks/useEventsModals";
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
    likes,
    desactiveLike,
    setDesactiveLike,
    activeLike,
    setActiveLike,
    likesArray,
  } = useMyContext();

   // Verifica se a imagem atual está curtida
   const isLiked = likesArray[currentImageIndex] === "1";

  const {
    handleClosePhotoModal,
    goToPreviousImage,
    goToNextImage,
    handleLike,
    getLikes,
  } = useEventsModals();

  useEffect(() => {
    getLikes();
  }, []);

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
            getLikes();
          }
        } else {
          // Arrastado para a esquerda
          if (!showDeleteModal) {
            goToPreviousImage();
            getLikes();
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
  useEffect(() => {
    getLikes(); // Chama getLikes após a montagem do componente
  }, []); // Array vazio indica que este efeito ocorre apenas uma vez após a montagem


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
                {/* Exibir horário da postagem */}
                {userPhotos[currentImageIndex].postedAt && (
                  <p className="post-time">
                    Postado:{" "}
                    {new Date(
                      userPhotos[currentImageIndex].postedAt
                    ).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="contain-like" onClick={handleLike}>
                {isLiked ? (
                  <AiFillFire className="like filled" />
                ) : (
                  <AiOutlineFire className="like" />
                )}
              </div>

              {/* Botão para excluir a imagem */}
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PublicationDetailsModal;
