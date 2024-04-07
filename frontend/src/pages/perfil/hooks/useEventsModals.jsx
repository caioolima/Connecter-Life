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
    setActiveLike,
    setLikesArray, // Adicionando a função setLikesArray
    likesArray, // Adicionando likesArray para o estado dos likes
    setActiveLikeClass, // Renomeando setActiveLike para setActiveLikeClass
    setInactiveLikeClass, // Renomeando setDesactiveLike para setInactiveLikeClass
  } = useMyContext();

  const { userId } = useParams();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isLiked, setIsLiked] = useState(false);

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
    getLikes();
    document.body.style.overflow = "hidden"; // Impedir que a página role enquanto o modal estiver aberto
  };

  // Função para ir para a imagem anterior na galeria
  const goToPreviousImage = () => {
    getLikes();
    setFadeState("fade-out");
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? userPhotos.length - 1 : prevIndex - 1
      );
      setFadeState("fade-in");
    }, 50);
  };

  const goToNextImage = () => {
    getLikes();
    setFadeState("fade-out");
    setTimeout(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % userPhotos.length);
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
        y: window.innerHeight / 2,
      });

      setSelectedImageLoaded(false); // Definir como falso ao iniciar o carregamento

      const img = new Image();
      img.onload = () => {
        setSelectedImageLoaded(true); // Definir como verdadeiro quando a imagem estiver carregada
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
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLikesArray((prevLikesArray) => {
          const newLikesArray = [...prevLikesArray];
          newLikesArray[currentImageIndex] = data.likesCount.toString();
          return newLikesArray;
        });
      } else {
        console.log("Falha ao obter os likes");
      }
    } catch (error) {
      console.log("Erro ao obter os likes:", error);
    }
  };

  useEffect(() => {
    getLikes();
  }, [currentImageIndex]);
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
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        console.log("Like Removido");
        // Remova a curtida localmente
        setLikesArray((prevLikesArray) => {
          const newLikesArray = [...prevLikesArray];
          newLikesArray[currentImageIndex] = "0";
          return newLikesArray;
        });
        getLikes(); // Recupera os likes atualizados após a remoção
      } else {
        console.log("Like não removido");
      }
    } catch (error) {
      console.log("Erro ao remover o like:", error);
    }
  };
  

  const handleLike = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("Token não encontrado. Usuário não autenticado.");
        return;
      }

      const userPhoto = userPhotos[currentImageIndex];
      if (!userPhoto) {
        console.log("Foto não encontrada.");
        return;
      }

      const url = `http://localhost:3000/${userId}/gallery-image/${encodeURIComponent(
        userPhoto.url
      )}/like`;

      // Verificar se o like já foi adicionado
      const isAlreadyLiked = likesArray[currentImageIndex] === "1";

      if (isAlreadyLiked) {
        // Se já foi curtido, remove a curtida localmente
        handleRemoveLike();
        
        // Atualizar localmente o estado de likes imediatamente após a interação do usuário
        setIsLiked(!isLiked); // Inverte o estado de curtida
        // Chama getLikes para atualizar a contagem de likes do servidor (opcional)
        getLikes(); // Chama a função para buscar os likes atualizados do servidor
      } else {
        // Se ainda não foi curtido, adicione a curtida localmente
        setLikesArray((prevLikesArray) => {
          const newLikesArray = [...prevLikesArray];
          newLikesArray[currentImageIndex] = "1";
          return newLikesArray;
        });
        // Envie a solicitação para adicionar a curtida
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          console.log("Like enviado.");
          getLikes();
        } else {
          console.log("Erro ao enviar o like:", response.statusText);
        }
      }
    } catch (error) {
      console.log("Erro ao enviar o like:", error.message);
    }
  };

  useEffect(() => {
    const currentLikes = likesArray[currentImageIndex];
    if (currentLikes === "1") {
      setActiveLikeClass("show");
      setInactiveLikeClass("hidden");
    } else {
      setActiveLikeClass("hidden");
      setInactiveLikeClass("show");
    }
  }, [likesArray, currentImageIndex, setActiveLikeClass, setInactiveLikeClass]);

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
    getLikes,
  };
};

export default useEventsModals;
