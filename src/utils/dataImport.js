/**
 * 엑셀 붙여넣기 / CSV·TSV·TXT 파일 공통 파서
 */

export const splitCells = (line) => {
  const s = String(line || '').replace(/\uFEFF/g, '');
  if (s.includes('\t')) return s.split('\t').map(c => c.trim());
  // CSV: 간단 처리 (따옴표 안 콤마는 숫자 데이터에서 드묾)
  if (s.includes(';') && !s.includes(',')) return s.split(';').map(c => c.trim());
  return s.split(',').map(c => c.trim());
};

export const parseNumberLoose = (v) => {
  if (v == null || v === '') return NaN;
  const s = String(v).trim().replace(/,/g, '');
  if (!s || s === '-' || s === '.') return NaN;
  const n = parseFloat(s);
  return isNaN(n) ? NaN : n;
};

export const parseNumberList = (text) => {
  if (!text) return [];
  return String(text)
    .replace(/\uFEFF/g, '')
    .split(/[\s,;|\t\n\r]+/)
    .map(v => v.trim())
    .filter(Boolean)
    .map(parseNumberLoose)
    .filter(v => !isNaN(v));
};

/** 텍스트 → 2D 테이블 (빈 줄 제거) */
export function parseTable(text) {
  const lines = String(text || '')
    .replace(/\uFEFF/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map(l => l.trimEnd())
    .filter(l => l.trim().length > 0);

  const rows = lines.map(splitCells);
  if (!rows.length) return { headers: [], rows: [], rawRows: [] };

  // 첫 행이 전부 비숫자면 헤더로 간주
  const firstIsHeader = rows[0].every(c => c === '' || isNaN(parseNumberLoose(c)));
  const headers = firstIsHeader
    ? rows[0].map((h, i) => h || `열${i + 1}`)
    : rows[0].map((_, i) => `열${i + 1}`);
  const dataRows = firstIsHeader ? rows.slice(1) : rows;

  return {
    headers,
    rows: dataRows,
    rawRows: rows,
    hasHeader: firstIsHeader
  };
}

/** 단일 열 숫자 추출 (열 인덱스 지정) */
export function extractColumnNumbers(table, colIndex = 0) {
  return (table.rows || [])
    .map(r => parseNumberLoose(r[colIndex]))
    .filter(v => !isNaN(v));
}

/** 두 열 → X,Y */
export function extractXY(table, xCol = 0, yCol = 1) {
  const x = [];
  const y = [];
  (table.rows || []).forEach(r => {
    const a = parseNumberLoose(r[xCol]);
    const b = parseNumberLoose(r[yCol]);
    if (!isNaN(a) && !isNaN(b)) {
      x.push(a);
      y.push(b);
    }
  });
  return { x, y };
}

/**
 * 명명 그룹 파싱
 * 지원:
 *  A: 1,2,3
 *  A\t1\t2\t3  (첫 열 이름)
 *  열 헤더가 그룹명인 표
 */
export function parseNamedGroups(text) {
  const lines = String(text || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (!lines.length) return [];

  // "이름: 값..." 형식
  const colonGroups = lines.map((line, i) => {
    const m = line.match(/^([^:：]+)[:：]\s*(.+)$/);
    if (m) {
      return {
        name: m[1].trim(),
        values: parseNumberList(m[2]),
        valuesText: m[2]
      };
    }
    return null;
  }).filter(Boolean);

  if (colonGroups.length >= 1 && colonGroups.every(g => g.values.length)) {
    return colonGroups;
  }

  const table = parseTable(text);
  if (table.headers.length >= 2 && table.rows.length) {
    // 첫 열이 이름, 나머지가 값? 또는 각 열이 그룹
    const firstColNums = table.rows.filter(r => !isNaN(parseNumberLoose(r[0]))).length;
    const firstColNames = table.rows.length - firstColNums;

    if (firstColNames > firstColNums) {
      // 행 = 그룹 (이름 + 값들)
      return table.rows.map((r, i) => ({
        name: r[0] || `G${i + 1}`,
        values: r.slice(1).map(parseNumberLoose).filter(v => !isNaN(v)),
        valuesText: r.slice(1).filter(c => c !== '').join(', ')
      })).filter(g => g.values.length);
    }

    // 열 = 그룹
    return table.headers.map((h, i) => ({
      name: h,
      values: extractColumnNumbers(table, i),
      valuesText: extractColumnNumbers(table, i).join(', ')
    })).filter(g => g.values.length);
  }

  // fallback: 한 줄 숫자 → 단일 그룹
  const nums = parseNumberList(text);
  return nums.length ? [{ name: 'G1', values: nums, valuesText: nums.join(', ') }] : [];
}

/** 숫자를 붙여넣기용 텍스트로 */
export const numbersToText = (nums, sep = ', ') =>
  (nums || []).map(n => (Number.isInteger(n) ? String(n) : String(n))).join(sep);

/** XY를 두 줄/두 열 텍스트로 */
export const xyToText = (x, y) => {
  const n = Math.min(x.length, y.length);
  return Array.from({ length: n }, (_, i) => `${x[i]}\t${y[i]}`).join('\n');
};

export const FORMAT_GUIDES = {
  numbers: {
    title: '숫자 목록',
    hint: '엑셀 한 열을 복사해 붙여넣거나, CSV/TXT를 업로드하세요.',
    sample: '4.9\n5.0\n5.1\n4.8\n5.2',
    accept: '.csv,.txt,.tsv'
  },
  xy: {
    title: 'X·Y 두 열',
    hint: '엑셀에서 X열·Y열을 함께 복사(탭 구분)하거나 2열 CSV를 올리세요.',
    sample: 'X\tY\n10\t12\n20\t25\n30\t28\n40\t41',
    accept: '.csv,.txt,.tsv'
  },
  namedGroups: {
    title: '그룹별 데이터',
    hint: '「그룹명: 값,값…」또는 열=그룹인 표를 붙여넣으세요.',
    sample: '라인A: 4.9, 5.0, 5.1, 4.8\n라인B: 4.7, 5.3, 4.6, 5.4\n라인C: 5.0, 5.0, 4.9, 5.1',
    accept: '.csv,.txt,.tsv'
  },
  table: {
    title: '표 (헤더+행)',
    hint: '첫 행=열 이름, 마지막 열=Y 권장. 엑셀 표를 그대로 복사하세요.',
    sample: '온도\t냉각시간\t보압\t불량률\n242\t25\t85\t12.5\n248\t25\t85\t9.2\n242\t30\t85\t10.1',
    accept: '.csv,.txt,.tsv'
  },
  grr: {
    title: 'Gage R&R (부품,평가자,측정)',
    hint: '3열: Part, Operator, Value',
    sample: 'Part,Operator,Value\n1,A,10.1\n1,A,10.2\n1,B,10.0\n2,A,9.8\n2,B,9.9',
    accept: '.csv,.txt,.tsv'
  },
  doe: {
    title: 'DOE run (−1/1, y)',
    hint: '각 줄: 인자1,인자2,…,y (수준은 -1 또는 1)',
    sample: '-1,-1,-1,12.5\n1,-1,-1,9.2\n-1,1,-1,10.1\n1,1,-1,7.8',
    accept: '.csv,.txt,.tsv'
  }
};

export async function readFileAsText(file) {
  const name = (file?.name || '').toLowerCase();
  if (/\.(xlsx|xls)$/i.test(name)) {
    throw new Error('엑셀(.xlsx)은 CSV로 저장하거나, 시트를 복사해 붙여넣기 하세요.');
  }
  if (!/\.(csv|txt|tsv)$/i.test(name)) {
    throw new Error('CSV, TXT, TSV 파일만 지원합니다. (엑셀은 CSV 저장 또는 복사-붙여넣기)');
  }
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
    reader.readAsText(file, 'UTF-8');
  });
}

