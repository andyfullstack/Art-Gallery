import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/language-context';
import 'flag-icons/css/flag-icons.min.css';

const languages = [
  { code: 'uk', name: 'Українська', flagCode: 'ua', buttonLabel: 'UA' },
  { code: 'en', name: 'US', flagCode: 'us', buttonLabel: 'EN' },
  { code: 'ru', name: 'Русский', flagCode: 'ru', buttonLabel: 'RU' },
];

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentLanguage =
    languages.find(lang => lang.code === language) || languages[0];

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(true);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 hover:bg-muted transition-colors rounded-lg"
        aria-label="Выбрать язык"
      >
        <span className="text-sm font-semibold leading-none tracking-wide">
          {currentLanguage.buttonLabel}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-3 ${
                language === lang.code ? 'bg-muted' : ''
              }`}
            >
              <span
                className={`fi fi-${lang.flagCode} text-xl leading-none`}
              ></span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
