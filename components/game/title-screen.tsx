'use client'

import { useState } from 'react'
import { BookOpen, Play, RotateCcw, Volume2, VolumeX, Settings, X } from 'lucide-react'
import type { GameMode } from '@/lib/game/types'
import { Button } from '@/components/ui/button'
import { HelpDialog } from './help-dialog'

// 9言語の定義
type Language = "ja" | "en" | "zh" | "pt" | "es" | "ru" | "vi" | "fr" | "fa";

// タイトル画面の各パーツで切り替えるための翻訳データ
const titleLocalTranslations: Record<Language, Record<string, string>> = {
  ja: { title: "BLACK JACK SWORD", subtitle: "手札7枚から2枚を選び、最強の21を作れ", challenge21: "21チャレンジ", challenge21Sub: "5連戦＋ボス / 属性なし", endureBoss: "属性ボス耐久戦", endureBossSub: "HP200 / 役スキル有効", howToPlay: "遊び方", continue: "つづきから", settings: "ゲーム設定" },
  en: { title: "BLACK JACK SWORD", subtitle: "Choose 2 cards from 7 to create the ultimate 21.", challenge21: "21 Challenge", challenge21Sub: "5 Battles + Boss / No Elements", endureBoss: "Elemental Boss Raid", endureBossSub: "HP 200 / Hand Skills Enabled", howToPlay: "How to Play", continue: "Continue", settings: "Settings" },
  zh: { title: "BLACK JACK SWORD", subtitle: "从7张手牌中选择2张，凑出最强的21点", challenge21: "21 Challenge", challenge21Sub: "5连战＋波士 / 无属性", endureBoss: "属性波士耐久战", endureBossSub: "HP 200 / 组合技能有效", howToPlay: "怎么玩", continue: "继续游戏", settings: "游戏设置" },
  pt: { title: "BLACK JACK SWORD", subtitle: "Escolha 2 cartas de 7 para criar o 21 supremo.", challenge21: "Desafio 21", challenge21Sub: "5 Batalhas + Chefe / Sem Elementos", endureBoss: "Chefe Elemental", endureBossSub: "HP 200 / Habilidades Ativas", howToPlay: "Como Jogar", continue: "Continuar", settings: "Configurações" },
  es: { title: "BLACK JACK SWORD", subtitle: "Elige 2 cartas de 7 para crear el 21 definitivo.", challenge21: "Desafío 21", challenge21Sub: "5 Batallas + Jefe / Sin Elementos", endureBoss: "Jefe Elemental Raid", endureBossSub: "HP 200 / Habilidades Activadas", howToPlay: "Cómo Jugar", continue: "Continuar", settings: "Ajustes" },
  ru: { title: "BLACK JACK SWORD", subtitle: "Выберите 2 карты из 7, чтобы собрать идеальные 21.", challenge21: "Испытание 21", challenge21Sub: "5 Битв + Босс / Без Стихий", endureBoss: "Рейд на Стихийного Босса", endureBossSub: "HP 200 / Навыки Включены", howToPlay: "Как Играть", continue: "Продолжить", settings: "Настройки" },
  vi: { title: "BLACK JACK SWORD", subtitle: "Chọn 2 trong 7 lá bài để tạo nên con số 21 quyền năng.", challenge21: "Thử thách 21", challenge21Sub: "5 Trận đấu + Trùm / Không Hệ", endureBoss: "Trùm Nguyên Tố", endureBossSub: "HP 200 / Kích hoạt kỹ năng", howToPlay: "Cách chơi", continue: "Tiếp tục", settings: "Cài đặt" },
  fr: { title: "BLACK JACK SWORD", subtitle: "Choisissez 2 cartes parmi 7 pour créer le 21 ultime.", challenge21: "Défi 21", challenge21Sub: "5 Combats + Boss / Sans Éléments", endureBoss: "Boss Élémentaire Raid", endureBossSub: "HP 200 / Compétences Actives", howToPlay: "Comment Jouer", continue: "Continuer", settings: "Options" },
  fa: { title: "BLACK JACK SWORD", subtitle: "۲ کارت از ۷ کارت را برای ساخت بالاترین ۲۱ انتخاب کنید。", challenge21: "چالش ۲۱", challenge21Sub: "۵ نبرد + غول آخر / بدون عنصر", endureBoss: "غول آخر عنصری", endureBossSub: "خون ۲۰۰ / مهارت‌ها فعال", howToPlay: "راهنمای بازی", continue: "ادامه بازی", settings: "تنظیمات" }
};

interface Props {
  hasSave: boolean
  muted: boolean
  lang: any 
  onSelectMode: (m: GameMode) => void
  onContinue: () => void
  onToggleMute: () => void
  onLanguageChange?: (lang: Language) => void // 親と連動させるための関数
}

