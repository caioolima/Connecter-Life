import "./style.css"
import { useMyContext } from "../../../contexts/profile-provider";
import useEventsModals from "../hooks/useEventsModals";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/use-auth";
import usePhotoModal from "../hooks/usePhotoModal";

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
    newBiography,
    isOwnProfile,
    isFollowing,
    unfollowUser,
    followUser,
    css
  } = useMyContext();

  const { handleEditClick, openModal } = useEventsModals();

  const { verifyRelationship } = usePhotoModal();

  const { userId } = useParams();
  const { user } = useAuth();
  const isOwner = user && user.id === userId;

  return (
    <div className="profile-header">
      <div className="profile-photo-container" onClick={openModal}>
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
            <p className="followers-count">
              <strong>{numberOfFollowers}</strong>
              Seguidores
            </p>
          )}
          {numberOfFollowing !== null && (
            <p className="following-count">
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
                verifyRelationship(); // Chama verifyRelationship após parar de seguir
              } else {
                followUser();
                verifyRelationship(); // Chama verifyRelationship após seguir
              }
            }}
          >
            {isFollowing ? "Seguindo" : "Seguir"}
          </button>
        )}
      </div>
    </div>
  );
};

export default InfoProfile;
