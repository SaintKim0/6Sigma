import React, { useMemo, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Activity, BarChart2, Calculator, FlaskConical, Grid3X3, Ruler, Scale, TrendingUp, Link2
} from 'lucide-react';
import {
  andersonDarlingNormality,
  computeCapabilityAdvanced,
  oneWayAnova,
  tukeyHsd,
  chiSquareIndependence,
  gageRndRFromRows,
  doeEffects,
  pearsonCorrelation,
  multipleRegression
} from '../utils/advancedStats';
import StatTemplatePanel from './StatTemplatePanel';
import ResultInsight from './ResultInsight';

const parseNums = (text) => String(text || '')
  .replace(/\uFEFF/g, '')
  .split(/[\s,;|\t\n\r]+/)
  .map(v => v.trim())
  .filter(Boolean)
  .map(v => parseFloat(v.replace(/,/g, '')))
  .filter(v => !isNaN(v));

const box = { border: '1px solid #e2e8f0', borderRadius: 12, padding: '1rem', background: '#f8fafc', marginTop: '1rem' };
const inputStyle = { width: '100%', padding: '0.55rem', borderRadius: 8, border: '1px solid #cbd5e1', fontFamily: 'inherit' };
const mono = { ...box, background: '#0f172a', color: '#e2e8f0', fontFamily: 'ui-monospace, monospace', whiteSpace: 'pre-wrap', lineHeight: 1.55 };

const ResultBlock = ({ title, children, toolId, result }) => (
  <div style={box}>
    <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>{title}</div>
    {children}
    {toolId && result && <ResultInsight toolId={toolId} result={result} />}
  </div>
);

/** 1) 정규성 검정 */
export const NormalityEditor = ({ initialData = '', onComplete }) => {
  const [text, setText] = useState(
    Array.isArray(initialData) ? initialData.join(', ') : (initialData || '')
  );
  const [result, setResult] = useState(null);

  const runWith = (vals) => {
    const r = andersonDarlingNormality(vals);
    setResult(r);
    if (r.ok) onComplete?.(r);
  };
  const run = () => runWith(parseNums(text));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Activity size={18} /> <strong>정규성 검정 (Anderson-Darling)</strong>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
        Cp/Cpk·가설검정 전에 데이터가 정규분포에 가까운지 확인합니다. (α=0.05)
      </p>
      <StatTemplatePanel
        toolType="numbers"
        title="정규성 데이터시트"
        onAnalyze={(r) => { setText(r.text); runWith(r.numbers); }}
      />
      <textarea style={{ ...inputStyle, minHeight: 100, fontFamily: 'monospace' }}
        value={text} onChange={e => setText(e.target.value)}
        placeholder="예: 4.9, 5.0, 5.1, 4.8, ..." />
      <button type="button" className="btn-primary" style={{ marginTop: 8 }} onClick={run}>
        <Calculator size={14} /> 검정 실행
      </button>
      {result && (
        <ResultBlock title="결과" toolId="normality" result={result}>
          {!result.ok ? <div style={{ color: '#dc2626' }}>{result.message}</div> : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 8, marginBottom: 8 }}>
                <div>n: <b>{result.n}</b></div>
                <div>평균: <b>{result.mean.toFixed(4)}</b></div>
                <div>σ: <b>{result.stdDev.toFixed(4)}</b></div>
                <div>A²*: <b>{result.a2Star.toFixed(4)}</b></div>
                <div>p-value: <b style={{ color: result.isNormal ? '#059669' : '#dc2626' }}>{result.pValue.toFixed(4)}</b></div>
              </div>
              <div style={{ color: result.isNormal ? '#059669' : '#b45309', fontWeight: 600 }}>{result.conclusion}</div>
            </>
          )}
        </ResultBlock>
      )}
    </div>
  );
};

