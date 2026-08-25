/**
 * 도구 사용설명서
 * id는 activeTool / STEP_TOOL_IDS와 동일
 */

export const MANUAL_PHASES = [
  { id: 'all', label: '전체' },
  { id: 'define', label: 'Define' },
  { id: 'measure', label: 'Measure' },
  { id: 'analyze', label: 'Analyze' },
  { id: 'improve', label: 'Improve' },
  { id: 'control', label: 'Control' }
];

export const TOOL_MANUALS = [
  // —— Measure ——
  {
    id: 'dpmo',
    phase: 'measure',
    title: 'DPMO Calculator',
    summary: '결함 기회당 백만 결함 수(DPMO)와 대략적 시그마 수준을 산출합니다.',
    purpose: '현재 공정 품질 수준을 한 숫자로 비교·보고할 때 사용합니다.',
    when: ['속성(불량 개수) 데이터가 있을 때', '규격 이탈을 불량으로 집계할 때'],
    steps: [
      '단위 수(Unit), 불량 수(Defect), 단위당 기회(Opportunity)를 입력합니다.',
      '또는 Measure 대시보드에 연속형 데이터+LSL/USL을 넣으면 규격 이탈이 자동 집계됩니다.',
      'DPMO = (Defect / (Unit × Opportunity)) × 1,000,000'
    ],
    inputs: 'Unit, Defect, Opportunity(기본 1)',
    outputs: 'DPMO, Yield%, 대략적 Sigma',
    tips: ['기회 정의를 프로젝트마다 일관되게 유지하세요.', '연속형 규격 분석과 속성 DPMO를 섞어 해석하지 마세요.']
  },
  {
    id: 'msa_grr',
    phase: 'measure',
    title: 'MSA / Gage R&R',
    summary: '측정시스템의 반복성·재현성을 %GR&R로 평가합니다.',
    purpose: '데이터 분석 전에 “재는 시스템”이 믿을 만한지 확인합니다.',
    when: ['연속형 계측 전', '신규 게이지/검사원 교육 후'],
    steps: [
      '체크리스트 템플릿으로 MSA 계획·판정 기준을 정리합니다.',
      '아래 Gage R&R 계산기에 부품×측정자×반복 측정값을 입력합니다.',
      '%GR&R < 10% 양호, 10~30% 조건부, >30% 개선 필요로 해석합니다.'
    ],
    inputs: '측정자/부품/반복 측정값 (범위법)',
    outputs: '%GR&R, 반복성, 재현성, 판정',
    tips: ['부품은 공정을 대표하는 범위를 포함하세요.', '측정자 수는 보통 2~3명, 반복 2~3회.']
  },
  {
    id: 'normality',
    phase: 'measure',
    title: '정규성 검정 (Anderson-Darling)',
    summary: '데이터가 정규분포에 가까운지 AD 검정으로 확인합니다.',
    purpose: 'Cp/Cpk·t검정·회귀 등 정규성 전제 도구를 쓰기 전에 점검합니다.',
    when: ['연속형 데이터 분석 전', '히스토그램이 한쪽으로 치우쳐 보일 때'],
    steps: [
      '측정값을 쉼표/줄바꿈으로 입력합니다. (히스토그램 데이터가 있으면 자동 반영)',
      '검정 실행 → p-value를 확인합니다.',
      'α=0.05 기준: p≥0.05이면 정규 가정 OK, p<0.05이면 비정규(변환·비모수 검토).'
    ],
    inputs: '연속형 측정값 목록',
    outputs: 'A²*, p-value, 결론',
    tips: ['표본이 너무 작으면(n<8) 검정이 불안정합니다.', '비정규면 Kruskal-Wallis·Mann-Whitney를 고려하세요.', '결과 아래 「해석·조언」에서 대응방안을 확인하세요. API 키가 있으면 AI 심화 조언도 가능합니다.']
  },
  {
    id: 'capability',
    phase: 'measure',
    title: '공정능력 (Cp/Cpk · Pp/Ppk)',
    summary: '규격 대비 단기·장기 공정능력과 %OOS, Z.bench를 산출합니다.',
    purpose: '공정이 규격을 얼마나 잘 맞출 수 있는지 정량화합니다.',
    when: ['LSL/USL이 정의된 연속형 특성', '개선 전후 비교'],
    steps: [
      '측정값과 LSL/USL을 입력합니다.',
      'Cp/Cpk는 Within σ(이동범위), Pp/Ppk는 Overall σ(표본표준편차) 기준입니다.',
      'Cpk≥1.33을 일반적으로 “충분”으로 보지만, 업종 기준을 따르세요.',
      '분석 후 「결과 해석·조언」에서 조치 우선순위를 확인합니다.'
    ],
    inputs: '데이터, LSL, USL',
    outputs: 'Cp, Cpk, Pp, Ppk, %OOS, Z.bench, PPM',
    tips: ['정규성·관리상태(관리도)를 먼저 확인하세요.', '편심이 크면 Cpk≪Cp가 됩니다.', '사이드바 「AI 조언 설정」에 API 키를 넣으면 심화 조언을 받을 수 있습니다.']
  },
  {
    id: 'sample_size',
    phase: 'measure',
    title: '샘플 크기 계산기',
    summary: '평균/비율 검정에 필요한 표본 수를 대략 계산합니다.',
    purpose: '데이터 수집 전에 “몇 개 모을지”를 설계합니다.',
    when: ['측정계획 수립 시', '개선 전후 검정 설계 시'],
    steps: [
      '모드 선택: 1/2표본 평균, 1/2비율.',
      'α(보통 0.05), Power(보통 0.8), δ(검출할 차이), σ 또는 비율을 입력합니다.',
      '계산된 n을 수집 계획에 반영합니다.'
    ],
    inputs: 'α, Power, δ, σ 또는 p',
    outputs: '필요 n (그룹당)',
    tips: ['σ는 과거 데이터·파일럿으로 추정하세요.', '계산값은 근사이며, 탈락률을 여유분으로 더하세요.']
  },
  {
    id: 'control',
    phase: 'measure',
    title: '관리도 (Control Chart)',
    summary: 'I-MR, X-bar/R, p/np/c/u로 공정 이상 원인을 탐지합니다.',
    purpose: '공정이 통계적으로 안정적인지 모니터링합니다.',
    when: ['Measure 안정성 확인', 'Control 단계 모니터링'],
    steps: [
      '관리도 유형을 선택합니다. (연속: I-MR/X-bar/R, 계수: p/np/c/u)',
      '샘플을 수동 입력하거나 CSV를 업로드합니다.',
      'UCL/LCL 이탈 포인트를 이상원인으로 조사합니다.'
    ],
    inputs: '유형별 샘플 데이터',
    outputs: 'CL, UCL, LCL, 이탈 포인트',
    tips: ['계수형 p차트는 defects,n 형식입니다.', '관리한계는 규격한계(LSL/USL)와 다릅니다.']
  },
  {
    id: 'histogram',
    phase: 'measure',
    title: '히스토그램',
    summary: '분포 형태와 규격 대비 위치를 시각화합니다.',
    purpose: '산포·편향·다봉성을 눈으로 파악합니다.',
    when: ['연속형 데이터 탐색', '공정능력과 함께 볼 때'],
    steps: ['측정값 입력', 'Bin 수·LSL/USL 설정', '분포 모양과 규격선 위치 확인'],
    inputs: 'rawData, bin, LSL/USL',
    outputs: '히스토그램 + 요약 통계',
    tips: ['다봉이면 층별(라인/교대)을 나누세요.']
  },
  {
    id: 'scatter',
    phase: 'measure',
    title: '산점도',
    summary: '두 변수 관계의 방향·강도를 시각화합니다.',
    purpose: '잠재 X–Y 관계를 탐색합니다.',
    when: ['상관·회귀 전 탐색'],
    steps: ['X,Y 짝 데이터 입력', '패턴(선형/곡선/군집) 확인', '상관분석으로 유의성 확인'],
    inputs: 'x,y 쌍',
    outputs: '산점도, (내부) 상관계수',
    tips: ['상관≠인과입니다.']
  },
  {
    id: 'boxplot',
    phase: 'measure',
    title: '상자그림',
    summary: '그룹별 중앙값·산포·이상치를 비교합니다.',
    purpose: '라인/교대/설비 등 그룹 차이를 빠르게 봅니다.',
    when: ['그룹 비교 전 시각화'],
    steps: ['그룹별 데이터 입력', '상자 위치·수염·이상치 비교'],
    inputs: '그룹별 값',
    outputs: '박스플롯',
    tips: ['이상치는 기록 오류인지 특수원인인지 구분하세요.']
  },
  {
    id: 'run',
    phase: 'measure',
    title: '런 차트',
    summary: '시간 순서에 따른 추세·패턴을 봅니다.',
    purpose: '관리도 전 단계의 단순 추세 확인에 사용합니다.',
    when: ['시계열 탐색'],
    steps: ['시간 순 데이터 입력', '상승/하락/계절성 확인'],
    inputs: '순서 있는 측정값',
    outputs: '런 차트',
    tips: ['순서가 섞이면 의미가 왜곡됩니다.']
  },

  // —— Analyze ——
  {
    id: 'pareto',
    phase: 'analyze',
    title: '파레토 차트',
    summary: '빈도 기준 핵심 불량/원인을 우선순위화합니다.',
    purpose: 'Vital Few를 골라 분석 초점을 맞춥니다.',
    when: ['불량유형·클레임·다운타임 집계 후'],
    steps: ['카테고리별 건수 입력/템플릿 적용', '누적 % 80% 전후를 우선 공략'],
    inputs: 'category, count',
    outputs: '막대+누적곡선',
    tips: ['금액 기준 파레토도 함께 보면 좋습니다.']
  },
  {
    id: 'fishbone',
    phase: 'analyze',
    title: '특성요인도 (Fishbone)',
    summary: '4M1E 관점에서 잠재 원인을 브레인스토밍합니다.',
    purpose: '원인 후보를 빠짐없이 나열합니다.',
    when: ['문제 정의 직후', '데이터 분석 전 가설 생성'],
    steps: ['문제(머리) 정의', 'Man/Machine/Material/Method/Measurement/Environment에 원인 기입', 'C&E Matrix·FMEA로 우선순위'],
    inputs: '카테고리별 원인 텍스트',
    outputs: '특성요인도',
    tips: ['추측과 검증된 사실을 구분해서 표시하세요.']
  },
  {
    id: 'ce_matrix',
    phase: 'analyze',
    title: 'C&E Matrix',
    summary: 'Y 중요도 × X 영향도(0/1/3/9)로 원인 점수를 매깁니다.',
    purpose: 'Fishbone 후보 중 검증할 X를 고릅니다.',
    when: ['원인 후보가 많을 때', 'FMEA 전 스크리닝'],
    steps: [
      '출력 Y(CTQ)와 가중치를 입력합니다.',
      '입력 X에 대해 각 Y에 0/1/3/9 영향도를 부여합니다.',
      '총점 상위 X를 가설 검증 대상으로 삼습니다.'
    ],
    inputs: 'Y 가중치, X 영향도 매트릭스',
    outputs: 'X 우선순위 점수',
    tips: ['팀 합의로 점수를 매기세요. 개인 편향을 피합니다.']
  },
  {
    id: 'hypothesis_log',
    phase: 'analyze',
    title: 'Y=f(X) 검증 로그',
    summary: '가설·검증방법·채택/기각을 체크리스트로 관리합니다.',
    purpose: 'Analyze→Improve 연결을 문서화합니다.',
    when: ['원인 검증이 여러 개일 때'],
    steps: ['Y, X, 가설, 방법 기록', '검정 후 상태(채택/기각)와 근거 입력', '채택된 X만 Improve에 반영'],
    inputs: '가설 행 목록',
    outputs: '검증 로그',
    tips: ['기각된 가설도 남겨 중복 분석을 줄이세요.']
  },
  {
    id: 'hypothesis_test',
    phase: 'analyze',
    title: '2-Sample T-Test',
    summary: '두 그룹 평균 차이를 검정합니다.',
    purpose: 'Before/After, 라인A/B 등 평균 비교에 사용합니다.',
    when: ['연속형, 대략 정규, 2그룹'],
    steps: ['그룹 A/B 데이터 입력', '검정 실행', '|t|와 유의성(α=0.05) 해석'],
    inputs: '두 표본 숫자 목록',
    outputs: '평균, SD, t, 결론',
    tips: ['등분산·정규성을 먼저 확인하세요.', '3그룹 이상이면 ANOVA.']
  },
  {
    id: 'proportion_test',
    phase: 'analyze',
    title: '비율 검정',
    summary: '1비율·2비율 z검정으로 불량률을 비교합니다.',
    purpose: '개선 전후 불량률, 목표 대비 비율을 검증합니다.',
    when: ['계수형(성공/실패) 데이터'],
    steps: ['1비율: 성공수, n, p₀ / 2비율: 두 그룹 성공수·n', '검정 실행', 'p-value로 유의성 판단'],
    inputs: 'x, n (및 p₀ 또는 그룹2)',
    outputs: 'p̂, z, p-value',
    tips: ['np, n(1-p)가 너무 작으면 근사가 부정확합니다.']
  },
  {
    id: 'levene',
    phase: 'analyze',
    title: '등분산 검정 (Levene)',
    summary: '그룹 간 분산이 같은지 Brown-Forsythe(중앙값)로 검정합니다.',
    purpose: 't/ANOVA 전제(등분산)를 확인합니다.',
    when: ['다중 그룹 비교 전'],
    steps: ['그룹명: 값,값… 형식으로 입력', 'p≥0.05이면 등분산 OK', '기각 시 이분산 t·비모수·변환 검토'],
    inputs: '그룹별 연속형 값',
    outputs: 'W, p-value',
    tips: ['형식 예: 라인A: 1,2,3']
  },
  {
    id: 'nonparametric',
    phase: 'analyze',
    title: '비모수 검정',
    summary: 'Mann-Whitney(2그룹)·Kruskal-Wallis(3+그룹)로 중앙값을 비교합니다.',
    purpose: '정규성이 깨졌을 때의 대안 검정입니다.',
    when: ['비정규·순위형·이상치 많은 데이터'],
    steps: ['Mann-Whitney: 두 그룹 / Kruskal: 3개 이상 그룹', 'p-value로 차이 유의성 판단'],
    inputs: '그룹별 값',
    outputs: 'U 또는 H, p-value',
    tips: ['효과 크기·실무적 의미도 함께 보고하세요.']
  },
  {
    id: 'anova',
    phase: 'analyze',
    title: 'ANOVA (일원 분산분석)',
    summary: '3개 이상 그룹 평균 차이를 F검정합니다.',
    purpose: '라인·교대·설비 등 다중 수준 비교에 사용합니다.',
    when: ['연속형, 3+ 그룹'],
    steps: ['그룹별 데이터 입력', 'F·p 확인', '유의하면 사후비교·박스플롯으로 어느 그룹인지 탐색'],
    inputs: '그룹별 값',
    outputs: 'F, df, p-value',
    tips: ['등분산·정규성 가정이 중요합니다.']
  },
  {
    id: 'chi_square',
    phase: 'analyze',
    title: '카이제곱 검정',
    summary: '분할표 기반 범주형 독립성/연관성을 검정합니다.',
    purpose: '불량유형×라인, 불량×교대 등 연관성 확인.',
    when: ['계수형 교차표'],
    steps: ['행/열 라벨과 빈도 표 입력', 'χ²·p 확인'],
    inputs: '분할표 도수',
    outputs: 'χ², p-value',
    tips: ['기대도수가 너무 작으면 검정이 부정확합니다.']
  },
  {
    id: 'correlation',
    phase: 'analyze',
    title: '상관분석 (Pearson)',
    summary: 'r과 p-value로 선형 관계의 강도와 유의성을 봅니다.',
    purpose: '산점도의 “통계적 뒷받침”을 제공합니다.',
    when: ['두 연속형 변수'],
    steps: ['X, Y 입력(짝 맞춤)', 'r 해석: |r|≥0.7 강함 등', 'p<0.05면 유의'],
    inputs: 'X 목록, Y 목록',
    outputs: 'r, R², t, p',
    tips: ['이상치 1개가 r을 크게 바꿉니다.']
  },
  {
    id: 'regression',
    phase: 'analyze',
    title: '단순 회귀',
    summary: 'Y = a + bX 관계와 R²를 추정합니다.',
    purpose: '한 개 X로 Y를 설명·예측합니다.',
    when: ['선형 관계가 보일 때'],
    steps: ['X, Y 입력', '회귀식·R² 확인', '잔차 진단을 추가로 권장'],
    inputs: 'X, Y',
    outputs: '회귀식, R², 산점도',
    tips: ['예측은 관측 범위 안에서만 하세요.']
  },
  {
    id: 'multi_regression',
    phase: 'analyze',
    title: '다중 회귀',
    summary: '여러 X로 Y를 설명하고 계수·Adj.R²·RMSE를 봅니다.',
    purpose: '다인자 영향도를 정량화합니다.',
    when: ['예측변수 2개 이상'],
    steps: ['헤더 마지막 열=Y', '데이터 행 입력', '계수 부호·크기와 Adj.R² 해석'],
    inputs: '표 형식 X1…Xk,Y',
    outputs: '계수, R², Adj.R², RMSE, 잔차 요약',
    tips: ['공선성이 있으면 행렬 오류/불안정 계수가 납니다.']
  },
  {
    id: 'residual_diag',
    phase: 'analyze',
    title: '잔차 진단',
    summary: '회귀 잔차의 정규성·등분산·잔차vs적합을 점검합니다.',
    purpose: '회귀 모델 가정이 깨지지 않았는지 확인합니다.',
    when: ['회귀/다중회귀 직후'],
    steps: ['동일 표로 회귀 실행', '잔차 정규성·등분산 p 확인', '잔차vs적합에 패턴(깔때기 등)이 없는지 확인'],
    inputs: '회귀용 표 데이터',
    outputs: '진단 결론 + 잔차 산점도',
    tips: ['패턴이 있으면 변환·교호항·누락 X를 검토하세요.']
  },
  {
    id: 'weibull',
    phase: 'analyze',
    title: 'Weibull 신뢰성',
    summary: '수명 데이터로 shape(β)·scale(η)·B10·MTTF를 추정합니다.',
    purpose: '고장/수명 특성을 요약합니다.',
    when: ['양수 수명·고장시간 데이터'],
    steps: ['수명 값 입력(n≥5)', 'β, η, B10, MTTF 확인', '특정 t에서 신뢰도 R(t) 확인'],
    inputs: '수명 시간 목록',
    outputs: 'β, η, B10, MTTF, R(t)',
    tips: ['우측절단(아직 안 고장) 데이터는 현재 미반영입니다.']
  },
  {
    id: 'fmea',
    phase: 'analyze',
    title: 'FMEA',
    summary: '고장 유형의 심각도·발생·검출로 RPN을 계산합니다.',
    purpose: '리스크 높은 항목에 대책을 우선 배치합니다.',
    when: ['원인 후보가 정리된 후', '개선안 선정 전'],
    steps: ['고장모드·영향·원인 입력', 'S/O/D 점수', 'RPN=S×O×D 상위부터 조치'],
    inputs: 'FMEA 행',
    outputs: 'RPN 순위',
    tips: ['조치 후 O 또는 D를 재평가하세요.']
  },
  {
    id: '5whys',
    phase: 'analyze',
    title: '5-Why',
    summary: '“왜?”를 반복해 근본 원인에 접근합니다.',
    purpose: '표면 원인이 아닌 시스템 원인을 찾습니다.',
    when: ['단일 사건·반복 불량 조사'],
    steps: ['문제 문장 작성', 'Why1~5 답변', '검증 가능한 근본원인으로 마무리'],
    inputs: '질문-답 체인',
    outputs: '5Why 기록',
    tips: ['사람 탓으로만 끝나지 않게 공정/설계로 확장하세요.']
  },

  // —— Improve ——
  {
    id: 'solutions',
    phase: 'improve',
    title: '해결안 선정',
    summary: '개선안을 평가·선정합니다.',
    purpose: '검증된 X에 대한 대책을 고릅니다.',
    when: ['Analyze 가설 채택 후'],
    steps: ['템플릿/후보 입력', '효과·비용·실행성 평가', '채택안 확정'],
    inputs: '해결안 목록',
    outputs: '선정 결과',
    tips: ['파일럿 가능한 안을 우선하세요.']
  },
  {
    id: 'doe',
    phase: 'improve',
    title: 'DOE (실험계획)',
    summary: '실험 인자·수준·반응을 템플릿으로 정리합니다.',
    purpose: '최적 조건을 찾기 위한 실험 설계 기록.',
    when: ['다인자 최적화가 필요할 때'],
    steps: ['업종 템플릿 선택', '인자 Low/High·반응 정의', '결과 기록 후 DOE Effects로 분석'],
    inputs: '인자, 수준, 반응',
    outputs: 'DOE 계획/결과 기록',
    tips: ['한 번에 너무 많은 인자를 넣지 마세요.']
  },
  {
    id: 'doe_effects',
    phase: 'improve',
    title: 'DOE 주효과·교호작용',
    summary: '-1/1 실험 run으로 주효과와 2인자 교호작용을 계산합니다.',
    purpose: '어느 인자가 Y에 큰 영향인지 정량화합니다.',
    when: ['2수준 factorial 실험 후'],
    steps: ['인자 이름 입력', '각 run: 수준…,y 입력', '효과 막대그래프에서 큰 인자 확인'],
    inputs: '-1/1 수준 + y',
    outputs: '주효과, 교호작용, 차트',
    tips: ['수준 코딩이 ±1인지 확인하세요.']
  },
  {
    id: 'piloting',
    phase: 'improve',
    title: 'Piloting',
    summary: '소규모 파일럿으로 개선안을 검증합니다.',
    purpose: '전사 적용 전 리스크를 줄입니다.',
    when: ['해결안 선정 후'],
    steps: ['범위·기간·성공기준 정의', '실행·측정', 'Before/After·비율검정으로 효과 확인'],
    inputs: '파일럿 계획',
    outputs: '파일럿 기록',
    tips: ['성공기준을 숫자로 미리 적어두세요.']
  },
  {
    id: 'poka_yoke',
    phase: 'improve',
    title: '포카요케',
    summary: '실수 방지 장치를 정의합니다.',
    purpose: '재발을 구조적으로 막습니다.',
    when: ['인적 실수가 원인일 때'],
    steps: ['실수 유형 정의', '방지/검출 장치 설계', '관리계획에 반영'],
    inputs: '포카요케 항목',
    outputs: '실수방지 정의',
    tips: ['검출보다 방지가 우선입니다.']
  },

  // —— Control ——
  {
    id: 'control_plan',
    phase: 'control',
    title: '관리계획서',
    summary: '관리특성·방법·샘플·반응계획을 표준화합니다.',
    purpose: '개선 성과를 유지하는 운영 규칙을 만듭니다.',
    when: ['개선 확정 후'],
    steps: ['업종 템플릿 선택', '특성·규격·담당·반응 수정', '현장 SOP와 연계'],
    inputs: '관리계획 행',
    outputs: 'Control Plan',
    tips: ['반응계획(이탈 시 조치)을 구체적으로.']
  },
  {
    id: 'standard_work',
    phase: 'control',
    title: '표준작업 (SOP)',
    summary: '표준 작업 절차를 문서화합니다.',
    purpose: '작업 편차를 줄입니다.',
    when: ['신공정·개선 정착 시'],
    steps: ['템플릿 선택', '절차·주의사항·교육 내용 작성'],
    inputs: 'SOP 필드',
    outputs: '표준작업 문서',
    tips: ['사진/체크리스트를 현장용으로 단순화하세요.']
  },
  {
    id: 'monitoring',
    phase: 'control',
    title: '모니터링 계획',
    summary: 'KPI·주기·담당·에스컬레이션을 정의합니다.',
    purpose: '성과 하락을 조기 감지합니다.',
    when: ['Control 단계'],
    steps: ['KPI 선정', '주기·담당 지정', '임계치 초과 시 에스컬레이션'],
    inputs: '모니터링 KPI',
    outputs: '모니터링 계획',
    tips: ['관리도와 동일 지표를 맞추면 일관됩니다.']
  },
  {
    id: 'before_after',
    phase: 'control',
    title: 'Before / After',
    summary: '불량률·DPMO·Cpk·Sigma 전후를 비교합니다.',
    purpose: '개선 효과를 한눈에 보고합니다.',
    when: ['파일럿/전사 적용 후'],
    steps: ['Before는 Measure 값 자동 반영 가능', 'After 입력', '변화율·개선 여부 확인 후 저장'],
    inputs: '전후 KPI',
    outputs: '비교 표',
    tips: ['동일 정의(기회, 규격)로 비교하세요.']
  },
  {
    id: 'result',
    phase: 'control',
    title: '최종 성과',
    summary: '프로젝트 성과를 요약합니다.',
    purpose: '스폰서 보고·A3 연결용.',
    when: ['프로젝트 종료 전'],
    steps: ['지표 Before→After 정리', '재무/정성 성과 기입'],
    inputs: '성과 요약',
    outputs: '최종 결과 텍스트',
    tips: ['A3 보고서와 숫자를 일치시키세요.']
  },

  // —— Define (brief) ——
  {
    id: 'project_charter',
    phase: 'define',
    title: '프로젝트 헌장',
    summary: '문제·목표·범위·팀을 문서화합니다.',
    purpose: '프로젝트 합의의 기준 문서.',
    when: ['프로젝트 착수'],
    steps: ['문제/목표/범위 작성', '일정·재무효과 기입', '스폰서 승인'],
    inputs: '헌장 필드',
    outputs: 'Project Charter',
    tips: ['범위(Out of Scope)를 분명히.']
  },
  {
    id: 'voc_ctq',
    phase: 'define',
    title: 'VOC & CTQ',
    summary: '고객 목소리를 측정 가능한 CTQ로 변환합니다.',
    purpose: 'Y(성과지표)를 정의합니다.',
    when: ['문제 정의 단계'],
    steps: ['VOC 수집', 'CTQ·규격·가중치 정의'],
    inputs: 'VOC/CTQ 항목',
    outputs: 'CTQ 트리',
    tips: ['측정 가능한 문장으로 쓰세요.']
  },
  {
    id: 'sipoc',
    phase: 'define',
    title: 'SIPOC',
    summary: 'Supplier-Input-Process-Output-Customer를 한 장으로 정리합니다.',
    purpose: '프로세스 경계를 공유합니다.',
    when: ['범위 합의 시'],
    steps: ['고수준 5~7 단계 Process', '입출력·고객 기입'],
    inputs: 'SIPOC 표',
    outputs: 'SIPOC',
    tips: ['세부 공정맵 전에 고수준부터.']
  }
];

export function getManualById(id) {
  if (!id) return null;
  return TOOL_MANUALS.find(m => m.id === id) || null;
}

export function getManualsByPhase(phase) {
  if (!phase || phase === 'all') return TOOL_MANUALS;
  return TOOL_MANUALS.filter(m => m.phase === phase);
}

export function searchManuals(query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return TOOL_MANUALS;
  return TOOL_MANUALS.filter(m =>
    [m.id, m.title, m.summary, m.purpose, ...(m.when || [])]
      .join(' ')
      .toLowerCase()
      .includes(q)
  );
}
