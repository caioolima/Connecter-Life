import { useEffect } from "react";
import "./UserProfile.css";
import { useParams } from "react-router-dom";
import { useMyContext } from "../../contexts/profile-provider";

/* Components */
import SidebarMenu from "./SidebarMenu/index";
import EditModal from "./EditModal/index";
import ChangePhotoModal from "./ChangePhotoModal/index";
import UploadPhotoModal from "./UploadPhotoModal/index";
import Galeria from "./Galeria/index";
import InfoProfile from "./InfoProfile/index";
import PublicationDetailsModal from "./PublicationDetailsModal/index";

/* Functions */
import useGetdata from "./hooks/useGetdata"

const UserProfileContainer = () => {
    
    /* Estados necessários */
    const {
        showModal,
        isEditMode,
        showPhotoModal,
        selectedPublicationModalOpen,
        userDataLoaded
    } = useMyContext();
    
    /* Função que obtem todos os dados do servidor */
    const { getDataUser } = useGetdata();
    const { userId } = useParams();
    
    /* Se a aplicação renderizar, busque os dados no servidor */
    useEffect(() => {
        getDataUser();
    }, [getDataUser]);
    
    useEffect(() => {
        if (!userId) return; // Verifica se userId está definido antes de fazer a chamada para getDataUser
        getDataUser();
    }, [userId, getDataUser]); // Adiciona userId como dependência para este useEffect
    
    return (
        <>
            {/* Modal que exibe publicações */}
            {selectedPublicationModalOpen && <PublicationDetailsModal />}
            
            {/* Todo o conteúdo do profile */}
            <main className="profile">
            
                {userDataLoaded && ( /* Se os dados do usuário estiverem carregados */
                    <section className="profile-container">
                        <InfoProfile /> {/* Campo de perfil do usuário */}
                        <Galeria /> {/* Galeria de imagens */}
                    </section>
                )}
                
                {isEditMode && <EditModal />} {/* Modal de edição do perfil */}
                {showModal && <ChangePhotoModal />} {/* Modal de mudar a foto perfil */}
                {showPhotoModal && <UploadPhotoModal />} {/* Modal de publicar foto na galeria */}
                <SidebarMenu/> {/* Menu */}
                
            </main>
        </>
    );
};

export default UserProfileContainer;
