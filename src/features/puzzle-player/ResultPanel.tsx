import type { Puzzle, ValidationResult } from '../../core'

interface ResultPanelProps {
  result: ValidationResult | null
  /** 문구를 문제 성격(빛나는 칸/개수 제약)에 맞춰 다듬기 위해 받는다. */
  puzzle: Puzzle
  /** 실패 후 계속 고치기(배너 닫기). */
  onDismiss?: () => void
}

/**
 * core 메시지 끝의 좌표 나열(": A1, B2")을 떼어낸다.
 * 아이들은 좌표를 모르므로 빛 색(빨강)이 어디가 문제인지 보여주는 역할을 대신한다.
 * core 데이터는 그대로 두고 표시 텍스트만 다듬는다.
 */
function withoutCoordinates(message: string): string {
  return message.replace(/:\s*[A-Z]+\d+(\s*,\s*[A-Z]+\d+)*/g, '').trim()
}

/**
 * core의 판정 메시지를 화면 표현에 맞게 다듬는다(판정 로직은 그대로).
 * 조건 패널·팔레트와 같은 말투("모두 사용", "빛나는 칸")로 통일한다.
 */
function friendlyError(message: string, puzzle: Puzzle): string {
  const text = withoutCoordinates(message)
  const markedOnly = puzzle.rule.mirrorPlacementMode === 'MARKED_ONLY'

  const exact = text.match(/^거울을 정확히 (\d+)개/)
  if (exact) return `거울 ${exact[1]}개를 모두 사용해야 해요`

  const max = text.match(/^거울을 (\d+)개 이하/)
  if (max) return `거울은 ${max[1]}개까지만 쓸 수 있어요`

  const slash = text.match(/^'\/' 거울을 (\d+)개/)
  if (slash) return `／ 거울 ${slash[1]}개를 사용해야 해요`

  const backslash = text.match(/^'\\' 거울을 (\d+)개/)
  if (backslash) return `＼ 거울 ${backslash[1]}개를 사용해야 해요`

  if (text.startsWith('거울을 놓을 수 없는 칸')) {
    return markedOnly
      ? '빛나는 칸이 아닌 곳에 거울이 있어요'
      : '거울을 놓을 수 없는 칸에 거울이 있어요'
  }

  if (text.startsWith('금지칸을 지나갔어요')) return '빛이 ✕ 금지칸을 지나갔어요'
  if (text.startsWith('정해진 출구')) return '정해진 출구로 나가지 못했어요'

  if (text.startsWith('아직 지나지 않은 별')) {
    // 좌표를 떼기 전 원문에서 별 개수를 세어 "몇 개 남았는지"로 바꿔 준다.
    const missed = (message.match(/[A-Z]+\d+/g) ?? []).length
    return missed > 0 ? `아직 지나지 않은 별이 ${missed}개 있어요` : '아직 지나지 않은 별이 있어요'
  }

  if (text.startsWith('빛이 같은 곳을')) {
    return '빛이 같은 곳을 빙글빙글 돌고 있어요 — 거울 방향을 바꿔 볼까요?'
  }

  // 다듬지 못한 메시지도 마침표만 정리해 말투를 맞춘다.
  return text.replace(/\.$/, '')
}

function mirrorCompositionError(errors: string[], puzzle: Puzzle): string | null {
  const required = puzzle.rule.requiredMirrorCounts
  if (!required) return null

  const hasMirrorTypeError = errors.some((e) => /^'[/\\]' 거울을 \d+개/.test(e))
  if (!hasMirrorTypeError) return null

  const parts: string[] = []
  if (required.slash != null) parts.push(`／ 거울 ${required.slash}개`)
  if (required.backslash != null) parts.push(`＼ 거울 ${required.backslash}개`)

  return parts.length > 0 ? `${parts.join(', ')}를 사용해야 해요` : null
}

/**
 * 케이스별 중복 정리 후 다듬은 문구 목록을 만든다.
 * 정확히 N개 조건이 있는 문제에서는 'N개 이하' 안내가 같은 얘기의 반복이라 뺀다.
 */
function friendlyErrors(result: ValidationResult, puzzle: Puzzle): string[] {
  let errors = result.errors
  if (puzzle.rule.exactMirrorCount != null) {
    errors = errors.filter((e) => !/개 이하로 사용/.test(e))
  }

  const composition = mirrorCompositionError(errors, puzzle)
  if (composition) {
    errors = errors.filter((e) => !/^'[/\\]' 거울을 \d+개/.test(e))
  }

  const messages = errors.map((e) => friendlyError(e, puzzle))
  if (composition) messages.push(composition)
  return messages
}

/**
 * 실패 배너. 성공은 SuccessModal이 담당하므로 여기서는 실패만 가볍게 보여주고
 * 다시 시도를 유도한다. 판정 자체는 core의 ValidationResult를 그대로 따른다.
 */
export function ResultPanel({ result, puzzle, onDismiss }: ResultPanelProps) {
  if (!result || result.success) return null

  return (
    <div className="result-banner is-fail">
      <div className="rb-body">
        <h3 className="rb-title">다시 해볼까요?</h3>
        <ul className="rp-reasons">
          {friendlyErrors(result, puzzle).map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
        <p className="rb-tip">빨간 빛을 따라가면 어디서 막혔는지 보여요</p>
      </div>

      <div className="rb-actions">
        <button type="button" className="btn btn-ghost" onClick={onDismiss}>
          계속 고치기
        </button>
      </div>
    </div>
  )
}
