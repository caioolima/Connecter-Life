import React, { useEffect, createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

const MyContext = createContext("");

const MyContextProvider = ({ children }) => {
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isEditMode, setEditMode] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [biography, setBiography] = useState("");
    const [isBiographyVisible, setBiographyVisible] = useState(false);
    const [formData, setFormData] = useState({});
    const [modalFullName, setModalFullName] = useState("");
    const [modalDateOfBirth, setModalDateOfBirth] = useState("");
    const [isTextFieldFocused, setIsTextFieldFocused] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [countryCode, setCountryCode] = useState("");
    const [newPhoneNumber, setNewPhoneNumber] = useState("");
    const [newPhone, setNewPhone] = useState("");
    const [phoneError, setPhoneError] = useState("");
    const [userPhotos, setUserPhotos] = useState([]);
    const [showPhotoModal, setShowPhotoModal] = useState(false);
    const [selectedPublication, setSelectedPublication] = useState(null);
    const [selectedPublicationIndex, setSelectedPublicationIndex] =
        useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [isOwnProfile, setIsOwnProfile] = useState(false);
    const [followersCount, setFollowersCount] = useState(0);
    const [imageURL, setImageURL] = useState("");
    const [userName, setUserName] = useState("");
    const [newBiography, setNewBiography] = useState("");
    const [uploadProgress, setUploadProgress] = useState(0);
    const [currentUserProfileImage, setCurrentUserProfileImage] =
        useState(null);
    const [usernameError, setUsernameError] = useState("");
    const navigate = useNavigate();
    
    return <MyContext.Provider value={{
      fullName, setFullName,
      username, setUsername,
      profileImage, setProfileImage,
      showModal, setShowModal,
      selectedImage, setSelectedImage,
      isEditMode, setEditMode,
      newUsername, setNewUsername,
      biography, setBiography,
      isBiographyVisible, setBiographyVisible,
      formData, setFormData,
      modalFullName, setModalFullName,
      modalDateOfBirth, setModalDateOfBirth,
      isTextFieldFocused, setIsTextFieldFocused,
      phoneNumber, setPhoneNumber,
      countryCode, setCountryCode,
      newPhoneNumber, setNewPhoneNumber,
      newPhone, setNewPhone,
      phoneError, setPhoneError,
      userPhotos, setUserPhotos,
      showPhotoModal, setShowPhotoModal,
      selectedPublication, setSelectedPublication,
      selectedPublicationIndex, setSelectedPublicationIndex,
      isFollowing, setIsFollowing,
      isOwnProfile, setIsOwnProfile,
      followersCount, setFollowersCount,
      navigate,
      imageURL, setImageURL,
      userName, setUserName,
      newBiography, setNewBiography,
      uploadProgress, setUploadProgress,
      currentUserProfileImage, setCurrentUserProfileImage,
      usernameError, setUsernameError
    }}>{children}</MyContext.Provider>;
};

const useMyContext = () => useContext(MyContext);

export { MyContextProvider, useMyContext };
