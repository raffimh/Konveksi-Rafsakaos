'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguageSwitch } from '@/lib/hooks/use-i18n';
import { Globe, Languages } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface LanguageSwitcherProps {
  variant?: 'default' | 'dropdown' | 'toggle';
  showText?: boolean;
  className?: string;
}

export const LanguageSwitcher = ({ 
  variant = 'dropdown', 
  showText = false,
  className = '' 
}: LanguageSwitcherProps) => {
  const { language, switchToIndonesian, switchToEnglish, isIndonesian } = useLanguageSwitch();

  if (variant === 'toggle') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={isIndonesian ? switchToEnglish : switchToIndonesian}
        className={`flex items-center gap-2 ${className}`}
      >
        <Languages className="w-4 h-4" />
        {showText && (
          <span className="text-sm">
            {isIndonesian ? 'EN' : 'ID'}
          </span>
        )}
        <Badge variant="secondary" className="text-xs">
          {language.toUpperCase()}
        </Badge>
      </Button>
    );
  }

  if (variant === 'default') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          variant={isIndonesian ? 'default' : 'ghost'}
          size="sm"
          onClick={switchToIndonesian}
          className="text-xs px-3"
        >
          ID
        </Button>
        <Button
          variant={!isIndonesian ? 'default' : 'ghost'}
          size="sm"
          onClick={switchToEnglish}
          className="text-xs px-3"
        >
          EN
        </Button>
      </div>
    );
  }

  // Dropdown variant (default)
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={`flex items-center gap-2 ${className}`}>
          <Globe className="w-4 h-4" />
          {showText && (
            <span className="text-sm">
              {isIndonesian ? 'Bahasa Indonesia' : 'English'}
            </span>
          )}
          <Badge variant="secondary" className="text-xs">
            {language.toUpperCase()}
          </Badge>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem
          onClick={switchToIndonesian}
          className={`flex items-center justify-between ${
            isIndonesian ? 'bg-muted' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🇮🇩</span>
            <span>Bahasa Indonesia</span>
          </div>
          {isIndonesian && <Badge variant="default" className="text-xs">Default</Badge>}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={switchToEnglish}
          className={`flex items-center justify-between ${
            !isIndonesian ? 'bg-muted' : ''
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">🇺🇸</span>
            <span>English</span>
          </div>
          {!isIndonesian && <Badge variant="default" className="text-xs">Active</Badge>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Hook to get language-specific flag and display name
export const useLanguageInfo = () => {
  const { language } = useLanguageSwitch();
  
  const languageInfo = {
    id: {
      flag: '🇮🇩',
      name: 'Bahasa Indonesia',
      shortName: 'ID',
      isDefault: true,
    },
    en: {
      flag: '🇺🇸',
      name: 'English',
      shortName: 'EN',
      isDefault: false,
    },
  };
  
  return {
    current: languageInfo[language],
    all: languageInfo,
  };
};