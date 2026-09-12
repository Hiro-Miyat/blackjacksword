'use client'

import Image from 'next/image'
import { Home, RotateCcw, Trophy } from 'lucide-react'
import type { GameMode } from '@/lib/game/types'
import { Button } from '@/components/ui/button'

interface Props {
  turns: number
  mode: GameMode
  revived: boolean
  onRetry: () => void
  onTitle: () => void
}

function rankOf(mode: GameMode, turns: number): { rank: string; note: string } {
  if (mode === 'endure') {
    if (turns <= 8) return { rank: 'S', note: '完璧な猛攻！' }
    if (turns <= 12) return { rank: 'A', note: '見事な立ち回り！' }
    if (turns <= 18) return { rank: 'B', note: 'よく耐え抜いた！' }
    return { rank: 'C', note: 'クリア成功！' }
  }
  if (turns <= 8) return { rank: 'S', note: 'ジャスト連発の神業！' }
  if (turns <= 12) return { rank: 'A', note: 'クリーンな戦いぶり！' }
  if (turns <= 18) return { rank: 'B', note: 'しっかり撃破！' }
  return { rank: 'C', note: 'クリア成功！' }
}

export function ResultScreen({ turns, mode, revived, onRetry, onTitle }: Props) {
  const { rank, note } = rankOf(mode, turns)
  return (
    <main className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-6">
      <Image src="/bg/heaven.png" alt="" fill priority className="object-cover" aria-hidden />
      <div className="absolute inset-0 bg-background/80" />

      <div className="anim-popin relative z-10 flex w-full max-w-sm flex-col items-center rounded-3xl border border-gold/40 bg-card/90 p-8 text-center shadow-2xl backdrop-blur">
        <Trophy className="size-14 text-gold anim-glow" />
        <p className="mt-3 font-display text-sm tracking-[0.3em] text-gold">VICTORY</p>
        <h1 className="mt-1 font-display text-3xl text-foreground">撃破成功！</h1>

        <div className="my-6 flex items-center gap-5">
          <div className="flex flex-col">
            <span className="font-display text-7xl leading-none text-gold text-shadow-strong">
              {rank}
            </span>
            <span className="mt-1 text-xs text-muted-foreground">RANK</span>
          </div>
          <div className="h-16 w-px bg-border" />
          <div className="flex flex-col items-start">
            <span className="font-display text-4xl leading-none text-foreground tabular-nums">
              {turns}
            </span>
            <span className="mt-1 text-xs text-muted-foreground">ターン</span>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">{note}</p>
        {revived ? (
          <p className="mt-1 text-xs text-danger">
            復活したお供も倒しての完全勝利！
          </p>
        ) : null}

        <div className="mt-7 flex w-full flex-col gap-2.5">
          <Button size="lg" onClick={onRetry} className="h-12 w-full gap-2 font-display">
            <RotateCcw className="size-5" />
            もう一度
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={onTitle}
            className="h-12 w-full gap-2 border-border bg-card/60 font-display"
          >
            <Home className="size-5" />
            タイトルへ
          </Button>
        </div>
      </div>
    </main>
  )
}
