# 방법론 선택 버튼 수정 완료

## 문제
DMAIC/DFSS 방법론 선택 버튼을 클릭해도 다음 화면으로 이동하지 않는 문제가 있었습니다.

## 원인
localStorage 동기화가 300ms 디바운스로 지연되어, 버튼 클릭 시 상태 변경이 즉시 localStorage에 반영되지 않았습니다.

## 해결
방법론 선택 버튼의 onClick 핸들러를 수정하여 **즉시 localStorage에 저장**하도록 변경했습니다:

```javascript
// 수정 전
onClick={() => { setMethodology('dmaic'); setActiveStep('define'); }}

// 수정 후  
onClick={() => { 
  localStorage.setItem('sigma_methodology', 'dmaic');
  setMethodology('dmaic'); 
  setActiveStep('define'); 
}}
```

## 테스트 방법
1. 브라우저를 새로고침 (F5)
2. 프로젝트 선택 화면에서 과제를 선택
3. "방법론 선택하기" 버튼 클릭
4. DMAIC 또는 DFSS 버튼 클릭
5. Define 단계로 정상 이동하는지 확인

## 다음 단계
방법론 선택 후 Measure 단계까지 샘플 데이터를 계속 입력하겠습니다.
