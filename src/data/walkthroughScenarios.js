/**
 * 업종별 「따라하기」 실습 시나리오
 * — 교육 실습 모드에서 단계별로 도구를 열어 보며 한 바퀴 체험
 */

export const WALKTHROUGH_SCENARIOS = [
  {
    id: 'mfg_defect',
    industry: 'manufacturing',
    industryLabel: '제조',
    badge: '제조',
    color: '#0369a1',
    title: '사출·조립 불량률 저감',
    minutes: 35,
    summary: '불량률 과제 헌장 → 히스토그램·파레토 → 특성요인도까지 따라갑니다.',
    outcome: '제조 품질 과제의 Define~Analyze 초입을 혼자 재현할 수 있다.',
    tip: '모든 단계는 교육 실습 모드에서 열리며 본 프로젝트는 건드리지 않습니다.',
    steps: [
      {
        id: 'mfg_s1',
        title: '헌장 초안 열기',
        body: '제조 품질 개선 헌장 템플릿을 적용하고, Business Case에 “보이는 비용+숨은 비용”을 한 줄씩 적어 보세요.',
        action: { kind: 'tool', phase: 'define', id: 'project_charter' }
      },
      {
        id: 'mfg_s2',
        title: 'VOC → CTQ',
        body: '고객(OEM) 요구를 CTQ로 바꿉니다. 예: 외관 스크래치 Zero에 가까운 수준, 치수 공차.',
        action: { kind: 'tool', phase: 'define', id: 'voc_ctq' }
      },
      {
        id: 'mfg_s3',
        title: '샘플: 치수 공정능력',
        body: '제조 치수 샘플을 불러 히스토그램·능력 분석을 돌려 봅니다.',
        action: { kind: 'lab', id: 'mfg_dim_capability' }
      },
      {
        id: 'mfg_s4',
        title: '파레토로 큰 구멍 찾기',
        body: '결함 유형 중 어디가 80%를 차지하는지 파레토로 확인합니다.',
        action: { kind: 'tool', phase: 'analyze', id: 'pareto' }
      },
      {
        id: 'mfg_s5',
        title: '특성요인도 가설',
        body: '4M1E로 원인 후보를 적고, “가설”임을 기억하세요. 다음 단계는 검정입니다.',
        action: { kind: 'tool', phase: 'analyze', id: 'fishbone' }
      }
    ]
  },
  {
    id: 'svc_complaint',
    industry: 'service_office',
    industryLabel: '서비스·VOC',
    badge: 'VOC',
    color: '#b45309',
    title: '고객불만·클레임 재발 방지',
    minutes: 30,
    summary: '고객불만 과제의 헌장·범위·측정 감각을 VOC 관점으로 익힙니다.',
    outcome: '고객불만 과제를 “불량률 사출 샘플”과 구분해서 정의할 수 있다.',
    tip: '기초 트랙의 빙산 비유를 Business Case에 연결해 보세요.',
    steps: [
      {
        id: 'svc_s1',
        title: '고객불만 헌장',
        body: '교육 실습에서 프로젝트 헌장을 열고, 「고객불만·VOC」 템플릿(또는 빈 헌장)을 고른 뒤 제목을 본인 과제로 바꿉니다.',
        action: { kind: 'tool', phase: 'define', id: 'project_charter' }
      },
      {
        id: 'svc_s2',
        title: '문제·목표 문장',
        body: '문제기술서에 기간·채널·건수(예: 월 120건)를 넣고, 목표기술서가 Baseline을 상속하는지 확인합니다.',
        action: { kind: 'tool', phase: 'define', id: 'project_charter' }
      },
      {
        id: 'svc_s3',
        title: 'VOC / CTQ',
        body: '불만 유형(지연·응대·재발)을 VOC로 모으고 CTQ(예: 종결 리드타임, 재발률)로 변환합니다.',
        action: { kind: 'tool', phase: 'define', id: 'voc_ctq' }
      },
      {
        id: 'svc_s4',
        title: 'SIPOC으로 범위',
        body: '접수→분류→처리→회신 경계를 In/Out of Scope와 맞춥니다.',
        action: { kind: 'tool', phase: 'define', id: 'sipoc' }
      },
      {
        id: 'svc_s5',
        title: '대기·리드타임 감각 (서비스 샘플)',
        body: '서비스 대기시간 정규성 샘플로 “분포를 먼저 본다”는 습관을 익힙니다.',
        action: { kind: 'lab', id: 'svc_wait_normality' }
      }
    ]
  },
  {
    id: 'hc_wait',
    industry: 'healthcare',
    industryLabel: '헬스케어',
    badge: '의료',
    color: '#059669',
    title: '환자 대기·핸드오프 개선',
    minutes: 25,
    summary: '대기시간·인수인계 과제를 Define 도구로 골격만 잡아 봅니다.',
    outcome: '의료 현장에서 SIPOC·헌장 언어로 과제를 설명할 수 있다.',
    tip: '환자 안전·식별은 Out of Scope에 “프로토콜 변경 제외”로 명시하는 연습이 중요합니다.',
    steps: [
      {
        id: 'hc_s1',
        title: '헌장 · 범위',
        body: '외래/병동 대기 단축 과제로 헌장을 열고, In Scope(접수~검사~인수인계)와 Out of Scope(진료 프로토콜)를 구분합니다.',
        action: { kind: 'tool', phase: 'define', id: 'project_charter' }
      },
      {
        id: 'hc_s2',
        title: 'SIPOC',
        body: '공급자(진료과·검사실)·고객(환자·병동)을 SIPOC에 채웁니다.',
        action: { kind: 'tool', phase: 'define', id: 'sipoc' }
      },
      {
        id: 'hc_s3',
        title: '팀 구성',
        body: 'Champion·BB/GB·현장 간호/원무 역할을 팀 구성에 넣어 봅니다.',
        action: { kind: 'tool', phase: 'define', id: 'team' }
      },
      {
        id: 'hc_s4',
        title: '5 Why 초안',
        body: '“왜 대기가 길어지는가”를 5단계로 적어 가설을 만듭니다. (단정 금지)',
        action: { kind: 'tool', phase: 'analyze', id: '5whys' }
      }
    ]
  }
];

export function getWalkthroughById(id) {
  return WALKTHROUGH_SCENARIOS.find((s) => s.id === id) || null;
}
