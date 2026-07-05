import { useEffect, useState } from 'react'

/**
 * 말풍선 타이핑 효과. 입장 연출의 타이핑과 통일된 느낌(글자당 ~45ms).
 * reduceMotion 이면 타이핑 없이 전체 문장을 즉시 보여준다.
 */
export function useTypewriter(text: string, reduceMotion: boolean, charMs = 45): string {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (reduceMotion || !text) {
      setCount(text.length)
      return
    }

    setCount(0)
    const timers = Array.from({ length: text.length }, (_, i) => {
      const shown = i + 1
      return window.setTimeout(() => setCount(shown), shown * charMs)
    })
    return () => timers.forEach(window.clearTimeout)
  }, [text, reduceMotion, charMs])

  return text.slice(0, count)
}
