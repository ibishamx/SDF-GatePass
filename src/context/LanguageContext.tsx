/**
 * SALEEM DAAL FACTORY - GATE PASS MANAGEMENT SYSTEM
 * Language & Internationalization Context (Urdu / English)
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, Language } from '../utils/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: keyof typeof translations.en) => string;
  isUrdu: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default language set to Urdu 'ur' as requested ("convert the whole app language into urdu")
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('sdf_app_language');
    return (saved === 'en' || saved === 'ur') ? saved : 'ur';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sdf_app_language', lang);
  };

  const toggleLanguage = () => {
    const newLang = language === 'ur' ? 'en' : 'ur';
    setLanguage(newLang);
  };

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: keyof typeof translations.en): string => {
    const dict = translations[language] || translations.en;
    return dict[key] || translations.en[key] || key;
  };

  const isUrdu = language === 'ur';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t, isUrdu }}>
      <div className={isUrdu ? 'font-sans rtl' : 'font-sans ltr'}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
