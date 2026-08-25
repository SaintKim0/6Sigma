/**
 * Define / Measure 단계 업종별 템플릿
 */

export const VOC_CTQ_TEMPLATES = [
  {
    id: 'mfg_voc',
    industry: 'manufacturing',
    name: '제조 품질 VOC→CTQ',
    desc: '외관·치수·납기 중심',
    vocItems: [
      { voice: '케이스에 스크래치가 많다', customer: 'OEM 품질', priority: '상' },
      { voice: '치수가 안 맞아 조립이 어렵다', customer: '조립라인', priority: '상' },
      { voice: '색상이 LOT마다 다르다', customer: 'OEM', priority: '중' },
      { voice: '납기가 자주 지연된다', customer: '구매', priority: '중' }
    ],
    ctqItems: [
      { ctq: '표면 스크래치', spec: '깊이 <0.1mm, ≤2개/제품', weight: 60 },
      { ctq: '치수 정밀도', spec: '길이/폭 ±0.2mm, 두께 ±0.1mm', weight: 30 },
      { ctq: '색차(ΔE)', spec: 'ΔE < 2.0', weight: 10 }
    ]
  },
  {
    id: 'svc_voc',
    industry: 'service_office',
    name: '서비스 VOC→CTQ',
    desc: '대기·재작업·응대 품질',
    vocItems: [
      { voice: '처리가 너무 오래 걸린다', customer: '고객', priority: '상' },
      { voice: '같은 내용을 여러 번 설명한다', customer: '고객', priority: '상' },
      { voice: '담당자가 바뀌면 정보가 끊긴다', customer: '고객', priority: '중' }
    ],
    ctqItems: [
      { ctq: '리드타임', spec: 'SLA 이내 완료율 ≥ 90%', weight: 50 },
      { ctq: '일회 처리율(FCR)', spec: '≥ 80%', weight: 30 },
      { ctq: '재작업률', spec: '≤ 5%', weight: 20 }
    ]
  },
  {
    id: 'it_voc',
    industry: 'it_ops',
    name: 'IT VOC→CTQ',
    desc: '장애·배포·응답속도',
    vocItems: [
      { voice: '장애 복구가 너무 느리다', customer: '비즈니스', priority: '상' },
      { voice: '배포 후 자주 문제가 생긴다', customer: '운영', priority: '상' },
      { voice: '화면이 느리다', customer: '사용자', priority: '중' }
    ],
    ctqItems: [
      { ctq: 'MTTR', spec: 'P1 ≤ 목표분 이내', weight: 40 },
      { ctq: '변경 실패율', spec: '≤ 5%', weight: 35 },
      { ctq: '가용성', spec: '≥ 99.9%', weight: 25 }
    ]
  },
  {
    id: 'log_voc',
    industry: 'logistics',
    name: '물류 VOC→CTQ',
    desc: '오배송·파손·납기',
    vocItems: [
      { voice: '주문과 다른 상품이 온다', customer: '고객', priority: '상' },
      { voice: '포장이 파손되어 도착한다', customer: '고객', priority: '상' },
      { voice: '약속한 날짜에 안 온다', customer: '고객', priority: '중' }
    ],
    ctqItems: [
      { ctq: '피킹 정확도', spec: '≥ 99.5%', weight: 40 },
      { ctq: 'OTIF', spec: '≥ 95%', weight: 35 },
      { ctq: '파손율', spec: '≤ 0.3%', weight: 25 }
    ]
  },
  {
    id: 'hc_voc',
    industry: 'healthcare',
    name: '의료 VOC→CTQ',
    desc: '대기·투약안전·안내',
    vocItems: [
      { voice: '외래 대기시간이 길다', customer: '환자', priority: '상' },
      { voice: '투약/처치 설명이 부족하다', customer: '환자', priority: '중' },
      { voice: '환자 확인이 불안하다', customer: '보호자', priority: '상' }
    ],
    ctqItems: [
      { ctq: '외래 대기시간', spec: '목표분 이내', weight: 35 },
      { ctq: '투약오류', spec: '0건', weight: 40 },
      { ctq: '2식별자 확인 준수율', spec: '≥ 98%', weight: 25 }
    ]
  }
];

