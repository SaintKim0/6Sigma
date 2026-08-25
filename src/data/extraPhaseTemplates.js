/**
 * 잔여 단계 업종별 템플릿 (Pareto, Team, Process Map, Monitoring, Result, DFSS, Selection)
 */

const byIndustry = (list, industryId) => {
  const filtered = list.filter(t => t.industry === (industryId || 'manufacturing'));
  return filtered.length ? filtered : list.filter(t => t.industry === 'manufacturing');
};

const lid = (prefix, n) => `${prefix}-${n}`;

export const PARETO_TEMPLATES = [
  {
    id: 'mfg_pareto', industry: 'manufacturing', name: '제조 결함 파레토', desc: '외관·치수·기능',
    items: [
      { category: '표면 스크래치', count: 48 },
      { category: '치수 이탈', count: 22 },
      { category: '색상 편차', count: 12 },
      { category: '변형/휨', count: 8 },
      { category: '기타', count: 5 }
    ]
  },
  {
    id: 'svc_pareto', industry: 'service_office', name: '서비스 지연 파레토', desc: '대기·재작업',
    items: [
      { category: '승인 대기', count: 40 },
      { category: '정보 누락 재작업', count: 25 },
      { category: '잘못된 분류', count: 18 },
      { category: '시스템 지연', count: 10 },
      { category: '기타', count: 7 }
    ]
  },
  {
    id: 'it_pareto', industry: 'it_ops', name: '변경실패 파레토', desc: '배포·설정',
    items: [
      { category: '설정/환경 차이', count: 35 },
      { category: '테스트 공백', count: 28 },
      { category: '의존성 충돌', count: 15 },
      { category: '롤백 실패', count: 12 },
      { category: '기타', count: 10 }
    ]
  },
  {
    id: 'log_pareto', industry: 'logistics', name: '피킹오류 파레토', desc: '스캔·유사SKU',
    items: [
      { category: '스캔 누락', count: 42 },
      { category: '유사 SKU 혼동', count: 24 },
      { category: '위치 오류', count: 16 },
      { category: '수량 오집품', count: 11 },
      { category: '기타', count: 7 }
    ]
  },
  {
    id: 'hc_pareto', industry: 'healthcare', name: '대기지연 파레토', desc: '핸드오프·대기',
    items: [
      { category: '검사 대기', count: 38 },
      { category: '인수인계 누락', count: 22 },
      { category: '환자ID 재확인', count: 15 },
      { category: '장비 대기', count: 14 },
      { category: '기타', count: 11 }
    ]
  }
];

export const TEAM_TEMPLATES = [
  {
    id: 'mfg_team', industry: 'manufacturing', name: '제조 품질 개선팀', desc: 'Champion·BB·생산·품질',
    team: [
      { name: '', role: 'Champion' },
      { name: '', role: 'Black Belt' },
      { name: '', role: 'Green Belt' },
      { name: '', role: 'SME' },
      { name: '', role: 'SME' }
    ],
    timelineMonths: 6
  },
  {
    id: 'svc_team', industry: 'service_office', name: '서비스 개선팀', desc: '운영·CS·품질',
    team: [
      { name: '', role: 'Champion' },
      { name: '', role: 'Black Belt' },
      { name: '', role: 'Green Belt' },
      { name: '', role: 'SME' }
    ],
    timelineMonths: 3
  },
  {
    id: 'it_team', industry: 'it_ops', name: 'SRE/배포 개선팀', desc: 'DevOps·SRE·개발',
    team: [
      { name: '', role: 'Champion' },
      { name: '', role: 'Black Belt' },
      { name: '', role: 'Green Belt' },
      { name: '', role: 'SME' },
      { name: '', role: 'SME' }
    ],
    timelineMonths: 4
  },
  {
    id: 'log_team', industry: 'logistics', name: '물류 출고 개선팀', desc: '창고·WMS·CS',
    team: [
      { name: '', role: 'Champion' },
      { name: '', role: 'Black Belt' },
      { name: '', role: 'Green Belt' },
      { name: '', role: 'SME' }
    ],
    timelineMonths: 2
  },
  {
    id: 'hc_team', industry: 'healthcare', name: '환자안전 개선팀', desc: '간호·원무·품질',
    team: [
      { name: '', role: 'Champion' },
      { name: '', role: 'Black Belt' },
      { name: '', role: 'Green Belt' },
      { name: '', role: 'SME' },
      { name: '', role: 'SME' }
    ],
    timelineMonths: 3
  }
];

