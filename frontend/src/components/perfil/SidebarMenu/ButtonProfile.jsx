import { Link } from "react-router-dom";
import SidebarLink from "./SideBarLink.jsx"
import { useMyContext } from "../../../contexts/profile-provider"
import useGetdata from "../hooks/useGetdata"

const ButtonProfile = () => {
    
    const { myProfileLink, profileImage } = useMyContext();
    const { handleProfileClick } = useGetdata();
    
    return (
        <>
            <div className="myprofile-link">
                <Link
                    to={myProfileLink}
                    onClick={handleProfileClick}
                    title="Meu Perfil">
                    <img
                        className="round-image"
                        src={profileImage}
                        alt="Profile"
                    />
                </Link>
                <SidebarLink
                    to={myProfileLink}
                    title="Meu Perfil"
                    label="Meu Perfil"
                    onClick={handleProfileClick}
                />
            </div>
        </>
    );
};

export default ButtonProfile;
