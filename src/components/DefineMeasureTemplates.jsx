import React, { useMemo, useState } from 'react';
import { CheckCircle, Plus, Trash2, MessageSquare, Ruler, Lightbulb } from 'lucide-react';
import { getVocCtqTemplates, getMsaTemplates, getSolutionTemplates } from '../data/defineMeasureTemplates';

const TemplatePicker = ({ templates, selectedId, onSelect, industryLabel, accent = '#2563eb' }) => (
  <div style={{ marginBottom: '1.25rem' }}>
    <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>기본 템플릿 선택</div>
    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
      {industryLabel ? `${industryLabel} 맞춤` : '업종별'} 템플릿을 고른 뒤 수정하세요.
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
      {templates.map(tpl => {
        const active = selectedId === tpl.id;
        return (
          <button key={tpl.id} type="button" onClick={() => onSelect(tpl)} style={{
            textAlign: 'left', padding: '0.9rem', borderRadius: '12px', cursor: 'pointer',
            border: active ? `2px solid ${accent}` : '1px solid #e2e8f0',
            background: active ? '#f8fafc' : 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
              <strong style={{ fontSize: '0.9rem' }}>{tpl.name}</strong>
              {active && <CheckCircle size={16} color={accent} />}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.3rem' }}>{tpl.desc || ''}</div>
          </button>
        );
      })}
    </div>
  </div>
);

const inputStyle = { width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' };

export const VocCtqEditor = ({ industryId, industryName, value, onChange }) => {
  const templates = useMemo(() => getVocCtqTemplates(industryId), [industryId]);
  const [selectedId, setSelectedId] = useState(value?.templateId || null);
  const data = value || { vocItems: [], ctqItems: [] };

  const apply = (tpl) => {
    setSelectedId(tpl.id);
    onChange({
      templateId: tpl.id,
      templateName: tpl.name,
      vocItems: tpl.vocItems.map(v => ({ ...v })),
      ctqItems: tpl.ctqItems.map(c => ({ ...c }))
    });
  };

  const patch = (fields) => onChange({ ...data, templateId: selectedId, ...fields });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <MessageSquare size={18} /> <strong>VOC & CTQ</strong>
      </div>
      <TemplatePicker templates={templates} selectedId={selectedId} onSelect={apply} industryLabel={industryName} />

      <h4 style={{ margin: '0 0 0.5rem' }}>고객 요구사항 (VOC)</h4>
      {(data.vocItems || []).map((row, idx) => (
        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 80px 36px', gap: '0.4rem', marginBottom: '0.45rem' }}>
          <input style={inputStyle} placeholder="고객의 목소리" value={row.voice || ''}
            onChange={e => {
              const vocItems = [...data.vocItems]; vocItems[idx] = { ...row, voice: e.target.value }; patch({ vocItems });
            }} />
          <input style={inputStyle} placeholder="고객/이해관계자" value={row.customer || ''}
            onChange={e => {
              const vocItems = [...data.vocItems]; vocItems[idx] = { ...row, customer: e.target.value }; patch({ vocItems });
            }} />
          <select style={inputStyle} value={row.priority || '중'}
            onChange={e => {
              const vocItems = [...data.vocItems]; vocItems[idx] = { ...row, priority: e.target.value }; patch({ vocItems });
            }}>
            <option>상</option><option>중</option><option>하</option>
          </select>
          <button type="button" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
            onClick={() => patch({ vocItems: data.vocItems.filter((_, i) => i !== idx) })}><Trash2 size={16} /></button>
        </div>
      ))}
      <button type="button" className="btn-primary" style={{ marginBottom: '1.25rem' }}
        onClick={() => patch({ vocItems: [...(data.vocItems || []), { voice: '', customer: '', priority: '중' }] })}>
        <Plus size={14} /> VOC 추가
      </button>

      <h4 style={{ margin: '0 0 0.5rem' }}>핵심 품질 특성 (CTQ)</h4>
      {(data.ctqItems || []).map((row, idx) => (
        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.4fr 90px 36px', gap: '0.4rem', marginBottom: '0.45rem' }}>
          <input style={inputStyle} placeholder="CTQ" value={row.ctq || ''}
            onChange={e => {
              const ctqItems = [...data.ctqItems]; ctqItems[idx] = { ...row, ctq: e.target.value }; patch({ ctqItems });
            }} />
          <input style={inputStyle} placeholder="규격/목표" value={row.spec || ''}
            onChange={e => {
              const ctqItems = [...data.ctqItems]; ctqItems[idx] = { ...row, spec: e.target.value }; patch({ ctqItems });
            }} />
          <input style={inputStyle} type="number" placeholder="가중치" value={row.weight ?? ''}
            onChange={e => {
              const ctqItems = [...data.ctqItems]; ctqItems[idx] = { ...row, weight: Number(e.target.value) }; patch({ ctqItems });
            }} />
          <button type="button" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
            onClick={() => patch({ ctqItems: data.ctqItems.filter((_, i) => i !== idx) })}><Trash2 size={16} /></button>
        </div>
      ))}
      <button type="button" className="btn-primary"
        onClick={() => patch({ ctqItems: [...(data.ctqItems || []), { ctq: '', spec: '', weight: 0 }] })}>
        <Plus size={14} /> CTQ 추가
      </button>
    </div>
  );
};

export const MsaEditor = ({ industryId, industryName, value, onChange }) => {
  const templates = useMemo(() => getMsaTemplates(industryId), [industryId]);
  const [selectedId, setSelectedId] = useState(value?.templateId || null);
  const data = value || {};

  const apply = (tpl) => {
    setSelectedId(tpl.id);
    onChange({
      templateId: tpl.id,
      templateName: tpl.name,
      method: tpl.method,
      parts: tpl.parts,
      operators: tpl.operators,
      replicates: tpl.replicates,
      acceptance: tpl.acceptance,
      checklist: [...tpl.checklist],
      result: tpl.result
    });
  };

  const patch = (fields) => onChange({ ...data, templateId: selectedId, ...fields });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <Ruler size={18} /> <strong>측정시스템 분석 (MSA)</strong>
      </div>
      <TemplatePicker templates={templates} selectedId={selectedId} onSelect={apply} industryLabel={industryName} accent="#0369a1" />

      {data.method && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr repeat(3, 1fr)', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#64748b' }}>방법</label>
              <input style={inputStyle} value={data.method || ''} onChange={e => patch({ method: e.target.value })} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Parts</label>
              <input style={inputStyle} type="number" value={data.parts ?? ''} onChange={e => patch({ parts: Number(e.target.value) })} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Operators</label>
              <input style={inputStyle} type="number" value={data.operators ?? ''} onChange={e => patch({ operators: Number(e.target.value) })} />
            </div>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#64748b' }}>Replicates</label>
              <input style={inputStyle} type="number" value={data.replicates ?? ''} onChange={e => patch({ replicates: Number(e.target.value) })} />
            </div>
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#64748b' }}>판정 기준</label>
            <textarea style={inputStyle} rows={2} value={data.acceptance || ''} onChange={e => patch({ acceptance: e.target.value })} />
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ fontSize: '0.8rem', color: '#64748b' }}>체크리스트 (줄바꿈)</label>
            <textarea style={inputStyle} rows={4} value={(data.checklist || []).join('\n')}
              onChange={e => patch({ checklist: e.target.value.split('\n').filter(Boolean) })} />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#64748b' }}>분석 결과</label>
            <textarea style={inputStyle} rows={3} value={data.result || ''} onChange={e => patch({ result: e.target.value })} />
          </div>
        </>
      )}
    </div>
  );
};

