'use client';

import React, { useEffect, useState } from 'react';
import { Sword, Sparkles, Zap } from 'lucide-react';

interface AttackEffectProps {
  isOpen: boolean;         // 演出を画面に表示するかどうかのフラグ
  totalAttack: number;     // 表示する合計攻撃力
  isPair: boolean;         // ペアボーナスが発生しているか
  onClose: () => void;     // 演出が終わって閉じる時の処理
}

export function AttackEffect({ isOpen, totalAttack, isPair, onClose }: AttackEffectProps) {
  // アニメーションの段階を管理する状態 (0: 登場, 1: 斬撃・フラッシュ, 2: 数字ドカン)
  const [phase, setPhase] = useState(0);

  // 演出が始まったら、自動で段階を進めて最後に自動で閉じるタイマー
  useEffect(() => {
    if (isOpen) {
      setPhase(0);
      
      // 0.3秒後に激しいフラッシュ（フェーズ1）
      const t1 = setTimeout(() => setPhase(1), 300);
      // 0.6秒後に攻撃力数値をドカンと表示（フェーズ2）
      const t2 = setTimeout(() => setPhase(2), 600);
      
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-200">
      
      {/* 背景の激しい集中線・エネルギーの渦エフェクト */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500 via-transparent to-transparent animate-pulse" />
      
      {/* ペア成立時に画面の左右に走る稲妻風のネオンライン */}
      {isPair && (
        <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_20px_rgba(251,191,36,1)] top-1/4 animate-pulse" />
      )}

      {/* メインの演出コンテナ */}
      <div className="relative flex flex-col items-center justify-center w-full max-w-sm text-center p-8 bg-slate-900/40 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* フェーズ 0 & 1: 斬撃の閃光エフェクト */}
        {phase < 2 && (
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/10 animate-ping">
            <Zap className="w-24 h-24 text-amber-400 rotate-12 scale-150 transition-all duration-300 transform" />
          </div>
        )}

        {/* フェーズ 2: 攻撃力数値がドカンと拡大しながら飛び出す（ここがメイン！） */}
        <div className={`flex flex-col items-center space-y-4 transition-all duration-300 transform ${phase === 2 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
          
          {/* ペアボーナス成立時の超豪華な見出しタグ */}
          {isPair && (
            <div className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 px-4 py-1 rounded-full text-xs font-black tracking-widest shadow-lg shadow-amber-500/20 animate-bounce">
              <Sparkles className="w-3.5 h-3.5" /> CRITICAL PAIR BONUS!
            </div>
          )}

          <div className="text-xs text-slate-400 tracking-widest font-black uppercase">一撃必殺の威力が炸裂！</div>
          
          {/* 巨大なダメージATK数値 */}
          <div className="relative flex items-center justify-center">
            <Sword className="absolute w-36 h-36 text-slate-800/40 -z-10 rotate-45 animate-pulse" />
            <span className={`text-6xl font-black font-display tracking-tighter ${isPair ? 'text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-amber-400 to-amber-600 drop-shadow-[0_0_20px_rgba(251,191,36,0.6)]' : 'text-transparent bg-clip-text bg-gradient-to-b from-emerald-300 to-teal-500'}`}>
              {totalAttack}
            </span>
            <span className="text-xl font-black text-slate-500 ml-2 self-end mb-2">ATK</span>
          </div>

          <p className="text-sm font-bold text-slate-200 mt-2 bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-800">
            {totalAttack} の威力で一撃を放ちました！
          </p>

          {/* 演出を閉じる完了ボタン */}
          <button
            onClick={onClose}
            className="mt-6 px-6 py-2.5 bg-slate-100 text-slate-950 font-black text-xs tracking-wider rounded-xl hover:bg-white hover:scale-105 active:scale-95 shadow-md shadow-white/10 transition-all cursor-pointer"
          >
            次へ進む
          </button>
        </div>

      </div>
    </div>
  );
}