export const SWIMLANE_TEMPLATES = [
  {
    id: 'mfg_swim', industry: 'manufacturing', name: '사출 라인 스윔레인', desc: '자재→생산→품질',
    lanes: [
      { id: lid('m1', 1), title: '자재', cards: [{ id: lid('c', 1), text: '원료 입고/건조', type: 'process' }, { id: lid('c', 2), text: 'LOT 투입', type: 'process' }] },
      { id: lid('m1', 2), title: '생산', cards: [{ id: lid('c', 3), text: '사출/냉각', type: 'process' }, { id: lid('c', 4), text: '취출', type: 'process' }] },
      { id: lid('m1', 3), title: '품질', cards: [{ id: lid('c', 5), text: '자주검사', type: 'decision' }, { id: lid('c', 6), text: '최종검사', type: 'decision' }] }
    ]
  },
  {
    id: 'svc_swim', industry: 'service_office', name: '요청처리 스윔레인', desc: 'CS→운영→승인',
    lanes: [
      { id: lid('s1', 1), title: 'CS', cards: [{ id: lid('c', 11), text: '접수/분류', type: 'process' }, { id: lid('c', 12), text: '고객 회신', type: 'process' }] },
      { id: lid('s1', 2), title: '운영', cards: [{ id: lid('c', 13), text: '처리', type: 'process' }, { id: lid('c', 14), text: '검수', type: 'decision' }] },
      { id: lid('s1', 3), title: '승인', cards: [{ id: lid('c', 15), text: '예외 승인', type: 'decision' }] }
    ]
  },
  {
    id: 'it_swim', industry: 'it_ops', name: '배포 스윔레인', desc: '개발→CI→SRE',
    lanes: [
      { id: lid('i1', 1), title: '개발', cards: [{ id: lid('c', 21), text: 'PR/리뷰', type: 'process' }] },
      { id: lid('i1', 2), title: 'CI/CD', cards: [{ id: lid('c', 22), text: '빌드/테스트', type: 'process' }, { id: lid('c', 23), text: '카나리', type: 'decision' }] },
      { id: lid('i1', 3), title: 'SRE', cards: [{ id: lid('c', 24), text: '모니터링', type: 'process' }, { id: lid('c', 25), text: '롤백 판단', type: 'decision' }] }
    ]
  },
  {
    id: 'log_swim', industry: 'logistics', name: '출고 스윔레인', desc: '할당→피킹→패킹',
    lanes: [
      { id: lid('l1', 1), title: '기획', cards: [{ id: lid('c', 31), text: '주문 할당', type: 'process' }] },
      { id: lid('l1', 2), title: '피킹', cards: [{ id: lid('c', 32), text: '집품/스캔', type: 'process' }, { id: lid('c', 33), text: '검수', type: 'decision' }] },
      { id: lid('l1', 3), title: '패킹', cards: [{ id: lid('c', 34), text: '포장/송장', type: 'process' }, { id: lid('c', 35), text: '출고', type: 'process' }] }
    ]
  },
  {
    id: 'hc_swim', industry: 'healthcare', name: '검사·핸드오프 스윔레인', desc: '접수→검사→병동',
    lanes: [
      { id: lid('h1', 1), title: '원무/접수', cards: [{ id: lid('c', 41), text: '접수/환자확인', type: 'process' }] },
      { id: lid('h1', 2), title: '검사실', cards: [{ id: lid('c', 42), text: '검사 수행', type: 'process' }, { id: lid('c', 43), text: '결과 입력', type: 'process' }] },
      { id: lid('h1', 3), title: '병동/진료', cards: [{ id: lid('c', 44), text: '인수인계', type: 'decision' }, { id: lid('c', 45), text: '처치', type: 'process' }] }
    ]
  }
];

