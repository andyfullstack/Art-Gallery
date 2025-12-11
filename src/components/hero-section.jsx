import { ChevronDown } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useLanguage } from '../contexts/language-context';

export function HeroSection({ onViewCollection } = {}) {
  const { t } = useLanguage();

  const handleClick = () => {
    if (onViewCollection) {
      onViewCollection();
      return;
    }

    const element = document.getElementById('gallery');
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative h-[70vh] flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1545066838-872c79c46501?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb2Z0JTIwYm9va3N0b3JlJTIwY2FmZSUyMGludGVyaW9yfGVufDF8fHx8MTc2NDc3NTI1N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Art Gallery Bookstore Cafe"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2c2c2c]/60 via-[#4a5f5a]/40 to-[#7a9186]/30 dark:from-black/70 dark:via-[#1a1a1a]/60 dark:to-[#2d2d2d]/50"></div>
      </div>

      <div className="relative z-10 text-center text-white px-4 sm:px-6 max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 animate-fade-in drop-shadow-lg dark:text-[#e8d5c4]">
          {t.heroTitle}
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-3xl mx-auto opacity-95 drop-shadow-md dark:text-[#f0ebe5] leading-relaxed">
          {t.heroSubtitle}
        </p>
        <button
          onClick={handleClick}
          className="px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base bg-accent text-white hover:bg-primary dark:bg-primary dark:hover:bg-accent transition-all duration-300 transform hover:scale-105 shadow-lg rounded-lg font-medium"
        >
          {t.viewCollection}
        </button>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white opacity-70" />
      </div>
    </section>
  );
}
