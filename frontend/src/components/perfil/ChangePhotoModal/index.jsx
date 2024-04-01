import "./style.css";
import React, { useState } from "react";
import { useMyContext } from "../../../contexts/profile-provider";
import usePhotoModal from "../hooks/usePhotoModal";

const ChangePhotoModal = () => {
  const { profileImage, uploadProgress, isEditMode } = useMyContext();

  const { closeModal, removeImage, handleImageChange, changeImage } =
    usePhotoModal();

  const [tempSelectedImage, setTempSelectedImage] = useState(null);

  const handleBackButtonClick = () => {
    if (tempSelectedImage) {
      setTempSelectedImage(null);
    } else {
      closeModal();
    }
  };

  const handleConfirmButtonClick = async () => {
    if (tempSelectedImage) {
      changeImage(); // Aguarda o término do upload da imagem
      closeModal();
    }
  };

  return (
    <div className="modal active">
      <div className="modal-content">
        <button className="modal-close-button" onClick={closeModal}>
          &times;
        </button>
        {tempSelectedImage && (
          <div className="selected-image-preview">
            <img src={tempSelectedImage} alt="Selected" />
            <div className="modal-buttons">
              <button
                className="custom-modal-button"
                onClick={handleConfirmButtonClick}
              >
                Confirmar Mudança
              </button>
              <button
                className="custom-modal-button"
                onClick={handleBackButtonClick}
              >
                Voltar
              </button>
            </div>
          </div>
        )}
        {!tempSelectedImage && (
          <div className="custom-file-upload">
            <label>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  handleImageChange(event);
                  setTempSelectedImage(
                    URL.createObjectURL(event.target.files[0])
                  );
                }}
              />
              {profileImage ? "Trocar Foto" : "Adicionar Foto"}
            </label>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{
                    width: `${uploadProgress}%`,
                  }}
                >
                  {Math.round(uploadProgress)}%
                </div>
              </div>
            )}
          </div>
        )}
        {!isEditMode && profileImage && !tempSelectedImage && (
          <div className="custom-file-upload">
            <button className="custom-remove-image" onClick={removeImage}>
              Remover Imagem
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangePhotoModal;