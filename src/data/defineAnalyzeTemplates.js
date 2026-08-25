/**
 * Define / Analyze / Design 단계 업종별 템플릿
 *
 * 참고: 진단의 "고객불만/VOC"는 문제유형(problem type)이고,
 * 헌장·SIPOC 샘플은 선택한 업종(industry) 기준으로 골라집니다.
 */

const byIndustry = (list, industryId) => {
  const id = industryId || 'manufacturing';
  const filtered = list.filter(t => t.industry === id || t.industry === 'any');
  const hasIndustrySpecific = filtered.some(t => t.industry === id);
  if (hasIndustrySpecific) return filtered;
  // 해당 업종 전용 템플릿이 없을 때만 제조 + 공통(any)으로 폴백
  return list.filter(t => t.industry === 'manufacturing' || t.industry === 'any');
};

const isVocProblem = (problemTypes = []) =>
  problemTypes.some((p) => {
    const s = String(p).toLowerCase();
    return s.includes('complaint') || s.includes('voc') || s === 'customer_complaints';
  });

/** 빈 헌장 — 샘플을 쓰지 않고 직접 작성 */
export const BLANK_CHARTER_TEMPLATE = {
  id: 'blank_charter',
  industry: 'any',
  name: '빈 헌장 (직접 작성)',
  desc: '샘플 문구 없이 처음부터 작성',
  tags: ['blank'],
  projectTitle: '',
  businessCase: '',
  problemStatement: '',
  goal: '',
  scopeIn: '',
  scopeOut: '',
  financialBenefits: ''
};

