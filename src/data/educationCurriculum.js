/**
 * 교육용 6시그마 커리큘럼
 * — 기존 기능(학습관·설명서·도구·샘플·헌장 지원)을 학습 경로로 재배치
 *
 * track: fundamentals | yellow_belt | green_belt_core | stats_lab | dfss_intro | walkthrough
 * item.type: lesson | manual | tool | lab | builder | guide | fundamentals | walkthrough
 */

export const CURRICULUM_TRACKS = [
  {
    id: 'fundamentals',
    label: '6시그마 기초',
    badge: '기초',
    color: '#1d4ed8',
    summary: '기원·역사·창시자, 왜 필요한지, 품질비용 빙산 비유를 인포그래픽으로 익힙니다.',
    audience: '모든 학습자 · 첫 주차 필수'
  },
  {
    id: 'yellow_belt',
    label: 'Yellow Belt 입문',
    badge: 'YB',
    color: '#ca8a04',
    summary: '6시그마가 무엇인지, DMAIC 흐름과 Define 기초를 익힙니다.',
    audience: '입문자 · 팀원 · 사내 교육 1주차'
  },
  {
    id: 'walkthrough',
    label: '따라하기 실습',
    badge: '실습',
    color: '#ea580c',
    summary: '제조·고객불만·헬스케어 시나리오를 단계별로 따라가며 도구를 체험합니다.',
    audience: '기초·YB 이후 · 손에 익히기'
  },
  {
    id: 'green_belt_core',
    label: 'Green Belt 핵심',
    badge: 'GB',
    color: '#059669',
    summary: 'DMAIC 전 단계를 도구 실습과 함께 따라가며 프로젝트를 완성합니다.',
    audience: 'GB 준비생 · 실무 개선 리더'
  },
  {
    id: 'stats_lab',
    label: '통계 실험실',
    badge: 'STAT',
    color: '#0f766e',
    summary: '가설검정·공정능력·관리도·DOE 등 통계 개념을 퀴즈와 도구로 연결합니다.',
    audience: '통계가 약한 실무자 · GB/BB 보강'
  },
  {
    id: 'dfss_intro',
    label: 'DFSS 입문',
    badge: 'DFSS',
    color: '#7c3aed',
    summary: '개선(DMAIC)과 설계(DFSS)의 차이를 이해하고 Design/Verify 기초를 익힙니다.',
    audience: '신규 프로세스·제품 설계 과제'
  }
];

/**
 * 모듈 = 주차/단원. items는 학습 순서.
 * action: 앱에서 열 대상 { kind, id, phase? }
 */
