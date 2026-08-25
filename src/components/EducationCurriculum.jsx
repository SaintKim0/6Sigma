import React, { useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Circle,
  ClipboardList,
  FlaskConical,
  GraduationCap,
  LayoutDashboard,
  Lightbulb,
  ListChecks,
  Map,
  Play,
  Route,
  Sparkles,
  Wrench
} from 'lucide-react';
import {
  CURRICULUM_MODULES,
  CURRICULUM_TRACKS,
  FEATURE_CLASSIFICATION,
  TYPE_LABELS,
  getModulesByTrack,
  getOverallProgress,
  getTrackProgress,
  loadCurriculumProgress,
  saveCurriculumProgress
} from '../data/educationCurriculum';
import { FundamentalsChapterView, FundamentalsHub } from './FundamentalsLearning';
import { getWalkthroughById } from '../data/walkthroughScenarios';

const TypeBadge = ({ type }) => {
  const meta = TYPE_LABELS[type] || TYPE_LABELS.guide;
  return (
    <span style={{
      fontSize: '0.68rem', fontWeight: 800, color: meta.color,
      background: `${meta.color}14`, border: `1px solid ${meta.color}33`,
      padding: '0.12rem 0.45rem', borderRadius: 999
    }}>
      {meta.label}
    </span>
  );
};

