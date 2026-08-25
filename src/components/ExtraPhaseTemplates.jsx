import React, { useMemo, useState } from 'react';
import {
  CheckCircle, BarChart2, Users, Workflow, ClipboardList, Award,
  ShieldCheck, GitCompare, FlaskConical, Plus, Trash2, Sparkles
} from 'lucide-react';
import {
  getParetoTemplates,
  getTeamTemplates,
  getSwimlaneTemplates,
  getMonitoringTemplates,
  getResultTemplates,
  getAlternativesTemplates,
  getPilotVerifyTemplates,
  getSelectionTemplates
} from '../data/extraPhaseTemplates';

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

export const ParetoTemplatePicker = ({ industryId, industryName, onApply }) => {
  const templates = useMemo(() => getParetoTemplates(industryId), [industryId]);
  const [selectedId, setSelectedId] = useState(null);
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <BarChart2 size={18} /> <strong>업종 파레토 템플릿</strong>
      </div>
      <TemplatePicker templates={templates} selectedId={selectedId} industryLabel={industryName} accent="#2563eb"
        onSelect={(tpl) => { setSelectedId(tpl.id); onApply(tpl.items.map(i => ({ ...i }))); }} />
    </div>
  );
};

export const TeamTemplatePicker = ({ industryId, industryName, onApply }) => {
  const templates = useMemo(() => getTeamTemplates(industryId), [industryId]);
  const [selectedId, setSelectedId] = useState(null);
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <Users size={18} /> <strong>업종 팀 구성 템플릿</strong>
      </div>
      <TemplatePicker templates={templates} selectedId={selectedId} industryLabel={industryName} accent="#6366f1"
        onSelect={(tpl) => {
          setSelectedId(tpl.id);
          const start = new Date();
          const end = new Date();
          end.setMonth(end.getMonth() + (tpl.timelineMonths || 3));
          const fmt = (d) => d.toISOString().slice(0, 10);
          onApply({
            team: tpl.team.map(m => ({ ...m })),
            timeline: { start: fmt(start), end: fmt(end) }
          });
        }} />
    </div>
  );
};

export const SwimlaneTemplatePicker = ({ industryId, industryName, onApply }) => {
  const templates = useMemo(() => getSwimlaneTemplates(industryId), [industryId]);
  const [selectedId, setSelectedId] = useState(null);
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <Workflow size={18} /> <strong>업종 프로세스맵 템플릿</strong>
      </div>
      <TemplatePicker templates={templates} selectedId={selectedId} industryLabel={industryName} accent="#0ea5e9"
        onSelect={(tpl) => {
          setSelectedId(tpl.id);
          const lanes = tpl.lanes.map(l => ({
            ...l,
            id: `${l.id}-${Date.now()}`,
            cards: (l.cards || []).map(c => ({ ...c, id: `${c.id}-${Math.random().toString(36).slice(2, 7)}` }))
          }));
          onApply({ lanes });
        }} />
    </div>
  );
};

export const MonitoringEditor = ({ industryId, industryName, value, onChange }) => {
  const templates = useMemo(() => getMonitoringTemplates(industryId), [industryId]);
  const [selectedId, setSelectedId] = useState(value?.templateId || null);
  const data = value || { kpis: [] };

  const apply = (tpl) => {
    setSelectedId(tpl.id);
    onChange({ templateId: tpl.id, templateName: tpl.name, kpis: tpl.kpis.map(k => ({ ...k })) });
  };
  const patch = (fields) => onChange({ ...data, templateId: selectedId, ...fields });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <ClipboardList size={18} /> <strong>모니터링 계획 (KPI)</strong>
      </div>
      <TemplatePicker templates={templates} selectedId={selectedId} onSelect={apply} industryLabel={industryName} accent="#059669" />
      {(data.kpis || []).map((row, idx) => (
        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr 0.8fr 0.8fr 1.4fr 36px', gap: '0.4rem', marginBottom: '0.45rem' }}>
          {['name', 'target', 'frequency', 'owner', 'escalation'].map(field => (
            <input key={field} style={inputStyle} placeholder={field} value={row[field] || ''}
              onChange={e => {
                const kpis = [...data.kpis];
                kpis[idx] = { ...row, [field]: e.target.value };
                patch({ kpis });
              }} />
          ))}
          <button type="button" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
            onClick={() => patch({ kpis: data.kpis.filter((_, i) => i !== idx) })}><Trash2 size={16} /></button>
        </div>
      ))}
      <button type="button" className="btn-primary"
        onClick={() => patch({ kpis: [...(data.kpis || []), { name: '', target: '', frequency: '', owner: '', escalation: '' }] })}>
        <Plus size={14} /> KPI 추가
      </button>
    </div>
  );
};

