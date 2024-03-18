// PublicationDetails.js
import React, { useEffect, useState } from "react";
import "./PublicationDetails.css"; // Importe o arquivo CSS
import SidebarMenuItems from "../Sidebar/SidebarMenuItems";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import Footer from "../Footer/footer";

const PublicationDetails = () => {
  const { userId, index } = useParams();
  const [imageURL, setImageURL] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();
  const { signOut } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // Redirecionar para a página de login se o token não existir
    }
  }, []);
  
  useEffect(() => {
    const fetchImageURL = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/users/${userId}/gallery-image`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (
            data &&
            data.galleryImageUrls &&
            data.galleryImageUrls.length > index
          ) {
            setImageURL(data.galleryImageUrls[index]);
          } else {
            console.error("Image URL not found in response data");
          }
        } else {
          console.error("Failed to fetch image URL:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching image URL:", error);
      }
    };

    fetchImageURL();
  }, [userId, index]);

  useEffect(() => {
    const fetchProfileImageURL = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          if (data && data.profileImageUrl) {
            setProfileImage(data.profileImageUrl);
            setUserName(data.username);
          } else {
            console.error("Profile image URL not found in response data");
          }
        } else {
          console.error("Failed to fetch profile image URL:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching profile image URL:", error);
      }
    };

    fetchProfileImageURL();
  }, [userId]);

  const handleSignOut = () => {
    signOut();
    navigate("/");
  };

  return (
    <div className="container-pub">
      <SidebarMenuItems
        userId={userId}
        handleSignOut={handleSignOut}
        openModalTwo={() => {}}
        hidePublishButton={true} // Aqui você define a propriedade para ocultar o botão "Publicar"
      />

      <div className="publication-details-container">
        <div className="publication-details-content">
          <div className="image-details-container">
            <img
              className="publication-image"
              src={imageURL}
              alt="Publicação"
            />
           <div className="publication-details">
 
  {profileImage && (
    <Link to={`/profile/${userId}`}>
      <img className="rounded-image" src={profileImage} alt="Profile" />
    </Link>
  )}
  <p className="details-user">
    <Link to={`/profile/${userId}`}>{userName}</Link>
  </p>
</div>
          </div>
          
          <Footer />
        </div>
      </div>
      
    </div>
  );
};

export default PublicationDetails;