export const MONITORING_TEMPLATES = [
  {
    id: 'mfg_mon', industry: 'manufacturing', name: '제조 KPI 모니터링', desc: '불량·SPC·클레임',
    kpis: [
      { name: '불량률(%)', target: '≤ 5%', frequency: '일일', owner: '품질', escalation: '2일 연속 초과 시 Champion 보고' },
      { name: 'Cpk(두께)', target: '≥ 1.33', frequency: '주간', owner: '공정기술', escalation: '1.0 미만 시 라인스탑 검토' },
      { name: '고객 클레임', target: '월 ≤ 1건', frequency: '주간', owner: 'QA', escalation: '중대 클레임 24h 대응' }
    ]
  },
  {
    id: 'svc_mon', industry: 'service_office', name: 'SLA 모니터링', desc: '준수율·재작업',
    kpis: [
      { name: 'SLA 준수율', target: '≥ 90%', frequency: '일일', owner: '운영', escalation: '85% 미만 시 인력재배치' },
      { name: '재작업률', target: '≤ 5%', frequency: '주간', owner: '품질', escalation: '원인 Pareto 회의' },
      { name: 'FCR', target: '≥ 80%', frequency: '주간', owner: 'CS리더', escalation: '교육/템플릿 보강' }
    ]
  },
  {
    id: 'it_mon', industry: 'it_ops', name: 'SRE 모니터링', desc: '가용성·MTTR',
    kpis: [
      { name: '가용성', target: '≥ 99.9%', frequency: '실시간', owner: 'SRE', escalation: 'On-call 소집' },
      { name: 'MTTR', target: '≤ 목표', frequency: '건별', owner: 'SRE', escalation: '포스트모템' },
      { name: '변경실패율', target: '≤ 5%', frequency: '주간', owner: 'DevOps', escalation: '배포 동결' }
    ]
  },
  {
    id: 'log_mon', industry: 'logistics', name: 'OTIF 모니터링', desc: '피킹·출고',
    kpis: [
      { name: '피킹 정확도', target: '≥ 99.5%', frequency: '일일', owner: '창고', escalation: '오류 SKU 전수검수' },
      { name: 'OTIF', target: '≥ 95%', frequency: '일일', owner: '물류기획', escalation: '병목 분석' },
      { name: '오배송률', target: '≤ 0.5%', frequency: '주간', owner: 'CS', escalation: '라벨/주소 점검' }
    ]
  },
  {
    id: 'hc_mon', industry: 'healthcare', name: '환자안전 모니터링', desc: '대기·핸드오프',
    kpis: [
      { name: '평균 대기시간', target: '20%↓', frequency: '일일', owner: '원무', escalation: '병목 구간 조정' },
      { name: '핸드오프 준수율', target: '≥ 95%', frequency: '일일', owner: '간호', escalation: '즉시 코칭' },
      { name: '환자ID 오류', target: '0건', frequency: '일일', owner: '품질', escalation: '즉시 보고' }
    ]
  }
];

