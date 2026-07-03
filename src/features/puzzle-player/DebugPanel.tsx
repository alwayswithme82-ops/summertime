import { useState } from 'react'
import type { PlacedMirrors, ValidationResult } from '../../core'

interface DebugPanelProps {
  placedMirrors: PlacedMirrors
  /** validateSolution 결과. simulation을 포함한다. 아직 실행 전이면 null. */
  result: ValidationResult | null
}

/** 값을 보기 좋은 JSON 문자열로. */
function pretty(value: unknown): string {
  return JSON.stringify(value, null, 2)
}

/**
 * 개발 검수용 디버그 패널.
 *
 * 학생용 정식 화면에는 들어가지 않는 별도 컴포넌트로, 나중에 쉽게 숨기거나
 * 제거할 수 있도록 분리해 둔다. 기본적으로 접혀 있으며 버튼으로 펼친다.
 */
export function DebugPanel({ placedMirrors, result }: DebugPanelProps) {
  const [open, setOpen] = useState(false)

  const sim = result?.simulation ?? null

  return (
    <section className="debug-panel">
      <button
        type="button"
        className="dbg-toggle"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? '개발자 검수 정보 닫기' : '개발자 검수 정보 보기'}
      </button>

      {open && (
        <div className="dbg-body">
          <DebugSection title="placedMirrors">
            <pre>{pretty(placedMirrors)}</pre>
          </DebugSection>

          {sim ? (
            <>
              <DebugSection title="simulationResult.path">
                <pre>{pretty(sim.path)}</pre>
              </DebugSection>

              <DebugSection title="visitedStars">
                <pre>{pretty(sim.visitedStars)}</pre>
              </DebugSection>

              <DebugSection title="hitForbidden">
                <pre>{pretty(sim.hitForbidden)}</pre>
              </DebugSection>

              <DebugSection title="exitedAtCorrectExit">
                <pre>{pretty(sim.exitedAtCorrectExit)}</pre>
              </DebugSection>

              <DebugSection title="loopDetected">
                <pre>{pretty(sim.loopDetected)}</pre>
              </DebugSection>

              <DebugSection title="ValidationResult">
                <pre>{pretty(result)}</pre>
              </DebugSection>
            </>
          ) : (
            <p className="dbg-empty">
              아직 실행 결과가 없습니다. <b>실행하기</b>를 누르면 시뮬레이션/판정 정보가 표시됩니다.
            </p>
          )}
        </div>
      )}
    </section>
  )
}

interface DebugSectionProps {
  title: string
  children: React.ReactNode
}

function DebugSection({ title, children }: DebugSectionProps) {
  return (
    <div className="dbg-section">
      <h4>{title}</h4>
      {children}
    </div>
  )
}