export const CURRICULUM_MODULES = [
  // ——— Fundamentals ———
  {
    id: 'fu_01_intro',
    track: 'fundamentals',
    order: 1,
    title: '6시그마 입문 지도',
    minutes: 5,
    outcome: '기초 트랙의 학습 순서를 파악하고, 인포그래픽 챕터로 진입할 수 있다.',
    items: [
      {
        id: 'fu_01_hub',
        type: 'fundamentals',
        title: '기초 챕터 목록 열기',
        required: true,
        body: '정의 → 역사 → 필요성 → 빙산 → 사고방식 순으로 읽으세요.',
        action: { kind: 'fundamentals', id: null }
      }
    ]
  },
  {
    id: 'fu_02_what',
    track: 'fundamentals',
    order: 2,
    title: '정의와 시그마 수준',
    minutes: 8,
    outcome: '6시그마의 의미와 시그마 수준·DPMO 관계를 설명할 수 있다.',
    items: [
      {
        id: 'fu_02_what_is',
        type: 'fundamentals',
        title: '6시그마란 무엇인가',
        required: true,
        action: { kind: 'fundamentals', id: 'what_is' }
      }
    ]
  },
  {
    id: 'fu_03_history',
    track: 'fundamentals',
    order: 3,
    title: '기원 · 창시자 · 역사',
    minutes: 12,
    outcome: '모토로라·Bill Smith·Mikel Harry·GE Jack Welch로 이어진 확산을 말할 수 있다.',
    items: [
      {
        id: 'fu_03_hist',
        type: 'fundamentals',
        title: '역사 타임라인으로 보기',
        required: true,
        action: { kind: 'fundamentals', id: 'history' }
      }
    ]
  },
  {
    id: 'fu_04_why',
    track: 'fundamentals',
    order: 4,
    title: '왜 6시그마를 하는가',
    minutes: 10,
    outcome: '고객·데이터·재무·조직 관점에서 필요성을 설명할 수 있다.',
    items: [
      {
        id: 'fu_04_need',
        type: 'fundamentals',
        title: '필요성 · DMAIC 가치',
        required: true,
        action: { kind: 'fundamentals', id: 'why_needed' }
      }
    ]
  },
  {
    id: 'fu_05_iceberg',
    track: 'fundamentals',
    order: 5,
    title: '품질비용의 빙산',
    minutes: 12,
    outcome: '보이는 비용과 숨은 비용을 구분하고, Business Case에 연결할 수 있다.',
    items: [
      {
        id: 'fu_05_ice',
        type: 'fundamentals',
        title: '빙산의 일각 인포그래픽',
        required: true,
        body: '수면 위(재작업·클레임)보다 바다 아래(이탈·기회손실 등)가 더 클 수 있습니다.',
        action: { kind: 'fundamentals', id: 'iceberg' }
      }
    ]
  },
  {
    id: 'fu_06_mindset',
    track: 'fundamentals',
    order: 6,
    title: '학습 태도 · 다음 단계',
    minutes: 6,
    outcome: 'Y 우선·가설 검증·유지(Control) 원칙을 기억하고 Yellow Belt로 넘어갈 수 있다.',
    items: [
      {
        id: 'fu_06_mind',
        type: 'fundamentals',
        title: '세 가지 사고방식',
        required: true,
        action: { kind: 'fundamentals', id: 'mindset' }
      }
    ]
  },

  // ——— Yellow Belt ———
  {
    id: 'yb_01_orient',
    track: 'yellow_belt',
    order: 1,
    title: '오리엔테이션 · 방법론 선택',
    minutes: 25,
    outcome: '업종·문제유형을 고르고 DMAIC/DFSS 중 적합한 경로를 설명할 수 있다.',
    items: [
      {
        id: 'yb_01_guide',
        type: 'guide',
        title: '왜 교육용으로 DMAIC를 먼저 배우나',
        required: true,
        body: '대부분의 현장 과제는 기존 프로세스 개선입니다. DMAIC로 문제정의→측정→분석→개선→관리 흐름을 익힌 뒤, 신규 설계가 필요할 때만 DFSS로 분기합니다. 기초 트랙(기원·빙산)을 먼저 보는 것을 권장합니다.'
      },
      {
        id: 'yb_01_fund_link',
        type: 'fundamentals',
        title: '(권장) 6시그마 기초 · 빙산 비유 복습',
        required: false,
        action: { kind: 'fundamentals', id: 'iceberg' }
      },
      {
        id: 'yb_01_industry',
        type: 'guide',
        title: '실습: 업종 선택 → 진단 → 방법론',
        required: true,
        body: '앱 좌측에서 업종을 고르고 진단 질문에 답한 뒤, 추천 방법론을 확인하세요. 이 단계는 본 프로젝트 설정이며, 이후 도구 실습은 별도 실습 모드에서 진행합니다.',
        action: { kind: 'workspace', step: 'selection' }
      }
    ]
  },
  {
    id: 'yb_02_define',
    track: 'yellow_belt',
    order: 2,
    title: 'Define: 문제를 문장으로 고정하기',
    minutes: 40,
    outcome: '프로젝트 헌장·VOC/CTQ·SIPOC의 역할을 구분하고 초안을 작성할 수 있다.',
    items: [
      {
        id: 'yb_02_charter_manual',
        type: 'manual',
        title: '프로젝트 헌장 설명서',
        required: true,
        action: { kind: 'manual', id: 'project_charter' }
      },
      {
        id: 'yb_02_charter_builder',
        type: 'builder',
        title: '헌장 작성 지원(비즈니스·문제·목표)',
        required: true,
        body: '키워드 브레인스토밍 → 문제기술서 → 목표기술서(문제 상속) 순으로 작성합니다. Business Case에는 빙산의 숨은 비용도 넣으세요.',
        action: { kind: 'tool', phase: 'define', id: 'project_charter' }
      },
      {
        id: 'yb_02_voc',
        type: 'tool',
        title: 'VOC → CTQ 실습',
        required: true,
        action: { kind: 'tool', phase: 'define', id: 'voc_ctq' }
      },
      {
        id: 'yb_02_sipoc',
        type: 'tool',
        title: 'SIPOC으로 범위 고정',
        required: true,
        action: { kind: 'tool', phase: 'define', id: 'sipoc' }
      }
    ]
  },
  {
    id: 'yb_03_see_data',
    track: 'yellow_belt',
    order: 3,
    title: '데이터를 눈으로 보기',
    minutes: 30,
    outcome: '히스토그램·파레토로 “어디가 큰 문제인지”를 말할 수 있다.',
    items: [
      {
        id: 'yb_03_mean',
        type: 'lesson',
        title: '평균·분산·표준편차',
        required: true,
        action: { kind: 'lesson', id: 'mean_variance' }
      },
      {
        id: 'yb_03_hist',
        type: 'tool',
        title: '히스토그램 실습',
        required: true,
        action: { kind: 'tool', phase: 'measure', id: 'histogram' }
      },
      {
        id: 'yb_03_pareto',
        type: 'tool',
        title: '파레토 분석',
        required: true,
        action: { kind: 'tool', phase: 'analyze', id: 'pareto' }
      },
      {
        id: 'yb_03_lab',
        type: 'lab',
        title: '샘플: 제조 히스토그램',
        required: false,
        action: { kind: 'lab', id: 'mfg_dim_capability' }
      }
    ]
  },

  // ——— Walkthrough ———
  {
    id: 'wt_01_mfg',
    track: 'walkthrough',
    order: 1,
    title: '제조: 불량률 따라하기',
    minutes: 35,
    outcome: '제조 품질 과제의 헌장→샘플→파레토→특성요인도 흐름을 재현할 수 있다.',
    items: [
      {
        id: 'wt_01_run',
        type: 'walkthrough',
        title: '사출·조립 불량률 시나리오 시작',
        required: true,
        body: '5단계 가이드. 각 단계에서 도구/샘플이 교육 실습 모드로 열립니다.',
        action: { kind: 'walkthrough', id: 'mfg_defect' }
      }
    ]
  },
  {
    id: 'wt_02_voc',
    track: 'walkthrough',
    order: 2,
    title: '서비스: 고객불만 따라하기',
    minutes: 30,
    outcome: 'VOC·클레임 과제를 사출 샘플과 구분해서 정의할 수 있다.',
    items: [
      {
        id: 'wt_02_run',
        type: 'walkthrough',
        title: '고객불만·재발 방지 시나리오',
        required: true,
        action: { kind: 'walkthrough', id: 'svc_complaint' }
      }
    ]
  },
  {
    id: 'wt_03_hc',
    track: 'walkthrough',
    order: 3,
    title: '헬스케어: 대기·핸드오프',
    minutes: 25,
    outcome: '의료 대기 과제를 헌장·SIPOC·5Why로 골격화할 수 있다.',
    items: [
      {
        id: 'wt_03_run',
        type: 'walkthrough',
        title: '환자 대기 개선 시나리오',
        required: false,
        action: { kind: 'walkthrough', id: 'hc_wait' }
      }
    ]
  },

  // ——— Green Belt Core ———
  {
    id: 'gb_01_measure',
    track: 'green_belt_core',
    order: 1,
    title: 'Measure: 믿을 수 있는 측정',
    minutes: 50,
    outcome: 'MSA·공정능력·관리도의 역할을 구분하고 기본 해석을 할 수 있다.',
    items: [
      {
        id: 'gb_01_msa_lesson',
        type: 'lesson',
        title: 'MSA / Gage R&R',
        required: true,
        action: { kind: 'lesson', id: 'msa' }
      },
      {
        id: 'gb_01_msa_tool',
        type: 'tool',
        title: 'Gage R&R 도구',
        required: true,
        action: { kind: 'tool', phase: 'measure', id: 'msa_grr' }
      },
      {
        id: 'gb_01_cap_lesson',
        type: 'lesson',
        title: '공정능력 Cp/Cpk',
        required: true,
        action: { kind: 'lesson', id: 'capability' }
      },
      {
        id: 'gb_01_cap_tool',
        type: 'tool',
        title: '공정능력 분석',
        required: true,
        action: { kind: 'tool', phase: 'measure', id: 'capability' }
      },
      {
        id: 'gb_01_spc_lesson',
        type: 'lesson',
        title: '관리도(SPC) 기초',
        required: true,
        action: { kind: 'lesson', id: 'control_chart' }
      },
      {
        id: 'gb_01_spc_tool',
        type: 'tool',
        title: '관리도 실습',
        required: true,
        action: { kind: 'tool', phase: 'measure', id: 'control' }
      }
    ]
  },
  {
    id: 'gb_02_analyze',
    track: 'green_belt_core',
    order: 2,
    title: 'Analyze: 원인 후보 → 검증',
    minutes: 55,
    outcome: '정성(특성요인도·5Why)과 정량(가설검정)을 연결해 말할 수 있다.',
    items: [
      {
        id: 'gb_02_fish',
        type: 'tool',
        title: '특성요인도',
        required: true,
        action: { kind: 'tool', phase: 'analyze', id: 'fishbone' }
      },
      {
        id: 'gb_02_5why',
        type: 'tool',
        title: '5 Why',
        required: true,
        action: { kind: 'tool', phase: 'analyze', id: '5whys' }
      },
      {
        id: 'gb_02_hyp_lesson',
        type: 'lesson',
        title: '가설검정과 p-value',
        required: true,
        action: { kind: 'lesson', id: 'pvalue' }
      },
      {
        id: 'gb_02_hyp_tool',
        type: 'tool',
        title: '가설검정 도구',
        required: true,
        action: { kind: 'tool', phase: 'analyze', id: 'hypothesis_test' }
      },
      {
        id: 'gb_02_corr',
        type: 'lesson',
        title: '상관과 인과',
        required: false,
        action: { kind: 'lesson', id: 'correlation' }
      }
    ]
  },
  {
    id: 'gb_03_improve_control',
    track: 'green_belt_core',
    order: 3,
    title: 'Improve · Control: 개선하고 유지하기',
    minutes: 45,
    outcome: '대책·파일럿·관리계획의 역할을 알고 체크리스트를 채울 수 있다.',
    items: [
      {
        id: 'gb_03_sol',
        type: 'tool',
        title: '개선안(Solutions)',
        required: true,
        action: { kind: 'tool', phase: 'improve', id: 'solutions' }
      },
      {
        id: 'gb_03_pilot',
        type: 'tool',
        title: '파일럿',
        required: true,
        action: { kind: 'tool', phase: 'improve', id: 'piloting' }
      },
      {
        id: 'gb_03_poka',
        type: 'tool',
        title: '실수방지(Poka-Yoke)',
        required: false,
        action: { kind: 'tool', phase: 'improve', id: 'poka_yoke' }
      },
      {
        id: 'gb_03_cp',
        type: 'tool',
        title: '관리계획',
        required: true,
        action: { kind: 'tool', phase: 'control', id: 'control_plan' }
      },
      {
        id: 'gb_03_complete',
        type: 'tool',
        title: '완료 체크리스트',
        required: true,
        action: { kind: 'tool', phase: 'control', id: 'complete' }
      }
    ]
  },
  {
    id: 'gb_04_capstone',
    track: 'green_belt_core',
    order: 4,
    title: '종합 실습: 데모 프로젝트',
    minutes: 40,
    outcome: '데모 데이터를 불러와 Define~Control 산출물을 한 바퀴 돌아볼 수 있다.',
    items: [
      {
        id: 'gb_04_demo',
        type: 'guide',
        title: '헤더 「데모 불러오기」로 전체 흐름 체험',
        required: true,
        body: '교육 실습 모드에서 제조(사출 불량) 데모가 로드됩니다. 본 프로젝트는 그대로 보존됩니다. 체험 후 「본 프로젝트로」또는 「교육과정으로」돌아가세요.',
        action: { kind: 'demo' }
      },
      {
        id: 'gb_04_story',
        type: 'guide',
        title: '패키지 워크벤치 · 스토리라인',
        required: false,
        body: '프로젝트 한눈에 보기·샘플·내보내기는 워크벤치에서 확인합니다.',
        action: { kind: 'hub' }
      }
    ]
  },

  // ——— Stats Lab ———
  {
    id: 'st_01_basics',
    track: 'stats_lab',
    order: 1,
    title: '기초 통계',
    minutes: 35,
    outcome: '분포·표본·신뢰구간의 의미를 설명할 수 있다.',
    items: [
      { id: 'st_01_dist', type: 'lesson', title: '분포와 정규분포', required: true, action: { kind: 'lesson', id: 'distribution' } },
      { id: 'st_01_sample', type: 'lesson', title: '표본과 모집단', required: true, action: { kind: 'lesson', id: 'sampling' } },
      { id: 'st_01_ci', type: 'lesson', title: '신뢰구간', required: true, action: { kind: 'lesson', id: 'ci' } },
      { id: 'st_01_sigma', type: 'lesson', title: '시그마 수준·DPMO', required: false, action: { kind: 'lesson', id: 'sigma_level' } }
    ]
  },
  {
    id: 'st_02_inference',
    track: 'stats_lab',
    order: 2,
    title: '추론·모형',
    minutes: 45,
    outcome: '회귀·ANOVA·DOE의 사용 시점을 구분할 수 있다.',
    items: [
      { id: 'st_02_reg', type: 'lesson', title: '회귀분석 기초', required: true, action: { kind: 'lesson', id: 'regression' } },
      { id: 'st_02_anova', type: 'lesson', title: 'ANOVA', required: true, action: { kind: 'lesson', id: 'anova' } },
      { id: 'st_02_doe', type: 'lesson', title: 'DOE 기초', required: true, action: { kind: 'lesson', id: 'doe' } },
      { id: 'st_02_doe_tool', type: 'tool', title: 'DOE 도구 실습', required: false, action: { kind: 'tool', phase: 'improve', id: 'doe' } }
    ]
  },

  // ——— DFSS ———
  {
    id: 'df_01_intro',
    track: 'dfss_intro',
    order: 1,
    title: 'DMAIC vs DFSS',
    minutes: 20,
    outcome: '언제 DFSS(DMADV)를 택하는지 설명할 수 있다.',
    items: [
      {
        id: 'df_01_guide',
        type: 'guide',
        title: '분기 기준',
        required: true,
        body: '기존 프로세스의 산포·불량을 줄이면 DMAIC. 요구사항이 새롭거나 재설계가 필요하면 DFSS(Define–Measure–Analyze–Design–Verify). 진단에서 “신규/재설계” 성격이 강하면 DFSS를 선택하세요.'
      },
      {
        id: 'df_01_charter',
        type: 'builder',
        title: 'DFSS 헌장 템플릿·작성 지원',
        required: true,
        action: { kind: 'tool', phase: 'define', id: 'project_charter' }
      },
      {
        id: 'df_01_design',
        type: 'tool',
        title: 'Design Spec',
        required: true,
        action: { kind: 'tool', phase: 'design', id: 'design_spec' }
      },
      {
        id: 'df_01_verify',
        type: 'tool',
        title: 'Verify · 파일럿',
        required: false,
        action: { kind: 'tool', phase: 'verify', id: 'pilot' }
      }
    ]
  }
];

