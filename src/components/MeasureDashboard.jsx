import React, { useEffect, useId, useState } from 'react';
import { Upload, FileSpreadsheet, Calculator, Activity, BarChart2, TrendingUp, Package, Target } from 'lucide-react';
import ControlChart from './charts/ControlChart';
import Histogram from './charts/Histogram';
import ScatterPlot from './charts/ScatterPlot';
import BoxPlot from './charts/BoxPlot';
import RunChart from './charts/RunChart';
import { parseMeasurementText, applyDerivedToMeasure } from '../utils/measureAnalysis';
import StatTemplatePanel from './StatTemplatePanel';
import ResultInsight from './ResultInsight';

const StatCard = ({ label, value, sub, accent }) => (
  <div style={{
    background: accent || 'white',
    padding: '1rem',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    textAlign: 'center',
    color: accent ? 'white' : undefined
  }}>
    <div style={{ fontSize: '0.8rem', opacity: accent ? 0.9 : undefined, color: accent ? undefined : '#64748b', marginBottom: '0.25rem' }}>
      {label}
    </div>
    <div style={{ fontWeight: 800, fontSize: '1.25rem' }}>{value}</div>
    {sub && <div style={{ fontSize: '0.75rem', marginTop: '0.25rem', opacity: 0.85 }}>{sub}</div>}
  </div>
);

/**
 * Measure 단계: 공통 측정 데이터 입력 → 전체 분석 도구 결과 자동 표시
 */