/** 1b) 공정능력 고도화 */
export const CapabilityEditor = ({ initialData = '', initialLsl = '', initialUsl = '', onComplete }) => {
  const [text, setText] = useState(Array.isArray(initialData) ? initialData.join(', ') : (initialData || ''));
  const [lsl, setLsl] = useState(initialLsl ?? '');
  const [usl, setUsl] = useState(initialUsl ?? '');
  const [result, setResult] = useState(null);

  const runWith = (vals, nextLsl = lsl, nextUsl = usl) => {
    const r = computeCapabilityAdvanced(
      vals,
      nextLsl === '' ? null : Number(nextLsl),
      nextUsl === '' ? null : Number(nextUsl)
    );
    setResult(r);
    if (r.ok) onComplete?.(r);
  };
  const run = () => runWith(parseNums(text));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <BarChart2 size={18} /> <strong>공정능력 분석 (Cp/Cpk · Pp/Ppk)</strong>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
        Within σ(MR)와 Overall σ로 단기/장기 공정능력을 함께 봅니다. %OOS·Z.bench 포함.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
        <div>
          <label style={{ fontSize: '0.8rem', color: '#64748b' }}>LSL (규격하한)</label>
          <input style={inputStyle} type="number" value={lsl} onChange={e => setLsl(e.target.value)} />
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: '#64748b' }}>USL (규격상한)</label>
          <input style={inputStyle} type="number" value={usl} onChange={e => setUsl(e.target.value)} />
        </div>
      </div>
      <StatTemplatePanel
        toolType="numbers"
        title="공정능력 데이터시트"
        onAnalyze={(r) => { setText(r.text); runWith(r.numbers); }}
      />
      <textarea style={{ ...inputStyle, minHeight: 90, fontFamily: 'monospace' }}
        value={text} onChange={e => setText(e.target.value)} placeholder="측정값 (쉼표/줄바꿈)" />
      <button type="button" className="btn-primary" style={{ marginTop: 8 }} onClick={run}>분석 실행</button>
      {result && (
        <ResultBlock title="공정능력 결과" toolId="capability" result={result}>
          {!result.ok ? <div style={{ color: '#dc2626' }}>{result.message}</div> : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: 10, marginBottom: 10 }}>
                {[
                  ['Cp', result.cp], ['Cpk', result.cpk], ['Pp', result.pp], ['Ppk', result.ppk],
                  ['Z.bench', result.zBench], ['%OOS(실측)', result.pctOosObserved],
                  ['%OOS(기대)', result.pctOosExpected], ['PPM(기대)', result.ppmExpected]
                ].map(([k, v]) => (
                  <div key={k} style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: '0.6rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{k}</div>
                    <div style={{ fontWeight: 700 }}>{v == null ? '—' : Number(v).toFixed(3)}</div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{result.note}</div>
              <div style={{ marginTop: 6, fontWeight: 600, color: result.ppk != null && result.ppk >= 1.33 ? '#059669' : '#b45309' }}>
                {result.ppk == null ? 'LSL/USL을 입력하세요.'
                  : result.ppk >= 1.33 ? 'Ppk ≥ 1.33 — 장기 공정능력 양호'
                    : result.ppk >= 1 ? '1.0 ≤ Ppk < 1.33 — 모니터링 강화'
                      : 'Ppk < 1.0 — 공정 개선 필요'}
              </div>
            </>
          )}
        </ResultBlock>
      )}
    </div>
  );
};

