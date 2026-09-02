# Instagram 업로드 가이드

폴더: `marketing/instagram/`

## 바로 쓸 파일

| 용도 | 파일 |
|------|------|
| 캐러셀 1~7 | `export/01-carousel-*.png` ~ `07-carousel-*.png` |
| 스토리 3장 | `export/story-01-*.png` ~ `story-03-*.png` |
| 릴스 커버 3종 | `export/reel-a-cover.png` 등 |
| 캡션·대본 | `CAPTIONS.md` |
| 미리보기 HTML | `index.html` (브라우저로 열기) |

## 올리는 순서 (추천)

1. **캐러셀 피드** — `01`~`07` 순서대로 업로드 + `CAPTIONS.md` 캡션
2. **릴스 A** — 앱 화면 녹화 15초 + 커버 `reel-a-cover.png`
3. **스토리** — `story-01` 올리고 링크 스티커 (배포 URL)

## PNG 다시 만들기

```bash
node marketing/instagram/export.mjs
```

## 주의

- 바이오·스토리·캡션의 링크에 **Vercel 배포 URL**을 넣으세요.
- 릴스는 커버만 제공됩니다. 본편은 앱 화면을 직접 녹화하세요 (`CAPTIONS.md` 초별 대본).
