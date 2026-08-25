import React, { useEffect, useMemo, useState } from 'react';
import { CheckCircle, FileText, Map, GitBranch, HelpCircle, PenTool, Plus, Trash2 } from 'lucide-react';
import {
  getCharterTemplates,
  getSipocTemplates,
  getFishboneTemplates,
  getWhy5Templates,
  getDesignSpecTemplates
} from '../data/defineAnalyzeTemplates';

const TemplatePicker = ({ templates, selectedId, onSelect, industryLabel, hint, accent = '#1e3a8a' }) => (
  <div style={{ marginBottom: '1.25rem' }}>
    <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>기본 템플릿 선택</div>
    <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.5rem' }}>
      {industryLabel ? `${industryLabel} 맞춤` : '업종별'} 템플릿을 고른 뒤 수정하세요. (클릭해야 내용이 채워집니다)
    </div>
    {hint && (
      <div style={{
        fontSize: '0.8rem', color: '#92400e', background: '#fffbeb', border: '1px solid #fcd34d',
        borderRadius: 8, padding: '0.55rem 0.75rem', marginBottom: '0.75rem', lineHeight: 1.45
      }}>
        {hint}
      </div>
    )}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
      {templates.map(tpl => {
        const active = selectedId === tpl.id;
        const recommended = tpl._recommended;
        return (
          <button key={tpl.id} type="button" onClick={() => onSelect(tpl)} style={{
            textAlign: 'left', padding: '0.9rem', borderRadius: '12px', cursor: 'pointer',
            border: active ? `2px solid ${accent}` : recommended ? `2px solid #f59e0b` : '1px solid #e2e8f0',
            background: active ? '#f8fafc' : recommended ? '#fffbeb' : 'white'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.5rem' }}>
              <strong style={{ fontSize: '0.9rem' }}>{tpl.name}</strong>
              {active && <CheckCircle size={16} color={accent} />}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.3rem' }}>{tpl.desc || ''}</div>
            {recommended && !active && (
              <div style={{ fontSize: '0.72rem', color: '#b45309', marginTop: '0.35rem', fontWeight: 600 }}>진단 내용과 잘 맞음</div>
            )}
          </button>
        );
      })}
    </div>
  </div>
);

const inputStyle = { width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontFamily: 'inherit' };

/** 헌장 필드만 채우는 픽커 (기존 A3 폼 위에 배치) */
export const CharterTemplatePicker = ({
  industryId,
  industryName,
  currentTitle,
  problemTypes = [],
  methodology,
  onApply
}) => {
  const templates = useMemo(() => {
    const list = getCharterTemplates(industryId, { problemTypes, methodology });
    const voc = problemTypes.some((p) => {
      const s = String(p).toLowerCase();
      return s.includes('complaint') || s.includes('voc') || s === 'customer_complaints';
    });
    const isDfss = String(methodology || '').toLowerCase() === 'dfss';
    return list.map((t) => {
      const tags = t.tags || [];
      const recommended =
        t.id !== 'blank_charter' &&
        ((voc && (tags.includes('voc') || tags.includes('complaint'))) ||
          (isDfss && !voc && tags.includes('dfss')));
      return { ...t, _recommended: recommended };
    });
  }, [industryId, problemTypes, methodology]);

  const matched = templates.find(t => t.projectTitle && t.projectTitle === currentTitle);
  const [selectedId, setSelectedId] = useState(matched?.id || null);

  useEffect(() => {
    const m = templates.find(t => t.projectTitle && t.projectTitle === currentTitle);
    setSelectedId(m?.id || null);
  }, [industryId, methodology, currentTitle, templates]);

  const hintParts = [];
  if (industryName) hintParts.push(`현재 업종: ${industryName}`);
  else hintParts.push('업종이 비어 있으면 제조 샘플이 보일 수 있습니다');
  hintParts.push('진단의 「고객불만」은 문제유형이라 헌장 샘플과 자동 연결되지 않습니다');
  if (String(methodology || '').toLowerCase() === 'dfss') {
    hintParts.push('DFSS면 「DFSS 신규 설계 헌장」 또는 「고객불만·VOC」 템플릿을 고르세요');
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <FileText size={18} /> <strong>업종 헌장 템플릿</strong>
      </div>
      <TemplatePicker
        templates={templates}
        selectedId={selectedId}
        industryLabel={industryName}
        hint={hintParts.join(' · ')}
        onSelect={(tpl) => {
          setSelectedId(tpl.id);
          onApply({
            projectTitle: tpl.projectTitle,
            businessCase: tpl.businessCase,
            problemStatement: tpl.problemStatement,
            goal: tpl.goal,
            scopeIn: tpl.scopeIn,
            scopeOut: tpl.scopeOut,
            financialBenefits: tpl.financialBenefits
          });
        }}
      />
    </div>
  );
};

/** SIPOC 픽커 + 기존 박스와 함께 쓰거나, 값 적용만 */
export const SipocTemplatePicker = ({ industryId, industryName, value, onApply }) => {
  const templates = useMemo(() => getSipocTemplates(industryId), [industryId]);
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <Map size={18} /> <strong>업종 SIPOC 템플릿</strong>
      </div>
      <TemplatePicker
        templates={templates}
        selectedId={selectedId}
        industryLabel={industryName}
        accent="#0284c7"
        onSelect={(tpl) => {
          setSelectedId(tpl.id);
          onApply({
            supplier: tpl.supplier,
            input: tpl.input,
            process: tpl.process,
            output: tpl.output,
            customer: tpl.customer
          });
        }}
      />
      {value?.supplier && (
        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '-0.5rem', marginBottom: '0.75rem' }}>
          템플릿 적용 후 아래에서 수정할 수 있습니다.
        </div>
      )}
    </div>
  );
};

