import SidebarLink from "./SideBarLink.jsx"
import { FaSearch } from "react-icons/fa"

const IconSearch = () => {
    return (
        <>
            <SidebarLink
                to="/search"
                title="Pesquisa"
                icon={<FaSearch />}
                label="Busque"
            />
        </>
    );
};

export default IconSearch;
