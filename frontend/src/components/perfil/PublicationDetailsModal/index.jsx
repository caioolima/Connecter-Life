import "./style.css";
import { useRef, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useMyContext } from "../../../contexts/profile-provider";
import useEventsModals from "../hooks/useEventsModals";
import { AiOutlineLike } from "react-icons/ai";
import {
  FaArrowAltCircleRight,
  FaArrowAltCircleLeft,
  FaEllipsisH,
} from "react-icons/fa";
import { MdOutlineSwipe } from "react-icons/md";

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
          // Dragged to the right
          if (!showDeleteModal) {
            goToNextImage();
          }
        } else {
          // Dragged to the left
          if (!showDeleteModal) {
            goToPreviousImage();
          }
        }
      }
    }
    touchStartX.current = null; // Reseta a posição inicial do toque
    touchEndX.current = null; // Reseta a posição final do toque
  };

  useEffect(() => {
    const closeOnOutsideClick = (e) => {
      if (!showDeleteModal && e.target.classList.contains("overlay")) {
        handleClosePhotoModal();
      }
    };

    const overlay = document.querySelector(".overlay");
    overlay.addEventListener("mousedown", closeOnOutsideClick);

    return () => {
      overlay.removeEventListener("mousedown", closeOnOutsideClick);
    };
  }, [showDeleteModal, handleClosePhotoModal]);

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
  return (
    <>
      <div className="overlay" onClick={handleClosePhotoModal}></div>
      <div className="post-modal">
        <div className="modal-image-container">
          <div className="content-post">
            <div className="image-contain">
              <button className="modal-close" onClick={handleClosePhotoModal}>
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
              <MdOutlineSwipe className="swipe" />
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
              <AiOutlineLike className="like" />
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