const ProgressBar = ({ percent, color = '#059669' }) => (
  <div style={{ height: 8, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
    <div style={{ width: `${percent}%`, height: '100%', background: color, transition: 'width 0.25s' }} />
  </div>
);

/**
 * 교육 커리큘럼 허브
 * onNavigate(action) — action.kind: lesson|manual|tool|lab|hub|demo|workspace
 */
const EducationCurriculum = ({
  onNavigate,
  onOpenLearning,
  onOpenManuals,
  onEnterPractice,
  onExitPractice,
  hasMethodology = false,
  isPracticeMode = false
}) => {
  const [progress, setProgress] = useState(() => loadCurriculumProgress());
  const [trackId, setTrackId] = useState(progress.lastTrackId || 'fundamentals');
  const [moduleId, setModuleId] = useState(progress.lastModuleId || null);
  const [showMap, setShowMap] = useState(false);
  const [fundamentalsView, setFundamentalsView] = useState(null); // null | 'hub' | chapterId
  const [fundamentalsItemId, setFundamentalsItemId] = useState(null);
  const [walkthroughId, setWalkthroughId] = useState(null);
  const [walkthroughItemId, setWalkthroughItemId] = useState(null);
  const [walkStepDone, setWalkStepDone] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sigma_walkthrough_steps') || '{}');
    } catch {
      return {};
    }
  });

  const persistWalkSteps = (next) => {
    setWalkStepDone(next);
    localStorage.setItem('sigma_walkthrough_steps', JSON.stringify(next));
  };

  const track = CURRICULUM_TRACKS.find((t) => t.id === trackId) || CURRICULUM_TRACKS[0];
  const modules = useMemo(() => getModulesByTrack(trackId), [trackId]);
  const activeModule = modules.find((m) => m.id === moduleId) || modules[0] || null;
  const overall = getOverallProgress(progress.completed);
  const trackProg = getTrackProgress(trackId, progress.completed);

  const persist = (next) => {
    setProgress(next);
    saveCurriculumProgress(next);
  };

  const selectTrack = (id) => {
    setTrackId(id);
    const first = getModulesByTrack(id)[0];
    setModuleId(first?.id || null);
    persist({ ...progress, lastTrackId: id, lastModuleId: first?.id || null });
  };

  const selectModule = (id) => {
    setModuleId(id);
    persist({ ...progress, lastModuleId: id, lastTrackId: trackId });
  };

  const toggleDone = (itemId) => {
    const set = new Set(progress.completed);
    if (set.has(itemId)) set.delete(itemId);
    else set.add(itemId);
    persist({ ...progress, completed: Array.from(set), lastModuleId: activeModule?.id, lastTrackId: trackId });
  };

  const runItem = (item) => {
    if (!item.action) return;
    if (item.action.kind === 'fundamentals') {
      setFundamentalsItemId(item.id);
      setFundamentalsView(item.action.id || 'hub');
      return;
    }
    if (item.action.kind === 'walkthrough') {
      setWalkthroughItemId(item.id);
      setWalkthroughId(item.action.id);
      return;
    }
    onNavigate?.(item.action);
  };

  const markFundamentalsDone = () => {
    if (fundamentalsItemId) toggleDone(fundamentalsItemId);
    setFundamentalsView(null);
    setFundamentalsItemId(null);
  };

  const toggleWalkStep = (scenarioId, stepId) => {
    const key = `${scenarioId}::${stepId}`;
    const next = { ...walkStepDone, [key]: !walkStepDone[key] };
    persistWalkSteps(next);
  };

  const finishWalkthrough = (scenario) => {
    if (!scenario) return;
    const allDone = scenario.steps.every((s) => walkStepDone[`${scenario.id}::${s.id}`]);
    if (!allDone) {
      const ok = window.confirm('아직 체크하지 않은 단계가 있습니다. 시나리오를 완료로 표시할까요?');
      if (!ok) return;
    }
    if (walkthroughItemId) toggleDone(walkthroughItemId);
    setWalkthroughId(null);
    setWalkthroughItemId(null);
  };

  if (fundamentalsView === 'hub') {
    return (
      <div className="edu-curriculum">
        <button
          type="button"
          className="btn-secondary"
          onClick={() => { setFundamentalsView(null); setFundamentalsItemId(null); }}
          style={{ marginBottom: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          ← 커리큘럼으로
        </button>
        <h2 style={{ margin: '0 0 0.5rem', display: 'flex', alignItems: 'center', gap: 8 }}>
          <BookOpen size={22} color="#1d4ed8" /> 6시그마 기초
        </h2>
        <FundamentalsHub onOpenChapter={(id) => setFundamentalsView(id)} />
      </div>
    );
  }

  if (fundamentalsView && fundamentalsView !== 'hub') {
    return (
      <div className="edu-curriculum">
        <FundamentalsChapterView
          chapterId={fundamentalsView}
          onBack={() => setFundamentalsView(fundamentalsItemId ? null : 'hub')}
          onMarkDone={fundamentalsItemId ? markFundamentalsDone : undefined}
        />
      </div>
    );
  }

  if (walkthroughId) {
    const scenario = getWalkthroughById(walkthroughId);
    if (!scenario) {
      return (
        <div className="edu-curriculum">
          <button type="button" className="btn-secondary" onClick={() => setWalkthroughId(null)}>← 커리큘럼으로</button>
          <p>시나리오를 찾을 수 없습니다.</p>
        </div>
      );
    }
    const doneCount = scenario.steps.filter((s) => walkStepDone[`${scenario.id}::${s.id}`]).length;
    return (
      <div className="edu-curriculum" style={{ maxWidth: 720 }}>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => { setWalkthroughId(null); setWalkthroughItemId(null); }}
          style={{ marginBottom: 12, display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          ← 커리큘럼으로
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
          <Route size={20} color={scenario.color} />
          <h2 style={{ margin: 0, color: '#0f172a' }}>{scenario.title}</h2>
          <span style={{
            fontSize: '0.7rem', fontWeight: 800, color: 'white', background: scenario.color,
            padding: '0.15rem 0.5rem', borderRadius: 999
          }}>{scenario.badge}</span>
        </div>
        <p style={{ margin: '0 0 0.5rem', color: '#475569', lineHeight: 1.55 }}>{scenario.summary}</p>
        <p style={{ margin: '0 0 1rem', fontSize: '0.82rem', color: '#0369a1', background: '#eff6ff', padding: '0.55rem 0.75rem', borderRadius: 8 }}>
          {scenario.tip} · 진행 {doneCount}/{scenario.steps.length}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {scenario.steps.map((step, idx) => {
            const key = `${scenario.id}::${step.id}`;
            const done = !!walkStepDone[key];
            return (
              <div key={step.id} style={{
                border: '1px solid #e2e8f0', borderRadius: 12, padding: '0.85rem',
                background: done ? '#f0fdf4' : '#fff'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: 8, minWidth: 0 }}>
                    <button
                      type="button"
                      onClick={() => toggleWalkStep(scenario.id, step.id)}
                      style={{ border: 0, background: 'transparent', cursor: 'pointer', padding: 0, marginTop: 2 }}
                      title={done ? '완료 취소' : '완료 표시'}
                    >
                      {done ? <CheckCircle2 size={18} color="#059669" /> : <Circle size={18} color="#94a3b8" />}
                    </button>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>STEP {idx + 1}</div>
                      <strong style={{ color: '#0f172a' }}>{step.title}</strong>
                      <p style={{ margin: '0.35rem 0 0', fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>{step.body}</p>
                    </div>
                  </div>
                  {step.action && (
                    <button
                      type="button"
                      className="btn-primary"
                      style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                      onClick={() => onNavigate?.(step.action)}
                    >
                      실습 열기 <ChevronRight size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          className="btn-primary"
          style={{ marginTop: 14 }}
          onClick={() => finishWalkthrough(scenario)}
        >
          이 시나리오 완료로 표시
        </button>
      </div>
    );
  }

  return (
    <div className="edu-curriculum" style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem', minHeight: 0 }}>
      <header>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <GraduationCap size={22} color="#0f766e" />
              <h2 style={{ margin: 0, color: '#0f172a' }}>교육 커리큘럼</h2>
            </div>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.92rem', lineHeight: 1.55, maxWidth: 640 }}>
              기존 워크벤치 기능을 <b>학습 순서</b>로 정리했습니다.
              도구·샘플·데모 <b>실습은 별도 샌드박스</b>에서 열리며, 본 프로젝트 작성과 섞이지 않습니다.
            </p>
          </div>
          <div style={{ minWidth: 180, flex: '0 0 200px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 4 }}>
              필수 진도 {overall.requiredDone}/{overall.requiredTotal} ({overall.percent}%)
            </div>
            <ProgressBar percent={overall.percent} />
          </div>
        </div>

        <div style={{
          marginTop: 12, padding: '0.7rem 0.85rem', borderRadius: 10,
          background: isPracticeMode ? '#ecfdf5' : '#eff6ff',
          border: `1px solid ${isPracticeMode ? '#a7f3d0' : '#bfdbfe'}`,
          fontSize: '0.8rem', color: isPracticeMode ? '#065f46' : '#1e40af', lineHeight: 1.5
        }}>
          {isPracticeMode ? (
            <>
              현재 <b>교육 실습 모드</b>입니다. 실습 중 작성한 헌장·차트는 본 프로젝트에 반영되지 않습니다.
              <button type="button" className="btn-manual-link" style={{ marginLeft: 8 }} onClick={() => onExitPractice?.()}>
                본 프로젝트로
              </button>
            </>
          ) : (
            <>
              도구실습·샘플·데모를 열면 자동으로 <b>교육 실습 모드</b>로 전환됩니다.
              <button type="button" className="btn-manual-link" style={{ marginLeft: 8 }} onClick={() => onEnterPractice?.()}>
                실습 모드만 열기
              </button>
            </>
          )}
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          <button type="button" className="btn-manual-link" onClick={() => onOpenLearning?.()}>
            <BookOpen size={14} /> 통계 학습관
          </button>
          <button type="button" className="btn-manual-link" onClick={() => onOpenManuals?.()}>
            <ClipboardList size={14} /> 사용설명서
          </button>
          <button type="button" className="btn-manual-link" onClick={() => setShowMap((v) => !v)}>
            <Map size={14} /> 기능 지도 {showMap ? '닫기' : '보기'}
          </button>
        </div>
      </header>

      {showMap && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10,
          padding: '0.85rem', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12
        }}>
          {[
            ['교육 핵심 (Core)', FEATURE_CLASSIFICATION.core, '#059669'],
            ['워크벤치 확장', FEATURE_CLASSIFICATION.available, '#2563eb'],
            ['나중에 (스토어/LMS)', FEATURE_CLASSIFICATION.later, '#64748b']
          ].map(([title, list, color]) => (
            <div key={title}>
              <div style={{ fontWeight: 800, color, fontSize: '0.82rem', marginBottom: 6 }}>{title}</div>
              <ul style={{ margin: 0, paddingLeft: '1.1rem', color: '#334155', fontSize: '0.78rem', lineHeight: 1.55 }}>
                {list.map((f) => (
                  <li key={f.id}><b>{f.name}</b> — {f.note}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 8 }}>
        {CURRICULUM_TRACKS.map((t) => {
          const p = getTrackProgress(t.id, progress.completed);
          const active = t.id === trackId;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => selectTrack(t.id)}
              style={{
                textAlign: 'left', padding: '0.85rem', borderRadius: 12, cursor: 'pointer',
                border: active ? `2px solid ${t.color}` : '1px solid #e2e8f0',
                background: active ? `${t.color}10` : 'white'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 6, marginBottom: 4 }}>
                <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{t.label}</strong>
                <span style={{
                  fontSize: '0.65rem', fontWeight: 800, color: 'white', background: t.color,
                  padding: '0.12rem 0.4rem', borderRadius: 6
                }}>{t.badge}</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4, minHeight: 34 }}>{t.summary}</div>
              <div style={{ marginTop: 8 }}>
                <ProgressBar percent={p.percent} color={t.color} />
                <div style={{ fontSize: '0.68rem', color: '#64748b', marginTop: 3 }}>{p.requiredDone}/{p.requiredTotal} 필수</div>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(200px, 260px) minmax(0, 1fr)',
        gap: 12,
        minHeight: 360,
        alignItems: 'stretch'
      }}
        className="edu-split"
      >
        <aside style={{
          border: '1px solid #e2e8f0', borderRadius: 12, background: '#fff',
          padding: '0.65rem', overflow: 'auto'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: track.color, marginBottom: 8 }}>
            {track.label} · {trackProg.percent}%
          </div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginBottom: 10 }}>{track.audience}</div>
          {modules.map((m, idx) => {
            const req = m.items.filter((i) => i.required);
            const done = req.filter((i) => progress.completed.includes(i.id)).length;
            const active = activeModule?.id === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => selectModule(m.id)}
                style={{
                  width: '100%', textAlign: 'left', marginBottom: 6, padding: '0.65rem 0.7rem',
                  borderRadius: 10, cursor: 'pointer',
                  border: active ? `2px solid ${track.color}` : '1px solid #e2e8f0',
                  background: active ? `${track.color}0d` : '#f8fafc'
                }}
              >
                <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>MODULE {idx + 1} · {m.minutes}분</div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a', marginTop: 2 }}>{m.title}</div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 3 }}>{done}/{req.length} 필수 완료</div>
              </button>
            );
          })}
        </aside>

        <section style={{
          border: '1px solid #e2e8f0', borderRadius: 12, background: 'white',
          padding: '1rem 1.1rem', overflow: 'auto'
        }}>
          {activeModule ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <ListChecks size={18} color={track.color} />
                <h3 style={{ margin: 0, color: '#0f172a' }}>{activeModule.title}</h3>
              </div>
              <p style={{ margin: '0 0 1rem', color: '#475569', fontSize: '0.88rem', lineHeight: 1.55 }}>
                <b>학습 목표:</b> {activeModule.outcome}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {activeModule.items.map((item) => {
                  const done = progress.completed.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      style={{
                        border: '1px solid #e2e8f0', borderRadius: 10, padding: '0.75rem 0.85rem',
                        background: done ? '#f0fdf4' : '#fff'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', minWidth: 0 }}>
                          <button
                            type="button"
                            onClick={() => toggleDone(item.id)}
                            title={done ? '완료 취소' : '완료 표시'}
                            style={{
                              border: 0, background: 'transparent', cursor: 'pointer', padding: 0, marginTop: 2
                            }}
                          >
                            {done
                              ? <CheckCircle2 size={18} color="#059669" />
                              : <Circle size={18} color="#94a3b8" />}
                          </button>
                          <div>
                            <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                              <TypeBadge type={item.type} />
                              {!item.required && (
                                <span style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 700 }}>선택</span>
                              )}
                              <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{item.title}</strong>
                            </div>
                            {item.body && (
                              <p style={{ margin: '0.35rem 0 0', fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
                                {item.body}
                              </p>
                            )}
                          </div>
                        </div>
                        {item.action && (
                          <button
                            type="button"
                            className="btn-primary"
                            style={{ fontSize: '0.78rem', padding: '0.35rem 0.65rem', display: 'inline-flex', alignItems: 'center', gap: 4 }}
                            onClick={() => runItem(item)}
                          >
                            {item.action.kind === 'lesson' ? <BookOpen size={13} />
                              : item.action.kind === 'manual' ? <ClipboardList size={13} />
                                : item.action.kind === 'lab' ? <FlaskConical size={13} />
                                  : item.action.kind === 'hub' ? <LayoutDashboard size={13} />
                                    : item.action.kind === 'demo' ? <Play size={13} />
                                      : item.type === 'walkthrough' ? <Route size={13} />
                                    : item.type === 'fundamentals' ? <BookOpen size={13} />
                                      : item.type === 'builder' ? <Lightbulb size={13} />
                                        : <Wrench size={13} />}
                            열기 <ChevronRight size={13} />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div style={{ color: '#64748b' }}>모듈을 선택하세요.</div>
          )}
        </section>
      </div>

      <div style={{
        fontSize: '0.78rem', color: '#64748b', background: '#fffbeb', border: '1px solid #fcd34d',
        borderRadius: 10, padding: '0.65rem 0.85rem', lineHeight: 1.5
      }}>
        <Sparkles size={14} style={{ verticalAlign: -2, marginRight: 4 }} color="#b45309" />
        교육용 권장 경로: <b>6시그마 기초 → Yellow Belt → 따라하기 실습 → Green Belt → (필요 시) 통계 / DFSS</b>.
        도구·샘플·데모 실습은 <b>교육 실습 모드</b>에서만 이루어지며, 본 프로젝트 작성과 분리됩니다.
      </div>

      <style>{`
        @media (max-width: 860px) {
          .edu-split { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

export default EducationCurriculum;
export { CURRICULUM_MODULES };
