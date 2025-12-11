import { useEffect, useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from '../contexts/language-context';

export function GalleryModal({
  isOpen,
  onClose,
  artworks,
  currentIndex,
  onAddToCart,
}) {
  const { t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(currentIndex ?? 0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const containerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(currentIndex ?? 0);
      setSelectedImageIndex(0);
    }
  }, [currentIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const container = containerRef.current;
    if (!container) return;

    const handleWheelEvent = e => {
      e.preventDefault();
      if (e.deltaY > 0) {
        setActiveIndex(prev => (prev === artworks.length - 1 ? 0 : prev + 1));
      } else if (e.deltaY < 0) {
        setActiveIndex(prev => (prev === 0 ? artworks.length - 1 : prev - 1));
      }
      setSelectedImageIndex(0);
    };

    container.addEventListener('wheel', handleWheelEvent, { passive: false });
    return () => container.removeEventListener('wheel', handleWheelEvent);
  }, [artworks.length, isOpen]);

  if (!isOpen) return null;

  const currentArtwork = artworks?.[activeIndex];
  if (!currentArtwork) return null;

  const title = t[currentArtwork.titleKey];
  const artist = t[currentArtwork.artistKey];
  const priceValue =
    parseInt(String(currentArtwork.price || '').replace(/[^0-9]/g, '')) || 0;

  const allImages = [currentArtwork.image, ...currentArtwork.additionalImages];

  const handlePrevious = () => {
    setActiveIndex(prev => (prev === 0 ? artworks.length - 1 : prev - 1));
    setSelectedImageIndex(0);
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev === artworks.length - 1 ? 0 : prev + 1));
    setSelectedImageIndex(0);
  };

  const handleAddToCart = () => {
    onAddToCart({
      ...currentArtwork,
      title,
      artist,
      priceValue,
      quantity: 1,
    });
    onClose();
  };

  const handleBackdropClick = e => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-2 md:p-4 overflow-y-auto"
      onClick={handleBackdropClick}
    >
      <div className="relative bg-background w-full max-w-5xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl my-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-background/80 hover:bg-muted rounded-full transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
            {/* Main Image */}
            <div>
              <div className="relative mb-4">
                <ImageWithFallback
                  src={allImages[selectedImageIndex]}
                  alt={title}
                  className="w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover rounded-lg shadow-lg"
                />

                {/* Navigation arrows */}
                <button
                  onClick={handlePrevious}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-3 bg-background/80 hover:bg-muted rounded-full transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-background/80 hover:bg-muted rounded-full transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Additional images thumbnails */}
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative overflow-hidden rounded-lg ${
                      selectedImageIndex === index ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <ImageWithFallback
                      src={img}
                      alt={`${title} view ${index + 1}`}
                      className="w-full h-16 md:h-20 object-cover hover:opacity-80 transition-opacity"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="mt-6 lg:mt-0">
              <h2 className="mb-3 md:mb-4 text-primary dark:text-[#d4c799]">
                {title}
              </h2>
              <p className="text-xl text-foreground/80 dark:text-[#a8b5ac] mb-6">
                {t.by} {artist}
              </p>
              <p className="text-3xl text-accent dark:text-primary mb-6">
                {currentArtwork.price}
              </p>

              <p className="text-foreground/70 dark:text-muted-foreground mb-8">
                {t.artworkDescription}
              </p>

              <button
                onClick={handleAddToCart}
                className="w-full px-8 py-4 bg-primary text-primary-foreground hover:bg-accent dark:bg-accent dark:text-accent-foreground dark:hover:bg-primary transition-all duration-300 shadow-md hover:shadow-2xl transform hover:scale-[1.02] rounded-lg font-semibold"
              >
                {t.addToCart}
              </button>

              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="mb-4 dark:text-primary">{t.artworkDetails}</h3>
                <ul className="space-y-2 text-foreground/70 dark:text-muted-foreground">
                  <li>• {t.artworkSize}</li>
                  <li>• {t.artworkMaterial}</li>
                  <li>• {t.artworkYear}</li>
                  <li>• {t.artworkOriginal}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
