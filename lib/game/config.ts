import type { EnemyInstance, HandType } from './types'

export const HAND_SIZE = 7

export const HAND_LABEL: Record<HandType, string> = {
  four: 'フォーカード',
  full: 'フルハウス',
  flush: 'フラッシュ',
  straight: 'ストレート',
  three: 'スリーカード',
  twopair: 'ツーペア',
  pair: 'ワンペア',
  none: '役なし',
}

/** Damage multiplier per poker hand (mode 2). */
export const HAND_MULT: Record<HandType, number> = {
  four: 1,
  full: 4,
  flush: 3,
  straight: 2.5,
  three: 1,
  twopair: 1,
  pair: 1,
  none: 1,
}

export interface HandSkill {
  hand: HandType
  title: string
  effect: string
}

export const HAND_SKILLS: HandSkill[] = [
  {
    hand: 'four',
    title: 'フォーカード',
    effect: '現在の敵を一撃必殺（即死）！ ただしラスボスには無効。道中の敵5体のみ有効。',
  },
  {
    hand: 'full',
    title: 'フルハウス',
    effect: 'ダメージ4倍。復活ペナルティを完全に阻止する。',
  },
  {
    hand: 'flush',
    title: 'フラッシュ',
    effect: 'ダメージ3倍。次のターン終了まで敵の属性を無効化し、味方の攻撃が1.5倍。',
  },
  {
    hand: 'straight',
    title: 'ストレート',
    effect: 'ダメージ2.5倍。手札をすべて交換して引き直す。',
  },
  {
    hand: 'three',
    title: 'スリーカード',
    effect: '手札のカード1枚を、好きな数字や属性（マーク）に自由に書き換えできる。',
  },
  {
    hand: 'twopair',
    title: 'ツーペア',
    effect: 'バーストしていても、1回だけペナルティを帳消しにする。',
  },
  {
    hand: 'pair',
    title: 'ワンペア',
    effect: '「おすすめ選択」ボタンで、21に一番近い or 最も強い役を自動選択できる。',
  },
]

let eid = 0
function mkId() {
  eid += 1
  return `e${eid}`
}

/** Mode 1: five minions (HP multiples of 21) then the final boss. */
export function buildDesignEnemies(): EnemyInstance[] {
  const base: Omit<EnemyInstance, 'id' | 'hp'>[] = [
    {
      name: 'マグマスライム',
      maxHp: 21,
      element: 'fire',
      weak: 'water',
      resist: 'nature',
      sprite: '/enemy/fire.png',
      bg: '/bg/lava.png',
      isBoss: false,
    },
    {
      name: 'ジャングルビースト',
      maxHp: 42,
      element: 'nature',
      weak: 'fire',
      resist: 'water',
      sprite: '/enemy/nature.png',
      bg: '/bg/jungle.png',
      isBoss: false,
    },
    {
      name: 'アイスゴーレム',
      maxHp: 63,
      element: 'water',
      weak: 'thunder',
      resist: 'fire',
      sprite: '/enemy/ice.png',
      bg: '/bg/ice.png',
      isBoss: false,
    },
    {
      name: 'ポイズントード',
      maxHp: 84,
      element: 'nature',
      weak: 'fire',
      resist: 'water',
      sprite: '/enemy/poison.png',
      bg: '/bg/poison.png',
      isBoss: false,
    },
    {
      name: 'シャドウストーム',
      maxHp: 105,
      element: 'thunder',
      weak: 'nature',
      resist: 'water',
      sprite: '/enemy/storm.png',
      bg: '/bg/poison.png',
      isBoss: false,
    },
    {
      name: '光帝アークデーモン',
      maxHp: 200,
      element: 'thunder',
      weak: 'water',
      resist: 'fire',
      sprite: '/enemy/boss.png',
      bg: '/bg/heaven.png',
      isBoss: true,
    },
  ]
  return base.map((b) => ({ ...b, id: mkId(), hp: b.maxHp }))
}

/** Mode 2: single HP200 endurance boss with active attribute affinity. */
export function buildEndureEnemies(): EnemyInstance[] {
  return [
    {
      id: mkId(),
      name: '光帝アークデーモン',
      maxHp: 200,
      hp: 200,
      element: 'thunder',
      weak: 'water',
      resist: 'fire',
      sprite: '/enemy/boss.png',
      bg: '/bg/heaven.png',
      isBoss: true,
    },
  ]
}

export function makeRevivedEnemy(totalHp: number): EnemyInstance {
  return {
    id: mkId(),
    name: '復活したお供軍団',
    maxHp: totalHp,
    hp: totalHp,
    element: 'thunder',
    weak: 'water',
    resist: 'fire',
    sprite: '/enemy/storm.png',
    bg: '/bg/heaven.png',
    isBoss: true,
    isRevived: true,
  }
}