export const FishboneTemplatePicker = ({ industryId, industryName, onApply }) => {
  const templates = useMemo(() => getFishboneTemplates(industryId), [industryId]);
  const [selectedId, setSelectedId] = useState(null);

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <GitBranch size={18} /> <strong>업종 특성요인도 템플릿</strong>
      </div>
      <TemplatePicker
        templates={templates}
        selectedId={selectedId}
        industryLabel={industryName}
        accent="#0891b2"
        onSelect={(tpl) => {
          setSelectedId(tpl.id);
          onApply({
            man: [...tpl.fishbone.man],
            machine: [...tpl.fishbone.machine],
            material: [...tpl.fishbone.material],
            method: [...tpl.fishbone.method],
            measurement: [...tpl.fishbone.measurement],
            environment: [...tpl.fishbone.environment]
          });
        }}
      />
    </div>
  );
};

const normalizeWhy5 = (raw) => {
  if (!Array.isArray(raw) || raw.length === 0) {
    return Array.from({ length: 5 }, () => ({ question: '', answer: '' }));
  }
  return raw.map((item) => {
    if (typeof item === 'string') return { question: '', answer: item };
    return { question: item?.question || '', answer: item?.answer || '' };
  });
};

export const Why5Editor = ({ industryId, industryName, value, onChange }) => {
  const templates = useMemo(() => getWhy5Templates(industryId), [industryId]);
  const [selectedId, setSelectedId] = useState(null);
  const steps = normalizeWhy5(value);

  const apply = (tpl) => {
    setSelectedId(tpl.id);
    onChange(tpl.steps.map(s => ({ ...s })));
  };

  const patchAt = (idx, field, val) => {
    const next = steps.map((s, i) => (i === idx ? { ...s, [field]: val } : s));
    onChange(next);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <HelpCircle size={18} /> <strong>5-Why 근본 원인</strong>
      </div>
      <TemplatePicker templates={templates} selectedId={selectedId} onSelect={apply} industryLabel={industryName} accent="#7c3aed" />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {steps.map((whyItem, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
            <span style={{ fontWeight: 'bold', color: '#3b82f6', minWidth: '40px', paddingTop: '8px' }}>{i + 1}Why</span>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '5px' }}>
              <input style={inputStyle} placeholder="질문 (Question)" value={whyItem.question || ''}
                onChange={(e) => patchAt(i, 'question', e.target.value)} />
              <input style={{ ...inputStyle, fontWeight: 500 }} placeholder="답변 (Answer)" value={whyItem.answer || ''}
                onChange={(e) => patchAt(i, 'answer', e.target.value)} />
            </div>
          </div>
        ))}
      </div>
      <button type="button" className="btn-primary" style={{ marginTop: '0.75rem' }}
        onClick={() => onChange([...steps, { question: '', answer: '' }])}>
        <Plus size={14} /> Why 추가
      </button>
      {steps.length > 5 && (
        <button type="button" style={{ marginLeft: '0.5rem', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
          onClick={() => onChange(steps.slice(0, -1))}>
          <Trash2 size={14} /> 마지막 제거
        </button>
      )}
    </div>
  );
};

