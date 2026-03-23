import React, { useState } from 'react';
import { Upload, Plus, X } from 'lucide-react';

/**
 * 차트 데이터 입력 공통 컴포넌트
 */
const ChartDataInput = ({ chartType, onDataChange, initialData = null }) => {
    const [inputMethod, setInputMethod] = useState('manual'); // 'manual' or 'csv'

    // Control Chart 데이터 입력
    const ControlChartInput = () => {
        const [samples, setSamples] = useState(initialData?.samples || []);
        const [sampleSize, setSampleSize] = useState(5);

        const addSample = () => {
            const newSample = {
                id: Date.now(),
                values: Array(sampleSize).fill(''),
                timestamp: new Date().toISOString().split('T')[0]
            };
            const updated = [...samples, newSample];
            setSamples(updated);
            onDataChange({ samples: updated, type: 'xbar' });
        };

        const updateSample = (index, field, value) => {
            const updated = [...samples];
            updated[index][field] = value;
            setSamples(updated);
            onDataChange({ samples: updated, type: 'xbar' });
        };

        const updateSampleValue = (sampleIndex, valueIndex, value) => {
            const updated = [...samples];
            updated[sampleIndex].values[valueIndex] = parseFloat(value) || 0;
            setSamples(updated);
            onDataChange({ samples: updated, type: 'xbar' });
        };

        const removeSample = (index) => {
            const updated = samples.filter((_, i) => i !== index);
            setSamples(updated);
            onDataChange({ samples: updated, type: 'xbar' });
        };

        return (
            <div>
                <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <label>
                        샘플 크기 (n):
                        <input
                            type="number"
                            value={sampleSize}
                            onChange={(e) => setSampleSize(parseInt(e.target.value) || 5)}
                            min="2"
                            max="10"
                            style={{ marginLeft: '0.5rem', width: '80px' }}
                        />
                    </label>
                    <button className="btn-primary" onClick={addSample}>
                        <Plus size={16} /> 샘플 추가
                    </button>
                </div>

                {samples.map((sample, sIndex) => (
                    <div key={sample.id} style={{
                        marginBottom: '1rem',
                        padding: '1rem',
                        background: '#f8f9fa',
                        borderRadius: '8px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <strong>Sample {sIndex + 1}</strong>
                            <button
                                onClick={() => removeSample(sIndex)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${sampleSize}, 1fr)`, gap: '0.5rem' }}>
                            {sample.values.map((val, vIndex) => (
                                <input
                                    key={vIndex}
                                    type="number"
                                    step="0.01"
                                    value={val}
                                    onChange={(e) => updateSampleValue(sIndex, vIndex, e.target.value)}
                                    placeholder={`값 ${vIndex + 1}`}
                                    style={{ padding: '0.5rem' }}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    // Histogram 데이터 입력
    const HistogramInput = () => {
        const [rawData, setRawData] = useState(initialData?.rawData?.join(', ') || '');
        const [lsl, setLsl] = useState(initialData?.lsl || '');
        const [usl, setUsl] = useState(initialData?.usl || '');
        const [binCount, setBinCount] = useState(initialData?.binCount || 10);

        const handleDataChange = () => {
            const dataArray = rawData.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
            onDataChange({
                rawData: dataArray,
                lsl: lsl ? parseFloat(lsl) : null,
                usl: usl ? parseFloat(usl) : null,
                binCount
            });
        };

        return (
            <div>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                        데이터 (쉼표로 구분):
                    </label>
                    <textarea
                        value={rawData}
                        onChange={(e) => setRawData(e.target.value)}
                        onBlur={handleDataChange}
                        placeholder="10.1, 10.2, 10.3, 10.5, ..."
                        rows={4}
                        style={{ width: '100%', padding: '0.5rem', fontFamily: 'monospace' }}
                    />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>LSL (하한):</label>
                        <input
                            type="number"
                            step="0.01"
                            value={lsl}
                            onChange={(e) => setLsl(e.target.value)}
                            onBlur={handleDataChange}
                            placeholder="선택사항"
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>USL (상한):</label>
                        <input
                            type="number"
                            step="0.01"
                            value={usl}
                            onChange={(e) => setUsl(e.target.value)}
                            onBlur={handleDataChange}
                            placeholder="선택사항"
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Bin 개수:</label>
                        <input
                            type="number"
                            value={binCount}
                            onChange={(e) => setBinCount(parseInt(e.target.value) || 10)}
                            onBlur={handleDataChange}
                            min="5"
                            max="30"
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                </div>
            </div>
        );
    };

    // Scatter Plot 데이터 입력
    const ScatterPlotInput = () => {
        const [xLabel, setXLabel] = useState(initialData?.xLabel || 'X Variable');
        const [yLabel, setYLabel] = useState(initialData?.yLabel || 'Y Variable');
        const [dataText, setDataText] = useState(
            initialData?.data?.map(d => `${d.x}, ${d.y}`).join('\n') || ''
        );

        const handleDataChange = () => {
            const dataArray = dataText.split('\n')
                .map(line => {
                    const [x, y] = line.split(',').map(v => parseFloat(v.trim()));
                    return { x, y };
                })
                .filter(d => !isNaN(d.x) && !isNaN(d.y));

            onDataChange({
                data: dataArray,
                xLabel,
                yLabel
            });
        };

        return (
            <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>X축 레이블:</label>
                        <input
                            type="text"
                            value={xLabel}
                            onChange={(e) => setXLabel(e.target.value)}
                            onBlur={handleDataChange}
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Y축 레이블:</label>
                        <input
                            type="text"
                            value={yLabel}
                            onChange={(e) => setYLabel(e.target.value)}
                            onBlur={handleDataChange}
                            style={{ width: '100%', padding: '0.5rem' }}
                        />
                    </div>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                        데이터 (각 줄에 X, Y 값):
                    </label>
                    <textarea
                        value={dataText}
                        onChange={(e) => setDataText(e.target.value)}
                        onBlur={handleDataChange}
                        placeholder="25, 2.1&#10;30, 3.5&#10;35, 4.2"
                        rows={6}
                        style={{ width: '100%', padding: '0.5rem', fontFamily: 'monospace' }}
                    />
                </div>
            </div>
        );
    };

    // Box Plot 데이터 입력
    const BoxPlotInput = () => {
        const [groups, setGroups] = useState(initialData?.groups || []);

        const addGroup = () => {
            const newGroup = {
                id: Date.now(),
                name: `Group ${groups.length + 1}`,
                data: []
            };
            const updated = [...groups, newGroup];
            setGroups(updated);
            onDataChange({ groups: updated });
        };

        const updateGroup = (index, field, value) => {
            const updated = [...groups];
            if (field === 'data') {
                updated[index][field] = value.split(',').map(v => parseFloat(v.trim())).filter(v => !isNaN(v));
            } else {
                updated[index][field] = value;
            }
            setGroups(updated);
            onDataChange({ groups: updated });
        };

        const removeGroup = (index) => {
            const updated = groups.filter((_, i) => i !== index);
            setGroups(updated);
            onDataChange({ groups: updated });
        };

        return (
            <div>
                <button className="btn-primary" onClick={addGroup} style={{ marginBottom: '1rem' }}>
                    <Plus size={16} /> 그룹 추가
                </button>

                {groups.map((group, index) => (
                    <div key={group.id} style={{
                        marginBottom: '1rem',
                        padding: '1rem',
                        background: '#f8f9fa',
                        borderRadius: '8px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <input
                                type="text"
                                value={group.name}
                                onChange={(e) => updateGroup(index, 'name', e.target.value)}
                                style={{ fontWeight: 'bold', border: 'none', background: 'transparent', fontSize: '1rem' }}
                            />
                            <button
                                onClick={() => removeGroup(index)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}
                            >
                                <X size={18} />
                            </button>
                        </div>
                        <textarea
                            value={group.data.join(', ')}
                            onChange={(e) => updateGroup(index, 'data', e.target.value)}
                            placeholder="데이터를 쉼표로 구분: 10.1, 10.2, 10.3, ..."
                            rows={2}
                            style={{ width: '100%', padding: '0.5rem', fontFamily: 'monospace' }}
                        />
                    </div>
                ))}
            </div>
        );
    };

    // Run Chart 데이터 입력
    const RunChartInput = () => {
        const [dataText, setDataText] = useState(
            initialData?.data?.map(d => `${d.label || d.date}, ${d.value}`).join('\n') || ''
        );

        const handleDataChange = () => {
            const dataArray = dataText.split('\n')
                .map(line => {
                    const [label, value] = line.split(',').map(v => v.trim());
                    return { label, value: parseFloat(value) };
                })
                .filter(d => d.label && !isNaN(d.value));

            onDataChange({ data: dataArray });
        };

        return (
            <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                    데이터 (각 줄에 레이블, 값):
                </label>
                <textarea
                    value={dataText}
                    onChange={(e) => setDataText(e.target.value)}
                    onBlur={handleDataChange}
                    placeholder="2026-01-01, 10.2&#10;2026-01-02, 10.5&#10;2026-01-03, 10.3"
                    rows={8}
                    style={{ width: '100%', padding: '0.5rem', fontFamily: 'monospace' }}
                />
            </div>
        );
    };

    return (
        <div style={{ padding: '1rem', background: 'white', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
            {chartType === 'control' && <ControlChartInput />}
            {chartType === 'histogram' && <HistogramInput />}
            {chartType === 'scatter' && <ScatterPlotInput />}
            {chartType === 'boxplot' && <BoxPlotInput />}
            {chartType === 'run' && <RunChartInput />}
        </div>
    );
};

export default ChartDataInput;