export const RESULT_TEMPLATES = [
  {
    id: 'mfg_res', industry: 'manufacturing', name: '제조 성과 요약', desc: '불량·DPMO·비용',
    metrics: [
      { name: '불량률', before: '15.2%', after: '4.8%', note: '목표 5% 달성' },
      { name: 'DPMO', before: '152,000', after: '48,000', note: '~4.1σ' },
      { name: '연간 품질비용', before: '기준', after: '약 2.4억 절감', note: '' }
    ],
    summary: '파일럿·전면적용 후 공정이 안정화되었고, SPC·SOP·교육을 통해 성과를 유지한다.'
  },
  {
    id: 'svc_res', industry: 'service_office', name: '서비스 성과 요약', desc: 'SLA·FCR',
    metrics: [
      { name: 'SLA 준수율', before: '72%', after: '92%', note: '' },
      { name: '재작업률', before: '12%', after: '4%', note: '' },
      { name: 'FCR', before: '65%', after: '83%', note: '' }
    ],
    summary: '우선순위 규칙·템플릿·에스컬레이션으로 리드타임과 재작업이 개선되었다.'
  },
  {
    id: 'it_res', industry: 'it_ops', name: 'IT 성과 요약', desc: '실패율·MTTR',
    metrics: [
      { name: '변경실패율', before: '12%', after: '4%', note: '' },
      { name: 'MTTR', before: '90분', after: '35분', note: '' },
      { name: '가용성', before: '99.5%', after: '99.95%', note: '' }
    ],
    summary: '카나리·자동롤백·알람 재설정으로 변경 리스크와 복구시간이 개선되었다.'
  },
  {
    id: 'log_res', industry: 'logistics', name: '물류 성과 요약', desc: '정확도·OTIF',
    metrics: [
      { name: '피킹 오류율', before: '1.8%', after: '0.4%', note: '' },
      { name: 'OTIF', before: '88%', after: '96%', note: '' },
      { name: '재출고 비용', before: '기준', after: '60%↓', note: '' }
    ],
    summary: '강제 스캔·고위험 SKU 전수검수로 오출고가 감소했다.'
  },
  {
    id: 'hc_res', industry: 'healthcare', name: '의료 성과 요약', desc: '대기·준수율',
    metrics: [
      { name: '평균 대기', before: '기준', after: '22%↓', note: '' },
      { name: '핸드오프 준수율', before: '70%', after: '96%', note: '' },
      { name: '환자ID 재확인', before: '잦음', after: '거의 없음', note: '' }
    ],
    summary: '체크리스트·2식별자 확인으로 안전성과 흐름이 개선되었다.'
  }
];

export const ALTERNATIVES_TEMPLATES = [
  {
    id: 'mfg_alt', industry: 'manufacturing', name: '공정/제품 설계 대안', desc: 'A/B/C 비교',
    options: [
      { name: 'A안: 기존 금형+공정윈도우 최적화', pros: '투자 최소, 빠른 적용', cons: '설계 한계 존재', score: 85 },
      { name: 'B안: 금형 부분 개조', pros: '치수 안정성↑', cons: '비용·리드타임', score: 70 },
      { name: 'C안: 신규 금형', pros: '장기 최적', cons: '고비용', score: 55 }
    ],
    decision: 'A안 선정: DOE로 공정윈도우 확정 후 파일럿 검증'
  },
  {
    id: 'svc_alt', industry: 'service_office', name: '서비스 프로세스 대안', desc: '채널·승인',
    options: [
      { name: 'A안: 멀티채널+자동분류', pros: '처리량↑', cons: '초기 룰 정비', score: 88 },
      { name: 'B안: 승인단계 축소', pros: '리드타임↓', cons: '리스크 관리 필요', score: 75 },
      { name: 'C안: 인력 증원', pros: '즉시 효과', cons: '비용 지속', score: 50 }
    ],
    decision: 'A안+B안 조합으로 파일럿'
  },
  {
    id: 'it_alt', industry: 'it_ops', name: '배포전략 대안', desc: '카나리·블루그린',
    options: [
      { name: 'A안: 카나리 5%+자동롤백', pros: '리스크↓', cons: '관측성 필요', score: 90 },
      { name: 'B안: 블루/그린', pros: '빠른 전환', cons: '인프라 비용', score: 72 },
      { name: 'C안: 주말 일괄배포', pros: '단순', cons: '장애영향 큼', score: 40 }
    ],
    decision: 'A안 채택, SLO 알람 강화'
  },
  {
    id: 'log_alt', industry: 'logistics', name: '피킹방식 대안', desc: '존/웨이브',
    options: [
      { name: 'A안: 강제스캔+존피킹', pros: '오류↓', cons: '초기 속도↓', score: 86 },
      { name: 'B안: 웨이브+배치스캔', pros: '생산성↑', cons: '혼동 위험', score: 68 },
      { name: 'C안: 자동화 도입', pros: '장기 효과', cons: '고투자', score: 45 }
    ],
    decision: 'A안 파일럿 후 확대'
  },
  {
    id: 'hc_alt', industry: 'healthcare', name: '핸드오프 대안', desc: '체크리스트·전자',
    options: [
      { name: 'A안: 표준 체크리스트', pros: '즉시 적용', cons: '준수 관리 필요', score: 88 },
      { name: 'B안: EMR 강제필드', pros: '누락 방지', cons: 'IT 개발', score: 70 },
      { name: 'C안: 전담 코디네이터', pros: '흐름 개선', cons: '인력 비용', score: 55 }
    ],
    decision: 'A안 우선, B안 병행 검토'
  }
];

