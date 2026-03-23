import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, PointElement, LineElement);

/**
 * A3 Project Summary Report Component
 * Displays key project information in a single-page printable layout.
 */
const A3Report = ({ data, methodology = 'dmaic' }) => {
    if (!data) return null;

    const styles = {
        container: {
            width: '100%',
            maxWidth: '1400px', // A3 wide ratio equivalent
            margin: '0 auto',
            padding: '2rem',
            backgroundColor: 'white',
            fontFamily: '"Pretendard", "Malgun Gothic", sans-serif',
            color: '#333',
            boxShadow: '0 0 20px rgba(0,0,0,0.1)',
            printColorAdjust: 'exact',
        },
        header: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '3px solid #1e293b',
            paddingBottom: '1rem',
            marginBottom: '1.5rem',
        },
        titleSection: {
            flex: 1,
        },
        title: {
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#1e293b',
            margin: 0,
        },
        subtitle: {
            fontSize: '1.1rem',
            color: '#64748b',
            marginTop: '0.5rem',
        },
        metaInfo: {
            textAlign: 'right',
            fontSize: '0.9rem',
            color: '#475569',
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr', // 3 Columns
            gap: '1.5rem',
        },
        column: {
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
        },
        section: {
            border: '1px solid #cbd5e1',
            borderRadius: '8px',
            overflow: 'hidden',
        },
        sectionHeader: {
            backgroundColor: '#f1f5f9',
            padding: '0.75rem 1rem',
            borderBottom: '1px solid #cbd5e1',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#0f172a',
        },
        sectionContent: {
            padding: '1rem',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap', // Preserve line breaks
        },
        label: {
            display: 'block',
            fontSize: '0.85rem',
            fontWeight: '600',
            color: '#64748b',
            marginBottom: '0.25rem',
            marginTop: '0.5rem',
        },
        value: {
            fontWeight: '500',
            color: '#1e293b',
        },
        badge: {
            display: 'inline-block',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.8rem',
            fontWeight: 'bold',
            backgroundColor: methodology === 'dmaic' ? '#dbeafe' : '#f3e8ff',
            color: methodology === 'dmaic' ? '#1e40af' : '#7e22ce',
        }
    };

    // Helper to safely get content or default text
    const safeText = (text, placeholder = '-') => text || placeholder;

    // Chart Data Preparation (Simple Histogram for Measure)
    const measureChartData = {
        labels: Array.from({ length: 10 }, (_, i) => i + 1),
        datasets: [{
            label: 'Measured Data',
            data: data.measure?.chartData?.histogram?.rawData || [],
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
        }]
    };

    // Before/After Chart Data (Mockup for visualization if real data is complex)
    const improvementChartData = {
        labels: ['Before', 'After'],
        datasets: [{
            label: 'Performance',
            data: [45, 30], // Example data using noise level from context
            backgroundColor: ['#ef4444', '#22c55e'],
        }]
    };

    return (
        <div className="a3-report" style={styles.container}>
            {/* Header */}
            <header style={styles.header}>
                <div style={styles.titleSection}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={styles.badge}>{methodology.toUpperCase()} PROJECT</span>
                        <h1 style={styles.title}>{safeText(data.define?.projectTitle, 'Untitled Project')}</h1>
                    </div>
                    <div style={styles.subtitle}>Team Leader: {data.define?.team?.[0]?.name || 'N/A'}</div>
                </div>
                <div style={styles.metaInfo}>
                    <div><strong>Start:</strong> {data.define?.timeline?.start || '-'}</div>
                    <div><strong>End:</strong> {data.define?.timeline?.end || '-'}</div>
                </div>
            </header>

            {/* Main Grid */}
            <div style={styles.grid}>

                {/* Column 1: Define & Measure */}
                <div style={styles.column}>
                    {/* Define Phase */}
                    <div style={styles.section}>
                        <div style={styles.sectionHeader}>1. Define (정의)</div>
                        <div style={styles.sectionContent}>
                            <div style={styles.label}>Business Case (배경)</div>
                            <div style={styles.value}>{safeText(data.define?.businessCase)}</div>

                            <div style={styles.label}>Project Goal (목표)</div>
                            <div style={styles.value}>{safeText(data.define?.goal)}</div>

                            <div style={styles.label}>Team Members</div>
                            <div style={styles.value}>
                                {data.define?.team?.map(m => m.name).join(', ') || '-'}
                            </div>
                        </div>
                    </div>

                    {/* Measure Phase */}
                    <div style={styles.section}>
                        <div style={styles.sectionHeader}>2. Measure (측정)</div>
                        <div style={styles.sectionContent}>
                            <div style={styles.label}>CTQ (핵심 품질 특성)</div>
                            <div style={styles.value}>{safeText(data.measure?.ctq)}</div>

                            <div style={styles.label}>Current Data Analysis (Histogram)</div>
                            <div style={{ height: '150px', marginTop: '0.5rem' }}>
                                {data.measure?.chartData?.histogram?.rawData?.length > 0 ? (
                                    <Bar
                                        data={measureChartData}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: { legend: { display: false } }
                                        }}
                                    />
                                ) : (
                                    <div style={{ color: '#94a3b8', textAlign: 'center', paddingTop: '2rem' }}>No Data</div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 2: Analyze & Improve/Design */}
                <div style={styles.column}>
                    {/* Analyze Phase */}
                    <div style={styles.section}>
                        <div style={styles.sectionHeader}>3. Analyze (분석)</div>
                        <div style={styles.sectionContent}>
                            <div style={styles.label}>{methodology === 'dmaic' ? 'Root Cause Analysis' : 'Concept Selection'}</div>
                            <div style={styles.value}>
                                {methodology === 'dmaic'
                                    ? safeText(data.analyze?.fishbone?.effect ? `Effect: ${data.analyze.fishbone.effect}` : '근본 원인 분석 결과가 여기에 표시됩니다.')
                                    : safeText(data.analyze?.alternatives)
                                }
                            </div>
                        </div>
                    </div>

                    {/* Improve / Design Phase */}
                    <div style={styles.section}>
                        <div style={styles.sectionHeader}>4. {methodology === 'dmaic' ? 'Improve (개선)' : 'Design (설계)'}</div>
                        <div style={styles.sectionContent}>
                            <div style={styles.label}>{methodology === 'dmaic' ? 'Solutions & Implementation' : 'Final Specs & Simulation'}</div>
                            <div style={styles.value}>
                                {methodology === 'dmaic'
                                    ? (data.improve?.solutions?.map(s => `• ${s}`).join('\n') || safeText(data.improve?.doe, '-'))
                                    : safeText(data.design?.spec)
                                }
                            </div>
                        </div>
                    </div>
                </div>

                {/* Column 3: Control & Results */}
                <div style={styles.column}>
                    {/* Control / Verify Phase */}
                    <div style={styles.section}>
                        <div style={styles.sectionHeader}>5. {methodology === 'dmaic' ? 'Control (관리)' : 'Verify (검증)'}</div>
                        <div style={styles.sectionContent}>
                            <div style={styles.label}>{methodology === 'dmaic' ? 'Control Plan & SOP' : 'Verification Results'}</div>
                            <div style={styles.value}>
                                {methodology === 'dmaic'
                                    ? safeText(data.control?.monitoringPlan)
                                    : safeText(data.verify?.result)
                                }
                            </div>
                        </div>
                    </div>

                    {/* Final Results / Benefits */}
                    <div style={{ ...styles.section, borderColor: '#3b82f6', backgroundColor: '#eff6ff' }}>
                        <div style={{ ...styles.sectionHeader, backgroundColor: '#3b82f6', color: 'white', borderBottom: 'none' }}>
                            🏆 Project Benefits
                        </div>
                        <div style={{ padding: '1.5rem', textAlign: 'center' }}>
                            <div style={styles.label}>Expected Financial Effect</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1e40af', margin: '0.5rem 0' }}>
                                ₩ 500,000,000
                            </div>
                            <div style={styles.subtitle}>(Estimated)</div>

                            <div style={{ borderTop: '1px solid #bfdbfe', marginTop: '1rem', paddingTop: '1rem' }}>
                                <div style={styles.label}>Before vs After</div>
                                <div style={{ height: '100px' }}>
                                    <Bar
                                        data={improvementChartData}
                                        options={{
                                            indexAxis: 'y',
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: { legend: { display: false } }
                                        }}
                                    />
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
