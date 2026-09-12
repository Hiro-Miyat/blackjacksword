'use client'

// Lightweight Web Audio engine: synthesized SFX + looping BGM.
// No external assets required.

type Bgm = 'normal' | 'boss' | null

class AudioEngine {
  private ctx: AudioContext | null = null
  private master: GainNode | null = null
  private bgmGain: GainNode | null = null
  private bgmTimer: ReturnType<typeof setInterval> | null = null
  private bgmKind: Bgm = null
  private step = 0
  muted = false

  private ensure() {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext
      if (!Ctx) return null
      this.ctx = new Ctx()
      this.master = this.ctx.createGain()
      this.master.gain.value = 0.5
      this.master.connect(this.ctx.destination)
      this.bgmGain = this.ctx.createGain()
      this.bgmGain.gain.value = 0.18
      this.bgmGain.connect(this.master)
    }
    return this.ctx
  }

  resume() {
    const ctx = this.ensure()
    if (ctx && ctx.state === 'suspended') void ctx.resume()
  }

  setMuted(m: boolean) {
    this.muted = m
    if (this.master) this.master.gain.value = m ? 0 : 0.5
  }

  private tone(
    freq: number,
    start: number,
    dur: number,
    type: OscillatorType,
    gain: number,
    dest: GainNode,
  ) {
    if (!this.ctx) return
    const osc = this.ctx.createOscillator()
    const g = this.ctx.createGain()
    osc.type = type
    osc.frequency.setValueAtTime(freq, start)
    g.gain.setValueAtTime(0, start)
    g.gain.linearRampToValueAtTime(gain, start + 0.01)
    g.gain.exponentialRampToValueAtTime(0.0001, start + dur)
    osc.connect(g)
    g.connect(dest)
    osc.start(start)
    osc.stop(start + dur + 0.02)
  }

  sfx(kind: 'select' | 'attack' | 'hit' | 'burst' | 'win' | 'skill' | 'click' | 'defeat') {
    const ctx = this.ensure()
    if (!ctx || !this.master) return
    this.resume()
    const t = ctx.currentTime
    switch (kind) {
      case 'select':
        this.tone(660, t, 0.08, 'triangle', 0.3, this.master)
        break
      case 'click':
        this.tone(440, t, 0.06, 'square', 0.2, this.master)
        break
      case 'attack':
        this.tone(180, t, 0.12, 'sawtooth', 0.35, this.master)
        this.tone(90, t + 0.02, 0.18, 'square', 0.3, this.master)
        break
      case 'hit':
        this.tone(140, t, 0.16, 'square', 0.35, this.master)
        this.tone(70, t + 0.03, 0.2, 'sawtooth', 0.3, this.master)
        break
      case 'burst':
        this.tone(120, t, 0.3, 'sawtooth', 0.35, this.master)
        this.tone(60, t + 0.05, 0.35, 'square', 0.3, this.master)
        break
      case 'skill':
        [0, 1, 2, 3].forEach((i) =>
          this.tone(523 + i * 130, t + i * 0.05, 0.18, 'triangle', 0.3, this.master!),
        )
        break
      case 'win':
        [523, 659, 784, 1046].forEach((f, i) =>
          this.tone(f, t + i * 0.13, 0.28, 'triangle', 0.35, this.master!),
        )
        break
      case 'defeat':
        [400, 320, 240, 160].forEach((f, i) =>
          this.tone(f, t + i * 0.12, 0.3, 'sawtooth', 0.3, this.master!),
        )
        break
    }
  }

  startBgm(kind: Exclude<Bgm, null>) {
    const ctx = this.ensure()
    if (!ctx || !this.bgmGain) return
    if (this.bgmKind === kind) return
    this.stopBgm()
    this.bgmKind = kind
    this.step = 0
    this.resume()

    const normal = [220, 261, 329, 261, 196, 261, 329, 392]
    const boss = [146, 174, 220, 174, 130, 155, 196, 233]
    const seq = kind === 'boss' ? boss : normal
    const interval = kind === 'boss' ? 260 : 300

    const playStep = () => {
      if (!this.ctx || !this.bgmGain) return
      const t = this.ctx.currentTime
      const note = seq[this.step % seq.length]
      this.tone(note, t, interval / 1000 + 0.05, 'triangle', 0.5, this.bgmGain)
      if (this.step % 2 === 0) {
        this.tone(note / 2, t, interval / 1000 + 0.1, 'sine', 0.6, this.bgmGain)
      }
      this.step += 1
    }
    playStep()
    this.bgmTimer = setInterval(playStep, interval)
  }

  stopBgm() {
    if (this.bgmTimer) clearInterval(this.bgmTimer)
    this.bgmTimer = null
    this.bgmKind = null
  }
}

let engine: AudioEngine | null = null
export function getAudio(): AudioEngine {
  if (!engine) engine = new AudioEngine()
  return engine
}
