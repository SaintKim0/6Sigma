# 6 Sigma Workbench

DMAIC/DFSS 프로젝트를 브라우저에서 진행하는 React 앱입니다.  
기본은 **로컬 저장**(localStorage). 선택적으로 동기화 API·정적 배포를 사용할 수 있습니다.

## 실행

```bash
npm install
npm run dev
```

동기화 서버(선택):

```bash
npm run server
# http://localhost:8787
```

프론트에 API 연결:

```bash
cp .env.example .env
# VITE_API_URL=http://localhost:8787
npm run dev
```

내 프로젝트 → **클라우드 업로드 / 클라우드 불러오기**

## 배포 (프론트 정적)

```bash
npm run build
```

- **GitHub Actions → GitHub Pages** (권장): `main` 푸시 시 `.github/workflows/deploy-pages.yml`이 빌드·배포  
  - 저장소 **Settings → Pages → Source: GitHub Actions** 한 번만 선택  
  - URL: `https://saintkim0.github.io/6Sigma/`
- **Vercel**: 저장소 연결 시 푸시만으로도 배포 (`vercel.json` SPA rewrite 포함). Actions로 Vercel에 올리려면 `VERCEL_TOKEN` 등 시크릿이 필요합니다.
- **Netlify**: `netlify.toml` 사용, publish=`dist`
- 미리보기: `npm run preview`

## 구성 요약

| 경로 | 역할 |
|------|------|
| `src/` | React 앱 |
| `server/` | 프로젝트 동기화 API (파일 저장) |
| `public/demo_project_seed.json` | 데모 프로젝트 |
| `public/sixsigma_data.json` | 도구 카탈로그·추천 규칙 |

## UX

단계별 도구는 **카테고리 탭**(전체 / 원인 분석 / 통계 검정 등)으로 그룹핑됩니다.

### 교육 커리큘럼

사이드바 **교육 과정**에서 Yellow Belt → Green Belt → 통계 실험실 → DFSS 입문 순으로
기존 학습관·설명서·도구·샘플·데모를 학습 경로로 따라갈 수 있습니다.
진도는 브라우저 localStorage(`sigma_edu_progress`)에 저장됩니다.