export const CHARTER_TEMPLATES = [
  {
    id: 'mfg_charter',
    industry: 'manufacturing',
    name: '제조 품질 개선 헌장',
    desc: '불량률·치수·외관 중심',
    tags: ['quality', 'defect'],
    projectTitle: '사출 공정 불량률 저감 프로젝트',
    businessCase: '고객 클레임과 재작업 비용이 증가하고 있어 품질 경쟁력과 원가에 직접 영향을 미칩니다.',
    problemStatement: '최근 3개월 최종검사 불량률이 목표 대비 높게 유지되며, 주요 결함은 표면·치수 관련입니다.',
    goal: '6개월 내 불량률을 목표 수준 이하로 낮추고, 연간 품질비용을 유의미하게 절감한다.',
    scopeIn: '대상 라인/제품군, 사출~최종검사 공정',
    scopeOut: '신규 금형 설계, 타 제품 제품',
    financialBenefits: '재작업·스크랩·클레임 비용 절감 예상'
  },
  {
    id: 'mfg_voc_charter',
    industry: 'manufacturing',
    name: '고객불만·VOC 개선 헌장',
    desc: '클레임·CS·재발 방지',
    tags: ['voc', 'complaint'],
    projectTitle: '고객 클레임·VOC 재발 방지 프로젝트',
    businessCase: '고객불만·클레임이 증가하여 브랜드 신뢰와 재구매·재계약에 영향을 미칩니다.',
    problemStatement: '동일/유사 VOC가 반복되고, 접수~원인규명~시정조치까지 리드타임과 재발률이 목표를 초과합니다.',
    goal: '6개월 내 반복 클레임률 50% 감소, VOC 종결 리드타임 목표 달성',
    scopeIn: 'VOC 접수~분류~원인분석~시정/예방조치~고객 회신',
    scopeOut: '신규 제품 라인 런칭, 가격·계약 정책 변경',
    financialBenefits: '클레임·반품·보상 비용 절감 및 이탈 방지'
  },
  {
    id: 'dfss_charter',
    industry: 'any',
    name: 'DFSS 신규 설계 헌장',
    desc: '요구사항→CTQ→설계 검증',
    tags: ['dfss', 'design'],
    projectTitle: '고객 요구 기반 신규 프로세스/제품 설계',
    businessCase: '기존 프로세스 개선만으로는 VOC·요구사항을 충족하기 어려워, 설계 단계에서 품질을 내재화할 필요가 있습니다.',
    problemStatement: '현재 제공물/프로세스가 핵심 고객 요구(CTQ)를 안정적으로 충족하지 못하며, 재설계·신규 설계가 필요합니다.',
    goal: 'DMADV 일정 내 CTQ 스펙 달성 및 파일럿 검증 통과',
    scopeIn: 'VOC/CTQ 정의, 콘셉트·상세설계, 검증·파일럿',
    scopeOut: '기존 라인의 일상 트러블슈팅(운영 개선은 DMAIC)',
    financialBenefits: '출시 후 클레임·재작업 예방, 재설계 비용 회피'
  },
  {
    id: 'svc_charter',
    industry: 'service_office',
    name: '서비스 리드타임 개선 헌장',
    desc: 'SLA·재작업·대기시간',
    tags: ['sla', 'leadtime'],
    projectTitle: '고객요청 처리 리드타임 단축',
    businessCase: 'SLA 미준수가 고객 만족도와 재계약에 영향을 줍니다.',
    problemStatement: '요청 접수부터 완료까지 대기·핸드오프 지연이 반복됩니다.',
    goal: '3개월 내 SLA 준수율 ≥90%, 재작업률 ≤5% 달성',
    scopeIn: '고객센터/백오피스 처리 프로세스',
    scopeOut: '요금정책·상품기획',
    financialBenefits: '이탈 방지 및 처리 생산성 향상'
  },
  {
    id: 'svc_voc_charter',
    industry: 'service_office',
    name: '고객불만·VOC 개선 헌장',
    desc: '불만 접수·재발·CSAT',
    tags: ['voc', 'complaint'],
    projectTitle: '고객불만 처리 품질 및 재발 방지',
    businessCase: '고객불만 증가와 낮은 1차 해결률이 CSAT·이탈에 직접 영향을 줍니다.',
    problemStatement: '불만 유형별 재발이 반복되고, 에스컬레이션·핸드오프로 종결이 지연됩니다.',
    goal: '분기 내 재발 불만 40% 감소, FCR(1차 해결률) 향상',
    scopeIn: '불만 접수~분류~해결~사후관리',
    scopeOut: '상품/요금 정책 자체 변경',
    financialBenefits: '이탈 방지, CS 인건비·보상비 절감'
  },
  {
    id: 'it_charter',
    industry: 'it_ops',
    name: 'IT 변경실패율 개선 헌장',
    desc: '배포·장애·MTTR',
    projectTitle: '배포 변경실패율 및 MTTR 개선',
    businessCase: '변경 실패와 장애가 서비스 가용성과 운영비용을 악화시킵니다.',
    problemStatement: '배포 후 롤백·핫픽스가 빈번하고 평균 복구시간이 목표를 초과합니다.',
    goal: '분기 내 변경실패율 50% 감소, MTTR 목표 달성',
    scopeIn: 'CI/CD 파이프라인, 카나리 배포, 모니터링',
    scopeOut: '신규 제품 기능 개발',
    financialBenefits: '장애 대응 인건비·기회손실 감소'
  },
  {
    id: 'log_charter',
    industry: 'logistics',
    name: '물류 피킹 정확도 헌장',
    desc: '피킹오류·리드타임',
    projectTitle: '피킹 오류율 및 출고 리드타임 개선',
    businessCase: '피킹 오류는 반품·재출고 비용을 유발합니다.',
    problemStatement: '존/웨이브 피킹 구간에서 스캔 누락과 동선 낭비가 반복됩니다.',
    goal: '2개월 내 피킹 오류율 목표 이하, 출고 SLA 준수율 향상',
    scopeIn: '창고 피킹~패킹~출고',
    scopeOut: '운송사 SLA, 입고 발주',
    financialBenefits: '재출고·반품 비용 절감'
  },
  {
    id: 'hc_charter',
    industry: 'healthcare',
    name: '환자대기·핸드오프 개선 헌장',
    desc: '대기시간·인수인계',
    projectTitle: '외래/병동 환자 대기시간 단축',
    businessCase: '대기시간과 인수인계 누락은 환자 안전·만족도에 영향을 줍니다.',
    problemStatement: '검사 대기와 부서 간 핸드오프에서 정보 누락·지연이 발생합니다.',
    goal: '분기 내 평균 대기시간 20% 단축, 핸드오프 체크리스트 준수율 ≥95%',
    scopeIn: '외래접수~검사~병동 인수인계',
    scopeOut: '진료 프로토콜 변경',
    financialBenefits: '재방문·민원 감소, 병상 회전율 개선'
  }
];

