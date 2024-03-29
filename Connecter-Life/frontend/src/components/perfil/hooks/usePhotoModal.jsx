import React, { useEffect, useState } from "react";
import { useMyContext } from "../../../contexts/profile-provider";
import { useParams } from "react-router-dom";
import { storage } from "../../Firebase/storage";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

const usePhotoModal = () => {
  const {
    setShowModal,
    setSelectedImage,
    setUsernameError,
    setPhoneError,
    setProfileImage,
    setCurrentUserProfileImage,
    setUploadProgress,
    newUsername,
    newBiography,
  } = useMyContext();

  const [selectedFile, setSelectedFile] = useState(null); // Estado para controlar o arquivo selecionado

  const { userId } = useParams();

  const closeModal = () => {
    setShowModal(false);
    setSelectedImage(null); // Limpa o estado selectedImage ao fechar o modal
    setUsernameError("");
    setPhoneError("");
  };

  const handleImageChange = (event) => {
    // Atualiza o estado com o arquivo selecionado
    setSelectedFile(event.target.files[0]);
  };

  // No hook usePhotoModal

const changeImage = async () => {
  if (!selectedFile) {
    console.error("Nenhum arquivo selecionado.");
    return;
  }

  try {
    const formData = new FormData();
    const fileName = new Date().getTime() + selectedFile.name;
    formData.append("image", selectedFile, fileName);

    const token = localStorage.getItem("token");
    if (!token || !userId) {
      throw new Error("Token or user ID not found");
    }

    // Atualizar o estado local imediatamente com a URL temporária da imagem
    const temporaryImageUrl = URL.createObjectURL(selectedFile);
    setSelectedImage(temporaryImageUrl);

    const uploadTask = uploadBytesResumable(
      ref(storage, `users/${userId}/profileImage`),
      selectedFile
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
          setProfileImage(downloadURL);
          setSelectedImage(downloadURL); // Atualizar o estado com a URL final da imagem

          // Restante do código de atualização do perfil no servidor
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
    // Limpar a imagem do perfil armazenada localmente ao carregar o perfil de um novo usuário
    localStorage.removeItem("profileImage");
  }, [userId]); // Adiciona userId como dependência para este useEffect

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

  return { closeModal, removeImage, changeImage, handleImageChange };
};

export default usePhotoModal;
