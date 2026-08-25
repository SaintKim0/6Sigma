import React, { useMemo, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import {
  Scale, Equal, GitCompare, Activity, Timer, Calculator, ClipboardList, Grid3X3, GitBranch
} from 'lucide-react';
import {
  oneProportionTest,
  twoProportionTest,
  leveneTest,
  mannWhitneyU,
  kruskalWallis,
  residualDiagnostics,
  weibullFit,
  sampleSizeCalculator
} from '../utils/extraStats';
import { multipleRegression } from '../utils/advancedStats';
import StatTemplatePanel from './StatTemplatePanel';
import ResultInsight from './ResultInsight';

const box = { border: '1px solid #e2e8f0', borderRadius: 12, padding: '1rem', background: '#f8fafc', marginTop: '1rem' };
const inputStyle = { width: '100%', padding: '0.55rem', borderRadius: 8, border: '1px solid #cbd5e1', fontFamily: 'inherit' };

const parseNums = (text) => String(text || '')
  .replace(/\uFEFF/g, '')
  .split(/[\s,;|\t\n\r]+/)
  .map(v => v.trim())
  .filter(Boolean)
  .map(v => parseFloat(v.replace(/,/g, '')))
  .filter(v => !isNaN(v));

const ResultBlock = ({ title, children, toolId, result }) => (
  <div style={box}>
    <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{title}</div>
    {children}
    {toolId && result && <ResultInsight toolId={toolId} result={result} />}
  </div>
);

const parseNamedGroups = (text) => {
  // "A: 1,2,3\nB: 4,5,6"
  const lines = String(text || '').split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  return lines.map((line, i) => {
    const m = line.match(/^([^:：]+)[:：]\s*(.+)$/);
    if (m) return { name: m[1].trim(), values: parseNums(m[2]) };
    return { name: `G${i + 1}`, values: parseNums(line) };
  }).filter(g => g.values.length);
};

/** 1) 비율 검정 */
export const ProportionTestEditor = ({ onComplete }) => {
  const [mode, setMode] = useState('2');
  const [x1, setX1] = useState('15');
  const [n1, setN1] = useState('100');
  const [x2, setX2] = useState('8');
  const [n2, setN2] = useState('100');
  const [p0, setP0] = useState('0.1');
  const [result, setResult] = useState(null);

  const run = () => {
    const r = mode === '1'
      ? oneProportionTest({ successes: Number(x1), n: Number(n1), p0: Number(p0) })
      : twoProportionTest({ x1: Number(x1), n1: Number(n1), x2: Number(x2), n2: Number(n2) });
    setResult(r);
    if (r.ok) onComplete?.(r);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Scale size={18} /> <strong>비율 검정 (1-비율 / 2-비율)</strong>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <button type="button" className={mode === '1' ? 'btn-primary' : 'btn-secondary'} onClick={() => setMode('1')}>1-비율</button>
        <button type="button" className={mode === '2' ? 'btn-primary' : 'btn-secondary'} onClick={() => setMode('2')}>2-비율</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 8 }}>
        <div><label style={{ fontSize: '0.8rem', color: '#64748b' }}>{mode === '1' ? '성공 수' : '그룹1 성공'}</label>
          <input style={inputStyle} type="number" value={x1} onChange={e => setX1(e.target.value)} /></div>
        <div><label style={{ fontSize: '0.8rem', color: '#64748b' }}>{mode === '1' ? '표본 수 n' : '그룹1 n'}</label>
          <input style={inputStyle} type="number" value={n1} onChange={e => setN1(e.target.value)} /></div>
        {mode === '1' ? (
          <div><label style={{ fontSize: '0.8rem', color: '#64748b' }}>가설 p₀</label>
            <input style={inputStyle} type="number" step="0.01" value={p0} onChange={e => setP0(e.target.value)} /></div>
        ) : (
          <>
            <div><label style={{ fontSize: '0.8rem', color: '#64748b' }}>그룹2 성공</label>
              <input style={inputStyle} type="number" value={x2} onChange={e => setX2(e.target.value)} /></div>
            <div><label style={{ fontSize: '0.8rem', color: '#64748b' }}>그룹2 n</label>
              <input style={inputStyle} type="number" value={n2} onChange={e => setN2(e.target.value)} /></div>
          </>
        )}
      </div>
      <button type="button" className="btn-primary" style={{ marginTop: 8 }} onClick={run}>검정 실행</button>
      {result && (
        <ResultBlock title="결과" toolId="proportion" result={result}>
          {!result.ok ? <div style={{ color: '#dc2626' }}>{result.message}</div>
            : <div style={{ fontWeight: 600, color: result.significant ? '#059669' : '#b45309' }}>{result.conclusion}</div>}
        </ResultBlock>
      )}
    </div>
  );
};