export const SolutionsEditor = ({ industryId, industryName, value, onChange }) => {
  const templates = useMemo(() => getSolutionTemplates(industryId), [industryId]);
  const [selectedId, setSelectedId] = useState(null);
  const solutions = value || [];

  const apply = (tpl) => {
    setSelectedId(tpl.id);
    onChange(tpl.solutions.map(s => ({ ...s })));
  };

  const update = (idx, field, val) => {
    const next = solutions.map((s, i) => i === idx ? { ...s, [field]: val } : s);
    onChange(next);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <Lightbulb size={18} /> <strong>해결안 선정</strong>
      </div>
      <TemplatePicker templates={templates} selectedId={selectedId} onSelect={apply} industryLabel={industryName} accent="#ca8a04" />

      {solutions.map((sol, idx) => (
        <div key={idx} style={{
          border: `1px solid ${sol.isSelected ? '#bae6fd' : '#e2e8f0'}`,
          background: sol.isSelected ? '#f0f9ff' : 'white',
          borderRadius: '10px', padding: '1rem', marginBottom: '0.75rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input style={inputStyle} placeholder="원인" value={sol.cause || ''} onChange={e => update(idx, 'cause', e.target.value)} />
            <input style={inputStyle} placeholder="개선안" value={sol.solution || ''} onChange={e => update(idx, 'solution', e.target.value)} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 90px 90px 36px', gap: '0.4rem', alignItems: 'center' }}>
            <input style={inputStyle} placeholder="유형" value={sol.type || ''} onChange={e => update(idx, 'type', e.target.value)} />
            <input style={inputStyle} placeholder="비용" value={sol.cost || ''} onChange={e => update(idx, 'cost', e.target.value)} />
            <input style={inputStyle} placeholder="기간" value={sol.period || ''} onChange={e => update(idx, 'period', e.target.value)} />
            <input style={inputStyle} type="number" placeholder="점수" value={sol.score ?? ''} onChange={e => update(idx, 'score', Number(e.target.value))} />
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}>
              <input type="checkbox" checked={!!sol.isSelected} onChange={e => update(idx, 'isSelected', e.target.checked)} /> 채택
            </label>
            <button type="button" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
              onClick={() => onChange(solutions.filter((_, i) => i !== idx))}><Trash2 size={16} /></button>
          </div>
        </div>
      ))}

      <button type="button" className="btn-primary"
        onClick={() => onChange([...solutions, { cause: '', solution: '', type: '', cost: '', period: '', score: 70, isSelected: false }])}>
        <Plus size={14} /> 개선안 추가
      </button>
    </div>
  );
};
