import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { computeControlChartStats } from '../../utils/advancedStats';
import { analyzeControlChartRules } from '../../utils/controlChartRules';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    annotationPlugin
);

const A2 = { 2: 1.880, 3: 1.023, 4: 0.729, 5: 0.577, 6: 0.483, 7: 0.419, 8: 0.373, 9: 0.337, 10: 0.308 };
const D3 = { 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0.076, 8: 0.136, 9: 0.184, 10: 0.223 };
const D4 = { 2: 3.267, 3: 2.575, 4: 2.282, 5: 2.115, 6: 2.004, 7: 1.924, 8: 1.864, 9: 1.816, 10: 1.777 };

const buildLineChart = (stats, title, seriesLabel) => {
    if (!stats?.ok && !stats?.values) return null;

    const values = stats.values;
    const labels = stats.labels;
    const variableLimits = !!stats.variableLimits;
    const uclArr = variableLimits ? stats.ucl : null;
    const lclArr = variableLimits ? stats.lcl : null;
    const ucl = variableLimits ? null : stats.ucl;
    const lcl = variableLimits ? null : stats.lcl;
    const cl = stats.centerLine;

    const outOfControlPoints = values.map((value, index) => {
        const hi = variableLimits ? uclArr[index] : ucl;
        const lo = variableLimits ? lclArr[index] : lcl;
        if (value > hi || value < lo) return index;
        return null;
    }).filter(i => i !== null);

    const datasets = [
        {
            label: seriesLabel,
            data: values,
            borderColor: '#667eea',
            backgroundColor: '#667eea',
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: values.map((_, i) =>
                outOfControlPoints.includes(i) ? '#ef4444' : '#667eea'
            ),
            order: 1
        }
    ];

    if (variableLimits) {
        datasets.push(
            {
                label: 'UCL',
                data: uclArr,
                borderColor: '#ef4444',
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false,
                order: 2
            },
            {
                label: 'LCL',
                data: lclArr,
                borderColor: '#ef4444',
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false,
                order: 3
            },
            {
                label: 'CL',
                data: values.map(() => cl),
                borderColor: '#10b981',
                pointRadius: 0,
                fill: false,
                order: 4
            }
        );
    }

    const annotations = variableLimits ? {} : {
        ucl: {
            type: 'line',
            yMin: ucl,
            yMax: ucl,
            borderColor: '#ef4444',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
                content: `UCL: ${Number(ucl).toFixed(3)}`,
                display: true,
                position: 'end',
                backgroundColor: '#ef4444',
                color: 'white',
                font: { size: 11 }
            }
        },
        centerLine: {
            type: 'line',
            yMin: cl,
            yMax: cl,
            borderColor: '#10b981',
            borderWidth: 2,
            label: {
                content: `CL: ${Number(cl).toFixed(3)}`,
                display: true,
                position: 'end',
                backgroundColor: '#10b981',
                color: 'white',
                font: { size: 11 }
            }
        },
        lcl: {
            type: 'line',
            yMin: lcl,
            yMax: lcl,
            borderColor: '#ef4444',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
                content: `LCL: ${Number(lcl).toFixed(3)}`,
                display: true,
                position: 'end',
                backgroundColor: '#ef4444',
                color: 'white',
                font: { size: 11 }
            }
        }
    };

    const chartData = { labels, datasets };
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' },
            title: { display: true, text: title, font: { size: 16, weight: 'bold' } },
            annotation: { annotations },
            tooltip: {
                callbacks: {
                    afterLabel: (context) =>
                        outOfControlPoints.includes(context.dataIndex) ? '⚠️ Out of Control' : ''
                }
            }
        },
        scales: {
            y: { beginAtZero: false, title: { display: true, text: 'Value' } },
            x: { title: { display: true, text: 'Sample' } }
        }
    };

    return { chartData, options, outOfControlPoints, stats: { ...stats, ucl: variableLimits ? null : ucl, lcl: variableLimits ? null : lcl } };
};

const RulesPanel = ({ built }) => {
    if (built.stats.variableLimits) {
        return (
            <div style={{ marginTop: '0.75rem', padding: '0.85rem', background: '#fffbeb', borderRadius: 8, fontSize: '0.88rem', color: '#92400e' }}>
                속성 관리도(변동 한계)는 Zone 규칙을 생략하고, 한계 이탈만 표시합니다.
            </div>
        );
    }
    const analysis = analyzeControlChartRules(built.stats.values, {
        cl: built.stats.centerLine,
        ucl: built.stats.ucl,
        lcl: built.stats.lcl
    });
    if (!analysis.ok) return null;
    return (
        <div style={{
            marginTop: '0.75rem',
            padding: '0.9rem 1rem',
            background: analysis.signals.length ? '#fef2f2' : '#f0fdf4',
            border: `1px solid ${analysis.signals.length ? '#fecaca' : '#bbf7d0'}`,
            borderRadius: 10
        }}>
            <strong style={{ color: '#0f172a' }}>관리도 해석 규칙</strong>
            <p style={{ margin: '0.4rem 0 0.55rem', fontSize: '0.9rem', color: '#334155' }}>{analysis.summary}</p>
            {analysis.signals.length > 0 && (
                <ul style={{ margin: '0 0 0.65rem', paddingLeft: '1.15rem', fontSize: '0.85rem', color: '#334155', lineHeight: 1.5 }}>
                    {analysis.signals.slice(0, 12).map((s, i) => (
                        <li key={i}><b>R{s.rule} {s.name}:</b> {s.message}</li>
                    ))}
                    {analysis.signals.length > 12 && <li>…외 {analysis.signals.length - 12}건</li>}
                </ul>
            )}
            <div style={{ fontSize: '0.85rem', color: '#0f172a' }}>
                <b>다음 조치:</b>
                <ol style={{ margin: '0.35rem 0 0', paddingLeft: '1.15rem' }}>
                    {analysis.nextActions.map((a, i) => <li key={i}>{a}</li>)}
                </ol>
            </div>
        </div>
    );
};