export const ResultEditor = ({ industryId, industryName, value, onChange }) => {
  const templates = useMemo(() => getResultTemplates(industryId), [industryId]);
  const [selectedId, setSelectedId] = useState(value?.templateId || null);
  const data = value || { metrics: [], summary: '' };

  const apply = (tpl) => {
    setSelectedId(tpl.id);
    onChange({
      templateId: tpl.id,
      templateName: tpl.name,
      metrics: tpl.metrics.map(m => ({ ...m })),
      summary: tpl.summary
    });
  };
  const patch = (fields) => onChange({ ...data, templateId: selectedId, ...fields });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <Award size={18} /> <strong>최종 성과 요약</strong>
      </div>
      <TemplatePicker templates={templates} selectedId={selectedId} onSelect={apply} industryLabel={industryName} accent="#16a34a" />
      {(data.metrics || []).map((row, idx) => (
        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr 0.9fr 1.2fr 36px', gap: '0.4rem', marginBottom: '0.45rem' }}>
          {['name', 'before', 'after', 'note'].map(field => (
            <input key={field} style={inputStyle} placeholder={field} value={row[field] || ''}
              onChange={e => {
                const metrics = [...data.metrics];
                metrics[idx] = { ...row, [field]: e.target.value };
                patch({ metrics });
              }} />
          ))}
          <button type="button" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
            onClick={() => patch({ metrics: data.metrics.filter((_, i) => i !== idx) })}><Trash2 size={16} /></button>
        </div>
      ))}
      <button type="button" className="btn-primary" style={{ marginBottom: '0.75rem' }}
        onClick={() => patch({ metrics: [...(data.metrics || []), { name: '', before: '', after: '', note: '' }] })}>
        <Plus size={14} /> 지표 추가
      </button>
      <textarea style={{ ...inputStyle, minHeight: 90 }} placeholder="종합 요약"
        value={data.summary || ''} onChange={e => patch({ summary: e.target.value })} />
    </div>
  );
};

export const AlternativesEditor = ({ industryId, industryName, value, onChange }) => {
  const templates = useMemo(() => getAlternativesTemplates(industryId), [industryId]);
  const [selectedId, setSelectedId] = useState(value?.templateId || null);
  const data = value || { options: [], decision: '' };

  const apply = (tpl) => {
    setSelectedId(tpl.id);
    onChange({
      templateId: tpl.id,
      templateName: tpl.name,
      options: tpl.options.map(o => ({ ...o })),
      decision: tpl.decision
    });
  };
  const patch = (fields) => onChange({ ...data, templateId: selectedId, ...fields });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <GitCompare size={18} /> <strong>설계 옵션 비교 (DFSS Analyze)</strong>
      </div>
      <TemplatePicker templates={templates} selectedId={selectedId} onSelect={apply} industryLabel={industryName} accent="#0891b2" />
      {(data.options || []).map((row, idx) => (
        <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: 10, padding: '0.75rem', marginBottom: '0.6rem' }}>
          <input style={{ ...inputStyle, marginBottom: 6, fontWeight: 600 }} placeholder="대안명" value={row.name || ''}
            onChange={e => { const options = [...data.options]; options[idx] = { ...row, name: e.target.value }; patch({ options }); }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 90px', gap: '0.4rem' }}>
            <input style={inputStyle} placeholder="장점" value={row.pros || ''}
              onChange={e => { const options = [...data.options]; options[idx] = { ...row, pros: e.target.value }; patch({ options }); }} />
            <input style={inputStyle} placeholder="단점" value={row.cons || ''}
              onChange={e => { const options = [...data.options]; options[idx] = { ...row, cons: e.target.value }; patch({ options }); }} />
            <input style={inputStyle} type="number" placeholder="점수" value={row.score ?? ''}
              onChange={e => { const options = [...data.options]; options[idx] = { ...row, score: Number(e.target.value) }; patch({ options }); }} />
          </div>
        </div>
      ))}
      <button type="button" className="btn-primary" style={{ marginBottom: '0.75rem' }}
        onClick={() => patch({ options: [...(data.options || []), { name: '', pros: '', cons: '', score: 0 }] })}>
        <Plus size={14} /> 대안 추가
      </button>
      <textarea style={{ ...inputStyle, minHeight: 70 }} placeholder="선정 결정"
        value={data.decision || ''} onChange={e => patch({ decision: e.target.value })} />
    </div>
  );
};

