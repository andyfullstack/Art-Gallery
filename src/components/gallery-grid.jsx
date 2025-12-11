import { ImageWithFallback } from './figma/ImageWithFallback';
import { ShoppingCart } from 'lucide-react';
import { useLanguage } from '../contexts/language-context';
import { useScrollAnimation } from '../hooks/use-scroll-animation';

const artworks = [
  {
    id: 1,
    image:
      'https://images.unsplash.com/photo-1656332693864-8a7ea5976605?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhYnN0cmFjdCUyMG1vZGVybiUyMGFydHxlbnwxfHx8fDE3NjQ2NzQzODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    titleKey: 'artwork1',
    artistKey: 'artist1',
    price: '45 000 ₴',
    additionalImages: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500',
      'https://images.unsplash.com/photo-1578926288207-a90a9ac7c9e0?w=500',
      'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?w=500',
    ],
  },
  {
    id: 2,
    image:
      'https://images.unsplash.com/photo-1716901548718-da465a9060fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmZ1bCUyMGFic3RyYWN0JTIwcGFpbnRpbmd8ZW58MXx8fHwxNzY0NTc3Njk5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    titleKey: 'artwork2',
    artistKey: 'artist2',
    price: '52 000 ₴',
    additionalImages: [
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=500',
      'https://images.unsplash.com/photo-1549887534-1541e9326642?w=500',
      'https://images.unsplash.com/photo-1556139954-ec19cce61d61?w=500',
    ],
  },
  {
    id: 3,
    image:
      'https://images.unsplash.com/photo-1678117699040-b89738399ca7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3YWxsJTIwYXJ0fGVufDF8fHx8MTc2NDY0OTk4OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    titleKey: 'artwork3',
    artistKey: 'artist3',
    price: '38 000 ₴',
    additionalImages: [
      'https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?w=500',
      'https://images.unsplash.com/photo-1577083165233-566d0c43e1a8?w=500',
      'https://images.unsplash.com/photo-1555514685-00fdb57f78b5?w=500',
    ],
  },
  {
    id: 4,
    image:
      'https://images.unsplash.com/photo-1665779736808-047a6bbf43a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtaW5pbWFsaXN0JTIwYXJ0d29ya3xlbnwxfHx8fDE3NjQ2NjU0NTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    titleKey: 'artwork4',
    artistKey: 'artist4',
    price: '41 000 ₴',
    additionalImages: [
      'https://images.unsplash.com/photo-1536924430914-91f9e2041b83?w=500',
      'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=500',
      'https://images.unsplash.com/photo-1513519245088-0e3d0b8c3b87?w=500',
    ],
  },
  {
    id: 5,
    image:
      'https://images.unsplash.com/photo-1684871431989-f02c4ed999fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuYXR1cmUlMjBhcnR3b3JrfGVufDF8fHx8MTc2NDY5NjIzNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    titleKey: 'artwork5',
    artistKey: 'artist5',
    price: '48 000 ₴',
    additionalImages: [
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500',
      'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=500',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500',
    ],
  },
  {
    id: 6,
    image:
      'https://images.unsplash.com/photo-1688588426729-dc4f7bdb8fbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYW5kc2NhcGUlMjBwYWludGluZ3xlbnwxfHx8fDE3NjQ2MjQxNTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
    titleKey: 'artwork6',
    artistKey: 'artist6',
    price: '55 000 ₴',
    additionalImages: [
      'https://images.unsplash.com/photo-1515405295579-ba7b45403062?w=500',
      'https://images.unsplash.com/photo-1533158326339-7f3cf2404354?w=500',
      'https://images.unsplash.com/photo-1518640552666-93f03308e67e?w=500',
    ],
  },
];

export { artworks };

export function GalleryGrid({ onArtworkClick, onAddToCart } = {}) {
  const { t } = useLanguage();
  const { elementRef, isVisible } = useScrollAnimation();

  const handleArtworkClick = index => {
    if (onArtworkClick) {
      onArtworkClick(index);
    }
  };

  const handleBuyClick = (e, artwork) => {
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart({
        ...artwork,
        title: t[artwork.titleKey],
        artist: t[artwork.artistKey],
        priceValue:
          parseInt(String(artwork.price || '').replace(/[^0-9]/g, '')) || 0,
      });
    }
  };

  return (
    <section
      id="gallery"
      className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-gray-100 dark:bg-gray-800 transition-colors duration-300 scroll-mt-24"
    >
      <div className="max-w-7xl mx-auto">
        <div
          ref={elementRef}
          className={`text-center mb-12 sm:mb-16 scroll-animate ${
            isVisible ? 'visible' : ''
          }`}
        >
          <h2 className="mb-4 text-primary dark:text-[#d4c799]">
            {t.ourCollection}
          </h2>
          <p className="text-xl text-foreground/70 dark:text-[#a8b5ac] max-w-2xl mx-auto">
            {t.collectionSubtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {artworks.map((artwork, index) => (
            <div
              key={artwork.id}
              onClick={() => handleArtworkClick(index)}
              className="group cursor-pointer"
              style={{
                animation: isVisible
                  ? `fade-in-up 0.6s ease-out ${index * 0.1}s both`
                  : 'none',
              }}
            >
              <div className="relative overflow-hidden mb-4 bg-card shadow-md hover:shadow-xl transition-shadow duration-300 rounded-lg aspect-[3/4]">
                <ImageWithFallback
                  src={artwork.image}
                  alt={t[artwork.titleKey]}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent group-hover:from-accent/50 transition-all duration-500 flex items-center justify-center">
                  <button
                    onClick={e => handleBuyClick(e, artwork)}
                    className="px-6 py-3 bg-primary text-primary-foreground hover:bg-accent dark:bg-accent dark:text-accent-foreground dark:hover:bg-primary opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-2xl hover:scale-105 rounded-lg font-medium"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    {t.buy}
                  </button>
                </div>
              </div>
              <div className="px-2">
                <h3 className="mb-2 dark:text-primary">
                  {t[artwork.titleKey]}
                </h3>
                <p className="text-muted-foreground dark:text-[#a8b5ac] mb-2">
                  {t[artwork.artistKey]}
                </p>
                <p className="text-lg text-accent dark:text-primary">
                  {artwork.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
