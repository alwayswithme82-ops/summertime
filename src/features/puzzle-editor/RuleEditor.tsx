import type { Direction, EdgeSide, MirrorPlacementMode, PuzzleLevel } from '../../core'
import type { EditorState } from './PuzzleEditorPage'

interface RuleEditorProps {
  state: EditorState
  onChange: (patch: Partial<EditorState>) => void
}

const SIDES: EdgeSide[] = ['TOP', 'RIGHT', 'BOTTOM', 'LEFT']
const DIRS: Direction[] = ['UP', 'RIGHT', 'DOWN', 'LEFT']
const LEVELS: PuzzleLevel[] = ['BASIC', 'NORMAL', 'HARD', 'LARGE']
const MODES: MirrorPlacementMode[] = ['ANY_EMPTY', 'MARKED_ONLY']
const SIDE_LABEL: Record<EdgeSide, string> = {
  TOP: '위쪽',
  RIGHT: '오른쪽',
  BOTTOM: '아래쪽',
  LEFT: '왼쪽',
}
const DIRECTION_LABEL: Record<Direction, string> = {
  UP: '위로',
  RIGHT: '오른쪽으로',
  DOWN: '아래로',
  LEFT: '왼쪽으로',
}
const LEVEL_LABEL: Record<PuzzleLevel, string> = {
  BASIC: '기초',
  NORMAL: '보통',
  HARD: '어려움',
  LARGE: '대형',
}
const MODE_LABEL: Record<MirrorPlacementMode, string> = {
  ANY_EMPTY: '모든 빈 칸',
  MARKED_ONLY: '표시된 칸만',
}

/** optional 숫자 입력: 빈 값이면 undefined. */
function toOptionalNumber(v: string): number | undefined {
  return v.trim() === '' ? undefined : Number(v)
}

/** 문제 조건 입력 폼. */
export function RuleEditor({ state, onChange }: RuleEditorProps) {
  return (
    <div className="rule-editor">
      <h3>조건 입력</h3>

      <label className="re-field">
        <span>제목</span>
        <input value={state.title} onChange={(e) => onChange({ title: e.target.value })} />
      </label>

      <label className="re-field">
        <span>난이도</span>
        <select
          value={state.level}
          onChange={(e) => onChange({ level: e.target.value as PuzzleLevel })}
        >
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {LEVEL_LABEL[l]}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="re-group">
        <legend>입구</legend>
        <select
          value={state.entrySide}
          onChange={(e) => onChange({ entrySide: e.target.value as EdgeSide })}
        >
          {SIDES.map((s) => (
            <option key={s} value={s}>
              {SIDE_LABEL[s]}
            </option>
          ))}
        </select>
        <input
          type="number"
          min={1}
          value={state.entryIndex}
          onChange={(e) => onChange({ entryIndex: Number(e.target.value) })}
        />
        <select
          value={state.entryDirection}
          onChange={(e) => onChange({ entryDirection: e.target.value as Direction })}
        >
          {DIRS.map((d) => (
            <option key={d} value={d}>
              {DIRECTION_LABEL[d]}
            </option>
          ))}
        </select>
      </fieldset>

      <fieldset className="re-group">
        <legend>출구</legend>
        <select
          value={state.exitSide}
          onChange={(e) => onChange({ exitSide: e.target.value as EdgeSide })}
        >
          {SIDES.map((s) => (
            <option key={s} value={s}>
              {SIDE_LABEL[s]}
            </option>
          ))}
        </select>
        <input
          type="number"
          min={1}
          value={state.exitIndex}
          onChange={(e) => onChange({ exitIndex: Number(e.target.value) })}
        />
        <select
          value={state.exitDirection}
          onChange={(e) => onChange({ exitDirection: e.target.value as Direction })}
        >
          {DIRS.map((d) => (
            <option key={d} value={d}>
              {DIRECTION_LABEL[d]}
            </option>
          ))}
        </select>
      </fieldset>

      <label className="re-field">
        <span>거울 최대 개수</span>
        <input
          type="number"
          min={0}
          value={state.maxMirrors}
          onChange={(e) => onChange({ maxMirrors: Number(e.target.value) })}
        />
      </label>

      <label className="re-field">
        <span>배치 모드</span>
        <select
          value={state.mirrorPlacementMode}
          onChange={(e) => onChange({ mirrorPlacementMode: e.target.value as MirrorPlacementMode })}
        >
          {MODES.map((m) => (
            <option key={m} value={m}>
              {MODE_LABEL[m]}
            </option>
          ))}
        </select>
      </label>

      <label className="re-field">
        <span>거울 정확한 개수 (선택)</span>
        <input
          type="number"
          min={0}
          value={state.exactMirrorCount ?? ''}
          onChange={(e) => onChange({ exactMirrorCount: toOptionalNumber(e.target.value) })}
        />
      </label>

      <label className="re-field">
        <span>/ 거울 개수 (선택)</span>
        <input
          type="number"
          min={0}
          value={state.slash ?? ''}
          onChange={(e) => onChange({ slash: toOptionalNumber(e.target.value) })}
        />
      </label>

      <label className="re-field">
        <span>\ 거울 개수 (선택)</span>
        <input
          type="number"
          min={0}
          value={state.backslash ?? ''}
          onChange={(e) => onChange({ backslash: toOptionalNumber(e.target.value) })}
        />
      </label>
    </div>
  )
}
