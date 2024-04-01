import "./style.css";
import { useMyContext } from "../../../contexts/profile-provider";
import useEventsModals from "../hooks/useEventsModals";
import { useEffect, useRef, useState } from "react";

const Galeria = () => {
  const { userPhotos } = useMyContext();
  const { handlePublicationClick } = useEventsModals();
  const observer = useRef(null);
  const [loadingImages, setLoadingImages] = useState(Array(userPhotos.length).fill(true));

  useEffect(() => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          lazyImage.src = lazyImage.dataset.src;
          observer.current.unobserve(lazyImage);
        }
      });
    });

    const images = document.querySelectorAll(".lazy");
    images.forEach((image) => {
      observer.current.observe(image);
    });

    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, [userPhotos]);

  const handleImageLoaded = (index) => {
    setLoadingImages((prevLoadingImages) => {
      const newLoadingImages = [...prevLoadingImages];
      newLoadingImages[index] = false;
      return newLoadingImages;
    });
  };

  return (
    <>
      <h2 className="title-photo">Galeria</h2>
      <div className="photo-gallery">
        {userPhotos.length > 0 ? (
          <div className="photo-grid">
            {userPhotos.map((photo, index) => (
              <div className="photo-item" key={index}>
                {photo && photo.url && (
                  <button onClick={(event) => handlePublicationClick(index, event)}>
                    {loadingImages[index] && (
                      <div className="loading-overlay">
                        <div className="loading-spinner"></div>
                      </div>
                    )}
                    <img
                      className="lazy"
                      data-src={photo.url}
                      alt={`Foto ${index}`}
                      onLoad={() => handleImageLoaded(index)}
                    />
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-gallery-message">Não há fotos na galeria.</p>
        )}
      </div>
    </>
  );
};

export default Galeria;
