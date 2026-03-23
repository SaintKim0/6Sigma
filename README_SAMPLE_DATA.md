# 6 Sigma 샘플 데이터 입력 가이드

## 🎯 개요
이 가이드는 6 Sigma 애플리케이션에 샘플 데이터를 빠르게 입력하는 방법을 설명합니다.

## ✅ 수정 완료 사항

### 1. 방법론 선택 버튼 수정
**문제:** DMAIC/DFSS 버튼 클릭 시 다음 화면으로 이동하지 않음  
**원인:** localStorage 동기화가 300ms 디바운스로 지연됨  
**해결:** 버튼 클릭 시 즉시 localStorage에 저장하도록 수정

```javascript
// App.jsx 수정 내용 (라인 2051, 2059)
onClick={() => { 
  localStorage.setItem('sigma_methodology', 'dmaic');
  setMethodology('dmaic'); 
  setActiveStep('define'); 
}}
```

## 📝 샘플 데이터 자동 입력 방법

### 방법 1: 전체 자동 입력 (추천)

1. **브라우저 개발자 도구 열기**
   - Windows: `F12` 또는 `Ctrl + Shift + I`
   - Mac: `Cmd + Option + I`

2. **Console 탭 클릭**

3. **스크립트 복사 & 실행**
   - `input_sample_data.js` 파일 내용 전체를 복사
   - Console에 붙여넣기 후 Enter
   - 다음 명령어 실행:
     ```javascript
     runAll()
     ```

4. **페이지 새로고침**
   - `F5` 또는 `Ctrl + R`

### 방법 2: 단계별 입력

각 단계별로 개별 실행 가능:

```javascript
step1_selectMethodology()  // 방법론 선택 (DMAIC)
step2_inputDefineData()    // Define 단계
step3_inputMeasureData()   // Measure 단계
step4_inputAnalyzeData()   // Analyze 단계
step5_inputImproveData()   // Improve 단계
step6_inputControlData()   // Control 단계
```

## 📊 입력되는 샘플 데이터

### Define (정의)
- **프로젝트명:** 스마트폰 케이스 불량률 감소 프로젝트
- **목표:** 불량률 15.2% → 5% 감소
- **팀 구성:** Champion, BB, 생산팀장, 데이터 분석가
- **기간:** 2026-01-15 ~ 2026-07-15

### Measure (측정)
- **총 샘플:** 1000개
- **불량 개수:** 152개
- **불량률:** 15.2%
- **CTQ:** 표면 품질(60%), 치수 정밀도(30%), 색상 균일도(10%)

### Analyze (분석)
- **주요 원인:** 사출 온도 과다, 냉각 시간 부족, 금형 오염
- **Pareto 분석:** 상위 3개 원인이 전체의 85% 차지
- **Fishbone:** 6M 분석 (Man, Machine, Material, Method, Measurement, Environment)

### Improve (개선)
- 사출 온도 최적화 (245±3℃)
- 냉각 시간 연장 (30초)
- 금형 청소 주기 단축 (일 2회)
- 작업자 교육 프로그램
- 검사 기준서 작성

### Control (관리)
- 일일 불량률 모니터링
- 주간 품질 회의
- 월간 성과 리뷰
- SOP 작성 및 교육

## 🔧 문제 해결

### 버튼이 여전히 작동하지 않는 경우

1. **브라우저 캐시 삭제**
   - `Ctrl + Shift + Delete`
   - "캐시된 이미지 및 파일" 선택 후 삭제

2. **개발 서버 재시작**
   ```bash
   # 터미널에서 Ctrl+C로 중단 후
   npm run dev
   ```

3. **수동으로 localStorage 설정**
   ```javascript
   localStorage.setItem('sigma_methodology', 'dmaic');
   localStorage.setItem('sigma_project_selected', 'true');
   location.reload();
   ```

### 데이터가 표시되지 않는 경우

1. **localStorage 확인**
   ```javascript
   console.log(localStorage.getItem('sigma_project_data'));
   ```

2. **데이터 초기화 후 재입력**
   ```javascript
   localStorage.clear();
   runAll();
   location.reload();
   ```

## 📁 관련 파일

- `input_sample_data.js` - 샘플 데이터 자동 입력 스크립트
- `debug_methodology.js` - 방법론 선택 디버깅 스크립트
- `sample_data/sixsigma_project_data.json` - 원본 샘플 데이터
- `sample_data/chart_data.json` - 차트 데이터

## 💡 팁

- **빠른 테스트:** `runAll()` 실행 후 바로 새로고침
- **단계별 확인:** 각 step 함수를 개별 실행하여 단계별 확인 가능
- **데이터 수정:** localStorage에서 직접 수정 가능
- **백업:** 중요한 데이터는 "내보내기" 버튼으로 JSON 파일로 저장

## 🎓 다음 단계

1. ✅ 방법론 선택 (DMAIC/DFSS)
2. ✅ Define 단계 완료
3. ✅ Measure 단계 완료
4. ✅ Analyze 단계 완료
5. ✅ Improve 단계 완료
6. ✅ Control 단계 완료
7. 📊 차트 및 그래프 확인
8. 📄 최종 보고서 생성

---

**작성일:** 2026-01-11  
**버전:** 1.0  
**작성자:** Antigravity AI
