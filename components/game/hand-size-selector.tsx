'use client';

import React from 'react';
import type { GameLanguage } from './battle-screen';

interface HandSizeSelectorProps {
  currentSize: number;
  onChangeSize: (size: number) => void;
  language: GameLanguage;
}

const translations: Record<GameLanguage, { label: string; desc: string }> = {
  ja: { label: '初期手札の枚数', desc: '枚数が多いほど21を狙いやすくなります' },
  en: { label: 'Starting Hand Size', desc: 'More cards make it easier to reach 21' },
  zh: { label: '初始手牌数量', desc: '手牌越多越容易凑到21' },
  pt: { label: 'Tamanho da Mão Inicial', desc: 'Mais cartas facilitam chegar a 21' },
  es: { label: 'Tamaño de Mano Inicial', desc: 'Más cartas facilitan llegar a 21' },
  ru: { label: 'Размер стартовой руки', desc: 'Больше карт облегчают достижение 21' },
  vi: { label: 'Số lượng bài trên tay', desc: 'Nhiều bài hơn giúp dễ đạt 21 hơn' },
  fr: { label: 'Taille de la Main Initiale', desc: 'Plus de cartes facilitent l\'accès à 21' },
  fa: { label: 'تعداد کارت‌های دست', desc: 'کارت‌های بیشتر رسیدن به ۲1 را آسان‌تر می‌کند' }
};

export function HandSizeSelector({ currentSize, onChangeSize, language }: HandSizeSelectorProps) {
  const t = translations[language] || translations['ja'];
  
  // バグが絶対に起きない書き方に修正しました
  const sizes =; 

  return (
    <div className="mt-4 pt-4 border-t border-slate-800 w-full text-left">
      <p className="text-xs font-bold text-slate-300 mb-1">{t.label}</p>
      <p className="text-[10px] text-slate-500 mb-3">{t.desc}</p>
      
      <div className="grid grid-cols-3 gap-2">
        {sizes.map((size) => (
          <button
            key={size}
            type="button"
            onClick={() => onChangeSize(size)}
            className={`py-2 text-xs font-black rounded-lg transition-all text-center cursor-pointer ${
              currentSize === size
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-black'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
            }`}
          >
            {size} {language === 'ja' ? '枚' : 'Cards'}
          </button>
        ))}
      </div>
    </div>
  );
}
