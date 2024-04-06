import { useState, useEffect } from "react";
import { useMyContext } from "../../../contexts/profile-provider.jsx";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/use-auth";

const useEventsModals = () => {
    const {
        setShowPhotoModal,
        setSelectedPublicationModalOpen,
        setSelectedImage,
        setUploadInProgress,
        username,
        fullName,
        modalDateOfBirth,
        setModalFullName,
        setModalDateOfBirth,
        userPhotos,
        setCurrentImageIndex,
        setSelectedImageLoaded,
        setShowModal,
        setEditMode,
        setNewUsername,
        setNewBiography,
        biography,
        setUsernameError,
        setPhoneError,
        setFadeState,
        setNumberOfFollowers,
        selectedImage,
        selectedPublicationModalOpen,
        setSelectedPhotoPosition,
        setLikes,
        currentImageIndex,
        likes,
        setDesactiveLike,
        setActiveLike
    } = useMyContext();

    const { userId } = useParams();
    const navigate = useNavigate();
    const { user, signOut } = useAuth();

    const handleClosePhotoModal = () => {
        setShowPhotoModal(false); // Fecha o modal
        setSelectedPublicationModalOpen(false); // Fecha o modal da publicação selecionada
        setSelectedImageLoaded(false);
        setSelectedImage(null); // Limpa a imagem selecionada
        setUploadInProgress(false); // Define uploadInProgress como false
        document.body.style.overflow = "auto"; // Restaura a barra de rolagem quando o modal é fechado
        setCurrentImageIndex(0); // Redefinir o índice da imagem selecionada para o primeiro ao fechar o setSelectedPublicationModalOpen
    };

    const handlePublicationClick = (index, event) => {
        setCurrentImageIndex(index); // Definir o índice da imagem clicada
        setSelectedPublicationModalOpen(true);
        setSelectedImage(userPhotos[index].url); // Definir a URL da imagem selecionada
        getLikes()
        document.body.style.overflow = "hidden"; // Impedir que a página role enquanto o modal estiver aberto
    };

    // Função para ir para a imagem anterior na galeria
    const goToPreviousImage = () => {
        getLikes();
        setFadeState("fade-out");
        setTimeout(() => {
            setCurrentImageIndex(prevIndex =>
                prevIndex === 0 ? userPhotos.length - 1 : prevIndex - 1
            );
            setFadeState("fade-in");
        }, 50);
    };

    const goToNextImage = () => {
        getLikes();
        setFadeState("fade-out");
        setTimeout(() => {
            setCurrentImageIndex(
                prevIndex => (prevIndex + 1) % userPhotos.length
            );
            setFadeState("fade-in");
        }, 50);
    };

    const openModal = () => {
        setShowModal(true);
    };

    const openModalTwo = () => {
        setShowPhotoModal(true);
    };

    const handlePublishClick = () => {
        openModalTwo(user && user.id);
    };

    const handleSignOut = () => {
        signOut();
        navigate("/home");
    };

    const handleEditClick = () => {
        setEditMode(true);
        setNewUsername(username);
        setModalFullName(fullName);
        setModalDateOfBirth(modalDateOfBirth);
        setNewBiography(biography); // Define a biografia atual no campo de edição
        setUsernameError(""); // Limpa o estado de erro de nome de usuário
        setPhoneError("");
    };

    useEffect(() => {
        if (selectedPublicationModalOpen && selectedImage) {
            setSelectedPhotoPosition({
                x: window.innerWidth / 2,
                y: window.innerHeight / 2
            });

            const img = new Image();
            img.onload = () => {
                setSelectedImageLoaded(true);
            };
            img.src = selectedImage;
        }
    }, [
        selectedPublicationModalOpen,
        selectedImage,
        setSelectedImageLoaded,
        setSelectedPhotoPosition
    ]);

    useEffect(() => {
        const fetchFollowersCount = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/relationship/${userId}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setNumberOfFollowers(data.numberOfFollowers);
                } else {
                    console.error(
                        "Erro ao obter o número de seguidores:",
                        response.status
                    );
                }
            } catch (error) {
                console.error("Erro ao obter o número de seguidores:", error);
            }
        };

        fetchFollowersCount();
    }, [userId, setNumberOfFollowers]);

    const [likeUpdate, setLikeUpdate] = useState();

    const getLikes = async () => {
        try {
            const token = localStorage.getItem("token");

            const url = `http://localhost:3000/${userId}/gallery-image/${encodeURIComponent(
                userPhotos[currentImageIndex].url
            )}/verify`;

            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setLikes(data.likesCount.toString());
            } else {
                console.log("não enviado");
            }
        } catch (error) {
            console.log("Erro!");
        }
    };

    useEffect(() => {
        getLikes();
    }, []);

    const handleRemoveLike = async () => {
        try {
            const token = localStorage.getItem("token");

            const url = `http://localhost:3000/${userId}/gallery-image/${encodeURIComponent(
                userPhotos[currentImageIndex].url
            )}/unlike`;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.ok) {
                console.log("Like Removido");
                getLikes();
                alert(likes)
            } else {
                console.log("Like não removido");
            }
        } catch (error) {
            console.log("Erro!");
        }
    };

    const handleLike = async () => {
        try {
            const token = localStorage.getItem("token");

            const url = `http://localhost:3000/${userId}/gallery-image/${encodeURIComponent(
                userPhotos[currentImageIndex].url
            )}/like`;

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            if (likes === "1") {
                handleRemoveLike();
            }

            if (response.ok) {
                console.log("Like enviado.");
                getLikes();
                alert(likes);
            } else {
                console.log("Like não enviado");
            }
        } catch (error) {
            console.log("Erro!");
        }
    };

    useEffect(() => {
        if (likes === "1") {
            setDesactiveLike("hidden");
            setActiveLike("show");
        } else {
            setDesactiveLike("show");
            setActiveLike("hidden");
        }
    }, [likes]);

    return {
        handleClosePhotoModal,
        handlePublicationClick,
        handleEditClick,
        openModal,
        goToPreviousImage,
        goToNextImage,
        openModalTwo,
        handleSignOut,
        handlePublishClick,
        handleLike,
        getLikes
    };
};

export default useEventsModals;
