import { Link } from "react-router-dom"

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

export default SidebarLink;