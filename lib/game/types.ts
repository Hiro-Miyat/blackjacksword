export type Suit = 'hearts' | 'spades' | 'diamonds' | 'clubs'
export type Element = 'fire' | 'water' | 'thunder' | 'nature'
export type GameMode = 'design' | 'endure'

export interface Card {
  id: string
  rank: number // 1=A, 2..10, 11=J, 12=Q, 13=K
  suit: Suit
}

export type HandType =
  | 'four'
  | 'full'
  | 'flush'
  | 'straight'
  | 'three'
  | 'twopair'
  | 'pair'
  | 'none'

export interface EnemyInstance {
  id: string
  name: string
  maxHp: number
  hp: number
  element: Element
  weak: Element // cards of this element deal extra (mode 2)
  resist: Element // cards of this element deal less (mode 2)
  sprite: string
  bg: string
  isBoss: boolean
  isRevived?: boolean
}

export type DamageState = 'under' | 'just' | 'burst'

export interface Projection {
  total: number // blackjack total of selected cards
  damage: number // final projected damage
  state: DamageState
  hand: HandType
  affinity: number // mode 2 attribute multiplier
  handMult: number
  instaKill: boolean
}