/** 2) 등분산 Levene */
export const LeveneEditor = ({ onComplete }) => {
  const [text, setText] = useState('라인A: 4.9, 5.0, 5.1, 4.8, 5.2\n라인B: 4.7, 5.3, 4.6, 5.4, 5.0\n라인C: 5.0, 5.0, 4.9, 5.1, 5.0');
  const [result, setResult] = useState(null);
  const runWith = (groups) => {
    const r = leveneTest(groups);
    setResult(r);
    if (r.ok) onComplete?.(r);
  };
  const run = () => runWith(parseNamedGroups(text));
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Equal size={18} /> <strong>등분산 검정 (Levene / Brown-Forsythe)</strong>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#64748b' }}>분석방향에서 그룹 수를 정한 뒤 템플릿(열=그룹)을 받으세요.</p>
      <StatTemplatePanel
        toolType="groups"
        title="등분산 데이터시트"
        initialConfig={{ groupCount: 3, groupNames: ['라인A', '라인B', '라인C'] }}
        onAnalyze={(r) => {
          setText(r.text);
          runWith(r.groups.map(g => ({ name: g.name, values: g.values })));
        }}
      />
      <textarea style={{ ...inputStyle, minHeight: 120, fontFamily: 'monospace' }} value={text} onChange={e => setText(e.target.value)} />
      <button type="button" className="btn-primary" style={{ marginTop: 8 }} onClick={run}>검정 실행</button>
      {result && (
        <ResultBlock title="결과" toolId="levene" result={result}>
          {!result.ok ? <div style={{ color: '#dc2626' }}>{result.message}</div>
            : <div style={{ fontWeight: 600, color: result.equalVariance ? '#059669' : '#dc2626' }}>{result.conclusion}</div>}
        </ResultBlock>
      )}
    </div>
  );
};