export const MSA_TEMPLATES = [
  {
    id: 'mfg_msa',
    industry: 'manufacturing',
    name: '치수/게이지 GR&R',
    desc: '반복·재현성 평가 기본안',
    method: 'Gage R&R (Crossed)',
    parts: 10,
    operators: 3,
    replicates: 3,
    acceptance: 'GR&R < 10% 우수, 10~30% 조건부 허용, >30% 불가',
    checklist: [
      '측정기 교정 유효기간 확인',
      '측정 절차(지그/압력/각도) 표준화',
      '측정자 교육 및 블라인드 측정',
      '환경(온도/진동) 안정화',
      '데이터 기록 양식 준비'
    ],
    result: '예: %GR&R = 12.4% (조건부 허용). 주요 원인: 측정자 간 편차. 조치: 재교육 및 지그 개선.'
  },
  {
    id: 'svc_msa',
    industry: 'service_office',
    name: '분류/판정 일치도',
    desc: '티켓 유형 분류의 평가자 일치',
    method: 'Attribute Agreement Analysis',
    parts: 30,
    operators: 3,
    replicates: 2,
    acceptance: '평가자 간 일치율 ≥ 90%, Kappa ≥ 0.7',
    checklist: [
      '표준 유형 정의서/예시 준비',
      '모호 케이스 가이드 작성',
      '독립 평가(서로 결과 비공개)',
      '불일치 케이스 합의 회의'
    ],
    result: '예: 일치율 88%, Kappa 0.72. 모호 유형 2개 재정의 후 재평가.'
  },
  {
    id: 'it_msa',
    industry: 'it_ops',
    name: '모니터링 지표 신뢰성',
    desc: '메트릭/알람의 정확성 검증',
    method: 'Measurement System Check (메트릭 검증)',
    parts: 20,
    operators: 2,
    replicates: 2,
    acceptance: '오탐/미탐률 ≤ 목표, 타임스탬프 오차 ≤ 허용치',
    checklist: [
      '메트릭 정의(분자/분모) 문서화',
      '샘플 트래픽으로 기준값 대조',
      '알람 임계치·윈도우 검증',
      '대시보드와 원천 로그 정합 확인'
    ],
    result: '예: 오탐 2건/주 → 임계치 조정 후 0건. 메트릭 정의서 개정.'
  },
  {
    id: 'log_msa',
    industry: 'logistics',
    name: '스캔/검수 시스템 MSA',
    desc: '바코드 스캔·수량 검수 정확도',
    method: 'Attribute / Gage 혼합',
    parts: 25,
    operators: 3,
    replicates: 2,
    acceptance: '스캔 누락 ≤ 0.1%, 수량 오차 0',
    checklist: [
      '스캐너 펌웨어/초점 점검',
      '라벨 인쇄 품질 확인',
      '검수 저울/카운터 교정',
      '작업자 스캔 각도 표준화'
    ],
    result: '예: 특정 라벨 재질에서 누락 증가 → 라벨 스펙 변경.'
  },
  {
    id: 'hc_msa',
    industry: 'healthcare',
    name: '측정/확인 절차 신뢰성',
    desc: '활력징후·환자확인 일치도',
    method: 'Attribute Agreement + 장비 점검',
    parts: 20,
    operators: 3,
    replicates: 2,
    acceptance: '환자확인 일치 100%, 장비 오차 규격 내',
    checklist: [
      '장비 교정/바이오메디컬 점검',
      '2식별자 확인 시나리오 훈련',
      '측정 자세·타이밍 표준화',
      '기록 시스템 입력 검증'
    ],
    result: '예: 혈압계 2대 편차 발견 → 교정 후 재평가 Pass.'
  }
];