export const SIPOC_TEMPLATES = [
  {
    id: 'mfg_sipoc',
    industry: 'manufacturing',
    name: '사출/조립 SIPOC',
    desc: '원료→사출→검사',
    supplier: '원자재/부품 공급사, 금형 보수 협력사',
    input: '원료, 부품, 도면, 작업지시서',
    process: '투입 → 가공/사출 → 검사 → 포장',
    output: '완성품, 검사성적서, 불량 분리품',
    customer: '조립라인, OEM, 품질보증'
  },
  {
    id: 'svc_sipoc',
    industry: 'service_office',
    name: '고객요청 처리 SIPOC',
    desc: '접수→처리→회신',
    supplier: '고객, 영업, 유관부서',
    input: '요청티켓, 증빙, 정책/FAQ',
    process: '접수 → 분류 → 처리 → 검수 → 회신',
    output: '처리결과, 이력, 만족도 피드백',
    customer: '최종고객, 내부 요청자'
  },
  {
    id: 'it_sipoc',
    industry: 'it_ops',
    name: '변경배포 SIPOC',
    desc: '개발→배포→모니터링',
    supplier: '개발팀, 인프라, 보안',
    input: '변경요청, 코드, 테스트결과, 릴리즈노트',
    process: '빌드 → 테스트 → 카나리 → 전면배포 → 모니터링',
    output: '배포버전, 메트릭, 장애티켓',
    customer: '서비스 사용자, 사업부'
  },
  {
    id: 'log_sipoc',
    industry: 'logistics',
    name: '출고 피킹 SIPOC',
    desc: '주문→피킹→출고',
    supplier: '입고팀, WMS, 운송사',
    input: '주문, 재고위치, 피킹리스트',
    process: '할당 → 피킹 → 검수 → 패킹 → 출고',
    output: '출고박스, 송장, 출고실적',
    customer: '수취인, CS, 운송사'
  },
  {
    id: 'hc_sipoc',
    industry: 'healthcare',
    name: '검사/핸드오프 SIPOC',
    desc: '접수→검사→인수인계',
    supplier: '진료과, 검사실, 간호',
    input: '처방, 환자ID, 검체/차트',
    process: '접수 → 대기 → 검사 → 결과 → 인수인계',
    output: '검사결과, 인수인계기록, 처치지시',
    customer: '환자, 담당의, 병동'
  }
];