/** 2) ANOVA */
export const AnovaEditor = ({ onComplete }) => {
  const [groups, setGroups] = useState([
    { name: '라인A', valuesText: '4.8, 5.0, 4.9, 5.1, 4.7' },
    { name: '라인B', valuesText: '5.2, 5.4, 5.3, 5.5, 5.1' },
    { name: '라인C', valuesText: '5.0, 5.1, 4.9, 5.0, 5.2' }
  ]);
  const [result, setResult] = useState(null);

  const runWith = (parsed) => {
    const r = oneWayAnova(parsed);
    if (r.ok) {
      const post = tukeyHsd(r);
      r.postHoc = post;
      if (post.ok && !post.skipped) {
        r.conclusion = `${r.conclusion} ${post.conclusion}`;
      }
    }
    setResult(r);
    if (r.ok) onComplete?.(r);
  };
  const run = () => runWith(groups.map(g => ({ name: g.name, values: parseNums(g.valuesText) })));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Scale size={18} /> <strong>One-way ANOVA + Tukey 사후검정</strong>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
        3개 이상 그룹 평균 차이를 검정하고, 유의 시 Tukey–Kramer로 어느 쌍이 다른지 표시합니다.
      </p>
      <StatTemplatePanel
        toolType="groups"
        title="ANOVA 데이터시트 (열=그룹)"
        initialConfig={{ groupCount: 3, groupNames: ['라인A', '라인B', '라인C'] }}
        onAnalyze={(r) => {
          const next = r.groups.map(g => ({
            name: g.name,
            valuesText: g.valuesText || g.values.join(', ')
          }));
          setGroups(next);
          runWith(next.map(g => ({ name: g.name, values: parseNums(g.valuesText) })));
        }}
      />
      {groups.map((g, idx) => (
        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 8, marginTop: 8 }}>
          <input style={inputStyle} value={g.name} onChange={e => {
            const next = [...groups]; next[idx] = { ...g, name: e.target.value }; setGroups(next);
          }} />
          <input style={inputStyle} value={g.valuesText} onChange={e => {
            const next = [...groups]; next[idx] = { ...g, valuesText: e.target.value }; setGroups(next);
          }} placeholder="값, 값, ..." />
        </div>
      ))}
      <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
        <button type="button" className="btn-primary" onClick={run}>ANOVA 실행</button>
        <button type="button" className="btn-text" onClick={() => setGroups([...groups, { name: `그룹${groups.length + 1}`, valuesText: '' }])}>그룹 추가</button>
      </div>
      {result && (
        <ResultBlock title="ANOVA 결과" toolId="anova" result={result}>
          {!result.ok ? <div style={{ color: '#dc2626' }}>{result.message}</div> : (
            <>
              <div style={mono}>
{`Source          DF     SS        MS        F
Between         ${result.dfBetween}   ${result.ssBetween.toFixed(4)}  ${result.msBetween.toFixed(4)}  ${result.F.toFixed(4)}
Within          ${result.dfWithin}   ${result.ssWithin.toFixed(4)}  ${result.msWithin.toFixed(4)}
Total           ${result.dfBetween + result.dfWithin}   ${result.ssTotal.toFixed(4)}
p-value = ${result.pValue.toFixed(4)}`}
              </div>
              <div style={{ marginTop: 8, fontWeight: 600, color: result.significant ? '#dc2626' : '#059669' }}>{result.conclusion}</div>
              {result.postHoc && (
                <div style={{ marginTop: 12, background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: '0.75rem' }}>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>Tukey–Kramer 사후검정 (α=0.05)</div>
                  {result.postHoc.skipped ? (
                    <div style={{ color: '#64748b', fontSize: '0.88rem' }}>{result.postHoc.conclusion}</div>
                  ) : !result.postHoc.ok ? (
                    <div style={{ color: '#dc2626' }}>{result.postHoc.message}</div>
                  ) : (
                    <>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: 8 }}>
                        q_crit≈{result.postHoc.qCrit?.toFixed(3)} · {result.postHoc.conclusion}
                      </div>
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                          <thead>
                            <tr style={{ background: '#f8fafc', textAlign: 'left' }}>
                              <th style={{ padding: 6 }}>쌍</th>
                              <th style={{ padding: 6 }}>평균차</th>
                              <th style={{ padding: 6 }}>q</th>
                              <th style={{ padding: 6 }}>95% CI</th>
                              <th style={{ padding: 6 }}>판정</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.postHoc.pairs.map((p, i) => (
                              <tr key={i} style={{ borderTop: '1px solid #e2e8f0' }}>
                                <td style={{ padding: 6 }}>{p.a} vs {p.b}</td>
                                <td style={{ padding: 6 }}>{p.diff.toFixed(4)}</td>
                                <td style={{ padding: 6 }}>{p.q.toFixed(3)}</td>
                                <td style={{ padding: 6 }}>[{p.ciLow.toFixed(3)}, {p.ciHigh.toFixed(3)}]</td>
                                <td style={{ padding: 6, fontWeight: 700, color: p.significant ? '#dc2626' : '#059669' }}>
                                  {p.significant ? '유의' : '비유의'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  )}
                </div>
              )}
              {result.ok && (
                <div style={{ height: 220, marginTop: 12, background: 'white', borderRadius: 8, padding: 8 }}>
                  <Bar
                    data={{
                      labels: result.groupStats.map(g => g.name),
                      datasets: [{ label: '평균', data: result.groupStats.map(g => g.mean), backgroundColor: 'rgba(37,99,235,0.7)' }]
                    }}
                    options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }}
                  />
                </div>
              )}
            </>
          )}
        </ResultBlock>
      )}
    </div>
  );
};

