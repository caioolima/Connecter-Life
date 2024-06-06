import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next"; // Importa o hook useTranslation
import "./style.css";
import { useMyContext } from "../../../contexts/profile-provider";
import useEventsModals from "../hooks/useEventsModals";
import { useAuth } from "../../../contexts/auth-provider";
import { useParams } from "react-router-dom";

const Galeria = () => {
  const { t } = useTranslation(); // Usa o hook useTranslation para tradução
  const { userPhotos } = useMyContext();
  const { handlePublicationClick } = useEventsModals();
  const [savedPosts, setSavedPosts] = useState([]); // Estado para armazenar as publicações salvas
  const [loadedImages, setLoadedImages] = useState(
    Array(userPhotos.length).fill(false)
  );
  const [activeTab, setActiveTab] = useState("galeria"); // Estado para controlar a guia ativa
  const { user } = useAuth();
  const { userId } = useParams();

  useEffect(() => {
    const preloadImages = () => {
      userPhotos.forEach((photoData, index) => {
        const img = new Image();
        img.src = photoData.url;
        img.onload = () => handleImageLoaded(index);
        img.onerror = (e) =>
          console.error(`Failed to load image at ${photoData.url}`, e);
      });
    };

    if (userPhotos.length > 0) {
      preloadImages();
    }
  }, [userPhotos]);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        console.log(userId);
        // Fazer uma requisição para obter as publicações salvas
        const response = await fetch(
          `http://localhost:3000/feedRoutes/savedPosts/${userId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch saved posts");
        }
        const data = await response.json();
        setSavedPosts(data.savedPosts);
      } catch (error) {
        console.error("Error fetching saved posts:", error);
      }
    };

    // Se a guia ativa for 'salvos' e o userId corresponder ao user.id, buscar as publicações salvas
    if (activeTab === "salvos" && user && userId === user.id) {
      fetchSavedPosts();
    }
  }, [activeTab, userId, user]);

  const handleImageLoaded = (index) => {
    setLoadedImages((prevLoadedImages) => {
      const newLoadedImages = [...prevLoadedImages];
      newLoadedImages[index] = true;
      return newLoadedImages;
    });
  };

  const toggleTab = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="galery-contain">
      <div className="tab-buttons">
        <button
          className={activeTab === "galeria" ? "active-tab" : ""}
          onClick={() => toggleTab("galeria")}
        >
          {t("gallery")} {/* Traduz 'Galeria' */}
        </button>
        {/* Renderiza o botão Salvos apenas se o user e userId corresponderem ao user.id */}
        {user && userId === user.id && (
          <button
            className={activeTab === "salvos" ? "active-tab" : ""}
            onClick={() => toggleTab("salvos")}
          >
            {t("saved")} {/* Traduz 'Salvos' */}
          </button>
        )}
      </div>
      <div
        className={`photo-gallery ${
          activeTab === "galeria" ? "active-tab" : "saved-tab"
        }`}
      >
        {activeTab === "galeria" ? (
          userPhotos.length > 0 ? (
            <div className="photo-grid">
              {userPhotos.map((photoData, index) => (
                <div className="photo-item" key={index}>
                  <button onClick={() => handlePublicationClick(index)}>
                    {!loadedImages[index] && (
                      <div className="loading-spinner">
                        <div className="dot-loader"></div>
                        <div className="dot-loader"></div>
                        <div className="dot-loader"></div>
                      </div>
                    )}
                    <img
                      src={photoData.url}
                      alt={t("photo")}
                      style={{
                        opacity: loadedImages[index] ? 1 : 0,
                        transition: "opacity 0.5s",
                      }}
                      onLoad={() => handleImageLoaded(index)}
                    />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="empty-gallery-message">{t("no_photos")}</p>
          )
        ) : (
          userId === user.id && (
            <div className="photo-gallery">
              {savedPosts.length > 0 ? (
                <div className="photo-grid">
                  {savedPosts.map((post, index) => (
                    <div className="photo-item" key={index}>
                      {!loadedImages[index] && (
                        <div className="loading-spinner">
                          <div className="dot-loader"></div>
                          <div className="dot-loader"></div>
                          <div className="dot-loader"></div>
                        </div>
                      )}
                      <a href={`/profile/${post.postOwnerId}`}>
                        <img
                          src={post.imageUrl}
                          alt={t("saved_post")}
                          style={{
                            opacity: loadedImages[index] ? 1 : 0,
                            transition: "opacity 0.5s",
                          }}
                        />
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-saved-posts-message">
                  {t("no_saved_posts")}
                </p>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Galeria;