export const PILOT_VERIFY_TEMPLATES = [
  {
    id: 'mfg_pv', industry: 'manufacturing', name: '시제품/파일럿 검증', desc: 'CTQ 검증',
    items: [
      { ctq: '두께', method: '게이지 n=50', criteria: '5.0±0.3mm', result: '합격', note: '' },
      { ctq: '스크래치', method: '한계견본', criteria: '≤2개', result: '합격', note: '' },
      { ctq: '조립성', method: '샘플 조립', criteria: '간섭 없음', result: '합격', note: '' }
    ],
    conclusion: '설계/공정 스펙이 목표 성능을 만족함. 양산 전환 승인 권고.'
  },
  {
    id: 'svc_pv', industry: 'service_office', name: '프로세스 파일럿 검증', desc: 'SLA 검증',
    items: [
      { ctq: 'SLA 준수율', method: '2주 파일럿', criteria: '≥90%', result: '합격', note: '' },
      { ctq: '재작업률', method: '티켓 태그', criteria: '≤5%', result: '합격', note: '' }
    ],
    conclusion: '신규 프로세스 설계가 목표 KPI를 충족.'
  },
  {
    id: 'it_pv', industry: 'it_ops', name: '배포설계 검증', desc: '카나리 드릴',
    items: [
      { ctq: '자동롤백', method: '장애 주입', criteria: '2분 내 롤백', result: '합격', note: '' },
      { ctq: '알람', method: '임계 테스트', criteria: '<2분 감지', result: '합격', note: '' }
    ],
    conclusion: '가드레일 설계 검증 완료.'
  },
  {
    id: 'log_pv', industry: 'logistics', name: '피킹설계 검증', desc: '존 파일럿',
    items: [
      { ctq: '피킹 오류율', method: '존 파일럿 2주', criteria: '≤0.5%', result: '합격', note: '' },
      { ctq: '스캔 준수', method: 'WMS 로그', criteria: '100%', result: '합격', note: '' }
    ],
    conclusion: '설계 적용 확대 가능.'
  },
  {
    id: 'hc_pv', industry: 'healthcare', name: '핸드오프 설계 검증', desc: '병동 파일럿',
    items: [
      { ctq: '체크리스트 준수', method: '감사', criteria: '≥95%', result: '합격', note: '' },
      { ctq: '대기시간', method: '타임스탬프', criteria: '20%↓', result: '합격', note: '' }
    ],
    conclusion: '프로토콜 전사 확대 권고.'
  }
];

