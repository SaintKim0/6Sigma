import React, { useId, useRef, useState } from 'react';
import { Upload, Plus, X, FileSpreadsheet, Keyboard } from 'lucide-react';

/** 텍스트에서 숫자만 추출 (쉼표/공백/줄바꿈/탭 모두 허용) */
const parseNumberList = (text) => {
    if (!text) return [];
    return text
        .replace(/\uFEFF/g, '')
        .split(/[\s,;|\t\n\r]+/)
        .map(v => v.trim())
        .filter(Boolean)
        .map(v => parseFloat(v.replace(/,/g, '')))
        .filter(v => !isNaN(v));
};

/** CSV/TSV 줄을 셀 배열로 */
const splitCsvLine = (line) => {
    // 간단한 CSV: 따옴표 안의 콤마는 무시하지 않음(숫자 데이터용)
    if (line.includes('\t')) return line.split('\t').map(c => c.trim());
    return line.split(',').map(c => c.trim());
};

const readFileAsText = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('파일을 읽을 수 없습니다.'));
        reader.readAsText(file, 'UTF-8');
    });

const FileUploadZone = ({ accept, hint, onFileLoaded, fileMeta }) => {
    const inputId = useId();
    const inputRef = useRef(null);
    const [dragOver, setDragOver] = useState(false);
    const [error, setError] = useState('');

    const handleFile = async (file) => {
        if (!file) return;
        const name = file.name.toLowerCase();
        if (!/\.(csv|txt|tsv)$/i.test(name)) {
            setError('CSV, TXT, TSV 파일만 지원합니다.');
            return;
        }
        try {
            setError('');
            const text = await readFileAsText(file);
            onFileLoaded(text, file);
        } catch (err) {
            setError(err.message || '파일 처리 중 오류가 발생했습니다.');
        }
    };

    return (
        <div>
            <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setDragOver(false);
                    const file = e.dataTransfer.files?.[0];
                    handleFile(file);
                }}
                style={{
                    border: `2px dashed ${dragOver ? '#2563eb' : '#cbd5e1'}`,
                    borderRadius: '10px',
                    padding: '1.25rem',
                    background: dragOver ? '#eff6ff' : '#f8fafc',
                    textAlign: 'center',
                    transition: 'all 0.15s'
                }}
            >
                <Upload size={28} color={dragOver ? '#2563eb' : '#64748b'} style={{ marginBottom: '0.5rem' }} />
                <div style={{ fontWeight: 600, color: '#334155', marginBottom: '0.35rem' }}>
                    파일을 드래그하거나 선택하세요
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.85rem', lineHeight: 1.5 }}>
                    {hint}
                </div>
                <input
                    ref={inputRef}
                    id={inputId}
                    type="file"
                    accept={accept}
                    style={{ display: 'none' }}
                    onChange={(e) => {
                        handleFile(e.target.files?.[0]);
                        e.target.value = '';
                    }}
                />
                <label
                    htmlFor={inputId}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #2563eb',
                        background: 'white',
                        color: '#2563eb',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer'
                    }}
                >
                    <FileSpreadsheet size={16} /> 파일 선택
                </label>
            </div>

            {fileMeta && (
                <div style={{
                    marginTop: '0.75rem',
                    padding: '0.65rem 0.85rem',
                    background: '#ecfdf5',
                    border: '1px solid #a7f3d0',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    color: '#065f46',
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    alignItems: 'center'
                }}>
                    <span>
                        ✅ <strong>{fileMeta.name}</strong>
                        {fileMeta.count != null && ` · ${fileMeta.count}개 데이터 로드`}
                    </span>
                </div>
            )}

            {error && (
                <div style={{
                    marginTop: '0.75rem',
                    padding: '0.65rem 0.85rem',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    color: '#b91c1c'
                }}>
                    {error}
                </div>
            )}
        </div>
    );
};

/**
 * 차트 데이터 입력 공통 컴포넌트 (수동 입력 + 파일 업로드)
 */
