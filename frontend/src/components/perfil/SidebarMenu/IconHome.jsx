import SidebarLink from "./SideBarLink.jsx"
import { FaHome } from "react-icons/fa"

const IconHome = () => {
    return (
        <>
            <SidebarLink
                to="/"
                title="Comunidades"
                icon={<FaHome />}
                label="Comunidades"
            />
        </>
    );
};

export default IconHome;
