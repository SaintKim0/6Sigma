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
 * Run Chart (런 차트) 컴포넌트
 * 시간에 따른 추세 분석
 */
const RunChart = ({
    data = [],
    title = 'Run Chart',
    yLabel = 'Value'
}) => {
    const analysis = useMemo(() => {
        if (!data || data.length === 0) return null;

        const values = data.map(d => d.value);
        const n = values.length;

        // 중앙값 계산
        const sorted = [...values].sort((a, b) => a - b);
        const median = sorted[Math.floor(n / 2)];

        // 평균 계산
        const mean = values.reduce((a, b) => a + b, 0) / n;

        // 추세 분석 (선형 회귀)
        const xValues = Array.from({ length: n }, (_, i) => i);
        const xMean = (n - 1) / 2;

        let numerator = 0;
        let denominator = 0;

        for (let i = 0; i < n; i++) {
            const xDiff = i - xMean;
            numerator += xDiff * (values[i] - mean);
            denominator += xDiff * xDiff;
        }

        const slope = numerator / denominator;
        const intercept = mean - slope * xMean;

        // 추세 판정
        let trendDirection = 'stable';
        if (Math.abs(slope) > 0.01) {
            trendDirection = slope > 0 ? 'increasing' : 'decreasing';
        }

        // Runs 테스트 (중앙값 기준)
        let runs = 1;
        for (let i = 1; i < n; i++) {
            const prevAbove = values[i - 1] > median;
            const currAbove = values[i] > median;
            if (prevAbove !== currAbove) {
                runs++;
            }
        }

        // 예상 runs 수 (랜덤한 경우)
        const aboveMedian = values.filter(v => v > median).length;
        const belowMedian = n - aboveMedian;
        const expectedRuns = (2 * aboveMedian * belowMedian) / n + 1;

        // 패턴 감지
        const hasPattern = Math.abs(runs - expectedRuns) > 2;

        return {
            median,
            mean,
            slope,
            intercept,
            trendDirection,
            runs,
            expectedRuns,
            hasPattern,
            trendLine: xValues.map(x => slope * x + intercept)
        };
    }, [data]);

    if (!analysis) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                시계열 데이터를 입력하세요
            </div>
        );
    }

    const chartData = {
        labels: data.map(d => d.label || d.date),
        datasets: [
            {
                label: yLabel,
                data: data.map(d => d.value),
                borderColor: '#667eea',
                backgroundColor: '#667eea',
                pointRadius: 5,
                pointHoverRadius: 7,
                tension: 0.1,
            },
            {
                label: 'Trend Line',
                data: analysis.trendLine,
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
            annotation: {
                annotations: {
                    median: {
                        type: 'line',
                        yMin: analysis.median,
                        yMax: analysis.median,
                        borderColor: '#10b981',
                        borderWidth: 2,
                        borderDash: [10, 5],
                        label: {
                            content: `Median: ${analysis.median.toFixed(2)}`,
                            enabled: true,
                            position: 'end',
                            backgroundColor: '#10b981',
                            color: 'white',
                            font: { size: 11 }
                        }
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        if (context.datasetIndex === 0) {
                            return `${yLabel}: ${context.parsed.y.toFixed(2)}`;
                        }
                        return '';
                    }
                }
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: yLabel
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Time / Sequence'
                }
            }
        }
    };

    const getTrendEmoji = () => {
        if (analysis.trendDirection === 'increasing') return '📈';
        if (analysis.trendDirection === 'decreasing') return '📉';
        return '➡️';
    };

    const getTrendText = () => {
        if (analysis.trendDirection === 'increasing') return '상승 추세';
        if (analysis.trendDirection === 'decreasing') return '하락 추세';
        return '안정적';
    };

    return (
        <div>
            <div style={{ height: '400px' }}>
                <Line data={chartData} options={options} />
            </div>

            <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: '#f8f9fa',
                borderRadius: '8px',
                fontSize: '0.9rem'
            }}>
                <strong>추세 분석</strong>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginTop: '0.5rem' }}>
                    <div>
                        <div style={{ color: '#666' }}>중앙값</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#10b981' }}>
                            {analysis.median.toFixed(3)}
                        </div>
                    </div>
                    <div>
                        <div style={{ color: '#666' }}>평균</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                            {analysis.mean.toFixed(3)}
                        </div>
                    </div>
                    <div>
                        <div style={{ color: '#666' }}>추세</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                            {getTrendEmoji()} {getTrendText()}
                        </div>
                    </div>
                    <div>
                        <div style={{ color: '#666' }}>기울기</div>
                        <div style={{
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            color: analysis.slope > 0 ? '#ef4444' : analysis.slope < 0 ? '#10b981' : '#666'
                        }}>
                            {analysis.slope.toFixed(4)}
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'white', borderRadius: '6px' }}>
                    <strong>Runs Test (패턴 감지)</strong>
                    <div style={{ marginTop: '0.5rem', fontSize: '0.9rem' }}>
                        <div>실제 Runs: {analysis.runs}</div>
                        <div>예상 Runs: {analysis.expectedRuns.toFixed(1)}</div>
                        {analysis.hasPattern ? (
                            <div style={{ marginTop: '0.5rem', color: '#f59e0b' }}>
                                ⚠️ 비랜덤 패턴이 감지되었습니다. 특수 원인이 있을 수 있습니다.
                            </div>
                        ) : (
                            <div style={{ marginTop: '0.5rem', color: '#10b981' }}>
                                ✅ 랜덤한 변동으로 보입니다.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: '#e0f2fe',
                borderRadius: '8px',
                fontSize: '0.85rem'
            }}>
                <strong>💡 Run Chart 활용 팁</strong>
                <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.5rem', lineHeight: '1.6' }}>
                    <li>시간 순서대로 데이터를 플롯하여 추세를 파악</li>
                    <li>중앙선 위/아래 패턴을 관찰하여 변화 감지</li>
                    <li>연속된 상승/하락이 7개 이상이면 특수 원인 의심</li>
                    <li>Control Chart 작성 전 예비 분석으로 활용</li>
                </ul>
            </div>
        </div>
    );
};

export default RunChart;
