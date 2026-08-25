/**
 * 통계 도구별 분석방향 설정 → 확장 가능한 데이터시트 템플릿
 */

import { parseTable, parseNumberLoose, interpretImport } from './dataImport';

/** 빈 행 기본 개수 (엑셀에서 행 추가해 확장 가능) */
export const DEFAULT_EMPTY_ROWS = 20;

export const TOOL_TEMPLATE_TYPES = {
  numbers: {
    id: 'numbers',
    label: '단일 측정값',
    desc: '정규성·공정능력·Weibull 등 한 열 데이터',
    defaults: { columnName: '측정값', emptyRows: DEFAULT_EMPTY_ROWS }
  },
  xy: {
    id: 'xy',
    label: 'X·Y (2변수)',
    desc: '상관·단순회귀',
    defaults: { xName: 'X', yName: 'Y', emptyRows: DEFAULT_EMPTY_ROWS }
  },
  groups: {
    id: 'groups',
    label: '그룹 비교',
    desc: 'ANOVA·Levene·비모수·t검정 (열=그룹)',
    defaults: {
      groupCount: 3,
      groupNames: ['그룹A', '그룹B', '그룹C'],
      emptyRows: DEFAULT_EMPTY_ROWS
    }
  },
  regression: {
    id: 'regression',
    label: '다중회귀',
    desc: '독립변수 N개 + 종속변수 Y',
    defaults: {
      xCount: 2,
      xNames: ['X1', 'X2'],
      yName: 'Y',
      emptyRows: DEFAULT_EMPTY_ROWS
    }
  },
  grr: {
    id: 'grr',
    label: 'Gage R&R',
    desc: '부품 · 평가자 · 측정값',
    defaults: { emptyRows: 30 }
  },
  doe: {
    id: 'doe',
    label: 'DOE 실험 run',
    desc: '인자 수준(-1/1) + 반응 y',
    defaults: {
      factorCount: 3,
      factorNames: ['인자1', '인자2', '인자3'],
      emptyRows: 16
    }
  },
  contingency: {
    id: 'contingency',
    label: '분할표 (카이제곱)',
    desc: '행×열 빈도',
    defaults: {
      rowCount: 2,
      colCount: 2,
      rowLabels: ['행1', '행2'],
      colLabels: ['열1', '열2']
    }
  }
};

const padNames = (names, n, prefix) =>
  Array.from({ length: n }, (_, i) => (names[i] && String(names[i]).trim()) || `${prefix}${i + 1}`);

/** 설정 정규화 */
export function normalizeConfig(type, raw = {}) {
  const meta = TOOL_TEMPLATE_TYPES[type];
  const d = { ...(meta?.defaults || {}), ...raw };

  if (type === 'numbers') {
    return {
      type,
      columnName: d.columnName || '측정값',
      emptyRows: Math.max(5, Number(d.emptyRows) || DEFAULT_EMPTY_ROWS)
    };
  }
  if (type === 'xy') {
    return {
      type,
      xName: d.xName || 'X',
      yName: d.yName || 'Y',
      emptyRows: Math.max(5, Number(d.emptyRows) || DEFAULT_EMPTY_ROWS)
    };
  }
  if (type === 'groups') {
    const groupCount = Math.max(2, Math.min(12, Number(d.groupCount) || 3));
    return {
      type,
      groupCount,
      groupNames: padNames(d.groupNames || [], groupCount, '그룹'),
      emptyRows: Math.max(5, Number(d.emptyRows) || DEFAULT_EMPTY_ROWS)
    };
  }
  if (type === 'regression') {
    const xCount = Math.max(1, Math.min(10, Number(d.xCount) || 2));
    return {
      type,
      xCount,
      xNames: padNames(d.xNames || [], xCount, 'X'),
      yName: d.yName || 'Y',
      emptyRows: Math.max(5, Number(d.emptyRows) || DEFAULT_EMPTY_ROWS)
    };
  }
  if (type === 'grr') {
    return {
      type,
      emptyRows: Math.max(10, Number(d.emptyRows) || 30)
    };
  }
  if (type === 'doe') {
    const factorCount = Math.max(2, Math.min(6, Number(d.factorCount) || 3));
    return {
      type,
      factorCount,
      factorNames: padNames(d.factorNames || [], factorCount, '인자'),
      emptyRows: Math.max(4, Number(d.emptyRows) || 16)
    };
  }
  if (type === 'contingency') {
    const rowCount = Math.max(2, Math.min(10, Number(d.rowCount) || 2));
    const colCount = Math.max(2, Math.min(10, Number(d.colCount) || 2));
    return {
      type,
      rowCount,
      colCount,
      rowLabels: padNames(d.rowLabels || [], rowCount, '행'),
      colLabels: padNames(d.colLabels || [], colCount, '열')
    };
  }
  return { type, ...d };
}

