/**
 * Control 단계 기본 템플릿 (업종/프로젝트 성격별)
 */

export const CONTROL_PLAN_TEMPLATES = [
  {
    id: 'mfg_injection_spc',
    industry: 'manufacturing',
    name: '사출/가공 SPC 관리계획',
    desc: '온도·치수·외관 등 공정 특성의 실시간/일일 관리',
    tags: ['품질', 'SPC', '제조'],
    items: [
      { process: '원료 건조', characteristic: '수분율(%)', spec: '≤ 0.02%', method: '수분분석기', sample: 'LOT당 1회', owner: '자재팀', reaction: '기준 초과 시 LOT 보류·재건조' },
      { process: '사출', characteristic: '용융 온도(℃)', spec: '245 ± 3℃', method: '설비 센서/기록', sample: '실시간', owner: '생산', reaction: 'UCL/LCL 이탈 시 라인스탑·센서교정' },
      { process: '냉각', characteristic: '냉각 시간(초)', spec: '≥ 30초', method: '타이머 인터록', sample: '매 사이클', owner: '생산', reaction: '미달 시 취출 금지·설정 확인' },
      { process: '최종검사', characteristic: '치수(mm)', spec: '공차 ±0.2mm', method: '버니어/게이지', sample: '시간당 5개', owner: '품질', reaction: '이탈 시 전량 선별·원인 조사' },
      { process: '최종검사', characteristic: '외관 스크래치', spec: '깊이 <0.1mm, ≤2개', method: '한계견본 육안', sample: '전수(또는 AQL)', owner: '품질', reaction: '불량 격리·금형 청소 점검' }
    ]
  },
  {
    id: 'mfg_assembly_quality',
    industry: 'manufacturing',
    name: '조립라인 품질 관리계획',
    desc: '조립·토크·기능검사 중심의 라인 관리',
    tags: ['조립', '검사'],
    items: [
      { process: '부품 투입', characteristic: '부품 일치/혼입', spec: 'BOM 100% 일치', method: '바코드 스캔', sample: '전수', owner: '생산', reaction: '미스캔 시 라인스탑' },
      { process: '체결', characteristic: '체결 토크', spec: '도면 토크 ±10%', method: '토크렌치/기록', sample: '대당 주요점', owner: '생산', reaction: '이탈 시 재체결·공구 교정' },
      { process: '기능검사', characteristic: '기능 Pass율', spec: '≥ 99%', method: '기능 테스터', sample: '전수', owner: '품질', reaction: 'Fail 시 수리 라우팅' }
    ]
  },
  {
    id: 'svc_sla_control',
    industry: 'service_office',
    name: '서비스 SLA/리드타임 관리계획',
    desc: '접수~완료 리드타임·재작업·고객불만 모니터링',
    tags: ['SLA', '사무'],
    items: [
      { process: '접수', characteristic: '접수 정확도', spec: '필수항목 100%', method: '체크리스트', sample: '전건', owner: 'CS', reaction: '누락 시 반려·보완 요청' },
      { process: '처리', characteristic: '리드타임(시간)', spec: 'SLA 이내', method: '티켓 시스템', sample: '일일', owner: '운영', reaction: 'SLA 임박 알림·에스컬레이션' },
      { process: '완료', characteristic: '재작업률', spec: '≤ 5%', method: '티켓 태그 집계', sample: '주간', owner: '품질/운영', reaction: '원인 Pareto·교육' },
      { process: '사후', characteristic: '고객 불만', spec: '월 ≤ N건', method: 'VOC 로그', sample: '주간', owner: 'CS리더', reaction: '중대 불만 24h 대응' }
    ]
  },
  {
    id: 'it_sre_control',
    industry: 'it_ops',
    name: 'IT 운영/배포 관리계획',
    desc: '가용성·MTTR·변경실패율·배포 모니터링',
    tags: ['SRE', '배포'],
    items: [
      { process: '모니터링', characteristic: '가용성(%)', spec: '≥ 99.9%', method: 'APM/알림', sample: '실시간', owner: 'SRE', reaction: '임계치 이탈 시 On-call 소집' },
      { process: '장애대응', characteristic: 'MTTR(분)', spec: '≤ 목표치', method: '인시던트 기록', sample: '건별', owner: 'SRE', reaction: 'SLA 초과 시 포스트모템' },
      { process: '변경/배포', characteristic: '변경 실패율', spec: '≤ 5%', method: 'CI/CD 메트릭', sample: '주간', owner: 'DevOps', reaction: '실패 시 롤백·배포 동결' },
      { process: '보안', characteristic: '취약점 조치', spec: 'Critical 7일 내', method: '스캐너', sample: '주간', owner: 'SecOps', reaction: '미조치 시 배포 차단' }
    ]
  },
  {
    id: 'logistics_otif',
    industry: 'logistics',
    name: '물류 OTIF/오배송 관리계획',
    desc: '피킹 정확도·납기·파손율 관리',
    tags: ['물류', 'OTIF'],
    items: [
      { process: '피킹', characteristic: '피킹 정확도', spec: '≥ 99.5%', method: '스캔 검수', sample: '전수/샘플', owner: '창고', reaction: '오류 시 재피킹·교육' },
      { process: '출고', characteristic: 'OTIF', spec: '≥ 95%', method: 'WMS/TMS', sample: '일일', owner: '물류기획', reaction: '미달 시 병목 분석' },
      { process: '배송', characteristic: '오배송률', spec: '≤ 0.5%', method: '클레임 집계', sample: '주간', owner: 'CS/물류', reaction: '주소검증·라벨 점검' },
      { process: '취급', characteristic: '파손율', spec: '≤ 0.3%', method: '입고 검수', sample: '주간', owner: '품질', reaction: '포장스펙 강화' }
    ]
  },
  {
    id: 'healthcare_safety',
    industry: 'healthcare',
    name: '병원/환자안전 관리계획',
    desc: '투약·환자확인·대기시간·감염 지표 관리',
    tags: ['환자안전', '의료'],
    items: [
      { process: '환자확인', characteristic: '2식별자 확인', spec: '100%', method: '체크리스트/바코드', sample: '전수', owner: '간호', reaction: '미확인 시 처치 중단' },
      { process: '투약', characteristic: '투약 오류', spec: '0건 목표', method: '보고 시스템', sample: '일일', owner: '약제/간호', reaction: '즉시 보고·원인분석' },
      { process: '외래', characteristic: '대기시간(분)', spec: '≤ 목표', method: 'HIS 타임스탬프', sample: '일일', owner: '원무/진료지원', reaction: '병목 구간 조정' },
      { process: '감염관리', characteristic: '손위생 준수율', spec: '≥ 90%', method: '관찰감사', sample: '주간', owner: '감염관리', reaction: '교육·피드백' }
    ]
  }
];

