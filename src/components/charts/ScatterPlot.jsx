import React, { useMemo } from 'react';
import { Scatter } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

/**
 * Scatter Plot (산점도) 컴포넌트
 * 두 변수 간 상관관계 분석
 */
const ScatterPlot = ({
    data = [],
    xLabel = 'X Variable',
    yLabel = 'Y Variable',
    title = 'Scatter Plot'
}) => {
    const analysis = useMemo(() => {
        if (!data || data.length === 0) return null;

        const n = data.length;
        const xValues = data.map(d => d.x);
        const yValues = data.map(d => d.y);

        // 평균 계산
        const xMean = xValues.reduce((a, b) => a + b, 0) / n;
        const yMean = yValues.reduce((a, b) => a + b, 0) / n;

        // 상관계수 계산 (Pearson's r)
        let numerator = 0;
        let xDenominator = 0;
        let yDenominator = 0;

        for (let i = 0; i < n; i++) {
            const xDiff = xValues[i] - xMean;
            const yDiff = yValues[i] - yMean;
            numerator += xDiff * yDiff;
            xDenominator += xDiff * xDiff;
            yDenominator += yDiff * yDiff;
        }

        const correlation = numerator / Math.sqrt(xDenominator * yDenominator);

        // 선형 회귀 (y = mx + b)
        const slope = numerator / xDenominator;
        const intercept = yMean - (slope * xMean);

        // R² 계산
        const rSquared = correlation * correlation;

        // 추세선 포인트 생성
        const xMin = Math.min(...xValues);
        const xMax = Math.max(...xValues);
        const trendLine = [
            { x: xMin, y: slope * xMin + intercept },
            { x: xMax, y: slope * xMax + intercept }
        ];

        return {
            correlation,
            rSquared,
            slope,
            intercept,
            trendLine,
            xMean,
            yMean
        };
    }, [data]);

    if (!analysis) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                데이터를 입력하세요 (X, Y 쌍)
            </div>
        );
    }

    const chartData = {
        datasets: [
            {
                label: 'Data Points',
                data: data,
                backgroundColor: '#667eea',
                pointRadius: 6,
                pointHoverRadius: 8,
            },
            {
                label: 'Trend Line',
                data: analysis.trendLine,
                type: 'line',
                borderColor: '#ef4444',
                borderWidth: 2,
                borderDash: [5, 5],
                pointRadius: 0,
                fill: false,
            }
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
            tooltip: {
                callbacks: {
                    label: function (context) {
                        if (context.datasetIndex === 0) {
                            return `${xLabel}: ${context.parsed.x.toFixed(2)}, ${yLabel}: ${context.parsed.y.toFixed(2)}`;
                        }
                        return '';
                    }
                }
            }
        },
        scales: {
            x: {
                type: 'linear',
                position: 'bottom',
                title: {
                    display: true,
                    text: xLabel
                }
            },
            y: {
                title: {
                    display: true,
                    text: yLabel
                }
            }
        }
    };

    // 상관관계 해석
    const getCorrelationInterpretation = (r) => {
        const absR = Math.abs(r);
        if (absR >= 0.9) return '매우 강한';
        if (absR >= 0.7) return '강한';
        if (absR >= 0.5) return '중간';
        if (absR >= 0.3) return '약한';
        return '매우 약한';
    };

    const correlationStrength = getCorrelationInterpretation(analysis.correlation);
    const correlationDirection = analysis.correlation > 0 ? '양의' : '음의';

    return (
        <div>
            <div style={{ height: '400px' }}>
                <Scatter data={chartData} options={options} />
            </div>

            <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: '#f8f9fa',
                borderRadius: '8px',
                fontSize: '0.9rem'
            }}>
                <strong>상관관계 분석</strong>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
                    <div>
                        <div style={{ color: '#666' }}>상관계수 (r)</div>
                        <div style={{
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            color: Math.abs(analysis.correlation) >= 0.7 ? '#10b981' : Math.abs(analysis.correlation) >= 0.5 ? '#f59e0b' : '#666'
                        }}>
                            {analysis.correlation.toFixed(4)}
                        </div>
                    </div>
                    <div>
                        <div style={{ color: '#666' }}>결정계수 (R²)</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                            {analysis.rSquared.toFixed(4)}
                        </div>
                    </div>
                    <div>
                        <div style={{ color: '#666' }}>회귀식</div>
                        <div style={{ fontSize: '0.95rem', fontWeight: 'bold', fontFamily: 'monospace' }}>
                            y = {analysis.slope.toFixed(3)}x + {analysis.intercept.toFixed(3)}
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'white', borderRadius: '6px' }}>
                    <strong>해석:</strong>
                    <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                        {correlationStrength} {correlationDirection} 상관관계가 있습니다.
                        {' '}R² = {(analysis.rSquared * 100).toFixed(1)}%로,
                        {yLabel}의 변동 중 약 {(analysis.rSquared * 100).toFixed(1)}%가 {xLabel}로 설명됩니다.
                    </p>
                    {Math.abs(analysis.correlation) >= 0.7 && (
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#10b981' }}>
                            ✅ 두 변수 간 강한 선형 관계가 확인되었습니다.
                        </p>
                    )}
                    {Math.abs(analysis.correlation) < 0.3 && (
                        <p style={{ margin: '0.5rem 0 0 0', fontSize: '0.9rem', color: '#f59e0b' }}>
                            ⚠️ 선형 관계가 약합니다. 다른 요인을 고려하거나 비선형 관계를 검토하세요.
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ScatterPlot;
