import React, { useState, useEffect } from "react";
import "./UserProfile.css";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import { storage } from "../Firebase/storage";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import TextField from "@mui/material/TextField";
import PhoneInput from "react-phone-number-input";
import SidebarMenuItems from "../Sidebar/SidebarMenuItems";
import PublicationDetails from "../Publication/PublicationDetails";

const UserProfileContainer = () => {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isEditMode, setEditMode] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [biography, setBiography] = useState("");
  const [isBiographyVisible, setBiographyVisible] = useState(false);
  const [formData, setFormData] = useState({});
  const { userId } = useParams();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const [modalFullName, setModalFullName] = useState("");
  const [modalDateOfBirth, setModalDateOfBirth] = useState("");
  const [isTextFieldFocused, setIsTextFieldFocused] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [userPhotos, setUserPhotos] = useState([]); // Adiciona um estado para armazenar as fotos do usuário
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [selectedPublicationIndex, setSelectedPublicationIndex] =
    useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/"); // Redirecionar para a página de login se o token não existir
    }
  }, []);

  useEffect(() => {
    const loggedInUserId = localStorage.getItem("userId");
    setIsOwnProfile(loggedInUserId === userId);
  }, [userId]);

  const followUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:3000/relationship`;

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

  
  const isOwner = user && user.id === userId; // Verifica se o ID do usuário logado é o mesmo que o ID da página

  const [userDataLoaded, setUserDataLoaded] = useState(false); // Novo estado para controlar se os dados do usuário foram carregados

  useEffect(() => {
    // Limpar a imagem do perfil armazenada localmente ao carregar o perfil de um novo usuário
    localStorage.removeItem("profileImage");
  }, [userId]); // Adiciona userId como dependência para este useEffect

  useEffect(() => {
    if (!userId) return; // Verifica se userId está definido antes de fazer a chamada para getDataUser
    getDataUser();
  }, [userId]); // Adiciona userId como dependência para este useEffect

  async function getDataUser() {
    try {
      setUserDataLoaded(false); // Define userDataLoaded como false antes de iniciar a busca de dados
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
        const responseBody = await res.json();

        setFullName(`${responseBody.firstName} ${responseBody.lastName}`);
        setUsername(responseBody.username);
        setModalFullName(`${responseBody.firstName} ${responseBody.lastName}`);
        setModalDateOfBirth(responseBody.dob);
        const ddd = extractDDD(responseBody.phone);
        const countryCode = getCountryCodeFromDDD(ddd);
        setCountryCode(countryCode);

        if (responseBody.profileImageUrl) {
          setProfileImage(responseBody.profileImageUrl);
        } else {
          setProfileImage(""); // Define profileImage como uma string vazia se não houver imagem
        }

        setBiography(responseBody.biography);
        setPhoneNumber(responseBody.phone);
        setUserDataLoaded(true); // Define userDataLoaded como true após receber os dados do usuário

        setUserDataLoaded(true);
      }
    } catch (error) {
      console.error("Erro ao obter os dados do usuário:", error);
    }
  }

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
    getDataUser();
  }, []);

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
  }, []);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentUserProfileImage, setCurrentUserProfileImage] = useState(null);

  const handleImageChange = async (event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      const fileName = new Date().getTime() + file.name;
      formData.append("image", file, fileName);

      const token = localStorage.getItem("token");
      if (!token || !userId) {
        throw new Error("Token or user ID not found");
      }

      const uploadTask = uploadBytesResumable(
        ref(storage, `users/${userId}/profileImage`),
        file
      );
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Error uploading image:", error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setSelectedImage(downloadURL); // Set selectedImage with the download URL
            setProfileImage(downloadURL); //

            // Aqui você tem o URL da imagem, agora você pode enviar isso junto com outros dados do usuário para o backend
            const updateUserResponse = await fetch(
              `http://localhost:3000/users/${userId}/edit`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  newUsername,
                  newBiography,
                  profileImageUrl: downloadURL, // Certifique-se de que downloadURL contém a URL correta da imagem
                }),
              }
            );

            if (updateUserResponse.ok) {
              console.log(
                "User profile updated successfully with profile image URL"
              );

              // Excluir a imagem do Firebase Storage após o upload ter sido concluído e a URL ter sido enviada para o banco de dados
              await deleteObject(ref(storage, `users/${fileName}`));
              console.log("Imagem do Firebase Storage excluída com sucesso.");
            } else {
              console.error(
                "Failed to update user profile with profile image URL"
              );
            }
          } catch (error) {
            console.error("Error getting download URL:", error);
          }
        }
      );
    } catch (error) {
      console.error("Error uploading image:", error.message);
    }
  };

  useEffect(() => {
    // Verificar se o usuário está seguindo o perfil atual ao montar o componente
  }, []); // Apenas executa uma vez ao montar o componente

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
  }, []);
  // Função para atualizar o novo número de telefone
  const handleChangePhoneNumber = (newPhoneNumber) => {
    setNewPhone(newPhoneNumber); // Atualiza o estado com o novo número de telefone
  };

  const handleCloseModal = () => {
    // Limpar o estado selectedImage
    setSelectedImage(null);

    // Fechar o modal
    setShowModal(false);
  };

  const handleClosePhotoModal = () => {
    setShowPhotoModal(false); // Fecha o modal
    setSelectedImage(null); // Limpa a imagem selecionada
    setUploadInProgress(false); // Define uploadInProgress como false
  };

  const openModal = () => {
    setShowModal(true);
  };

  const openModalTwo = () => {
    setShowPhotoModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedImage(null);
    setUsernameError(""); // Limpa o estado de erro de nome de usuário
    setPhoneError("");
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

  const [usernameError, setUsernameError] = useState("");

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem("token");
      const url = `http://localhost:3000/users/${userId}/edit`;

      // Verifique se o campo de usuário está vazio
      if (!newUsername) {
        setUsernameError("Por favor, insira um nome de usuário.");
        return; // Retorna para evitar a requisição se o campo estiver vazio
      }

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newUsername, newBiography }), // Apenas envie o novo nome de usuário e a nova biografia
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setBiography(newBiography);
          setUsername(newUsername);
          setEditMode(false);
          setUsernameError(""); // Limpa o erro se a atualização for bem-sucedida
          console.log("Perfil atualizado com sucesso!");
        } else {
          // Se houver um erro, define a mensagem de erro fornecida pelo servidor
          setUsernameError(data.message);
        }
      } else if (response.status === 400) {
        // Se o status da resposta for 400 (Bad Request), definir a mensagem de erro como "Usuário não disponível"
        setUsernameError("Usuário não disponível");
      } else {
        // Se a resposta do servidor não for bem-sucedida e não for um erro de Bad Request, definir a mensagem de erro com base no status da resposta
        setUsernameError(`Erro ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Erro ao atualizar o perfil:", error);
    }
  };

  const [newBiography, setNewBiography] = useState("");

  const changeImage = () => {
    setProfileImage(selectedImage); // Atualiza o estado profileImage com a nova imagem
    localStorage.setItem("profileImage", selectedImage); // Atualiza a imagem no armazenamento local
    console.log("Imagem alterada com sucesso!");

    closeModal(); // Fecha o modal após a mudança ser confirmada
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

  // No método de remoção de imagem:
  const removeImage = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:3000/users/${userId}/profile-image`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        // Remova a imagem do Firebase Storage
        await deleteObject(ref(storage, `users/${userId}/profileImage`));
        // Limpe o cache da imagem removida
        setCurrentUserProfileImage(null);
        // Atualize o estado para refletir a remoção
        setProfileImage(null);
        console.log("Imagem removida com sucesso!");
        closeModal(); // Você pode chamar a função closeModal aqui para fechar o modal após a remoção bem-sucedida
      } else {
        console.error(
          "Falha ao excluir a imagem no servidor:",
          response.status
        );
      }
    } catch (error) {
      console.error("Erro ao remover a imagem:", error);
    }
  };

  // Função para formatar a biografia
  function formatBiography(bio) {
    const MAX_CHARS_PER_LINE = 30; // Número máximo de caracteres por linha
    const words = bio.split(" ");
    let formattedBio = "";
    let line = "";

    words.forEach((word) => {
      if (line.length + word.length <= MAX_CHARS_PER_LINE) {
        line += (line ? " " : "") + word;
      } else {
        formattedBio += (formattedBio ? "\n" : "") + line;
        line = word;
      }
    });

    // Adiciona a última linha
    formattedBio += (formattedBio ? "\n" : "") + line;

    return formattedBio;
  }

  const handlePublicationClick = (photo, index) => {
    setSelectedPublication({ photo, index });
    setSelectedPublicationIndex(index); // Defina o índice da imagem selecionada
  };

  const verifyRelationship = async () => {
    try {
        const token = localStorage.getItem("token");
        const url = `http://localhost:3000/relationship/${user.id}/${userId}`;
  
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
  
        if (response.ok) {
            const data = await response.json();
            setIsFollowing(data.exists); // Define isFollowing com base na resposta da API
        } else {
            console.error("Erro ao verificar a relação de seguimento:", response.status);
        }
    } catch (error) {
        console.error("Erro ao verificar a relação de seguimento:", error);
    }
};

