'use client';

// 音楽のタイマーと音源の管理
let bgmInterval: any = null;
let currentBgmType: 'title' | 'battle' | null = null;
let activeOscillators: any[] = []; // 鳴っている音を記憶するリスト

// 安全にすべての音を消し去る関数
const clearAllSounds = () => {
  activeOscillators.forEach(osc => {
    try {
      osc.stop();
      osc.disconnect();
    } catch (e) {}
  });
  activeOscillators = [];
};

// 曲をピタッと完全に止める関数
export const stopBGM = () => {
  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
  clearAllSounds(); // 残っている音を完全に消去
  currentBgmType = null;
};
// ★新機能：音が絶対に残らないクリーンなBGM演奏システム
export const playBGM = (type: 'title' | 'battle') => {
  if (currentBgmType === type) return; 
  stopBGM(); 
  currentBgmType = type;

  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();

  const titleNotes = [261.63, 293.66, 329.63, 392.00]; // 静かな音
  const battleNotes = [146.83, 164.81, 196.00, 220.00]; // テンポのある音
  let index = 0;

  // 0.4秒ごとにポン、ポンと音を刻むタイマー
  bgmInterval = setInterval(() => {
    // 鳴り終わった古い音を毎回綺麗にクリアしてリセットします
    clearAllSounds();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.type = 'triangle'; // 柔らかな波形
    
    if (type === 'title') {
      osc.frequency.setValueAtTime(titleNotes[index % titleNotes.length], ctx.currentTime);
      gain.gain.setValueAtTime(0.03, ctx.currentTime); // より静かな音量に
    } else {
      osc.frequency.setValueAtTime(battleNotes[index % battleNotes.length], ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime); 
    }

    // 次の音が鳴る前に、現在の音量を完全にゼロ（無音）まで落とします
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
    
    osc.start();
    // 鳴らした音源をリストに記憶させて、いつでも強制終了できるようにします
    activeOscillators.push(osc);
    index++;
  }, 400); 
};
// 効果音（select, pair, attack のノイズも完全に除去しました）
export const playCardSound = (type: 'select' | 'pair' | 'attack') => {
  const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContext) return;
  const ctx = new AudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.type = 'triangle'; 

  if (type === 'select') {
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15); // 完全に無音化
    osc.start(); 
    osc.stop(ctx.currentTime + 0.15);
  } else if (type === 'pair') {
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(880.00, ctx.currentTime + 0.2);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);
    osc.start(); 
    osc.stop(ctx.currentTime + 0.4);
  } else if (type === 'attack') {
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
    osc.start(); 
    osc.stop(ctx.currentTime + 0.3);
  }
};
