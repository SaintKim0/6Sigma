import React, { useMemo, useState } from 'react';
import { CheckCircle, FlaskConical, Shield, Rocket, Plus, Trash2 } from 'lucide-react';
import { getDoeTemplates, getPilotTemplates, getPokaYokeTemplates } from '../data/improveTemplates';

const TemplatePicker = ({ templates, selectedId, onSelect, industryLabel }) => (
  <div style={{ marginBottom: '1.25rem' }}>
    <div style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>기본 템플릿 선택</div>
    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
      {industryLabel ? `${industryLabel} 맞춤` : '업종별'} 템플릿을 선택한 뒤 수정하세요.
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
      {templates.map(tpl => {
        const active = selectedId === tpl.id;
        return (
          <button
            key={tpl.id}
            type="button"
            onClick={() => onSelect(tpl)}
            style={{
              textAlign: 'left', padding: '1rem', borderRadius: '12px', cursor: 'pointer',
              border: active ? '2px solid #0d9488' : '1px solid #e2e8f0',
              background: active ? '#f0fdfa' : 'white'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
              <strong style={{ fontSize: '0.95rem', color: '#134e4a' }}>{tpl.name}</strong>
              {active && <CheckCircle size={16} color="#0d9488" />}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.35rem', lineHeight: 1.4 }}>{tpl.desc}</div>
          </button>
        );
      })}
    </div>
  </div>
);

const Field = ({ label, children }) => (
  <div style={{ marginBottom: '0.85rem' }}>
    <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', color: '#334155', marginBottom: '0.35rem' }}>{label}</label>
    {children}
  </div>
);

const inputStyle = { width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' };

export const DoeEditor = ({ industryId, industryName, value, onChange }) => {
  const templates = useMemo(() => getDoeTemplates(industryId), [industryId]);
  const [selectedId, setSelectedId] = useState(value?.templateId || null);
  const data = value || {};

  const apply = (tpl) => {
    setSelectedId(tpl.id);
    onChange({
      templateId: tpl.id,
      templateName: tpl.name,
      factors: tpl.factors.map(f => ({ ...f })),
      response: tpl.response,
      design: tpl.design,
      result: tpl.result
    });
  };

  const patch = (fields) => onChange({ ...data, templateId: selectedId, ...fields });

  const updateFactor = (idx, field, val) => {
    const factors = (data.factors || []).map((f, i) => i === idx ? { ...f, [field]: val } : f);
    patch({ factors });
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <FlaskConical size={18} color="#0f766e" />
        <strong>실험계획법 (DOE)</strong>
      </div>
      <TemplatePicker templates={templates} selectedId={selectedId} onSelect={apply} industryLabel={industryName} />

      {(data.factors || []).length > 0 && (
        <>
          <Field label="반응변수 (Y)">
            <input style={inputStyle} value={data.response || ''} onChange={e => patch({ response: e.target.value })} />
          </Field>
          <Field label="실험 설계">
            <input style={inputStyle} value={data.design || ''} onChange={e => patch({ design: e.target.value })} />
          </Field>
          <div style={{ fontWeight: 700, marginBottom: '0.5rem' }}>인자 (Factors)</div>
          {(data.factors || []).map((f, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 36px', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input style={inputStyle} placeholder="인자명" value={f.name} onChange={e => updateFactor(idx, 'name', e.target.value)} />
              <input style={inputStyle} placeholder="Low" value={f.low} onChange={e => updateFactor(idx, 'low', e.target.value)} />
              <input style={inputStyle} placeholder="High" value={f.high} onChange={e => updateFactor(idx, 'high', e.target.value)} />
              <button type="button" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                onClick={() => patch({ factors: (data.factors || []).filter((_, i) => i !== idx) })}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button type="button" className="btn-primary" style={{ marginBottom: '1rem' }}
            onClick={() => patch({ factors: [...(data.factors || []), { name: '', low: '', high: '' }] })}>
            <Plus size={14} /> 인자 추가
          </button>
          <Field label="실험 결과 / 결론">
            <textarea rows={4} style={inputStyle} value={data.result || ''} onChange={e => patch({ result: e.target.value })} />
          </Field>
        </>
      )}
    </div>
  );
};

export const PilotEditor = ({ industryId, industryName, value, onChange }) => {
  const templates = useMemo(() => getPilotTemplates(industryId), [industryId]);
  const [selectedId, setSelectedId] = useState(value?.templateId || null);
  const data = value || {};

  const apply = (tpl) => {
    setSelectedId(tpl.id);
    onChange({
      templateId: tpl.id,
      templateName: tpl.name,
      period: tpl.period,
      scope: tpl.scope,
      successCriteria: tpl.successCriteria,
      plan: [...tpl.plan],
      result: tpl.result
    });
  };

  const patch = (fields) => onChange({ ...data, templateId: selectedId, ...fields });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <Rocket size={18} color="#0369a1" />
        <strong>파일럿 / 검증 (Piloting)</strong>
      </div>
      <TemplatePicker templates={templates} selectedId={selectedId} onSelect={apply} industryLabel={industryName} />

      {data.period && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <Field label="기간"><input style={inputStyle} value={data.period || ''} onChange={e => patch({ period: e.target.value })} /></Field>
            <Field label="적용 범위"><input style={inputStyle} value={data.scope || ''} onChange={e => patch({ scope: e.target.value })} /></Field>
          </div>
          <Field label="성공 기준">
            <textarea rows={2} style={inputStyle} value={data.successCriteria || ''} onChange={e => patch({ successCriteria: e.target.value })} />
          </Field>
          <Field label="실행 계획 (줄바꿈으로 구분)">
            <textarea
              rows={4}
              style={inputStyle}
              value={(data.plan || []).join('\n')}
              onChange={e => patch({ plan: e.target.value.split('\n').filter(Boolean) })}
            />
          </Field>
          <Field label="파일럿 결과">
            <textarea rows={3} style={inputStyle} value={data.result || ''} onChange={e => patch({ result: e.target.value })} />
          </Field>
        </>
      )}
    </div>
  );
};

export const PokaYokeEditor = ({ industryId, industryName, value, onChange }) => {
  const templates = useMemo(() => getPokaYokeTemplates(industryId), [industryId]);
  const [selectedId, setSelectedId] = useState(value?.templateId || null);
  const data = value || {};
  const items = data.items || [];

  const apply = (tpl) => {
    setSelectedId(tpl.id);
    onChange({
      templateId: tpl.id,
      templateName: tpl.name,
      items: tpl.items.map(i => ({ ...i }))
    });
  };

  const updateItem = (idx, field, val) => {
    onChange({
      ...data,
      templateId: selectedId,
      items: items.map((row, i) => i === idx ? { ...row, [field]: val } : row)
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <Shield size={18} color="#b45309" />
        <strong>포카요케 (실수 방지)</strong>
      </div>
      <TemplatePicker templates={templates} selectedId={selectedId} onSelect={apply} industryLabel={industryName} />

      {items.length > 0 && (
        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', minWidth: 720 }}>
            <thead>
              <tr style={{ background: '#fff7ed', textAlign: 'left' }}>
                {['리스크(실수)', '장치/방법', '유형', '확인방법', ''].map(h => (
                  <th key={h} style={{ padding: '0.6rem', borderBottom: '1px solid #fed7aa' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((row, idx) => (
                <tr key={idx}>
                  {['risk', 'device', 'type', 'check'].map(field => (
                    <td key={field} style={{ padding: '0.35rem', borderBottom: '1px solid #f1f5f9' }}>
                      <textarea rows={2} value={row[field] || ''} onChange={e => updateItem(idx, field, e.target.value)}
                        style={{ ...inputStyle, minWidth: 110 }} />
                    </td>
                  ))}
                  <td style={{ padding: '0.35rem' }}>
                    <button type="button" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
                      onClick={() => onChange({ ...data, items: items.filter((_, i) => i !== idx) })}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: '0.75rem' }}>
            <button type="button" className="btn-primary"
              onClick={() => onChange({ ...data, items: [...items, { risk: '', device: '', type: '방지형', check: '' }] })}>
              <Plus size={14} /> 항목 추가
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
