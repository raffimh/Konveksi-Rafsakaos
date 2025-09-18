'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language, Translations } from '@/lib/i18n/translations';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isLoading: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('id'); // Indonesian as default
  const [isLoading, setIsLoading] = useState(true);

  // Load language from localStorage on mount
  useEffect(() => {
    try {
      const savedLanguage = localStorage.getItem('language') as Language;
      if (savedLanguage && (savedLanguage === 'id' || savedLanguage === 'en')) {
        setLanguageState(savedLanguage);
      }
    } catch (error) {
      console.warn('Failed to load language from localStorage:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save language to localStorage when it changes
  const setLanguage = (lang: Language) => {
    try {
      localStorage.setItem('language', lang);
      setLanguageState(lang);
    } catch (error) {
      console.warn('Failed to save language to localStorage:', error);
      setLanguageState(lang);
    }
  };

  // Update document language attribute
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = language;
    }
  }, [language]);

  const value: I18nContextType = {
    language,
    setLanguage,
    t: translations[language],
    isLoading,
  };

  return React.createElement(I18nContext.Provider, { value }, children);
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

// Utility hook for getting specific translation keys
export const useTranslation = () => {
  const { t, language, setLanguage } = useI18n();
  
  return {
    t,
    language,
    setLanguage,
    // Helper function to get nested translations with fallback
    getTranslation: (key: string, fallback?: string): string => {
      try {
        const keys = key.split('.');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let value: any = t;
        
        for (const k of keys) {
          if (value && typeof value === 'object' && k in value) {
            value = value[k];
          } else {
            return fallback || key;
          }
        }
        
        return typeof value === 'string' ? value : fallback || key;
      } catch {
        return fallback || key;
      }
    },
    // Helper function to interpolate values in translations
    interpolate: (template: string, values: Record<string, string | number>): string => {
      return template.replace(/\{(\w+)\}/g, (match, key) => {
        return values[key]?.toString() || match;
      });
    },
  };
};

// Hook for language switching with persisted state
export const useLanguageSwitch = () => {
  const { language, setLanguage } = useI18n();
  
  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id');
  };
  
  const switchToIndonesian = () => setLanguage('id');
  const switchToEnglish = () => setLanguage('en');
  
  const isIndonesian = language === 'id';
  const isEnglish = language === 'en';
  
  return {
    language,
    setLanguage,
    toggleLanguage,
    switchToIndonesian,
    switchToEnglish,
    isIndonesian,
    isEnglish,
  };
};

// Hook for formatting text with language-specific formatting
export const useFormatting = () => {
  const { language } = useI18n();
  
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat(language === 'id' ? 'id-ID' : 'en-US').format(num);
  };
  
  const formatCurrency = (amount: number): string => {
    if (language === 'id') {
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(amount);
    } else {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(amount);
    }
  };
  
  const formatDate = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dateObj);
  };
  
  const formatDateTime = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return new Intl.DateTimeFormat(language === 'id' ? 'id-ID' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(dateObj);
  };
  
  const formatRelativeTime = (date: Date | string): string => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
    
    const rtf = new Intl.RelativeTimeFormat(language === 'id' ? 'id-ID' : 'en-US', {
      numeric: 'auto',
    });
    
    if (diffInSeconds < 60) {
      return rtf.format(-diffInSeconds, 'second');
    } else if (diffInSeconds < 3600) {
      return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
    } else if (diffInSeconds < 86400) {
      return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
    } else {
      return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
    }
  };
  
  return {
    formatNumber,
    formatCurrency,
    formatDate,
    formatDateTime,
    formatRelativeTime,
  };
};