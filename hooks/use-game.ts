'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getAudio } from '@/lib/game/audio'
import {
  blackjackTotal,
  elementAffinity,
  evaluatePokerHand,
  makeDeck,
  newCard,
  recommendSelection,
} from '@/lib/game/cards'
import {
  buildDesignEnemies,
  buildEndureEnemies,
  HAND_MULT,
  HAND_SIZE,
  makeRevivedEnemy,
} from '@/lib/game/config'
import { clearSave, hasSave, loadSave, writeSave, type SaveData } from '@/lib/game/save'
import type {
  Card,
  EnemyInstance,
  GameMode,
  HandType,
  Projection,
  Suit,
} from '@/lib/game/types'

export type Screen = 'title' | 'tutorial' | 'battle' | 'result'

interface CoreState {
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
}

interface DmgPopup {
  amount: number
  state: 'under' | 'just' | 'burst'
  hand: HandType
  healed?: number
  instaKill?: boolean
}

interface ResultData {
  win: boolean
  turns: number
  mode: GameMode
  revived: boolean
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n))
}

function drawCards(deck: Card[], n: number): { drawn: Card[]; deck: Card[] } {
  let d = [...deck]
  const drawn: Card[] = []
  for (let i = 0; i < n; i++) {
    if (d.length === 0) d = makeDeck()
    drawn.push(d.shift()!)
  }
  return { drawn, deck: d }
}

function coreToSave(core: CoreState): SaveData {
  return { ...core, savedAt: Date.now() }
}