export const FISHBONE_TEMPLATES = [
  {
    id: 'mfg_fish',
    industry: 'manufacturing',
    name: '제조 불량 4M1E',
    desc: '사출/가공 품질',
    fishbone: {
      man: ['숙련도 편차', '교대 인수인계 누락', '자주검사 생략'],
      machine: ['온도센서 드리프트', '냉각수 유량 불안정', '금형 마모'],
      material: ['원료 수분율', 'LOT 편차', '이형제 과다'],
      method: ['냉각시간 단축 관행', '설정값 허용폭 과다', 'SOP 미준수'],
      measurement: ['게이지 미교정', '측정위치 불일치', '검사기준 모호'],
      environment: ['온습도 변동', '먼지/이물', '조도 부족']
    }
  },
  {
    id: 'svc_fish',
    industry: 'service_office',
    name: '서비스 지연 4M1E',
    desc: '리드타임/재작업',
    fishbone: {
      man: ['교육 부족', '담당자 편중', '커뮤니케이션 누락'],
      machine: ['시스템 느림', '양식 중복', '알림 미작동'],
      material: ['입력정보 부족', '증빙 누락', '정책문서 구버전'],
      method: ['승인단계 과다', '우선순위 규칙 부재', '핸드오프 기준 모호'],
      measurement: ['SLA 정의 불명확', '티켓분류 오류', 'KPI 집계 지연'],
      environment: ['피크타임', '인력부족', '채널 혼선']
    }
  },
  {
    id: 'it_fish',
    industry: 'it_ops',
    name: '배포실패 4M1E',
    desc: '변경/장애',
    fishbone: {
      man: ['리뷰 누락', '온콜 미숙', '런북 미숙지'],
      machine: ['파이프라인 불안정', '환경 차이', '모니터링 공백'],
      material: ['의존성 버전충돌', '설정값 오류', '마이그레이션 누락'],
      method: ['카나리 비율 과다', '롤백 절차 미흡', '변경창 미준수'],
      measurement: ['알람 임계값 부적절', '로그 부족', '성공기준 모호'],
      environment: ['트래픽 피크', '타팀 변경 충돌', '클라우드 한도']
    }
  },
  {
    id: 'log_fish',
    industry: 'logistics',
    name: '피킹오류 4M1E',
    desc: '창고 출고',
    fishbone: {
      man: ['스캔 누락', '교육 미흡', '동선 숙지 부족'],
      machine: ['스캐너 오류', '라벨프린터 불량', 'WMS 지연'],
      material: ['바코드 훼손', '유사SKU 혼재', '포장재 부족'],
      method: ['웨이브 규칙 비효율', '검수 생략', '배치 피킹 혼선'],
      measurement: ['위치정확도 미검증', '오류 KPI 지연', '샘플검수 비율'],
      environment: ['조명', '혼잡 구간', '온도/소음']
    }
  },
  {
    id: 'hc_fish',
    industry: 'healthcare',
    name: '대기·핸드오프 4M1E',
    desc: '환자안전',
    fishbone: {
      man: ['인수인계 누락', '역할 불명확', '교육 미이수'],
      machine: ['EMR 지연', '호출시스템 장애', '장비 대기'],
      material: ['환자ID 오류', '검체 라벨', '차트 미비'],
      method: ['체크리스트 미사용', '우선순위 규칙', '동선 비효율'],
      measurement: ['대기시간 미측정', '핸드오프 준수율', '재작업 미집계'],
      environment: ['피크 시간대', '병상 부족', '공간 혼잡']
    }
  }
];

