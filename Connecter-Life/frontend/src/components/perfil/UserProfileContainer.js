import React, { useState, useEffect, useCallback } from "react";
import "./UserProfile.css";
import { storage } from "../Firebase/storage";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useMyContext } from "../../contexts/profile-provider";
import { useAuth } from "../../hooks/use-auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import SidebarMenuItems from "../Sidebar/SidebarMenuItems";
import EditModal from "./EditModal/index";
import ChangePhotoModal from "./ChangePhotoModal/index";

const UserProfileContainer = () => {
  const {
    fullName,
    setFullName,
    username,
    setUsername,
    profileImage,
    setProfileImage,
    showModal,
    setShowModal,
    selectedImage,
    setSelectedImage,
    isEditMode,
    setEditMode,
    setNewUsername,
    biography,
    setBiography,
    setModalFullName,
    modalDateOfBirth,
    setModalDateOfBirth,
    setPhoneNumber,
    setCountryCode,
    setPhoneError,
    userPhotos,
    setUserPhotos,
    showPhotoModal,
    setShowPhotoModal,
    selectedPublication,
    setSelectedPublication,
    selectedPublicationIndex,
    setSelectedPublicationIndex,
    isFollowing,
    setIsFollowing,
    isOwnProfile,
    setIsOwnProfile,
    setNewBiography,
    setUsernameError,
  } = useMyContext();

  const { userId } = useParams();
  const { signOut, user } = useAuth();

  const isOwner = user && user.id === userId;

  const [userDataLoaded, setUserDataLoaded] = useState(false);
  const navigate = useNavigate();

  const [selectedPublicationModalOpen, setSelectedPublicationModalOpen] =
    useState(false);

  const [selectedImageLoaded, setSelectedImageLoaded] = useState(false);
  const [selectedPhotoPosition, setSelectedPhotoPosition] = useState({
    x: 0,
    y: 0,
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [numberOfFollowers, setNumberOfFollowers] = useState(null);
  const [numberOfFollowing, setNumberOfFollowing] = useState(null);

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
  }, [userId]);

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
        console.error("Erro ao obter o número de usuários seguidos:", error);
      }
    };

    fetchFollowingCount();
  }, [userId]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/"); // Redirecionar para a página de login se o token não existir
    }
  }, [navigate]);

  useEffect(() => {
    const loggedInUserId = localStorage.getItem("userId");
    setIsOwnProfile(loggedInUserId === userId);
  }, [userId, setIsOwnProfile]);

  // Função para obter o índice da próxima imagem na galeria
  const getNextIndex = () => {
    return (currentImageIndex + 1) % userPhotos.length;
  };

  // Função para obter o índice da imagem anterior na galeria
  const getPreviousIndex = () => {
    return currentImageIndex === 0
      ? userPhotos.length - 1
      : currentImageIndex - 1;
  };

  const followUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = "http://localhost:3000/relationship";

      const data = {
        follower_id: user.id, // Use o ID do usuário logado como o seguidor
        following_id: userId, // Use o ID do usuário cujo perfil está sendo visualizado como o usuário a ser seguido
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setIsFollowing(true);
        console.log("Começou a seguir o usuário.");
      } else {
        console.error("Erro ao seguir o usuário:", response.status);
      }
    } catch (error) {
      console.error("Erro ao seguir o usuário:", error);
    }
  };

  const unfollowUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:3000/relationship/${user.id}/${userId}`;

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setIsFollowing(false); // Defina isFollowing como false após parar de seguir com sucesso
        console.log("Parou de seguir o usuário.");
      } else {
        console.error("Erro ao deixar de seguir o usuário:", response.status);
      }
    } catch (error) {
      console.error("Erro ao deixar de seguir o usuário:", error);
    }
  };

  const getDataUser = useCallback(async () => {
    try {
      setUserDataLoaded(false);
      const token = localStorage.getItem("token");
      const storedBiography = localStorage.getItem("biography");

      if (storedBiography) {
        setBiography(storedBiography);
      } else {
        const res = await fetch(`http://localhost:3000/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          const responseBody = await res.json();
          if (responseBody) {
            setFullName(`${responseBody.firstName} ${responseBody.lastName}`);
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
          console.error("Erro ao obter os dados do usuário:", res.status);
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
  ]);

  useEffect(() => {
    getDataUser();
  }, [getDataUser]);

  useEffect(() => {
    if (!userId) return; // Verifica se userId está definido antes de fazer a chamada para getDataUser
    getDataUser();
  }, [userId, getDataUser]); // Adiciona userId como dependência para este useEffect

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

  const [uploadInProgress, setUploadInProgress] = useState(false);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadInProgress(true); // Indica que o upload está em andamento

      // Upload da imagem para o Firebase Storage
      const storageRef = ref(storage, `users/${userId}/photos/${uuidv4()}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Atualize o progresso do upload aqui
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Progresso do upload:", progress);
        },
        (error) => {
          console.error("Erro ao fazer upload da imagem:", error);
          setUploadInProgress(false); // Reinicia o estado do upload em caso de erro
        },
        async () => {
          // Upload concluído com sucesso
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            // Defina a imagem selecionada apenas quando o usuário confirmar a mudança

            setUploadInProgress(false); // Reinicia o estado do upload após o upload bem-sucedido
            setSelectedImage(downloadURL); // Define a imagem selecionada
          } catch (error) {
            console.error("Erro ao obter a URL da imagem:", error);
            setUploadInProgress(false); // Reinicia o estado do upload em caso de erro
          }
        }
      );
    } catch (error) {
      console.error("Erro ao fazer upload da imagem:", error);
      setUploadInProgress(false); // Reinicia o estado do upload em caso de erro
    }
  };

  // Função para obter as URLs das imagens da galeria do usuário
  // Efeito para obter as URLs das imagens da galeria do usuário ao montar o componente
  useEffect(() => {
    const getGalleryImages = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:3000/users/${userId}/gallery-image`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setUserPhotos(data.galleryImageUrls); // Define o estado userPhotos com as URLs das imagens da galeria do usuário
        } else {
          console.error(
            "Falha ao obter as imagens da galeria:",
            response.status
          );
        }
      } catch (error) {
        console.error("Erro ao obter as imagens da galeria:", error);
      }
    };
    getGalleryImages();
  }, [setUserPhotos, userId]);

  const handleClosePhotoModal = () => {
    setSelectedPublicationModalOpen(false);
    setSelectedImage(null);
    setUploadInProgress(false);
    document.body.style.overflow = "auto";
    setSelectedImageLoaded(false);
    setCurrentImageIndex(0); // Redefinir o índice da imagem selecionada para o primeiro ao fechar o modal
  };

  const openModal = () => {
    setShowModal(true);
  };

  const openModalTwo = () => {
    setShowPhotoModal(true);
  };

  const handleSignOut = () => {
    signOut();
    navigate("/");
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

  const changeImage2 = async () => {
    try {
      // Enviar a imagem da galeria apenas se houver uma imagem selecionada
      if (selectedImage) {
        const token = localStorage.getItem("token");

        // Enviar a imagem da galeria para o backend
        const response = await fetch(
          `http://localhost:3000/users/${userId}/gallery-image`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ galleryImageUrl: selectedImage }),
          }
        );

        if (response.ok) {
          // Se a resposta do servidor for bem-sucedida, você pode atualizar o estado da aplicação conforme necessário
          console.log("Imagem da galeria enviada com sucesso!");

          // Extrair a URL da imagem da resposta
          const responseData = await response.json();
          const imageUrl = responseData.galleryImageUrl;

          // Adicionar a URL da imagem ao estado userPhotos
          setUserPhotos((prevUserPhotos) => [
            ...prevUserPhotos,
            { url: imageUrl },
          ]);
          window.location.reload();
        } else {
          console.error(
            "Falha ao enviar a imagem da galeria:",
            response.status
          );
        }
      }

      // Limpar o estado da imagem selecionada e fechar o modal após o envio bem-sucedido
      setSelectedImage(null);
      setShowPhotoModal(false);
    } catch (error) {
      console.error("Erro ao enviar a imagem da galeria:", error);
    }
  };

  const handlePublicationClick = (index, event) => {
    setCurrentImageIndex(index); // Definir o índice da imagem clicada
    setSelectedPublicationModalOpen(true);
    setSelectedPublication(userPhotos[index]); // Definindo a publicação selecionada
    document.body.style.overflow = "hidden";
  };

  useEffect(() => {
    if (selectedPublicationModalOpen) {
      setSelectedPhotoPosition({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      });
      // Pré-carregar a imagem do modal
      const img = new Image();
      img.onload = () => setSelectedImageLoaded(true);
      img.src = selectedPublication; // Use selectedPublication aqui
    }
  }, [selectedPublicationModalOpen, selectedPublication]);

  const [nextButtonDisabled, setNextButtonDisabled] = useState(false);

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => {
      const nextIndex = prevIndex + 1;
      const isLastImage = nextIndex >= userPhotos.length;
      setNextButtonDisabled(isLastImage);
      return isLastImage ? prevIndex : nextIndex;
    });
  };

  useEffect(() => {
    // Verifica se a lista de fotos do usuário está vazia ou se a foto atual é a última
    const isLastPhoto =
      userPhotos.length === 0 || currentImageIndex === userPhotos.length - 1;
    setNextButtonDisabled(isLastPhoto);
  }, [userPhotos, currentImageIndex]);

  const [previousButtonDisabled, setPreviousButtonDisabled] = useState(false);

  // Função para ir para a imagem anterior na galeria
  const goToPreviousImage = () => {
    setCurrentImageIndex((prevIndex) => {
      // Verifica se estamos na primeira imagem
      if (prevIndex === 0) {
        // Se estivermos na primeira imagem, permaneça na mesma imagem (não faça nada)
        return prevIndex;
      } else {
        // Caso contrário, volte para a imagem anterior
        return prevIndex - 1;
      }
    });
  };

  useEffect(() => {
    // Verifica se a lista de fotos do usuário está vazia ou se a foto atual é a primeira
    const isFirstPhoto = userPhotos.length === 0 || currentImageIndex === 0;
    setPreviousButtonDisabled(isFirstPhoto);
  }, [userPhotos, currentImageIndex]);
  const verifyRelationship = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      // Verifica se user é nulo antes de acessar sua propriedade id
      if (!user) {
        console.error("Usuário não definido.");
        return;
      }
      const url = `http://localhost:3000/relationship/${user.id}/${userId}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ${token}",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsFollowing(data.exists); // Define isFollowing com base na resposta da API
      } else {
        console.error(
          "Erro ao verificar a relação de seguimento:",
          response.status
        );
      }
    } catch (error) {
      console.error("Erro ao verificar a relação de seguimento:", error);
    }
  }, [setIsFollowing, user, userId]); // Removido user.id da lista de dependências

  useEffect(() => {
    if (user) {
      verifyRelationship();
    }
  }, [user, verifyRelationship]);

  if (!user) {
    return null;
  }

  return (
    <>
      {selectedPublicationModalOpen && (
        <>
          <div className="overlay" onClick={handleClosePhotoModal}></div>
          <div className="post-modal">
            <div className="content-modal">
              <button
                className="modal-close-button"
                onClick={handleClosePhotoModal}
              >
                &times;
              </button>
              <div className="modal-image-container">
                {/* Botão de navegação esquerdo */}
                <button
                  className={`nav-button left ${
                    previousButtonDisabled ? "disabled" : ""
                  }`}
                  onClick={goToPreviousImage}
                  style={{
                    backgroundColor: previousButtonDisabled ? "gray" : "",
                  }}
                  disabled={previousButtonDisabled}
                >
                  {"<"}
                </button>

                {selectedImageLoaded ? (
                  <img
                    src={userPhotos[currentImageIndex]}
                    alt="Imagem selecionada"
                    className="selected-publication-photo"
                  />
                ) : (
                  <div className="loading-text">Carregando...</div>
                )}

                {/* Botão de navegação direito */}
                <button
                  className={`nav-button right ${
                    nextButtonDisabled ? "disabled" : ""
                  }`}
                  onClick={goToNextImage}
                  style={{
                    backgroundColor: nextButtonDisabled ? "gray" : "",
                  }}
                  disabled={nextButtonDisabled}
                >
                  {">"}
                </button>

                {/* Detalhes do usuário */}
                <div className="user-details">
                  <Link to={`/profile/${userId}`}>
                    <img
                      className="rounded-image"
                      src={profileImage}
                      alt="Profile"
                    />
                  </Link>
                  <p className="details-user">
                    <Link to={`/profile/${userId}`}>{username}</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className={"page-container"}>
        <SidebarMenuItems
          userId={userId}
          handleSignOut={handleSignOut}
          openModalTwo={openModalTwo}
        />
        {user && userDataLoaded && (
          <div className="profile-container">
            <div className="profile-header">
              <div className="profile-photo-container" onClick={openModal}>
                <div className="profile-photo-frame">
                  {profileImage !== null && profileImage !== "" ? (
                    <img
                      src={profileImage}
                      alt="User"
                      className="profile-photo"
                    />
                  ) : (
                    <div className="add-image-icon">+</div>
                  )}
                </div>
              </div>
              <div className="profile-info">
                <div className="user-info">
                  <h1>{username}</h1>
                  {isOwner && !isEditMode && (
                    <button className="edit-button" onClick={handleEditClick}>
                      Editar
                    </button>
                  )}
                </div>
                <p className="cont-photos">
                  <strong>{userPhotos.length}</strong> Publicações
                  {numberOfFollowers !== null && (
                    <>
                      {" | "}
                      Seguidores: <strong>{numberOfFollowers}</strong>
                    </>
                  )}
                  {numberOfFollowing !== null && (
                    <>
                      {" | "}
                     Seguindo: <strong>{numberOfFollowing}</strong>
                    </>
                  )}
                </p> 

                <p className="fullname">{fullName}</p>

                {biography && <p className="bio">{biography}</p>}

                {!isOwnProfile && user && user.id !== userId && (
                  <button
                    className={`follow-button ${
                      isFollowing ? "following" : ""
                    }`}
                    onClick={() => {
                      if (isFollowing) {
                        unfollowUser();
                        verifyRelationship(); // Chama verifyRelationship após parar de seguir
                      } else {
                        followUser();
                        verifyRelationship(); // Chama verifyRelationship após seguir
                      }
                    }}
                  >
                    {isFollowing ? "Seguindo" : "Seguir"}
                  </button>
                )}
              </div>
            </div>

            <h2 className="title-photo">Galeria</h2>
            <div className="photo-gallery">
              {userPhotos.length > 0 ? (
                <div className="photo-grid">
                  {userPhotos.map((photo, index) => (
                    <div className="photo-item" key={index}>
                      <button
                        onClick={(event) =>
                          handlePublicationClick(index, event)
                        }
                      >
                        <img
                          src={photo}
                          alt={`Foto ${index}`}
                          onLoad={(event) => {
                            event.target.classList.add("loaded");
                          }}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Nenhuma foto postada.</p>
              )}
            </div>
          </div>
        )}
        {user && isEditMode && <EditModal />}
        {showModal && user && <ChangePhotoModal />}
        {showPhotoModal && user && (
          <div className="modal active">
            <div className="modal-content-2">
              <button
                className="modal-close-button"
                onClick={handleClosePhotoModal}
              >
                &times;
              </button>
              {selectedImage && (
                <div className="photo-upload">
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="modal-image"
                  />
                  <div className="modal-buttons">
                    <button
                      className="custom-modal-button-2"
                      onClick={changeImage2}
                    >
                      Confirmar Mudança
                    </button>
                  </div>
                </div>
              )}
              {/* Exibir a barra de progresso se o upload estiver em andamento */}
              {uploadInProgress && (
                <div className="loading-text">Carregando...</div>
              )}

              {/* Botão para anexar imagem */}
              {!selectedImage && !uploadInProgress && (
                <div className="custom-file-upload">
                  <label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                    Adicionar Foto
                  </label>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default UserProfileContainer;