/**
 * mode에 따라 텍스트를 해석해 공통 결과 객체 반환
 */
export function interpretImport(text, mode = 'numbers', options = {}) {
  const clean = String(text || '').replace(/\uFEFF/g, '');
  if (!clean.trim()) {
    return { ok: false, message: '데이터가 비어 있습니다.' };
  }

  if (mode === 'numbers') {
    const table = parseTable(clean);
    const col = options.columnIndex ?? 0;
    let numbers;
    if (table.headers.length > 1 && table.rows.length) {
      numbers = extractColumnNumbers(table, Math.min(col, table.headers.length - 1));
    } else {
      numbers = parseNumberList(clean);
    }
    if (!numbers.length) return { ok: false, message: '숫자를 찾지 못했습니다.' };
    return {
      ok: true,
      mode,
      numbers,
      text: numbersToText(numbers),
      table,
      preview: `${numbers.length}개 숫자`
    };
  }

  if (mode === 'xy') {
    const table = parseTable(clean);
    const xCol = options.xCol ?? 0;
    const yCol = options.yCol ?? 1;
    const { x, y } = extractXY(table, xCol, yCol);
    if (x.length < 2) return { ok: false, message: 'X·Y 쌍이 부족합니다. 두 열 데이터를 붙여넣으세요.' };
    return {
      ok: true,
      mode,
      x,
      y,
      xText: numbersToText(x),
      yText: numbersToText(y),
      text: xyToText(x, y),
      table,
      preview: `${x.length}쌍 (X,Y)`
    };
  }

  if (mode === 'namedGroups') {
    const groups = parseNamedGroups(clean);
    if (!groups.length) return { ok: false, message: '그룹 데이터를 해석하지 못했습니다.' };
    const textOut = groups.map(g => `${g.name}: ${g.valuesText || g.values.join(', ')}`).join('\n');
    return {
      ok: true,
      mode,
      groups,
      text: textOut,
      preview: `${groups.length}개 그룹 · ${groups.reduce((s, g) => s + g.values.length, 0)}개 값`
    };
  }

  if (mode === 'table' || mode === 'grr' || mode === 'doe') {
    const table = parseTable(clean);
    if (!table.rows.length) return { ok: false, message: '표 행이 없습니다.' };
    // 정규화 텍스트 (탭 구분)
    const headerLine = table.headers.join('\t');
    const body = table.rows.map(r => r.join('\t')).join('\n');
    const textOut = table.hasHeader ? `${headerLine}\n${body}` : body;
    return {
      ok: true,
      mode,
      table,
      headers: table.headers,
      rows: table.rows,
      text: textOut,
      // CSV 스타일도 제공
      csvText: (table.hasHeader ? [table.headers, ...table.rows] : table.rows)
        .map(r => r.join(',')).join('\n'),
      preview: `${table.rows.length}행 × ${table.headers.length}열`
    };
  }

  return { ok: true, mode: 'raw', text: clean, preview: `${clean.length}자` };
}
