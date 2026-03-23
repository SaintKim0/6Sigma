import React, { useMemo } from 'react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

/**
 * Box Plot (상자 그림) 컴포넌트
 * 데이터 분포 비교 및 이상치 탐지
 */
const BoxPlot = ({
    groups = [],
    title = 'Box Plot'
}) => {
    const boxPlotData = useMemo(() => {
        if (!groups || groups.length === 0) return null;

        return groups.map(group => {
            const sorted = [...group.data].sort((a, b) => a - b);
            const n = sorted.length;

            // 사분위수 계산
            const q1Index = Math.floor(n * 0.25);
            const q2Index = Math.floor(n * 0.5);
            const q3Index = Math.floor(n * 0.75);

            const q1 = sorted[q1Index];
            const q2 = sorted[q2Index]; // 중앙값
            const q3 = sorted[q3Index];

            const iqr = q3 - q1;
            const lowerFence = q1 - 1.5 * iqr;
            const upperFence = q3 + 1.5 * iqr;

            // 이상치 탐지
            const outliers = sorted.filter(v => v < lowerFence || v > upperFence);

            // Whisker 계산 (이상치 제외한 최소/최대)
            const whiskerMin = Math.min(...sorted.filter(v => v >= lowerFence));
            const whiskerMax = Math.max(...sorted.filter(v => v <= upperFence));

            const mean = sorted.reduce((a, b) => a + b, 0) / n;

            return {
                name: group.name,
                q1,
                q2,
                q3,
                min: whiskerMin,
                max: whiskerMax,
                outliers,
                mean,
                iqr
            };
        });
    }, [groups]);

    if (!boxPlotData) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                그룹별 데이터를 입력하세요
            </div>
        );
    }

    // Box Plot을 Bar Chart로 시뮬레이션
    const chartData = {
        labels: boxPlotData.map(d => d.name),
        datasets: [
            {
                label: 'Q3',
                data: boxPlotData.map(d => d.q3),
                backgroundColor: '#667eea80',
                borderColor: '#667eea',
                borderWidth: 2,
            },
            {
                label: 'Q2 (Median)',
                data: boxPlotData.map(d => d.q2),
                backgroundColor: '#10b98180',
                borderColor: '#10b981',
                borderWidth: 2,
            },
            {
                label: 'Q1',
                data: boxPlotData.map(d => d.q1),
                backgroundColor: '#667eea80',
                borderColor: '#667eea',
                borderWidth: 2,
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: title,
                font: { size: 16, weight: 'bold' }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        const index = context.dataIndex;
                        const data = boxPlotData[index];
                        return [
                            `Min: ${data.min.toFixed(2)}`,
                            `Q1: ${data.q1.toFixed(2)}`,
                            `Median: ${data.q2.toFixed(2)}`,
                            `Q3: ${data.q3.toFixed(2)}`,
                            `Max: ${data.max.toFixed(2)}`,
                            `Mean: ${data.mean.toFixed(2)}`,
                            `Outliers: ${data.outliers.length}`
                        ];
                    }
                }
            }
        },
        scales: {
            x: {
                stacked: false,
                title: {
                    display: true,
                    text: 'Value'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Group'
                }
            }
        }
    };

    return (
        <div>
            <div style={{ height: '400px' }}>
                <Chart type='bar' data={chartData} options={options} />
            </div>

            <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: '#f8f9fa',
                borderRadius: '8px',
                fontSize: '0.9rem'
            }}>
                <strong>그룹별 통계</strong>
                <div style={{ marginTop: '0.75rem' }}>
                    {boxPlotData.map((data, index) => (
                        <div key={index} style={{
                            marginBottom: '1rem',
                            padding: '0.75rem',
                            background: 'white',
                            borderRadius: '6px',
                            borderLeft: '4px solid #667eea'
                        }}>
                            <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{data.name}</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.5rem', fontSize: '0.85rem' }}>
                                <div>
                                    <span style={{ color: '#666' }}>Min:</span> {data.min.toFixed(2)}
                                </div>
                                <div>
                                    <span style={{ color: '#666' }}>Q1:</span> {data.q1.toFixed(2)}
                                </div>
                                <div>
                                    <span style={{ color: '#666' }}>Median:</span> <strong>{data.q2.toFixed(2)}</strong>
                                </div>
                                <div>
                                    <span style={{ color: '#666' }}>Q3:</span> {data.q3.toFixed(2)}
                                </div>
                                <div>
                                    <span style={{ color: '#666' }}>Max:</span> {data.max.toFixed(2)}
                                </div>
                                <div>
                                    <span style={{ color: '#666' }}>Mean:</span> {data.mean.toFixed(2)}
                                </div>
                                <div>
                                    <span style={{ color: '#666' }}>IQR:</span> {data.iqr.toFixed(2)}
                                </div>
                                <div>
                                    <span style={{ color: '#666' }}>Outliers:</span>
                                    <span style={{ color: data.outliers.length > 0 ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>
                                        {' '}{data.outliers.length}
                                    </span>
                                </div>
                            </div>
                            {data.outliers.length > 0 && (
                                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#ef4444' }}>
                                    ⚠️ 이상치: {data.outliers.map(v => v.toFixed(2)).join(', ')}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: '#e0f2fe',
                borderRadius: '8px',
                fontSize: '0.85rem'
            }}>
                <strong>💡 Box Plot 해석 가이드</strong>
                <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem', lineHeight: '1.6' }}>
                    <li><strong>Box (상자)</strong>: Q1~Q3 범위, 데이터의 중간 50%</li>
                    <li><strong>Median (중앙선)</strong>: 데이터의 중앙값</li>
                    <li><strong>Whiskers (수염)</strong>: 이상치를 제외한 최소/최대값</li>
                    <li><strong>Outliers (이상치)</strong>: Q1 - 1.5×IQR 또는 Q3 + 1.5×IQR 밖의 값</li>
                </ul>
            </div>
        </div>
    );
};

export default BoxPlot;
