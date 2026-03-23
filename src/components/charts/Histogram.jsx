import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    annotationPlugin
);

/**
 * Histogram (히스토그램) 컴포넌트
 * 데이터 분포 시각화 및 정규성 확인
 */
const Histogram = ({
    data = [],
    binCount = 10,
    lsl = null,
    usl = null,
    title = 'Histogram'
}) => {
    const histogramData = useMemo(() => {
        if (!data || data.length === 0) return null;

        // 데이터 범위 계산
        const min = Math.min(...data);
        const max = Math.max(...data);
        const range = max - min;
        const binWidth = range / binCount;

        // Bin 생성
        const bins = Array(binCount).fill(0).map((_, i) => ({
            start: min + (i * binWidth),
            end: min + ((i + 1) * binWidth),
            count: 0,
            label: `${(min + (i * binWidth)).toFixed(2)} - ${(min + ((i + 1) * binWidth)).toFixed(2)}`
        }));

        // 데이터를 bin에 할당
        data.forEach(value => {
            const binIndex = Math.min(
                Math.floor((value - min) / binWidth),
                binCount - 1
            );
            bins[binIndex].count++;
        });

        // 통계 계산
        const mean = data.reduce((a, b) => a + b, 0) / data.length;
        const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;
        const stdDev = Math.sqrt(variance);

        // Cp, Cpk 계산 (LSL, USL이 있을 경우)
        let cp = null;
        let cpk = null;
        if (lsl !== null && usl !== null) {
            cp = (usl - lsl) / (6 * stdDev);
            const cpkUpper = (usl - mean) / (3 * stdDev);
            const cpkLower = (mean - lsl) / (3 * stdDev);
            cpk = Math.min(cpkUpper, cpkLower);
        }

        return {
            bins,
            mean,
            stdDev,
            cp,
            cpk,
            min,
            max
        };
    }, [data, binCount, lsl, usl]);

    if (!histogramData) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                데이터를 입력하세요
            </div>
        );
    }

    const chartData = {
        labels: histogramData.bins.map(bin => bin.label),
        datasets: [
            {
                label: 'Frequency',
                data: histogramData.bins.map(bin => bin.count),
                backgroundColor: '#667eea',
                borderColor: '#4c51bf',
                borderWidth: 1,
            },
        ],
    };

    const annotations = {};

    // LSL, USL 라인 추가
    if (lsl !== null) {
        annotations.lsl = {
            type: 'line',
            xMin: lsl,
            xMax: lsl,
            borderColor: '#ef4444',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
                content: `LSL: ${lsl}`,
                enabled: true,
                position: 'start',
                backgroundColor: '#ef4444',
                color: 'white',
                font: { size: 11 }
            }
        };
    }

    if (usl !== null) {
        annotations.usl = {
            type: 'line',
            xMin: usl,
            xMax: usl,
            borderColor: '#ef4444',
            borderWidth: 2,
            borderDash: [5, 5],
            label: {
                content: `USL: ${usl}`,
                enabled: true,
                position: 'start',
                backgroundColor: '#ef4444',
                color: 'white',
                font: { size: 11 }
            }
        };
    }

    // 평균선 추가
    annotations.mean = {
        type: 'line',
        xMin: histogramData.mean,
        xMax: histogramData.mean,
        borderColor: '#10b981',
        borderWidth: 2,
        label: {
            content: `Mean: ${histogramData.mean.toFixed(2)}`,
            enabled: true,
            position: 'end',
            backgroundColor: '#10b981',
            color: 'white',
            font: { size: 11 }
        }
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
                annotations
            },
            tooltip: {
                callbacks: {
                    title: function (context) {
                        return `Range: ${context[0].label}`;
                    },
                    label: function (context) {
                        return `Frequency: ${context.parsed.y}`;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Frequency'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Value Range'
                },
                ticks: {
                    maxRotation: 45,
                    minRotation: 45
                }
            }
        }
    };

    return (
        <div>
            <div style={{ height: '400px' }}>
                <Bar data={chartData} options={options} />
            </div>

            <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: '#f8f9fa',
                borderRadius: '8px',
                fontSize: '0.9rem'
            }}>
                <strong>통계 요약</strong>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
                    <div>
                        <div style={{ color: '#666' }}>Sample Size</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                            {data.length}
                        </div>
                    </div>
                    <div>
                        <div style={{ color: '#666' }}>Mean (평균)</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#10b981' }}>
                            {histogramData.mean.toFixed(3)}
                        </div>
                    </div>
                    <div>
                        <div style={{ color: '#666' }}>Std Dev (표준편차)</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                            {histogramData.stdDev.toFixed(3)}
                        </div>
                    </div>
                    <div>
                        <div style={{ color: '#666' }}>Range</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                            {histogramData.min.toFixed(2)} ~ {histogramData.max.toFixed(2)}
                        </div>
                    </div>
                    {histogramData.cp !== null && (
                        <>
                            <div>
                                <div style={{ color: '#666' }}>Cp (공정능력)</div>
                                <div style={{
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    color: histogramData.cp >= 1.33 ? '#10b981' : histogramData.cp >= 1.0 ? '#f59e0b' : '#ef4444'
                                }}>
                                    {histogramData.cp.toFixed(3)}
                                </div>
                            </div>
                            <div>
                                <div style={{ color: '#666' }}>Cpk (공정능력지수)</div>
                                <div style={{
                                    fontSize: '1.1rem',
                                    fontWeight: 'bold',
                                    color: histogramData.cpk >= 1.33 ? '#10b981' : histogramData.cpk >= 1.0 ? '#f59e0b' : '#ef4444'
                                }}>
                                    {histogramData.cpk.toFixed(3)}
                                </div>
                            </div>
                        </>
                    )}
                </div>

                {histogramData.cp !== null && (
                    <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#666' }}>
                        <strong>공정능력 평가:</strong>
                        {histogramData.cpk >= 1.33 && ' ✅ 우수 (Cpk ≥ 1.33)'}
                        {histogramData.cpk >= 1.0 && histogramData.cpk < 1.33 && ' ⚠️ 양호 (1.0 ≤ Cpk < 1.33)'}
                        {histogramData.cpk < 1.0 && ' ❌ 개선 필요 (Cpk < 1.0)'}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Histogram;
