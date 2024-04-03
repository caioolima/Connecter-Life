import "./style.css";
import { useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { useMyContext } from "../../../contexts/profile-provider";
import useEventsModals from "../hooks/useEventsModals";
import { AiOutlineLike } from "react-icons/ai";
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";
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
        fadeState
    } = useMyContext();

    const { handleClosePhotoModal, goToPreviousImage, goToNextImage } =
        useEventsModals();

    const touchStartX = useRef(null);
    const touchEndX = useRef(null);
    const imageRef = useRef(null);

    const handleTouchStart = e => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = e => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current !== null && touchEndX.current !== null) {
            const difference = touchEndX.current - touchStartX.current;
            if (Math.abs(difference) > 50) {
                // Se o movimento for maior que 50 pixels
                if (difference > 0) {
                    // Dragged to the right
                    goToNextImage();
                } else {
                    // Dragged to the left
                    goToPreviousImage();
                }
            }
        }
        touchStartX.current = null; // Reseta a posição inicial do toque
        touchEndX.current = null; // Reseta a posição final do toque
    };

    return (
        <>
            <div className="overlay" onClick={handleClosePhotoModal}></div>
            <div className="post-modal">
                <div className="modal-image-container">
                    <div className="content-post">
                        <div className="image-contain">
                            <button
                                className="modal-close"
                                onClick={handleClosePhotoModal}>
                                &times;
                            </button>
                            {/* Botão de navegação esquerdo */}
                            <button
                                className={`nav-button left ${
                                    previousButtonDisabled ? "disabled" : ""
                                }`}
                                onClick={goToPreviousImage}
                                disabled={previousButtonDisabled}>
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
                                    onLoad={() =>
                                        console.log(
                                            "Imagem carregada com sucesso!"
                                        )
                                    }
                                />
                            ) : (
                                <div className="loading-text-2">
                                    Carregando...
                                </div>
                            )}
                            {/* Botão de navegação direito */}
                            <button
                                className={`nav-button right ${
                                    nextButtonDisabled ? "disabled" : ""
                                }`}
                                onClick={goToNextImage}
                                disabled={nextButtonDisabled}>
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
                                    <Link to={`/profile/${userId}`}>
                                        {username}
                                    </Link>
                                </p>
                                {/* Exibir horário da postagem */}
                                {userPhotos[currentImageIndex].postedAt && (
                                    <p className="post-time">
                                        Postado:{" "}
                                        {new Date(
                                            userPhotos[
                                                currentImageIndex
                                            ].postedAt
                                        ).toLocaleString()}
                                    </p>
                                )}
                            </div>
                            <AiOutlineLike className="like" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PublicationDetailsModal;