export const SELECTION_TEMPLATES = [
  {
    id: 'mfg_sel', industry: 'manufacturing', name: '제조 기회분석 샘플', desc: '품질 불량 과제 (사출 예시)',
    opportunity: {
      customerType: 'external',
      customerDefinition: '스마트폰 OEM 조립라인 및 품질보증팀',
      customerNeeds: '치수 정합, 외관 품질, 납기 준수',
      businessOpportunity: '불량률 저감으로 클레임·재작업 비용을 줄이고 고객 신뢰 회복',
      analysis3C: {
        customer: 'OEM은 외관·치수 불량에 민감하며 라인스탑 리스크를 싫어함',
        competitor: '경쟁사는 SPC·자동화 검사로 불량률을 낮게 유지',
        company: '당사는 경험적 설정에 의존해 산포가 큼'
      },
      analysisFAW: {
        field: '사출 성형 품질',
        application: '스마트폰 케이스 라인',
        whatsNew: '온도/냉각 윈도우 표준화 + 인터록'
      }
    },
    megaY: '고객 클레임 제로에 가까운 품질 수준',
    bigY: '최종검사 불량률 ≤ 5%',
    projectPool: [
      { name: '사출 불량률 저감', currentLevel: '15.2%', goal: '5%', urgency: 5, impact: 5, total: 10, selected: true },
      { name: '금형 예방보전 강화', currentLevel: '사후대응', goal: '예방보전', urgency: 3, impact: 4, total: 7, selected: false },
      { name: '검사 자동화', currentLevel: '육안', goal: '비전', urgency: 2, impact: 4, total: 6, selected: false }
    ]
  },
  {
    id: 'mfg_voc_sel', industry: 'manufacturing', name: '고객불만·VOC 샘플', desc: '클레임·재발 방지 과제',
    opportunity: {
      customerType: 'external',
      customerDefinition: '최종 소비자 및 대리점/CS 채널',
      customerNeeds: '빠른 응대, 원인 설명, 재발 없는 시정조치',
      businessOpportunity: '반복 VOC·클레임을 줄여 보상비와 브랜드 신뢰 손실을 막음',
      analysis3C: {
        customer: '동일 불만이 반복되면 즉시 이탈·악성 리뷰로 이어짐',
        competitor: '경쟁사는 VOC 분류·근본원인 루프가 정착됨',
        company: '접수 후 부서 핸드오프가 많고 재발 추적이 약함'
      },
      analysisFAW: {
        field: '고객불만/VOC 관리',
        application: '클레임 접수~시정조치 프로세스',
        whatsNew: '유형별 CTQ·재발 방지 표준 루프'
      }
    },
    megaY: '반복 클레임 없는 고객 경험',
    bigY: '반복 VOC 비율 ≤ 목표, 종결 리드타임 단축',
    projectPool: [
      { name: '고객 클레임 재발 방지', currentLevel: '재발 높음', goal: '재발 50%↓', urgency: 5, impact: 5, total: 10, selected: true },
      { name: 'VOC 분류·우선순위 표준화', currentLevel: '수기', goal: '표준택소노미', urgency: 4, impact: 4, total: 8, selected: false },
      { name: '시정조치 종결 SLA', currentLevel: '미정의', goal: 'SLA 준수', urgency: 3, impact: 4, total: 7, selected: false }
    ]
  },
  {
    id: 'svc_sel', industry: 'service_office', name: '서비스 기회분석 샘플', desc: 'SLA 과제',
    opportunity: {
      customerType: 'external',
      customerDefinition: '서비스 이용 고객 및 내부 요청 부서',
      customerNeeds: '빠른 처리, 한 번에 해결, 정확한 안내',
      businessOpportunity: 'SLA 준수율 향상으로 이탈·불만 감소',
      analysis3C: {
        customer: '대기와 재설명을 가장 싫어함',
        competitor: '경쟁사는 셀프서비스·자동분류로 빠른 응답',
        company: '승인·핸드오프가 많아 리드타임이 김'
      },
      analysisFAW: {
        field: '고객요청 처리',
        application: '컨택센터/백오피스',
        whatsNew: '우선순위 규칙 + 회신 템플릿'
      }
    },
    megaY: '고객이 기다리지 않는 서비스',
    bigY: 'SLA 준수율 ≥ 90%',
    projectPool: [
      { name: '리드타임 단축', currentLevel: '72%', goal: '90%', urgency: 5, impact: 5, total: 10, selected: true },
      { name: '재작업 감소', currentLevel: '12%', goal: '5%', urgency: 4, impact: 4, total: 8, selected: false }
    ]
  },
  {
    id: 'it_sel', industry: 'it_ops', name: 'IT 기회분석 샘플', desc: '배포 안정성',
    opportunity: {
      customerType: 'internal',
      customerDefinition: '서비스 사용자 및 사업부',
      customerNeeds: '안정적 서비스, 빠른 복구',
      businessOpportunity: '변경실패·장애 감소로 가용성과 개발 속도 동시 개선',
      analysis3C: {
        customer: '장애와 느린 복구에 민감',
        competitor: '카나리·자동롤백이 표준화',
        company: '일괄배포·관측성 부족'
      },
      analysisFAW: {
        field: '변경관리/배포',
        application: '핵심 서비스 CI/CD',
        whatsNew: '카나리 가드레일'
      }
    },
    megaY: '안전하고 빠른 배포',
    bigY: '변경실패율 50% 감소',
    projectPool: [
      { name: '배포 실패율 개선', currentLevel: '12%', goal: '5%', urgency: 5, impact: 5, total: 10, selected: true },
      { name: 'MTTR 단축', currentLevel: '90분', goal: '30분', urgency: 4, impact: 5, total: 9, selected: false }
    ]
  },
  {
    id: 'log_sel', industry: 'logistics', name: '물류 기회분석 샘플', desc: '피킹 정확도',
    opportunity: {
      customerType: 'external',
      customerDefinition: '수취 고객 및 CS',
      customerNeeds: '정확한 상품, 약속된 납기',
      businessOpportunity: '피킹 오류 감소로 재출고·클레임 비용 절감',
      analysis3C: {
        customer: '오배송을 용납하지 않음',
        competitor: '스캔 강제·자동화로 정확도 높음',
        company: '스캔 누락·유사SKU 혼동'
      },
      analysisFAW: {
        field: '창고 피킹',
        application: '출고 존',
        whatsNew: '강제 스캔 인터록'
      }
    },
    megaY: '오출고 없는 물류',
    bigY: '피킹 오류율 ≤ 0.5%',
    projectPool: [
      { name: '피킹 오류 저감', currentLevel: '1.8%', goal: '0.4%', urgency: 5, impact: 5, total: 10, selected: true }
    ]
  },
  {
    id: 'hc_sel', industry: 'healthcare', name: '의료 기회분석 샘플', desc: '대기·안전',
    opportunity: {
      customerType: 'external',
      customerDefinition: '환자 및 보호자',
      customerNeeds: '짧은 대기, 안전한 인수인계',
      businessOpportunity: '대기·핸드오프 개선으로 만족도와 안전 동시 향상',
      analysis3C: {
        customer: '긴 대기와 정보 누락에 불만',
        competitor: '표준 핸드오프·디지털 큐',
        company: '구두 인계·피크 병목'
      },
      analysisFAW: {
        field: '환자 흐름',
        application: '외래/검사/병동',
        whatsNew: '체크리스트+2식별자'
      }
    },
    megaY: '안전하고 빠른 환자 경험',
    bigY: '평균 대기 20% 단축',
    projectPool: [
      { name: '대기시간 단축', currentLevel: '기준', goal: '20%↓', urgency: 5, impact: 5, total: 10, selected: true }
    ]
  }
];

export const getParetoTemplates = (id) => byIndustry(PARETO_TEMPLATES, id);
export const getTeamTemplates = (id) => byIndustry(TEAM_TEMPLATES, id);
export const getSwimlaneTemplates = (id) => byIndustry(SWIMLANE_TEMPLATES, id);
export const getMonitoringTemplates = (id) => byIndustry(MONITORING_TEMPLATES, id);
export const getResultTemplates = (id) => byIndustry(RESULT_TEMPLATES, id);
export const getAlternativesTemplates = (id) => byIndustry(ALTERNATIVES_TEMPLATES, id);
export const getPilotVerifyTemplates = (id) => byIndustry(PILOT_VERIFY_TEMPLATES, id);
export const getSelectionTemplates = (id) => byIndustry(SELECTION_TEMPLATES, id);