const MeasureDashboard = ({ measure, onMeasureChange }) => {
  const inputId = useId();
  const hist = measure?.chartData?.histogram || {};
  const [text, setText] = useState(() => (hist.rawData || []).join(', '));
  const [lsl, setLsl] = useState(hist.lsl ?? '');
  const [usl, setUsl] = useState(hist.usl ?? '');
  const [binCount, setBinCount] = useState(hist.binCount || 10);
  const [fileName, setFileName] = useState('');
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const h = measure?.chartData?.histogram || {};
    setText((h.rawData || []).join(', '));
    setLsl(h.lsl ?? '');
    setUsl(h.usl ?? '');
    setBinCount(h.binCount || 10);
  }, [measure?.chartData?.histogram?.rawData, measure?.chartData?.histogram?.lsl, measure?.chartData?.histogram?.usl]);

  const rawData = hist.rawData || [];
  const hasData = rawData.length > 0;
  const summary = measure?.analysisSummary;
  const dpmoValue = measure?.unitCount > 0
    ? (measure.defectCount / (measure.unitCount * (measure.opportunityPerUnit || 1))) * 1_000_000
    : 0;

  const apply = (nums, nextLsl = lsl, nextUsl = usl, nextBin = binCount) => {
    const updated = applyDerivedToMeasure(measure, nums, {
      lsl: nextLsl === '' ? null : Number(nextLsl),
      usl: nextUsl === '' ? null : Number(nextUsl),
      binCount: nextBin
    });
    onMeasureChange(updated);
  };

  const handleApplyText = () => {
    const nums = parseMeasurementText(text);
    apply(nums);
  };

  const handleFile = (file) => {
    if (!file) return;
    if (!/\.(csv|txt|tsv)$/i.test(file.name)) {
      alert('CSV, TXT, TSV 파일만 지원합니다.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      let body = String(reader.result || '');
      const lines = body.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
      if (lines.length && isNaN(parseFloat(lines[0].split(/[,\t;]/)[0]))) {
        body = lines.slice(1).join('\n');
      }
      const nums = parseMeasurementText(body);
      setText(nums.join(', '));
      setFileName(file.name);
      apply(nums);
    };
    reader.readAsText(file, 'UTF-8');
  };

  const fmt = (v, d = 2) => (v == null || isNaN(v) ? '—' : Number(v).toFixed(d));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* 공통 데이터 입력 */}
      <div style={{
        padding: '1.5rem',
        background: 'linear-gradient(180deg, #f8fafc 0%, #fff 100%)',
        borderRadius: '14px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ margin: 0, color: '#0f172a', fontSize: '1.1rem' }}>📥 측정 데이터 입력</h3>
            <p style={{ margin: '0.35rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>
              한 번 입력하면 DPMO · 관리도 · 히스토그램 · 산점도 · 박스플롯 · 런차트가 자동 분석됩니다.
              엑셀 복사 붙여넣기 또는 CSV/TXT 업로드를 권장합니다.
            </p>
          </div>
          {fileName && (
            <span style={{
              fontSize: '0.8rem',
              background: '#ecfdf5',
              color: '#047857',
              border: '1px solid #a7f3d0',
              padding: '0.35rem 0.7rem',
              borderRadius: '999px',
              fontWeight: 600
            }}>
              📄 {fileName}
            </span>
          )}
        </div>

        <StatTemplatePanel
          toolType="numbers"
          title="측정 데이터시트 (확장 가능)"
          initialConfig={{ columnName: '측정값', emptyRows: 30 }}
          onAnalyze={(r) => {
            setText(r.text);
            setFileName('템플릿 업로드');
            apply(r.numbers);
          }}
        />

        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFile(e.dataTransfer.files?.[0]);
          }}
          style={{
            border: `2px dashed ${dragOver ? '#2563eb' : '#cbd5e1'}`,
            borderRadius: '10px',
            padding: '1rem',
            background: dragOver ? '#eff6ff' : '#fff',
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#475569' }}>
            <Upload size={22} />
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>파일 드래그 또는 선택 (CSV/TXT)</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>숫자만 있으면 됩니다. 헤더 행은 자동 제외됩니다.</div>
            </div>
          </div>
          <div>
            <input id={inputId} type="file" accept=".csv,.txt,.tsv" style={{ display: 'none' }}
              onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ''; }}
            />
            <label htmlFor={inputId} style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #2563eb',
              background: 'white', color: '#2563eb', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer'
            }}>
              <FileSpreadsheet size={16} /> 파일 선택
            </label>
          </div>
        </div>

        <label style={{ display: 'block', fontWeight: 600, marginBottom: '0.4rem', color: '#334155', fontSize: '0.9rem' }}>
          측정값 (쉼표·줄바꿈 구분)
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="예: 14.5, 15.2, 14.8, 15.5 …"
          rows={3}
          style={{ width: '100%', padding: '0.75rem', fontFamily: 'monospace', borderRadius: '8px', border: '1px solid #cbd5e1', marginBottom: '0.75rem' }}
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem', marginBottom: '0.85rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#64748b' }}>LSL (하한)</label>
            <input type="number" step="any" value={lsl} onChange={(e) => setLsl(e.target.value)}
              placeholder="선택" style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#64748b' }}>USL (상한)</label>
            <input type="number" step="any" value={usl} onChange={(e) => setUsl(e.target.value)}
              placeholder="선택" style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Bin 개수</label>
            <input type="number" min={5} max={30} value={binCount}
              onChange={(e) => setBinCount(parseInt(e.target.value, 10) || 10)}
              style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #cbd5e1' }} />
          </div>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={handleApplyText}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <Calculator size={16} /> 분석 실행 / 결과 갱신
        </button>
        {hasData && (
          <span style={{ marginLeft: '0.75rem', fontSize: '0.85rem', color: '#059669', fontWeight: 600 }}>
            {rawData.length}개 데이터로 분석됨
          </span>
        )}
      </div>

      {/* 요약 KPI */}
      {hasData && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.75rem' }}>
          <StatCard label="N (표본수)" value={rawData.length} />
          <StatCard label="평균" value={fmt(summary?.mean)} />
          <StatCard label="표준편차" value={fmt(summary?.stdDev)} />
          <StatCard label="DPMO" value={Math.round(dpmoValue).toLocaleString()} sub={measure.defectCount != null ? `부적합 ${measure.defectCount}건` : undefined} />
          <StatCard label="Cp" value={fmt(summary?.cp)} />
          <StatCard label="Cpk" value={fmt(summary?.cpk)} accent={summary?.cpk != null ? (summary.cpk >= 1.33 ? '#059669' : summary.cpk >= 1 ? '#d97706' : '#dc2626') : undefined} />
          <StatCard label="Pp" value={fmt(summary?.pp)} />
          <StatCard label="Ppk" value={fmt(summary?.ppk)} />
          <StatCard label="Z.bench" value={fmt(summary?.zBench, 2)} />
          <StatCard label="%OOS" value={summary?.pctOosObserved != null ? `${fmt(summary.pctOosObserved)}%` : '—'} />
          <StatCard label="정규성 p" value={summary?.normalityP != null ? fmt(summary.normalityP, 3) : '—'}
            sub={summary?.isNormal == null ? undefined : (summary.isNormal ? '정규 가정 OK' : '비정규 주의')}
            accent={summary?.isNormal === false ? '#d97706' : undefined} />
          <StatCard label="Sigma" value={summary?.sigmaLevel != null ? `${fmt(summary.sigmaLevel, 1)}σ` : '—'} accent="#0f766e" />
        </div>
      )}

      {hasData && summary && (
        <ResultInsight
          toolId="measure_dashboard"
          result={{
            ok: true,
            isNormal: summary.isNormal,
            normalityP: summary.normalityP,
            cpk: summary.cpk,
            ppk: summary.ppk,
            sigmaLevel: summary.sigmaLevel,
            lsl: lsl === '' ? null : Number(lsl),
            usl: usl === '' ? null : Number(usl),
            conclusion: `n=${rawData.length}, mean=${fmt(summary.mean)}, Cpk=${fmt(summary.cpk)}, Ppk=${fmt(summary.ppk)}`
          }}
          context="Measure 단계 측정 데이터 일괄 분석"
        />
      )}

      {!hasData && (
        <div style={{
          padding: '2.5rem', textAlign: 'center', color: '#94a3b8',
          background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1'
        }}>
          측정 데이터를 입력하면 아래 분석 결과가 자동으로 표시됩니다.
        </div>
      )}

      {/* 전체 분석 결과 */}
      {hasData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.05rem', color: '#0f172a' }}>📊 자동 분석 결과</h3>

          <ResultBlock icon={<Calculator size={18} />} title="DPMO / 시그마 수준">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
              <StatCard label="Units" value={measure.unitCount} />
              <StatCard label="Defects" value={measure.defectCount} />
              <StatCard label="DPMO" value={Math.round(dpmoValue).toLocaleString()} accent="#2563eb" />
              <StatCard label="수율" value={measure.unitCount ? `${(((measure.unitCount - measure.defectCount) / measure.unitCount) * 100).toFixed(1)}%` : '—'} />
            </div>
            {(lsl === '' && usl === '') && (
              <p style={{ margin: '0.75rem 0 0', fontSize: '0.85rem', color: '#b45309' }}>
                💡 LSL/USL을 입력하면 규격 이탈을 불량으로 집계해 DPMO·Cpk가 계산됩니다.
              </p>
            )}
          </ResultBlock>

          <ResultBlock icon={<Activity size={18} />} title={`관리도 (${measure.chartData?.controlChart?.type === 'xbar' ? 'X-bar' : 'I-MR'})`}>
            <div className="measure-chart-frame">
              <ControlChart
                data={measure.chartData?.controlChart?.samples || []}
                type={measure.chartData?.controlChart?.type || 'i-mr'}
                title="Control Chart"
              />
            </div>
          </ResultBlock>

          <ResultBlock icon={<BarChart2 size={18} />} title="히스토그램 & 공정능력">
            <div className="measure-chart-frame">
              <Histogram
                data={rawData}
                binCount={hist.binCount || 10}
                lsl={hist.lsl}
                usl={hist.usl}
                title="Histogram"
              />
            </div>
            {summary?.cpk != null && (
              <div style={{ marginTop: '0.75rem', fontSize: '0.9rem' }}>
                {summary.cpk < 1 && <span style={{ color: '#dc2626', fontWeight: 600 }}>⚠️ Cpk &lt; 1.0 — 공정 개선이 시급합니다.</span>}
                {summary.cpk >= 1 && summary.cpk < 1.33 && <span style={{ color: '#d97706', fontWeight: 600 }}>⚠️ Cpk &lt; 1.33 — 지속 모니터링이 필요합니다.</span>}
                {summary.cpk >= 1.33 && <span style={{ color: '#16a34a', fontWeight: 600 }}>✅ Cpk ≥ 1.33 — 공정 능력이 양호합니다.</span>}
              </div>
            )}
          </ResultBlock>

          <div className="measure-chart-grid">
            <ResultBlock icon={<Target size={18} />} title="산점도 (순서 vs 측정값)">
              <div className="measure-chart-frame">
                <ScatterPlot
                  data={measure.chartData?.scatterPlot?.data || []}
                  xLabel={measure.chartData?.scatterPlot?.xLabel || '측정 순서'}
                  yLabel={measure.chartData?.scatterPlot?.yLabel || '측정값'}
                  title="Scatter"
                />
              </div>
            </ResultBlock>

            <ResultBlock icon={<Package size={18} />} title="박스플롯">
              <div className="measure-chart-frame">
                <BoxPlot
                  groups={measure.chartData?.boxPlot?.groups || []}
                  title="Box Plot"
                />
              </div>
            </ResultBlock>
          </div>

          <ResultBlock icon={<TrendingUp size={18} />} title="런 차트 (추세)">
            <div className="measure-chart-frame">
              <RunChart
                data={measure.chartData?.runChart?.data || []}
                title="Run Chart"
              />
            </div>
          </ResultBlock>
        </div>
      )}
    </div>
  );
};

const ResultBlock = ({ icon, title, children }) => (
  <div className="measure-result-block">
    <div className="measure-result-block-title">
      {icon} {title}
    </div>
    {children}
  </div>
);

export default MeasureDashboard;
