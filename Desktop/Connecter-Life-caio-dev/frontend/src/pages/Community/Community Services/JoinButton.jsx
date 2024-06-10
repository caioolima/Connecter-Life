import React from "react";
import { Link } from "react-router-dom";

const JoinButton = ({ isMember, countryId, communityId, handleJoinCommunity }) => {
  return (
    isMember ? (
      <Link to={`/comunidade/${countryId}/${communityId}/chat`} className="join-button">
        Entrar
      </Link>
    ) : (
      <button className="join-button" onClick={handleJoinCommunity}>
        Participar da Comunidade
      </button>
    )
  );
};

export default JoinButton;
