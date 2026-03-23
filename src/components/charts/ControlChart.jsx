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

/**
 * Control Chart (관리도) 컴포넌트
 * X-bar Chart, R Chart, I-MR Chart 지원
 */
const ControlChart = ({ data, type = 'xbar', title = 'Control Chart' }) => {
    // 통계 계산
    const stats = useMemo(() => {
        if (!data || data.length === 0) return null;

        if (type === 'xbar') {
            // X-bar Chart: 샘플 평균 관리도
            const validData = data.filter(s => s && Array.isArray(s.values) && s.values.length > 0);
            if (validData.length === 0) return null;

            const means = validData.map(sample => {
                const sum = sample.values.reduce((a, b) => a + b, 0);
                return sum / sample.values.length;
            });

            const grandMean = means.reduce((a, b) => a + b, 0) / means.length;

            // R (Range) 계산
            const ranges = validData.map(sample =>
                Math.max(...sample.values) - Math.min(...sample.values)
            );
            const avgRange = ranges.reduce((a, b) => a + b, 0) / ranges.length;

            // 관리한계 계산 (n=5 기준, A2=0.577)
            const n = validData[0].values.length;
            const A2 = n === 2 ? 1.880 : n === 3 ? 1.023 : n === 4 ? 0.729 : 0.577;

            const ucl = grandMean + (A2 * avgRange);
            const lcl = grandMean - (A2 * avgRange);

            return {
                values: means,
                centerLine: grandMean,
                ucl,
                lcl,
                labels: validData.map((_, i) => `Sample ${i + 1}`)
            };
        } else if (type === 'i-mr') {
            // Individual-Moving Range Chart
            const values = data.map(d => d.value);
            const mean = values.reduce((a, b) => a + b, 0) / values.length;

            // Moving Range 계산
            const movingRanges = [];
            for (let i = 1; i < values.length; i++) {
                movingRanges.push(Math.abs(values[i] - values[i - 1]));
            }
            const avgMR = movingRanges.reduce((a, b) => a + b, 0) / movingRanges.length;

            // 관리한계 (d2=1.128 for n=2)
            const ucl = mean + (2.66 * avgMR);
            const lcl = mean - (2.66 * avgMR);

            return {
                values,
                centerLine: mean,
                ucl,
                lcl,
                labels: data.map((d, i) => d.label || `Point ${i + 1}`)
            };
        }

        return null;
    }, [data, type]);

    if (!stats) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                데이터를 입력하세요
            </div>
        );
    }

    // 관리 이탈 포인트 감지
    const outOfControlPoints = stats.values.map((value, index) => {
        if (value > stats.ucl || value < stats.lcl) {
            return index;
        }
        return null;
    }).filter(i => i !== null);

    const chartData = {
        labels: stats.labels,
        datasets: [
            {
                label: type === 'xbar' ? 'Sample Mean' : 'Individual Value',
                data: stats.values,
                borderColor: '#667eea',
                backgroundColor: '#667eea',
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: stats.values.map((_, i) =>
                    outOfControlPoints.includes(i) ? '#ef4444' : '#667eea'
                ),
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: title,
                font: { size: 16, weight: 'bold' }
            },
            annotation: {
                annotations: {
                    ucl: {
                        type: 'line',
                        yMin: stats.ucl,
                        yMax: stats.ucl,
                        borderColor: '#ef4444',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        label: {
                            content: `UCL: ${stats.ucl.toFixed(2)}`,
                            enabled: true,
                            position: 'end',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            font: { size: 11 }
                        }
                    },
                    centerLine: {
                        type: 'line',
                        yMin: stats.centerLine,
                        yMax: stats.centerLine,
                        borderColor: '#10b981',
                        borderWidth: 2,
                        label: {
                            content: `CL: ${stats.centerLine.toFixed(2)}`,
                            enabled: true,
                            position: 'end',
                            backgroundColor: '#10b981',
                            color: 'white',
                            font: { size: 11 }
                        }
                    },
                    lcl: {
                        type: 'line',
                        yMin: stats.lcl,
                        yMax: stats.lcl,
                        borderColor: '#ef4444',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        label: {
                            content: `LCL: ${stats.lcl.toFixed(2)}`,
                            enabled: true,
                            position: 'end',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            font: { size: 11 }
                        }
                    }
                }
            },
            tooltip: {
                callbacks: {
                    afterLabel: function (context) {
                        const index = context.dataIndex;
                        if (outOfControlPoints.includes(index)) {
                            return '⚠️ Out of Control';
                        }
                        return '';
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                title: {
                    display: true,
                    text: 'Value'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Sample'
                }
            }
        }
    };

    return (
        <div>
            <div style={{ height: '400px' }}>
                <Line data={chartData} options={options} />
            </div>

            {outOfControlPoints.length > 0 && (
                <div style={{
                    marginTop: '1rem',
                    padding: '1rem',
                    background: '#fef2f2',
                    border: '1px solid #ef4444',
                    borderRadius: '8px'
                }}>
                    <strong style={{ color: '#ef4444' }}>⚠️ 관리 이탈 감지</strong>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem' }}>
                        {outOfControlPoints.length}개 포인트가 관리한계를 벗어났습니다: {' '}
                        {outOfControlPoints.map(i => stats.labels[i]).join(', ')}
                    </p>
                </div>
            )}

            <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: '#f8f9fa',
                borderRadius: '8px',
                fontSize: '0.9rem'
            }}>
                <strong>통계 요약</strong>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginTop: '0.5rem' }}>
                    <div>
                        <div style={{ color: '#666' }}>Center Line</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#10b981' }}>
                            {stats.centerLine.toFixed(3)}
                        </div>
                    </div>
                    <div>
                        <div style={{ color: '#666' }}>UCL</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ef4444' }}>
                            {stats.ucl.toFixed(3)}
                        </div>
                    </div>
                    <div>
                        <div style={{ color: '#666' }}>LCL</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#ef4444' }}>
                            {stats.lcl.toFixed(3)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ControlChart;