useEffect(() => {
  if (user) {
    verifyRelationship(); // Verifique a relação de seguidores
  }
}, [user]);


  if (!user) {
    return null;
  }
 

  return (
    <div className={`page-container`}>
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
              </p>
              <p className="fullname">{fullName}</p>

              {biography && <p className="bio">{biography}</p>}

              {!isOwnProfile && user && user.id !== userId && (
                <button
                className={`follow-button ${isFollowing ? 'following' : ''}`}
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

              {user && isEditMode && (
                <div className="modal-edit">
                  <div className="modal-content-edit">
                    <button
                      className="modal-close-edit-button"
                      onClick={() => {
                        setEditMode(false);
                        handleCloseModal();
                      }}
                    >
                      Fechar
                    </button>
                    <div className="text-edit">
                      <label>Nome de usuário:</label>
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="edit-input"
                      />
                      {usernameError && (
                        <p className="error_message">{usernameError}</p>
                      )}
                    </div>
                    <div className="bio_text_edit">
                      <label htmlFor="biography">Biografia:</label>
                      <TextField
                        id="biography"
                        multiline
                        rows={4}
                        value={newBiography}
                        onChange={(e) => setNewBiography(e.target.value)}
                        onFocus={() => setIsTextFieldFocused(true)}
                        onBlur={() => setIsTextFieldFocused(false)}
                        className={
                          isTextFieldFocused ? "focused-textfield" : ""
                        }
                        style={{ marginTop: "10px" }}
                      />
                    </div>

                    <div className="text-edit">
                      <label>Nome Completo:</label>
                      <input
                        type="text"
                        value={modalFullName} // Use o estado correspondente aqui
                        onChange={(e) => setModalFullName(e.target.value)}
                        className="edit-input"
                        disabled
                      />
                    </div>
                    <div className="text-edit">
                      <label>Data de Nascimento:</label>
                      <p className="black-text">
                        {new Date(modalDateOfBirth).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-edit">
                      <label>Número de Telefone:</label>
                      <PhoneInput
                        placeholder="Número de Telefone"
                        value={phoneNumber}
                        onChange={handleChangePhoneNumber} // Aqui está a alteração
                        defaultCountry={countryCode}
                      />
                      {phoneError && (
                        <p className="error_message">{phoneError}</p>
                      )}
                    </div>

                    <button
                      className={`save-button ${
                        !newUsername ? "disabled" : ""
                      }`}
                      onClick={handleSaveEdit}
                      disabled={!newUsername}
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {selectedPublication && (
            <PublicationDetails
              photo={selectedPublication}
              index={selectedPublicationIndex}
              profileImage={profileImage}
            />
          )}
          <h2 className="title-photo">Galeria</h2>
          <div className="photo-gallery">
            {userPhotos.length > 0 ? (
              <div className="photo-grid">
                {userPhotos.map((photo, index) => (
                  <div className="photo-item" key={index}>
                    <Link
                      to={`/profile/${userId}/${encodeURIComponent(
                        profileImage
                      )}/${encodeURIComponent(photo)}/${index}`}
                      onClick={() => handlePublicationClick(photo, index)}
                    >
                      <img
                        src={photo}
                        alt={`Foto ${index}`}
                        onLoad={(event) => {
                          event.target.classList.add("loaded");
                        }}
                      />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p>Nenhuma foto postada.</p>
            )}
          </div>
        </div>
      )}

      {showModal && user && (
        <div className="modal active">
          <div className="modal-content">
            <button className="modal-close-button" onClick={closeModal}>
              &times;
            </button>
            {selectedImage && (
              <div className="selected-image-preview">
                <img src={selectedImage} alt="Selected" />
                <div className="modal-buttons">
                  <button className="custom-modal-button" onClick={changeImage}>
                    Confirmar Mudança
                  </button>
                  <button
                    className="custom-modal-button"
                    onClick={() => setSelectedImage(null)}
                  >
                    Voltar
                  </button>
                </div>
              </div>
            )}
            {!selectedImage && (
              <div className="custom-file-upload">
                <label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {profileImage ? "Trocar Foto" : "Adicionar Foto"}
                </label>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="progress-bar">
                    <div
                      className="progress"
                      style={{ width: `${uploadProgress}%` }}
                    >
                      {Math.round(uploadProgress)}%
                    </div>
                  </div>
                )}
              </div>
            )}
            {!isEditMode && profileImage && !selectedImage && (
              <div className="custom-file-upload">
                <button className="custom-remove-image" onClick={removeImage}>
                  Remover Imagem
                </button>
              </div>
            )}
          </div>
        </div>
      )}
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
  );
};

export default UserProfileContainer;