export const STANDARD_WORK_TEMPLATES = [
  {
    id: 'mfg_sop_injection',
    industry: 'manufacturing',
    name: '사출기 표준작업(SOP)',
    desc: '기동·조건설정·자주검사·이상조치 절차',
    tags: ['SOP', '사출'],
    title: '사출기 #N 표준작업지침',
    purpose: '사출 공정 조건을 표준화하여 품질 산포와 불량을 최소화한다.',
    scope: '사출기 가동, 조건 확인, 금형 청소, 자주검사, 이상 발생 시 조치',
    safety: '안전화·장갑 착용, 가동 중 금형 접근 금지, LOTO 절차 준수',
    steps: [
      { step: 1, action: '작업 전 점검', detail: '냉각수·히터·안전장치·금형 상태를 체크리스트로 확인' },
      { step: 2, action: '조건 설정', detail: '온도 245±3℃, 냉각 ≥30초, 보압 기준값 입력 후 서명' },
      { step: 3, action: '초도품 확인', detail: '초도 5개 외관·치수 검사 후 OK 시 양산 시작' },
      { step: 4, action: '자주검사', detail: '1시간마다 샘플 5개 검사, 결과를 관리도에 기록' },
      { step: 5, action: '금형 청소', detail: '교대당 1회 청소 및 체크시트 서명' },
      { step: 6, action: '이상 조치', detail: '관리이탈·불량 급증 시 라인스탑 → 팀장 보고 → 원인 기록' }
    ],
    training: '신규/전환 배치 시 4시간 OJT + 한계견본 교육, 이수 기록 필수'
  },
  {
    id: 'mfg_sop_inspection',
    industry: 'manufacturing',
    name: '최종검사 표준작업',
    desc: '외관·치수 검사 기준과 불량 처리',
    tags: ['검사', 'SOP'],
    title: '최종검사 표준작업지침',
    purpose: '출하 품질을 보장하기 위한 검사 방법과 판정 기준을 표준화한다.',
    scope: '최종검사대에서의 외관/치수 검사 및 불량품 격리',
    safety: '적절한 조도(≥800lux) 유지, 날카로운 버 취급 주의',
    steps: [
      { step: 1, action: '검사 준비', detail: '한계견본·게이지 교정 상태·조도 확인' },
      { step: 2, action: '외관 검사', detail: '한계견본과 비교하여 스크래치/이물/변색 판정' },
      { step: 3, action: '치수 검사', detail: '주요 치수 측정 후 공차 내 여부 기록' },
      { step: 4, action: '판정/격리', detail: 'NG품은 적색 박스에 격리하고 불량모드 코드 입력' }
    ],
    training: '검사원 자격인증(연 1회), 신규 투입 시 동행검사 3일'
  },
  {
    id: 'svc_sop_ticket',
    industry: 'service_office',
    name: '티켓/케이스 처리 표준작업',
    desc: '접수·분류·처리·에스컬레이션 SOP',
    tags: ['CS', 'SOP'],
    title: '고객 요청 처리 표준절차',
    purpose: '요청 처리의 일관성과 SLA 준수를 보장한다.',
    scope: '전화/메일/포털로 접수된 고객 요청의 처리',
    safety: '개인정보 마스킹·최소권한 원칙 준수',
    steps: [
      { step: 1, action: '접수', detail: '필수항목(고객/유형/우선순위) 입력, 누락 시 반려' },
      { step: 2, action: '분류', detail: '유형별 큐 배정, SLA 타이머 시작' },
      { step: 3, action: '처리', detail: '표준 응대 스크립트·지식베이스 활용하여 해결' },
      { step: 4, action: '에스컬레이션', detail: 'SLA 80% 도달 또는 복잡도 High 시 상위 이관' },
      { step: 5, action: '종료', detail: '결과 기록·고객 확인·재오픈 기준 안내' }
    ],
    training: '입사 1주 내 SOP 교육, 월간 품질 모니터링 피드백'
  },
  {
    id: 'it_sop_incident',
    industry: 'it_ops',
    name: '장애대응/배포 표준작업',
    desc: '인시던트 대응과 안전한 배포 절차',
    tags: ['Incident', 'Deploy'],
    title: '장애대응 및 배포 표준절차',
    purpose: '장애 영향 최소화와 안전한 변경 배포를 표준화한다.',
    scope: 'P1~P3 인시던트 대응, 프로덕션 배포',
    safety: '프로덕션 직접 변경 금지(승인된 파이프라인만)',
    steps: [
      { step: 1, action: '탐지/선언', detail: '알림 확인 후 Severity 부여, 채널에 인시던트 선언' },
      { step: 2, action: '완화', detail: '롤백/트래픽 차단 등 즉시 완화 조치' },
      { step: 3, action: '복구', detail: '근본 조치 적용 후 모니터링 지표 정상화 확인' },
      { step: 4, action: '배포', detail: '체크리스트·카나리/블루그린·자동 롤백 조건 확인 후 배포' },
      { step: 5, action: '사후', detail: '포스트모템 작성(블레임리스), 액션아이템 등록' }
    ],
    training: 'On-call 로테이션 전 모의훈련, 분기별 게임데이'
  },
  {
    id: 'logistics_sop_picking',
    industry: 'logistics',
    name: '피킹/패킹 표준작업',
    desc: '피킹 정확도와 포장 품질을 위한 SOP',
    tags: ['피킹', '패킹'],
    title: '피킹·패킹 표준작업지침',
    purpose: '오피킹·오배송·파손을 줄이기 위한 표준 작업을 정착시킨다.',
    scope: '주문 피킹, 검수, 패킹, 라벨링',
    safety: '리프트/카트 안전수칙, 중량물 2인 작업',
    steps: [
      { step: 1, action: '피킹', detail: 'PDA 지시 순서대로 스캔 피킹, 미확인 출고 금지' },
      { step: 2, action: '검수', detail: '수량·SKU 재스캔, 불일치 시 재피킹' },
      { step: 3, action: '패킹', detail: '완충재·박스 규격 준수, Fragile 라벨 부착' },
      { step: 4, action: '출고', detail: '송장 부착·구역별 적재, 마감 전 체크리스트 확인' }
    ],
    training: '신규 2일 동행작업, 오류 3회 시 재교육'
  },
  {
    id: 'healthcare_sop_med',
    industry: 'healthcare',
    name: '투약/환자확인 표준작업',
    desc: '5 Rights 기반 투약 안전 SOP',
    tags: ['투약', '환자안전'],
    title: '투약 및 환자확인 표준절차',
    purpose: '투약 오류를 예방하고 환자 안전을 보장한다.',
    scope: '처방 확인부터 투약·기록까지',
    safety: '감염예방(손위생), 환자 프라이버시 보호',
    steps: [
      { step: 1, action: '처방 확인', detail: '처방·알레르기·용량 재확인' },
      { step: 2, action: '환자 확인', detail: '이름+등록번호 등 2개 식별자 확인' },
      { step: 3, action: '투약', detail: 'Right patient/drug/dose/route/time 확인 후 투여' },
      { step: 4, action: '기록', detail: '투약 시각·용량·이상반응 기록' },
      { step: 5, action: '이상 시', detail: '이상반응 시 즉시 보고·응급조치' }
    ],
    training: '연 2회 필수 교육, 신규 간호 프리셉터십'
  }
];

export const getControlPlanTemplates = (industryId) => {
  const list = CONTROL_PLAN_TEMPLATES.filter(t => t.industry === industryId);
  return list.length ? list : CONTROL_PLAN_TEMPLATES.filter(t => t.industry === 'manufacturing');
};

export const getStandardWorkTemplates = (industryId) => {
  const list = STANDARD_WORK_TEMPLATES.filter(t => t.industry === industryId);
  return list.length ? list : STANDARD_WORK_TEMPLATES.filter(t => t.industry === 'manufacturing');
};

export const emptyControlPlanItem = () => ({
  process: '',
  characteristic: '',
  spec: '',
  method: '',
  sample: '',
  owner: '',
  reaction: ''
});

export const emptySopStep = (n = 1) => ({
  step: n,
  action: '',
  detail: ''
});
