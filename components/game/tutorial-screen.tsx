'use client'

import { ArrowLeft, Swords } from 'lucide-react'
import type { GameMode } from '@/lib/game/types'
import { HAND_SKILLS } from '@/lib/game/config'
import { Button } from '@/components/ui/button'

interface Props {
  mode: GameMode
  onBegin: () => void
  onBack: () => void
}

export function TutorialScreen({ mode, onBegin, onBack }: Props) {
  const isDesign = mode === 'design'
  return (
    <main className="relative flex min-h-dvh flex-col bg-background">
      <header className="flex items-center gap-3 border-b border-border px-4 py-3">
        <Button size="icon" variant="ghost" onClick={onBack} aria-label="もどる">
          <ArrowLeft className="size-5" />
        </Button>
        <h1 className="font-display text-lg text-gold">
          {isDesign ? '21チャレンジ' : '属性ボス耐久戦'}
        </h1>
      </header>

      <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
        <section className="rounded-2xl border border-border bg-card p-4">
          <h2 className="font-display text-base text-foreground">目的</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {isDesign
              ? 'HPが21の倍数の敵5体と、HP200のラスボスを撃破しよう。毎ターン「ちょうど21」を決めるのが理想だ。'
              : 'HP200の耐久ボスを、できるだけ少ないターンで撃破しよう。属性相性とポーカーの役を使いこなせ。'}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-display text-base text-foreground">遊び方</h2>
          <div className="space-y-2 text-sm text-muted-foreground">
            <Step n={1} text="手札からカードを選ぶ。合計値がそのまま攻撃の威力になる。" />
            <Step n={2} text="J・Q・Kは10点、Aは1か11の良い方。合計21ちょうどが最高だ。" />
            <Step
              n={3}
              text={
                isDesign
                  ? '21に届かない／超えると、その差の2倍のHPを持つ「お供」がボス戦で復活する。'
                  : 'ツーペア以下でジャストを外すと、ペナルティぶんボスがHPを回復する。'
              }
            />
            <Step
              n={4}
              text={
                isDesign
                  ? '属性やポーカー役の効果はこのモードでは発生しない。純粋な21の読み合いだ。'
                  : '5枚以上を組み合わせてポーカーの役を作ると、強力なスキルが自動で発動する。'
              }
            />
          </div>
        </section>

        {isDesign ? null : (
          <section className="space-y-2">
            <h2 className="font-display text-base text-foreground">役スキル</h2>
            <div className="space-y-2">
              {HAND_SKILLS.map((s) => (
                <div
                  key={s.hand}
                  className="rounded-xl border border-border bg-card/70 p-3"
                >
                  <p className="font-display text-sm text-gold">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.effect}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <div className="border-t border-border p-4">
        <Button
          size="lg"
          onClick={onBegin}
          className="h-14 w-full gap-2 font-display text-lg"
        >
          <Swords className="size-5" />
          バトル開始
        </Button>
      </div>
    </main>
  )
}

function Step({ n, text }: { n: number; text: string }) {
  return (
    <div className="flex gap-3">
      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-gold font-display text-xs text-primary-foreground">
        {n}
      </span>
      <p className="pt-0.5">{text}</p>
    </div>
  )
}
