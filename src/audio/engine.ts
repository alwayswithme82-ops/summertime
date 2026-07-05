/**
 * Web Audio 공용 엔진. 오디오 파일 없이 모든 소리를 합성한다.
 * - master → 음소거 토글(localStorage 유지)
 * - musicBus → BGM 전용(낮은 볼륨 + 로우패스로 부드럽게)
 * - sfxBus → 효과음 전용
 * 브라우저 자동재생 정책 때문에 첫 사용자 입력(클릭/키)에서 컨텍스트를 깨운다.
 */

const MUTE_KEY = 'sound_muted'

let ctx: AudioContext | null = null
let master: GainNode | null = null
let musicBus: GainNode | null = null
let sfxBus: GainNode | null = null

export function isMuted(): boolean {
  try {
    return window.localStorage.getItem(MUTE_KEY) === '1'
  } catch {
    return false
  }
}

export function setMuted(muted: boolean) {
  try {
    if (muted) window.localStorage.setItem(MUTE_KEY, '1')
    else window.localStorage.removeItem(MUTE_KEY)
  } catch {
    /* 저장 실패는 무시 */
  }
  if (master && ctx) {
    master.gain.setTargetAtTime(muted ? 0 : 1, ctx.currentTime, 0.02)
  }
}

/** AudioContext를 (없으면 만들고) 돌려준다. 미지원 브라우저면 null. */
export function getAudio(): { ctx: AudioContext; music: GainNode; sfx: GainNode } | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctor = window.AudioContext
    if (!Ctor) return null
    ctx = new Ctor()

    master = ctx.createGain()
    master.gain.value = isMuted() ? 0 : 1
    master.connect(ctx.destination)

    // BGM은 로우패스를 거쳐 멀리서 들리는 오르골처럼 부드럽게.
    const soften = ctx.createBiquadFilter()
    soften.type = 'lowpass'
    soften.frequency.value = 2600
    soften.connect(master)

    musicBus = ctx.createGain()
    musicBus.gain.value = 0.5
    musicBus.connect(soften)

    sfxBus = ctx.createGain()
    sfxBus.gain.value = 0.9
    sfxBus.connect(master)
  }
  return { ctx, music: musicBus!, sfx: sfxBus! }
}

let unlockInstalled = false

/** 첫 클릭/키 입력에서 오디오 컨텍스트를 깨운다(자동재생 정책 대응). 한 번만 설치. */
export function unlockAudioOnFirstGesture() {
  if (unlockInstalled || typeof window === 'undefined') return
  unlockInstalled = true
  const unlock = () => {
    const audio = getAudio()
    if (audio && audio.ctx.state === 'suspended') {
      void audio.ctx.resume()
    }
    window.removeEventListener('pointerdown', unlock)
    window.removeEventListener('keydown', unlock)
  }
  window.addEventListener('pointerdown', unlock)
  window.addEventListener('keydown', unlock)
}
