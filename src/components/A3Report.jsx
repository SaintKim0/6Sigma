import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);

const safeText = (text, placeholder = '-') => {
  if (text === null || text === undefined || text === '') return placeholder;
  if (typeof text === 'object') return placeholder;
  return String(text);
};

const formatWhy5 = (why5) => {
  if (!Array.isArray(why5) || !why5.length) return '';
  return why5.map((w, i) => {
    if (typeof w === 'string') return `${i + 1}Why: ${w}`;
    const q = w?.question ? `Q: ${w.question}` : '';
    const a = w?.answer ? `A: ${w.answer}` : '';
    return `${i + 1}Why ${[q, a].filter(Boolean).join(' / ')}`;
  }).filter(Boolean).join('\n');
};

const formatFishbone = (fb) => {
  if (!fb || typeof fb !== 'object') return '';
  if (fb.effect) return `Effect: ${fb.effect}`;
  const cats = ['man', 'machine', 'material', 'method', 'measurement', 'environment'];
  const lines = cats.flatMap(c => (fb[c] || []).filter(Boolean).map(v => `· ${c}: ${v}`));
  return lines.slice(0, 8).join('\n');
};

const formatSolutions = (solutions) => {
  if (!Array.isArray(solutions) || !solutions.length) return '';
  return solutions
    .filter(s => s && (s.isSelected || s.solution || typeof s === 'string'))
    .map(s => {
      if (typeof s === 'string') return `• ${s}`;
      const mark = s.isSelected ? '✓ ' : '• ';
      return `${mark}${s.solution || s.cause || JSON.stringify(s)}`;
    })
    .join('\n');
};

const formatDoe = (doe) => {
  if (!doe) return '';
  if (typeof doe === 'string') return doe;
  const factors = (doe.factors || []).map(f =>
    typeof f === 'string' ? f : `${f.name}(${f.low}~${f.high})`
  ).join(', ');
  return [`반응: ${doe.response || '-'}`, `설계: ${doe.design || '-'}`, `인자: ${factors || '-'}`, doe.result ? `결과: ${doe.result}` : '']
    .filter(Boolean).join('\n');
};

const formatVoc = (voc, ctqText) => {
  if (voc?.ctqItems?.length) {
    return voc.ctqItems.map((c, i) => `${i + 1}. ${c.ctq}: ${c.spec}`).join('\n');
  }
  return ctqText || '';
};

const formatMsa = (msa) => {
  if (!msa) return '';
  return `방법: ${msa.method || '-'} | Parts ${msa.parts}/Ops ${msa.operators}/Rep ${msa.replicates}\n${msa.result || ''}`;
};

const formatControl = (control) => {
  const parts = [];
  if (control?.controlPlanSummary) parts.push(control.controlPlanSummary);
  else if (control?.controlPlan?.items?.length) {
    parts.push(`【관리계획서】 ${control.controlPlan.templateName || ''}`);
    parts.push(...control.controlPlan.items.slice(0, 5).map(i =>
      `· [${i.process}] ${i.characteristic} | ${i.spec}`
    ));
  }
  if (control?.monitoring?.kpis?.length) {
    parts.push(`【모니터링 KPI】 ${control.monitoring.templateName || ''}`);
    parts.push(...control.monitoring.kpis.map(k =>
      `· ${k.name}: ${k.target} (${k.frequency})`
    ));
  } else if (control?.monitoringPlan) {
    parts.push(control.monitoringPlan);
  }
  if (control?.sop) parts.push(`SOP: ${control.sop}`);
  return parts.filter(Boolean).join('\n');
};

const parseBeforeAfter = (resultSummary) => {
  const metrics = resultSummary?.metrics || [];
  if (!metrics.length) return { labels: ['Before', 'After'], values: [null, null], names: [] };
  // use first metric with numeric-ish values; else index metrics
  const nums = metrics.map(m => {
    const b = parseFloat(String(m.before).replace(/[^0-9.-]/g, ''));
    const a = parseFloat(String(m.after).replace(/[^0-9.-]/g, ''));
    return { name: m.name, b: Number.isFinite(b) ? b : null, a: Number.isFinite(a) ? a : null };
  }).filter(m => m.b !== null && m.a !== null);
  if (nums.length) {
    return { labels: ['Before', 'After'], values: [nums[0].b, nums[0].a], names: [nums[0].name] };
  }
  return { labels: metrics.map(m => m.name), values: null, names: metrics.map(m => `${m.before} → ${m.after}`) };
};

/**
 * A3 Project Summary Report
 */
