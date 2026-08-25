const GROUPS = [
  {
    id: 'problem',
    label: '문제·현상',
    color: '#dc2626',
    words: ['불만', '클레임', '불량', '오류', '지연', '대기', '재작업', '반품', '누락', '장애', '편차', '저하', '증가', '부족']
  },
  {
    id: 'cause',
    label: '원인·장애요인',
    color: '#d97706',
    words: ['원인', '때문', '미흡', '미준수', '수작업', '노후', '복잡', '인력', '교육', '표준', '시스템', '설비', '공정', '핸드오프']
  },
  {
    id: 'customer',
    label: '고객·이해관계자',
    color: '#7c3aed',
    words: ['고객', '소비자', '사용자', '환자', '대리점', '협력사', '직원', '상담사', '현장', '영업', '품질', 'cs', 'voc']
  },
  {
    id: 'impact',
    label: '영향·리스크',
    color: '#be123c',
    words: ['비용', '손실', '매출', '이탈', '신뢰', '만족', '납기', '보상', '브랜드', '생산성', '경쟁력', '안전', '규제', '재계약', '리스크']
  },
  {
    id: 'evidence',
    label: '수치·근거',
    color: '#2563eb',
    words: ['%', '원', '건', '분', '시간', '일', '월', '년', '율', '평균', '목표', '현재', '최근', '전년', '증가', '감소']
  },
  {
    id: 'opportunity',
    label: '기회·방향',
    color: '#059669',
    words: ['개선', '절감', '단축', '향상', '예방', '표준화', '자동화', '최적화', '회복', '확대', '설계', '혁신', '해결', '재발방지']
  }
];

const normalize = (value) => String(value || '').trim().replace(/\s+/g, ' ');