export const SOLUTION_TEMPLATES = [
  {
    id: 'mfg_sol',
    industry: 'manufacturing',
    name: '제조 개선안 세트',
    solutions: [
      { cause: '공정조건 산포', solution: '핵심 조건 윈도우 고정 + 인터록', type: '공정', cost: '낮음', period: '1~2주', score: 90, isSelected: true },
      { cause: '표준작업 미흡', solution: 'SOP/체크시트 개정 및 교육', type: '표준화', cost: '낮음', period: '2주', score: 85, isSelected: true },
      { cause: '측정 신뢰성', solution: 'MSA 후 측정 절차·지그 개선', type: '측정', cost: '중간', period: '3주', score: 80, isSelected: true },
      { cause: '설비 노후', solution: '예방보전 주기 강화', type: '설비', cost: '중간', period: '1개월', score: 70, isSelected: false }
    ]
  },
  {
    id: 'svc_sol',
    industry: 'service_office',
    name: '서비스 개선안 세트',
    solutions: [
      { cause: '핸드오프 지연', solution: '큐 규칙·에스컬레이션 SLA 재설계', type: '프로세스', cost: '낮음', period: '2주', score: 88, isSelected: true },
      { cause: '입력 오류', solution: '필수필드/템플릿 강제', type: '시스템', cost: '낮음', period: '1주', score: 84, isSelected: true },
      { cause: '숙련도 편차', solution: '지식베이스 + OJT', type: '교육', cost: '중간', period: '3주', score: 78, isSelected: true }
    ]
  },
  {
    id: 'it_sol',
    industry: 'it_ops',
    name: 'IT 개선안 세트',
    solutions: [
      { cause: '배포 실패', solution: '카나리+자동롤백 파이프라인', type: '배포', cost: '중간', period: '3주', score: 92, isSelected: true },
      { cause: '장애 탐지 지연', solution: 'SLO 기반 알람 재설계', type: '모니터링', cost: '낮음', period: '2주', score: 86, isSelected: true },
      { cause: '변경 리스크', solution: '변경 자문/체크리스트 게이트', type: '거버넌스', cost: '낮음', period: '1주', score: 80, isSelected: true }
    ]
  },
  {
    id: 'log_sol',
    industry: 'logistics',
    name: '물류 개선안 세트',
    solutions: [
      { cause: '오피킹', solution: '스캔 강제 + 경로 최적화', type: '창고', cost: '중간', period: '3주', score: 90, isSelected: true },
      { cause: '파손', solution: '포장스펙/완충재 표준화', type: '포장', cost: '낮음', period: '2주', score: 82, isSelected: true },
      { cause: '납기 미준수', solution: '컷오프·존 용량 재배분', type: '계획', cost: '낮음', period: '2주', score: 78, isSelected: true }
    ]
  },
  {
    id: 'hc_sol',
    industry: 'healthcare',
    name: '의료 개선안 세트',
    solutions: [
      { cause: '환자 오인', solution: '2식별자 바코드 확인 의무화', type: '안전', cost: '중간', period: '4주', score: 95, isSelected: true },
      { cause: '투약 오류', solution: '처방-약품 스캔 매칭', type: '안전', cost: '중간', period: '4주', score: 93, isSelected: true },
      { cause: '대기 지연', solution: '외래 동선/호출 프로세스 개선', type: '흐름', cost: '낮음', period: '3주', score: 80, isSelected: true }
    ]
  }
];

const byIndustry = (list, industryId) => {
  const filtered = list.filter(t => t.industry === industryId);
  return filtered.length ? filtered : list.filter(t => t.industry === 'manufacturing');
};

export const getVocCtqTemplates = (id) => byIndustry(VOC_CTQ_TEMPLATES, id);
export const getMsaTemplates = (id) => byIndustry(MSA_TEMPLATES, id);
export const getSolutionTemplates = (id) => byIndustry(SOLUTION_TEMPLATES, id);
