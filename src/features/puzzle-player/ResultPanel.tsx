import type { ValidationResult } from '../../core'

interface ResultPanelProps {
  result: ValidationResult | null
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
 * 실패 배너. 성공은 SuccessModal이 담당하므로 여기서는 실패만 가볍게 보여주고
 * 다시 시도를 유도한다. 판정 자체는 core의 ValidationResult를 그대로 따른다.
 */
export function ResultPanel({ result, onDismiss }: ResultPanelProps) {
  if (!result || result.success) return null

  return (
    <div className="result-banner is-fail">
      <div className="rb-body">
        <h3 className="rb-title">다시 해볼까요?</h3>
        <ul className="rp-reasons">
          {result.errors.map((e) => (
            <li key={e}>{withoutCoordinates(e)}</li>
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