/** 2b) Chi-square */
export const ChiSquareEditor = ({ onComplete }) => {
  const [rows, setRows] = useState(2);
  const [cols, setCols] = useState(2);
  const [rowLabels, setRowLabels] = useState(['주간', '야간']);
  const [colLabels, setColLabels] = useState(['양품', '불량']);
  const [cells, setCells] = useState([[80, 20], [70, 30]]);
  const [result, setResult] = useState(null);

  const resize = (r, c) => {
    setRows(r); setCols(c);
    setRowLabels(Array.from({ length: r }, (_, i) => rowLabels[i] || `행${i + 1}`));
    setColLabels(Array.from({ length: c }, (_, i) => colLabels[i] || `열${i + 1}`));
    setCells(Array.from({ length: r }, (_, i) =>
      Array.from({ length: c }, (_, j) => cells[i]?.[j] ?? 0)
    ));
  };

  const runWith = (matrix, rLabels, cLabels) => {
    const r = chiSquareIndependence(matrix, rLabels, cLabels);
    setResult(r);
    if (r.ok) onComplete?.(r);
  };
  const run = () => runWith(cells, rowLabels, colLabels);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Grid3X3 size={18} /> <strong>카이제곱 독립성 검정</strong>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#64748b' }}>불량유형×라인, 교대×합격여부 등 계수형 연관성을 검정합니다.</p>
      <StatTemplatePanel
        toolType="contingency"
        title="카이제곱 분할표 데이터시트"
        initialConfig={{
          rowCount: rows,
          colCount: cols,
          rowLabels,
          colLabels
        }}
        onAnalyze={(r) => {
          const rr = r.cells.length;
          const cc = r.cells[0]?.length || 0;
          setRows(rr); setCols(cc);
          setRowLabels(r.rowLabels);
          setColLabels(r.colLabels);
          setCells(r.cells);
          runWith(r.cells, r.rowLabels, r.colLabels);
        }}
      />
      <div style={{ display: 'flex', gap: 8, margin: '8px 0' }}>
        <button type="button" className="btn-text" onClick={() => resize(2, 2)}>2×2</button>
        <button type="button" className="btn-text" onClick={() => resize(3, 2)}>3×2</button>
        <button type="button" className="btn-text" onClick={() => resize(3, 3)}>3×3</button>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th style={{ padding: 6 }} />
              {colLabels.map((c, j) => (
                <th key={j} style={{ padding: 4 }}>
                  <input style={inputStyle} value={c} onChange={e => {
                    const next = [...colLabels]; next[j] = e.target.value; setColLabels(next);
                  }} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cells.map((row, i) => (
              <tr key={i}>
                <td style={{ padding: 4, minWidth: 90 }}>
                  <input style={inputStyle} value={rowLabels[i]} onChange={e => {
                    const next = [...rowLabels]; next[i] = e.target.value; setRowLabels(next);
                  }} />
                </td>
                {row.map((v, j) => (
                  <td key={j} style={{ padding: 4 }}>
                    <input style={inputStyle} type="number" value={v}
                      onChange={e => {
                        const next = cells.map(r => [...r]);
                        next[i][j] = Number(e.target.value);
                        setCells(next);
                      }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button type="button" className="btn-primary" style={{ marginTop: 8 }} onClick={run}>χ² 검정 실행</button>
      {result && (
        <ResultBlock title="χ² 결과" toolId="chi_square" result={result}>
          {!result.ok ? <div style={{ color: '#dc2626' }}>{result.message}</div> : (
            <>
              <div>χ²=<b>{result.chi2.toFixed(4)}</b> · df=<b>{result.df}</b> · p=<b>{result.pValue.toFixed(4)}</b></div>
              <div style={{ marginTop: 8, fontWeight: 600, color: result.significant ? '#dc2626' : '#059669' }}>{result.conclusion}</div>
            </>
          )}
        </ResultBlock>
      )}
    </div>
  );
};

/** 3) Gage R&R 계산 */
export const GageRndRCalculator = ({ onComplete }) => {
  const [rowsText, setRowsText] = useState(
    '부품,평가자,측정값\nP1,A,5.1\nP1,A,5.0\nP1,B,5.2\nP1,B,5.1\nP2,A,4.9\nP2,A,4.8\nP2,B,5.0\nP2,B,4.9\nP3,A,5.3\nP3,A,5.2\nP3,B,5.4\nP3,B,5.3\nP4,A,4.7\nP4,A,4.8\nP4,B,4.9\nP4,B,4.8\nP5,A,5.0\nP5,A,5.1\nP5,B,5.1\nP5,B,5.0'
  );
  const [tolerance, setTolerance] = useState('0.6');
  const [result, setResult] = useState(null);

  const runWith = (csvOrText, tol = tolerance) => {
    const lines = String(csvOrText).split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const start = /부품|part/i.test(lines[0]) ? 1 : 0;
    const rows = [];
    for (let i = start; i < lines.length; i++) {
      const [part, operator, value] = lines[i].split(/[,;\t]/).map(s => s.trim());
      rows.push({ part, operator, value });
    }
    const r = gageRndRFromRows(rows, { tolerance: tol === '' ? null : Number(tol) });
    setResult(r);
    if (r.ok) onComplete?.(r);
  };
  const run = () => runWith(rowsText);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Ruler size={18} /> <strong>Gage R&R 계산 (Range method)</strong>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
        CSV 형식: 부품,평가자,측정값 (반복 포함). %GR&R·ndc를 산출합니다.
      </p>
      <div style={{ marginBottom: 8, maxWidth: 220 }}>
        <label style={{ fontSize: '0.8rem', color: '#64748b' }}>공차폭 (USL-LSL, 선택)</label>
        <input style={inputStyle} type="number" value={tolerance} onChange={e => setTolerance(e.target.value)} />
      </div>
      <StatTemplatePanel
        toolType="grr"
        title="Gage R&R 데이터시트"
        onAnalyze={(r) => {
          const csv = r.csvText || r.text;
          setRowsText(csv);
          runWith(csv);
        }}
      />
      <textarea style={{ ...inputStyle, minHeight: 160, fontFamily: 'monospace', fontSize: '0.85rem' }}
        value={rowsText} onChange={e => setRowsText(e.target.value)} />
      <button type="button" className="btn-primary" style={{ marginTop: 8 }} onClick={run}>GR&R 계산</button>
      {result && (
        <ResultBlock title="Gage R&R 결과" toolId="gage_rr" result={result}>
          {!result.ok ? <div style={{ color: '#dc2626' }}>{result.message}</div> : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 8 }}>
                {[
                  ['%GR&R', result.pctGRR], ['%EV(반복성)', result.pctEV], ['%AV(재현성)', result.pctAV],
                  ['%PV(부품)', result.pctPV], ['ndc', result.ndc], ['%Tol', result.pctTol]
                ].map(([k, v]) => (
                  <div key={k} style={{ background: 'white', borderRadius: 8, border: '1px solid #e2e8f0', padding: '0.55rem', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{k}</div>
                    <div style={{ fontWeight: 700 }}>{v == null ? '—' : Number(v).toFixed(2)}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10, fontWeight: 700, color: result.pctGRR <= 30 ? '#059669' : '#dc2626' }}>{result.conclusion}</div>
              <div style={{ height: 200, marginTop: 12, background: 'white', borderRadius: 8, padding: 8 }}>
                <Bar data={{
                  labels: ['EV', 'AV', 'GRR', 'PV'],
                  datasets: [{
                    label: '% of TV',
                    data: [result.pctEV, result.pctAV, result.pctGRR, result.pctPV],
                    backgroundColor: ['#60a5fa', '#a78bfa', '#f59e0b', '#34d399']
                  }]
                }} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true, max: 100 } } }} />
              </div>
            </>
          )}
        </ResultBlock>
      )}
    </div>
  );
};

/** 4) DOE 주효과 */
export const DoeEffectsEditor = ({ initialFactors = [], onComplete }) => {
  const defaultFactors = initialFactors.length >= 2
    ? initialFactors.slice(0, 3).map(f => (typeof f === 'string' ? f : f.name)).filter(Boolean)
    : ['온도', '냉각시간', '보압'];

  const [factorNames, setFactorNames] = useState(defaultFactors.slice(0, 3));
  const [runsText, setRunsText] = useState(() => {
    // 2^3 half example
    return [
      '-1,-1,-1,12.5',
      '1,-1,-1,9.2',
      '-1,1,-1,10.1',
      '1,1,-1,7.8',
      '-1,-1,1,11.0',
      '1,-1,1,8.5',
      '-1,1,1,9.0',
      '1,1,1,6.5'
    ].join('\n');
  });
  const [result, setResult] = useState(null);

  const runWith = (names, text) => {
    const lines = String(text).split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const dataLines = /y$/i.test(lines[0]?.split(/[,;\t]/).pop() || '') || /인자|factor/i.test(lines[0])
      ? lines.slice(1) : lines;
    const runs = dataLines.map(line => {
      const parts = line.split(/[,;\t]/).map(s => s.trim());
      const factors = {};
      names.forEach((n, i) => { factors[n] = Number(parts[i]); });
      const y = Number(parts[names.length]);
      return { factors, y };
    });
    const r = doeEffects(runs);
    setResult(r);
    if (r.ok) onComplete?.(r);
  };
  const run = () => runWith(factorNames.filter(Boolean), runsText);

  const chartData = useMemo(() => {
    if (!result?.ok) return null;
    const items = [...result.mainEffects, ...result.interactions];
    return {
      labels: items.map(i => i.name),
      datasets: [{
        label: 'Effect',
        data: items.map(i => i.effect),
        backgroundColor: items.map(i => i.effect >= 0 ? 'rgba(37,99,235,0.75)' : 'rgba(239,68,68,0.75)')
      }]
    };
  }, [result]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <FlaskConical size={18} /> <strong>DOE 주효과 / 교호작용</strong>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
        각 run을 -1/1 수준과 반응값(y)으로 입력하면 주효과·2인자 교호작용을 계산합니다.
      </p>
      <StatTemplatePanel
        toolType="doe"
        title="DOE 실험 데이터시트"
        initialConfig={{ factorCount: factorNames.length || 3, factorNames }}
        onAnalyze={(r) => {
          const names = (r.config?.factorNames || r.headers?.slice(0, -1) || factorNames).filter(Boolean);
          setFactorNames(names.length ? names : factorNames);
          const csv = r.csvText || r.text;
          // 헤더 제외한 숫자 행만
          const lines = String(csv).split(/\r?\n/).map(l => l.trim()).filter(Boolean);
          const body = lines[0] && /[a-zA-Z가-힣]/.test(lines[0].replace(/[-1,.\s]/g, ''))
            ? lines.slice(1).join('\n') : lines.join('\n');
          setRunsText(body);
          runWith(names, body);
        }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 8 }}>
        {factorNames.map((n, i) => (
          <input key={i} style={inputStyle} value={n}
            onChange={e => { const next = [...factorNames]; next[i] = e.target.value; setFactorNames(next); }}
            placeholder={`인자${i + 1}`} />
        ))}
      </div>
      <label style={{ fontSize: '0.8rem', color: '#64748b' }}>
        형식: {factorNames.filter(Boolean).join(',')},y （예: -1,1,-1,8.5）
      </label>
      <textarea style={{ ...inputStyle, minHeight: 140, fontFamily: 'monospace', marginTop: 4 }}
        value={runsText} onChange={e => setRunsText(e.target.value)} />
      <button type="button" className="btn-primary" style={{ marginTop: 8 }} onClick={run}>효과 분석</button>
      {result && (
        <ResultBlock title="DOE Effects" toolId="doe" result={result}>
          {!result.ok ? <div style={{ color: '#dc2626' }}>{result.message}</div> : (
            <>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>{result.conclusion}</div>
              {chartData && (
                <div style={{ height: 260, background: 'white', borderRadius: 8, padding: 8 }}>
                  <Bar data={chartData} options={{
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: { y: { title: { display: true, text: 'Effect' } } }
                  }} />
                </div>
              )}
            </>
          )}
        </ResultBlock>
      )}
    </div>
  );
};

/** 5) Pearson 상관분석 */
export const CorrelationEditor = ({ initialX = '', initialY = '', onComplete }) => {
  const [xText, setXText] = useState(Array.isArray(initialX) ? initialX.join(', ') : (initialX || ''));
  const [yText, setYText] = useState(Array.isArray(initialY) ? initialY.join(', ') : (initialY || ''));
  const [result, setResult] = useState(null);

  const runWith = (xArr, yArr) => {
    const n = Math.min(xArr.length, yArr.length);
    const r = pearsonCorrelation(xArr.slice(0, n), yArr.slice(0, n));
    setResult(r);
    if (r.ok) onComplete?.(r);
  };
  const run = () => runWith(parseNums(xText), parseNums(yText));

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Link2 size={18} /> <strong>상관분석 (Pearson r + p-value)</strong>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
        산점도의 관계 강도와 통계적 유의성(α=0.05)을 함께 확인합니다.
      </p>
      <StatTemplatePanel
        toolType="xy"
        title="상관분석 데이터시트 (X·Y)"
        onAnalyze={(r) => {
          setXText(r.xText);
          setYText(r.yText);
          runWith(r.x, r.y);
        }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div>
          <label style={{ fontSize: '0.8rem', color: '#64748b' }}>X</label>
          <textarea style={{ ...inputStyle, minHeight: 90, fontFamily: 'monospace' }}
            value={xText} onChange={e => setXText(e.target.value)} placeholder="예: 10, 20, 30..." />
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Y</label>
          <textarea style={{ ...inputStyle, minHeight: 90, fontFamily: 'monospace' }}
            value={yText} onChange={e => setYText(e.target.value)} placeholder="예: 12, 25, 28..." />
        </div>
      </div>
      <button type="button" className="btn-primary" style={{ marginTop: 8 }} onClick={run}>상관 검정</button>
      {result && (
        <ResultBlock title="상관 결과" toolId="correlation" result={result}>
          {!result.ok ? <div style={{ color: '#dc2626' }}>{result.message}</div> : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: 8, marginBottom: 8 }}>
                <div>n: <b>{result.n}</b></div>
                <div>r: <b>{result.r.toFixed(4)}</b></div>
                <div>R²: <b>{(result.r2 * 100).toFixed(1)}%</b></div>
                <div>t: <b>{result.tStat.toFixed(3)}</b></div>
                <div>p: <b style={{ color: result.significant ? '#059669' : '#b45309' }}>{result.pValue.toFixed(4)}</b></div>
              </div>
              <div style={{ fontWeight: 600, color: result.significant ? '#059669' : '#b45309' }}>{result.conclusion}</div>
            </>
          )}
        </ResultBlock>
      )}
    </div>
  );
};

