import type { Card, Element, HandType, Suit } from './types'

export const SUITS: Suit[] = ['hearts', 'spades', 'diamonds', 'clubs']

export const SUIT_SYMBOL: Record<Suit, string> = {
  hearts: '♥',
  spades: '♠',
  diamonds: '♦',
  clubs: '♣',
}

export const SUIT_ELEMENT: Record<Suit, Element> = {
  hearts: 'fire',
  spades: 'water',
  diamonds: 'thunder',
  clubs: 'nature',
}

export const ELEMENT_LABEL: Record<Element, string> = {
  fire: '火',
  water: '水',
  thunder: '雷',
  nature: '森',
}

export const ELEMENT_COLOR: Record<Element, string> = {
  fire: '#ff6b57',
  water: '#5aa9ff',
  thunder: '#ffd44d',
  nature: '#5ad06f',
}

let idCounter = 0
function nextId() {
  idCounter += 1
  return `c${idCounter}_${Math.random().toString(36).slice(2, 7)}`
}

export function rankLabel(rank: number): string {
  if (rank === 1) return 'A'
  if (rank === 11) return 'J'
  if (rank === 12) return 'Q'
  if (rank === 13) return 'K'
  return String(rank)
}

/** Hard value of a single card for blackjack (Ace counted as 1 here). */
export function cardHardValue(rank: number): number {
  if (rank >= 11) return 10
  return rank
}

export function makeDeck(): Card[] {
  const deck: Card[] = []
  for (const suit of SUITS) {
    for (let rank = 1; rank <= 13; rank++) {
      deck.push({ id: nextId(), rank, suit })
    }
  }
  return shuffle(deck)
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function newCard(rank: number, suit: Suit): Card {
  return { id: nextId(), rank, suit }
}

/**
 * Blackjack total: J/Q/K = 10, Ace = 1 or 11 (best value not exceeding 21).
 */
export function blackjackTotal(cards: Card[]): number {
  let total = 0
  let aces = 0
  for (const c of cards) {
    if (c.rank === 1) {
      aces += 1
      total += 1
    } else {
      total += cardHardValue(c.rank)
    }
  }
  for (let i = 0; i < aces; i++) {
    if (total + 10 <= 21) total += 10
  }
  return total
}

function hasRun(ranks: number[], length: number): boolean {
  const unique = Array.from(new Set(ranks)).sort((a, b) => a - b)
  let run = 1
  for (let i = 1; i < unique.length; i++) {
    if (unique[i] === unique[i - 1] + 1) {
      run += 1
      if (run >= length) return true
    } else {
      run = 1
    }
  }
  return false
}

/** Poker hand judged on natural rank order (A,2..J,Q,K). */
export function evaluatePokerHand(cards: Card[]): HandType {
  if (cards.length === 0) return 'none'
  const rankCounts = new Map<number, number>()
  const suitCounts = new Map<Suit, number>()
  for (const c of cards) {
    rankCounts.set(c.rank, (rankCounts.get(c.rank) ?? 0) + 1)
    suitCounts.set(c.suit, (suitCounts.get(c.suit) ?? 0) + 1)
  }
  const counts = Array.from(rankCounts.values()).sort((a, b) => b - a)
  const flush = cards.length >= 5 && Array.from(suitCounts.values()).some((n) => n >= 5)
  const straight = cards.length >= 5 && hasRun(cards.map((c) => c.rank), 5)

  if (counts[0] >= 4) return 'four'
  if (counts[0] >= 3 && (counts[1] ?? 0) >= 2) return 'full'
  if (flush) return 'flush'
  if (straight) return 'straight'
  if (counts[0] >= 3) return 'three'
  if (counts[0] >= 2 && (counts[1] ?? 0) >= 2) return 'twopair'
  if (counts[0] >= 2) return 'pair'
  return 'none'
}

/**
 * Auto-select: from a hand, pick the subset with the best outcome.
 * Prefers exactly 21, then the strongest poker hand, then closest-to-21.
 */
export function recommendSelection(hand: Card[]): string[] {
  const n = hand.length
  let best: { ids: string[]; score: number } | null = null
  const HAND_RANK: Record<HandType, number> = {
    four: 8,
    full: 7,
    flush: 6,
    straight: 5,
    three: 4,
    twopair: 3,
    pair: 2,
    none: 1,
  }
  // enumerate subsets (hand size is small, <= 7)
  for (let mask = 1; mask < 1 << n; mask++) {
    const subset: Card[] = []
    for (let i = 0; i < n; i++) {
      if (mask & (1 << i)) subset.push(hand[i])
    }
    const total = blackjackTotal(subset)
    if (total > 21) continue // never recommend a burst
    const hand5 = evaluatePokerHand(subset)
    // score: reward getting close to 21 heavily, plus poker strength
    let score = total * 10 + HAND_RANK[hand5] * 25
    if (total === 21) score += 500
    if (!best || score > best.score) {
      best = { ids: subset.map((c) => c.id), score }
    }
  }
  return best?.ids ?? []
}

export function elementAffinity(cards: Card[], weak: Element, resist: Element): number {
  if (cards.length === 0) return 1
  let sum = 0
  for (const c of cards) {
    const el = SUIT_ELEMENT[c.suit]
    if (el === weak) sum += 1.5
    else if (el === resist) sum += 0.7
    else sum += 1
  }
  return sum / cards.length
}
