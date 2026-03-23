import React, { useState } from 'react';


const ImageGallery = ({ images, productTitle }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });

  // Handle thumbnail click
  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
    setIsZoomed(false);
  };

  // Handle previous image
  const handlePrevious = () => {
    setSelectedImageIndex((prev) => 
      prev === 0 ? images.length - 1 : prev - 1
    );
    setIsZoomed(false);
  };

  // Handle next image
  const handleNext = () => {
    setSelectedImageIndex((prev) => 
      prev === images.length - 1 ? 0 : prev + 1
    );
    setIsZoomed(false);
  };

  // Handle mouse move for zoom
  const handleMouseMove = (e) => {
    if (!isZoomed) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      handlePrevious();
    } else if (e.key === 'ArrowRight') {
      handleNext();
    } else if (e.key === 'Escape') {
      setIsZoomed(false);
    }
  };

  // Get current image
  const currentImage = images[selectedImageIndex];

  return (
    <div className="image-gallery" onKeyDown={handleKeyDown} tabIndex="0">
      {/* Main Image Display */}
      <div className="image-gallery__main">
        <div 
          className={`image-gallery__image-container ${isZoomed ? 'zoomed' : ''}`}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
        >
          <img
            src={currentImage.url}
            alt={`${productTitle} - Image ${selectedImageIndex + 1}`}
            className="image-gallery__image"
            style={isZoomed ? {
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              transform: 'scale(2.5)'
            } : {}}
          />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                className="image-gallery__nav image-gallery__nav--prev"
                onClick={handlePrevious}
                aria-label="Previous image"
              >
                <i className="bx bx-chevron-left"></i>
              </button>
              <button
                className="image-gallery__nav image-gallery__nav--next"
                onClick={handleNext}
                aria-label="Next image"
              >
                <i className="bx bx-chevron-right"></i>
              </button>
            </>
          )}

          {/* Image Counter */}
          <div className="image-gallery__counter">
            {selectedImageIndex + 1} / {images.length}
          </div>

          {/* Zoom Indicator */}
          {!isZoomed && (
            <div className="image-gallery__zoom-hint">
              <i className="bx bx-search-alt"></i> Hover to zoom
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Strip */}
      <div className="image-gallery__thumbnails">
        <div className="image-gallery__thumbnails-container">
          {images.map((image, index) => (
            <button
              key={index}
              className={`image-gallery__thumbnail ${
                selectedImageIndex === index ? 'active' : ''
              }`}
              onClick={() => handleThumbnailClick(index)}
              aria-label={`View image ${index + 1}`}
            >
              <img
                src={image.url}
                alt={`${productTitle} thumbnail ${index + 1}`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageGallery;