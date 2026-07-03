import type { Score, ValidationResult } from '../../core'

interface ResultPanelProps {
  result: ValidationResult | null
  score: Score | null
}

/** 판정 결과/실패 이유 표시. core의 ValidationResult를 그대로 보여준다. */
export function ResultPanel({ result, score }: ResultPanelProps) {
  if (!result) {
    return (
      <div className="panel result-panel is-empty">
        <p>거울을 놓고 <b>실행하기</b>를 눌러 확인해요.</p>
      </div>
    )
  }

  const pathText = result.simulation.path.map((s) => s.cell).join(' → ')
  // 제목("성공했어요!")과 겹치는 첫 메시지는 빼고, 만족한 조건만 체크 목록으로 보여준다.
  const checks = result.messages.filter((m) => m !== '성공했어요!')

  return (
    <div className={`panel result-panel ${result.success ? 'is-success' : 'is-fail'}`}>
      {result.success ? (
        <>
          <h3 className="rp-result-title">성공했어요!</h3>
          <ul className="rp-checks">
            {checks.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h3 className="rp-result-title">다시 해볼까요?</h3>
          <ul className="rp-reasons">
            {result.errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </>
      )}
      {score && <p className="rp-score">점수: {score.total}점</p>}

      {pathText && (
        <details className="rp-path">
          <summary>빛이 지나간 길 보기</summary>
          <p>{pathText}</p>
        </details>
      )}
    </div>
  )
}
