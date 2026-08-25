/**
 * 관리도 Western Electric / Nelson 스타일 해석 규칙
 * values: 플롯 점, cl/ucl/lcl: 한계 (고정 한계 가정)
 */

function zoneBounds(cl, ucl, lcl) {
  const sigma = (ucl - cl) / 3;
  if (!(sigma > 0)) return null;
  return {
    sigma,
    // Zone A: 2σ~3σ, B: 1σ~2σ, C: 0~1σ
    upper: {
      aLo: cl + 2 * sigma,
      bLo: cl + sigma,
      cLo: cl
    },
    lower: {
      aHi: cl - 2 * sigma,
      bHi: cl - sigma,
      cHi: cl
    }
  };
}

function sideOf(v, cl) {
  if (v > cl) return 1;
  if (v < cl) return -1;
  return 0;
}

/**
 * @returns {{ signals: Array, summary: string, nextActions: string[] }}
 */
export function analyzeControlChartRules(values = [], { cl, ucl, lcl } = {}) {
  const n = values.length;
  const signals = [];
  if (n < 1 || cl == null || ucl == null || lcl == null) {
    return {
      ok: false,
      signals: [],
      summary: '한계를 계산할 수 없어 규칙 분석을 건너뜁니다.',
      nextActions: []
    };
  }

  const zones = zoneBounds(cl, ucl, lcl);

  // Rule 1: 1점 > UCL 또는 < LCL
  values.forEach((v, i) => {
    if (v > ucl || v < lcl) {
      signals.push({
        rule: 1,
        name: '한계 이탈',
        index: i,
        message: `${i + 1}번째 점이 관리한계 밖입니다.`,
        severity: 'alert'
      });
    }
  });

  // Rule 2: 연속 9점이 CL 같은 쪽 (Nelson #2 / WE run)
  if (n >= 9) {
    let run = 1;
    let side = sideOf(values[0], cl);
    for (let i = 1; i < n; i++) {
      const s = sideOf(values[i], cl);
      if (s !== 0 && s === side) run += 1;
      else {
        run = s === 0 ? 0 : 1;
        side = s;
      }
      if (run >= 9 && s !== 0) {
        signals.push({
          rule: 2,
          name: '런 (CL 한쪽에 9점)',
          index: i,
          message: `${i - 8 + 1}~${i + 1}번: 중심선 한쪽에 연속 9점.`,
          severity: 'watch'
        });
        run = 0; // 중복 억제
      }
    }
  }

  // Rule 3: 연속 6점 증가 또는 감소 (트렌드)
  if (n >= 6) {
    for (let i = 5; i < n; i++) {
      let up = true;
      let down = true;
      for (let j = i - 5; j < i; j++) {
        if (!(values[j + 1] > values[j])) up = false;
        if (!(values[j + 1] < values[j])) down = false;
      }
      if (up || down) {
        signals.push({
          rule: 3,
          name: '트렌드 (6점)',
          index: i,
          message: `${i - 4}~${i + 1}번: 연속 6점 ${up ? '상승' : '하락'} 추세.`,
          severity: 'watch'
        });
      }
    }
  }

  // Rule 4: 연속 14점 교대 업/다운
  if (n >= 14) {
    for (let i = 13; i < n; i++) {
      let alt = true;
      for (let j = i - 13; j < i; j++) {
        const d1 = values[j + 1] - values[j];
        const d0 = j > i - 13 ? values[j] - values[j - 1] : null;
        if (d0 != null && Math.sign(d1) === Math.sign(d0) && d1 !== 0 && d0 !== 0) {
          alt = false;
          break;
        }
        if (d1 === 0) { alt = false; break; }
      }
      // simpler alternating check
      alt = true;
      for (let j = i - 12; j <= i; j++) {
        const prev = values[j - 1] - values[j - 2];
        const cur = values[j] - values[j - 1];
        if (Math.sign(prev) === Math.sign(cur) || cur === 0 || prev === 0) {
          alt = false;
          break;
        }
      }
      if (alt) {
        signals.push({
          rule: 4,
          name: '교대 패턴 (14점)',
          index: i,
          message: `${i - 12}~${i + 1}번 부근: 오르내림이 교대하는 패턴.`,
          severity: 'watch'
        });
      }
    }
  }

  // Rule 5: Zone A — 연속 3점 중 2점이 2σ 밖 (같은 쪽)
  if (zones && n >= 3) {
    for (let i = 2; i < n; i++) {
      const window = [i - 2, i - 1, i];
      const up = window.filter(idx => values[idx] > zones.upper.aLo).length;
      const dn = window.filter(idx => values[idx] < zones.lower.aHi).length;
      if (up >= 2) {
        signals.push({
          rule: 5,
          name: 'Zone A (2/3)',
          index: i,
          message: `${i - 1}~${i + 1}번: 3점 중 2점이 +2σ 밖.`,
          severity: 'alert'
        });
      }
      if (dn >= 2) {
        signals.push({
          rule: 5,
          name: 'Zone A (2/3)',
          index: i,
          message: `${i - 1}~${i + 1}번: 3점 중 2점이 −2σ 밖.`,
          severity: 'alert'
        });
      }
    }
  }

  // Rule 6: Zone B — 연속 5점 중 4점이 1σ 밖 (같은 쪽)
  if (zones && n >= 5) {
    for (let i = 4; i < n; i++) {
      const window = [i - 4, i - 3, i - 2, i - 1, i];
      const up = window.filter(idx => values[idx] > zones.upper.bLo).length;
      const dn = window.filter(idx => values[idx] < zones.lower.bHi).length;
      if (up >= 4) {
        signals.push({
          rule: 6,
          name: 'Zone B (4/5)',
          index: i,
          message: `${i - 3}~${i + 1}번: 5점 중 4점이 +1σ 밖.`,
          severity: 'watch'
        });
      }
      if (dn >= 4) {
        signals.push({
          rule: 6,
          name: 'Zone B (4/5)',
          index: i,
          message: `${i - 3}~${i + 1}번: 5점 중 4점이 −1σ 밖.`,
          severity: 'watch'
        });
      }
    }
  }

  // 중복 메시지 축약 (같은 rule+index)
  const seen = new Set();
  const unique = signals.filter(s => {
    const key = `${s.rule}:${s.index}:${s.message}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const alertN = unique.filter(s => s.severity === 'alert').length;
  const summary = unique.length === 0
    ? '규칙 위반 신호가 없습니다. 공정이 통계적으로 안정적으로 보입니다.'
    : `해석 신호 ${unique.length}건 (심각 ${alertN} · 주의 ${unique.length - alertN}).`;

  const nextActions = unique.length === 0
    ? ['현 관리한계로 모니터링 유지', '공정능력(Cp/Cpk)과 연계해 목표 대비 여유 확인']
    : [
      '신호 시점의 교대·자재·설비·측정 변경을 조사 (특별원인)',
      '원인 제거 후 안정화되면 관리한계를 재계산할지 검토',
      '반복 신호면 MSA·샘플링 간격·공정 능력을 함께 점검'
    ];

  return { ok: true, signals: unique, summary, nextActions };
}
