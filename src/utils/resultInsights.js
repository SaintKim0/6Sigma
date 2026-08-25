/**
 * 통계 분석 결과 → 해석 · 조언 · 대응방안 (규칙 기반)
 * AI API 없이도 동작. AI는 선택 보강.
 */

const sev = (level) => level; // ok | watch | alert | info

function base(summary, interpretation, actions, severity = 'info') {
  return {
    summary,
    interpretation: Array.isArray(interpretation) ? interpretation : [interpretation],
    actions: Array.isArray(actions) ? actions : [actions],
    severity
  };
}

export function buildInsight(toolId, result) {
  if (!result || result.ok === false) {
    return base(
      '분석 결과가 없거나 실패했습니다.',
      result?.message || '데이터를 확인하고 다시 실행하세요.',
      ['입력 형식·표본 수·결측값을 점검하세요.'],
      'watch'
    );
  }

  switch (toolId) {
    case 'normality':
      return result.isNormal
        ? base(
          '정규성 가정 OK',
          [
            `Anderson-Darling p=${result.pValue?.toFixed(4)} ≥ 0.05로, 정규분포로 보는 것이 타당합니다.`,
            '평균·표준편차 기반의 Cp/Cpk, t검정, 관리도(X̄-R) 등을 안심하고 사용할 수 있습니다.'
          ],
          [
            '공정능력·가설검정·관리도를 진행하세요.',
            '이상치가 보이면 박스플롯으로 한 번 더 확인하세요.'
          ],
          'ok'
        )
        : base(
          '정규성 기각 — 변환 또는 비모수 검토',
          [
            `p=${result.pValue?.toFixed(4)} < 0.05로 정규분포 가정이 기각됩니다.`,
            '왜도·이상치·혼합분포 가능성이 있습니다. 모수적 검정만 쓰면 오판 위험이 큽니다.'
          ],
          [
            'Box-Cox / log 변환 후 재검정',
            'Mann-Whitney, Kruskal-Wallis 등 비모수 검정 사용',
            '히스토그램·박스플롯으로 형태·이상치 확인',
            '표본이 매우 크면 실질적 영향도 함께 판단'
          ],
          'alert'
        );

    case 'capability': {
      const ppk = result.ppk;
      if (ppk == null) {
        return base(
          '규격(LSL/USL) 입력 필요',
          '공정능력 지수는 규격이 있어야 산출됩니다.',
          ['LSL·USL을 입력한 뒤 다시 분석하세요.', '규격이 한쪽만 있으면 단측 Cpk로 해석하세요.'],
          'watch'
        );
      }
      if (ppk >= 1.33) {
        return base(
          `장기 공정능력 양호 (Ppk=${ppk.toFixed(2)})`,
          [
            'Ppk ≥ 1.33은 일반적으로 “양호” 수준입니다.',
            result.pctOosExpected != null
              ? `기대 규격이탈 ≈ ${result.pctOosExpected.toFixed(3)}% (PPM≈${result.ppmExpected?.toFixed?.(0) ?? '—'})`
              : '규격 대비 여유가 있습니다.'
          ],
          [
            '관리도로 현 수준을 유지·감시',
            'Cp와 Pp 차이가 크면 공정 변동(특별원인) 점검',
            '고객 CTQ와 연계해 목표 시그마를 재확인'
          ],
          'ok'
        );
      }
      if (ppk >= 1.0) {
        return base(
          `공정능력 경계 (Ppk=${ppk.toFixed(2)})`,
          [
            '1.0 ≤ Ppk < 1.33 — 단기적으로는 버티지만 여유가 부족합니다.',
            '중심 이탈(Cpk≪Cp)이면 평균 조정이, 폭이 크면 산포 축소가 우선입니다.'
          ],
          [
            '평균이 규격 중심에 있는지 확인 (타겟팅)',
            '주요 X 인자에 DOE·회귀로 산포 원인 추적',
            '측정시스템(Gage R&R)이 산포를 키우는지 점검'
          ],
          'watch'
        );
      }
      return base(
        `공정능력 부족 (Ppk=${ppk.toFixed(2)})`,
        [
          'Ppk < 1.0 — 규격이탈 위험이 큽니다. 개선 프로젝트가 필요합니다.',
          result.pctOosObserved != null
            ? `실측 규격이탈 ${result.pctOosObserved.toFixed(2)}%`
            : '규격 대비 여유 없음'
        ],
        [
          'Define/Measure로 CTQ·현 수준을 명확히 하고 Improve 착수',
          '평균 이동 vs 산포 중 어느 레버를 데이터로 결정',
          '단기(Cpk)와 장기(Ppk) 갭이 크면 특별원인·배치 간 차이를 조사'
        ],
        'alert'
      );
    }

    case 'anova':
      return result.significant
        ? base(
          '그룹 간 평균 차이 유의',
          [
            `F=${result.F?.toFixed(3)}, p=${result.pValue?.toFixed(4)} < 0.05 → 적어도 한 그룹 평균이 다릅니다.`,
            '어느 그룹이 다른지는 사후검정(Tukey 등) 또는 박스플롯으로 확인하세요.'
          ],
          [
            '최고/최저 그룹의 공정·교대·설비를 비교',
            '등분산(Levene) 확인 후 필요 시 Welch/비모수',
            'Tukey 사후검정으로 유의한 쌍을 확인',
            '차이의 실무 크기(효과량)도 함께 보고'
          ],
          'alert'
        )
        : base(
          '그룹 간 평균 차이 비유의',
          [
            `p=${result.pValue?.toFixed(4)} ≥ 0.05 → 현재 데이터로는 그룹 평균 차이를 단정하기 어렵습니다.`,
            '표본이 작거나 산포가 크면 검출력이 낮을 수 있습니다.'
          ],
          [
            '샘플 크기 계산기로 필요 n 재검토',
            '실무적으로 의미 있는 δ를 정의하고 재설계',
            '다른 X(교호작용·공변량)를 포함한 분석을 검토'
          ],
          'ok'
        );

    case 'chi_square':
      return result.significant
        ? base(
          '범주 간 연관성 유의',
          [
            `χ²=${result.chi2?.toFixed(3)}, p=${result.pValue?.toFixed(4)} → 행·열 변수가 독립이 아닐 가능성이 큽니다.`,
            '잔차(관측-기대)가 큰 셀이 핵심 시사점입니다.'
          ],
          [
            '불량유형×라인 등에서 높은 셀을 우선 개선',
            '기대도수가 5 미만인 셀이 많으면 Fisher/합셀 검토',
            '현장 원인과 연결해 조치 계획 수립'
          ],
          'alert'
        )
        : base(
          '범주 독립성 기각 못함',
          [`p=${result.pValue?.toFixed(4)} ≥ 0.05 → 현재 표본에서는 연관성을 확신하기 어렵습니다.`],
          ['표본·기간을 늘려 재검정', '실무 KPI와 함께 추세 모니터링'],
          'ok'
        );

    case 'gage_rr': {
      const g = result.pctGRR;
      const actionsCommon = [
        result.pctEV > result.pctAV
          ? '반복성(EV)이 큼 → 측정 방법·치구·환경 표준화'
          : '재현성(AV)이 큼 → 평가자 교육·판정 기준 통일',
        `ndc=${result.ndc} (권장 ≥5). 낮으면 부품 산포 대비 측정 노이즈가 큼`,
        '개선 후 동일 계획으로 GR&R 재실시'
      ];
      if (g <= 10) {
        return base(`측정시스템 우수 (%GR&R=${g?.toFixed(1)}%)`, ['측정 오차가 작아 공정 데이터를 신뢰할 수 있습니다.'], ['현 측정 절차를 표준으로 고정', '주기적 MSA 재확인'], 'ok');
      }
      if (g <= 30) {
        return base(`측정시스템 허용 (%GR&R=${g?.toFixed(1)}%)`, ['조건부 사용 가능. 의사결정용으로는 개선을 권장합니다.'], actionsCommon, 'watch');
      }
      return base(`측정시스템 부적합 (%GR&R=${g?.toFixed(1)}%)`, ['측정 노이즈가 커 공정능력·가설검정이 왜곡될 수 있습니다. 분석 전에 MSA 개선이 우선입니다.'], actionsCommon, 'alert');
    }

    case 'doe': {
      const top = result.mainEffects?.[0] || result.interactions?.[0];
      return base(
        top ? `주요 효과: ${top.name} (effect=${Number(top.effect).toFixed(3)})` : 'DOE 효과 산출 완료',
        [
          result.conclusion,
          '효과가 큰 인자를 우선 최적 수준으로 설정하고, 교호작용이 크면 조합으로 해석하세요.'
        ],
        [
          '상위 1~2개 인자로 확인 실험(confirmation run)',
          '유의하지 않은 인자는 비용·편의 기준으로 고정',
          '최적 조건에서 Before/After·관리도 검증'
        ],
        'info'
      );
    }

    case 'correlation':
      return result.significant
        ? base(
          `상관 유의 (r=${result.r?.toFixed(3)})`,
          [
            result.conclusion,
            '상관은 인과가 아닙니다. 교란변수·측정시점을 함께 보세요.'
          ],
          [
            '산점도로 이상치·비선형 확인',
            '회귀·DOE로 인과/예측 모델 검증',
            '|r|가 커도 실무 의미(δ)를 따로 정의'
          ],
          Math.abs(result.r) >= 0.7 ? 'alert' : 'watch'
        )
        : base(
          '상관 비유의',
          [result.conclusion, '표본이 작으면 중간 크기의 상관도 놓칠 수 있습니다.'],
          ['n 확대 또는 다른 X 후보 탐색', '비선형 관계(2차·구간) 검토'],
          'ok'
        );

    case 'multi_regression':
    case 'residual': {
      const r2 = result.r2;
      const goodFit = r2 != null && r2 >= 0.7;
      const insight = base(
        goodFit ? `설명력 양호 (R²=${(r2 * 100).toFixed(1)}%)` : `설명력 보통/낮음 (R²=${r2 != null ? (r2 * 100).toFixed(1) : '—'}%)`,
        [
          result.conclusion || result.equation,
          '계수의 부호·크기가 현장 지식과 맞는지 확인하세요.',
          result.diagnostics?.conclusion
        ].filter(Boolean),
        [
          goodFit ? '주요 X를 관리항목(KPI)으로 등록' : '추가 X·교호항·비선형 항 검토',
          '잔차 진단에서 패턴이 있으면 모델 재설정',
          '다중공선성(비슷한 X) 있으면 변수 축소',
          '예측 구간을 공정 관리 한도와 비교'
        ],
        goodFit ? 'ok' : 'watch'
      );
      return insight;
    }

    case 'proportion':
      return result.significant
        ? base('비율 차이/이탈 유의', [result.conclusion], ['불량·합격률 개선 액션 정의', '샘플 기간·정의를 표준화해 재측정'], 'alert')
        : base('비율 차이 비유의', [result.conclusion], ['실무적으로 의미 있는 차이를 정의하고 샘플 크기 재산출'], 'ok');

    case 'levene':
      return result.equalVariance
        ? base('등분산 OK', [result.conclusion], ['ANOVA·t검정의 등분산 가정이 타당합니다.'], 'ok')
        : base('등분산 기각', [result.conclusion, '그룹 산포가 다릅니다. 평균 검정 해석에 주의하세요.'], ['Welch t / 로버스트 ANOVA', '산포가 큰 그룹의 특별원인 조사', '측정·샘플링 절차 통일'], 'alert');

    case 'nonparametric':
      return result.significant
        ? base('비모수 검정: 차이 유의', [result.conclusion], ['중앙값/분포 차이를 현장 조건과 매핑', '후속 개선 실험 설계'], 'alert')
        : base('비모수 검정: 비유의', [result.conclusion], ['효과 크기·필요 n 재검토'], 'ok');

    case 'weibull': {
      const beta = result.shape;
      let wear = '우발고장(지수에 가까움)';
      if (beta > 1.5) wear = '마모/열화형 (시간이 갈수록 고장↑)';
      else if (beta < 0.9) wear = '초기고장/번인형 (초기에 고장↑)';
      return base(
        `Weibull 적합 (β=${beta?.toFixed(2)}, η=${result.scale?.toFixed(2)})`,
        [result.conclusion, `형상 β 해석: ${wear}`, `B10≈${result.B10?.toFixed(2)}, MTTF≈${result.MTTF?.toFixed(2)}`],
        [
          beta > 1 ? '예방보전·수명 교체 주기 검토' : '초기 스크리닝·번인 강화',
          '보증기간·스페어 정책에 B10 활용',
          '고장 모드별 데이터를 분리해 재적합'
        ],
        'info'
      );
    }

    case 'sample_size':
      return base(
        result.conclusion || '필요 표본 수 산출',
        ['검출력(1-β)과 검출할 차이(δ)를 전제로 한 설계값입니다. 현실 수집 가능 여부와 맞춰 조정하세요.'],
        ['파일럿으로 σ·비율을 추정한 뒤 재계산', '다중 비교·탈락을 감안해 여유 n 확보'],
        'info'
      );

    case 'hypothesis_test':
      return base(
        result.significant ? '평균 차이 유의' : '평균 차이 비유의',
        [result.conclusion || result.result || 't-검정 결과'],
        result.significant
          ? ['차이의 방향·크기를 공정 KPI와 연결', '원인 X를 Analyze에서 추적']
          : ['실무 δ 정의 후 샘플 크기 재설계', '산포·측정오차 점검'],
        result.significant ? 'alert' : 'ok'
      );

    case 'regression': {
      const r2 = result.r2;
      const goodFit = r2 != null && r2 >= 0.7;
      return base(
        goodFit ? `설명력 양호 (R²=${(r2 * 100).toFixed(1)}%)` : (result.conclusion || '단순회귀 완료'),
        [
          result.conclusion,
          '단순회귀는 선형·인과를 단정하지 않습니다. 잔차·산점도를 함께 보세요.'
        ].filter(Boolean),
        [
          goodFit ? '핵심 X를 관리항목으로 등록하고 확인 실험' : '추가 변수·비선형·구간별 회귀 검토',
          '측정오차·교란변수 점검',
          'Improve에서 해당 X 수준을 조정·검증'
        ],
        goodFit ? 'ok' : 'info'
      );
    }

    case 'measure_dashboard': {
      const parts = [];
      const actions = [];
      let severity = 'info';
      if (result.isNormal === false) {
        parts.push(`정규성 p=${result.normalityP != null ? Number(result.normalityP).toFixed(3) : '—'} — 비정규 주의. 변환·비모수·관리도 해석에 유의하세요.`);
        actions.push('히스토그램·박스플롯으로 형태·이상치 확인', '정규성 도구에서 상세 검정');
        severity = 'watch';
      } else if (result.isNormal === true) {
        parts.push(`정규성 OK (p=${result.normalityP != null ? Number(result.normalityP).toFixed(3) : '—'}).`);
      }
      const ppk = result.ppk ?? result.cpk;
      if (ppk == null && (result.lsl == null && result.usl == null)) {
        parts.push('LSL/USL이 없어 공정능력·규격이탈 DPMO가 제한적입니다.');
        actions.push('규격 하한·상한을 입력해 Cp/Cpk와 %OOS를 확보하세요.');
        severity = severity === 'info' ? 'watch' : severity;
      } else if (ppk != null) {
        if (ppk >= 1.33) {
          parts.push(`공정능력 양호 (Ppk/Cpk≈${Number(ppk).toFixed(2)}). 현 수준 유지·감시가 핵심입니다.`);
          actions.push('관리도로 특별원인을 감시', 'Control 단계 반응계획을 준비');
          if (severity === 'info') severity = 'ok';
        } else if (ppk >= 1) {
          parts.push(`공정능력 경계 (≈${Number(ppk).toFixed(2)}). 중심·산포 개선 여지가 있습니다.`);
          actions.push('평균 타겟팅 vs 산포 축소 중 우선순위 결정', 'Analyze에서 X 후보 탐색');
          severity = 'watch';
        } else {
          parts.push(`공정능력 부족 (≈${Number(ppk).toFixed(2)}). 개선 프로젝트가 필요합니다.`);
          actions.push('CTQ·목표를 Define에서 재확인', 'Gage R&R로 측정 신뢰성 점검 후 Improve');
          severity = 'alert';
        }
      }
      if (result.sigmaLevel != null) {
        parts.push(`대략적 시그마 수준 ≈ ${Number(result.sigmaLevel).toFixed(1)}σ`);
      }
      return base(
        'Measure 자동분석 해석',
        parts.length ? parts : ['측정 데이터 요약이 준비되었습니다.'],
        actions.length ? actions : ['상세 도구(정규성·공정능력·관리도)로 드릴다운하세요.'],
        severity
      );
    }

    case 'before_after': {
      const improved = result.improvedCount ?? 0;
      const worsened = result.worsened ?? 0;
      if (improved >= 3) {
        return base(
          '개선 효과가 뚜렷합니다',
          [result.conclusion, '다수 KPI가 바람직한 방향으로 움직였습니다. 지속 가능 여부를 Control에서 확인하세요.'],
          ['관리항목·반응계획에 After 수준을 반영', '표준작업·교육으로 정착', '재발 모니터링 주기 설정'],
          'ok'
        );
      }
      if (improved >= 1) {
        return base(
          '부분 개선 — 남은 지표를 점검하세요',
          [result.conclusion, worsened ? `${worsened}개 지표는 악화/정체입니다.` : '추가 개선 여지가 있습니다.'],
          ['악화된 지표의 X 인자를 재분석', '파일럿 범위를 확대하거나 확인 실험', '측정 정의(Before/After)가 동일한지 확인'],
          'watch'
        );
      }
      return base(
        '개선 효과가 아직 불충분합니다',
        [result.conclusion || 'Before 대비 After 개선이 약합니다.'],
        ['개선안 실행 여부·기간을 점검', 'DOE/회귀로 X 재선정', '측정시스템·샘플링 오차 검토'],
        'alert'
      );
    }

    default:
      return base(
        result.conclusion || '분석 완료',
        ['결과를 프로젝트 CTQ·목표와 대조해 해석하세요.'],
        ['관련 DMAIC 단계 도구로 후속 조치', 'Before/After로 개선 효과 검증'],
        'info'
      );
  }
}

export const TOOL_INSIGHT_LABELS = {
  normality: '정규성 검정',
  capability: '공정능력',
  anova: 'ANOVA',
  chi_square: '카이제곱',
  gage_rr: 'Gage R&R',
  doe: 'DOE',
  correlation: '상관분석',
  multi_regression: '다중회귀',
  residual: '잔차 진단',
  proportion: '비율 검정',
  levene: '등분산',
  nonparametric: '비모수',
  weibull: 'Weibull',
  sample_size: '샘플 크기',
  hypothesis_test: '가설검정',
  regression: '단순회귀',
  measure_dashboard: 'Measure 자동분석',
  before_after: 'Before/After'
};
