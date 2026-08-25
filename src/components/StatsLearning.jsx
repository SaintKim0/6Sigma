import React, { useEffect, useMemo, useState } from 'react';
import {
  GraduationCap, Search, ChevronRight, Lightbulb, AlertTriangle,
  Calculator, HelpCircle, CheckCircle2, XCircle, Wrench
} from 'lucide-react';
import {
  LEARNING_CATEGORIES,
  STATS_LESSONS,
  getLessonById,
  getLessonsByCategory,
  searchLessons
} from '../data/statsLearning';
import { getManualById } from '../data/toolManuals';

const LevelBadge = ({ level }) => {
  const colors = {
    기초: { bg: '#ecfdf5', color: '#047857' },
    중급: { bg: '#fffbeb', color: '#b45309' },
    실무: { bg: '#eff6ff', color: '#1d4ed8' }
  };
  const c = colors[level] || colors['기초'];
  return (
    <span style={{
      fontSize: '0.7rem', fontWeight: 800, color: c.color, background: c.bg,
      padding: '0.15rem 0.5rem', borderRadius: 999
    }}>
      {level}
    </span>
  );
};

const LessonDetail = ({ lesson, onOpenTool }) => {
  const [picked, setPicked] = useState(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setPicked(null);
    setRevealed(false);
  }, [lesson?.id]);

  if (!lesson) {
    return <div style={{ color: '#64748b', padding: '1rem' }}>학습 주제를 선택하세요.</div>;
  }

  const quiz = lesson.quiz;
  const correct = revealed && picked === quiz?.answer;

  return (
    <div className="learn-detail-inner">
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
        <LevelBadge level={lesson.level} />
        <span style={{
          fontSize: '0.7rem', fontWeight: 700, color: '#0f766e', background: '#ccfbf1',
          padding: '0.15rem 0.5rem', borderRadius: 6, textTransform: 'uppercase'
        }}>
          {LEARNING_CATEGORIES.find(c => c.id === lesson.category)?.label || lesson.category}
        </span>
      </div>

      <h3 style={{ margin: '0 0 0.4rem', color: '#0f172a' }}>{lesson.title}</h3>
      <p style={{ margin: '0 0 1rem', color: '#475569', lineHeight: 1.55 }}>{lesson.summary}</p>

      <section className="learn-section">
        <h4><Lightbulb size={15} /> 왜 배워야 하나요?</h4>
        <p>{lesson.why}</p>
      </section>

      <section className="learn-section">
        <h4>핵심 포인트</h4>
        <ul>
          {(lesson.keyPoints || []).map((p, i) => <li key={i}>{p}</li>)}
        </ul>
      </section>

      {lesson.formula && (
        <section className="learn-section learn-formula">
          <h4><Calculator size={15} /> 공식 / 규칙</h4>
          <code>{lesson.formula}</code>
        </section>
      )}

      {lesson.example && (
        <section className="learn-section">
          <h4>현장 예시</h4>
          <p>{lesson.example}</p>
        </section>
      )}

      {lesson.pitfalls?.length > 0 && (
        <section className="learn-section learn-pitfalls">
          <h4><AlertTriangle size={15} /> 흔한 오해</h4>
          <ul>
            {lesson.pitfalls.map((p, i) => <li key={i}>{p}</li>)}
          </ul>
        </section>
      )}

      {quiz && (
        <section className="learn-section learn-quiz">
          <h4><HelpCircle size={15} /> 이해 확인</h4>
          <p style={{ fontWeight: 600, marginBottom: 10 }}>{quiz.q}</p>
          <div className="learn-quiz-choices">
            {quiz.choices.map((c, i) => {
              let cls = 'learn-quiz-choice';
              if (revealed) {
                if (i === quiz.answer) cls += ' correct';
                else if (i === picked) cls += ' wrong';
              } else if (picked === i) cls += ' selected';
              return (
                <button
                  key={i}
                  type="button"
                  className={cls}
                  onClick={() => { if (!revealed) setPicked(i); }}
                >
                  {c}
                </button>
              );
            })}
          </div>
          <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <button
              type="button"
              className="btn-primary"
              disabled={picked == null || revealed}
              onClick={() => setRevealed(true)}
            >
              정답 확인
            </button>
            {revealed && (
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontWeight: 700, color: correct ? '#059669' : '#dc2626'
              }}>
                {correct ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                {correct ? '정답입니다' : '다시 읽어보세요'}
              </span>
            )}
          </div>
          {revealed && (
            <p style={{ marginTop: 10, fontSize: '0.88rem', color: '#334155', lineHeight: 1.55 }}>
              {quiz.explain}
            </p>
          )}
        </section>
      )}

      {lesson.relatedTools?.length > 0 && (
        <section className="learn-section">
          <h4><Wrench size={15} /> 이 앱에서 이어서 실습</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {lesson.relatedTools.map(tid => {
              const m = getManualById(tid);
              return (
                <button
                  key={tid}
                  type="button"
                  className="btn-manual-link"
                  onClick={() => onOpenTool?.(tid)}
                  title={m?.title || tid}
                >
                  {m?.title || tid}
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

/**
 * 기본 통계 학습관
 */
export const StatsLearningBrowser = ({ focusId, onFocusConsumed, onOpenTool }) => {
  const [category, setCategory] = useState('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(focusId || STATS_LESSONS[0]?.id);

  useEffect(() => {
    if (focusId) {
      setSelectedId(focusId);
      const lesson = getLessonById(focusId);
      if (lesson) setCategory(lesson.category);
      onFocusConsumed?.();
    }
  }, [focusId, onFocusConsumed]);

  const list = useMemo(() => {
    let rows = searchLessons(query);
    if (category !== 'all') rows = rows.filter(l => l.category === category);
    return rows;
  }, [category, query]);

  const selected = getLessonById(selectedId) || list[0] || null;

  return (
    <div className="fade-in manuals-layout learn-layout">
      <div style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          <GraduationCap size={26} color="#0f766e" /> 통계 학습관
        </h2>
        <p className="subtitle" style={{ marginTop: '0.5rem' }}>
          Six Sigma 분석에 필요한 기본 통계를 짧게 익히고, 앱 도구로 바로 실습하세요.
          주제당 핵심 · 예시 · 오해 · 퀴즈로 구성되어 있습니다.
        </p>
      </div>

      <div className="manuals-toolbar">
        <div className="tool-group-tabs" style={{ margin: 0 }}>
          {LEARNING_CATEGORIES.map(c => (
            <button
              key={c.id}
              type="button"
              className={`tool-group-tab${category === c.id ? ' active' : ''}`}
              onClick={() => setCategory(c.id)}
            >
              {c.label}
              <span className="tool-group-count">
                {c.id === 'all' ? STATS_LESSONS.length : getLessonsByCategory(c.id).length}
              </span>
            </button>
          ))}
        </div>
        <div className="manuals-search">
          <Search size={16} color="#64748b" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="평균, p-value, Cpk…"
          />
        </div>
      </div>

      <div className="manuals-split">
        <aside className="manuals-list">
          {list.length === 0 && (
            <div style={{ padding: '1rem', color: '#64748b', fontSize: '0.9rem' }}>검색 결과가 없습니다.</div>
          )}
          {list.map(l => (
            <button
              key={l.id}
              type="button"
              className={`manuals-list-item${selected?.id === l.id ? ' active' : ''}`}
              onClick={() => setSelectedId(l.id)}
            >
              <span className="manuals-list-phase" style={{ background: '#ccfbf1', color: '#0f766e' }}>
                {l.level}
              </span>
              <span className="manuals-list-title">{l.title}</span>
              <ChevronRight size={16} className="manuals-list-chevron" />
            </button>
          ))}
        </aside>
        <div className="manuals-detail">
          <LessonDetail
            lesson={selected}
            onOpenTool={(toolId) => {
              const m = getManualById(toolId);
              onOpenTool?.(m?.phase || 'measure', toolId);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default StatsLearningBrowser;