export const WHY5_TEMPLATES = [
  {
    id: 'mfg_why',
    industry: 'manufacturing',
    name: '제조 불량 5Why',
    desc: '공정 산포 → 표준화 부재',
    steps: [
      { question: '왜 최종 불량률이 높은가?', answer: '표면·치수 관련 결함이 다수를 차지한다.' },
      { question: '왜 표면·치수 결함이 많은가?', answer: '공정 조건(온도/냉각) 산포가 크다.' },
      { question: '왜 공정 조건 산포가 큰가?', answer: '허용범위가 넓고 설정이 경험적으로 변경된다.' },
      { question: '왜 경험적으로 변경되는가?', answer: 'SPC·SOP·인터록이 약하다.' },
      { question: '왜 관리체계가 약한가?', answer: '예방보전과 표준작업이 체계화되지 않았다.' }
    ]
  },
  {
    id: 'svc_why',
    industry: 'service_office',
    name: 'SLA 미준수 5Why',
    desc: '대기·핸드오프',
    steps: [
      { question: '왜 SLA를 자주 놓치는가?', answer: '처리 대기시간이 길다.' },
      { question: '왜 대기시간이 긴가?', answer: '분류·승인 핸드오프가 많다.' },
      { question: '왜 핸드오프가 많은가?', answer: '역할/우선순위 규칙이 불명확하다.' },
      { question: '왜 규칙이 불명확한가?', answer: '표준 프로세스와 체크리스트가 없다.' },
      { question: '왜 표준이 없는가?', answer: '프로세스 설계·교육이 체계화되지 않았다.' }
    ]
  },
  {
    id: 'it_why',
    industry: 'it_ops',
    name: '배포실패 5Why',
    desc: '카나리·롤백',
    steps: [
      { question: '왜 변경실패가 잦은가?', answer: '배포 후 장애·롤백이 발생한다.' },
      { question: '왜 장애가 발생하는가?', answer: '환경 차이와 검증 공백이 있다.' },
      { question: '왜 검증 공백이 있는가?', answer: '카나리/자동테스트 범위가 부족하다.' },
      { question: '왜 범위가 부족한가?', answer: '성공기준과 가드레일이 약하다.' },
      { question: '왜 가드레일이 약한가?', answer: '변경관리 표준과 런북이 미흡하다.' }
    ]
  },
  {
    id: 'log_why',
    industry: 'logistics',
    name: '피킹오류 5Why',
    desc: '스캔·동선',
    steps: [
      { question: '왜 피킹 오류가 발생하는가?', answer: '잘못된 SKU/수량이 집품된다.' },
      { question: '왜 잘못된 집품이 되는가?', answer: '스캔 누락과 유사SKU 혼동이 있다.' },
      { question: '왜 스캔 누락이 되는가?', answer: '강제 스캔 인터록이 없다.' },
      { question: '왜 인터록이 없는가?', answer: '표준작업과 시스템 가드가 약하다.' },
      { question: '왜 표준이 약한가?', answer: '오류 분석 후 포카요케가 정착되지 않았다.' }
    ]
  },
  {
    id: 'hc_why',
    industry: 'healthcare',
    name: '대기지연 5Why',
    desc: '핸드오프·정보',
    steps: [
      { question: '왜 환자 대기가 긴가?', answer: '검사/인수인계 구간에서 지연된다.' },
      { question: '왜 인수인계가 지연되는가?', answer: '필수 정보 누락으로 재확인이 발생한다.' },
      { question: '왜 정보가 누락되는가?', answer: '체크리스트 없이 구두 인계한다.' },
      { question: '왜 구두 인계에 의존하는가?', answer: '표준 핸드오프 절차가 약하다.' },
      { question: '왜 표준이 약한가?', answer: '교육·모니터링·책임이 명확하지 않다.' }
    ]
  }
];

