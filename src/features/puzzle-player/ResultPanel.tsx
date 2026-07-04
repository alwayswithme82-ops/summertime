import type { Score, ValidationResult } from '../../core'

interface ResultPanelProps {
  result: ValidationResult | null
  score: Score | null
  /** 실패 후 계속 고치기(배너 닫기). */
  onDismiss?: () => void
  /** 성공 후 다음 문제로. 동작은 다음 단계에서 연결한다. */
  onNext?: () => void
}

/**
 * 실행 결과 배너. 성공은 초록, 실패는 빨강 계열(기존 --success/--danger).
 * 판정 자체는 core의 ValidationResult를 그대로 보여준다.
 */
export function ResultPanel({ result, score, onDismiss, onNext }: ResultPanelProps) {
  if (!result) return null

  // 제목("성공했어요!")과 겹치는 첫 메시지는 빼고, 만족한 조건만 보여준다.
  const checks = result.messages.filter((m) => m !== '성공했어요!')

  return (
    <div className={`result-banner ${result.success ? 'is-success' : 'is-fail'}`}>
      <div className="rb-body">
        <h3 className="rb-title">{result.success ? '성공했어요!' : '다시 해볼까요?'}</h3>
        {result.success ? (
          <ul className="rp-checks">
            {checks.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        ) : (
          <ul className="rp-reasons">
            {result.errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}
        {score && <p className="rp-score">점수: {score.total}점</p>}
      </div>

      <div className="rb-actions">
        {result.success ? (
          <button type="button" className="btn btn-primary" onClick={onNext}>
            다음 문제 →
          </button>
        ) : (
          <button type="button" className="btn btn-ghost" onClick={onDismiss}>
            계속 고치기
          </button>
        )}
      </div>
    </div>
  )
}
