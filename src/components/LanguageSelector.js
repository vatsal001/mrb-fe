import React from 'react';
import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', label: 'EN', fullLabel: 'English' },
  { code: 'hi', label: 'अ', fullLabel: 'हिंदी' },
  { code: 'gu', label: 'ગ', fullLabel: 'ગુજરાતી' },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language?.slice(0, 2) || 'en';

  return (
    <div className="flex items-center gap-1" data-testid="language-selector">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => i18n.changeLanguage(lang.code)}
          title={lang.fullLabel}
          data-testid={`lang-${lang.code}`}
          className={`w-8 h-8 text-xs font-bold rounded-full transition-all ${
            currentLang === lang.code
              ? 'bg-primary text-white shadow-md scale-110'
              : 'text-stone-600 hover:bg-stone-200 hover:text-primary'
          }`}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;
