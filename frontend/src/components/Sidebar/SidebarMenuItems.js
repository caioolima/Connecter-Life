// SidebarMenuItems.js
import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaSearch, FaPlusSquare, FaUser, FaDoorOpen } from "react-icons/fa";
import logoImage from "../images/icons-backpack.png";

export const SidebarLink = ({ to, title, icon, label, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    title={title}
    className={`menu-item sidebar-link ${
      window.location.pathname === to ? "active" : ""
    }`}
  >
    {icon}
    <span>{label}</span>
  </Link>
);

const SidebarMenuItems = ({ userId, handleSignOut, openModalTwo, hidePublishButton }) => (
  <div className="sidebar">
    <div className="logo-bar">
      <Link to={`/profile/${userId}`}>
        <span className="desktop-logo">ConnecTrip</span>
        <img className="mobile-logo" src={logoImage} alt="Mobile Logo Icon" />
      </Link>
    </div>
    <>
      <SidebarLink to="/" title="Comunidades" icon={<FaHome />} label="Comunidades" />
      <SidebarLink to="/search" title="Pesquisa" icon={<FaSearch />} label="Busque" />
      {!hidePublishButton && (
        <SidebarLink
          title="Publicar"
          icon={<FaPlusSquare />}
          label="Publicar"
          onClick={openModalTwo}
        />
      )}
      <SidebarLink to={`/profile/${userId}`} title="Meu Perfil" icon={<FaUser />} label="Meu Perfil" />
      <button onClick={handleSignOut} title="Sair">
        <div className="sidebar-link">
          <FaDoorOpen />
          <span>Sair</span>
        </div>
      </button>
    </>
  </div>
);

export default SidebarMenuItems;
