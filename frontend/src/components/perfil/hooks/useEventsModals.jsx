import { useCallback } from "react";
import { useMyContext } from "../../../contexts/profile-provider.jsx";
import { useParams } from "react-router-dom";

const useEventsModals = () => {
    const {
        setShowPhotoModal,
        setSelectedPublicationModalOpen,
        setSelectedImage,
        setUploadInProgress,
        setFullName,
        setUsername,
        username,
        fullName,
        modalDateOfBirth,
        setModalFullName,
        setModalDateOfBirth,
        setPhoneNumber,
        setProfileImage,
        setCountryCode,
        setBiography,
        setUserDataLoaded,
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
        setFadeState
    } = useMyContext();

    const { userId } = useParams();

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
        document.body.style.overflow = "hidden"; // Impedir que a página role enquanto o modal estiver aberto
    };
    
    // Função para ir para a imagem anterior na galeria
    const goToPreviousImage = () => {
        setFadeState('fade-out');
        setTimeout(() => {
            setCurrentImageIndex(prevIndex =>
                prevIndex === 0 ? userPhotos.length - 1 : prevIndex - 1)
            setFadeState('fade-in')
        }, 50);
    };
    
    const goToNextImage = () => {
        setFadeState('fade-out');
        setTimeout(() => {
            setCurrentImageIndex(prevIndex => (prevIndex + 1) % userPhotos.length);
            setFadeState('fade-in');
        }, 50);
    };

    const getDataUser = useCallback(async () => {
        try {
            setUserDataLoaded(false);
            const token = localStorage.getItem("token");
            const storedBiography = localStorage.getItem("biography");

            if (storedBiography) {
                setBiography(storedBiography);
            } else {
                const res = await fetch(
                    `http://localhost:3000/users/${userId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                if (res.ok) {
                    const responseBody = await res.json();
                    if (responseBody) {
                        setFullName(
                            `${responseBody.firstName} ${responseBody.lastName}`
                        );
                        setUsername(responseBody.username);
                        setModalFullName(
                            `${responseBody.firstName} ${responseBody.lastName}`
                        );
                        setModalDateOfBirth(responseBody.dob);
                        const ddd = extractDDD(responseBody.phone);
                        const countryCode = getCountryCodeFromDDD(ddd);
                        setCountryCode(countryCode);

                        if (responseBody.profileImageUrl) {
                            setProfileImage(responseBody.profileImageUrl);
                        } else {
                            setProfileImage("");
                        }

                        setBiography(responseBody.biography);
                        setPhoneNumber(responseBody.phone);
                        setUserDataLoaded(true);
                    } else {
                        console.error(
                            "Erro ao obter os dados do usuário: responseBody não definido"
                        );
                    }
                } else {
                    console.error(
                        "Erro ao obter os dados do usuário:",
                        res.status
                    );
                }
            }
        } catch (error) {
            console.error("Erro ao obter os dados do usuário:", error);
        }
    }, [
        userId,
        setFullName,
        setUsername,
        setModalFullName,
        setModalDateOfBirth,
        setPhoneNumber,
        setProfileImage,
        setCountryCode,
        setBiography,
        setUserDataLoaded
    ]);

    const openModal = () => {
        setShowModal(true);
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

    // Função para extrair o DDD do número de telefone
    function extractDDD(phoneNumber) {
        // Extraindo os primeiros dígitos que representam o DDD
        return phoneNumber.substring(0, 2); // Assumindo que o DDD tem 2 dígitos
    }

    // Função para mapear o DDD para o código do país
    function getCountryCodeFromDDD(ddd) {
        // Mapeando o DDD para o código do país
        switch (ddd) {
            case "11":
                return "BR"; // Se o DDD for 11, assumimos que é do Brasil (código BR)
            case "1":
                return "US"; // Se o DDD for 1, assumimos que é dos Estados Unidos (código US)
            // Adicione mais casos conforme necessário para outros DDDs e códigos de país
            default:
                return ""; // Retornar vazio se o DDD não for reconhecido
        }
    }

    return {
        handleClosePhotoModal,
        handlePublicationClick,
        handleEditClick,
        getDataUser,
        openModal,
        goToPreviousImage,
        goToNextImage
    };
};

export default useEventsModals;
