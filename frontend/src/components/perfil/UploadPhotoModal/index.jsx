import "./style.css"
import { useMyContext } from "../../../contexts/profile-provider"
import useEventsModals from "../hooks/useEventsModals"
import useUploadModal from "../hooks/useUploadModal"

const UploadPhotoModal = () => {
    const {
        selectedImage, uploadInProgress
    } = useMyContext();
    
    const {
        changeImage2, handleImageUpload
    } = useUploadModal();
    
    const {
        handleClosePhotoModal
    } = useEventsModals();
    
    return (
        <div className="modal active">
            <div className="modal-content-2">
                <button
                    className="modal-closed"
                    onClick={handleClosePhotoModal}>
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
                                onClick={changeImage2}>
                                Fazer Postagem
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
    );
};

export default UploadPhotoModal;
