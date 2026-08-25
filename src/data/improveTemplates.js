/**
 * Improve 단계 업종별 기본 템플릿
 */

export const DOE_TEMPLATES = [
  {
    id: 'mfg_doe_process',
    industry: 'manufacturing',
    name: '공정조건 최적화 DOE',
    desc: '온도·시간·압력 등 핵심 공정 인자 실험',
    tags: ['제조', 'Factorial'],
    factors: [
      { name: '사출온도(℃)', low: '242', high: '248' },
      { name: '냉각시간(초)', low: '25', high: '30' },
      { name: '보압(bar)', low: '85', high: '90' }
    ],
    response: '불량률(%)',
    design: '2³ 부분실시 (또는 Full Factorial)',
    result: '최적 조건: 온도 245℃, 냉각 30초, 보압 88bar. 파일럿 불량률 유의하게 감소(p<0.05).'
  },
  {
    id: 'svc_doe_sla',
    industry: 'service_office',
    name: '서비스 처리방식 DOE',
    desc: '채널·우선순위·인력배치 조합 실험',
    tags: ['서비스', 'SLA'],
    factors: [
      { name: '채널(단일/멀티)', low: '단일', high: '멀티' },
      { name: '우선순위규칙', low: 'FIFO', high: 'VIP우선' },
      { name: '인력배치', low: '고정', high: '유동' }
    ],
    response: '리드타임(시간)',
    design: '2³ Factorial (파일럿 2주)',
    result: '멀티채널 + VIP우선 + 유동배치 조합에서 SLA 준수율 가장 높음.'
  },
  {
    id: 'it_doe_deploy',
    industry: 'it_ops',
    name: '배포전략 DOE',
    desc: '카나리 비율·배치크기·자동롤백 실험',
    tags: ['IT', '배포'],
    factors: [
      { name: '카나리비율', low: '5%', high: '20%' },
      { name: '배치크기', low: '소', high: '대' },
      { name: '자동롤백', low: 'Off', high: 'On' }
    ],
    response: '변경실패율(%)',
    design: '2³ Factorial',
    result: '카나리 5% + 소배치 + 자동롤백 On이 실패율·MTTR 모두 우수.'
  },
  {
    id: 'log_doe_pick',
    industry: 'logistics',
    name: '피킹경로 DOE',
    desc: '동선·배치·스캔방식 조합',
    tags: ['물류'],
    factors: [
      { name: '피킹경로', low: '존', high: '웨이브' },
      { name: '스캔방식', low: '단품', high: '배치' },
      { name: '카트유형', low: '일반', high: '멀티토트' }
    ],
    response: '피킹정확도/생산성',
    design: '2³ Factorial',
    result: '존피킹 + 단품스캔 + 멀티토트 조합이 정확도·생산성 균형 최적.'
  },
  {
    id: 'hc_doe_flow',
    industry: 'healthcare',
    name: '외래동선 DOE',
    desc: '접수·호출·검체동선 조합',
    tags: ['의료'],
    factors: [
      { name: '접수방식', low: '창구', high: '키오스크' },
      { name: '호출방식', low: '구두', high: '디스플레이' },
      { name: '검체동선', low: '분산', high: '집중' }
    ],
    response: '대기시간(분)',
    design: '2³ Factorial (파일럿 병동)',
    result: '키오스크 + 디스플레이 호출 + 집중 검체동선에서 대기시간 최소.'
  }
];

export const PILOT_TEMPLATES = [
  {
    id: 'mfg_pilot',
    industry: 'manufacturing',
    name: '라인 파일럿 검증',
    desc: '대조군 vs 실험군 2주 파일럿',
    tags: ['파일럿'],
    period: '2주',
    scope: '사출기 #3 주간조',
    successCriteria: '불량률 ≤ 6%, 생산성 유지(±3%), 안전이슈 0건',
    plan: [
      '실험 조건 고정(온도/냉각/청소주기)',
      '대조군(기존)과 실험군 동일 제품군 비교',
      '일일 불량·가동률 집계',
      '이상 시 즉시 롤백 기준 적용'
    ],
    result: '실험군 불량률 5.2% (대조 15.2%), p<0.001. 전면 확대 승인.'
  },
  {
    id: 'svc_pilot',
    industry: 'service_office',
    name: '프로세스 파일럿',
    desc: '특정 팀/채널 대상 신규 절차 시험',
    tags: ['파일럿'],
    period: '3주',
    scope: 'CS 1팀 / 포털 채널',
    successCriteria: 'SLA 준수율 ≥ 90%, 재작업률 ≤ 5%, CSAT 유지',
    plan: [
      '신규 분류·에스컬레이션 규칙 적용',
      '일일 SLA·재오픈 모니터링',
      '주 1회 피드백 회고'
    ],
    result: 'SLA 92%, 재작업 4.1%. 전사 확대.'
  },
  {
    id: 'it_pilot',
    industry: 'it_ops',
    name: '카나리 배포 파일럿',
    desc: '소수 트래픽으로 신규 배포 검증',
    tags: ['카나리'],
    period: '1주',
    scope: '프로덕션 트래픽 5%',
    successCriteria: '에러율 증가 < 0.1%p, p95 지연 악화 없음, 롤백 성공',
    plan: [
      '카나리 5% → 20% 단계 확대',
      '핵심 지표 대시보드 상시 감시',
      '임계치 초과 시 자동 롤백'
    ],
    result: '지표 안정, 자동롤백 미발생. 전량 배포.'
  },
  {
    id: 'log_pilot',
    industry: 'logistics',
    name: '피킹 방식 파일럿',
    desc: '특정 존에서 신규 피킹 SOP 시험',
    tags: ['파일럿'],
    period: '2주',
    scope: 'A존 주간',
    successCriteria: '피킹정확도 ≥ 99.5%, UPH 유지',
    plan: [
      '신규 경로·스캔 절차 교육',
      '일일 오류/생산성 집계',
      '이슈 로그 및 즉시 보정'
    ],
    result: '정확도 99.7%, UPH +4%. 확대.'
  },
  {
    id: 'hc_pilot',
    industry: 'healthcare',
    name: '병동 파일럿',
    desc: '투약/확인 절차 병동 단위 시험',
    tags: ['환자안전'],
    period: '4주',
    scope: '내과 병동',
    successCriteria: '투약오류 0건, 확인준수율 ≥ 98%',
    plan: [
      '바코드 2식별자 확인 의무화',
      '일일 준수율 감사',
      '이상반응 즉시 보고'
    ],
    result: '준수율 99%, 오류 0건. 병원 확대.'
  }
];

