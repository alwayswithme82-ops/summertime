import type { CSSProperties } from 'react'
import type { Puzzle } from '../../core'
import { samplePuzzles } from '../../data/samplePuzzles'
import './puzzle-library.css'

interface PuzzleListPageProps {
  onSelect: (puzzle: Puzzle) => void
}

const CLEARED_STORAGE_KEY = 'cleared_puzzle_ids'

/** public 에셋(절대 URL). */
const WORLDMAP_BG = '/assets/world-map/bg-world-map.png'

/** 난이도(쉬운→어려운) 순서. 1=p4 2=p1 3=p2 4=p3 5=p5 */
const PUZZLE_ORDER = ['p4', 'p1', 'p2', 'p3', 'p5']

const IMG_W = 1672
const IMG_H = 941

/** 배경 흙길 흐름에 맞춘 배지 위치(스테이지 대비 %). 강·나무 위에 겹치지 않게. */
const NODE_POS = [
  { x: 13, y: 70 }, // 1 왼쪽 아래 길
  { x: 30, y: 52 }, // 2 왼쪽 언덕 길
  { x: 50, y: 43 }, // 3 가운데 위 (강조)
  { x: 68, y: 62 }, // 4 오른쪽 아래 (다리 건넌 길)
  { x: 86, y: 50 }, // 5 오른쪽 위 (성 가는 길)
]

type DifficultyKey = 'basic' | 'normal' | 'large'

/** 보드 크기로 난이도를 정한다: 4×4=기초, 5×5=보통, 7×7=대형. */
function difficultyOf(puzzle: Puzzle): { key: DifficultyKey; label: string } {
  const size = Math.max(puzzle.rows, puzzle.cols)
  if (size <= 4) return { key: 'basic', label: '기초' }
  if (size >= 7) return { key: 'large', label: '대형' }
  return { key: 'normal', label: '보통' }
}

function readClearedIds(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(CLEARED_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((id) => typeof id === 'string') : []
  } catch {
    return []
  }
}

function orderPuzzles(puzzles: Puzzle[]): Puzzle[] {
  const byId = new Map(puzzles.map((p) => [p.id, p]))
  const ordered = PUZZLE_ORDER.map((id) => byId.get(id)).filter(
    (p): p is Puzzle => p !== undefined,
  )
  const rest = puzzles.filter((p) => !PUZZLE_ORDER.includes(p.id))
  return [...ordered, ...rest]
}

/** Catmull-Rom 스플라인으로 배지들을 잇는 부드러운 물결 경로. */
function smoothPath(points: Array<[number, number]>): string {
  if (points.length < 2) return ''
  const d = [`M ${points[0][0]} ${points[0][1]}`]
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]
    const p1 = points[i]
    const p2 = points[i + 1]
    const p3 = points[i + 2] ?? points[i + 1]
    const c1x = p1[0] + (p2[0] - p0[0]) / 6
    const c1y = p1[1] + (p2[1] - p0[1]) / 6
    const c2x = p2[0] - (p3[0] - p1[0]) / 6
    const c2y = p2[1] - (p3[1] - p1[1]) / 6
    d.push(`C ${c1x} ${c1y} ${c2x} ${c2y} ${p2[0]} ${p2[1]}`)
  }
  return d.join(' ')
}

