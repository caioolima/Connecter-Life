import useUploadModal from "../hooks/useUploadModal";

const ButtonPublish = () => {
    
    const { changeImage2 } = useUploadModal();
    
    return (
        <>
            <button className="publish-button" onClick={changeImage2}>
                Publicar
            </button>
        </>
    );
};

export default ButtonPublish;
