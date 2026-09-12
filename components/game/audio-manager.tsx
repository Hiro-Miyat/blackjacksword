"use client";

import { useEffect, useRef } from "react";

interface AudioManagerProps {
  muted: boolean;
}

export function AudioManager({ muted }: AudioManagerProps) {
  // Web Audio APIのシステムを保持するRef
  const audioCtxRef = useRef<AudioContext | null>(null);
  // ループ（繰り返し）のタイマーを保持するRef
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // 画面消去時のクリーンアップ処理
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    // ミュートON、またはまだミュート解除ボタンが押されていない場合
    if (muted) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // ミュートOFF（音を出す）になった時の処理
    if (!muted) {
      // 1. ユーザーが画面操作した後にAudioContextを安全に初期化
      if (!audioCtxRef.current && typeof window !== "undefined") {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioCtxRef.current = new AudioContextClass();
        }
      }

      // すでに動いているタイマーがあれば一旦クリア
      if (intervalRef.current) clearInterval(intervalRef.current);


    }
  }, [muted]);

  return null;
}
