import React, { useEffect, useState } from "react";
import "./UserProfile.css";
import { useParams, useNavigate } from "react-router-dom";
import { useMyContext } from "../../contexts/profile-provider";
import { useAuth } from "../../hooks/use-auth";

/* Components */
import SidebarMenu from "./SidebarMenu/index";
import EditModal from "./EditModal/index";
import ChangePhotoModal from "./ChangePhotoModal/index";
import UploadPhotoModal from "./UploadPhotoModal/index";
import Galeria from "./Galeria/index";
import InfoProfile from "./InfoProfile/index";
import PublicationDetailsModal from "./PublicationDetailsModal/index";

/* Functions */
import useEventsModals from "./hooks/useEventsModals";
import useUploadModal from "./hooks/useUploadModal";
import usePhotoModal from "./hooks/usePhotoModal.jsx";

const UserProfileContainer = () => {
    const {
        setFullName,
        setUsername,
        setProfileImage,
        showModal,
        isEditMode,
        userPhotos,
        setUserPhotos,
        showPhotoModal,
        setShowPhotoModal,
        setIsOwnProfile,
        selectedPublicationModalOpen,
        setSelectedPhotoPosition,
        userDataLoaded,
        currentImageIndex,
        setNumberOfFollowers,
        setNumberOfFollowing,
        setNextButtonDisabled,
        setPreviousButtonDisabled,
        setSelectedImageLoaded,
        selectedImage
    } = useMyContext();

    const { getDataUser } = useEventsModals();
    const { getGalleryImages } = useUploadModal();
    const { verifyRelationship } = usePhotoModal();

    const { userId } = useParams();
    const { signOut, user } = useAuth();
    const navigate = useNavigate();

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

    useEffect(() => {
        const fetchFollowingCount = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/user/${userId}/following-count`
                );
                if (response.ok) {
                    const data = await response.json();
                    setNumberOfFollowing(data.numberOfFollowing);
                } else {
                    console.error(
                        "Erro ao obter o número de usuários seguidos:",
                        response.status
                    );
                }
            } catch (error) {
                console.error(
                    "Erro ao obter o número de usuários seguidos:",
                    error
                );
            }
        };

        fetchFollowingCount();
    }, [userId, setNumberOfFollowing]);

    useEffect(() => {
        // Limpar a imagem do perfil armazenada localmente ao carregar o perfil de um novo usuário
        localStorage.removeItem("profileImage");
    }, [userId]); // Adiciona userId como dependência para este useEffect

    useEffect(() => {
        const loggedInUserId = localStorage.getItem("userId");
        setIsOwnProfile(loggedInUserId === userId);
    }, [userId, setIsOwnProfile]);

    useEffect(() => {
        getDataUser();
    }, [getDataUser]);

    useEffect(() => {
        if (!userId) return; // Verifica se userId está definido antes de fazer a chamada para getDataUser
        getDataUser();
    }, [userId, getDataUser]); // Adiciona userId como dependência para este useEffect

    useEffect(() => {
        const storedFullName = localStorage.getItem("fullName");
        const storedUsername = localStorage.getItem("username");
        const storedProfileImage = localStorage.getItem("profileImage");

        if (storedFullName && storedUsername) {
            setFullName(storedFullName);
            setUsername(storedUsername);
            setProfileImage(storedProfileImage);
        }
        if (storedProfileImage) {
            setProfileImage(storedProfileImage);
        }
    }, [setFullName, setProfileImage, setUsername]);

    const openModalTwo = () => {
        setShowPhotoModal(true);
    };

    const handleSignOut = () => {
        signOut();
        navigate("/home");
    };

    useEffect(() => {
        getGalleryImages();
    }, [setUserPhotos, userId, getGalleryImages]);

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
        // Verifica se a lista de fotos do usuário está vazia ou se a foto atual é a última
        const isLastPhoto =
            userPhotos.length === 0 ||
            currentImageIndex === userPhotos.length - 1;
        setNextButtonDisabled(isLastPhoto);
    }, [userPhotos, currentImageIndex, setNextButtonDisabled]);

    useEffect(() => {
        // Verifica se a lista de fotos do usuário está vazia ou se a foto atual é a primeira
        const isFirstPhoto = userPhotos.length === 0 || currentImageIndex === 0;
        setPreviousButtonDisabled(isFirstPhoto);
    }, [userPhotos, currentImageIndex, setPreviousButtonDisabled]);

    useEffect(() => {
        if (user) {
            verifyRelationship();
        }
    }, [user, verifyRelationship]);

    return (
        <div className="container-p">
            <SidebarMenu
                userId={userId}
                handleSignOut={handleSignOut}
                openModalTwo={openModalTwo}
            />
            {selectedPublicationModalOpen && <PublicationDetailsModal />}
            <div className="page-full">
                {userDataLoaded && (
                    <div className="profile-container">
                        <InfoProfile />
                        <hr className="line-profile" />
                        <Galeria />
                    </div>
                )}
                {isEditMode && <EditModal />}
                {showModal && <ChangePhotoModal />}
                {showPhotoModal && <UploadPhotoModal />}
            </div>
        </div>
    );
};

export default UserProfileContainer;