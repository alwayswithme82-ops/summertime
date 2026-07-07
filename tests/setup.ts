// @testing-library/jest-dom 매처(toBeInTheDocument 등)를 vitest expect에 추가한다.
import '@testing-library/jest-dom/vitest'

// jsdom에는 matchMedia가 없다. 테스트에서는 '모션 최소화'로 답해
// 월드맵의 문 열림 연출을 건너뛰고 즉시 화면 전환되게 한다.
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = (query: string): MediaQueryList =>
    ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }) as MediaQueryList
}
