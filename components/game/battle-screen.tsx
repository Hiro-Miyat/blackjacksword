'use client';

import React, { useState, useEffect } from 'react';
import { Home, Sword, Sparkles, RefreshCw, ChevronLeft, Zap, Menu, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';
import { cardHardValue, rankLabel, SUIT_SYMBOL, SUIT_ELEMENT, ELEMENT_COLOR, ELEMENT_LABEL } from '@/lib/game/cards';
import type { Card } from '@/lib/game/types';

// 音源ファイルの読み込み
import { playCardSound, playBGM, stopBGM } from './game-audio';

export type GameLanguage = 'ja' | 'en' | 'zh' | 'pt' | 'es' | 'ru' | 'vi' | 'fr' | 'fa';

const menuTranslations: Record<GameLanguage, { title: string; pauseMenu: string; backToTitle: string; resumeGame: string; challenge21: string; endlessBoss: string }> = {
  ja: { title: 'BLACK JACK SWORD', pauseMenu: 'ポーズメニュー', backToTitle: 'タイトル画面に戻る', resumeGame: 'ゲームを再開する', challenge21: '21チャレンジ', endlessBoss: '属性ボス耐久戦' },
  en: { title: 'BLACK JACK SWORD', pauseMenu: 'Pause Menu', backToTitle: 'Back to Title', resumeGame: 'Resume Game', challenge21: '21 Challenge', endlessBoss: 'Element Boss Endless' },
  zh: { title: 'BLACK JACK SWORD', pauseMenu: '暂停菜单', backToTitle: '返回标题画面', resumeGame: '恢复游戏', challenge21: '21挑战', endlessBoss: '属性Boss耐久战' },
  pt: { title: 'BLACK JACK SWORD', pauseMenu: 'Menu de Pausa', backToTitle: 'Voltar ao Título', resumeGame: 'Retomar Jogo', challenge21: 'Desafio 21', endlessBoss: 'Chefe Elemental' },
  es: { title: 'BLACK JACK SWORD', pauseMenu: 'Menú de Pausa', backToTitle: 'Volver al Título', resumeGame: 'Reanudar Juego', challenge21: 'Desafío 21', endlessBoss: 'Jefe Elemental' },
  ru: { title: 'BLACK JACK SWORD', pauseMenu: 'Меню паузы', backToTitle: 'Вернуться в меню', resumeGame: 'Продолжить игру', challenge21: 'Вызов 21', endlessBoss: 'Битва с боссом' },
  vi: { title: 'BLACK JACK SWORD', pauseMenu: 'Menu Tạm Dừng', backToTitle: 'Về Màn Hình Chính', resumeGame: 'Tiếp Tục Trò Chơi', challenge21: 'Thử thách 21', endlessBoss: 'Đấu Trùm Thuộc Tính' },
  fr: { title: 'BLACK JACK SWORD', pauseMenu: 'Menu Pause', backToTitle: 'Retour au Titre', resumeGame: 'Reprendre le Jeu', challenge21: 'Défi 21', endlessBoss: 'Boss Élémentaire' },
  fa: { title: 'BLACK JACK SWORD', pauseMenu: 'منوی توقف', backToTitle: 'بازگشت به منو', resumeGame: 'ادامه بازی', challenge21: 'چالش ۲۱', endlessBoss: 'مبارزه با باس' }
};
const Button = ({ children, className, variant, onClick, disabled }: any) => {
  const baseStyle = "w-full py-4 font-bold text-sm rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer select-none ";
  const variantStyle = disabled
    ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700"
    : variant === 'destructive' 
    ? "bg-rose-600 hover:bg-rose-500 text-white border border-rose-500" 
    : variant === 'outline' 
    ? "border border-slate-600 text-slate-300 hover:bg-slate-800" 
    : "bg-amber-500 hover:bg-amber-400 text-slate-900 shadow-md shadow-amber-500/10";
  return (
    <button onClick={onClick} disabled={disabled} className={baseStyle + variantStyle + " " + className}>
      {children}
    </button>
  );
};

export function BattleScreen() {
  const [pause, setPause] = useState(false);
  const [muted, setMuted] = useState(false);
  const [screenState, setScreenState] = useState<'title' | 'battle'>('title');
  const [isAttackOpenValue, setIsAttackOpen] = useState(false);
  const [phase, setPhase] = useState(0);


  // 手札5枚の初期データ。3枚同じ数字の4を配置してあります
  const [hand, setHand] = useState<Card[]>([
    { id: 'card-1', suit: 'hearts', rank: 4 },
    { id: 'card-2', suit: 'spades', rank: 4 },
    { id: 'card-3', suit: 'diamonds', rank: 4 },
    { id: 'card-4', suit: 'clubs', rank: 7 },
    { id: 'card-5', suit: 'hearts', rank: 11 },
  ]);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const t = menuTranslations['ja']; // 日本語を基準に翻訳

  // BGM切り替えセンサー
  useEffect(() => {
    if (screenState === 'title') playBGM('title');
    else if (screenState === 'battle') playBGM('battle');
    return () => stopBGM();
  }, [screenState]);

  const selectedCards = hand.filter(card => selectedIds.includes(card.id));
  
  let baseScore = 0;
  let bonusScore = 0;
  
  const allSameRank = selectedCards.length > 1 && selectedCards.every(card => card.rank === selectedCards[0].rank);
  
  const isPair = selectedCards.length === 2 && allSameRank;
  const isTriple = selectedCards.length === 3 && allSameRank;

  if (selectedCards.length > 0) {
    baseScore = selectedCards.reduce((sum, card) => sum + cardHardValue(card.rank), 0);
  }

  if (isPair) bonusScore = 10;
  if (isTriple) bonusScore = 20;

  const totalAttack = baseScore + bonusScore;

  useEffect(() => {
    if (isAttackOpenValue) {
      setPhase(0);
      const t1 = setTimeout(() => setPhase(1), 300);
      const t2 = setTimeout(() => setPhase(2), 600);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [isAttackOpenValue]);

  const handleCardClick = (id: string) => {
    playCardSound('select');
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(sid => sid !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleShuffle = () => {
    setSelectedIds([]);
    const suits: Card['suit'][] = ['hearts', 'spades', 'diamonds', 'clubs'];
    setHand(Array.from({ length: 5 }, (_, i) => ({
      id: `rand-${i}-${Date.now()}`,
      suit: suits[Math.floor(Math.random() * suits.length)],
      rank: Math.floor(Math.random() * 13) + 1,
    })));
  };
  return (
    <div className="relative flex flex-1 h-full w-full flex-col overflow-hidden bg-[#0a101d] p-6 font-sans text-white select-none">
      
      {/* 画面の一番上：左右のヘッダー（左上のタイトルは消去） */}
      <div className="flex justify-between items-center w-full max-w-4xl mx-auto mb-4">
        {/* 左端：メニューアイコン と 7 left */}
        <div className="flex items-center gap-2">
          <button onClick={() => setPause(true)} className="p-2 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer">
            <Menu className="size-4" />
          </button>
          <span className="text-[10px] bg-slate-900/80 border border-slate-800/80 px-2.5 py-1 rounded-lg text-slate-400 font-mono tracking-wider">
            7 left
          </span>
        </div>
        {/* 右端：Rulesボタン と スピーカーボタン */}
        <div className="flex items-center gap-2">
          <button className="text-[11px] font-bold bg-slate-900/60 border border-slate-800/80 px-3 py-1 rounded-lg text-slate-300 hover:bg-slate-800 transition-all cursor-pointer">
            Rules
          </button>
          <button onClick={() => setMuted(!muted)} className="p-2 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-300 hover:bg-slate-800 transition-all cursor-pointer">
            {muted ? <VolumeX className="size-4 text-rose-400" /> : <Volume2 className="size-4 text-slate-400" />}
          </button>
        </div>
      </div>

      {!pause && (
        <>
          {/* ① タイトルメニュー画面 */}
          {screenState === 'title' && (
            <div className="flex flex-col items-center justify-center my-auto gap-4 w-full max-w-sm mx-auto">
              <Button variant="default" onClick={() => setScreenState('battle')} className="shadow-lg shadow-amber-500/10">▶ 21チャレンジ</Button>
              <Button variant="outline" onClick={() => setScreenState('battle')}>🛡️ 属性ボス耐久戦</Button>
            </div>
          )}

          {/* ② 実戦カードバトル画面 */}
          {screenState === 'battle' && (
            <div className="flex flex-col flex-1 items-center justify-between w-full max-w-xl mx-auto my-auto space-y-4">
              
              {/* コントロールヘッダー */}
              <div className="w-full flex justify-between items-center text-xs">
                <button onClick={() => { setScreenState('title'); setSelectedIds([]); }} className="text-slate-500 hover:text-slate-300"> ◀ タイトルへ戻る</button>
                <button onClick={handleShuffle} className="text-amber-500 font-bold bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg"> 🔄 カードを引き直す</button>
              </div>

              {/* 画面中央：敵のボス情報エリア（画像通りのGOBLIN BANDIT構成） */}
              <div className="flex flex-col items-center justify-center w-full">
                {/* 敵の属性と名前 */}
                <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold tracking-widest mb-1">
                  <span className="bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-[9px] uppercase opacity-70">NORMAL</span>
                  <span>GOBLIN BANDIT</span>
                </div>

                {/* 画像通りの大きく浮かび上がる青い合計値数字「17」を完全再現！ */}
                <div className="text-5xl font-black font-display text-blue-400 tracking-tighter drop-shadow-[0_0_15px_rgba(96,165,250,0.3)] mb-2">
                  17
                </div>

                {/* ゴブリンのモンスターグラフィックカード（イラストの枠） */}
                <div className="relative w-44 aspect-[4/5] bg-gradient-to-b from-slate-900 to-slate-950 rounded-xl border border-slate-800 shadow-2xl flex flex-col items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent pointer-events-none" />
                  <span className="text-[10px] tracking-widest text-red-500 font-black uppercase drop-shadow-md mb-2">DAMAGE!</span>
                  <div className="w-24 h-24 border border-dashed border-slate-800 rounded-lg flex items-center justify-center bg-slate-950/40">
                    <span className="text-[10px] text-slate-600 font-bold">GOBLIN PIC</span>
                  </div>
                </div>
              </div>

              {/* リアルタイム計算式プレビューボード */}
              <div className="w-full bg-slate-900/40 rounded-xl border border-slate-800/60 p-3.5 flex flex-col items-center justify-center min-h-[110px] relative overflow-hidden shadow-inner">
                {selectedCards.length === 0 ? <p className="text-slate-500 text-xs tracking-wide">手札からカードを選択してください</p> : (
                  <div className="w-full flex flex-col items-center space-y-2 z-10">
                    <div className="flex items-center space-x-2 text-sm text-slate-300 bg-slate-950/80 px-3 py-1 rounded-full border border-slate-855">
                      {selectedCards.map((card, idx) => (
                        <React.Fragment key={card.id}>
                          <span className="font-display font-black text-slate-100">{rankLabel(card.rank)}<span className="text-[10px] font-normal text-slate-500 ml-0.5">({cardHardValue(card.rank)})</span></span>
                          {idx < selectedCards.length - 1 && <span className="text-slate-600 font-bold">+</span>}
                        </React.Fragment>
                      ))}
                      {isPair && <span className="text-amber-400 font-bold ml-1 text-[11px] animate-bounce"> ✨ ペア +10</span>}
                      {isTriple && <span className="text-yellow-400 font-black ml-1 text-[11px] animate-bounce"> 🔥 トリプル +20</span>}
                    </div>
                    <div className="flex flex-col items-center">
                      <div className={`flex items-center gap-1.5 text-2xl font-black ${(isPair || isTriple) ? 'text-amber-400' : 'text-emerald-400'}`}>
                        <Sword className="size-5" /><span>{totalAttack} ATK</span>
                      </div>
                    </div>
                  </div>
                )}
                {(isPair || isTriple) && <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-amber-500/10 to-amber-500/5 animate-pulse pointer-events-none" />}
              </div>
              {/* 中央下部：手札のすぐ上に浮かぶ「HPバー」と「4 / 21」 */}
              <div className="w-full max-w-md flex flex-col space-y-1 px-1">
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold tracking-wider">
                  <span>HP</span>
                  <span className="font-mono">4 / 21</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 border border-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-red-600 to-rose-500 transition-all duration-300" style={{ width: `${(4 / 21) * 100}%` }} />
                </div>
              </div>

              {/* 一番下：5枚の横並び手札 ＆ 右端の裏向き「DECK 32」山札 */}
              <div className="w-full flex flex-col items-center space-y-2">
                <div className="flex items-end justify-center gap-1.5 w-full">
                  <div className="grid grid-cols-5 gap-1.5 max-w-md w-full">
                    {hand.map((card) => {
                      const sel = selectedIds.includes(card.id);
                      const pairEff = (isPair || isTriple) && sel;
                      const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
                      const el = SUIT_ELEMENT[card.suit];
                      return (
                        <button 
                          key={card.id} 
                          onClick={() => handleCardClick(card.id)} 
                          className={cn(
                            'relative flex aspect-[5/7] w-full select-none flex-col justify-between rounded-lg border bg-white p-1 text-neutral-900 shadow-md transition-all duration-150',
                            sel ? '-translate-y-3 border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-300 hover:-translate-y-1',
                            pairEff && 'border-amber-400 ring-4 ring-amber-400/30 bg-gradient-to-b from-white to-amber-50'
                          )}
                        >
                          {sel && (
                            <div className="absolute -top-2 -right-2 bg-amber-500 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow border border-white/20">
                              {selectedIds.indexOf(card.id) + 1}
                            </div>
                          )}
                          <div className="flex items-center justify-between leading-none text-[10px] font-black" style={{ color: isRed ? '#d13b3b' : '#1b1b2b' }}>
                            <span>{rankLabel(card.rank)}</span><span>{SUIT_SYMBOL[card.suit]}</span>
                          </div>
                          <span className="self-center text-sm leading-none" style={{ color: isRed ? '#d13b3b' : '#1b1b2b' }}>{SUIT_SYMBOL[card.suit]}</span>
                          <div className="text-[7px] font-bold text-white text-center rounded py-0.5" style={{ backgroundColor: ELEMENT_COLOR[el] }}>{ELEMENT_LABEL[el]}</div>
                        </button>
                      );
                    })}
                  </div>

                  {/* 右端の裏向きの山札（DECK 32） */}
                  <div className="w-[18%] aspect-[5/7] bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-lg flex flex-col justify-between p-1 shadow-inner opacity-80">
                    <div className="w-full h-full border border-dashed border-slate-800 rounded-md flex flex-col items-center justify-center p-1 text-center bg-slate-950/20">
                      <div className="text-[6px] text-slate-600 font-bold uppercase tracking-tighter">DECK</div>
                      <div className="text-[9px] text-slate-400 font-black font-mono">32</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 最下部：暗く洗練された「決定バー」 */}
              <button 
                disabled={selectedIds.length < 2}
                onClick={() => {
                  setIsAttackOpen(true);
                  playCardSound('attack');
                  if (isPair || isTriple) playCardSound('pair');
                }}
                className={cn(
                  "w-full max-w-xl py-3.5 bg-[#172230] border border-[#243447] text-[#cbd5e1] font-black text-sm tracking-widest rounded-xl transition-all uppercase select-none",
                  selectedIds.length >= 2 ? "hover:bg-[#1f3044] hover:text-white cursor-pointer active:scale-[0.99]" : "opacity-60 cursor-not-allowed"
                )}
              >
                {selectedIds.length >= 2 ? 'ATTACK WITH SELECTED CARDS' : 'SELECT 2 CARDS'}
              </button>

            </div>
          )}
        </>
      )}

      {/* 攻撃演出 */}
      {isAttackOpenValue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative flex flex-col items-center justify-center w-full max-w-sm text-center p-8 bg-slate-900/40 border border-slate-800 rounded-3xl shadow-2xl">
            {phase < 2 && <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/10 animate-ping"><Zap className="w-20 h-20 text-amber-400" /></div>}
            <div className={cn("flex flex-col items-center space-y-4 transition-all duration-300", phase === 2 ? 'scale-100 opacity-100' : 'scale-50 opacity-0')}>
              {isPair && <div className="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 px-4 py-1 rounded-full text-xs font-black animate-bounce">✨ PAIR BONUS!</div>}
              {isTriple && <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 text-white px-4 py-1 rounded-full text-xs font-black animate-bounce shadow-lg">🔥 CRITICAL TRIPLE IMPACT!</div>}
              <div className="text-6xl font-black text-amber-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.5)]">{totalAttack}<span className="text-lg text-slate-500 ml-1">ATK</span></div>
              <p className="text-sm font-bold text-slate-200 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">{totalAttack} の威力で一撃を放ちました！</p>
              <button onClick={() => { setIsAttackOpen(false); setSelectedIds([]); }} className="mt-4 px-6 py-2 bg-slate-100 text-slate-950 font-black text-xs rounded-xl">次へ進む</button>
            </div>
          </div>
        </div>
      )}

      {/* ポーズメニュー */}
      {pause && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="flex flex-col items-center w-full max-w-sm bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-2xl gap-3">
            <h2 className="text-xl font-bold text-slate-100 tracking-wider">⚙️ ポーズメニュー</h2>
            <Button variant="destructive" onClick={() => { setPause(false); setScreenState('title'); setSelectedIds([]); }}><Home className="size-4" /> タイトル画面に戻る</Button>
            <Button variant="outline" onClick={() => setPause(false)}>ゲームを再開する</Button>
          </div>
        </div>
      )}

    </div>
  );
}