export const POKA_YOKE_TEMPLATES = [
  {
    id: 'mfg_poka',
    industry: 'manufacturing',
    name: '제조 포카요케',
    desc: '혼입·조건이탈·미검사를 원천 차단',
    tags: ['실수방지'],
    items: [
      { risk: '온도 조건 이탈', device: '설정 인터록', type: '방지형', check: '범위 밖이면 기동 불가' },
      { risk: '냉각시간 미달', device: '타이머 인터록', type: '방지형', check: '미달 시 취출 금지' },
      { risk: '자주검사 누락', device: '검사 알림+체크', type: '검출형', check: '미체크 시 다음 LOT 보류' },
      { risk: '부품 혼입', device: '바코드 매칭', type: '방지형', check: 'BOM 불일치 시 라인스탑' }
    ]
  },
  {
    id: 'svc_poka',
    industry: 'service_office',
    name: '사무/서비스 포카요케',
    desc: '입력누락·잘못된 이관 방지',
    tags: ['실수방지'],
    items: [
      { risk: '필수항목 누락', device: '필수 필드 검증', type: '방지형', check: '미입력 시 저장 불가' },
      { risk: '잘못된 큐 이관', device: '유형-큐 매핑', type: '방지형', check: '허용 큐만 선택 가능' },
      { risk: 'SLA 놓침', device: '임박 알림', type: '검출형', check: '80%/100% 알림·에스컬레이션' }
    ]
  },
  {
    id: 'it_poka',
    industry: 'it_ops',
    name: 'IT 변경 포카요케',
    desc: '잘못된 배포·권한·설정 실수 방지',
    tags: ['실수방지'],
    items: [
      { risk: '승인 없는 배포', device: '파이프라인 게이트', type: '방지형', check: '승인 없으면 배포 차단' },
      { risk: '잘못된 환경', device: '환경 태그 검증', type: '방지형', check: 'prod 태그 불일치 시 실패' },
      { risk: '장애 미감지', device: '헬스체크 게이트', type: '검출형', check: '실패 시 자동 롤백' }
    ]
  },
  {
    id: 'log_poka',
    industry: 'logistics',
    name: '물류 포카요케',
    desc: '오피킹·오배송 방지',
    tags: ['실수방지'],
    items: [
      { risk: '오피킹', device: '스캔 강제', type: '방지형', check: '미스캔 출고 불가' },
      { risk: '수량 오류', device: '중량/카운트 검수', type: '검출형', check: '불일치 시 재검수' },
      { risk: '라벨 오류', device: '송장-주문 매칭', type: '방지형', check: '불일치 시 출력 차단' }
    ]
  },
  {
    id: 'hc_poka',
    industry: 'healthcare',
    name: '의료 포카요케',
    desc: '환자·투약 확인 실수 방지',
    tags: ['환자안전'],
    items: [
      { risk: '환자 오인', device: '2식별자 바코드', type: '방지형', check: '미매칭 시 투약 잠금' },
      { risk: '용량 오류', device: '처방-약품 스캔', type: '방지형', check: '불일치 시 경고' },
      { risk: '기록 누락', device: '필수 기록 프롬프트', type: '검출형', check: '미기록 시 인수인계 불가' }
    ]
  }
];

const byIndustry = (list, industryId) => {
  const filtered = list.filter(t => t.industry === industryId);
  return filtered.length ? filtered : list.filter(t => t.industry === 'manufacturing');
};

export const getDoeTemplates = (industryId) => byIndustry(DOE_TEMPLATES, industryId);
export const getPilotTemplates = (industryId) => byIndustry(PILOT_TEMPLATES, industryId);
export const getPokaYokeTemplates = (industryId) => byIndustry(POKA_YOKE_TEMPLATES, industryId);