export function TitleScreen({
  hasSave,
  muted,
  lang,
  onSelectMode,
  onContinue,
  onToggleMute,
  onLanguageChange,
}: Props) {
  const [help, setHelp] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const currentLang = (titleLocalTranslations[lang as Language] ? lang : "ja") as Language;
  const t = titleLocalTranslations[currentLang];

  const languages: { code: Language; name: string }[] = [
    { code: 'ja', name: '日本語' }, { code: 'en', name: 'English' }, { code: 'zh', name: '简体中文' },
    { code: 'pt', name: 'Português' }, { code: 'es', name: 'Español' }, { code: 'ru', name: 'Русский' },
    { code: 'vi', name: 'Tiếng Việt' }, { code: 'fr', name: 'Français' }, { code: 'fa', name: 'فارسی' }
  ];

  return (
    <main className="relative flex flex-1 w-full flex-col items-center justify-between overflow-hidden min-h-[450px] py-4 select-none">
      <div className="absolute inset-0 bg-slate-950 z-0" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-900/60 to-slate-950 z-0" />

      {/* 右上のコントロールエリア（スピーカーとゲーム設定ボタン） */}
      <div className="absolute right-3 top-3 z-10 flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setShowSettings(true)}
          className="bg-slate-800/85 border border-slate-700 text-slate-300 text-xs px-2.5 py-1.5 h-auto font-medium rounded-lg backdrop-blur flex items-center gap-1 hover:bg-slate-700"
        >
          <Settings className="size-3.5" />
          {t.settings}
        </Button>

        <button
          type="button"
          onClick={onToggleMute}
          className="grid size-8 place-items-center rounded-full border border-slate-700 bg-slate-800/70 text-slate-200 backdrop-blur hover:bg-slate-700"
        >
          {muted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </button>
      </div>

      <header className="relative z-10 mt-10 flex flex-col items-center px-4 text-center">
        <p className="font-display text-[10px] tracking-[0.3em] text-amber-400 uppercase font-bold">
          BLACKJACK × POKER
        </p>
        <h1 className="mt-2 font-display text-3xl font-black leading-tight text-white tracking-wide">
          {t.title}
        </h1>
        <p className="mt-2 max-w-xs text-xs text-slate-400 leading-relaxed">
          {t.subtitle}
        </p>
      </header>

      <div className="relative z-10 my-6 flex w-full max-w-sm flex-col gap-2.5 px-4">
        {hasSave ? (
          <Button
            size="lg"
            onClick={onContinue}
            className="h-14 w-full justify-start gap-3 bg-slate-800 border border-slate-700 font-display text-sm text-slate-200 hover:bg-slate-700"
          >
            <RotateCcw className="size-4 text-amber-400" />
            {t.continue}
          </Button>
        ) : null}

        <Button
          size="lg"
          onClick={() => onSelectMode('design' as any)} // 既存の型定義に配慮
          className="h-14 w-full justify-start gap-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-display text-sm font-bold shadow-lg"
        >
          <Play className="size-4 fill-current" />
          <span className="flex flex-col items-start leading-tight text-left">
            {t.challenge21}
            <span className="text-[10px] font-normal opacity-70 mt-0.5">{t.challenge21Sub}</span>
          </span>
        </Button>

        <Button
          size="lg"
          onClick={() => onSelectMode('endure' as any)} // 既存の型定義に配慮
          className="h-14 w-full justify-start gap-3 bg-slate-800 border border-slate-700 font-display text-sm text-slate-200 hover:bg-slate-700"
        >
          <Play className="size-4 text-slate-400" />
          <span className="flex flex-col items-start leading-tight text-left">
            {t.endureBoss}
            <span className="text-[10px] font-normal opacity-60 mt-0.5">{t.endureBossSub}</span>
          </span>
        </Button>

        <Button
          size="lg"
          variant="outline"
          onClick={() => setHelp(true)}
          className="h-11 w-full justify-start gap-3 border-slate-700 bg-slate-800/40 text-slate-300 text-xs font-medium backdrop-blur hover:bg-slate-800"
        >
          <BookOpen className="size-4 text-slate-500" />
          {t.howToPlay}
        </Button>
      </div>

               {/* 遊び方ダイアログに現在の言語を渡すようにします */}
      <HelpDialog open={help} onOpenChange={setHelp} onClose={() => setHelp(false)} lang={currentLang} />



      {/* 9言語選択を完全に内蔵したゲーム設定モーダル */}
      {showSettings && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xs p-5 shadow-2xl text-center text-slate-200">
            <h3 className="text-sm font-bold text-slate-300 mb-1">{t.settings}</h3>
            <p className="text-[10px] text-slate-500 mb-4">Language / 言語選択</p>
            
            {/* 9言語切り替えグリッド */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {languages.map((languageItem) => (
                <button
                  key={languageItem.code}
                  type="button"
                  onClick={() => {
                    if (typeof onLanguageChange === 'function') {
                      onLanguageChange(languageItem.code);
                    }
                  }}
                  className={`py-2.5 px-1 text-xs rounded-xl transition-all text-center truncate cursor-pointer font-medium ${
                    currentLang === languageItem.code
                      ? 'bg-blue-600 text-white shadow-lg border border-blue-400 font-bold scale-[1.02]'
                      : 'bg-slate-800 text-slate-400 border border-slate-800 hover:bg-slate-700 hover:text-slate-200'
                  }`}
                >
                  {languageItem.name}
                </button>
              ))}
            </div>

            <Button
              size="sm"
              onClick={() => setShowSettings(false)}
              className="w-full bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 text-xs py-2 rounded-xl"
            >
              {currentLang === 'ja' ? '閉じる' : 'Close'}
            </Button>
          </div>
        </div>
      )}

      {/* フッターコピーライト */}
      <div className="relative z-10 text-center text-[10px] text-slate-600 mt-auto pt-4">
        © 2026 2D Card Battle Game Project. All Rights Reserved.
        </div>
    </main>
  );
}
