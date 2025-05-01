import { createContext, useState, useContext, ReactNode } from 'react';
import { SupportedLanguage, translations } from './translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (language: SupportedLanguage) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  // Get saved language from localStorage or default to 'en'
  const [language, setLanguage] = useState<SupportedLanguage>(() => {
    const savedLanguage = localStorage.getItem('language') as SupportedLanguage;
    return savedLanguage && ['en', 'es'].includes(savedLanguage) ? savedLanguage : 'en';
  });

  // Save language to localStorage whenever it changes
  const handleSetLanguage = (newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('language', newLanguage);
  };

  // Translation function
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    
    return translations[key][language] || translations[key].en;
  };

  const value = {
    language,
    setLanguage: handleSetLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 