export function useGame() {
  const [screen, setScreen] = useState<Screen>('title')
  const [pendingMode, setPendingMode] = useState<GameMode>('design')
  const [core, setCore] = useState<CoreState | null>(null)
  const [selected, setSelected] = useState<string[]>([])
  const [result, setResult] = useState<ResultData | null>(null)
  
  // 👈 page.tsxとバトル画面を1発で繋ぐための進行フラグを追加します
  const isPlaying = screen === 'battle';

  const [shake, setShake] = useState(false)
  const [hitFlash, setHitFlash] = useState(false)
  const [dmgPopup, setDmgPopup] = useState<DmgPopup | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [bgFadeKey, setBgFadeKey] = useState(0)
  const [muted, setMuted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [hasSaveData, setHasSaveData] = useState(false)

  const coreRef = useRef<CoreState | null>(null)
  const busyRef = useRef(false)
  const mounted = useRef(true)
  const msgTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    coreRef.current = core
  }, [core])
  useEffect(() => {
    busyRef.current = busy
  }, [busy])
  useEffect(() => {
    mounted.current = true
    setHasSaveData(hasSave())
    if (!core) {
      const initialDeck = makeDeck ? makeDeck() : [];
      const initialHand = initialDeck.splice(0, 7);
      setCore({ mode: 'design', stageIndex: 0, turns: 1, hp: 100, maxHp: 100, hand: initialHand, deck: initialDeck, enemies: [{ id: '1', name: 'SLIME', hp: 50, maxHp: 50, element: 'none' }], rewriteTokens: 3 } as any);
    }
    
    return () => {
      mounted.current = false
      getAudio().stopBgm()
    }
  }, [])

  const currentEnemy: EnemyInstance | null = core
    ? core.enemies[core.stageIndex]
    : null

  // Persist during battle
  useEffect(() => {
    if (screen === 'battle' && core) writeSave(coreToSave(core))
  }, [core, screen])

  // BGM follows the battle / boss context
  useEffect(() => {
    const audio = getAudio()
    if (screen === 'battle' && currentEnemy) {
      audio.startBgm(currentEnemy.isBoss ? 'boss' : 'normal')
    } else {
      audio.stopBgm()
    }
  }, [screen, currentEnemy])

  const selectedCards: Card[] = useMemo(
    () => (core ? core.hand.filter((c) => selected.includes(c.id)) : []),
    [core, selected],
  )

  const projection: Projection = useMemo(() => {
    const cards = selectedCards
    const total = blackjackTotal(cards)
    const hand = evaluatePokerHand(cards)
    const state = total > 21 ? 'burst' : total === 21 ? 'just' : 'under'
    let damage = state === 'burst' ? 0 : total
    let handMult = 1
    let affinity = 1
    let instaKill = false
    if (core?.mode === 'endure' && currentEnemy) {
      handMult = HAND_MULT[hand]
      affinity =
        core.enemyAttrNullTurns > 0
          ? 1
          : elementAffinity(cards, currentEnemy.weak, currentEnemy.resist)
      instaKill = hand === 'four' && !currentEnemy.isBoss
      const base = state === 'burst' ? 0 : total
      const buff = core.attackBuffTurns > 0 ? 1.5 : 1
      damage = Math.round(base * handMult * affinity * buff)
    }
    return { total, damage, state, hand, affinity, handMult, instaKill }
  }, [selectedCards, core, currentEnemy])

  const flashMessage = useCallback((text: string) => {
    if (msgTimer.current) clearTimeout(msgTimer.current)
    setMessage(text)
    msgTimer.current = setTimeout(() => {
      if (mounted.current) setMessage(null)
    }, 1400)
  }, [])

  const setMutedFn = useCallback((m: boolean) => {
    setMuted(m)
    getAudio().setMuted(m)
  }, [])

  // --- navigation ---
  const selectMode = useCallback((mode: GameMode) => {
    getAudio().resume()
    getAudio().sfx('click')
    setPendingMode(mode)
    setScreen('tutorial')
  }, [])

  const initCore = useCallback((mode: GameMode): CoreState => {
    const enemies = mode === 'design' ? buildDesignEnemies() : buildEndureEnemies()
    const { drawn, deck } = drawCards(makeDeck(), HAND_SIZE)
    return {
      mode,
      deck,
      hand: drawn,
      enemies,
      stageIndex: 0,
      turns: 0,
      penaltyMinions: [],
      revivedSpawned: false,
      attackBuffTurns: 0,
      enemyAttrNullTurns: 0,
      twoPairCancelLeft: 1,
      rewriteTokens: 0,
    }
  }, [])

  const beginBattle = useCallback(() => {
    getAudio().resume()
    getAudio().sfx('click')
    const c = initCore(pendingMode)
    setCore(c)
    setSelected([])
    setResult(null)
    setBgFadeKey((k) => k + 1)
    setScreen('battle')
  }, [initCore, pendingMode])

  const continueGame = useCallback(() => {
    const save = loadSave()
    if (!save) return
    getAudio().resume()
    getAudio().sfx('click')
    setPendingMode(save.mode)
    const { savedAt, ...rest } = save
    setCore(rest)
    setSelected([])
    setResult(null)
    setBgFadeKey((k) => k + 1)
    setScreen('battle')
  }, [])

  const quitToTitle = useCallback(() => {
    getAudio().sfx('click')
    getAudio().stopBgm()
    setHasSaveData(hasSave())
    setScreen('title')
  }, [])

  // --- battle actions ---
  const toggleSelect = useCallback(
    (id: string) => {
      if (busyRef.current) return
      getAudio().sfx('select')
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      )
    },
    [],
  )

  const clearSelect = useCallback(() => {
    if (busyRef.current) return
    getAudio().sfx('click')
    setSelected([])
  }, [])

  const autoSelect = useCallback(() => {
    if (busyRef.current || !coreRef.current) return
    getAudio().sfx('skill')
    setSelected(recommendSelection(coreRef.current.hand))
  }, [])

  const rewriteCard = useCallback((cardId: string, rank: number, suit: Suit) => {
    const c = coreRef.current
    if (!c || c.rewriteTokens <= 0) return
    getAudio().sfx('skill')
    setCore({
      ...c,
      rewriteTokens: c.rewriteTokens - 1,
      hand: c.hand.map((card) =>
        card.id === cardId ? newCard(rank, suit) : card,
      ),
    })
  }, [])

  const attack = useCallback(() => {
    const c = coreRef.current
    if (!c || busyRef.current) return
    const cards = c.hand.filter((x) => selected.includes(x.id))
    if (cards.length === 0) return

    const total = blackjackTotal(cards)
    const handType = evaluatePokerHand(cards)
    const state = total > 21 ? 'burst' : total === 21 ? 'just' : 'under'
    const audio = getAudio()

    // clone enemies
    const enemies = c.enemies.map((e) => ({ ...e }))
    const enemy = enemies[c.stageIndex]

    let handMult = 1
    let affinity = 1
    let instaKill = false
    let attackBuffTurns = c.attackBuffTurns
    let enemyAttrNullTurns = c.enemyAttrNullTurns
    let twoPairCancelLeft = c.twoPairCancelLeft
    let rewriteTokens = c.rewriteTokens
    const penaltyMinions = [...c.penaltyMinions]

    if (c.mode === 'endure') {
      handMult = HAND_MULT[handType]
      affinity =
        enemyAttrNullTurns > 0 ? 1 : elementAffinity(cards, enemy.weak, enemy.resist)
      instaKill = handType === 'four' && !enemy.isBoss
    }
    const buff = c.mode === 'endure' && attackBuffTurns > 0 ? 1.5 : 1
    const base = state === 'burst' ? 0 : total
    const damage =
      c.mode === 'endure' ? Math.round(base * handMult * affinity * buff) : base

    let healed = 0
    let skillMsg = ''

    // apply damage
    if (instaKill) {
      enemy.hp = 0
      skillMsg = 'フォーカード・一撃必殺！'
    } else {
      enemy.hp -= damage
    }
    if (handType === 'four' && enemy.isBoss) {
      skillMsg = 'フォーカード…だがボスには無効！'
    }

    // penalty
    const weakHand =
      handType === 'twopair' || handType === 'pair' || handType === 'none'
    const penaltyAmount =
      state === 'burst'
        ? (total - 21) * 2
        : state === 'under'
          ? (21 - total) * 2
          : 0

    if (c.mode === 'design') {
      if (!c.revivedSpawned && penaltyAmount > 0) {
        penaltyMinions.push(penaltyAmount)
      }
    } else {
      // endure: weak-hand penalty makes the boss recover HP
      if (penaltyAmount > 0 && weakHand) {
        if (handType === 'twopair' && twoPairCancelLeft > 0) {
          twoPairCancelLeft -= 1
          skillMsg = 'ツーペア・ペナルティ帳消し！'
        } else {
          healed = penaltyAmount
          enemy.hp += penaltyAmount
        }
      } else if (handType === 'full' && penaltyAmount > 0) {
        skillMsg = 'フルハウス・ペナルティ完全阻止！'
      }
    }

    enemy.hp = clamp(enemy.hp, 0, enemy.maxHp)
    const defeated = enemy.hp <= 0

    // skill side effects (endure)
    if (c.mode === 'endure' && !defeated) {
      if (handType === 'flush') {
        enemyAttrNullTurns = 2
        attackBuffTurns = 2
        skillMsg = 'フラッシュ・属性無効＋攻撃UP！'
      } else if (handType === 'three') {
        rewriteTokens += 1
        skillMsg = 'スリーカード・書き換え権を獲得！'
      } else if (handType === 'full') {
        skillMsg = skillMsg || 'フルハウス・ダメージ4倍！'
      } else if (handType === 'straight') {
        skillMsg = 'ストレート・手札を全交換！'
      }
    }

    // hand refill / redraw
    const remaining = c.hand.filter((x) => !selected.includes(x.id))
    let newHand: Card[]
    let newDeck: Card[]
    if (c.mode === 'endure' && handType === 'straight') {
      const r = drawCards(c.deck, HAND_SIZE)
      newHand = r.drawn
      newDeck = r.deck
    } else {
      const need = HAND_SIZE - remaining.length
      const r = drawCards(c.deck, need)
      newHand = [...remaining, ...r.drawn]
      newDeck = r.deck
    }

    // decrement buffs at end of turn
    attackBuffTurns = Math.max(0, attackBuffTurns - 1)
    enemyAttrNullTurns = Math.max(0, enemyAttrNullTurns - 1)

    // outcome
    let outcome: 'continue' | 'advance' | 'win' = 'continue'
    let nextStageIndex = c.stageIndex
    let revivedSpawned = c.revivedSpawned
    if (defeated) {
      if (c.stageIndex < enemies.length - 1) {
        outcome = 'advance'
        nextStageIndex = c.stageIndex + 1
      } else if (
        c.mode === 'design' &&
        !revivedSpawned &&
        penaltyMinions.length > 0
      ) {
        const sum = penaltyMinions.reduce((a, b) => a + b, 0)
        enemies.push(makeRevivedEnemy(sum))
        revivedSpawned = true
        outcome = 'advance'
        nextStageIndex = c.stageIndex + 1
      } else {
        outcome = 'win'
      }
    }

    const nextCore: CoreState = {
      ...c,
      deck: newDeck,
      hand: newHand,
      enemies,
      stageIndex: nextStageIndex,
      turns: c.turns + 1,
      penaltyMinions,
      revivedSpawned,
      attackBuffTurns,
      enemyAttrNullTurns,
      twoPairCancelLeft,
      rewriteTokens,
    }

    // --- run the animation timeline ---
    setBusy(true)
    setSelected([])
    if (state === 'burst' && !instaKill) audio.sfx('burst')
    else if (handMult > 1 || instaKill) audio.sfx('skill')
    else audio.sfx('attack')
    if (skillMsg) flashMessage(skillMsg)

    setShake(true)
    setHitFlash(true)
    setDmgPopup({
      amount: damage,
      state,
      hand: handType,
      healed: healed || undefined,
      instaKill: instaKill || undefined,
    })

    setTimeout(() => {
      if (!mounted.current) return
      // apply hp/buff changes but keep displaying current enemy until advance
      setCore({ ...nextCore, stageIndex: c.stageIndex })
    }, 180)

    setTimeout(() => {
      if (!mounted.current) return
      setShake(false)
      setHitFlash(false)
      setDmgPopup(null)
    }, 620)

    setTimeout(() => {
      if (!mounted.current) return
      if (outcome === 'advance') {
        audio.sfx('defeat')
        setCore(nextCore)
        setBgFadeKey((k) => k + 1)
        flashMessage(
          nextCore.enemies[nextStageIndex].isBoss && !enemies[c.stageIndex].isBoss
            ? 'ボス出現！'
            : '敵を撃破！',
        )
      } else if (outcome === 'win') {
        audio.stopBgm()
        audio.sfx('win')
        clearSave()
        setHasSaveData(false)
        setResult({
          win: true,
          turns: nextCore.turns,
          mode: c.mode,
          revived: revivedSpawned,
        })
        setScreen('result')
      }
    }, 720)

    setTimeout(() => {
      if (!mounted.current) return
      setBusy(false)
    }, 900)
  }, [selected, flashMessage])
  return {
    isPlaying,
    screen,
    mode: pendingMode,
    core,
    currentEnemy,
    selected,
    selectedCards,
    projection,
    result,
    ui: { shake, hitFlash, dmgPopup, message, bgFadeKey, busy },
    rewriteTokens: core?.rewriteTokens ?? 0,
    muted,
    hasSaveData,
    actions: {
      selectMode,
      beginBattle,
      continueGame,
      quitToTitle,
      toggleSelect,
      clearSelect,
      autoSelect,
      rewriteCard,
      attack,
      setMuted: setMutedFn,
    },
  }
}
