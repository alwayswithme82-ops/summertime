import { getAudio } from './engine'

/**
 * 합성 효과음 모음. 모든 함수는 `when`(초) 만큼 뒤에 재생하도록 예약할 수 있어서
 * 빛이 한 칸씩 나아가는 애니메이션 타이밍에 정확히 맞출 수 있다.
 */

interface ToneOptions {
  type?: OscillatorType
  /** 시작 주파수(Hz). */
  freq: number
  /** 끝 주파수(Hz) — 주면 지속시간 동안 미끄러진다. */
  glide?: number
  /** 길이(초). */
  duration: number
  /** 최대 음량(0~1). */
  peak?: number
  when?: number
}

function tone({ type = 'triangle', freq, glide, duration, peak = 0.2, when = 0 }: ToneOptions) {
  const audio = getAudio()
  if (!audio) return
  const { ctx, sfx } = audio
  const start = ctx.currentTime + when

  const osc = ctx.createOscillator()
  osc.type = type
  osc.frequency.setValueAtTime(freq, start)
  if (glide) osc.frequency.exponentialRampToValueAtTime(glide, start + duration)

  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, start)
  gain.gain.linearRampToValueAtTime(peak, start + 0.012)
  gain.gain.exponentialRampToValueAtTime(0.0008, start + duration)

  osc.connect(gain)
  gain.connect(sfx)
  osc.start(start)
  osc.stop(start + duration + 0.05)
}

/** 거울을 놓거나 돌릴 때 — 가벼운 "톡". */
export function playPlace(when = 0) {
  tone({ type: 'triangle', freq: 540, glide: 720, duration: 0.09, peak: 0.16, when })
}

/** 거울을 지울 때 — 내려가는 "쓱". */
export function playErase(when = 0) {
  tone({ type: 'triangle', freq: 520, glide: 300, duration: 0.11, peak: 0.14, when })
}

/** 실행 시작 — 빛이 출발하는 상승 스윕. */
export function playRunStart(when = 0) {
  tone({ type: 'sine', freq: 320, glide: 940, duration: 0.28, peak: 0.2, when })
  tone({ type: 'triangle', freq: 640, glide: 1880, duration: 0.24, peak: 0.1, when: when + 0.03 })
}

/** 거울 반사 — 맑은 "핑". 반사 순간마다 예약해서 재생. */
export function playReflect(when = 0) {
  tone({ type: 'triangle', freq: 880, glide: 1180, duration: 0.14, peak: 0.2, when })
}

/** 별 통과 — 두 음이 살짝 어긋나는 반짝임. */
export function playStar(when = 0) {
  tone({ type: 'sine', freq: 1318.5, duration: 0.16, peak: 0.16, when }) // E6
  tone({ type: 'sine', freq: 1760, duration: 0.22, peak: 0.14, when: when + 0.07 }) // A6
}

/** 성공 팡파르 — 짧은 상승 아르페지오 + 마무리 화음. */
export function playSuccess(when = 0) {
  const notes = [523.25, 659.25, 783.99, 1046.5] // C5 E5 G5 C6
  notes.forEach((freq, i) => {
    tone({ type: 'triangle', freq, duration: 0.22, peak: 0.18, when: when + i * 0.11 })
  })
  // 마무리 화음(C major) 살짝 길게
  ;[523.25, 659.25, 783.99].forEach((freq) => {
    tone({ type: 'sine', freq, duration: 0.6, peak: 0.09, when: when + 0.48 })
  })
}

/** 실패 — 부드럽게 내려가는 저음(놀라지 않게 짧고 순하게). */
export function playFail(when = 0) {
  tone({ type: 'triangle', freq: 330, glide: 165, duration: 0.4, peak: 0.16, when })
  tone({ type: 'sine', freq: 220, glide: 110, duration: 0.5, peak: 0.1, when: when + 0.06 })
}