/**
 * Control Chart — I-MR, X-bar, X-bar/R, p/np/c/u
 */
const ControlChart = ({ data, type = 'xbar', title = 'Control Chart' }) => {
    const panels = useMemo(() => {
        if (!data || data.length === 0) return [];

        if (['p', 'np', 'c', 'u'].includes(type)) {
            const computed = computeControlChartStats(type, data);
            if (!computed.ok) return [{ error: computed.message }];
            const built = buildLineChart(computed, `${title} (${type}-chart)`, type.toUpperCase());
            return built ? [{ built, kind: type }] : [{ error: '차트를 그릴 수 없습니다.' }];
        }

        if (type === 'i-mr') {
            const values = data.map(d => (d.value != null ? Number(d.value) : Number(d.values?.[0]))).filter(v => !isNaN(v));
            if (values.length < 2) return [{ error: 'I-MR은 최소 2개 값이 필요합니다.' }];
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const movingRanges = [];
            for (let i = 1; i < values.length; i++) movingRanges.push(Math.abs(values[i] - values[i - 1]));
            const avgMR = movingRanges.reduce((a, b) => a + b, 0) / movingRanges.length;
            const ucl = mean + (2.66 * avgMR);
            const lcl = mean - (2.66 * avgMR);
            const built = buildLineChart({
                ok: true,
                values,
                centerLine: mean,
                ucl,
                lcl,
                labels: data.map((d, i) => d.label || `Point ${i + 1}`)
            }, `${title} (I chart)`, 'Individual');
            return built ? [{ built, kind: 'i-mr' }] : [];
        }

        // xbar / xbar-r
        const validData = data.filter(s => s && Array.isArray(s.values) && s.values.length > 0);
        if (validData.length === 0) return [{ error: '서브그룹 데이터가 없습니다.' }];

        const means = validData.map(sample => {
            const nums = sample.values.map(Number).filter(v => !isNaN(v));
            return nums.reduce((a, b) => a + b, 0) / nums.length;
        });
        const ranges = validData.map(sample => {
            const nums = sample.values.map(Number).filter(v => !isNaN(v));
            return Math.max(...nums) - Math.min(...nums);
        });
        const grandMean = means.reduce((a, b) => a + b, 0) / means.length;
        const avgRange = ranges.reduce((a, b) => a + b, 0) / ranges.length;
        const n = validData[0].values.length;
        const a2 = A2[n] ?? 0.577;
        const d3 = D3[n] ?? 0;
        const d4 = D4[n] ?? 2.115;
        const labels = validData.map((_, i) => `Sample ${i + 1}`);

        const xbarBuilt = buildLineChart({
            ok: true,
            values: means,
            centerLine: grandMean,
            ucl: grandMean + a2 * avgRange,
            lcl: grandMean - a2 * avgRange,
            labels
        }, `${title} (X-bar)`, 'Sample Mean');

        const result = [];
        if (xbarBuilt) result.push({ built: xbarBuilt, kind: 'xbar' });

        if (type === 'xbar-r' || type === 'xbar') {
            if (type === 'xbar-r') {
                const rBuilt = buildLineChart({
                    ok: true,
                    values: ranges,
                    centerLine: avgRange,
                    ucl: d4 * avgRange,
                    lcl: d3 * avgRange,
                    labels
                }, `${title} (R chart)`, 'Range');
                if (rBuilt) result.push({ built: rBuilt, kind: 'r' });
            }
        }

        return result;
    }, [data, type, title]);

    if (!panels.length) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                데이터를 입력하세요
            </div>
        );
    }

    if (panels[0]?.error) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#dc2626' }}>
                {panels[0].error}
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {panels.map(({ built, kind }) => (
                <div key={kind}>
                    <div style={{ height: '360px' }}>
                        <Line data={built.chartData} options={built.options} />
                    </div>
                    {built.outOfControlPoints.length > 0 && (
                        <div style={{
                            marginTop: '0.75rem',
                            padding: '0.85rem',
                            background: '#fef2f2',
                            border: '1px solid #ef4444',
                            borderRadius: '8px'
                        }}>
                            <strong style={{ color: '#ef4444' }}>⚠️ 관리 이탈 감지</strong>
                            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.9rem' }}>
                                {built.outOfControlPoints.length}개 포인트: {' '}
                                {built.outOfControlPoints.map(i => built.stats.labels[i]).join(', ')}
                            </p>
                        </div>
                    )}
                    {!built.stats.variableLimits && (
                        <div style={{
                            marginTop: '0.75rem',
                            padding: '0.85rem',
                            background: '#f8f9fa',
                            borderRadius: '8px',
                            fontSize: '0.9rem'
                        }}>
                            <strong>통계 요약 ({kind})</strong>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                                <div>
                                    <div style={{ color: '#666' }}>Center Line</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#10b981' }}>
                                        {Number(built.stats.centerLine).toFixed(3)}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: '#666' }}>UCL</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ef4444' }}>
                                        {Number(built.stats.ucl).toFixed(3)}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ color: '#666' }}>LCL</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ef4444' }}>
                                        {Number(built.stats.lcl).toFixed(3)}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <RulesPanel built={built} />
                </div>
            ))}
        </div>
    );
};

export default ControlChart;
