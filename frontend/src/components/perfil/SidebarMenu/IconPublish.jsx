import SidebarLink from "./SideBarLink.jsx"
import { FaPlusSquare } from "react-icons/fa"
import useEventsModals from "../hooks/useEventsModals";

const IconPublish = () => {
    
    const { handlePublishClick } = useEventsModals();
    
    return (
        <>
            <SidebarLink
                title="Publicar"
                icon={<FaPlusSquare />}
                label="Publicar"
                onClick={handlePublishClick}
            />
        </>
    );
};

export default IconPublish;
