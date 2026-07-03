# 빛 반사 설계 활동

초등 눈높이의 **빛 반사 설계 활동** 웹앱입니다. 격자판 위에 거울(`/`, `\`)을
놓아 입구로 들어온 빛을 원하는 별 칸으로 통과시키고 지정된 출구로 내보내는
퍼즐을 풀며, 빛의 반사 원리를 직접 설계하면서 익힙니다.

## 프로젝트 설명

- 학생은 격자에 거울을 배치하고 **실행하기**를 눌러 빛의 경로를 확인합니다.
- 빛은 실제로 시뮬레이션되어 경로가 격자 위에 그려집니다.
- 정답 여부는 미리 정해둔 좌표와의 일치가 아니라, **문제의 규칙(별 통과 ·
  금지 칸 회피 · 올바른 출구로 탈출 등)을 실제 시뮬레이션 결과가 만족하는지**로
  판정합니다.
- 문제 목록, 학생용 플레이 화면, 예시 정답 보기, 문제 편집기,
  개발 검수용 디버그 패널을 포함합니다.

## 기술 스택

- **React 19** + **TypeScript**
- **Vite** (개발 서버 / 프로덕션 번들러)
- **Vitest** + **@testing-library/react** (테스트)
- **oxlint** (린트)

## 실행 방법

```bash
npm install      # 의존성 설치
npm run dev      # 개발 서버 (Vite, HMR)
```

## 테스트 방법

```bash
npm test         # 전체 테스트 1회 실행 (vitest run)
npm run test:watch   # 워치 모드
npm run lint     # oxlint
```

## 배포 방법

```bash
npm run build    # 타입 체크(tsc -b) 후 dist/ 에 정적 파일 생성
npm run preview  # 빌드 결과 로컬 미리보기
```

`dist/` 는 순수 정적 파일이므로 GitHub Pages, Netlify, Vercel 등 어떤
정적 호스팅에도 그대로 올릴 수 있습니다.

## 핵심 구조

```
src/
  core/                  순수 도메인 로직 (React 비의존)
    types.ts             공유 타입 (Puzzle, PlacedMirrors, SimulationResult, ValidationResult ...)
    direction.ts         방향 · 델타
    coordinate.ts        좌표 ↔ 칸이름(CellKey) 변환, 격자 경계
    mirror.ts            거울 반사 규칙
    simulateLight.ts     빛 추적 시뮬레이션
    validateSolution.ts  규칙 기반 정답 판정
    scoreSolution.ts     점수 계산
    index.ts             core 공개 API (React는 이 모듈로만 core 사용)
  features/
    puzzle-library/      문제 목록 화면
    puzzle-player/       학생용 플레이 화면 (+ 개발 검수용 DebugPanel)
    puzzle-editor/       문제 편집기
  data/samplePuzzles.ts  예시 문제
tests/                   core 엔진 · 판정 테스트
```

- `core` 는 UI/테스트와 무관한 순수 로직만 두고, 화면은 `core/index.ts` 공개
  API를 통해서만 접근합니다.
- 개발 검수용 `DebugPanel` 은 별도 컴포넌트로 분리되어 있어, 학생용 정식
  화면에서는 손쉽게 숨기거나 제거할 수 있습니다.

## 정답 판정 방식

**정답은 `sampleAnswer`(예시 정답)와의 비교로 판정하지 않습니다.**

판정은 다음 두 단계로 이루어집니다.

1. **`simulateLight`** — 학생이 놓은 거울(`placedMirrors`)을 바탕으로 입구부터
   빛을 실제로 추적하여 경로, 지나간 별, 지나간 금지 칸, 출구 탈출 여부,
   무한 루프 여부 등을 담은 `SimulationResult` 를 만듭니다.
2. **`validateSolution`** — 그 시뮬레이션 결과가 문제의 규칙(`PuzzleRule`:
   필수 별 통과 · 금지 칸 회피 · 올바른 출구 탈출 · 거울 개수 제약 등)을
   만족하는지 검사하여 `ValidationResult`(성공 여부 · 메시지 · 실패 이유)를
   반환합니다.

이 방식 덕분에 **정답 배치가 여러 가지여도 규칙만 만족하면 모두 정답**으로
인정됩니다. `sampleAnswer` 는 판정 기준이 아니라 힌트/해설용 예시일 뿐입니다.
