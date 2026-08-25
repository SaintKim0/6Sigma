/**
 * 기본 통계 학습 콘텐츠 (Six Sigma 실무 관점)
 */

export const LEARNING_CATEGORIES = [
  { id: 'all', label: '전체' },
  { id: 'basics', label: '기초 개념' },
  { id: 'inference', label: '추론·검정' },
  { id: 'process', label: '공정·품질' },
  { id: 'experiment', label: '실험·모델' }
];

export const STATS_LESSONS = [
  {
    id: 'mean_variance',
    category: 'basics',
    level: '기초',
    title: '평균 · 분산 · 표준편차',
    summary: '데이터의 중심과 퍼짐을 숫자로 요약하는 가장 기본적인 통계량입니다.',
    why: '공정 현 수준(평균)과 산포(σ)를 모르면 Cp/Cpk·관리도·가설검정을 해석할 수 없습니다.',
    keyPoints: [
      '평균(μ̂): 값들의 무게 중심. 이상치에 민감합니다.',
      '중앙값: 순서상 가운데. 왜도가 클 때 평균보다 안정적입니다.',
      '분산: 평균으로부터의 제곱 편차의 평균. 단위가 제곱입니다.',
      '표준편차(σ): 분산의 제곱근. 원래 단위로 산포를 말합니다.'
    ],
    formula: 's = √[ Σ(xi − x̄)² / (n−1) ]  (표본표준편차)',
    example: '치수 데이터 10.1, 10.0, 9.9, 10.2, 10.0 → 평균≈10.04, 산포가 작으면 공정이 안정적으로 보입니다.',
    pitfalls: [
      'n이 작을 때 표준편차 추정이 불안정합니다.',
      '평균만 보고 “좋다/나쁘다”를 판단하지 마세요. 규격·산포를 함께 봅니다.'
    ],
    relatedTools: ['histogram', 'capability', 'boxplot'],
    quiz: {
      q: '표준편차가 커졌다는 것은 무엇을 의미하나요?',
      choices: ['평균이 올라갔다', '데이터가 평균 주변에 더 넓게 퍼졌다', '표본 수가 늘었다', '규격이 넓어졌다'],
      answer: 1,
      explain: '표준편차는 산포(퍼짐)의 크기입니다. 평균·규격과는 별개입니다.'
    }
  },
  {
    id: 'distribution',
    category: 'basics',
    level: '기초',
    title: '분포와 정규분포',
    summary: '데이터가 어떤 모양으로 모여 있는지를 이해하는 것이 통계의 출발점입니다.',
    why: '많은 Six Sigma 도구(t검정, Cp/Cpk, X̄-R)가 “정규에 가깝다”는 가정을 씁니다.',
    keyPoints: [
      '히스토그램으로 대칭·치우침·다봉·이상치를 눈으로 확인합니다.',
      '정규분포: 종 모양, 평균±1σ ≈ 68%, ±2σ ≈ 95%, ±3σ ≈ 99.7%.',
      '비정규면 변환(log 등) 또는 비모수 검정을 검토합니다.',
      '표본이 매우 크면 중심극한정리로 평균의 분포는 정규에 가까워집니다.'
    ],
    formula: '대략 68–95–99.7 규칙 (정규분포)',
    example: '불량률·대기시간은 오른쪽으로 긴 꼬리(양의 왜도)가 흔합니다. 그대로 t검정하면 오판 위험이 있습니다.',
    pitfalls: [
      '정규성 검정이 기각되어도 n이 크면 “실질적” 영향은 작을 수 있습니다.',
      '반대로 n이 작으면 검정이 약해 비정규를 놓칠 수 있습니다.'
    ],
    relatedTools: ['normality', 'histogram', 'nonparametric'],
    quiz: {
      q: '정규성 가정이 깨졌을 때 바로 쓸 수 있는 대안은?',
      choices: ['항상 ANOVA만 사용', '비모수 검정·변환 검토', '평균만 비교', '표본을 버림'],
      answer: 1,
      explain: 'Mann-Whitney, Kruskal-Wallis 등 비모수 또는 적절한 변환을 검토합니다.'
    }
  },
  {
    id: 'sampling',
    category: 'basics',
    level: '기초',
    title: '표본과 모집단 · 샘플 크기',
    summary: '우리는 보통 모집단 전체가 아니라 표본으로 공정을 추정합니다.',
    why: '샘플이 편향되거나 n이 부족하면 분석 결과가 현장과 어긋납니다.',
    keyPoints: [
      '모집단: 관심 있는 전체(예: 이번 달 전 로트). 표본: 실제로 측정한 일부.',
      '무작위·대표성: 좋은 로트만 골라 측정하면 낙관적 편향이 생깁니다.',
      'n↑ → 추정의 표준오차↓ → 작은 차이도 유의하게 나올 수 있음.',
      '필요 n은 α, 검출력(1−β), 검출할 차이(δ), σ에 의해 결정됩니다.'
    ],
    formula: '대략 n ≈ ((zα/2 + zβ)·σ / δ)²  (1표본 평균)',
    example: 'δ=0.5, σ=1, α=0.05, power=0.8이면 수십 개 수준의 n이 필요합니다(상황에 따라 다름).',
    pitfalls: [
      '“일단 30개”는 관례일 뿐, 항상 충분하지 않습니다.',
      '파일럿으로 σ를 추정한 뒤 샘플 크기를 다시 계산하세요.'
    ],
    relatedTools: ['sample_size', 'dpmo'],
    quiz: {
      q: '같은 δ·σ에서 검정력을 높이려면?',
      choices: ['α만 키운다', '필요 표본 수 n을 늘린다', '평균을 올린다', '분산을 무시한다'],
      answer: 1,
      explain: '검출력(1−β)을 높이려면 일반적으로 더 많은 표본이 필요합니다.'
    }
  },
  {
    id: 'pvalue',
    category: 'inference',
    level: '기초',
    title: '가설검정과 p-value',
    summary: '“우연으로도 이만큼 극단적인 결과가 나올 확률”로 차이를 판단합니다.',
    why: '라인 A/B, 개선 전후, 자재 롯트 비교 등 의사결정의 통계적 근거가 됩니다.',
    keyPoints: [
      'H0(귀무): “차이 없음/효과 없음”. H1(대립): “차이 있음”.',
      'p-value: H0가 참일 때 관측 결과 이상으로 극단적일 확률.',
      '관례: α=0.05에서 p<0.05이면 H0 기각(유의).',
      '유의 ≠ 실무적으로 중요. 효과 크기·비용·리스크를 함께 봅니다.'
    ],
    formula: '유의수준 α (보통 0.05)와 p를 비교',
    example: '개선 전후 평균 차이 t검정 p=0.01 → 통계적으로 유의. 하지만 차이가 0.01mm뿐이면 실무 가치는 별도 판단.',
    pitfalls: [
      'p>0.05를 “완전히 같다”로 해석하지 마세요. “증거를 못 찾음”에 가깝습니다.',
      '여러 번 검정하면 가짜 유의(다중비교) 위험이 커집니다.'
    ],
    relatedTools: ['hypothesis_test', 'anova', 'proportion_test'],
    quiz: {
      q: 'p=0.03, α=0.05일 때 일반적인 결론은?',
      choices: ['H0 채택', 'H0 기각(유의)', '데이터가 틀림', '표본이 부족'],
      answer: 1,
      explain: 'p < α이면 관례적으로 H0를 기각합니다. 실무 의미는 별도 검토.'
    }
  },
  {
    id: 'ci',
    category: 'inference',
    level: '중급',
    title: '신뢰구간',
    summary: '점추정(하나의 숫자) 대신 “이 구간에 모수가 있을 것”으로 불확실성을 표현합니다.',
    why: '평균·불량률 보고 시 구간을 주면 의사결정이 보수적이고 투명해집니다.',
    keyPoints: [
      '95% 신뢰구간: 같은 방식으로 반복 표본추출 시 구간 중 약 95%가 참값을 포함.',
      '구간이 좁을수록 추정이 정밀합니다(보통 n↑ 또는 σ↓).',
      '0(또는 무효과)을 포함하지 않으면 검정에서 유의한 것과 대응되는 경우가 많습니다.',
      '신뢰수준↑(예: 99%)면 구간이 넓어집니다.'
    ],
    formula: 'x̄ ± t* · (s/√n)  (평균의 t 신뢰구간)',
    example: '불량률 점추정 4.2%, 95% CI [2.8%, 5.9%] → “대략 3~6%대”로 커뮤니케이션.',
    pitfalls: [
      '“참값이 이 구간에 있을 확률 95%”라는 말은 엄밀히 틀린 표현에 가깝습니다(빈도주의).',
      '구간이 규격과 겹치는지로 공정 리스크를 함께 보세요.'
    ],
    relatedTools: ['capability', 'proportion_test'],
    quiz: {
      q: '표본 수 n을 늘리면 평균의 신뢰구간은 보통?',
      choices: ['넓어진다', '좁아진다', '항상 동일', '평균이 커진다'],
      answer: 1,
      explain: '표준오차 s/√n이 작아져 구간이 좁아지는 경향이 있습니다.'
    }
  },
  {
    id: 'correlation',
    category: 'inference',
    level: '기초',
    title: '상관과 인과',
    summary: '두 변수가 함께 움직이는지(상관)와 한쪽이 다른 쪽을 만드는지(인과)는 다릅니다.',
    why: 'Analyze에서 X 후보를 고를 때 상관만으로 원인을 단정하면 잘못된 개선이 나옵니다.',
    keyPoints: [
      'Pearson r: −1~+1. 직선 관계의 강도·방향.',
      '|r|이 커도 인과 아님. 교란변수·역인과·우연이 가능.',
      '산점도로 비선형·이상치·군집을 반드시 확인.',
      '인과에 가까우려면 실험(DOE)·시간 순서·메커니즘이 필요합니다.'
    ],
    formula: 'r = Cov(X,Y) / (sX · sY)',
    example: '온도와 불량률 r=0.75 → 관련 가능성은 큼. 그래도 “온도를 바꾸면 불량이 준다”는 DOE/회귀로 검증.',
    pitfalls: [
      '이상치 1~2개가 r을 크게 왜곡할 수 있습니다.',
      '그룹을 섞으면(심슨의 역설) 상관이 뒤집힐 수 있습니다.'
    ],
    relatedTools: ['correlation', 'scatter', 'regression', 'doe_effects'],
    quiz: {
      q: '상관이 강하면?',
      choices: ['반드시 인과', '직선적 동반 움직임이 크다(인과는 별개)', '평균이 같다', '정규분포다'],
      answer: 1,
      explain: '상관은 동반 관계이지 인과 증명이 아닙니다.'
    }
  },
  {
    id: 'regression',
    category: 'experiment',
    level: '중급',
    title: '회귀분석 기초',
    summary: 'Y를 X들로 설명·예측하는 모델을 만듭니다.',
    why: 'Y=f(X)를 정량화하고, 개선 레버(X)의 방향·크기를 추정합니다.',
    keyPoints: [
      '단순회귀: Y ≈ β0 + β1X. 다중회귀: X가 여러 개.',
      'R²: 설명된 변동 비율. 높다고 항상 “좋은 모델”은 아님(과적합).',
      '잔차: 관측−예측. 패턴·비정규·이분산이면 모델 재검토.',
      '계수 해석: 다른 X를 고정할 때 해당 X 1단위 증가의 평균 효과(가정 하).'
    ],
    formula: 'Y = β0 + β1X1 + … + βkXk + ε',
    example: '불량률 = 12 − 0.4·냉각시간 + … → 냉각을 늘리면 불량이 감소하는 방향(다른 조건 고정 시).',
    pitfalls: [
      '다중공선성: 비슷한 X가 많으면 계수 해석이 불안정합니다.',
      '외삽(데이터 범위 밖 예측)은 위험합니다.'
    ],
    relatedTools: ['regression', 'multi_regression', 'residual_diag'],
    quiz: {
      q: '잔차 vs 적합값 산점도에 깔때기 모양이 보이면?',
      choices: ['완벽함', '이분산(등분산 가정 위반) 의심', 'R²=1', '표본 부족만의 문제'],
      answer: 1,
      explain: '적합값이 클수록 잔차 산포가 커지는 패턴은 이분산 신호입니다.'
    }
  },
  {
    id: 'capability',
    category: 'process',
    level: '실무',
    title: '공정능력 Cp / Cpk / Pp / Ppk',
    summary: '규격 대비 공정이 얼마나 “맞출 여유”가 있는지 지수화합니다.',
    why: '고객 CTQ 만족·개선 전후 비교·목표 시그마 설정의 공통 언어입니다.',
    keyPoints: [
      'Cp: 규격폭 / (6σ). 중심이 이상적일 때의 잠재 능력.',
      'Cpk: 중심 치우침을 반영한 단기 능력(보통 Within σ).',
      'Pp/Ppk: 전체 산포(Overall σ) 기준 장기 능력.',
      '관례: Cpk·Ppk ≥ 1.33을 양호로 보는 경우가 많음(업종별 상이).'
    ],
    formula: 'Cpk = min( (USL−μ)/(3σ), (μ−LSL)/(3σ) )',
    example: 'Cp=1.5인데 Cpk=0.9 → 산포 여유는 있으나 평균이 한쪽으로 치우침 → 타겟팅 우선.',
    pitfalls: [
      '비정규·관리상태 미흡이면 지수 해석이 왜곡됩니다.',
      '규격이 없으면 Cp/Cpk를 계산할 수 없습니다.'
    ],
    relatedTools: ['capability', 'normality', 'control'],
    quiz: {
      q: 'Cp ≫ Cpk 이면 우선 의해야 할 것은?',
      choices: ['규격을 버린다', '평균 중심(타겟팅) 또는 치우침 제거', '항상 설비를 교체', '표본을 줄인다'],
      answer: 1,
      explain: '잠재 능력(Cp)은 있으나 중심 이탈로 Cpk가 낮아진 전형적인 패턴입니다.'
    }
  },
  {
    id: 'control_chart',
    category: 'process',
    level: '실무',
    title: '관리도(SPC) 기초',
    summary: '시간에 따른 공정이 “통계적으로 안정적인지” 감시합니다.',
    why: '특별원인(이상)을 빨리 찾고, 개선 효과를 유지하는지 확인합니다.',
    keyPoints: [
      '관리한계(UCL/LCL) ≠ 규격한계(USL/LSL). 관리한계는 공정의 자연 변동.',
      '연속형: I-MR, X̄-R. 계수형: p, np, c, u.',
      '한계 밖·런·트렌드 규칙은 특별원인 신호 후보입니다.',
      '안정(관리상태) 후에야 공정능력 지수가 의미를 갖기 쉽습니다.'
    ],
    formula: '예: I-MR에서 CL=평균, UCL/LCL ≈ 평균 ± 3σ̂',
    example: '교대 전환 직후 점이 UCL을 뚫음 → 세팅·인력·자재 변경을 조사.',
    pitfalls: [
      '규격 이탈과 관리 이탈을 혼동하지 마세요.',
      '과도한 재계산으로 한계를 “맞춰” 버리면 이상을 숨길 수 있습니다.'
    ],
    relatedTools: ['control', 'run', 'monitoring'],
    quiz: {
      q: '관리한계의 역할은?',
      choices: ['고객 규격을 대체', '공정의 일상 변동 범위로 이상 신호 탐지', '평균을 올리는 것', '샘플 크기를 정하는 것'],
      answer: 1,
      explain: '관리한계는 공정 데이터의 통계적 변동을 기준으로 이상을 탐지합니다.'
    }
  },
  {
    id: 'msa',
    category: 'process',
    level: '실무',
    title: '측정시스템(MSA / Gage R&R)',
    summary: '데이터가 나쁘면 분석·개선이 모두 흔들립니다. 먼저 “재는 시스템”을 검증합니다.',
    why: '측정 노이즈가 크면 가짜 차이·가짜 공정능력·실패한 DOE가 나옵니다.',
    keyPoints: [
      '반복성(EV): 같은 사람·같은 부품을 반복할 때의 변동.',
      '재현성(AV): 사람(평가자) 간 변동.',
      'GR&R: 측정시스템 변동. %GR&R <10% 우수, 10~30% 조건부, >30% 개선 필요(관례).',
      'ndc(구분 가능한 범주 수)가 낮으면 부품 차이를 잘 못 가릅니다.'
    ],
    formula: '%GR&R = (GRR / TV) × 100',
    example: '%GR&R=35% → 분석 전에 치구·교육·판정기준을 먼저 고치는 것이 이득.',
    pitfalls: [
      '부품 범위가 너무 좁으면 %GR&R가 나빠 보일 수 있습니다.',
      'MSA 없이 Cp/Cpk만 올리면 “가짜 개선”일 수 있습니다.'
    ],
    relatedTools: ['msa_grr'],
    quiz: {
      q: '%GR&R가 45%이면?',
      choices: ['측정 우수', '측정시스템 개선이 시급', '공정능력 충분', '정규성 OK'],
      answer: 1,
      explain: '일반적으로 30%를 넘으면 측정시스템 개선이 우선입니다.'
    }
  },
  {
    id: 'anova',
    category: 'inference',
    level: '중급',
    title: 'ANOVA (분산분석)',
    summary: '3개 이상 그룹의 평균 차이를 한 번에 검정합니다.',
    why: '라인·교대·설비·자재 등 다그룹 비교에 표준적으로 사용합니다.',
    keyPoints: [
      '아이디어: 그룹 간 변동 vs 그룹 내 변동(F비).',
      '유의하면 “적어도 한 그룹이 다르다”이지, 어느 쌍인지는 사후검정 필요.',
      '등분산·정규성·독립성 가정을 점검(Levene 등).',
      '실무에서는 박스플롯과 함께 효과 크기를 봅니다.'
    ],
    formula: 'F = MS_between / MS_within',
    example: '3개 라인 ANOVA p=0.02 → 라인 효과가 있음. Tukey 등으로 A vs B를 추가 확인.',
    pitfalls: [
      '이분산이면 Welch/로버스트 방법 또는 변환을 검토.',
      '그룹당 n이 극단적으로 다르면 해석에 주의.'
    ],
    relatedTools: ['anova', 'levene', 'boxplot'],
    quiz: {
      q: 'ANOVA가 유의할 때 바로 말할 수 있는 것은?',
      choices: ['모든 그룹 평균이 서로 다름', '적어도 한 그룹 평균이 다름', '산포가 동일', '상관이 있음'],
      answer: 1,
      explain: 'ANOVA 유의는 “전부 동일하지 않다”이지 모든 쌍 차이를 뜻하지 않습니다.'
    }
  },
  {
    id: 'doe',
    category: 'experiment',
    level: '실무',
    title: 'DOE(실험계획) 기초',
    summary: '인자를 의도적으로 바꿔 Y에 대한 효과를 깔끔하게 추정합니다.',
    why: '관찰 데이터만으로는 얽힌 원인을 풀기 어렵습니다. 실험이 인과에 가깝습니다.',
    keyPoints: [
      '인자(X)·수준(−1/+1 등)·반응(Y)·랜덤화·반복의 기본 구조.',
      '주효과: 인자 하나의 평균적 영향. 교호작용: 인자 조합의 시너지/상쇄.',
      '직교 설계는 효과를 서로 덜 섞이게 합니다.',
      '확인 실험(confirmation)으로 최적 조건을 재검증합니다.'
    ],
    formula: '효과 ≈ (고수준 평균) − (저수준 평균)',
    example: '온도·냉각·보압 2³ 실험 → 냉각 주효과가 가장 크고 온도×냉각 교호가 있으면 조합으로 해석.',
    pitfalls: [
      '너무 많은 인자를 한 번에 넣으면 실험 수·해석 비용이 폭증합니다.',
      '측정오차(MSA)가 크면 효과를 못 봅니다.'
    ],
    relatedTools: ['doe', 'doe_effects', 'pilot'],
    quiz: {
      q: '교호작용이 크다는 의미는?',
      choices: ['인자가 없음', '한 인자의 효과가 다른 인자 수준에 따라 달라짐', '항상 무시', '정규성만의 문제'],
      answer: 1,
      explain: '교호작용은 조합 효과입니다. 주효과만 보면 오해할 수 있습니다.'
    }
  },
  {
    id: 'sigma_level',
    category: 'process',
    level: '실무',
    title: '시그마 수준 · DPMO · 수율',
    summary: '품질 수준을 DPMO·시그마로 공통 척도화합니다.',
    why: '프로젝트 전후·벤치마크·경영 보고에서 “얼마나 좋아졌는지”를 비교합니다.',
    keyPoints: [
      'DPMO = 결함 / (단위×기회) × 1,000,000.',
      '시그마 수준은 결함률을 정규 가정 등으로 환산한 지표(1.5σ 시프트 관례 포함 여부에 주의).',
      '기회(Opportunity) 정의가 바뀌면 DPMO가 바뀝니다. 프로젝트 내 일관성이 중요.',
      '속성 DPMO와 연속형 규격이탈(%OOS)을 섞어 해석하지 마세요.'
    ],
    formula: 'DPMO = (Defects / (Units × Opportunities)) × 10^6',
    example: '10,000개 × 기회5, 결함 50 → DPMO=1,000. 개선 후 200이면 큰 진전.',
    pitfalls: [
      '기회 정의를 부풀리면 DPMO가 좋아 보입니다.',
      '시그마 “6”은 목표 프레임이지 모든 공정에 동일 적용은 아닙니다.'
    ],
    relatedTools: ['dpmo', 'capability', 'before_after'],
    quiz: {
      q: 'DPMO 계산에서 가장 먼저 합의할 것은?',
      choices: ['차트 색', '결함·단위·기회의 정의', '폰트', '항상 n=30'],
      answer: 1,
      explain: '정의가 일관되지 않으면 DPMO 비교가 무의미합니다.'
    }
  }
];

export function getLessonById(id) {
  return STATS_LESSONS.find(l => l.id === id) || null;
}

export function getLessonsByCategory(categoryId) {
  if (!categoryId || categoryId === 'all') return STATS_LESSONS;
  return STATS_LESSONS.filter(l => l.category === categoryId);
}

export function searchLessons(query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return STATS_LESSONS;
  return STATS_LESSONS.filter(l => {
    const blob = [l.title, l.summary, l.why, ...(l.keyPoints || []), ...(l.relatedTools || [])]
      .join(' ')
      .toLowerCase();
    return blob.includes(q);
  });
}
