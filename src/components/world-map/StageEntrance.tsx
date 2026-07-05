import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import HintMascot from './HintMascot'
import './StageEntrance.css'

type Phase = 'travel' | 'type' | 'pause' | 'open' | 'enter' | 'flash'

/** 연출이 향할 대상(문)의 위치와 번호. StageDefinition 도 구조적으로 호환된다. */
export interface EntranceTarget {
  number: number
  x: number
  y: number
}

// 기본 대사 후보. {N} 은 단계 번호로 치환된다.
const LINES = [
  '좋아, {N}단계로 가보자!',
  '이번엔 어떤 문제일까?',
  '빛을 탈출시키러 가자!',
]

// 시퀀스 타이밍(ms). CSS transition 시간과 맞춰 둔다.
const CHAR_MS = 48
const PAUSE_MS = 380
const OPEN_LEAD_MS = 160
const ENTER_MS = 430
const FLASH_MS = 180

// 걷기(문 앞으로 이동) 타이밍. 순간이동처럼 보이지 않게 거리에 비례한 시간을 준다.
const START_X = 50 // 마스코트 시작 위치(지도 하단 중앙) — CSS --start 와 일치
const START_Y = 86
const NEAR_Y_OFFSET = 12 // 문 앞 정지 위치 = 문 y + 12% — CSS --near 와 일치
const STAGE_ASPECT = 16 / 9 // 가로 %를 세로 % 와 같은 시각 단위로 환산
const WALK_MS_PER_UNIT = 17 // 단위 거리당 걷는 시간 → 거리가 멀수록 오래 걷는다
const TRAVEL_MIN_MS = 800 // 가까운 문도 순식간에 도착하지 않게
const TRAVEL_MAX_MS = 1200

// 시작점에서 문 앞까지의 시각적 거리에 비례한 이동 시간(걷는 속도 일정).
function travelDuration(target: EntranceTarget): number {
  const dx = (target.x - START_X) * STAGE_ASPECT
  const dy = target.y + NEAR_Y_OFFSET - START_Y
  const distance = Math.hypot(dx, dy)
  return Math.round(
    Math.min(TRAVEL_MAX_MS, Math.max(TRAVEL_MIN_MS, distance * WALK_MS_PER_UNIT)),
  )
}

interface StageEntranceProps {
  stage: EntranceTarget
  /** 말풍선 대사 후보를 직접 지정(생략 시 단계용 기본 대사 사용). */
  lines?: string[]
  onOpenDoor: () => void
  onComplete: () => void
}

export default function StageEntrance({ stage, lines, onOpenDoor, onComplete }: StageEntranceProps) {
  const line = useMemo(() => {
    const pool = lines && lines.length > 0 ? lines : LINES
    const pick = pool[Math.floor(Math.random() * pool.length)]
    return pick.replace('{N}', String(stage.number))
  }, [stage.number, lines])

  const travelMs = useMemo(() => travelDuration(stage), [stage])

  const [phase, setPhase] = useState<Phase>('travel')
  const [moved, setMoved] = useState(false)
  const [typed, setTyped] = useState('')

  // 최신 콜백을 ref 로 잡아 시퀀스 effect 가 재시작되지 않게 한다.
  const onOpenDoorRef = useRef(onOpenDoor)
  const onCompleteRef = useRef(onComplete)
  onOpenDoorRef.current = onOpenDoor
  onCompleteRef.current = onComplete

  const finishRef = useRef<() => void>(() => {})

  // 마운트 다음 프레임에 목적지(문 근처)로 이동 → 통통 튀는 transition 발동.
  useEffect(() => {
    const id = requestAnimationFrame(() => setMoved(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    let done = false
    const timers: number[] = []
    const push = (fn: () => void, ms: number) => {
      timers.push(window.setTimeout(fn, ms))
    }

    const finish = () => {
      if (done) return
      done = true
      timers.forEach(window.clearTimeout)
      onCompleteRef.current()
    }
    finishRef.current = finish

    // 1) 이동이 끝나면 타이핑 시작
    push(() => {
      setPhase('type')
      for (let i = 1; i <= line.length; i += 1) {
        push(() => setTyped(line.slice(0, i)), i * CHAR_MS)
      }

      const typeEnd = line.length * CHAR_MS
      // 2) 타이핑 종료 → 잠깐 멈춤
      push(() => setPhase('pause'), typeEnd)
      // 3) 문 열림
      push(() => {
        setPhase('open')
        onOpenDoorRef.current()
      }, typeEnd + PAUSE_MS)
      // 4) 마스코트가 문으로 걸어 들어감(축소)
      push(() => setPhase('enter'), typeEnd + PAUSE_MS + OPEN_LEAD_MS)
      // 5) 빛 번짐
      push(() => setPhase('flash'), typeEnd + PAUSE_MS + OPEN_LEAD_MS + ENTER_MS)
      // 6) 전환
      push(finish, typeEnd + PAUSE_MS + OPEN_LEAD_MS + ENTER_MS + FLASH_MS)
    }, travelMs)

    return () => {
      done = true
      timers.forEach(window.clearTimeout)
    }
  }, [line, travelMs])

  const positionState =
    phase === 'enter' || phase === 'flash' ? 'in' : moved ? 'near' : 'start'
  const bubbleVisible = phase === 'type' || phase === 'pause' || phase === 'open'
  const bobbing = phase === 'travel' || phase === 'enter'

  const style = {
    '--door-x': `${stage.x}%`,
    '--door-y': `${stage.y}%`,
    '--travel-ms': `${travelMs}ms`,
  } as CSSProperties

  return (
    <div
      className="stage-entrance"
      style={style}
      onClick={() => finishRef.current()}
      role="presentation"
    >
      <div
        className={`stage-entrance__mascot stage-entrance__mascot--${positionState}`}
      >
        {bubbleVisible && (
          <span className="stage-entrance__bubble">
            <span className="stage-entrance__text">{typed}</span>
            <span className="stage-entrance__cursor" aria-hidden="true" />
          </span>
        )}
        <span
          className={`stage-entrance__bob${bobbing ? ' stage-entrance__bob--walk' : ''}`}
        >
          <HintMascot className="stage-entrance__character" />
        </span>
      </div>

      <div className={`stage-entrance__flash${phase === 'flash' ? ' stage-entrance__flash--on' : ''}`} />
    </div>
  )
}
