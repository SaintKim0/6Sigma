import React, { useState, useEffect, useMemo } from 'react';
import { AlertTriangle, Plus, Trash2, CheckCircle } from 'lucide-react';
import { getFmeaTemplates } from '../data/defineAnalyzeTemplates';

/**
 * FMEA (Failure Mode and Effects Analysis) Component
 * Provides a structured table for risk assessment and RPN calculation.
 */
const FMEA = ({ data, onUpdate, industryId, industryName }) => {
    const [items, setItems] = useState(data || []);
    const [selectedTpl, setSelectedTpl] = useState(null);
    const templates = useMemo(() => getFmeaTemplates(industryId), [industryId]);

    // Initialize with one row if empty
    useEffect(() => {
        if (!data || data.length === 0) {
            setItems([
                { id: Date.now(), process: '', failureMode: '', effect: '', cause: '', s: 1, o: 1, d: 1, rpn: 1, action: '' }
            ]);
        } else {
            setItems(data);
        }
    }, [data]);

    const applyTemplate = (tpl) => {
        setSelectedTpl(tpl.id);
        const updated = tpl.items.map((row, idx) => ({
            id: Date.now() + idx,
            process: row.process,
            failureMode: row.failureMode,
            effect: row.effect,
            cause: row.cause,
            s: row.s,
            o: row.o,
            d: row.d,
            rpn: row.s * row.o * row.d,
            action: row.action
        }));
        setItems(updated);
        onUpdate(updated);
    };

    const handleCreate = () => {
        const newItem = {
            id: Date.now(),
            process: '',
            failureMode: '',
            effect: '',
            cause: '',
            s: 3, o: 3, d: 3,
            rpn: 27,
            action: ''
        };
        const updated = [...items, newItem];
        setItems(updated);
        onUpdate(updated);
    };

    const handleDelete = (id) => {
        if (items.length > 1) {
            const updated = items.filter(i => i.id !== id);
            setItems(updated);
            onUpdate(updated);
        } else {
            alert('최소 1개의 항목은 유지해야 합니다.');
        }
    };

    const handleChange = (id, field, value) => {
        const updated = items.map(item => {
            if (item.id === id) {
                const newItem = { ...item, [field]: value };
                // Recalculate RPN if S, O, D changes
                if (['s', 'o', 'd'].includes(field)) {
                    const s = field === 's' ? Number(value) : item.s;
                    const o = field === 'o' ? Number(value) : item.o;
                    const d = field === 'd' ? Number(value) : item.d;
                    newItem.rpn = s * o * d;
                }
                return newItem;
            }
            return item;
        });
        setItems(updated);
        onUpdate(updated);
    };

    const getRiskLevel = (rpn) => {
        if (rpn >= 100) return { color: '#ef4444', label: 'High' }; // Red
        if (rpn >= 50) return { color: '#f59e0b', label: 'Med' };   // Orange
        return { color: '#10b981', label: 'Low' };                  // Green
    };

    return (
        <div className="fmea-container" style={{ marginTop: '1rem' }}>
            <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>업종 FMEA 템플릿</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
                    {industryName ? `${industryName} 맞춤` : '업종별'} 템플릿을 선택한 뒤 수정하세요.
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                    {templates.map(tpl => {
                        const active = selectedTpl === tpl.id;
                        return (
                            <button key={tpl.id} type="button" onClick={() => applyTemplate(tpl)} style={{
                                textAlign: 'left', padding: '0.9rem', borderRadius: '12px', cursor: 'pointer',
                                border: active ? '2px solid #f59e0b' : '1px solid #e2e8f0',
                                background: active ? '#fffbeb' : 'white'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
                                    <strong style={{ fontSize: '0.9rem' }}>{tpl.name}</strong>
                                    {active && <CheckCircle size={16} color="#f59e0b" />}
                                </div>
                                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.3rem' }}>{tpl.desc}</div>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertTriangle size={20} color="#f59e0b" />
                    FMEA (고장 유형 및 영향 분석)
                </h3>
                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                    RPN = 심각도(S) × 발생도(O) × 검출도(D)
                </div>
            </div>

            <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', minWidth: '1000px' }}>
                    <thead style={{ backgroundColor: '#f8fafc', color: '#475569' }}>
                        <tr>
                            <th style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0', textAlign: 'left', width: '15%' }}>공정/기능</th>
                            <th style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0', textAlign: 'left', width: '15%' }}>고장 유형 (Failure Mode)</th>
                            <th style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0', textAlign: 'left', width: '15%' }}>영향 (Effect)</th>
                            <th style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0', textAlign: 'left', width: '15%' }}>원인 (Cause)</th>
                            <th style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0', textAlign: 'center', width: '50px' }} title="Severity (심각도)">S</th>
                            <th style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0', textAlign: 'center', width: '50px' }} title="Occurrence (발생도)">O</th>
                            <th style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0', textAlign: 'center', width: '50px' }} title="Detection (검출도)">D</th>
                            <th style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0', textAlign: 'center', width: '60px', fontWeight: 'bold' }}>RPN</th>
                            <th style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>개선 대책 (Action)</th>
                            <th style={{ padding: '0.75rem', borderBottom: '1px solid #e2e8f0', width: '50px' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => {
                            const risk = getRiskLevel(item.rpn);
                            return (
                                <tr key={item.id} style={{ borderBottom: '1px solid #f1f5f9', backgroundColor: risk.label === 'High' ? '#fef2f2' : 'white' }}>
                                    <td style={{ padding: '0.5rem' }}>
                                        <input type="text" value={item.process} onChange={(e) => handleChange(item.id, 'process', e.target.value)}
                                            placeholder="공정 단계" style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px' }} />
                                    </td>
                                    <td style={{ padding: '0.5rem' }}>
                                        <input type="text" value={item.failureMode} onChange={(e) => handleChange(item.id, 'failureMode', e.target.value)}
                                            placeholder="잠재적 고장" style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px' }} />
                                    </td>
                                    <td style={{ padding: '0.5rem' }}>
                                        <input type="text" value={item.effect} onChange={(e) => handleChange(item.id, 'effect', e.target.value)}
                                            placeholder="고객 영향" style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px' }} />
                                    </td>
                                    <td style={{ padding: '0.5rem' }}>
                                        <input type="text" value={item.cause} onChange={(e) => handleChange(item.id, 'cause', e.target.value)}
                                            placeholder="발생 원인" style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px' }} />
                                    </td>
                                    {['s', 'o', 'd'].map(metric => (
                                        <td key={metric} style={{ padding: '0.5rem', textAlign: 'center' }}>
                                            <select
                                                value={item[metric]}
                                                onChange={(e) => handleChange(item.id, metric, e.target.value)}
                                                style={{ padding: '4px', borderRadius: '4px', border: '1px solid #cbd5e1', width: '100%', textAlign: 'center' }}
                                            >
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <option key={n} value={n}>{n}</option>)}
                                            </select>
                                        </td>
                                    ))}
                                    <td style={{ padding: '0.5rem', textAlign: 'center', fontWeight: 'bold', color: risk.color }}>
                                        {item.rpn}
                                    </td>
                                    <td style={{ padding: '0.5rem' }}>
                                        <input type="text" value={item.action} onChange={(e) => handleChange(item.id, 'action', e.target.value)}
                                            placeholder="대책 입력.." style={{ width: '100%', border: '1px solid #cbd5e1', borderRadius: '4px', padding: '4px' }} />
                                    </td>
                                    <td style={{ padding: '0.5rem', textAlign: 'center' }}>
                                        <button onClick={() => handleDelete(item.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <button
                onClick={handleCreate}
                style={{
                    marginTop: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: 'white',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    color: '#475569',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                }}
            >
                <Plus size={16} /> 항목 추가
            </button>

            {/* RPN Analysis Summary */}
            <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '0.9rem', color: '#64748b' }}>
                <strong style={{ color: '#475569' }}>💡 분석 가이드:</strong> RPN이 <span style={{ color: '#ef4444', fontWeight: 'bold' }}>100점 이상</span>인 항목은 반드시 개선 대책을 수립해야 합니다.
                (심각도 8점 이상인 경우에도 필수 관리)
            </div>
        </div>
    );
};

export default FMEA;