/**
 * 교육 제품 관점의 기능 분류
 * core = 커리큘럼에 포함 / available = 워크벤치로 열림·필수는 아님 / later = 교육앱에서 후순위
 */
export const FEATURE_CLASSIFICATION = {
  core: [
    { id: 'curriculum', name: '교육 커리큘럼', note: '학습 경로·진도' },
    { id: 'fundamentals', name: '6시그마 기초', note: '기원·역사·필요성·빙산' },
    { id: 'walkthrough', name: '따라하기 실습', note: '업종별 시나리오' },
    { id: 'stats_learning', name: '통계 학습관', note: '13 레슨 + 퀴즈' },
    { id: 'tool_manuals', name: '도구 설명서', note: '단계별 How-to' },
    { id: 'dmaic_flow', name: 'DMAIC 프로젝트 흐름', note: '실습 프로젝트' },
    { id: 'charter_builder', name: '헌장 작성 지원', note: 'BC·문제·목표' },
    { id: 'demo_project', name: '데모 프로젝트', note: '종합 실습' },
    { id: 'sample_library', name: '샘플 데이터', note: '도구 실습용' }
  ],
  available: [
    { id: 'dfss_path', name: 'DFSS 경로', note: '심화 트랙' },
    { id: 'advanced_stats', name: '고급 통계 도구', note: 'ANOVA·DOE 등' },
    { id: 'package_hub', name: '패키지 워크벤치', note: '스토리라인·검증·협업' },
    { id: 'ai_advice', name: 'AI 조언', note: '선택·API 키 필요' },
    { id: 'export', name: 'PDF/내보내기', note: '보고서 보조' },
    { id: 'cloud_sync', name: '클라우드 동기화', note: '선택 서버' }
  ],
  later: [
    { id: 'mobile_ux', name: '모바일 전용 UX', note: '스토어 배포 전제' },
    { id: 'certificates', name: '수료증·벨트 시험', note: 'LMS 확장' },
    { id: 'cohorts', name: '강사·분반·과제', note: '기관용' },
    { id: 'billing', name: '인앱결제', note: '유료 모듈' }
  ]
};

