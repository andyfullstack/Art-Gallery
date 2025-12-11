import React, { useEffect, useState } from 'react';
import { LanguageProvider } from '../contexts/language-context';
import { Header } from './header';
import { HeroSection } from './hero-section';
import { GalleryGrid, artworks } from './gallery-grid';
import { AboutSection } from './about-section';
import { Footer } from './footer';
import { GalleryModal } from './gallery-modal';
import { CartModal } from './cart-modal';
import { CategoriesSection } from './categories-section';
import { FeaturedArtwork } from './featured-artwork';
import { ScrollToTop } from './scroll-to-top';
import { AuthModal } from './auth-modal';
import { UserProfile } from './user-profile';
import { CheckoutModal } from './checkout-modal';

export function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const handleArtworkClick = index => {
    setModalIndex(index);
    setIsModalOpen(true);
  };

  const handleAddToCart = artwork => {
    setCart(prev => {
      const existing = prev.find(item => item.id === artwork.id);
      const priceValue =
        artwork.priceValue ||
        parseInt(String(artwork.price || '').replace(/[^0-9]/g, '')) ||
        0;
      if (existing) {
        return prev.map(item =>
          item.id === artwork.id
            ? { ...item, quantity: (item.quantity || 1) + 1, priceValue }
            : item
        );
      }
      return [
        ...prev,
        { ...artwork, quantity: artwork.quantity || 1, priceValue },
      ];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQty = (id, quantity) => {
    setCart(prev =>
      prev.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const handleRemove = id =>
    setCart(prev => prev.filter(item => item.id !== id));

  const handleOrderComplete = () => {
    setCart([]);
    setIsCheckoutOpen(false);
  };

  const cartItemsCount = cart.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  const handleCartClick = () => {
    if (cartItemsCount === 0) {
      setIsCartOpen(true);
      setIsCheckoutOpen(false);
      return;
    }

    setIsCheckoutOpen(true);
    setIsCartOpen(false);
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCart(parsed);
      }
    } catch (e) {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
      /* ignore */
    }
  }, [cart]);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Header
          onCartClick={handleCartClick}
          onAuthClick={() => setIsAuthOpen(true)}
          onProfileClick={() => {
            setIsProfileOpen(true);
            setIsCheckoutOpen(true);
          }}
          cartItemsCount={cartItemsCount}
        />
        <main>
          <HeroSection />
          <FeaturedArtwork onAddToCart={handleAddToCart} />
          <GalleryGrid
            onArtworkClick={handleArtworkClick}
            onAddToCart={handleAddToCart}
          />
          <CategoriesSection />
          <AboutSection />
        </main>
        <Footer />

        <CartModal
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cart}
          onUpdateQty={handleUpdateQty}
          onRemove={handleRemove}
          onCheckout={() => {
            setIsCartOpen(false);
            setIsCheckoutOpen(true);
          }}
        />

        <GalleryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          artworks={artworks}
          currentIndex={modalIndex}
          onAddToCart={handleAddToCart}
        />

        <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />

        {isProfileOpen && (
          <UserProfile
            cart={cart}
            onClose={() => setIsProfileOpen(false)}
            onCheckout={() => {
              setIsCheckoutOpen(true);
            }}
          />
        )}

        <CheckoutModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          cart={cart}
          onOrderComplete={handleOrderComplete}
          onUpdateQty={handleUpdateQty}
          onRemove={handleRemove}
        />

        <ScrollToTop />
      </div>
    </LanguageProvider>
  );
}

export default App;