export const DesignSpecEditor = ({ industryId, industryName, value, onChange }) => {
  const templates = useMemo(() => getDesignSpecTemplates(industryId), [industryId]);
  const [selectedId, setSelectedId] = useState(value?.templateId || null);
  const data = value || {};

  const apply = (tpl) => {
    setSelectedId(tpl.id);
    onChange({
      templateId: tpl.id,
      templateName: tpl.name,
      title: tpl.title,
      requirements: tpl.requirements,
      ctqSpecs: tpl.ctqSpecs,
      constraints: tpl.constraints,
      verification: tpl.verification,
      notes: tpl.notes,
      // legacy textarea 호환
      spec: [
        `[${tpl.title}]`,
        `요구사항: ${tpl.requirements}`,
        `CTQ/스펙: ${tpl.ctqSpecs}`,
        `제약: ${tpl.constraints}`,
        `검증계획: ${tpl.verification}`,
        `비고: ${tpl.notes}`
      ].join('\n')
    });
  };

  const patch = (fields) => {
    const next = { ...data, templateId: selectedId, ...fields };
    next.spec = [
      `[${next.title || '설계 사양'}]`,
      `요구사항: ${next.requirements || ''}`,
      `CTQ/스펙: ${next.ctqSpecs || ''}`,
      `제약: ${next.constraints || ''}`,
      `검증계획: ${next.verification || ''}`,
      `비고: ${next.notes || ''}`
    ].join('\n');
    onChange(next);
  };

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <PenTool size={18} /> <strong>상세 설계 사양 (DFSS)</strong>
      </div>
      <TemplatePicker templates={templates} selectedId={selectedId} onSelect={apply} industryLabel={industryName} accent="#0d9488" />

      <div style={{ display: 'grid', gap: '0.75rem' }}>
        <div>
          <label style={{ fontSize: '0.8rem', color: '#64748b' }}>제목</label>
          <input style={inputStyle} value={data.title || ''} onChange={e => patch({ title: e.target.value })} />
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: '#64748b' }}>요구사항</label>
          <textarea style={{ ...inputStyle, minHeight: 70 }} value={data.requirements || ''} onChange={e => patch({ requirements: e.target.value })} />
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: '#64748b' }}>CTQ / 스펙</label>
          <textarea style={{ ...inputStyle, minHeight: 70 }} value={data.ctqSpecs || ''} onChange={e => patch({ ctqSpecs: e.target.value })} />
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: '#64748b' }}>제약조건</label>
          <textarea style={{ ...inputStyle, minHeight: 60 }} value={data.constraints || ''} onChange={e => patch({ constraints: e.target.value })} />
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: '#64748b' }}>검증 계획</label>
          <textarea style={{ ...inputStyle, minHeight: 60 }} value={data.verification || ''} onChange={e => patch({ verification: e.target.value })} />
        </div>
        <div>
          <label style={{ fontSize: '0.8rem', color: '#64748b' }}>비고</label>
          <textarea style={{ ...inputStyle, minHeight: 50 }} value={data.notes || ''} onChange={e => patch({ notes: e.target.value })} />
        </div>
      </div>
    </div>
  );
};
