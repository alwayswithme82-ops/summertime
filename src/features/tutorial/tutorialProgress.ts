const TUTORIAL_DONE_KEY = 'tutorial_done'

/** 튜토리얼을 한 번이라도 끝냈는지 localStorage 에서 읽는다. */
export function readTutorialDone(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(TUTORIAL_DONE_KEY) === '1'
  } catch {
    return false
  }
}

/** 튜토리얼 완료 표시를 저장한다. 저장 실패는 무시(연출은 그대로 동작). */
export function markTutorialDone(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(TUTORIAL_DONE_KEY, '1')
  } catch {
    /* 저장 실패는 무시 */
  }
}