const A3Report = ({ data, methodology = 'dmaic' }) => {
  if (!data) return null;

  const styles = {
    container: {
      width: '100%', maxWidth: '1400px', margin: '0 auto', padding: '2rem',
      backgroundColor: 'white', fontFamily: '"Pretendard", "Malgun Gothic", sans-serif',
      color: '#333', boxShadow: '0 0 20px rgba(0,0,0,0.1)', printColorAdjust: 'exact',
    },
    header: {
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      borderBottom: '3px solid #1e293b', paddingBottom: '1rem', marginBottom: '1.5rem',
    },
    title: { fontSize: '2rem', fontWeight: 'bold', color: '#1e293b', margin: 0 },
    subtitle: { fontSize: '1.1rem', color: '#64748b', marginTop: '0.5rem' },
    metaInfo: { textAlign: 'right', fontSize: '0.9rem', color: '#475569' },
    grid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem' },
    column: { display: 'flex', flexDirection: 'column', gap: '1.5rem' },
    section: { border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' },
    sectionHeader: {
      backgroundColor: '#f1f5f9', padding: '0.75rem 1rem', borderBottom: '1px solid #cbd5e1',
      fontWeight: 'bold', fontSize: '1.1rem', color: '#0f172a',
    },
    sectionContent: { padding: '1rem', fontSize: '0.95rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' },
    label: {
      display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#64748b',
      marginBottom: '0.25rem', marginTop: '0.5rem',
    },
    value: { fontWeight: 500, color: '#1e293b' },
    badge: {
      display: 'inline-block', padding: '0.25rem 0.5rem', borderRadius: '4px',
      fontSize: '0.8rem', fontWeight: 'bold',
      backgroundColor: methodology === 'dmaic' ? '#dbeafe' : '#f3e8ff',
      color: methodology === 'dmaic' ? '#1e40af' : '#7e22ce',
    }
  };

  const analyzeText = methodology === 'dmaic'
    ? [formatFishbone(data.analyze?.fishbone), formatWhy5(data.analyze?.why5)].filter(Boolean).join('\n\n')
      || data.analyze?.hypothesis?.result
      || ''
    : safeText(data.analyze?.alternatives);

  const improveText = methodology === 'dmaic'
    ? [formatSolutions(data.improve?.solutions), formatDoe(data.improve?.DOE)].filter(Boolean).join('\n\n')
    : safeText(data.design?.spec || data.design?.designSpecs);

  const controlText = methodology === 'dmaic'
    ? formatControl(data.control)
    : safeText(data.verify?.result || data.verify?.verificationResults);

  const benefitText = data.define?.financialBenefits
    || data.control?.resultSummary?.summary
    || data.control?.result
    || '';

  const ba = parseBeforeAfter(data.control?.resultSummary);
  const improvementChartData = ba.values
    ? {
      labels: ba.labels,
      datasets: [{
        label: ba.names[0] || 'Performance',
        data: ba.values,
        backgroundColor: ['#ef4444', '#22c55e'],
      }]
    }
    : {
      labels: ba.names.length ? ba.names : ['Before', 'After'],
      datasets: [{
        label: 'Performance',
        data: ba.names.length ? ba.names.map((_, i) => ba.names.length - i) : [0, 0],
        backgroundColor: ['#ef4444', '#22c55e'],
      }]
    };

  const measureChartData = {
    labels: Array.from({ length: Math.max(10, data.measure?.chartData?.histogram?.rawData?.length || 0) }, (_, i) => i + 1),
    datasets: [{
      label: 'Measured Data',
      data: data.measure?.chartData?.histogram?.rawData || [],
      backgroundColor: 'rgba(59, 130, 246, 0.5)',
    }]
  };

  const ctqBlock = formatVoc(data.define?.vocCtq, data.measure?.ctq);
  const msaBlock = formatMsa(data.measure?.msa);

  return (
    <div className="a3-report" style={styles.container}>
      <header style={styles.header}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={styles.badge}>{methodology.toUpperCase()} PROJECT</span>
            <h1 style={styles.title}>{safeText(data.define?.projectTitle, 'Untitled Project')}</h1>
          </div>
          <div style={styles.subtitle}>
            Team Leader: {data.define?.team?.find(m => /Belt|Champion/i.test(m.role))?.name
              || data.define?.team?.[0]?.name || 'N/A'}
          </div>
        </div>
        <div style={styles.metaInfo}>
          <div><strong>Start:</strong> {data.define?.timeline?.start || '-'}</div>
          <div><strong>End:</strong> {data.define?.timeline?.end || '-'}</div>
        </div>
      </header>

      <div style={styles.grid}>
        <div style={styles.column}>
          <div style={styles.section}>
            <div style={styles.sectionHeader}>1. Define (정의)</div>
            <div style={styles.sectionContent}>
              <div style={styles.label}>Business Case</div>
              <div style={styles.value}>{safeText(data.define?.businessCase)}</div>
              <div style={styles.label}>Problem</div>
              <div style={styles.value}>{safeText(data.define?.problemStatement)}</div>
              <div style={styles.label}>Goal</div>
              <div style={styles.value}>{safeText(data.define?.goal)}</div>
              <div style={styles.label}>Team</div>
              <div style={styles.value}>
                {data.define?.team?.map(m => `${m.name}(${m.role})`).join(', ') || '-'}
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionHeader}>2. Measure (측정)</div>
            <div style={styles.sectionContent}>
              <div style={styles.label}>CTQ</div>
              <div style={styles.value}>{safeText(ctqBlock)}</div>
              {msaBlock && (
                <>
                  <div style={styles.label}>MSA</div>
                  <div style={styles.value}>{msaBlock}</div>
                </>
              )}
              <div style={styles.label}>Histogram</div>
              <div style={{ height: '150px', marginTop: '0.5rem' }}>
                {data.measure?.chartData?.histogram?.rawData?.length > 0 ? (
                  <Bar data={measureChartData} options={{
                    responsive: true, maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                  }} />
                ) : (
                  <div style={{ color: '#94a3b8', textAlign: 'center', paddingTop: '2rem' }}>No Data</div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={styles.column}>
          <div style={styles.section}>
            <div style={styles.sectionHeader}>3. Analyze (분석)</div>
            <div style={styles.sectionContent}>
              <div style={styles.label}>{methodology === 'dmaic' ? 'Root Cause' : 'Concept Selection'}</div>
              <div style={styles.value}>{safeText(analyzeText, '분석 결과가 여기에 표시됩니다.')}</div>
            </div>
          </div>

          <div style={styles.section}>
            <div style={styles.sectionHeader}>4. {methodology === 'dmaic' ? 'Improve (개선)' : 'Design (설계)'}</div>
            <div style={styles.sectionContent}>
              <div style={styles.label}>{methodology === 'dmaic' ? 'Solutions & DOE' : 'Design Spec'}</div>
              <div style={styles.value}>{safeText(improveText)}</div>
            </div>
          </div>
        </div>

        <div style={styles.column}>
          <div style={styles.section}>
            <div style={styles.sectionHeader}>5. {methodology === 'dmaic' ? 'Control (관리)' : 'Verify (검증)'}</div>
            <div style={styles.sectionContent}>
              <div style={styles.label}>{methodology === 'dmaic' ? 'Control & Monitoring' : 'Verification'}</div>
              <div style={styles.value}>{safeText(controlText)}</div>
            </div>
          </div>

          <div style={{ ...styles.section, borderColor: '#3b82f6', backgroundColor: '#eff6ff' }}>
            <div style={{ ...styles.sectionHeader, backgroundColor: '#3b82f6', color: 'white', borderBottom: 'none' }}>
              Project Benefits
            </div>
            <div style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={styles.label}>Financial / Outcome</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 'bold', color: '#1e40af', margin: '0.5rem 0', whiteSpace: 'pre-wrap' }}>
                {safeText(benefitText, '성과 요약을 입력하세요')}
              </div>
              {(data.control?.resultSummary?.metrics || []).length > 0 && (
                <div style={{ textAlign: 'left', fontSize: '0.85rem', color: '#1e3a8a', marginBottom: '0.75rem' }}>
                  {data.control.resultSummary.metrics.map((m, i) => (
                    <div key={i}>· {m.name}: {m.before} → {m.after}{m.note ? ` (${m.note})` : ''}</div>
                  ))}
                </div>
              )}
              <div style={{ borderTop: '1px solid #bfdbfe', marginTop: '1rem', paddingTop: '1rem' }}>
                <div style={styles.label}>Before vs After</div>
                <div style={{ height: '100px' }}>
                  {ba.values ? (
                    <Bar data={improvementChartData} options={{
                      indexAxis: 'y', responsive: true, maintainAspectRatio: false,
                      plugins: { legend: { display: false } }
                    }} />
                  ) : (
                    <div style={{ fontSize: '0.85rem', color: '#64748b', textAlign: 'left' }}>
                      {(data.control?.resultSummary?.metrics || []).map((m, i) => (
                        <div key={i}>{m.name}: {m.before} → {m.after}</div>
                      )) || '지표를 최종 성과에 입력하세요'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8' }}>
        Generated by 6-Sigma Master | {new Date().toLocaleDateString()}
      </div>
    </div>
  );
};

export default A3Report;
