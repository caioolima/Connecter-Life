import "./styles/style.css";
import { Link } from "react-router-dom";
import logoImage from "../../images/icons-backpack.png";
import { useMyContext } from "../../../contexts/profile-provider";
import useGetdata from "../hooks/useGetdata";
import ButtonExit from "./ButtonExit.jsx";
import IconHome from "./IconHome.jsx";
import IconSearch from "./IconSearch.jsx";
import IconPublish from "./IconPublish.jsx";
import ButtonProfile from "./ButtonProfile.jsx";
import { useTranslation } from "react-i18next";

const SidebarMenuItems = () => {
    const { t } = useTranslation(); // Adicionando a função de tradução

    const { myProfileLink, isMyProfilePage } = useMyContext();
    const { handleProfileClick } = useGetdata();
    
    return (
        <div className="sidebar">
            <div className="-bar">
                <Link to={myProfileLink} onClick={handleProfileClick}>
                    <h1 className="desktop-logo">{t("title")}</h1> {/* Traduzindo o título */}
                    <img
                        className="mobile-logo"
                        src={logoImage}
                        alt="Mobile Logo Icon"
                    />
                </Link>
            </div>
            <>
                <IconHome/>
                <IconSearch/>
                {isMyProfilePage && (
                    <IconPublish/>
                )}
                <ButtonProfile/>
                <ButtonExit/>
            </>
        </div>
    );
};

export default SidebarMenuItems;
