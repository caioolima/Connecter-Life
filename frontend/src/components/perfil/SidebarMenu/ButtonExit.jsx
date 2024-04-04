import useEventsModals from "../hooks/useEventsModals";
import { FaDoorOpen } from "react-icons/fa"

const ButtonExit = () => {
    
    const { handleSignOut } = useEventsModals();
    
    return (
        <>
            <button
                onClick={handleSignOut}
                title="Sair"
                className="sidebar-link">
                <FaDoorOpen />
                <span>Sair</span>
            </button>
        </>
    );
};

export default ButtonExit;
