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
import LoadingScreen from "../LoadingScreen/loadingscreen.jsx";

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
    selectedImage,
  } = useMyContext();

  const { getDataUser } = useEventsModals();
  const { getGalleryImages } = useUploadModal();
  const { verifyRelationship } = usePhotoModal();

  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento das imagens
  const { userId } = useParams();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Define um temporizador para esperar 5 segundos antes de definir o estado de loading como falso
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    return () => clearTimeout(timer); // Limpa o temporizador ao desmontar o componente
  }, []); // Executa apenas uma vez após o primeiro render

  useEffect(() => {
    const fetchFollowersCount = async () => {
      try {
        const response = await fetch(`http://localhost:3000/relationship/${userId}`);
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
    const token = localStorage.getItem("token");
    const visitedBefore = localStorage.getItem("visitedBefore");

    if (!token) {
      navigate("/home");
    } else {
      // Se o usuário já visitou antes, não mostrar a tela de carregamento
      if (visitedBefore) {
        setLoading(false);
      } else {
        // Define visitedBefore como true para indicar que o usuário já visitou a página
        localStorage.setItem("visitedBefore", true);
      }
    }
  }, [navigate]);
  
  useEffect(() => {
    // Quando o usuário fizer logout, redefinir visitedBefore para false
    return () => {
      localStorage.removeItem("visitedBefore");
    };
  }, []);

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
        y: window.innerHeight / 2,
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
    setSelectedPhotoPosition,
  ]);

  useEffect(() => {
    // Verifica se a lista de fotos do usuário está vazia ou se a foto atual é a última
    const isLastPhoto =
      userPhotos.length === 0 || currentImageIndex === userPhotos.length - 1;
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

  if (loading || !user) {
    // Se os dados do usuário estiverem carregando ou não estiverem disponíveis, exiba a tela de carregamento
    return <LoadingScreen />;
  }

  return (
    <>
      {selectedPublicationModalOpen && <PublicationDetailsModal />}
      <div className={`page-container`}>
        <SidebarMenu
          userId={userId}
          handleSignOut={handleSignOut}
          openModalTwo={openModalTwo}
        />
        {userDataLoaded && (
          <div className="profile-container">
            <InfoProfile />
            <Galeria />
          </div>
        )}
        {isEditMode && <EditModal />}
        {showModal && <ChangePhotoModal />}
        {showPhotoModal && <UploadPhotoModal />}
      </div>
    </>
  );
};

export default UserProfileContainer;