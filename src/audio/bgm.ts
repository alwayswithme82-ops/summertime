import { getAudio } from './engine'

/**
 * 절차 합성 BGM. 오디오 파일 없이 오르골 느낌의 잔잔한 루프를 만든다.
 * - 'map'  : 시작화면(월드맵)·튜토리얼 — 느리고 몽글몽글한 C 펜타토닉
 * - 'play' : 플레이 화면 — 같은 색깔이지만 조금 더 걸음이 빠른 변주
 * 룩어헤드 스케줄러(240ms 간격, 0.7초 선예약)로 끊김 없이 루프한다.
 */

export type BgmTheme = 'map' | 'play'

/** 미디 번호 → 주파수. 0은 쉼표. */
function freqOf(midi: number): number {
  return 440 * 2 ** ((midi - 69) / 12)
}

interface ThemeDef {
  bpm: number
  /** 8분음표 32스텝 멜로디(미디 번호, 0=쉼표). */
  melody: number[]
  /** 8스텝(2박)마다 바뀌는 베이스 루트(미디 번호). */
  bass: number[]
}

// C 펜타토닉(C D E G A) — 평화롭고 틀린 음이 없는 음계.
const THEMES: Record<BgmTheme, ThemeDef> = {
  map: {
    bpm: 72,
    melody: [
      72, 0, 76, 0, 79, 0, 81, 0, 79, 0, 76, 0, 74, 0, 0, 0,
      76, 0, 79, 0, 84, 0, 81, 0, 79, 0, 76, 0, 72, 0, 0, 0,
    ],
    bass: [48, 45, 41, 43], // C3 A2 F2 G2
  },
  play: {
    bpm: 92,
    melody: [
      72, 0, 74, 76, 0, 79, 0, 81, 0, 79, 0, 76, 74, 0, 76, 0,
      72, 0, 74, 76, 0, 79, 0, 84, 0, 81, 0, 79, 76, 0, 74, 0,
    ],
    bass: [48, 45, 41, 43],
  },
}

let currentTheme: BgmTheme | null = null
let timer: number | null = null
let step = 0
let nextTime = 0

function scheduleNote(midi: number, when: number, duration: number, peak: number, type: OscillatorType) {
  const audio = getAudio()
  if (!audio) return
  const { ctx, music } = audio
  const osc = ctx.createOscillator()
  osc.type = type
  osc.frequency.value = freqOf(midi)
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, when)
  gain.gain.linearRampToValueAtTime(peak, when + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0006, when + duration)
  osc.connect(gain)
  gain.connect(music)
  osc.start(when)
  osc.stop(when + duration + 0.05)
}

function tick() {
  const audio = getAudio()
  if (!audio || !currentTheme) return
  const { ctx } = audio
  // 아직 사용자 입력 전(suspended)이라면 시계가 멈춰 있으니 예약을 미룬다.
  if (ctx.state !== 'running') {
    nextTime = ctx.currentTime + 0.1
    return
  }
  const def = THEMES[currentTheme]
  const stepDur = 60 / def.bpm / 2 // 8분음표 길이

  if (nextTime < ctx.currentTime) nextTime = ctx.currentTime + 0.05

  while (nextTime < ctx.currentTime + 0.7) {
    const i = step % def.melody.length
    const midi = def.melody[i]
    if (midi > 0) {
      // 멜로디: 오르골 톤(삼각파 + 옥타브 위 사인 살짝)
      scheduleNote(midi, nextTime, stepDur * 2.4, 0.11, 'triangle')
      scheduleNote(midi + 12, nextTime, stepDur * 1.4, 0.025, 'sine')
    }
    if (i % 8 === 0) {
      // 베이스 패드: 루트 + 5도, 2박 동안 지그시
      const root = def.bass[(i / 8) % def.bass.length]
      scheduleNote(root, nextTime, stepDur * 8, 0.05, 'sine')
      scheduleNote(root + 7, nextTime, stepDur * 8, 0.03, 'sine')
    }
    step += 1
    nextTime += stepDur
  }
}

/** 테마 BGM 시작. 같은 테마면 그대로 두고, 다른 테마면 갈아탄다. */
export function startBgm(theme: BgmTheme) {
  if (currentTheme === theme) return
  currentTheme = theme
  step = 0
  const audio = getAudio()
  if (audio) nextTime = audio.ctx.currentTime + 0.15
  if (timer === null) {
    timer = window.setInterval(tick, 240)
  }
}

export function stopBgm() {
  currentTheme = null
  if (timer !== null) {
    window.clearInterval(timer)
    timer = null
  }
}
