import React, { useMemo, useState } from 'react';
import { Plus, Trash2, CheckCircle, FileText, ClipboardList } from 'lucide-react';
import {
  getControlPlanTemplates,
  getStandardWorkTemplates,
  emptyControlPlanItem,
  emptySopStep
} from '../data/controlTemplates';

const TemplatePicker = ({ templates, selectedId, onSelect, industryLabel }) => (
  <div style={{ marginBottom: '1.25rem' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem', gap: '1rem', flexWrap: 'wrap' }}>
      <div>
        <div style={{ fontWeight: 700, color: '#0f172a' }}>기본 템플릿 선택</div>
        <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
          {industryLabel ? `${industryLabel} 업종에 맞는 템플릿` : '업종별 기본 템플릿'}을 고른 뒤 내용을 수정하세요.
        </div>
      </div>
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
              textAlign: 'left',
              padding: '1rem',
              borderRadius: '12px',
              border: active ? '2px solid #2563eb' : '1px solid #e2e8f0',
              background: active ? '#eff6ff' : 'white',
              cursor: 'pointer',
              boxShadow: active ? '0 4px 12px rgba(37,99,235,0.12)' : 'none'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <strong style={{ color: '#1e293b', fontSize: '0.95rem' }}>{tpl.name}</strong>
              {active && <CheckCircle size={16} color="#2563eb" />}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4, marginBottom: '0.5rem' }}>{tpl.desc}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {(tpl.tags || []).map(tag => (
                <span key={tag} style={{
                  fontSize: '0.7rem', fontWeight: 700, color: '#4338ca',
                  background: '#eef2ff', padding: '0.15rem 0.45rem', borderRadius: '999px'
                }}>{tag}</span>
              ))}
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

/** 관리계획서 템플릿 편집기 */
export const ControlPlanEditor = ({
  industryId,
  industryName,
  value,
  onChange
}) => {
  const templates = useMemo(() => getControlPlanTemplates(industryId), [industryId]);
  const [selectedId, setSelectedId] = useState(value?.templateId || templates[0]?.id || null);
  const items = value?.items || [];

  const applyTemplate = (tpl) => {
    setSelectedId(tpl.id);
    onChange({
      templateId: tpl.id,
      templateName: tpl.name,
      items: tpl.items.map(row => ({ ...row }))
    });
  };

  const updateItem = (idx, field, val) => {
    const next = items.map((row, i) => i === idx ? { ...row, [field]: val } : row);
    onChange({ ...(value || {}), templateId: selectedId, items: next });
  };

  const addItem = () => {
    onChange({ ...(value || {}), templateId: selectedId, items: [...items, emptyControlPlanItem()] });
  };

  const removeItem = (idx) => {
    onChange({ ...(value || {}), templateId: selectedId, items: items.filter((_, i) => i !== idx) });
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#1e293b' }}>
        <ClipboardList size={18} />
        <strong>관리계획서 (Control Plan)</strong>
      </div>
      <p style={{ marginTop: 0, color: '#64748b', fontSize: '0.9rem' }}>
        무엇을·언제·어떻게 측정하고, 이탈 시 어떻게 대응할지 문서화합니다.
      </p>

      <TemplatePicker
        templates={templates}
        selectedId={selectedId}
        onSelect={applyTemplate}
        industryLabel={industryName}
      />

      {!items.length && (
        <div style={{
          padding: '1.5rem', textAlign: 'center', color: '#94a3b8',
          background: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1', marginBottom: '1rem'
        }}>
          위 템플릿을 선택하면 관리 항목이 자동으로 채워집니다.
        </div>
      )}

      {items.length > 0 && (
        <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', minWidth: 900 }}>
            <thead>
              <tr style={{ background: '#f1f5f9', textAlign: 'left' }}>
                {['공정', '관리특성', '규격/한계', '측정방법', '주기/샘플', '담당', '반응계획', ''].map(h => (
                  <th key={h} style={{ padding: '0.65rem 0.5rem', borderBottom: '1px solid #e2e8f0', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((row, idx) => (
                <tr key={idx}>
                  {['process', 'characteristic', 'spec', 'method', 'sample', 'owner', 'reaction'].map(field => (
                    <td key={field} style={{ padding: '0.35rem', borderBottom: '1px solid #f1f5f9', verticalAlign: 'top' }}>
                      <textarea
                        value={row[field] || ''}
                        onChange={(e) => updateItem(idx, field, e.target.value)}
                        rows={2}
                        style={{
                          width: '100%', minWidth: 90, padding: '0.4rem',
                          border: '1px solid #e2e8f0', borderRadius: '6px', resize: 'vertical', fontFamily: 'inherit'
                        }}
                      />
                    </td>
                  ))}
                  <td style={{ padding: '0.35rem', borderBottom: '1px solid #f1f5f9' }}>
                    <button type="button" onClick={() => removeItem(idx)} title="삭제"
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button type="button" className="btn-primary" onClick={addItem} style={{ marginTop: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
        <Plus size={16} /> 관리 항목 추가
      </button>
    </div>
  );
};

/** 표준작업(SOP) 템플릿 편집기 */
export const StandardWorkEditor = ({
  industryId,
  industryName,
  value,
  onChange
}) => {
  const templates = useMemo(() => getStandardWorkTemplates(industryId), [industryId]);
  const [selectedId, setSelectedId] = useState(value?.templateId || templates[0]?.id || null);
  const data = value || {};

  const applyTemplate = (tpl) => {
    setSelectedId(tpl.id);
    onChange({
      templateId: tpl.id,
      templateName: tpl.name,
      title: tpl.title,
      purpose: tpl.purpose,
      scope: tpl.scope,
      safety: tpl.safety,
      steps: tpl.steps.map(s => ({ ...s })),
      training: tpl.training
    });
  };

  const patch = (fields) => onChange({ ...data, templateId: selectedId, ...fields });

  const updateStep = (idx, field, val) => {
    const steps = (data.steps || []).map((s, i) => i === idx ? { ...s, [field]: val } : s);
    patch({ steps });
  };

  const addStep = () => {
    const steps = [...(data.steps || []), emptySopStep((data.steps?.length || 0) + 1)];
    patch({ steps });
  };

  const removeStep = (idx) => {
    const steps = (data.steps || []).filter((_, i) => i !== idx).map((s, i) => ({ ...s, step: i + 1 }));
    patch({ steps });
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#1e293b' }}>
        <FileText size={18} />
        <strong>표준작업 문서화 (SOP)</strong>
      </div>
      <p style={{ marginTop: 0, color: '#64748b', fontSize: '0.9rem' }}>
        개선된 작업 방법을 표준 절차로 고정하고 교육합니다.
      </p>

      <TemplatePicker
        templates={templates}
        selectedId={selectedId}
        onSelect={applyTemplate}
        industryLabel={industryName}
      />

      {!data.title && !(data.steps || []).length && (
        <div style={{
          padding: '1.5rem', textAlign: 'center', color: '#94a3b8',
          background: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1'
        }}>
          위 템플릿을 선택하면 SOP 초안이 자동으로 채워집니다.
        </div>
      )}

      {(data.title || (data.steps || []).length > 0) && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {[
            { key: 'title', label: '문서 제목' },
            { key: 'purpose', label: '목적', rows: 2 },
            { key: 'scope', label: '적용 범위', rows: 2 },
            { key: 'safety', label: '안전/주의사항', rows: 2 }
          ].map(field => (
            <div key={field.key}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem', color: '#334155' }}>
                {field.label}
              </label>
              {field.rows ? (
                <textarea
                  rows={field.rows}
                  value={data[field.key] || ''}
                  onChange={(e) => patch({ [field.key]: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                />
              ) : (
                <input
                  type="text"
                  value={data[field.key] || ''}
                  onChange={(e) => patch({ [field.key]: e.target.value })}
                  style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
              )}
            </div>
          ))}

          <div>
            <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#1e293b' }}>작업 절차</div>
            {(data.steps || []).map((s, idx) => (
              <div key={idx} style={{
                display: 'grid',
                gridTemplateColumns: '48px 1fr 1.4fr 36px',
                gap: '0.5rem',
                marginBottom: '0.5rem',
                alignItems: 'start'
              }}>
                <div style={{
                  background: '#1e40af', color: 'white', borderRadius: '8px',
                  textAlign: 'center', padding: '0.55rem 0', fontWeight: 800, fontSize: '0.85rem'
                }}>
                  {s.step || idx + 1}
                </div>
                <input
                  placeholder="작업명"
                  value={s.action || ''}
                  onChange={(e) => updateStep(idx, 'action', e.target.value)}
                  style={{ padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1' }}
                />
                <textarea
                  placeholder="상세 내용"
                  rows={2}
                  value={s.detail || ''}
                  onChange={(e) => updateStep(idx, 'detail', e.target.value)}
                  style={{ padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
                />
                <button type="button" onClick={() => removeStep(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', marginTop: '0.4rem' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button type="button" className="btn-primary" onClick={addStep} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Plus size={16} /> 단계 추가
            </button>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem', color: '#334155' }}>
              교육/자격
            </label>
            <textarea
              rows={2}
              value={data.training || ''}
              onChange={(e) => patch({ training: e.target.value })}
              style={{ width: '100%', padding: '0.65rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