/** 헤더 배열 */
export function getTemplateHeaders(config) {
  const c = normalizeConfig(config.type, config);
  if (c.type === 'numbers') return [c.columnName];
  if (c.type === 'xy') return [c.xName, c.yName];
  if (c.type === 'groups') return c.groupNames;
  if (c.type === 'regression') return [...c.xNames, c.yName];
  if (c.type === 'grr') return ['부품', '평가자', '측정값'];
  if (c.type === 'doe') return [...c.factorNames, 'y'];
  if (c.type === 'contingency') return ['행라벨', ...c.colLabels];
  return [];
}

/** CSV 문자열 생성 (빈 행 = 확장용 자리) */
export function buildTemplateCsv(config, { withSample = false } = {}) {
  const c = normalizeConfig(config.type, config);
  const headers = getTemplateHeaders(c);
  const lines = [headers.join(',')];

  if (c.type === 'contingency') {
    c.rowLabels.forEach((rl, i) => {
      const cells = [rl, ...Array(c.colCount).fill(withSample ? String((i + 1) * 10) : '')];
      lines.push(cells.join(','));
    });
    return lines.join('\n');
  }

  const n = c.emptyRows || DEFAULT_EMPTY_ROWS;
  for (let i = 0; i < n; i++) {
    if (withSample && i < 3 && c.type === 'numbers') {
      lines.push(String(10 + i * 0.1));
    } else if (withSample && i < 3 && c.type === 'xy') {
      lines.push(`${10 + i * 5},${12 + i * 4}`);
    } else {
      lines.push(headers.map(() => '').join(','));
    }
  }

  // 안내 주석 행은 CSV 파서가 깨질 수 있어 별도 README 텍스트로
  return lines.join('\n');
}

export function buildTemplateGuide(config) {
  const c = normalizeConfig(config.type, config);
  const headers = getTemplateHeaders(c);
  return [
    `【6시그마 데이터시트】 ${TOOL_TEMPLATE_TYPES[c.type]?.label || c.type}`,
    `열: ${headers.join(' | ')}`,
    '1) 아래 CSV를 엑셀에서 여세요.',
    '2) 헤더는 유지하고, 데이터 행에 값을 붙여넣으세요.',
    '3) 행이 부족하면 엑셀에서 행을 더 추가해도 됩니다 (확장 가능).',
    '4) CSV로 저장한 뒤 도구에서 「템플릿 업로드」하세요.',
    c.type === 'doe' ? '※ DOE 인자 수준은 -1 또는 1' : '',
    c.type === 'grr' ? '※ 같은 부품·평가자 조합의 반복 측정을 여러 행으로' : ''
  ].filter(Boolean).join('\n');
}

