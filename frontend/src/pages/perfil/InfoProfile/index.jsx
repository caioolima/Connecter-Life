import "./style.css";
import React, { useState, useEffect, useRef } from "react";
import { useMyContext } from "../../../contexts/profile-provider";
import useEventsModals from "../hooks/useEventsModals";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/use-auth";
import usePhotoModal from "../hooks/usePhotoModal";
import useGetdata from "../hooks/useGetdata";

const InfoProfile = () => {
  const {
    profileImage,
    username,
    fullName,
    isEditMode,
    userPhotos,
    numberOfFollowers,
    numberOfFollowing,
    biography,
    isOwnProfile,
    isFollowing,
    setNumberOfFollowers
  } = useMyContext();

  const { handleEditClick, openModal } = useEventsModals();
  const { verifyRelationship, unfollowUser, followUser } = useGetdata();
  const { getFollowers, getFollowing } = useGetdata();
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const { userId } = useParams();
  const [isUpdatingFollowers, setIsUpdatingFollowers] = useState(false); 
  const { user } = useAuth();
  const isOwner = user && user.id === userId;

  const modalRef = useRef(null);

  useEffect(() => {
    const fetchFollowersAndFollowing = async () => {
      const fetchedFollowers = await getFollowers();
      const fetchedFollowing = await getFollowing();
      setFollowers(fetchedFollowers);
      setFollowing(fetchedFollowing);
    };
    fetchFollowersAndFollowing();
  }, [getFollowers, getFollowing]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      console.log('Clique fora do modal');
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowFollowersModal(false);
        setShowFollowingModal(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef]);
  
  

  const handleShowFollowers = () => {
    if (numberOfFollowers > 0) {
      setShowFollowersModal(true);
    }
  };

  const handleShowFollowing = () => {
    if (numberOfFollowing > 0) {
      setShowFollowingModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowFollowersModal(false);
    setShowFollowingModal(false);
  };
  useEffect(() => {
    const fetchFollowersAndFollowing = async () => {
      const fetchedFollowers = await getFollowers();
      const fetchedFollowing = await getFollowing();
      setFollowers(fetchedFollowers);
      setFollowing(fetchedFollowing);
    };
    fetchFollowersAndFollowing();
  }, [getFollowers, getFollowing]);

  const handleFollowButtonClick = async () => {
    try {
      setIsUpdatingFollowers(true);

      if (isFollowing) {
        await unfollowUser();
        setNumberOfFollowers((prevCount) => prevCount - 1);
      } else {
        await followUser();
        setNumberOfFollowers((prevCount) => prevCount + 1);
      }

      setIsUpdatingFollowers(false);
      verifyRelationship();
    } catch (error) {
      console.error("Erro ao seguir/deixar de seguir o usuário:", error);
      setIsUpdatingFollowers(false);
    }
  };
  
  return (
    <div className="profile-header">
      <div
        className="profile-photo-container"
        onClick={isOwner ? openModal : null}
      >
        <div className="profile-photo-frame">
          {profileImage !== null && profileImage !== "" ? (
            <img src={profileImage} alt="User" className="profile-photo" />
          ) : (
            <div className="add-image-icon">+</div>
          )}
        </div>
      </div>
      <div className="profile-info">
        <div className="user-info">
          <h1>{username}</h1>
          {isOwner && !isEditMode && (
            <button className="edit-button" onClick={handleEditClick}>
              Editar
            </button>
          )}
        </div>
        <div className="cont-photos">
          <p className="photo-count">
            {userPhotos.length > 0 ? (
              <strong>{userPhotos.length}</strong>
            ) : (
              <strong>0</strong>
            )}
            Publicações
          </p>
          {numberOfFollowers !== null && (
            <p className="followers-count" onClick={handleShowFollowers}>
              <strong>{numberOfFollowers}</strong>
              Seguidores
            </p>
          )}
          {numberOfFollowing !== null && (
            <p className="following-count" onClick={handleShowFollowing}>
              <strong>{numberOfFollowing}</strong>
              Seguindo
            </p>
          )}
        </div>

        <p className="fullname">{fullName}</p>

        <p className="bio">{biography}</p>

        {!isOwnProfile && user && user.id !== userId && (
          <button
            className={`follow-button ${isFollowing ? "following" : ""}`}
            onClick={() => {
              if (isFollowing) {
                unfollowUser();
                verifyRelationship();
              } else {
                followUser();
                verifyRelationship();
              }
            }}
          >
            {isFollowing ? "Seguindo" : "Seguir"}
          </button>
        )}
      </div>
      {showFollowersModal && (
  <div className="modal-modal-follow" ref={modalRef}>
    <div className="modal-content-two">
      <span className="closed-follow" onClick={handleCloseModal}>
        &times;
      </span>
      <h3>Seguidores</h3>
      <ul>
        {followers.map((follower) => (
          <li key={follower.id}>
            <img
              src={follower.profileImageUrl}
              alt={follower.username}
              className="follower-avatar"
            />
            <span className="username-follower">{follower.username}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
)}

{showFollowingModal && (
  <div className="modal-modal-follow" ref={modalRef}>
    <div className="modal-content-two">
      <span className="closed-follow" onClick={handleCloseModal}>
        &times;
      </span>
      <h3>Seguindo</h3>
      <ul>
        {following.map((followee) => (
          <li key={followee.id}>
            <img
              src={followee.profileImageUrl}
              alt={followee.username}
              className="followee-avatar"
            />
            <span className="username-follower">{followee.username}</span>
          </li>
        ))}
      </ul>
    </div>
  </div>
)}

    </div>
  );
};

export default InfoProfile;
