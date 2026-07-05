import { useCallback, useEffect, useRef, useState } from 'react'

interface TypewriterResult {
  /** 지금까지 타이핑된 부분 문자열. */
  text: string
  /** 문장 전체가 표시됐는지. */
  done: boolean
  /** 타이핑을 즉시 완성한다(스페이스/클릭으로 스킵할 때). */
  skip: () => void
}

/**
 * 말풍선 타이핑 효과. 입장 연출의 타이핑과 통일된 느낌(글자당 ~45ms).
 * reduceMotion 이면 타이핑 없이 전체 문장을 즉시 보여준다.
 */
export function useTypewriter(text: string, reduceMotion: boolean, charMs = 45): TypewriterResult {
  const [count, setCount] = useState(0)
  const timersRef = useRef<number[]>([])

  useEffect(() => {
    if (reduceMotion || !text) {
      setCount(text.length)
      return
    }

    setCount(0)
    timersRef.current = Array.from({ length: text.length }, (_, i) => {
      const shown = i + 1
      return window.setTimeout(() => setCount(shown), shown * charMs)
    })
    return () => {
      timersRef.current.forEach(window.clearTimeout)
      timersRef.current = []
    }
  }, [text, reduceMotion, charMs])

  const skip = useCallback(() => {
    timersRef.current.forEach(window.clearTimeout)
    timersRef.current = []
    // 문장이 바뀌면 effect가 0으로 되돌리므로 Infinity로 "끝까지"만 표시한다.
    setCount(Number.POSITIVE_INFINITY)
  }, [])

  return { text: text.slice(0, count), done: count >= text.length, skip }
}