/** 6) 다중회귀 + 잔차 요약 */
export const MultipleRegressionEditor = ({ onComplete }) => {
  const [headers, setHeaders] = useState('온도, 냉각시간, 보압, 불량률');
  const [tableText, setTableText] = useState([
    '242, 25, 85, 12.5',
    '248, 25, 85, 9.2',
    '242, 30, 85, 10.1',
    '248, 30, 85, 7.8',
    '242, 25, 90, 11.0',
    '248, 25, 90, 8.5',
    '242, 30, 90, 9.0',
    '248, 30, 90, 6.5'
  ].join('\n'));
  const [result, setResult] = useState(null);

  const runWith = (y, X, xNames, yName) => {
    const r = multipleRegression(y, X, xNames);
    if (r.ok) r.yName = yName;
    setResult(r);
    if (r.ok) onComplete?.(r);
  };
  const run = () => {
    const cols = headers.split(/[,;\t]/).map(s => s.trim()).filter(Boolean);
    if (cols.length < 2) {
      setResult({ ok: false, message: '헤더에 예측변수와 반응변수(y)가 필요합니다.' });
      return;
    }
    const yName = cols[cols.length - 1];
    const xNames = cols.slice(0, -1);
    const rows = tableText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const y = [];
    const X = [];
    for (const line of rows) {
      const parts = line.split(/[,;\t]/).map(s => s.trim()).map(Number);
      if (parts.length < cols.length || parts.some(v => isNaN(v))) continue;
      X.push(parts.slice(0, -1));
      y.push(parts[parts.length - 1]);
    }
    runWith(y, X, xNames, yName);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <TrendingUp size={18} /> <strong>다중회귀 + 잔차 요약</strong>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
        분석방향에서 독립변수 개수·이름을 정한 뒤 템플릿을 받으세요. 마지막 열이 Y입니다.
      </p>
      <StatTemplatePanel
        toolType="regression"
        title="다중회귀 데이터시트"
        initialConfig={{ xCount: 3, xNames: ['온도', '냉각시간', '보압'], yName: '불량률' }}
        onAnalyze={(r) => {
          setHeaders([...r.xNames, r.yName].join(', '));
          setTableText(r.X.map((row, i) => [...row, r.y[i]].join(', ')).join('\n'));
          runWith(r.y, r.X, r.xNames, r.yName);
        }}
      />
      <label style={{ fontSize: '0.8rem', color: '#64748b' }}>열 이름 (쉼표 구분, 마지막=Y)</label>
      <input style={{ ...inputStyle, marginBottom: 8 }} value={headers} onChange={e => setHeaders(e.target.value)} />
      <label style={{ fontSize: '0.8rem', color: '#64748b' }}>데이터 행</label>
      <textarea style={{ ...inputStyle, minHeight: 140, fontFamily: 'monospace' }}
        value={tableText} onChange={e => setTableText(e.target.value)} />
      <button type="button" className="btn-primary" style={{ marginTop: 8 }} onClick={run}>회귀 실행</button>
      {result && (
        <ResultBlock title="다중회귀 결과" toolId="multi_regression" result={result}>
          {!result.ok ? <div style={{ color: '#dc2626' }}>{result.message}</div> : (
            <>
              <div style={{ fontFamily: 'monospace', marginBottom: 8, fontSize: '0.9rem' }}>{result.equation}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: 8, marginBottom: 8 }}>
                <div>n: <b>{result.n}</b></div>
                <div>R²: <b>{(result.r2 * 100).toFixed(1)}%</b></div>
                <div>Adj.R²: <b>{(result.adjR2 * 100).toFixed(1)}%</b></div>
                <div>RMSE: <b>{result.rmse.toFixed(4)}</b></div>
              </div>
              <div style={{ fontSize: '0.85rem', marginBottom: 8 }}>
                <b>계수:</b>{' '}
                {result.coefficients.map(c => `${c.name}=${c.value.toFixed(4)}`).join(' · ')}
              </div>
              <div style={{ fontSize: '0.85rem', background: 'white', border: '1px solid #e2e8f0', borderRadius: 8, padding: '0.75rem' }}>
                <b>잔차 요약</b>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginTop: 6 }}>
                  <div>평균 {result.residuals.mean.toFixed(4)}</div>
                  <div>σ {result.residuals.std.toFixed(4)}</div>
                  <div>min {result.residuals.min.toFixed(4)}</div>
                  <div>max {result.residuals.max.toFixed(4)}</div>
                </div>
              </div>
              <div style={{ marginTop: 8, fontWeight: 600, color: '#0369a1' }}>{result.conclusion}</div>
            </>
          )}
        </ResultBlock>
      )}
    </div>
  );
};
