import React, { createContext, useContext, useState, useMemo } from 'react';
import translations from '../utils/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: translations[language] || translations.en,
    }),
    [language]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return { language: ctx.language, setLanguage: ctx.setLanguage, t: ctx.t };
}