function SmileFace() {
  return (
    <svg className="wm-face" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="8.5" cy="10" r="1.6" />
      <circle cx="15.5" cy="10" r="1.6" />
      <path d="M8 14.5 Q12 18.5 16 14.5" fill="none" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function StarIcon({ className = 'wm-star' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.5 L14.8 9 L21.5 9.4 L16.3 13.7 L18.1 20.2 L12 16.4 L5.9 20.2 L7.7 13.7 L2.5 9.4 L9.2 9 Z" />
    </svg>
  )
}

function LensIcon() {
  return (
    <svg className="wm-lens" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10" cy="10" r="6.4" fill="rgba(210, 240, 255, 0.9)" stroke="#e7b64a" strokeWidth="2.2" />
      <path d="M10 5.5 A4.5 4.5 0 0 1 14.5 10" fill="none" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" opacity="0.9" />
      <path d="M14.8 14.8 L21 21" stroke="#a86b2a" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  )
}

interface WorldNodeProps {
  stage: number
  state: 'cleared' | 'recommended' | 'todo'
  difficulty: { key: DifficultyKey; label: string }
  stars: number
  x: number
  y: number
  onClick: () => void
}

const STATE_WORD: Record<WorldNodeProps['state'], string> = {
  cleared: '완료',
  recommended: '추천',
  todo: '도전',
}

function WorldNode({ stage, state, difficulty, stars, x, y, onClick }: WorldNodeProps) {
  const style = { left: `${x}%`, top: `${y}%` } as CSSProperties
  return (
    <button
      type="button"
      className={`wm-node wm-node-${state}`}
      style={style}
      onClick={onClick}
      aria-label={`${stage}단계, 난이도 ${difficulty.label}, 별 ${stars}개, ${STATE_WORD[state]}`}
    >
      <span className="wm-node-base" aria-hidden="true" />
      <span className="wm-badge">
        {state === 'cleared' && (
          <span className="wm-deco wm-deco-star" aria-hidden="true">
            <StarIcon />
          </span>
        )}
        {state === 'recommended' && (
          <span className="wm-deco wm-deco-lens" aria-hidden="true">
            <LensIcon />
          </span>
        )}
        <span className="wm-num">{stage}</span>
        <SmileFace />
      </span>
      <span className="wm-labels">
        <span className={`wm-diff wm-diff-${difficulty.key}`}>{difficulty.label}</span>
        <span className="wm-goal">
          <StarIcon className="wm-goal-star" />
          {stars}
        </span>
      </span>
    </button>
  )
}

export function PuzzleListPage({ onSelect }: PuzzleListPageProps) {
  const clearedIds = readClearedIds()
  const puzzles = orderPuzzles(samplePuzzles)
  // 추천 단계 = 안 깬 것 중 최저 번호.
  const recommendedIndex = puzzles.findIndex((p) => !clearedIds.includes(p.id))

  const points = puzzles.map(
    (_, i) => [(NODE_POS[i].x / 100) * IMG_W, (NODE_POS[i].y / 100) * IMG_H] as [number, number],
  )
  const brightEnd = recommendedIndex === -1 ? points.length : recommendedIndex + 1
  const brightPath = smoothPath(points.slice(0, brightEnd))
  const dimPath = recommendedIndex === -1 ? '' : smoothPath(points.slice(recommendedIndex))

  const stageStyle = { '--wm-bg': `url(${WORLDMAP_BG})` } as CSSProperties

  function stateOf(index: number): WorldNodeProps['state'] {
    if (clearedIds.includes(puzzles[index].id)) return 'cleared'
    if (index === recommendedIndex) return 'recommended'
    return 'todo'
  }

  return (
    <div className="worldmap" style={stageStyle}>
      <div className="wm-stage">
        <header className="wm-titles">
          <h1 className="wm-title">거울을 설치해 빛을 탈출시켜라!</h1>
          <p className="wm-subtitle">길을 따라 단계를 하나씩 정복해요!</p>
        </header>

        <svg
          className="wm-path"
          viewBox={`0 0 ${IMG_W} ${IMG_H}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {dimPath && <path className="wm-path-dim" d={dimPath} />}
          {brightPath && <path className="wm-path-bright" d={brightPath} />}
        </svg>

        {puzzles.map((puzzle, index) => (
          <WorldNode
            key={puzzle.id}
            stage={index + 1}
            state={stateOf(index)}
            difficulty={difficultyOf(puzzle)}
            stars={puzzle.rule.requiredStars.length}
            x={NODE_POS[index].x}
            y={NODE_POS[index].y}
            onClick={() => onSelect(puzzle)}
          />
        ))}
      </div>
    </div>
  )
}