export const FMEA_TEMPLATES = [
  {
    id: 'mfg_fmea',
    industry: 'manufacturing',
    name: '사출 공정 FMEA',
    desc: '온도·냉각·검사',
    items: [
      { process: '사출', failureMode: '온도 과다', effect: '표면 불량·치수 이탈', cause: '센서 드리프트/설정폭', s: 8, o: 6, d: 5, action: '센서교정 + 245±3℃ 고정' },
      { process: '냉각', failureMode: '냉각시간 부족', effect: '변형·치수 산포', cause: '경험적 단축', s: 7, o: 5, d: 4, action: '30초 타이머 인터록' },
      { process: '검사', failureMode: '스크래치 미검출', effect: '고객 클레임', cause: '조도/한계견본 부재', s: 9, o: 4, d: 6, action: '한계견본+조도기준' }
    ]
  },
  {
    id: 'svc_fmea',
    industry: 'service_office',
    name: '요청처리 FMEA',
    desc: '분류·승인·회신',
    items: [
      { process: '분류', failureMode: '잘못된 큐 배정', effect: 'SLA 지연', cause: '분류기준 모호', s: 6, o: 5, d: 4, action: '분류 룰북+자동분류' },
      { process: '승인', failureMode: '승인 대기 장기화', effect: '고객 불만', cause: '승인자 부재', s: 7, o: 6, d: 3, action: '대리승인/에스컬레이션' },
      { process: '회신', failureMode: '오안내', effect: '재문의·재작업', cause: '템플릿/검수 부재', s: 8, o: 4, d: 5, action: '회신 템플릿+2인 검수' }
    ]
  },
  {
    id: 'it_fmea',
    industry: 'it_ops',
    name: '배포 FMEA',
    desc: '빌드·카나리·롤백',
    items: [
      { process: '배포', failureMode: '카나리 비율 과다', effect: '광범위 장애', cause: '가드레일 미흡', s: 9, o: 4, d: 4, action: '5% 시작+자동중단' },
      { process: '모니터링', failureMode: '알람 지연', effect: 'MTTR 증가', cause: '임계값 부적절', s: 8, o: 5, d: 5, action: 'SLO 기반 알람 재설정' },
      { process: '롤백', failureMode: '롤백 실패', effect: '장시간 장애', cause: '런북/권한 문제', s: 9, o: 3, d: 4, action: '자동롤백+권한점검' }
    ]
  },
  {
    id: 'log_fmea',
    industry: 'logistics',
    name: '피킹 FMEA',
    desc: '스캔·검수',
    items: [
      { process: '피킹', failureMode: '스캔 누락', effect: '오출고', cause: '강제스캔 없음', s: 8, o: 5, d: 4, action: '스캔 인터록' },
      { process: '검수', failureMode: '수량 오검수', effect: '클레임', cause: '샘플검수 비율 낮음', s: 7, o: 4, d: 5, action: '고위험 SKU 전수검수' },
      { process: '패킹', failureMode: '송장 오부착', effect: '오배송', cause: '라벨 매칭 미검증', s: 9, o: 3, d: 4, action: '송장-주문 바코드 매칭' }
    ]
  },
  {
    id: 'hc_fmea',
    industry: 'healthcare',
    name: '핸드오프 FMEA',
    desc: '환자ID·인수인계',
    items: [
      { process: '접수', failureMode: '환자ID 오류', effect: '검사/투약 오류', cause: '이중확인 누락', s: 10, o: 3, d: 4, action: '2식별자 확인 강제' },
      { process: '인수인계', failureMode: '필수정보 누락', effect: '처치 지연', cause: '체크리스트 미사용', s: 8, o: 5, d: 4, action: '표준 체크리스트' },
      { process: '검사', failureMode: '결과 지연', effect: '대기증가', cause: '우선순위 규칙 부재', s: 6, o: 5, d: 3, action: '응급/일반 큐 분리' }
    ]
  }
];