export const PilotVerifyEditor = ({ industryId, industryName, value, onChange }) => {
  const templates = useMemo(() => getPilotVerifyTemplates(industryId), [industryId]);
  const [selectedId, setSelectedId] = useState(value?.templateId || null);
  const data = value || { items: [], conclusion: '' };

  const apply = (tpl) => {
    setSelectedId(tpl.id);
    onChange({
      templateId: tpl.id,
      templateName: tpl.name,
      items: tpl.items.map(i => ({ ...i })),
      conclusion: tpl.conclusion
    });
  };
  const patch = (fields) => onChange({ ...data, templateId: selectedId, ...fields });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <FlaskConical size={18} /> <strong>시제품/파일럿 검증 (Verify)</strong>
      </div>
      <TemplatePicker templates={templates} selectedId={selectedId} onSelect={apply} industryLabel={industryName} accent="#0d9488" />
      {(data.items || []).map((row, idx) => (
        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 0.8fr 1fr 36px', gap: '0.4rem', marginBottom: '0.45rem' }}>
          {['ctq', 'method', 'criteria', 'result', 'note'].map(field => (
            <input key={field} style={inputStyle} placeholder={field} value={row[field] || ''}
              onChange={e => {
                const items = [...data.items];
                items[idx] = { ...row, [field]: e.target.value };
                patch({ items });
              }} />
          ))}
          <button type="button" style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}
            onClick={() => patch({ items: data.items.filter((_, i) => i !== idx) })}><Trash2 size={16} /></button>
        </div>
      ))}
      <button type="button" className="btn-primary" style={{ marginBottom: '0.75rem' }}
        onClick={() => patch({ items: [...(data.items || []), { ctq: '', method: '', criteria: '', result: '', note: '' }] })}>
        <Plus size={14} /> 검증항목 추가
      </button>
      <textarea style={{ ...inputStyle, minHeight: 70 }} placeholder="종합 결론"
        value={data.conclusion || ''} onChange={e => patch({ conclusion: e.target.value })} />
    </div>
  );
};

export const CompleteChecklist = ({ isDmaic, checks, onToggle, onComplete }) => {
  const items = isDmaic
    ? [
      { id: 'sop', label: '표준작업(SOP) 문서화 완료' },
      { id: 'training', label: '교육/인수인계 완료' },
      { id: 'monitoring', label: '모니터링 KPI 운영 중' },
      { id: 'result', label: '최종 성과 기록 완료' },
      { id: 'approve', label: 'Champion 승인' }
    ]
    : [
      { id: 'design', label: '상세 설계 스펙 확정' },
      { id: 'pilot', label: '시제품/파일럿 검증 합격' },
      { id: 'approve', label: '양산/출시 승인' }
    ];

  const allDone = items.every(i => checks?.[i.id]);

  return (
    <div style={{ maxWidth: 520, margin: '0 auto', textAlign: 'left' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <ShieldCheck size={64} color="#10b981" style={{ marginBottom: '0.75rem' }} />
        <h3 style={{ fontSize: '1.6rem', color: '#064e3b', marginBottom: '0.5rem' }}>
          {isDmaic ? 'DMAIC 완료 체크리스트' : 'DFSS 완료 체크리스트'}
        </h3>
        <p style={{ color: '#065f46' }}>필수 항목을 확인한 뒤 프로젝트를 종료하세요.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
        {items.map(item => (
          <label key={item.id} style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.85rem 1rem',
            borderRadius: 10, border: checks?.[item.id] ? '2px solid #10b981' : '1px solid #e2e8f0',
            background: checks?.[item.id] ? '#ecfdf5' : 'white', cursor: 'pointer'
          }}>
            <input type="checkbox" checked={!!checks?.[item.id]} onChange={() => onToggle(item.id)} />
            <span style={{ fontWeight: 600, color: '#134e4a' }}>{item.label}</span>
          </label>
        ))}
      </div>
      <button type="button" className="btn-primary" style={{ width: '100%', opacity: allDone ? 1 : 0.5 }}
        disabled={!allDone} onClick={onComplete}>
        프로젝트 완료 확정
      </button>
    </div>
  );
};

/** Selection 기회분석 상단 샘플 불러오기 */
export const SelectionTemplateBar = ({ industryId, industryName, onApply }) => {
  const templates = useMemo(() => getSelectionTemplates(industryId), [industryId]);
  if (!templates.length) return null;
  return (
    <div style={{
      marginBottom: '1.25rem', padding: '1rem 1.15rem', borderRadius: 12,
      background: '#eff6ff', border: '1px solid #bfdbfe'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#1e40af', marginBottom: 6 }}>
        <Sparkles size={16} /> {industryName || '업종'} 샘플 (선택 사항)
      </div>
      <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
        샘플은 예시일 뿐입니다. 고객불만 과제면 「VOC」 샘플을, 불량률 과제면 「품질」 샘플을 고르세요. 불러오면 기존 내용을 덮어씁니다.
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
        {templates.map((tpl) => (
          <button
            key={tpl.id}
            type="button"
            className="btn-primary"
            style={{ fontSize: '0.85rem' }}
            onClick={() => onApply(tpl)}
            title={tpl.desc}
          >
            {tpl.name}
          </button>
        ))}
      </div>
    </div>
  );
};
