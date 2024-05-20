import React, { useState, useEffect } from 'react';
import "./style.css";
import { useMyContext } from "../../../contexts/profile-provider";
import useEventsModals from "../hooks/useEventsModals";

const Galeria = () => {
  const { userPhotos } = useMyContext();
  const { handlePublicationClick } = useEventsModals();

  const [loadedImages, setLoadedImages] = useState(Array(userPhotos.length).fill(false));
  useEffect(() => {
    const preloadImages = () => {
      userPhotos.forEach((photoData, index) => {
        const img = new Image();
        img.src = photoData.url;
        img.onload = () => handleImageLoaded(index);
        img.onerror = (e) => console.error(`Failed to load image at ${photoData.url}`, e);
      });
    };

    if (userPhotos.length > 0) {
      preloadImages();
    }
  }, [userPhotos]);

  const handleImageLoaded = (index) => {
    setLoadedImages((prevLoadedImages) => {
      const newLoadedImages = [...prevLoadedImages];
      newLoadedImages[index] = true;
      return newLoadedImages;
    });
  };

  return (
    <div className="galery-contain">
      <h2 className="title-photo">Galeria</h2>
      <div className="photo-gallery">
        {userPhotos.length > 0 ? (
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
                    alt={`Foto ${index}`}
                    style={{ opacity: loadedImages[index] ? 1 : 0, transition: 'opacity 0.5s' }}
                    onLoad={() => handleImageLoaded(index)}
                  />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-gallery-message">Não há fotos na galeria.</p>
        )}
      </div>
    </div>
  );
};

export default Galeria;
