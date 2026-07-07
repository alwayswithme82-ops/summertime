import type { Direction, EdgeSide, Puzzle } from '../../core'
import { MirrorIcon } from '../../components/MirrorIcon'

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

interface GoalPanelProps {
  puzzle: Puzzle
  mirrorsUsed: number
  /** 마지막 실행에서 지난 별 개수 — 실행 전/초기화 시 0. */
  passedStars: number
  onShowSample?: () => void
}

/**
 * 문제 조건 패널. 모달과 달리 풀이 내내 보드 옆에 떠 있어서
 * 아이가 조건을 외우지 않아도 언제든 다시 확인할 수 있다.
 * 별/거울 개수는 현재 상태를 따라 실시간으로 바뀐다.
 */
export function GoalPanel({ puzzle, mirrorsUsed, passedStars, onShowSample }: GoalPanelProps) {
  const { rule } = puzzle
  const totalStars = rule.requiredStars.length
  const mirrorLimit = rule.exactMirrorCount ?? rule.maxMirrors

  return (
    <aside className="goal-panel" aria-label="문제 조건">
      <h2 className="gp-title">문제 조건</h2>
      {puzzle.description && <p className="gp-desc">{withoutCoordinates(puzzle.description)}</p>}

      <ul className="gp-goals">
        <li className={passedStars === totalStars && totalStars > 0 ? 'is-done' : ''}>
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
        <li>
          거울 {mirrorLimit}개{rule.exactMirrorCount ? ' 정확히' : ' 이하'} 쓰기
          <span className="gp-count">
            {mirrorsUsed}/{mirrorLimit}
          </span>
        </li>
        {rule.requiredMirrorCounts && (
          <li className="gp-mirror-counts">
            거울 종류:
            <MirrorIcon type="/" size={16} /> {rule.requiredMirrorCounts.slash ?? 0}개,
            <MirrorIcon type={'\\'} size={16} /> {rule.requiredMirrorCounts.backslash ?? 0}개
          </li>
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