/** 3) 비모수 */
export const NonparametricEditor = ({ onComplete }) => {
  const [mode, setMode] = useState('mw');
  const [a, setA] = useState('12, 15, 14, 11, 13');
  const [b, setB] = useState('18, 16, 19, 17, 20');
  const [kw, setKw] = useState('A: 12,15,14,11\nB: 18,16,19,17\nC: 10,11,9,12');
  const [result, setResult] = useState(null);

  const run = () => {
    const r = mode === 'mw'
      ? mannWhitneyU(parseNums(a), parseNums(b))
      : kruskalWallis(parseNamedGroups(kw));
    setResult(r);
    if (r.ok) onComplete?.(r);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <GitCompare size={18} /> <strong>비모수 검정</strong>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <button type="button" className={mode === 'mw' ? 'btn-primary' : 'btn-secondary'} onClick={() => setMode('mw')}>Mann-Whitney</button>
        <button type="button" className={mode === 'kw' ? 'btn-primary' : 'btn-secondary'} onClick={() => setMode('kw')}>Kruskal-Wallis</button>
      </div>
      {mode === 'mw' ? (
        <>
          <StatTemplatePanel
            toolType="groups"
            title="Mann-Whitney 데이터시트 (2그룹)"
            initialConfig={{ groupCount: 2, groupNames: ['그룹A', '그룹B'] }}
            onAnalyze={(r) => {
              if (r.groups?.length >= 2) {
                setA(r.groups[0].valuesText || r.groups[0].values.join(', '));
                setB(r.groups[1].valuesText || r.groups[1].values.join(', '));
                const res = mannWhitneyU(r.groups[0].values, r.groups[1].values);
                setResult(res);
                if (res.ok) onComplete?.(res);
              }
            }}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div><label style={{ fontSize: '0.8rem' }}>그룹 A</label>
              <textarea style={{ ...inputStyle, minHeight: 90, fontFamily: 'monospace' }} value={a} onChange={e => setA(e.target.value)} /></div>
            <div><label style={{ fontSize: '0.8rem' }}>그룹 B</label>
              <textarea style={{ ...inputStyle, minHeight: 90, fontFamily: 'monospace' }} value={b} onChange={e => setB(e.target.value)} /></div>
          </div>
        </>
      ) : (
        <>
          <StatTemplatePanel
            toolType="groups"
            title="Kruskal-Wallis 데이터시트"
            initialConfig={{ groupCount: 3, groupNames: ['A', 'B', 'C'] }}
            onAnalyze={(r) => {
              setKw(r.text);
              const res = kruskalWallis(r.groups.map(g => ({ name: g.name, values: g.values })));
              setResult(res);
              if (res.ok) onComplete?.(res);
            }}
          />
          <textarea style={{ ...inputStyle, minHeight: 120, fontFamily: 'monospace' }} value={kw} onChange={e => setKw(e.target.value)} />
        </>
      )}
      <button type="button" className="btn-primary" style={{ marginTop: 8 }} onClick={run}>검정 실행</button>
      {result && (
        <ResultBlock title="결과" toolId="nonparametric" result={result}>
          {!result.ok ? <div style={{ color: '#dc2626' }}>{result.message}</div>
            : <div style={{ fontWeight: 600, color: result.significant ? '#059669' : '#b45309' }}>{result.conclusion}</div>}
        </ResultBlock>
      )}
    </div>
  );
};

