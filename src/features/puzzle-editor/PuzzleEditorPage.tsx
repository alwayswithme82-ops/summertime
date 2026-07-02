import { useMemo, useState } from 'react'
import type {
  Direction,
  EdgeSide,
  MirrorPlacementMode,
  Puzzle,
  PuzzleLevel,
} from '../../core'
import { BoardEditor } from './BoardEditor'
import { RuleEditor } from './RuleEditor'
import { ExportPuzzleJson } from './ExportPuzzleJson'
import './puzzle-editor.css'

export type EditMode = 'STAR' | 'FORBIDDEN' | 'ALLOWED' | 'ERASE'

export interface EditorState {
  title: string
  level: PuzzleLevel
  size: number // 정사각 보드: rows = cols = size
  entrySide: EdgeSide
  entryIndex: number
  entryDirection: Direction
  exitSide: EdgeSide
  exitIndex: number
  exitDirection: Direction
  maxMirrors: number
  mirrorPlacementMode: MirrorPlacementMode
  exactMirrorCount?: number
  slash?: number
  backslash?: number
  stars: string[]
  forbidden: string[]
  allowed: string[]
}

const INITIAL: EditorState = {
  title: '새 문제',
  level: 'NORMAL',
  size: 5,
  entrySide: 'LEFT',
  entryIndex: 1,
  entryDirection: 'RIGHT',
  exitSide: 'RIGHT',
  exitIndex: 1,
  exitDirection: 'RIGHT',
  maxMirrors: 6,
  mirrorPlacementMode: 'ANY_EMPTY',
  stars: [],
  forbidden: [],
  allowed: [],
}

/** state로부터 Puzzle 객체를 만든다 (Puzzle 타입과 일치). */
function buildPuzzle(s: EditorState): Puzzle {
  const marked = s.mirrorPlacementMode === 'MARKED_ONLY'
  const requiredMirrorCounts =
    s.slash !== undefined || s.backslash !== undefined
      ? { slash: s.slash, backslash: s.backslash }
      : undefined
  return {
    id: s.title.trim() ? s.title.trim().replace(/\s+/g, '-').toLowerCase() : 'custom',
    title: s.title,
    level: s.level,
    rows: s.size,
    cols: s.size,
    entry: { side: s.entrySide, index: s.entryIndex, direction: s.entryDirection },
    exit: { side: s.exitSide, index: s.exitIndex, direction: s.exitDirection },
    stars: [...s.stars],
    forbiddenCells: [...s.forbidden],
    ...(marked ? { allowedMirrorCells: [...s.allowed] } : {}),
    rule: {
      requiredStars: [...s.stars],
      forbiddenCells: [...s.forbidden],
      ...(marked ? { allowedMirrorCells: [...s.allowed] } : {}),
      mirrorPlacementMode: s.mirrorPlacementMode,
      maxMirrors: s.maxMirrors,
      ...(s.exactMirrorCount !== undefined ? { exactMirrorCount: s.exactMirrorCount } : {}),
      ...(requiredMirrorCounts ? { requiredMirrorCounts } : {}),
    },
  }
}

/** 교사용 문제 제작기 (1차). 보드/조건을 설정하고 Puzzle JSON을 만든다. */
export function PuzzleEditorPage() {
  const [state, setState] = useState<EditorState>(INITIAL)
  const [editMode, setEditMode] = useState<EditMode>('STAR')

  const patch = (p: Partial<EditorState>) => setState((prev) => ({ ...prev, ...p }))

  const puzzle = useMemo(() => buildPuzzle(state), [state])

  function handleCellClick(cell: string) {
    setState((prev) => {
      // 한 칸은 하나의 역할만 가지므로 먼저 세 목록에서 모두 제거한다.
      const stars = prev.stars.filter((c) => c !== cell)
      const forbidden = prev.forbidden.filter((c) => c !== cell)
      const allowed = prev.allowed.filter((c) => c !== cell)
      const base = { ...prev, stars, forbidden, allowed }
      // 지우기이거나, 같은 모드로 이미 있던 칸을 다시 누르면(토글) 제거 상태로 둔다.
      switch (editMode) {
        case 'ERASE':
          return base
        case 'STAR':
          return prev.stars.includes(cell) ? base : { ...base, stars: [...stars, cell] }
        case 'FORBIDDEN':
          return prev.forbidden.includes(cell) ? base : { ...base, forbidden: [...forbidden, cell] }
        case 'ALLOWED':
          return prev.allowed.includes(cell) ? base : { ...base, allowed: [...allowed, cell] }
      }
    })
  }

  return (
    <div className="editor-page">
      <header>
        <h1>문제 제작기</h1>
        <p className="ed-hint">보드를 클릭해 요소를 배치하고, 조건을 입력한 뒤 JSON을 확인하세요.</p>
      </header>

      <div className="ed-layout">
        <section className="ed-board-col">
          <div className="ed-modes">
            {(
              [
                ['STAR', '⭐ 별 추가'],
                ['FORBIDDEN', '✕ 금지칸 추가'],
                ['ALLOWED', '△ 허용 거울칸'],
                ['ERASE', '지우기'],
              ] as [EditMode, string][]
            ).map(([mode, label]) => (
              <button
                key={mode}
                type="button"
                className={`btn${editMode === mode ? ' btn-primary' : ' btn-ghost'}`}
                onClick={() => setEditMode(mode)}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="ed-size">
            보드 크기:
            {[4, 5, 7].map((n) => (
              <button
                key={n}
                type="button"
                className={`btn${state.size === n ? ' btn-primary' : ' btn-ghost'}`}
                onClick={() => patch({ size: n, stars: [], forbidden: [], allowed: [] })}
              >
                {n}x{n}
              </button>
            ))}
          </div>

          <BoardEditor
            size={state.size}
            stars={state.stars}
            forbidden={state.forbidden}
            allowed={state.allowed}
            onCellClick={handleCellClick}
          />
        </section>

        <section className="ed-form-col">
          <RuleEditor state={state} onChange={patch} />
          <ExportPuzzleJson puzzle={puzzle} />
        </section>
      </div>
    </div>
  )
}