export function parseBrainstormKeywords(text) {
  const seen = new Set();
  return String(text || '')
    .split(/[\n,;|/·]+/)
    .map(normalize)
    .filter((keyword) => {
      const key = keyword.toLowerCase();
      if (!keyword || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function classifyKeywords(keywords) {
  const groups = Object.fromEntries(GROUPS.map((group) => [group.id, []]));
  groups.other = [];

  keywords.forEach((keyword) => {
    const lower = keyword.toLowerCase();
    let best = null;
    let bestScore = 0;

    GROUPS.forEach((group) => {
      const score = group.words.reduce((sum, word) => sum + (lower.includes(word) ? 1 : 0), 0);
      if (score > bestScore) {
        best = group.id;
        bestScore = score;
      }
    });

    groups[best || 'other'].push(keyword);
  });

  return groups;
}

export function getBusinessCaseGroups() {
  return [...GROUPS, { id: 'other', label: '미분류·추가 맥락', color: '#64748b' }];
}

const join = (items, fallback) => (items.length ? items.slice(0, 5).join(', ') : fallback);
const sentence = (value) => {
  const clean = normalize(value);
  if (!clean) return '';
  return /[.!?。]$/.test(clean) ? clean : `${clean}.`;
};

function sharedContext({ keywordText = '', fiveW2h = {}, valueLevers = [], projectTitle = '', methodology = '' }) {
  const keywords = parseBrainstormKeywords(keywordText);
  const groups = classifyKeywords(keywords);

  const problem = join(groups.problem, fiveW2h.what || '현재 핵심 문제가 반복되고');
  const customers = join(groups.customer, fiveW2h.who || '고객과 주요 이해관계자');
  const impacts = join(groups.impact, '비용·만족도·운영 성과');
  const evidence = join(groups.evidence, fiveW2h.evidence || '정량 근거 확인이 필요');
  const causes = join(groups.cause, '원인과 장애요인');
  const opportunities = join(groups.opportunity, fiveW2h.how || '프로세스 개선');
  const leverText = valueLevers.length ? valueLevers.join(', ') : '품질·고객경험·운영성과';
  const whenWhere = [fiveW2h.when, fiveW2h.where].filter(Boolean).join(' / ');
  const title = projectTitle || '본 프로젝트';

  return {
    keywords,
    groups,
    problem,
    customers,
    impacts,
    evidence,
    causes,
    opportunities,
    leverText,
    whenWhere,
    title,
    methodology,
    fiveW2h,
    valueLevers,
    causalChain: {
      cause: causes,
      problem,
      impact: impacts,
      opportunity: opportunities
    }
  };
}

export function buildBusinessCaseAnalysis(input) {
  const ctx = sharedContext(input);
  const paragraphs = [
    `${ctx.title}는 ${ctx.whenWhere ? `${ctx.whenWhere}에서 ` : ''}${ctx.problem} 있는 상황에 대응하기 위해 추진합니다. ${ctx.customers}에게 영향을 주며, 현재 근거는 ${ctx.evidence}입니다.`,
    `이 문제가 지속되면 ${ctx.impacts} 측면의 손실과 리스크가 확대될 수 있습니다. 특히 ${ctx.causes}가 문제를 반복시키는 연결고리로 추정되므로, 사실과 데이터로 우선 검증해야 합니다.`,
    `${ctx.opportunities}를 통해 ${ctx.leverText}의 개선 기회를 확보하고자 합니다.${String(ctx.methodology).toLowerCase() === 'dfss' ? ' 기존 방식의 부분 개선보다 VOC를 CTQ로 전환하여 신규 또는 재설계 대안을 검증하는 DFSS 접근이 필요합니다.' : ''}`
  ];

  const missing = [];
  if (!ctx.groups.evidence.length && !ctx.fiveW2h.evidence) missing.push('현재 수준(건수·비율·금액·시간)');
  if (!ctx.fiveW2h.when) missing.push('발생 기간');
  if (!ctx.fiveW2h.where) missing.push('발생 범위/프로세스');
  if (!ctx.groups.customer.length && !ctx.fiveW2h.who) missing.push('영향받는 고객/이해관계자');
  if (!ctx.groups.impact.length && !ctx.valueLevers.length) missing.push('사업 영향 또는 리스크');

  return {
    keywords: ctx.keywords,
    groups: ctx.groups,
    causalChain: ctx.causalChain,
    draft: paragraphs.map(sentence).join('\n\n'),
    missing
  };
}

/** 문제기술서: 5W2H + Is/Is Not + 현상-갭 */
export function buildProblemStatementAnalysis(input) {
  const ctx = sharedContext(input);
  const isBoundary = input.isIsNot || {};
  const isText = normalize(isBoundary.is) || join(ctx.groups.problem, ctx.fiveW2h.what || '해당 문제 현상');
  const isNotText = normalize(isBoundary.isNot) || '다른 제품/공정/기간의 일반 이슈와는 구분';

  const paragraphs = [
    `${ctx.whenWhere ? `${ctx.whenWhere}에서 ` : ''}${isText}이(가) 관찰됩니다. 영향 대상은 ${ctx.customers}이며, 현재 수준/근거는 ${ctx.evidence}입니다.`,
    `Is: ${isText}. Is Not: ${isNotText}.`,
    `이 상태는 ${ctx.impacts}에 영향을 주며, 추정 연계 요인으로는 ${ctx.causes}가 있습니다. 원인은 가설로 두고 Measure/Analyze에서 검증합니다.`
  ];

  const missing = [];
  if (!ctx.fiveW2h.when) missing.push('언제(기간·빈도)');
  if (!ctx.fiveW2h.where) missing.push('어디서(제품·공정·채널)');
  if (!ctx.groups.evidence.length && !ctx.fiveW2h.evidence) missing.push('현재 수준 데이터');
  if (!normalize(isBoundary.isNot)) missing.push('Is Not(범위 밖) 정의');
  if (!ctx.groups.customer.length && !ctx.fiveW2h.who) missing.push('누가 영향받는지');

  return {
    keywords: ctx.keywords,
    groups: ctx.groups,
    causalChain: ctx.causalChain,
    draft: paragraphs.map(sentence).join('\n\n'),
    missing,
    isIsNot: { is: isText, isNot: isNotText }
  };
}

const METRIC_UNIT = '(?:%|퍼센트|건|분|시간|일|개|원|점|ppm|dpmo)';
const METRIC_NOUN = '[가-힣A-Za-z0-9]{2,20}?(?:률|율|시간|건수|비율|지수|점수|수준|리드타임|대기시간|불량|오류|만족도)';

/**
 * 문제기술서 문장에서 목표기술서 SMART 씨앗(지표·현재수준·범위)을 추출합니다.
 * 규칙 기반이라 완벽하지 않으므로 사용자가 수정하는 것을 전제로 합니다.
 */
export function extractGoalSeedFromProblem(problemStatement = '') {
  const text = normalize(problemStatement);
  if (!text) return { metric: '', baseline: '', scope: '', found: false };

  let metric = '';
  let baseline = '';

  const pair = text.match(new RegExp(`(${METRIC_NOUN})\\s*(?:이|가|은|는|:|：)?\\s*(?:현재\\s*)?([0-9][0-9.,]*\\s*${METRIC_UNIT})`));
  if (pair) {
    metric = normalize(pair[1]);
    baseline = normalize(pair[2]);
  } else {
    const nounOnly = text.match(new RegExp(METRIC_NOUN));
    if (nounOnly) metric = normalize(nounOnly[0]);
    const numberOnly = text.match(new RegExp(`[0-9][0-9.,]*\\s*${METRIC_UNIT}`));
    if (numberOnly) baseline = normalize(numberOnly[0]);
  }

  const scopeMatch = text.match(/([가-힣A-Za-z0-9·\-/ ]{2,30}?)\s*(?:에서|공정|라인|채널|프로세스)/);
  const scope = scopeMatch ? normalize(scopeMatch[1]) : '';

  return {
    metric,
    baseline,
    scope,
    found: !!(metric || baseline)
  };
}

/** 목표기술서: SMART + Baseline→Target→Deadline (문제기술서 상속) */
export function buildGoalStatementAnalysis(input) {
  const ctx = sharedContext(input);
  const smart = input.smart || {};
  const seed = extractGoalSeedFromProblem(input.problemStatement);

  const metric = normalize(smart.metric) || seed.metric || join(ctx.groups.evidence, '핵심 성과지표(Y)');
  const baseline = normalize(smart.baseline) || seed.baseline || ctx.fiveW2h.evidence || '[현재 수준 확인 필요]';
  const target = normalize(smart.target) || join(ctx.groups.opportunity, '[목표 수준 확인 필요]');
  const deadline = normalize(smart.deadline) || '[기한 확인 필요]';
  const relevant = normalize(smart.relevant)
    || (ctx.valueLevers.length ? ctx.valueLevers.join(', ') : ctx.leverText);
  const scope = normalize(input.scope) || seed.scope || ctx.fiveW2h.where || ctx.problem;

  const paragraphs = [
    `${deadline}까지 ${scope ? `${scope}의 ` : ''}${metric}을(를) ${baseline}에서 ${target}(으)로 개선한다.`,
    `Specific: 문제기술서에서 정의한 ${scope || ctx.problem} 범위를 그대로 유지한다. Measurable: ${metric}로 측정한다. Achievable: ${ctx.opportunities} 경로로 달성 가능한 목표로 설정한다.`,
    `Relevant: ${relevant}와 연계된다. Time-bound: ${deadline}을(를) 완료 기준으로 한다.${String(ctx.methodology).toLowerCase() === 'dfss' ? ' DFSS라면 CTQ 스펙 달성·파일럿 검증 통과를 목표에 포함합니다.' : ''}`
  ];

  const missing = [];
  if (!normalize(smart.metric) && !seed.metric && !ctx.groups.evidence.length) missing.push('측정 지표(Y)');
  if (!normalize(smart.baseline) && !seed.baseline && !ctx.fiveW2h.evidence) missing.push('현재 수준(Baseline)');
  if (!normalize(smart.target)) missing.push('목표 수준(Target)');
  if (!normalize(smart.deadline)) missing.push('완료 기한');
  if (!ctx.valueLevers.length && !normalize(smart.relevant)) missing.push('관련성(전략·고객 가치)');

  return {
    keywords: ctx.keywords,
    groups: ctx.groups,
    causalChain: ctx.causalChain,
    draft: paragraphs.map(sentence).join('\n\n'),
    missing,
    seed,
    smartPreview: { metric, baseline, target, deadline, relevant, scope }
  };
}

export function buildCharterFieldAnalysis(mode, input) {
  if (mode === 'problem') return buildProblemStatementAnalysis(input);
  if (mode === 'goal') return buildGoalStatementAnalysis(input);
  return buildBusinessCaseAnalysis(input);
}

export const CHARTER_FIELD_META = {
  business: {
    id: 'business',
    label: '비즈니스 케이스',
    applyLabel: 'Business Case에 적용',
    title: '키워드로 비즈니스 케이스 만들기',
    hint: '문장 대신 생각나는 단어를 쉼표 또는 줄바꿈으로 입력하세요. 단어를 묶고 인과관계를 정리해 초안을 제안합니다.',
    border: '#bfdbfe',
    headerBg: '#eff6ff',
    headerColor: '#1e40af',
    techniques: [
      { title: '친화도법', text: '유사 키워드를 문제·원인·고객·영향으로 그룹핑' },
      { title: '인과사슬', text: '원인 → 현상 → 사업 영향 → 개선 기회 연결' },
      { title: '5W2H', text: '누가·무엇을·언제·어디서·어떤 근거로 보완' },
      { title: '가치 레버', text: '비용·매출·고객·리스크 관점의 필요성 확인' }
    ]
  },
  problem: {
    id: 'problem',
    label: '문제 기술서',
    applyLabel: 'Problem Statement에 적용',
    title: '키워드로 문제 기술서 만들기',
    hint: '현상·데이터·범위를 단어로 던져 두면, 5W2H와 Is/Is Not으로 문제기술서 초안을 만듭니다. 원인은 가설로만 씁니다.',
    border: '#fecaca',
    headerBg: '#fef2f2',
    headerColor: '#991b1b',
    techniques: [
      { title: '5W2H', text: '언제·어디서·무엇이·얼마나를 데이터로 고정' },
      { title: 'Is / Is Not', text: '문제 경계(해당/비해당)를 명확히 구분' },
      { title: '현상-갭', text: '현재 수준과 기대 수준의 차이를 서술' },
      { title: '원인 가설 분리', text: '원인은 단정하지 않고 검증 대상으로 표시' }
    ]
  },
  goal: {
    id: 'goal',
    label: '목표 기술서',
    applyLabel: 'Goal Statement에 적용',
    title: '키워드로 목표 기술서 만들기',
    hint: '문제기술서의 지표·현재 수준·범위를 자동으로 상속합니다. 목표 수준과 기한만 추가하면 목표기술서 초안이 만들어집니다.',
    border: '#bbf7d0',
    headerBg: '#ecfdf5',
    headerColor: '#065f46',
    techniques: [
      { title: '문제 상속', text: '문제기술서의 지표·Baseline·범위를 그대로 승계' },
      { title: 'Baseline→Target', text: '현재 수준에서 목표 수준으로의 이동을 명시' },
      { title: 'SMART', text: '구체·측정·달성가능·관련·기한을 체크' },
      { title: 'Y 지표 초점', text: '개선할 핵심 결과지표를 하나로 고정' }
    ]
  }
};
