'use client';

import React from 'react';

// 9言語の定義（日本語、英語、中国語、ポルトガル語、スペイン語、ロシア語、ベトナム語、フランス語、ペルシャ語）
export type GameLanguage = 'ja' | 'en' | 'zh' | 'pt' | 'es' | 'ru' | 'vi' | 'fr' | 'fa';

interface LanguageSelectorProps {
  currentLanguage: GameLanguage;
  onLanguageChange: (lang: GameLanguage) => void;
}

export default function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  const languages: { code: GameLanguage; name: string }[] = [
    { code: 'ja', name: '日本語' },
    { code: 'en', name: 'English' },
    { code: 'zh', name: '简体中文' },
    { code: 'pt', name: 'Português' },
    { code: 'es', name: 'Español' },
    { code: 'ru', name: 'Русский' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'fr', name: 'Français' },
    { code: 'fa', name: 'فارسی' }
  ];

  return (
    <div className="mt-4 pt-4 border-t border-slate-700 w-full">
      <p className="text-xs text-slate-400 mb-2 text-center">Language / 言語選択</p>
      <div className="grid grid-cols-3 gap-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => onLanguageChange(lang.code)}
            className={`py-1.5 px-1 text-xs rounded transition-colors text-center truncate ${
              currentLanguage === lang.code
                ? 'bg-blue-600 text-white font-medium border border-blue-400'
                : 'bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700'
            }`}
          >
            {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
}
