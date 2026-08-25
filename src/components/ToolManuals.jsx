import React, { useEffect, useMemo, useState } from 'react';
import { BookOpen, Search, X, ChevronRight, ExternalLink } from 'lucide-react';
import {
  TOOL_MANUALS,
  MANUAL_PHASES,
  getManualById,
  getManualsByPhase,
  searchManuals
} from '../data/toolManuals';

const Section = ({ title, children }) => (
  <section style={{ marginBottom: '1.25rem' }}>
    <h4 style={{ margin: '0 0 0.45rem', color: '#0f172a', fontSize: '0.95rem' }}>{title}</h4>
    <div style={{ color: '#334155', fontSize: '0.9rem', lineHeight: 1.65 }}>{children}</div>
  </section>
);

export const ManualContent = ({ manual }) => {
  if (!manual) {
    return <div style={{ color: '#64748b' }}>설명서를 찾을 수 없습니다.</div>;
  }
  return (
    <div>
      <div style={{
        display: 'inline-block',
        fontSize: '0.75rem',
        fontWeight: 700,
        color: '#0369a1',
        background: '#e0f2fe',
        padding: '0.2rem 0.55rem',
        borderRadius: 999,
        marginBottom: '0.65rem',
        textTransform: 'uppercase'
      }}>
        {manual.phase}
      </div>
      <h3 style={{ margin: '0 0 0.5rem', color: '#0f172a' }}>{manual.title}</h3>
      <p style={{ margin: '0 0 1.25rem', color: '#475569' }}>{manual.summary}</p>

      <Section title="목적">{manual.purpose}</Section>

      {manual.when?.length > 0 && (
        <Section title="언제 쓰나요?">
          <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
            {manual.when.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </Section>
      )}

      {manual.steps?.length > 0 && (
        <Section title="사용 방법">
          <ol style={{ margin: 0, paddingLeft: '1.2rem' }}>
            {manual.steps.map((s, i) => <li key={i} style={{ marginBottom: 6 }}>{s}</li>)}
          </ol>
        </Section>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '0.85rem',
        marginBottom: '1.25rem'
      }}>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '0.85rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginBottom: 4 }}>입력</div>
          <div style={{ fontSize: '0.88rem' }}>{manual.inputs || '—'}</div>
        </div>
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10, padding: '0.85rem' }}>
          <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 700, marginBottom: 4 }}>출력</div>
          <div style={{ fontSize: '0.88rem' }}>{manual.outputs || '—'}</div>
        </div>
      </div>

      {manual.tips?.length > 0 && (
        <Section title="팁 / 주의">
          <ul style={{ margin: 0, paddingLeft: '1.2rem' }}>
            {manual.tips.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </Section>
      )}
    </div>
  );
};

/** 도구 카드/모달용 작은 버튼 */
export const ManualLinkButton = ({ toolId, onOpen, compact = false }) => {
  const manual = getManualById(toolId);
  if (!manual) return null;
  return (
    <button
      type="button"
      className="btn-manual-link"
      title={`${manual.title} 설명서`}
      onClick={(e) => {
        e.stopPropagation();
        onOpen?.(toolId);
      }}
    >
      <BookOpen size={compact ? 13 : 14} />
      {compact ? '설명서' : '설명서 보기'}
    </button>
  );
};

/** 전체 설명서 탭 */
export const ManualsBrowser = ({ focusId, onFocusConsumed, onOpenTool }) => {
  const [phase, setPhase] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(focusId || TOOL_MANUALS[0]?.id);

  useEffect(() => {
    if (focusId) {
      setSelectedId(focusId);
      const m = getManualById(focusId);
      if (m) setPhase(m.phase);
      onFocusConsumed?.();
    }
  }, [focusId, onFocusConsumed]);

  const list = useMemo(() => {
    let rows = searchManuals(query);
    if (phase !== 'all') rows = rows.filter(m => m.phase === phase);
    return rows;
  }, [phase, query]);

  const selected = getManualById(selectedId) || list[0] || null;

  return (
    <div className="fade-in manuals-layout">
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <BookOpen size={26} color="#0369a1" /> 도구 사용설명서
        </h2>
        <p className="subtitle" style={{ marginTop: '0.5rem' }}>
          분석·측정·개선 도구의 목적, 사용법, 입력/출력, 주의사항을 확인하세요.
          통계 도구 실행 후 결과 하단의 「해석·조언」과 사이드바 「AI 조언 설정」도 활용하세요.
        </p>
      </div>

      <div className="manuals-toolbar">
        <div className="tool-group-tabs" style={{ margin: 0 }}>
          {MANUAL_PHASES.map(p => (
            <button
              key={p.id}
              type="button"
              className={`tool-group-tab${phase === p.id ? ' active' : ''}`}
              onClick={() => setPhase(p.id)}
            >
              {p.label}
              <span className="tool-group-count">
                {p.id === 'all' ? TOOL_MANUALS.length : getManualsByPhase(p.id).length}
              </span>
            </button>
          ))}
        </div>
        <div className="manuals-search">
          <Search size={16} color="#64748b" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="도구명·키워드 검색"
          />
        </div>
      </div>

      <div className="manuals-split">
        <aside className="manuals-list">
          {list.length === 0 && (
            <div style={{ padding: '1rem', color: '#64748b', fontSize: '0.9rem' }}>검색 결과가 없습니다.</div>
          )}
          {list.map(m => (
            <button
              key={m.id}
              type="button"
              className={`manuals-list-item${selected?.id === m.id ? ' active' : ''}`}
              onClick={() => setSelectedId(m.id)}
            >
              <span className="manuals-list-phase">{m.phase}</span>
              <span className="manuals-list-title">{m.title}</span>
              <ChevronRight size={16} className="manuals-list-chevron" />
            </button>
          ))}
        </aside>
        <article className="manuals-detail">
          {selected ? (
            <>
              <ManualContent manual={selected} />
              {onOpenTool && ['measure', 'analyze', 'improve', 'control', 'define'].includes(selected.phase) && (
                <button
                  type="button"
                  className="btn-primary"
                  style={{ marginTop: '0.5rem' }}
                  onClick={() => onOpenTool(selected.phase, selected.id)}
                >
                  <ExternalLink size={16} /> 이 도구 열기
                </button>
              )}
            </>
          ) : (
            <div style={{ color: '#64748b' }}>왼쪽에서 도구를 선택하세요.</div>
          )}
        </article>
      </div>
    </div>
  );
};

/** 단일 도구 설명서 모달 */
export const ManualModal = ({ toolId, onClose, onGoToBrowser }) => {
  const manual = getManualById(toolId);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-large" style={{ maxWidth: 720 }} onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOpen size={22} /> 사용설명서
          </h2>
          <button className="modal-close-btn" onClick={onClose} type="button"><X size={24} /></button>
        </div>
        <div className="modal-body">
          <ManualContent manual={manual} />
          {onGoToBrowser && (
            <button
              type="button"
              className="btn-text"
              style={{ marginTop: '0.5rem', border: '1px solid #cbd5e1', borderRadius: 8, padding: '0.45rem 0.8rem' }}
              onClick={() => {
                onClose?.();
                onGoToBrowser?.(toolId);
              }}
            >
              설명서 탭에서 보기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManualsBrowser;
