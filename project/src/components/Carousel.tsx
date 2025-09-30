import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { dbFunctions } from '../lib/database';
import { CarouselImage } from '../types/database';
import { CAROUSEL_CONFIG } from '../utils/constants';
import { LoadingSpinner } from './ui/LoadingSpinner';

export const Carousel: React.FC = () => {
  const [images, setImages] = useState<CarouselImage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCarouselImages();
  }, []);

  const loadCarouselImages = async () => {
    setLoading(true);
    try {
      const carouselImages = await dbFunctions.getCarouselImages();
      setImages(carouselImages);
    } catch (error) {
      console.error('Error loading carousel images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, CAROUSEL_CONFIG.AUTO_PLAY_INTERVAL);

    return () => clearInterval(interval);
  }, [images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  if (loading) {
    return (
      <div className="relative h-64 md:h-96 bg-gradient-to-r from-red-600 to-purple-700 flex items-center justify-center">
        <div className="text-center text-white">
          <LoadingSpinner size="lg" className="mx-auto mb-4 border-white" />
          <p className="text-xl">Carregando...</p>
        </div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="relative h-64 md:h-96 bg-gradient-to-r from-red-600 to-purple-700 flex items-center justify-center">
        <p className="text-white text-xl">Nenhuma imagem disponível</p>
      </div>
    );
  }

  return (
    <div className="relative h-64 md:h-96 overflow-hidden rounded-lg shadow-2xl">
      {/* Images */}
      <div
        className="flex transition-transform ease-in-out h-full"
        style={{ 
          transform: `translateX(-${currentIndex * 100}%)`,
          transitionDuration: `${CAROUSEL_CONFIG.TRANSITION_DURATION}ms`
        }}
      >
        {images.map((image) => (
          <div key={image.id} className="min-w-full h-full relative">
            <img
              src={image.image_url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent">
              <div className="absolute bottom-6 left-6">
                <h3 className="text-white text-xl md:text-2xl font-bold">
                  {image.title}
                </h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
      >
        <ChevronRight size={24} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};