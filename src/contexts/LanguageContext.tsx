import { createContext, useContext, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

type Language = 'ru' | 'en';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLanguage = i18n.language === 'ru' ? 'en' : 'ru';
    i18n.changeLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language: i18n.language as Language, toggleLanguage }}>
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