const ChartDataInput = ({ chartType, onDataChange, initialData = null }) => {
    const [inputMethod, setInputMethod] = useState('manual'); // 'manual' | 'file'
    const [fileMeta, setFileMeta] = useState(null);

    const MethodToggle = () => (
        <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginBottom: '1rem',
            padding: '0.25rem',
            background: '#e2e8f0',
            borderRadius: '10px',
            width: 'fit-content'
        }}>
            {[
                { id: 'manual', label: '직접 입력', icon: Keyboard },
                { id: 'file', label: '파일 업로드', icon: Upload }
            ].map(opt => {
                const Icon = opt.icon;
                const active = inputMethod === opt.id;
                return (
                    <button
                        key={opt.id}
                        type="button"
                        onClick={() => setInputMethod(opt.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            padding: '0.45rem 0.9rem',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            fontWeight: 700,
                            fontSize: '0.85rem',
                            background: active ? 'white' : 'transparent',
                            color: active ? '#1e40af' : '#64748b',
                            boxShadow: active ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
                        }}
                    >
                        <Icon size={15} /> {opt.label}
                    </button>
                );
            })}
        </div>
    );

    // Control Chart 데이터 입력
    const ControlChartInput = () => {
        const [chartKind, setChartKind] = useState(initialData?.type || 'i-mr');
        const [samples, setSamples] = useState(() => {
            if (!initialData?.samples) return [];
            return initialData.samples.map((s, i) => {
                if (s.defects != null || s.sampleSize != null) {
                    return { id: s.id || Date.now() + i, defects: s.defects, sampleSize: s.sampleSize, count: s.count, area: s.area, label: s.label };
                }
                if (Array.isArray(s.values)) {
                    return { id: s.id || Date.now() + i, values: s.values, timestamp: s.timestamp || '', defects: s.defects, sampleSize: s.sampleSize, count: s.count, area: s.area };
                }
                if (s.value != null) {
                    return { id: Date.now() + i, values: [Number(s.value)], timestamp: '' };
                }
                return { id: Date.now() + i, values: [], timestamp: '' };
            });
        });
        const [sampleSize, setSampleSize] = useState(5);
        const isAttribute = ['p', 'np', 'c', 'u'].includes(chartKind);

        const commit = (updated, kind = chartKind) => {
            setSamples(updated);
            onDataChange({ samples: updated, type: kind });
        };

        const changeKind = (kind) => {
            setChartKind(kind);
            onDataChange({ samples, type: kind });
        };

        const addSample = () => {
            if (chartKind === 'p' || chartKind === 'np') {
                commit([...samples, { id: Date.now(), defects: 0, sampleSize: 50, label: `S${samples.length + 1}` }]);
                return;
            }
            if (chartKind === 'c') {
                commit([...samples, { id: Date.now(), count: 0, label: `S${samples.length + 1}` }]);
                return;
            }
            if (chartKind === 'u') {
                commit([...samples, { id: Date.now(), count: 0, area: 1, label: `S${samples.length + 1}` }]);
                return;
            }
            commit([...samples, {
                id: Date.now(),
                values: Array(sampleSize).fill(''),
                timestamp: new Date().toISOString().split('T')[0]
            }]);
        };

        const updateSampleValue = (sampleIndex, valueIndex, value) => {
            const updated = [...samples];
            updated[sampleIndex] = {
                ...updated[sampleIndex],
                values: [...(updated[sampleIndex].values || [])]
            };
            updated[sampleIndex].values[valueIndex] = parseFloat(value) || 0;
            commit(updated);
        };

        const updateAttr = (index, field, value) => {
            const updated = [...samples];
            updated[index] = { ...updated[index], [field]: parseFloat(value) || 0 };
            commit(updated);
        };

        const removeSample = (index) => {
            commit(samples.filter((_, i) => i !== index));
        };

        const handleFile = (text, file) => {
            const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
            if (lines.length === 0) return;

            let start = 0;
            const firstCells = splitCsvLine(lines[0]);
            if (firstCells.every(c => isNaN(parseFloat(c)))) start = 1;

            const parsed = [];
            for (let i = start; i < lines.length; i++) {
                const nums = splitCsvLine(lines[i]).map(c => parseFloat(c)).filter(v => !isNaN(v));
                if (nums.length === 0) continue;
                if (chartKind === 'p' || chartKind === 'np') {
                    parsed.push({ id: Date.now() + i, defects: nums[0], sampleSize: nums[1] || 50, label: `S${parsed.length + 1}` });
                } else if (chartKind === 'c') {
                    parsed.push({ id: Date.now() + i, count: nums[0], label: `S${parsed.length + 1}` });
                } else if (chartKind === 'u') {
                    parsed.push({ id: Date.now() + i, count: nums[0], area: nums[1] || 1, label: `S${parsed.length + 1}` });
                } else {
                    parsed.push({ id: Date.now() + i, values: nums, timestamp: '' });
                }
            }

            if (parsed.length === 0) return;
            if (!isAttribute) setSampleSize(parsed[0].values?.length || 5);
            setFileMeta({ name: file.name, count: parsed.length });
            commit(parsed);
            setInputMethod('manual');
        };

        const hintByKind = {
            'i-mr': '형식: 각 줄 1개 값 (개별값)',
            xbar: '형식: 각 줄이 하나의 서브그룹. 예) 10.1,10.2,10.3,10.4,10.5',
            'xbar-r': '형식: 각 줄이 하나의 서브그룹 (X-bar와 R 동시)',
            p: '형식: defects,n 예) 3,50',
            np: '형식: defects,n 예) 3,50',
            c: '형식: count 예) 4',
            u: '형식: count,area 예) 4,2.5'
        };

        return (
            <div>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontWeight: 600, fontSize: '0.9rem', marginRight: 8 }}>관리도 유형</label>
                    <select
                        value={chartKind}
                        onChange={(e) => changeKind(e.target.value)}
                        style={{ padding: '0.4rem 0.6rem', borderRadius: 8, border: '1px solid #cbd5e1' }}
                    >
                        <option value="i-mr">I-MR (개별값)</option>
                        <option value="xbar">X-bar</option>
                        <option value="xbar-r">X-bar / R</option>
                        <option value="p">p (불량률)</option>
                        <option value="np">np (불량개수)</option>
                        <option value="c">c (결점수)</option>
                        <option value="u">u (단위당 결점)</option>
                    </select>
                </div>
                <MethodToggle />
                {inputMethod === 'file' ? (
                    <FileUploadZone
                        accept=".csv,.txt,.tsv"
                        hint={hintByKind[chartKind] || hintByKind.xbar}
                        onFileLoaded={handleFile}
                        fileMeta={fileMeta}
                    />
                ) : (
                    <>
                        {!isAttribute && (
                            <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <label>
                                    샘플 크기 (n):
                                    <input
                                        type="number"
                                        value={sampleSize}
                                        onChange={(e) => setSampleSize(parseInt(e.target.value) || 5)}
                                        min="1"
                                        max="10"
                                        style={{ marginLeft: '0.5rem', width: '80px' }}
                                    />
                                </label>
                                <button className="btn-primary" onClick={addSample}>
                                    <Plus size={16} /> 샘플 추가
                                </button>
                            </div>
                        )}
                        {isAttribute && (
                            <div style={{ marginBottom: '1rem' }}>
                                <button className="btn-primary" onClick={addSample}>
                                    <Plus size={16} /> 샘플 추가
                                </button>
                                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 6 }}>{hintByKind[chartKind]}</div>
                            </div>
                        )}

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
                                {(chartKind === 'p' || chartKind === 'np') && (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                        <input type="number" value={sample.defects ?? 0}
                                            onChange={(e) => updateAttr(sIndex, 'defects', e.target.value)}
                                            placeholder="불량 수" style={{ padding: '0.5rem' }} />
                                        <input type="number" value={sample.sampleSize ?? 50}
                                            onChange={(e) => updateAttr(sIndex, 'sampleSize', e.target.value)}
                                            placeholder="검사 수(n)" style={{ padding: '0.5rem' }} />
                                    </div>
                                )}
                                {chartKind === 'c' && (
                                    <input type="number" value={sample.count ?? 0}
                                        onChange={(e) => updateAttr(sIndex, 'count', e.target.value)}
                                        placeholder="결점 수(c)" style={{ padding: '0.5rem', width: '100%' }} />
                                )}
                                {chartKind === 'u' && (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                        <input type="number" value={sample.count ?? 0}
                                            onChange={(e) => updateAttr(sIndex, 'count', e.target.value)}
                                            placeholder="결점 수" style={{ padding: '0.5rem' }} />
                                        <input type="number" step="0.01" value={sample.area ?? 1}
                                            onChange={(e) => updateAttr(sIndex, 'area', e.target.value)}
                                            placeholder="검사 단위(area)" style={{ padding: '0.5rem' }} />
                                    </div>
                                )}
                                {!isAttribute && (
                                    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.max((sample.values || []).length, 1)}, 1fr)`, gap: '0.5rem' }}>
                                        {(sample.values || []).map((val, vIndex) => (
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
                                )}
                            </div>
                        ))}
                    </>
                )}
            </div>
        );
    };

    // Histogram 데이터 입력
    const HistogramInput = () => {
        const [rawData, setRawData] = useState(initialData?.rawData?.join(', ') || '');
        const [lsl, setLsl] = useState(initialData?.lsl ?? '');
        const [usl, setUsl] = useState(initialData?.usl ?? '');
        const [binCount, setBinCount] = useState(initialData?.binCount || 10);
        const [csvPreview, setCsvPreview] = useState(null);

        const commit = (text, nextLsl = lsl, nextUsl = usl, nextBin = binCount) => {
            const dataArray = parseNumberList(text);
            onDataChange({
                rawData: dataArray,
                lsl: nextLsl !== '' && nextLsl != null ? parseFloat(nextLsl) : null,
                usl: nextUsl !== '' && nextUsl != null ? parseFloat(nextUsl) : null,
                binCount: nextBin
            });
        };

        const handleDataChange = () => commit(rawData);

        const applyColumn = (colIdx, preview) => {
            const vals = preview.rows
                .map(r => parseFloat(String(r[colIdx] ?? '').replace(/,/g, '')))
                .filter(n => !isNaN(n));
            const joined = vals.join(', ');
            setRawData(joined);
            setFileMeta({ name: preview.fileName, count: vals.length });
            commit(joined);
            setCsvPreview(null);
            setInputMethod('manual');
        };

        const handleFile = (text, file) => {
            const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
            if (!lines.length) return;
            const firstCells = splitCsvLine(lines[0]);
            const firstIsHeader = firstCells.some(c => c !== '' && isNaN(parseFloat(String(c).replace(/,/g, ''))));

            if (firstCells.length > 1) {
                const headers = firstIsHeader
                    ? firstCells.map((h, i) => h || `열 ${i + 1}`)
                    : firstCells.map((_, i) => `열 ${i + 1}`);
                const dataLines = firstIsHeader ? lines.slice(1) : lines;
                setCsvPreview({ headers, rows: dataLines.map(l => splitCsvLine(l)), fileName: file.name });
                setFileMeta({ name: file.name, count: dataLines.length });
                return;
            }

            let body = text;
            if (firstIsHeader) body = lines.slice(1).join('\n');
            const nums = parseNumberList(body);
            const joined = nums.join(', ');
            setRawData(joined);
            setFileMeta({ name: file.name, count: nums.length });
            commit(joined);
            setInputMethod('manual');
        };

        return (
            <div>
                <MethodToggle />
                {inputMethod === 'file' ? (
                    <>
                        <FileUploadZone
                            accept=".csv,.txt,.tsv"
                            hint="엑셀은 CSV로 저장 후 업로드하세요. 여러 열이면 숫자 열을 선택할 수 있습니다."
                            onFileLoaded={handleFile}
                            fileMeta={fileMeta}
                        />
                        {csvPreview && (
                            <div style={{
                                marginTop: '1rem', padding: '1rem', borderRadius: 10,
                                border: '1px solid #bfdbfe', background: '#eff6ff'
                            }}>
                                <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#1e40af' }}>
                                    어떤 열의 숫자를 쓸까요?
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {csvPreview.headers.map((h, i) => (
                                        <button key={i} type="button" className="btn-primary"
                                            style={{ padding: '0.4rem 0.75rem' }}
                                            onClick={() => applyColumn(i, csvPreview)}>
                                            {h}
                                        </button>
                                    ))}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 8 }}>
                                    {csvPreview.rows.length}행 · 샘플: {(csvPreview.rows[0] || []).slice(0, 4).join(', ')}
                                </div>
                            </div>
                        )}
                        <a href="/samples/histogram_sample.csv" download
                            style={{ display: 'inline-block', marginTop: 10, fontSize: '0.8rem', color: '#2563eb' }}>
                            샘플 CSV 받기
                        </a>
                    </>
                ) : (
                    <>
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
                            {rawData && (
                                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.35rem' }}>
                                    현재 {parseNumberList(rawData).length}개 값
                                </div>
                            )}
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
                    </>
                )}
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

        const commit = (text, xl = xLabel, yl = yLabel) => {
            const dataArray = text.split(/\r?\n/)
                .map(line => line.trim())
                .filter(Boolean)
                .map(line => {
                    const cells = splitCsvLine(line);
                    return { x: parseFloat(cells[0]), y: parseFloat(cells[1]) };
                })
                .filter(d => !isNaN(d.x) && !isNaN(d.y));

            onDataChange({ data: dataArray, xLabel: xl, yLabel: yl });
        };

        const handleDataChange = () => commit(dataText);

        const handleFile = (text, file) => {
            const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
            let start = 0;
            if (lines.length > 0) {
                const cells = splitCsvLine(lines[0]);
                if (isNaN(parseFloat(cells[0])) || isNaN(parseFloat(cells[1]))) {
                    // 헤더에서 레이블 추정
                    if (cells[0]) setXLabel(cells[0]);
                    if (cells[1]) setYLabel(cells[1]);
                    start = 1;
                }
            }
            const body = lines.slice(start).join('\n');
            const count = body.split(/\r?\n/).filter(l => {
                const c = splitCsvLine(l);
                return !isNaN(parseFloat(c[0])) && !isNaN(parseFloat(c[1]));
            }).length;
            setDataText(body);
            setFileMeta({ name: file.name, count });
            commit(body, start === 1 ? (splitCsvLine(lines[0])[0] || xLabel) : xLabel, start === 1 ? (splitCsvLine(lines[0])[1] || yLabel) : yLabel);
            setInputMethod('manual');
        };

        return (
            <div>
                <MethodToggle />
                {inputMethod === 'file' ? (
                    <FileUploadZone
                        accept=".csv,.txt,.tsv"
                        hint="형식: 각 줄에 X, Y. 예) 245, 5.1 — 첫 줄 헤더(온도,불량률) 가능"
                        onFileLoaded={handleFile}
                        fileMeta={fileMeta}
                    />
                ) : (
                    <>
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
                                placeholder={"25, 2.1\n30, 3.5\n35, 4.2"}
                                rows={6}
                                style={{ width: '100%', padding: '0.5rem', fontFamily: 'monospace' }}
                            />
                        </div>
                    </>
                )}
            </div>
        );
    };

    // Box Plot 데이터 입력
    const BoxPlotInput = () => {
        const [groups, setGroups] = useState(() => {
            if (!initialData?.groups) return [];
            return initialData.groups.map((g, i) => ({
                id: g.id || Date.now() + i,
                name: g.name || `Group ${i + 1}`,
                data: Array.isArray(g.data) ? g.data : (Array.isArray(g.values) ? g.values : [])
            }));
        });

        const commit = (updated) => {
            setGroups(updated);
            onDataChange({ groups: updated });
        };

        const addGroup = () => {
            commit([...groups, {
                id: Date.now(),
                name: `Group ${groups.length + 1}`,
                data: []
            }]);
        };

        const updateGroup = (index, field, value) => {
            const updated = [...groups];
            if (field === 'data') {
                updated[index] = {
                    ...updated[index],
                    data: parseNumberList(value)
                };
            } else {
                updated[index] = { ...updated[index], [field]: value };
            }
            commit(updated);
        };

        const removeGroup = (index) => {
            commit(groups.filter((_, i) => i !== index));
        };

        const handleFile = (text, file) => {
            const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
            if (lines.length === 0) return;

            const firstCells = splitCsvLine(lines[0]);
            const looksLikeHeader = firstCells.some(c => isNaN(parseFloat(c)) && c !== '');

            let parsed = [];
            if (looksLikeHeader && firstCells.length > 1) {
                // 열 = 그룹 (헤더가 그룹명)
                const headers = firstCells;
                const cols = headers.map(() => []);
                for (let i = 1; i < lines.length; i++) {
                    const cells = splitCsvLine(lines[i]);
                    cells.forEach((c, idx) => {
                        const n = parseFloat(c);
                        if (!isNaN(n) && idx < cols.length) cols[idx].push(n);
                    });
                }
                parsed = headers.map((name, i) => ({
                    id: Date.now() + i,
                    name: name || `Group ${i + 1}`,
                    data: cols[i]
                })).filter(g => g.data.length > 0);
            } else {
                // 행 형식: 그룹명, v1, v2, ...
                parsed = lines.map((line, i) => {
                    const cells = splitCsvLine(line);
                    const maybeName = cells[0];
                    const startIdx = isNaN(parseFloat(maybeName)) ? 1 : 0;
                    const name = startIdx === 1 ? maybeName : `Group ${i + 1}`;
                    const data = cells.slice(startIdx).map(c => parseFloat(c)).filter(v => !isNaN(v));
                    return { id: Date.now() + i, name, data };
                }).filter(g => g.data.length > 0);
            }

            if (parsed.length === 0) return;
            setFileMeta({ name: file.name, count: parsed.reduce((s, g) => s + g.data.length, 0) });
            commit(parsed);
            setInputMethod('manual');
        };

        return (
            <div>
                <MethodToggle />
                {inputMethod === 'file' ? (
                    <FileUploadZone
                        accept=".csv,.txt,.tsv"
                        hint="형식 A) 헤더=그룹명, 열별 값 / 형식 B) 각 줄: 그룹명, 값1, 값2, …"
                        onFileLoaded={handleFile}
                        fileMeta={fileMeta}
                    />
                ) : (
                    <>
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
                                    value={(group.data || []).join(', ')}
                                    onChange={(e) => updateGroup(index, 'data', e.target.value)}
                                    placeholder="데이터를 쉼표로 구분: 10.1, 10.2, 10.3, ..."
                                    rows={2}
                                    style={{ width: '100%', padding: '0.5rem', fontFamily: 'monospace' }}
                                />
                            </div>
                        ))}
                    </>
                )}
            </div>
        );
    };

    // Run Chart 데이터 입력
    const RunChartInput = () => {
        const [dataText, setDataText] = useState(
            initialData?.data?.map(d => `${d.label || d.date || d.day || ''}, ${d.value}`).join('\n') || ''
        );

        const commit = (text) => {
            const dataArray = text.split(/\r?\n/)
                .map(line => line.trim())
                .filter(Boolean)
                .map(line => {
                    const cells = splitCsvLine(line);
                    if (cells.length < 2) return null;
                    return { label: cells[0], day: cells[0], value: parseFloat(cells[1]) };
                })
                .filter(d => d && d.label && !isNaN(d.value));

            onDataChange({ data: dataArray });
        };

        const handleDataChange = () => commit(dataText);

        const handleFile = (text, file) => {
            const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
            let start = 0;
            if (lines.length > 0) {
                const cells = splitCsvLine(lines[0]);
                if (isNaN(parseFloat(cells[1]))) start = 1;
            }
            const body = lines.slice(start).join('\n');
            const count = body.split(/\r?\n/).filter(Boolean).length;
            setDataText(body);
            setFileMeta({ name: file.name, count });
            commit(body);
            setInputMethod('manual');
        };

        return (
            <div>
                <MethodToggle />
                {inputMethod === 'file' ? (
                    <FileUploadZone
                        accept=".csv,.txt,.tsv"
                        hint="형식: 각 줄에 레이블, 값. 예) Day1, 15.2"
                        onFileLoaded={handleFile}
                        fileMeta={fileMeta}
                    />
                ) : (
                    <>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                            데이터 (각 줄에 레이블, 값):
                        </label>
                        <textarea
                            value={dataText}
                            onChange={(e) => setDataText(e.target.value)}
                            onBlur={handleDataChange}
                            placeholder={"2026-01-01, 10.2\n2026-01-02, 10.5\n2026-01-03, 10.3"}
                            rows={8}
                            style={{ width: '100%', padding: '0.5rem', fontFamily: 'monospace' }}
                        />
                    </>
                )}
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
