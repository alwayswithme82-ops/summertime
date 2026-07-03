import type { Score, ValidationResult } from '../../core'

interface ResultPanelProps {
  result: ValidationResult | null
  score: Score | null
}

/** 판정 결과/실패 이유 표시. core의 ValidationResult를 그대로 보여준다. */
export function ResultPanel({ result, score }: ResultPanelProps) {
  if (!result) {
    return (
      <div className="result-panel is-empty">
        <p>거울을 놓고 <b>실행하기</b>를 눌러 확인해요.</p>
      </div>
    )
  }

  const pathText = result.simulation.path.map((s) => s.cell).join(' → ')

  return (
    <div className={`result-panel ${result.success ? 'is-success' : 'is-fail'}`}>
      {result.success ? (
        <>
          <h3 className="rp-result-title">성공!</h3>
          <ul>
            {result.messages.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h3 className="rp-result-title">다시 해볼까요?</h3>
          <ul>
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
