'use client'

import { X } from 'lucide-react'
import { ELEMENT_COLOR, ELEMENT_LABEL } from '@/lib/game/cards'
import { HAND_SKILLS } from '@/lib/game/config'
import { Button } from '@/components/ui/button'

interface Props {
  open: boolean
  onClose: () => void
}

export function HelpDialog({ open, onClose }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm">
      <div className="anim-popin relative flex max-h-[88vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-border bg-popover text-popover-foreground shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="font-display text-lg text-gold">遊び方</h2>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            aria-label="閉じる"
          >
            <X className="size-5" />
          </Button>
        </div>

        <div className="space-y-5 overflow-y-auto px-4 py-4 text-sm leading-relaxed">
          <section className="space-y-1.5">
            <h3 className="font-display text-base text-gold">基本ルール</h3>
            <p className="text-muted-foreground">
              手札からカードを選んで攻撃します。選んだカードの合計値がそのまま威力に。
              J・Q・Kは10、Aは1か11の都合の良い方として計算します。
            </p>
            <ul className="ml-4 list-disc space-y-1 text-muted-foreground">
              <li>
                <span className="font-bold text-safe">21未満</span>
                ：合計ぶんのダメージ。21に足りない差×2ぶんのペナルティが発生。
              </li>
              <li>
                <span className="font-bold text-gold">ちょうど21（ジャスト）</span>
                ：ペナルティなしのクリーンヒット！
              </li>
              <li>
                <span className="font-bold text-danger">21超過（バースト）</span>
                ：ダメージ0＋超過分×2のペナルティ。
              </li>
            </ul>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-display text-base text-gold">モード1：21チャレンジ</h3>
            <p className="text-muted-foreground">
              属性なし。HPが21の倍数の敵5体＋ボスに挑戦。ジャスト21以外で敵を弱らせると、
              ペナルティぶんのHPを持つ「お供」がラスボス戦で復活合流します。とにかくキレイに21を狙え！
            </p>
          </section>

          <section className="space-y-1.5">
            <h3 className="font-display text-base text-gold">モード2：属性ボス耐久戦</h3>
            <p className="text-muted-foreground">
              属性相性とポーカー役スキルが有効。HP200のボスを、できるだけ少ないターンで撃破します。
              弱点属性は約1.5倍、耐性属性は約0.7倍。ツーペア以下の弱い役でジャストを外すと、
              ペナルティぶんボスがHPを回復してしまいます。
            </p>
          </section>

          <section className="space-y-2">
            <h3 className="font-display text-base text-gold">ポーカー役スキル（モード2）</h3>
            <div className="space-y-2">
              {HAND_SKILLS.map((s) => (
                <div
                  key={s.hand}
                  className="rounded-lg border border-border bg-card/60 p-2.5"
                >
                  <p className="font-display text-sm text-foreground">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.effect}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-2">
            <h3 className="font-display text-base text-gold">属性（マーク）</h3>
            <div className="grid grid-cols-2 gap-2">
              {(['fire', 'water', 'thunder', 'nature'] as const).map((el) => (
                <div
                  key={el}
                  className="flex items-center gap-2 rounded-lg border border-border bg-card/60 px-2.5 py-1.5 text-xs"
                >
                  <span
                    className="grid size-6 place-items-center rounded-md font-bold text-white"
                    style={{ backgroundColor: ELEMENT_COLOR[el] }}
                  >
                    {ELEMENT_LABEL[el]}
                  </span>
                  <span className="text-muted-foreground">
                    {el === 'fire' && '♥ ハート'}
                    {el === 'water' && '♠ スペード'}
                    {el === 'thunder' && '♦ ダイヤ'}
                    {el === 'nature' && '♣ クラブ'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="border-t border-border p-3">
          <Button onClick={onClose} className="w-full font-display">
            とじる
          </Button>
        </div>
      </div>
    </div>
  )
}
