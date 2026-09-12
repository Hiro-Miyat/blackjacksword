'use client'

import type { Card, EnemyInstance, GameMode } from './types'

const KEY = 'bj21-poker-save-v1'

export interface SaveData {
  mode: GameMode
  deck: Card[]
  hand: Card[]
  enemies: EnemyInstance[]
  stageIndex: number
  turns: number
  penaltyMinions: number[]
  revivedSpawned: boolean
  attackBuffTurns: number
  enemyAttrNullTurns: number
  twoPairCancelLeft: number
  rewriteTokens: number
  savedAt: number
}

export function loadSave(): SaveData | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as SaveData
  } catch {
    return null
  }
}

export function writeSave(data: SaveData) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(KEY, JSON.stringify(data))
  } catch {
    // ignore quota / private mode errors
  }
}

export function clearSave() {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(KEY)
  } catch {
    // ignore
  }
}

export function hasSave(): boolean {
  return loadSave() !== null
}