export const DESIGN_SPEC_TEMPLATES = [
  {
    id: 'mfg_design',
    industry: 'manufacturing',
    name: '제품/공정 설계 스펙',
    desc: 'CTQ·공차·검증',
    title: '사출품 CTQ 설계 사양',
    requirements: '표면 품질, 치수 정밀도, 조립 적합성을 만족하는 공정 윈도우 정의',
    ctqSpecs: '두께 5.0±0.3mm, 스크래치 깊이 <0.1mm(≤2개), 색차 ΔE<2.0',
    constraints: '기존 금형 유지, 사이클타임 +5초 이내, 원가 상승 최소화',
    verification: 'DOE 최적조건 → 파일럿 2주 → MSA 재확인 → SPC 관리한계 설정',
    notes: '인터록(냉각시간)·센서교정 주기를 설계 산출물에 포함'
  },
  {
    id: 'svc_design',
    industry: 'service_office',
    name: '서비스 프로세스 설계',
    desc: 'SLA·핸드오프',
    title: '요청처리 프로세스 상세설계',
    requirements: 'SLA 준수, FCR 향상, 재작업 최소화',
    ctqSpecs: 'SLA 준수율 ≥90%, FCR ≥80%, 재작업률 ≤5%',
    constraints: '기존 인력 규모, 레거시 시스템 유지',
    verification: '2주 파일럿(멀티채널+우선순위 규칙) 후 KPI 비교',
    notes: '분류 룰북, 회신 템플릿, 에스컬레이션 경로 문서화'
  },
  {
    id: 'it_design',
    industry: 'it_ops',
    name: '배포 아키텍처 설계',
    desc: '카나리·가드레일',
    title: '안전 배포 설계 사양',
    requirements: '변경실패율·MTTR 목표 달성을 위한 배포 가드레일',
    ctqSpecs: '카나리 5%→20%, 자동롤백 On, 핵심 SLO 알람 <2분',
    constraints: '기존 파이프라인 확장, 다운타임 창 준수',
    verification: '스테이징 E2E + 카나리 파일럿 + 롤백 드릴',
    notes: '런북, 권한, 성공/중단 기준을 설계 문서에 명시'
  },
  {
    id: 'log_design',
    industry: 'logistics',
    name: '피킹 시스템 설계',
    desc: '동선·스캔 가드',
    title: '피킹/검수 상세설계',
    requirements: '피킹 오류율·출고 SLA 개선',
    ctqSpecs: '강제 스캔, 고위험 SKU 전수검수, 송장-주문 매칭',
    constraints: '현 WMS 커스터마이즈 범위, 장비 추가 최소화',
    verification: '존 단위 파일럿 2주, 오류유형별 전후 비교',
    notes: '표준작업, 예외처리, 교육자료를 산출물에 포함'
  },
  {
    id: 'hc_design',
    industry: 'healthcare',
    name: '핸드오프 프로토콜 설계',
    desc: '체크리스트·식별',
    title: '환자 인수인계 상세설계',
    requirements: '대기시간 단축과 인수인계 누락 방지',
    ctqSpecs: '2식별자 확인, 체크리스트 준수율 ≥95%, 평균 대기 20%↓',
    constraints: 'EMR 필드 확장 최소화, 임상 워크플로 유지',
    verification: '병동/외래 파일럿, 준수율·대기시간 모니터링',
    notes: '교육, 감사 주기, 예외 보고 경로 정의'
  }
];

/**
 * @param {string|null} industryId
 * @param {{ problemTypes?: string[], methodology?: string|null }} [opts]
 */
export const getCharterTemplates = (industryId, opts = {}) => {
  const { problemTypes = [], methodology } = opts;
  const base = byIndustry(CHARTER_TEMPLATES, industryId);
  const voc = isVocProblem(problemTypes);
  const isDfss = String(methodology || '').toLowerCase() === 'dfss';

  const score = (t) => {
    let s = 0;
    if (t.id === 'blank_charter') return -100;
    if (voc && (t.tags || []).includes('complaint')) s += 20;
    if (voc && (t.tags || []).includes('voc')) s += 20;
    if (isDfss && (t.tags || []).includes('dfss')) s += 15;
    if (!voc && (t.tags || []).includes('defect')) s += 5;
    return s;
  };

  const sorted = [...base].sort((a, b) => score(b) - score(a));
  return [BLANK_CHARTER_TEMPLATE, ...sorted.filter((t) => t.id !== 'blank_charter')];
};
export const getSipocTemplates = (industryId) => byIndustry(SIPOC_TEMPLATES, industryId);
export const getFishboneTemplates = (industryId) => byIndustry(FISHBONE_TEMPLATES, industryId);
export const getWhy5Templates = (industryId) => byIndustry(WHY5_TEMPLATES, industryId);
export const getFmeaTemplates = (industryId) => byIndustry(FMEA_TEMPLATES, industryId);
export const getDesignSpecTemplates = (industryId) => byIndustry(DESIGN_SPEC_TEMPLATES, industryId);
