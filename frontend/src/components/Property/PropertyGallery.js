import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaTimes, FaPlay } from 'react-icons/fa';

const PropertyGallery = ({ images = [], videos = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const allMedia = [...images, ...videos.map(v => ({ ...v, isVideo: true }))];
  const primaryImage = images.find(img => img.isPrimary) || images[0];

  if (!images.length && !videos.length) {
    return (
      <div className="bg-gray-200 h-96 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  return (
    <div>
      <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden cursor-pointer">
        {showVideo ? (
          <iframe
            src={videos[0]?.url}
            className="w-full h-full"
            allowFullScreen
            title="Property Video"
          />
        ) : (
          <img
            src={primaryImage?.url || images[currentIndex]?.url}
            alt="Property"
            className="w-full h-full object-cover"
            onClick={() => setShowLightbox(true)}
          />
        )}

        {videos.length > 0 && !showVideo && (
          <button
            onClick={() => setShowVideo(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/50"
          >
            <div className="bg-white rounded-full p-4">
              <FaPlay className="text-primary text-2xl" />
            </div>
          </button>
        )}

        {images.length > 1 && !showVideo && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
            >
              <FaChevronRight />
            </button>
          </>
        )}

        <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {images.length > 1 && !showVideo && (
        <div className="flex mt-4 space-x-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setShowVideo(false);
              }}
              className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                currentIndex === index ? 'ring-2 ring-primary' : ''
              }`}
            >
              <img
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {showLightbox && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300"
          >
            <FaTimes />
          </button>

          <img
            src={images[currentIndex]?.url}
            alt="Lightbox"
            className="max-w-full max-h-full object-contain"
          />

          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-2 rounded-full hover:bg-white/30"
              >
                <FaChevronLeft size={24} />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 text-white p-2 rounded-full hover:bg-white/30"
              >
                <FaChevronRight size={24} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default PropertyGallery;