/** 4) 잔차 진단 강화 (다중회귀 포함) */
export const ResidualDiagnosticsEditor = ({ onComplete }) => {
  const [headers, setHeaders] = useState('X1, X2, Y');
  const [tableText, setTableText] = useState([
    '1, 2, 10', '2, 1, 12', '3, 3, 15', '4, 2, 16', '5, 4, 20',
    '6, 3, 21', '7, 5, 24', '8, 4, 25'
  ].join('\n'));
  const [result, setResult] = useState(null);
  const [diag, setDiag] = useState(null);

  const runWith = (y, X, xNames) => {
    const reg = multipleRegression(y, X, xNames);
    if (!reg.ok) { setResult(reg); setDiag(null); return; }
    const d = residualDiagnostics(reg.residuals.values, reg.fitted);
    setResult(reg);
    setDiag(d);
    if (d.ok) onComplete?.({ ...reg, diagnostics: d });
  };
  const run = () => {
    const cols = headers.split(/[,;\t]/).map(s => s.trim()).filter(Boolean);
    const xNames = cols.slice(0, -1);
    const rows = tableText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const y = []; const X = [];
    for (const line of rows) {
      const parts = line.split(/[,;\t]/).map(Number);
      if (parts.length < cols.length || parts.some(v => isNaN(v))) continue;
      X.push(parts.slice(0, -1));
      y.push(parts[parts.length - 1]);
    }
    runWith(y, X, xNames);
  };

  const scatter = useMemo(() => {
    if (!diag?.ok) return null;
    return {
      datasets: [{
        label: '잔차 vs 적합',
        data: diag.points.map(p => ({ x: p.f, y: p.e })),
        backgroundColor: 'rgba(37,99,235,0.7)'
      }]
    };
  }, [diag]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Activity size={18} /> <strong>잔차 진단 (정규성 · 등분산 · 잔차 vs 적합)</strong>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#64748b' }}>독립변수 개수를 설정한 템플릿으로 업로드하면 회귀+잔차 진단이 자동 실행됩니다.</p>
      <StatTemplatePanel
        toolType="regression"
        title="잔차 진단 데이터시트"
        initialConfig={{ xCount: 2, xNames: ['X1', 'X2'], yName: 'Y' }}
        onAnalyze={(r) => {
          setHeaders([...r.xNames, r.yName].join(', '));
          setTableText(r.X.map((row, i) => [...row, r.y[i]].join(', ')).join('\n'));
          runWith(r.y, r.X, r.xNames);
        }}
      />
      <input style={{ ...inputStyle, marginBottom: 8 }} value={headers} onChange={e => setHeaders(e.target.value)} />
      <textarea style={{ ...inputStyle, minHeight: 120, fontFamily: 'monospace' }} value={tableText} onChange={e => setTableText(e.target.value)} />
      <button type="button" className="btn-primary" style={{ marginTop: 8 }} onClick={run}>진단 실행</button>
      {result && (
        <ResultBlock title="회귀 + 잔차 진단" toolId="residual" result={diag ? { ...result, diagnostics: diag } : result}>
          {!result.ok ? <div style={{ color: '#dc2626' }}>{result.message}</div> : (
            <>
              <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', marginBottom: 6 }}>{result.equation}</div>
              <div>R²={(result.r2 * 100).toFixed(1)}% · Adj.R²={(result.adjR2 * 100).toFixed(1)}% · RMSE={result.rmse.toFixed(4)}</div>
              {diag?.ok && (
                <>
                  <div style={{ marginTop: 8, fontWeight: 600 }}>{diag.conclusion}</div>
                  {scatter && (
                    <div style={{ height: 240, marginTop: 10, background: 'white', borderRadius: 8, padding: 8 }}>
                      <Scatter data={scatter} options={{
                        responsive: true, maintainAspectRatio: false,
                        plugins: { title: { display: true, text: '잔차 vs 적합값' } },
                        scales: {
                          x: { title: { display: true, text: 'Fitted' } },
                          y: { title: { display: true, text: 'Residual' } }
                        }
                      }} />
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </ResultBlock>
      )}
    </div>
  );
};

/** 5) Weibull */
export const WeibullEditor = ({ onComplete }) => {
  const [text, setText] = useState('120, 145, 98, 160, 132, 110, 175, 140, 155, 128, 190, 105');
  const [tCheck, setTCheck] = useState('150');
  const [result, setResult] = useState(null);
  const runWith = (vals) => {
    const r = weibullFit(vals);
    setResult(r);
    if (r.ok) onComplete?.(r);
  };
  const run = () => runWith(parseNums(text));
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Timer size={18} /> <strong>신뢰성 분석 (Weibull)</strong>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#64748b' }}>수명/고장 시간 데이터를 입력하세요 (양수).</p>
      <StatTemplatePanel
        toolType="numbers"
        title="Weibull 수명 데이터시트"
        initialConfig={{ columnName: '수명시간' }}
        onAnalyze={(r) => { setText(r.text); runWith(r.numbers); }}
      />
      <textarea style={{ ...inputStyle, minHeight: 90, fontFamily: 'monospace' }} value={text} onChange={e => setText(e.target.value)} />
      <div style={{ display: 'flex', gap: 8, alignItems: 'end', marginTop: 8 }}>
        <div style={{ flex: 1 }}>
          <label style={{ fontSize: '0.8rem', color: '#64748b' }}>신뢰도 확인할 시간 t</label>
          <input style={inputStyle} type="number" value={tCheck} onChange={e => setTCheck(e.target.value)} />
        </div>
        <button type="button" className="btn-primary" onClick={run}>적합 실행</button>
      </div>
      {result && (
        <ResultBlock title="Weibull 결과" toolId="weibull" result={result}>
          {!result.ok ? <div style={{ color: '#dc2626' }}>{result.message}</div> : (
            <>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>{result.conclusion}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: 8 }}>
                <div>β <b>{result.shape.toFixed(3)}</b></div>
                <div>η <b>{result.scale.toFixed(3)}</b></div>
                <div>B10 <b>{result.B10.toFixed(2)}</b></div>
                <div>MTTF <b>{result.MTTF.toFixed(2)}</b></div>
                <div>R({tCheck}) <b>{(result.reliabilityAt(Number(tCheck)) * 100).toFixed(1)}%</b></div>
              </div>
            </>
          )}
        </ResultBlock>
      )}
    </div>
  );
};

/** 9) 샘플 크기 */
export const SampleSizeEditor = ({ onComplete }) => {
  const [mode, setMode] = useState('mean_2sample');
  const [alpha, setAlpha] = useState('0.05');
  const [power, setPower] = useState('0.8');
  const [delta, setDelta] = useState('0.5');
  const [sigma, setSigma] = useState('1');
  const [p0, setP0] = useState('0.1');
  const [p1, setP1] = useState('0.05');
  const [pA, setPA] = useState('0.15');
  const [pB, setPB] = useState('0.08');
  const [result, setResult] = useState(null);

  const run = () => {
    const r = sampleSizeCalculator({
      mode,
      alpha: Number(alpha),
      power: Number(power),
      delta: Number(delta),
      sigma: Number(sigma),
      p0: Number(p0),
      p1: Number(p1),
      pA: Number(pA),
      pB: Number(pB)
    });
    setResult(r);
    if (r.ok) onComplete?.(r);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Calculator size={18} /> <strong>샘플 크기 계산기</strong>
      </div>
      <select style={{ ...inputStyle, marginBottom: 8 }} value={mode} onChange={e => setMode(e.target.value)}>
        <option value="mean_1sample">1표본 평균</option>
        <option value="mean_2sample">2표본 평균</option>
        <option value="prop_1sample">1비율</option>
        <option value="prop_2sample">2비율</option>
      </select>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 8 }}>
        <div><label style={{ fontSize: '0.8rem' }}>α</label><input style={inputStyle} value={alpha} onChange={e => setAlpha(e.target.value)} /></div>
        <div><label style={{ fontSize: '0.8rem' }}>Power</label><input style={inputStyle} value={power} onChange={e => setPower(e.target.value)} /></div>
        {(mode === 'mean_1sample' || mode === 'mean_2sample') && (
          <>
            <div><label style={{ fontSize: '0.8rem' }}>δ (검출 차이)</label><input style={inputStyle} value={delta} onChange={e => setDelta(e.target.value)} /></div>
            <div><label style={{ fontSize: '0.8rem' }}>σ</label><input style={inputStyle} value={sigma} onChange={e => setSigma(e.target.value)} /></div>
          </>
        )}
        {mode === 'prop_1sample' && (
          <>
            <div><label style={{ fontSize: '0.8rem' }}>p₀</label><input style={inputStyle} value={p0} onChange={e => setP0(e.target.value)} /></div>
            <div><label style={{ fontSize: '0.8rem' }}>p₁</label><input style={inputStyle} value={p1} onChange={e => setP1(e.target.value)} /></div>
          </>
        )}
        {mode === 'prop_2sample' && (
          <>
            <div><label style={{ fontSize: '0.8rem' }}>pₐ</label><input style={inputStyle} value={pA} onChange={e => setPA(e.target.value)} /></div>
            <div><label style={{ fontSize: '0.8rem' }}>pᵦ</label><input style={inputStyle} value={pB} onChange={e => setPB(e.target.value)} /></div>
          </>
        )}
      </div>
      <button type="button" className="btn-primary" style={{ marginTop: 8 }} onClick={run}>계산</button>
      {result && (
        <ResultBlock title="필요 샘플 수" toolId="sample_size" result={result}>
          {!result.ok ? <div style={{ color: '#dc2626' }}>{result.message}</div>
            : <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0369a1' }}>{result.conclusion}</div>}
        </ResultBlock>
      )}
    </div>
  );
};

/** 6) C&E Matrix */
export const CauseEffectMatrixEditor = ({ value, onChange, onComplete }) => {
  const [ys, setYs] = useState(value?.ys || [
    { name: '불량률', weight: 10 },
    { name: '치수', weight: 7 },
    { name: '외관', weight: 5 }
  ]);
  const [xs, setXs] = useState(value?.xs || [
    { name: '사출온도', scores: [9, 3, 1] },
    { name: '냉각시간', scores: [9, 9, 3] },
    { name: '보압', scores: [3, 9, 1] },
    { name: '금형상태', scores: [3, 3, 9] }
  ]);

  const ranked = useMemo(() => xs.map((x, i) => {
    const total = (x.scores || []).reduce((s, sc, j) => s + (Number(sc) || 0) * (Number(ys[j]?.weight) || 0), 0);
    return { i, name: x.name, total };
  }).sort((a, b) => b.total - a.total), [xs, ys]);

  const persist = (nextYs = ys, nextXs = xs) => {
    const payload = { ys: nextYs, xs: nextXs, ranked };
    onChange?.(payload);
    onComplete?.(payload);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <Grid3X3 size={18} /> <strong>C&amp;E Matrix (원인-영향 매트릭스)</strong>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Y 중요도(가중치) × X 영향도(0/1/3/9)로 우선순위를 산출합니다.</p>

      <div style={{ fontWeight: 700, margin: '0.75rem 0 0.35rem' }}>출력 Y (CTQ)</div>
      {ys.map((y, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 36px', gap: 6, marginBottom: 6 }}>
          <input style={inputStyle} value={y.name} onChange={e => {
            const next = [...ys]; next[i] = { ...y, name: e.target.value }; setYs(next); persist(next, xs);
          }} />
          <input style={inputStyle} type="number" value={y.weight} onChange={e => {
            const next = [...ys]; next[i] = { ...y, weight: Number(e.target.value) || 0 }; setYs(next); persist(next, xs);
          }} />
          <button type="button" onClick={() => {
            const next = ys.filter((_, j) => j !== i);
            const nextXs = xs.map(x => ({ ...x, scores: (x.scores || []).filter((_, j) => j !== i) }));
            setYs(next); setXs(nextXs); persist(next, nextXs);
          }}>✕</button>
        </div>
      ))}
      <button type="button" className="btn-secondary" onClick={() => {
        const next = [...ys, { name: `Y${ys.length + 1}`, weight: 5 }];
        const nextXs = xs.map(x => ({ ...x, scores: [...(x.scores || []), 0] }));
        setYs(next); setXs(nextXs); persist(next, nextXs);
      }}>+ Y 추가</button>

      <div style={{ fontWeight: 700, margin: '1rem 0 0.35rem' }}>입력 X (원인)</div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: 6 }}>원인</th>
              {ys.map((y, i) => <th key={i} style={{ padding: 6 }}>{y.name}<div style={{ color: '#64748b', fontWeight: 400 }}>w={y.weight}</div></th>)}
              <th style={{ padding: 6 }}>점수</th>
            </tr>
          </thead>
          <tbody>
            {xs.map((x, i) => {
              const total = (x.scores || []).reduce((s, sc, j) => s + (Number(sc) || 0) * (Number(ys[j]?.weight) || 0), 0);
              return (
                <tr key={i} style={{ borderTop: '1px solid #e2e8f0' }}>
                  <td style={{ padding: 6 }}>
                    <input style={inputStyle} value={x.name} onChange={e => {
                      const next = [...xs]; next[i] = { ...x, name: e.target.value }; setXs(next); persist(ys, next);
                    }} />
                  </td>
                  {ys.map((_, j) => (
                    <td key={j} style={{ padding: 6 }}>
                      <select style={inputStyle} value={x.scores?.[j] ?? 0} onChange={e => {
                        const next = [...xs];
                        const scores = [...(next[i].scores || Array(ys.length).fill(0))];
                        scores[j] = Number(e.target.value);
                        next[i] = { ...next[i], scores };
                        setXs(next); persist(ys, next);
                      }}>
                        {[0, 1, 3, 9].map(v => <option key={v} value={v}>{v}</option>)}
                      </select>
                    </td>
                  ))}
                  <td style={{ padding: 6, fontWeight: 700 }}>{total}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <button type="button" className="btn-secondary" style={{ marginTop: 8 }} onClick={() => {
        const next = [...xs, { name: `X${xs.length + 1}`, scores: ys.map(() => 0) }];
        setXs(next); persist(ys, next);
      }}>+ X 추가</button>

      <ResultBlock title="우선순위 (높은 점수 순)">
        {ranked.map((r, i) => (
          <div key={r.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px solid #e2e8f0' }}>
            <span>{i + 1}. {r.name}</span>
            <b>{r.total}</b>
          </div>
        ))}
      </ResultBlock>
    </div>
  );
};

/** 7) Y=f(X) 검증 로그 */
export const HypothesisLogEditor = ({ value = [], onChange, onComplete }) => {
  const [rows, setRows] = useState(value.length ? value : [
    { id: 1, y: '불량률', x: '냉각시간', hypothesis: '냉각시간 ↑ → 불량 ↓', method: '2-sample t / 회귀', status: '검증중', evidence: '', result: '' }
  ]);

  const save = (next) => {
    setRows(next);
    onChange?.(next);
    onComplete?.(next);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <ClipboardList size={18} /> <strong>Y=f(X) 가설/검증 체크리스트</strong>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Analyze→Improve 연결용 가설 로그입니다.</p>
      {rows.map((row, i) => (
        <div key={row.id || i} style={{ ...box, marginTop: i === 0 ? 0 : '0.75rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <div><label style={{ fontSize: '0.75rem' }}>Y</label>
              <input style={inputStyle} value={row.y} onChange={e => {
                const next = [...rows]; next[i] = { ...row, y: e.target.value }; save(next);
              }} /></div>
            <div><label style={{ fontSize: '0.75rem' }}>X</label>
              <input style={inputStyle} value={row.x} onChange={e => {
                const next = [...rows]; next[i] = { ...row, x: e.target.value }; save(next);
              }} /></div>
          </div>
          <div style={{ marginTop: 6 }}><label style={{ fontSize: '0.75rem' }}>가설</label>
            <input style={inputStyle} value={row.hypothesis} onChange={e => {
              const next = [...rows]; next[i] = { ...row, hypothesis: e.target.value }; save(next);
            }} /></div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 8, marginTop: 6 }}>
            <div><label style={{ fontSize: '0.75rem' }}>검증 방법</label>
              <input style={inputStyle} value={row.method} onChange={e => {
                const next = [...rows]; next[i] = { ...row, method: e.target.value }; save(next);
              }} /></div>
            <div><label style={{ fontSize: '0.75rem' }}>상태</label>
              <select style={inputStyle} value={row.status} onChange={e => {
                const next = [...rows]; next[i] = { ...row, status: e.target.value }; save(next);
              }}>
                <option>대기</option><option>검증중</option><option>채택</option><option>기각</option>
              </select></div>
          </div>
          <div style={{ marginTop: 6 }}><label style={{ fontSize: '0.75rem' }}>근거/결과</label>
            <textarea style={{ ...inputStyle, minHeight: 60 }} value={row.evidence || row.result || ''}
              onChange={e => {
                const next = [...rows]; next[i] = { ...row, evidence: e.target.value, result: e.target.value }; save(next);
              }} /></div>
          <button type="button" style={{ marginTop: 6, color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}
            onClick={() => save(rows.filter((_, j) => j !== i))}>삭제</button>
        </div>
      ))}
      <button type="button" className="btn-primary" style={{ marginTop: 8 }} onClick={() => save([
        ...rows,
        { id: Date.now(), y: '', x: '', hypothesis: '', method: '', status: '대기', evidence: '', result: '' }
      ])}>+ 가설 추가</button>
    </div>
  );
};

/** 8) Before/After 대시보드 */
export const BeforeAfterDashboard = ({ measure, value, controlResult, onComplete }) => {
  const [before, setBefore] = useState(() => value?.before || {
    defectRate: measure?.defectCount && measure?.unitCount
      ? ((measure.defectCount / measure.unitCount) * 100).toFixed(2)
      : '15.2',
    dpmo: measure?.unitCount
      ? String(Math.round((measure.defectCount / (measure.unitCount * (measure.opportunityPerUnit || 1))) * 1e6))
      : '152000',
    cpk: measure?.analysisSummary?.cpk != null ? String(Number(measure.analysisSummary.cpk).toFixed(2)) : '0.65',
    sigma: measure?.analysisSummary?.sigmaLevel != null ? String(Number(measure.analysisSummary.sigmaLevel).toFixed(1)) : '2.0'
  });
  const [after, setAfter] = useState(() => value?.after || {
    defectRate: controlResult?.defectRate || '4.8',
    dpmo: controlResult?.dpmo || '48000',
    cpk: controlResult?.cpk || '1.35',
    sigma: controlResult?.sigma || '4.0'
  });

  const rows = [
    { key: 'defectRate', label: '불량률(%)', better: 'down' },
    { key: 'dpmo', label: 'DPMO', better: 'down' },
    { key: 'cpk', label: 'Cpk', better: 'up' },
    { key: 'sigma', label: 'Sigma', better: 'up' }
  ];

  const delta = (key, better) => {
    const b = Number(before[key]); const a = Number(after[key]);
    if (isNaN(b) || isNaN(a) || b === 0) return null;
    const pct = ((a - b) / Math.abs(b)) * 100;
    const improved = better === 'down' ? a < b : a > b;
    return { pct, improved, abs: a - b };
  };

  const insightResult = useMemo(() => {
    const improvedCount = rows.filter(r => delta(r.key, r.better)?.improved).length;
    const worsened = rows.filter(r => {
      const d = delta(r.key, r.better);
      return d && !d.improved;
    }).length;
    return {
      ok: true,
      conclusion: `Before/After: ${improvedCount}개 지표 개선, ${worsened}개 악화/정체`,
      significant: improvedCount >= 2,
      improvedCount,
      worsened
    };
  }, [before, after]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <GitBranch size={18} /> <strong>Before / After 대시보드</strong>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#64748b' }}>개선 전후 KPI를 한눈에 비교합니다. Measure/결과 값이 있으면 자동 채움.</p>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f1f5f9' }}>
              <th style={{ textAlign: 'left', padding: '0.75rem' }}>지표</th>
              <th style={{ padding: '0.75rem' }}>Before</th>
              <th style={{ padding: '0.75rem' }}>After</th>
              <th style={{ padding: '0.75rem' }}>변화</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => {
              const d = delta(r.key, r.better);
              return (
                <tr key={r.key} style={{ borderTop: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>{r.label}</td>
                  <td style={{ padding: '0.5rem' }}>
                    <input style={inputStyle} value={before[r.key]} onChange={e => setBefore({ ...before, [r.key]: e.target.value })} />
                  </td>
                  <td style={{ padding: '0.5rem' }}>
                    <input style={inputStyle} value={after[r.key]} onChange={e => setAfter({ ...after, [r.key]: e.target.value })} />
                  </td>
                  <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 700, color: d?.improved ? '#059669' : '#dc2626' }}>
                    {d ? `${d.abs >= 0 ? '+' : ''}${d.abs.toFixed(2)} (${d.pct >= 0 ? '+' : ''}${d.pct.toFixed(1)}%)` : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <ResultInsight toolId="before_after" result={insightResult} context="개선 전후 KPI 비교" />
      <button type="button" className="btn-primary" style={{ marginTop: 12 }} onClick={() => onComplete?.({ before, after })}>
        비교 결과 저장
      </button>
    </div>
  );
};
