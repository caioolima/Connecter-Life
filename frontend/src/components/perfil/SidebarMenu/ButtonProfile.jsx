import { Link } from "react-router-dom";
import SidebarLink from "./SideBarLink.jsx";
import { useMyContext } from "../../../contexts/profile-provider";
import useGetdata from "../hooks/useGetdata";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons'; // Importe o ícone de usuário

const ButtonProfile = () => {
    const { myProfileLink } = useMyContext();
    const { handleProfileClick } = useGetdata();
    
    return (
        <>
            <div className="myprofile-link">
                <SidebarLink
                    to={myProfileLink}
                    title="Meu Perfil"
                    icon={<FontAwesomeIcon icon={faUser} />}
                    label="Meu Perfil"
                    onClick={handleProfileClick}
                >
                   
                </SidebarLink>
            </div>
        </>
    );
};

export default ButtonProfile;