export function downloadBlob(filename, content, mime = 'text/csv;charset=utf-8') {
  const blob = new Blob(['\uFEFF' + content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * 업로드된 표를 설정에 맞게 검증·변환
 * 행 수는 자유(확장 허용). 열은 설정과 맞추거나 위치 매핑.
 */
export function parseUploadAgainstConfig(text, config) {
  const c = normalizeConfig(config.type, config);
  const table = parseTable(text);
  if (!table.rows.length) {
    return { ok: false, message: '데이터 행이 없습니다. 템플릿에 값을 채운 뒤 업로드하세요.' };
  }

  const expected = getTemplateHeaders(c);

  if (c.type === 'numbers') {
    // 설정 열 이름 우선, 없으면 첫 숫자 열
    let col = 0;
    if (table.hasHeader) {
      const idx = table.headers.findIndex(h =>
        String(h).trim() === c.columnName || String(h).includes(c.columnName)
      );
      if (idx >= 0) col = idx;
    }
    const numbers = table.rows.map(r => parseNumberLoose(r[col])).filter(v => !isNaN(v));
    if (numbers.length < 3) {
      return { ok: false, message: `유효한 숫자가 ${numbers.length}개뿐입니다. 최소 3개 이상 입력하세요.` };
    }
    return {
      ok: true,
      config: c,
      mode: 'numbers',
      numbers,
      text: numbers.join(', '),
      n: numbers.length,
      preview: `${numbers.length}개 측정값`
    };
  }

  if (c.type === 'xy') {
    let xCol = 0;
    let yCol = 1;
    if (table.hasHeader) {
      const xi = table.headers.findIndex(h => String(h).trim() === c.xName);
      const yi = table.headers.findIndex(h => String(h).trim() === c.yName);
      if (xi >= 0) xCol = xi;
      if (yi >= 0) yCol = yi;
    }
    const x = [];
    const y = [];
    table.rows.forEach(r => {
      const a = parseNumberLoose(r[xCol]);
      const b = parseNumberLoose(r[yCol]);
      if (!isNaN(a) && !isNaN(b)) { x.push(a); y.push(b); }
    });
    if (x.length < 3) {
      return { ok: false, message: 'X·Y 유효 쌍이 부족합니다 (최소 3쌍).' };
    }
    return {
      ok: true,
      config: c,
      mode: 'xy',
      x,
      y,
      xText: x.join(', '),
      yText: y.join(', '),
      preview: `${x.length}쌍`
    };
  }

  if (c.type === 'groups') {
    // 열 = 그룹 (헤더가 그룹명)
    const names = c.groupNames;
    let cols = names.map((_, i) => i);
    if (table.hasHeader) {
      cols = names.map((name, i) => {
        const idx = table.headers.findIndex(h => String(h).trim() === name);
        return idx >= 0 ? idx : i;
      });
    }
    const groups = names.map((name, i) => {
      const values = table.rows
        .map(r => parseNumberLoose(r[cols[i]]))
        .filter(v => !isNaN(v));
      return { name, values, valuesText: values.join(', ') };
    }).filter(g => g.values.length >= 1);

    if (groups.length < 2) {
      return { ok: false, message: '그룹이 2개 이상 필요합니다. 열 헤더와 데이터를 확인하세요.' };
    }
    const text = groups.map(g => `${g.name}: ${g.valuesText}`).join('\n');
    return {
      ok: true,
      config: c,
      mode: 'namedGroups',
      groups,
      text,
      preview: `${groups.length}그룹 · ${groups.reduce((s, g) => s + g.values.length, 0)}값`
    };
  }

  if (c.type === 'regression') {
    const headers = table.hasHeader ? table.headers : expected;
    const xNames = c.xNames;
    const yName = c.yName;
    let xIdx = xNames.map((_, i) => i);
    let yIdx = xNames.length;
    if (table.hasHeader) {
      xIdx = xNames.map((n, i) => {
        const idx = headers.findIndex(h => String(h).trim() === n);
        return idx >= 0 ? idx : i;
      });
      const yi = headers.findIndex(h => String(h).trim() === yName);
      if (yi >= 0) yIdx = yi;
    }
    const X = [];
    const y = [];
    table.rows.forEach(r => {
      const xs = xIdx.map(i => parseNumberLoose(r[i]));
      const yy = parseNumberLoose(r[yIdx]);
      if (xs.every(v => !isNaN(v)) && !isNaN(yy)) {
        X.push(xs);
        y.push(yy);
      }
    });
    if (y.length < c.xCount + 2) {
      return { ok: false, message: `회귀용 행이 부족합니다 (현재 ${y.length}행). 변수 수보다 여유 있게 입력하세요.` };
    }
    return {
      ok: true,
      config: c,
      mode: 'table',
      xNames,
      yName,
      X,
      y,
      headers: [...xNames, yName],
      tableText: table.rows.map(r => r.join(', ')).join('\n'),
      headerText: [...xNames, yName].join(', '),
      preview: `${y.length}행 · X${c.xCount}+Y`
    };
  }

  if (c.type === 'grr') {
    const r = interpretImport(text, 'grr');
    if (!r.ok) return r;
    return { ...r, config: c, ok: true };
  }

  if (c.type === 'doe') {
    const r = interpretImport(text, 'doe');
    if (!r.ok) return r;
    return {
      ...r,
      config: c,
      factorNames: c.factorNames,
      ok: true
    };
  }

  if (c.type === 'contingency') {
    const hasRowLabels = table.rows.every(row => isNaN(parseNumberLoose(row[0])));
    let rowLabels;
    let colLabels;
    let matrix;
    if (hasRowLabels) {
      rowLabels = table.rows.map(row => row[0]);
      colLabels = table.hasHeader ? table.headers.slice(1) : c.colLabels;
      matrix = table.rows.map(row => row.slice(1).map(v => parseNumberLoose(v)).map(v => (isNaN(v) ? 0 : v)));
    } else {
      rowLabels = c.rowLabels.slice(0, table.rows.length);
      colLabels = table.hasHeader ? table.headers : c.colLabels;
      matrix = table.rows.map(row => row.map(v => parseNumberLoose(v)).map(v => (isNaN(v) ? 0 : v)));
    }
    const rr = matrix.length;
    const cc = matrix[0]?.length || 0;
    if (rr < 2 || cc < 2) {
      return { ok: false, message: '분할표는 최소 2×2 필요합니다.' };
    }
    return {
      ok: true,
      config: c,
      mode: 'contingency',
      rowLabels: rowLabels.slice(0, rr),
      colLabels: (colLabels.length >= cc ? colLabels : c.colLabels).slice(0, cc),
      cells: matrix,
      preview: `${rr}×${cc} 분할표`
    };
  }

  return { ok: false, message: '알 수 없는 템플릿 유형입니다.' };
}