export const TYPE_LABELS = {
  lesson: { label: '학습', color: '#0f766e' },
  manual: { label: '설명서', color: '#0369a1' },
  tool: { label: '도구실습', color: '#1d4ed8' },
  lab: { label: '샘플실습', color: '#7c3aed' },
  builder: { label: '작성지원', color: '#b45309' },
  guide: { label: '가이드', color: '#64748b' },
  fundamentals: { label: '기초강의', color: '#1d4ed8' },
  walkthrough: { label: '따라하기', color: '#ea580c' }
};

const PROGRESS_KEY = 'sigma_edu_progress';

export function loadCurriculumProgress() {
  try {
    const raw = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}');
    return {
      completed: Array.isArray(raw.completed) ? raw.completed : [],
      lastModuleId: raw.lastModuleId || null,
      lastTrackId: raw.lastTrackId || null
    };
  } catch {
    return { completed: [], lastModuleId: null, lastTrackId: null };
  }
}

export function saveCurriculumProgress(progress) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify({
    completed: progress.completed || [],
    lastModuleId: progress.lastModuleId || null,
    lastTrackId: progress.lastTrackId || null,
    updatedAt: new Date().toISOString()
  }));
}

export function getModulesByTrack(trackId) {
  return CURRICULUM_MODULES
    .filter((m) => m.track === trackId)
    .sort((a, b) => a.order - b.order);
}

export function getModuleById(id) {
  return CURRICULUM_MODULES.find((m) => m.id === id) || null;
}

export function getTrackProgress(trackId, completedIds) {
  const modules = getModulesByTrack(trackId);
  const required = modules.flatMap((m) => m.items.filter((i) => i.required));
  const done = required.filter((i) => completedIds.includes(i.id)).length;
  return {
    requiredTotal: required.length,
    requiredDone: done,
    percent: required.length ? Math.round((done / required.length) * 100) : 0
  };
}

export function getOverallProgress(completedIds) {
  const required = CURRICULUM_MODULES.flatMap((m) => m.items.filter((i) => i.required));
  const done = required.filter((i) => completedIds.includes(i.id)).length;
  return {
    requiredTotal: required.length,
    requiredDone: done,
    percent: required.length ? Math.round((done / required.length) * 100) : 0
  };
}
