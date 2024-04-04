import "./style.css";
import React, { useState, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import {
    FaHome,
    FaSearch,
    FaPlusSquare,
    FaUser,
    FaDoorOpen
} from "react-icons/fa";
import logoImage from "../../images/icons-backpack.png";
import { useAuth } from "../../../../src/hooks/use-auth";
import { useMyContext } from "../../../contexts/profile-provider";
import useEventsModals from "../hooks/useEventsModals";

const SidebarLink = ({ to, title, icon, label, onClick }) => (
    <Link
        to={to}
        onClick={onClick}
        title={title}
        className={`menu-item sidebar-link ${
            window.location.pathname === to ? "active" : ""
        }`}>
        {icon}
        <span className="txt-icon">{label}</span>
    </Link>
);

const SidebarMenuItems = () => {
    const { openModalTwo, handleSignOut } = useEventsModals();

    const { user } = useAuth();
    const { userId } = useParams();
    const location = useLocation();

    const myProfileLink = `/profile/${user && user.id}`;
    const isMyProfilePage = location.pathname === myProfileLink;

    const { profileImage } = useMyContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handlePublishClick = () => {
        openModalTwo(user && user.id);
    };

    useEffect(() => {
        if (
            location.pathname === myProfileLink &&
            !localStorage.getItem("profileModalOpened")
        ) {
            setIsModalOpen(true);
            localStorage.setItem("profileModalOpened", "true");
        } else {
            setIsModalOpen(false);
        }
    }, [location.pathname, myProfileLink]);

    useEffect(() => {
        const handlePopState = () => {
            window.location.reload();
        };

        window.addEventListener("popstate", handlePopState);

        return () => {
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);

    const handleLogoClick = () => {
        window.location.reload();
    };

    const handleProfileClick = () => {
        // Redirecionar para a página do perfil do usuário autenticado
        window.location.href = user ? `/profile/${user.id}` : "/";
    };

    return (
        <div className="sidebar">
            <div className="-bar">
                <Link to={myProfileLink} onClick={handleLogoClick}>
                    <h1 className="desktop-logo">ConnecterLife</h1>
                    <img
                        className="mobile-logo"
                        src={logoImage}
                        alt="Mobile Logo Icon"
                    />
                </Link>
            </div>
            <>
                <SidebarLink
                    to="/"
                    title="Comunidades"
                    icon={<FaHome />}
                    label="Comunidades"
                />
                <SidebarLink
                    to="/search"
                    title="Pesquisa"
                    icon={<FaSearch />}
                    label="Busque"
                />
                {isMyProfilePage && (
                    <SidebarLink
                        title="Publicar"
                        icon={<FaPlusSquare />}
                        label="Publicar"
                        onClick={handlePublishClick}
                    />
                )}
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

                <button
                    onClick={handleSignOut}
                    title="Sair"
                    className="sidebar-link">
                    <FaDoorOpen />
                    <span>Sair</span>
                </button>
            </>
        </div>
    );
};

export default SidebarMenuItems;
