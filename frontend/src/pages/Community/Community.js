// No arquivo Community.js

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

/* Components */
import SidebarMenu from "../perfil/SidebarMenu/index";

const Community = () => {
  const { country } = useParams();
  const [communityData, setCommunityData] = useState({});

 

  return (
    <div className="community-container">
      <h2>Comunidade de {country}</h2>
      <SidebarMenu /> {/* Menu */}
    </div>
  );
};

export default Community;
