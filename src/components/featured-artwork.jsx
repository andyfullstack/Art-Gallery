import { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from '../contexts/language-context';
import { useScrollAnimation } from '../hooks/use-scroll-animation';
import { artworks } from './gallery-grid';

const featuredItems = [
  {
    titleKey: 'artwork2',
    artistKey: 'artist2',
    price: '52 000 ₴',
    image:
      'https://images.unsplash.com/photo-1716901548718-da465a9060fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1200',
  },
  {
    titleKey: 'artwork3',
    artistKey: 'artist3',
    price: '61 500 ₴',
    image:
      'https://images.unsplash.com/photo-1505761671935-60b3a7427bad?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1400',
  },
];

export function FeaturedArtwork({ onAddToCart } = {}) {
  const { t } = useLanguage();
  const { elementRef, isVisible } = useScrollAnimation();
  const [selectedImage, setSelectedImage] = useState(null);
  const [viewMode, setViewMode] = useState(0); // 0: original, 1: variant1, 2: variant2
  const [isScaled, setIsScaled] = useState(false);

  const handleAddFromFeatured = item => {
    if (!onAddToCart) return;

    const source = artworks.find(a => a.titleKey === item.titleKey);
    const priceValue =
      parseInt(
        String(item.price || source?.price || '').replace(/[^0-9]/g, '')
      ) || 0;

    onAddToCart({
      ...(source || {}),
      id: source?.id || item.titleKey,
      titleKey: item.titleKey,
      artistKey: item.artistKey,
      title: t[item.titleKey],
      artist: t[item.artistKey],
      price: item.price || source?.price,
      priceValue,
      quantity: 1,
    });
  };

  return (
    <section
      id="featured"
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-amber-50/40 dark:bg-amber-950/15 scroll-mt-24"
    >
      <div
        className="max-w-6xl mx-auto space-y-12 sm:space-y-16"
        ref={elementRef}
      >
        <div
          className={`scroll-animate ${
            isVisible ? 'visible' : ''
          } text-center lg:text-left`}
        >
          <p className="text-xs sm:text-sm uppercase tracking-[0.25em] text-accent dark:text-primary mb-3 font-medium">
            {t.featuredTitle}
          </p>
          <h2 className="mb-3 text-2xl sm:text-3xl md:text-4xl font-semibold text-primary dark:text-[#e8d5c4] leading-tight">
            {t.featuredDesc}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            {t.collectionSubtitle}
          </p>
        </div>

        <div className="flex flex-col gap-16">
          {featuredItems.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <article
                key={item.titleKey}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center scroll-animate ${
                  isVisible ? 'visible' : ''
                } ${isEven ? '' : 'lg:[&>*:first-child]:order-2'}`}
                style={{
                  animation: isVisible
                    ? `fade-in-up 0.6s ease ${0.1 + index * 0.2}s both`
                    : 'none',
                }}
              >
                <div
                  className="relative group -m-4 sm:-m-8 md:-m-[50px] p-4 sm:p-8 md:p-[50px] cursor-pointer overflow-visible"
                  onClick={() => setSelectedImage(item.image)}
                >
                  <div className="overflow-visible rounded-2xl shadow-2xl bg-muted/20 group-hover:shadow-2xl">
                    <div className="relative aspect-[4/3] overflow-visible rounded-2xl">
                      <ImageWithFallback
                        src={item.image}
                        alt={t[item.titleKey]}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.1] group-hover:translate-x-[20px] group-hover:-translate-y-[20px]"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2 lg:pl-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {t.featuredTitle}
                  </p>
                  <h3 className="text-2xl font-semibold text-foreground">
                    {t[item.titleKey]}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t.by} {t[item.artistKey]}
                  </p>
                  <p className="text-sm text-muted-foreground max-w-xl">
                    {t.featuredDesc}
                  </p>
                  <div className="pt-2 text-lg font-bold text-primary dark:text-accent">
                    {item.price}
                  </div>
                  <div>
                    <button
                      onClick={() => handleAddFromFeatured(item)}
                      className="mt-2 inline-flex px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-accent dark:bg-accent dark:hover:bg-primary shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-105 font-medium"
                    >
                      {t.addToCart}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative w-full max-w-3xl"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 p-2 rounded-full text-white/50 hover:text-white hover:ring-2 hover:ring-accent transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Main image with navigation arrows */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black group">
              <img
                src={selectedImage}
                alt="Fullscreen"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => {
                  setViewMode(prev => (prev - 1 + 3) % 3);
                  setIsScaled(true);
                  setTimeout(() => setIsScaled(false), 300);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => {
                  setViewMode(prev => (prev + 1) % 3);
                  setIsScaled(true);
                  setTimeout(() => setIsScaled(false), 300);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Gallery variants below */}
            <div className="flex gap-3 mt-6 justify-center">
              {[0, 1, 2].map(index => (
                <button
                  key={index}
                  onClick={() => {
                    setViewMode(index);
                    setIsScaled(true);
                    setTimeout(() => setIsScaled(false), 300);
                  }}
                  className={`w-24 h-16 rounded-lg overflow-visible border-2 transition-all transform ${
                    isScaled && viewMode === index
                      ? 'scale-125'
                      : 'hover:scale-125'
                  } ${
                    viewMode === index
                      ? 'border-accent'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <div className="w-full h-full overflow-hidden rounded-lg">
                    <img
                      src={selectedImage}
                      alt={`Variant ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </button>
              ))}
            </div>

            {/* Indicator dots below gallery */}
            <div className="flex gap-2 mt-4 justify-center">
              {[0, 1, 2].map(index => (
                <button
                  key={index}
                  onClick={() => setViewMode(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    viewMode === index
                      ? 'bg-accent w-8'
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                  aria-label={`View variant ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default FeaturedArtwork;
