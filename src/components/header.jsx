import { ShoppingCart, Menu, X, User, LogOut } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import { ThemeToggle } from './theme-toggle';
import { LanguageToggle } from './language-toggle';
import { useLanguage } from '../contexts/language-context';
import { useAuth, logout } from '../hooks/use-auth';

export function Header({
  onCartClick,
  onAuthClick,
  onProfileClick,
  cartItemsCount,
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [navTone, setNavTone] = useState('dark');
  const { t } = useLanguage();
  const { user } = useAuth();
  const userMenuRef = useRef(null);

  // Тоны для секций: светлый фон -> медный текст, темный фон -> белый текст
  const sectionToneMap = useMemo(
    () => ({
      hero: 'dark',
      featured: 'light',
      gallery: 'light',
      categories: 'light',
      about: 'light',
      footer: 'dark',
    }),
    []
  );
  const sectionIds = useMemo(
    () => Object.keys(sectionToneMap),
    [sectionToneMap]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        let bestEntry = null;

        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          if (
            !bestEntry ||
            entry.intersectionRatio > bestEntry.intersectionRatio
          ) {
            bestEntry = entry;
          }
        });

        if (bestEntry) {
          const tone = sectionToneMap[bestEntry.target.id] || 'light';
          setNavTone(tone);
        }
      },
      {
        threshold: [0.25, 0.5, 0.75],
        rootMargin: '-30% 0px -30% 0px',
      }
    );

    const elements = sectionIds
      .map(id => document.getElementById(id))
      .filter(Boolean);

    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [sectionIds, sectionToneMap]);

  // Закрытие меню при клике вне его
  useEffect(() => {
    const handleClickOutside = event => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLogout = async () => {
    const result = await logout();
    if (result.success) {
      setShowUserMenu(false);
    }
  };

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const navTextClass = navTone === 'dark' ? 'text-white' : 'text-accent';
  const navHoverClass =
    navTone === 'dark' ? 'hover:text-white/80' : 'hover:text-primary';
  const iconToneClass = `${navTextClass} ${navHoverClass}`;
  const cartIconColor = cartItemsCount > 0 ? 'text-accent' : 'text-white';
  const authIconColor = cartItemsCount > 0 ? 'text-white' : 'text-accent';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center min-w-0">
            <h3
              className={`cursor-pointer text-base sm:text-lg md:text-xl truncate ${
                navTone === 'dark' ? 'text-white' : 'text-accent'
              }`}
            >
              Art Gallery
            </h3>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-8">
            <a
              href="#hero"
              onClick={e => handleNavClick(e, 'hero')}
              className={`text-sm lg:text-base transition-colors font-medium ${navTextClass} ${navHoverClass}`}
            >
              {t.home}
            </a>
            <a
              href="#gallery"
              onClick={e => handleNavClick(e, 'gallery')}
              className={`text-sm lg:text-base transition-colors font-medium ${navTextClass} ${navHoverClass}`}
            >
              {t.collection}
            </a>
            <a
              href="#categories"
              onClick={e => handleNavClick(e, 'categories')}
              className={`text-sm lg:text-base transition-colors font-medium ${navTextClass} ${navHoverClass}`}
            >
              {t.artists}
            </a>
            <a
              href="#about"
              onClick={e => handleNavClick(e, 'about')}
              className={`text-sm lg:text-base transition-colors font-medium ${navTextClass} ${navHoverClass}`}
            >
              {t.about}
            </a>
            <a
              href="#footer"
              onClick={e => handleNavClick(e, 'footer')}
              className={`text-sm lg:text-base transition-colors font-medium ${navTextClass} ${navHoverClass}`}
            >
              {t.contacts}
            </a>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageToggle />
            <ThemeToggle />

            {user ? (
              <div
                className="relative"
                ref={userMenuRef}
                onMouseEnter={() => setShowUserMenu(true)}
              >
                <button
                  onClick={() => setShowUserMenu(prev => !prev)}
                  className={`flex items-center gap-2 p-2 transition-colors rounded-lg ${iconToneClass}`}
                  aria-label="User menu"
                >
                  <User className={`w-4 h-4 sm:w-5 sm:h-5 ${authIconColor}`} />
                  <span className="hidden lg:inline text-sm font-medium truncate max-w-[120px] text-accent">
                    {(user.displayName || t.userPlaceholder).split(' ')[0]}
                  </span>
                </button>

                {showUserMenu && (
                  <div
                    className="absolute right-0 sm:-right-20 mt-2 w-64 sm:w-72 max-h-72 overflow-y-auto rounded-lg border border-border/70 shadow-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm py-2 z-50 transition-all duration-200"
                    style={{ animation: 'fade-in-up 0.18s ease-out both' }}
                    onMouseEnter={() => setShowUserMenu(true)}
                    onMouseLeave={() => setShowUserMenu(false)}
                  >
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium truncate">
                        {user.displayName || t.userPlaceholder}
                      </p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserMenu(true);
                        onProfileClick();
                      }}
                      className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-muted transition-colors"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {t.myPurchases}
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left flex items-center gap-2 hover:bg-muted transition-colors text-red-600 dark:text-red-400"
                    >
                      <LogOut className="w-4 h-4" />
                      {t.logout}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className={`p-2 transition-colors rounded-lg ${iconToneClass}`}
                aria-label="User account"
              >
                <User className={`w-5 h-5 ${authIconColor}`} />
              </button>
            )}

            <button
              onClick={onCartClick}
              className={`relative p-1.5 sm:p-2 transition-colors rounded-lg ${iconToneClass}`}
              aria-label="Shopping cart"
            >
              <ShoppingCart
                className={`w-4 h-4 sm:w-5 sm:h-5 ${cartIconColor}`}
              />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-accent dark:bg-primary rounded-full text-[10px] sm:text-xs flex items-center justify-center text-white font-medium">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              className={`md:hidden p-1.5 sm:p-2 transition-colors ${iconToneClass}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              ) : (
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <nav className="flex flex-col px-4 py-6 gap-4">
            <a
              href="#hero"
              onClick={e => handleNavClick(e, 'hero')}
              className={`py-2 transition-colors ${navTextClass} ${navHoverClass}`}
            >
              {t.home}
            </a>
            <a
              href="#gallery"
              onClick={e => handleNavClick(e, 'gallery')}
              className={`py-2 transition-colors ${navTextClass} ${navHoverClass}`}
            >
              {t.collection}
            </a>
            <a
              href="#categories"
              onClick={e => handleNavClick(e, 'categories')}
              className={`py-2 transition-colors ${navTextClass} ${navHoverClass}`}
            >
              {t.artists}
            </a>
            <a
              href="#about"
              onClick={e => handleNavClick(e, 'about')}
              className={`py-2 transition-colors ${navTextClass} ${navHoverClass}`}
            >
              {t.about}
            </a>
            <a
              href="#footer"
              onClick={e => handleNavClick(e, 'footer')}
              className={`py-2 transition-colors ${navTextClass} ${navHoverClass}`}
            >
              {t.contacts}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
