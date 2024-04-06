import "./styles/style.css";
import { useMyContext } from "../../../contexts/profile-provider";
import useUploadModal from "../hooks/useUploadModal";
import ButtonClosed from "./ButtonClosed.jsx"
import ButtonPublish from "./ButtonPublish.jsx"
import Loading from "./Loading.jsx"

const UploadPhotoModal = () => {
    const { selectedImage, uploadInProgress } = useMyContext();

    const { handleImageUpload } = useUploadModal();

    return (
        <main className="modal active">
            <article className="publish-modal">
                <ButtonClosed/>
                {selectedImage && (
                    <section className="chosen-image-field">
                        <img
                            src={selectedImage}
                            alt="Selected"
                            className="chosen-image"
                        />
                        <ButtonPublish/>
                    </section>
                )}
                {/* Display progress bar if upload is in progress */}
                {uploadInProgress && (
                    <Loading/>
                )}

                {/* Button to attach image */}
                {!selectedImage && !uploadInProgress && (
                    <section className="custom-file-upload">
                        <label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                            />
                            Adionar foto
                        </label>
                    </section>
                )}
            </article>
        </main>
    );
};

export default UploadPhotoModal;
