import type { Direction, EdgeSide, MirrorType, PlacedMirrors, Puzzle } from '../../core'
import { MirrorIcon } from '../../components/MirrorIcon'
import { isCountFocused } from './puzzleFocus'

const SIDE_LABEL: Record<EdgeSide, string> = {
  TOP: '위쪽',
  BOTTOM: '아래쪽',
  LEFT: '왼쪽',
  RIGHT: '오른쪽',
}

const DIR_WORD: Record<Direction, string> = {
  UP: '위로',
  DOWN: '아래로',
  LEFT: '왼쪽으로',
  RIGHT: '오른쪽으로',
}

/**
 * 문제 설명 속 좌표 표현("E열", "3행")을 떼어낸 표시용 문구.
 * 입구/출구 위치는 보드의 화살표 마커가 직접 보여주므로 글에서는 방향만 말한다.
 * core 데이터는 그대로 두고 화면에 보이는 텍스트만 다듬는다.
 */
export function withoutCoordinates(text: string): string {
  return text
    .replace(/[A-Z]+열\s*/g, '')
    .replace(/\d+행\s*/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

/** 종류별 남은 개수 안내 한 줄. 넘게 놓으면 경고 색으로 바뀐다. */
function MirrorCountGoal({
  type,
  required,
  used,
}: {
  type: MirrorType
  required: number
  used: number
}) {
  const remaining = required - used
  const over = remaining < 0
  return (
    <li className={`gp-mirror-count${over ? ' is-over' : ''}`}>
      <MirrorIcon type={type} size={16} />
      {over
        ? `${required}개보다 ${-remaining}개 많아요!`
        : `${required}개 중 ${remaining}개 남음`}
    </li>
  )
}

interface GoalPanelProps {
  puzzle: Puzzle
  /** 지금 놓여 있는 거울들 — 개수 중심 문제에서 남은 개수 계산에 쓴다. */
  placedMirrors: PlacedMirrors
  /** 마지막 실행에서 지난 별 개수 — 실행 전/초기화 시 0. */
  passedStars: number
  onShowSample?: () => void
}

/**
 * 문제 조건 패널. 모달과 달리 풀이 내내 보드 옆에 떠 있어서
 * 아이가 조건을 외우지 않아도 언제든 다시 확인할 수 있다.
 *
 * 문제 성격(puzzleFocus)에 따라 다르게 보여준다:
 * - 위치 중심: 개수 문구 없이 "빛나는 칸에만 놓을 수 있어요"를 부각
 * - 개수 중심: 거울 카운터와 종류별 남은 개수를 또렷하게
 */
export function GoalPanel({ puzzle, placedMirrors, passedStars, onShowSample }: GoalPanelProps) {
  const { rule } = puzzle
  const totalStars = rule.requiredStars.length
  const countFocused = isCountFocused(rule)

  const mirrors = Object.values(placedMirrors)
  const mirrorsUsed = mirrors.length
  const slashUsed = mirrors.filter((m) => m === '/').length
  const backslashUsed = mirrorsUsed - slashUsed
  const mirrorTarget = rule.exactMirrorCount ?? rule.maxMirrors

  return (
    <aside className="goal-panel" aria-label="문제 조건">
      <h2 className="gp-title">문제 조건</h2>
      {puzzle.description && <p className="gp-desc">{withoutCoordinates(puzzle.description)}</p>}

      <ul className="gp-goals">
        <li>
          별 {totalStars}개 모두 지나기
          <span className="gp-count">
            {passedStars}/{totalStars}
          </span>
        </li>
        {rule.forbiddenCells.length > 0 && <li>✕ 금지칸 지나지 않기</li>}
        <li>
          입구: {SIDE_LABEL[puzzle.entry.side]}에서 {DIR_WORD[puzzle.entry.direction]} 시작
        </li>
        <li>출구: {SIDE_LABEL[puzzle.exit.side]} 출구로 나가기</li>

        {countFocused ? (
          <>
            <li>
              거울 {rule.exactMirrorCount ? `딱 ${mirrorTarget}개` : `${mirrorTarget}개 이하`} 쓰기
              <span className="gp-count">
                {mirrorsUsed}/{mirrorTarget}
              </span>
            </li>
            {rule.requiredMirrorCounts?.slash != null && (
              <MirrorCountGoal type="/" required={rule.requiredMirrorCounts.slash} used={slashUsed} />
            )}
            {rule.requiredMirrorCounts?.backslash != null && (
              <MirrorCountGoal
                type={'\\'}
                required={rule.requiredMirrorCounts.backslash}
                used={backslashUsed}
              />
            )}
          </>
        ) : (
          rule.mirrorPlacementMode === 'MARKED_ONLY' && (
            <li className="gp-marked">빛나는 칸에만 거울을 놓을 수 있어요</li>
          )
        )}
      </ul>

      {onShowSample && (
        <button type="button" className="btn btn-ghost gp-sample" onClick={onShowSample}>
          예시 정답 보기
        </button>
      )}
    </aside>
  )
}
