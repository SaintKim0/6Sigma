import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  ChevronDown,
  CircleDollarSign,
  GitBranch,
  Lightbulb,
  Link2,
  ListChecks,
  Loader2,
  Sparkles,
  Target,
  Users
} from 'lucide-react';
import { getAiSettings, fetchCharterFieldDraft } from '../utils/aiAdvice';
import {
  buildCharterFieldAnalysis,
  CHARTER_FIELD_META,
  extractGoalSeedFromProblem,
  getBusinessCaseGroups,
  parseBrainstormKeywords
} from '../utils/businessCaseBuilder';

const VALUE_LEVERS = [
  '고객만족/충성도',
  '품질비용 절감',
  '매출/재계약',
  '리드타임/생산성',
  '안전/규제',
  '브랜드/신뢰',
  '직원경험',
  '전략과제 연계'
];

const FIELD_STYLE = {
  width: '100%',
  border: '1px solid #cbd5e1',
  borderRadius: 8,
  padding: '0.55rem 0.65rem',
  fontFamily: 'inherit',
  fontSize: '0.83rem'
};

const TECH_ICONS = [GitBranch, ArrowRight, ListChecks, CircleDollarSign];

const TechniqueBadge = ({ icon, title, text, color }) => (
  <div style={{
    display: 'flex', gap: 8, alignItems: 'flex-start', padding: '0.65rem',
    background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 9
  }}>
    <span style={{ color: color || '#2563eb', marginTop: 1 }}>{icon}</span>
    <div>
      <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.8rem' }}>{title}</div>
      <div style={{ color: '#64748b', fontSize: '0.72rem', marginTop: 2, lineHeight: 1.4 }}>{text}</div>
    </div>
  </div>
);

/**
 * mode: 'business' | 'problem' | 'goal'
 */
const BusinessCaseBuilder = ({
  mode = 'business',
  currentValue = '',
  projectTitle = '',
  industryName = '',
  methodology = '',
  opportunity = '',
  relatedContext = '',
  problemStatement = '',
  onApply
}) => {
  const meta = CHARTER_FIELD_META[mode] || CHARTER_FIELD_META.business;
  const [open, setOpen] = useState(false);
  const [keywordText, setKeywordText] = useState('');
  const [fiveW2h, setFiveW2h] = useState({
    who: '',
    what: opportunity || '',
    when: '',
    where: '',
    evidence: '',
    how: ''
  });
  const [valueLevers, setValueLevers] = useState([]);
  const [isIsNot, setIsIsNot] = useState({ is: '', isNot: '' });
  const [smart, setSmart] = useState({
    metric: '',
    baseline: '',
    target: '',
    deadline: '',
    relevant: ''
  });
  const [draft, setDraft] = useState('');
  const [aiBusy, setAiBusy] = useState(false);
  const [error, setError] = useState('');
  const smartTouched = useRef({});

  const goalSeed = useMemo(
    () => (mode === 'goal' ? extractGoalSeedFromProblem(problemStatement) : null),
    [mode, problemStatement]
  );

  // 목표기술서는 문제기술서의 지표·현재 수준을 상속한다. 사용자가 고친 칸은 덮어쓰지 않는다.
  useEffect(() => {
    if (mode !== 'goal' || !goalSeed?.found) return;
    setSmart((prev) => ({
      ...prev,
      metric: smartTouched.current.metric ? prev.metric : (goalSeed.metric || prev.metric),
      baseline: smartTouched.current.baseline ? prev.baseline : (goalSeed.baseline || prev.baseline)
    }));
  }, [mode, goalSeed]);

  const updateSmart = (key, value) => {
    smartTouched.current[key] = true;
    setSmart((prev) => ({ ...prev, [key]: value }));
  };

  const reinheritFromProblem = () => {
    if (!goalSeed?.found) return;
    smartTouched.current.metric = false;
    smartTouched.current.baseline = false;
    setSmart((prev) => ({
      ...prev,
      metric: goalSeed.metric || prev.metric,
      baseline: goalSeed.baseline || prev.baseline
    }));
  };

  const keywords = useMemo(() => parseBrainstormKeywords(keywordText), [keywordText]);
  const analysis = useMemo(
    () => buildCharterFieldAnalysis(mode, {
      keywordText,
      fiveW2h,
      valueLevers,
      projectTitle,
      methodology,
      isIsNot,
      smart,
      problemStatement
    }),
    [mode, keywordText, fiveW2h, valueLevers, projectTitle, methodology, isIsNot, smart, problemStatement]
  );
  const groupDefs = getBusinessCaseGroups();

  const canGenerate = keywords.length >= 3
    || !!fiveW2h.what
    || !!smart.metric
    || !!isIsNot.is
    || !!goalSeed?.found;

  const generateLocal = () => {
    setError('');
    if (!canGenerate) {
      setError('키워드를 3개 이상 입력하거나, 핵심 보완 칸(문제/지표)을 채워 주세요.');
      return;
    }
    setDraft(analysis.draft);
  };

  const generateAi = async () => {
    if (!canGenerate) {
      setError('키워드를 3개 이상 입력하거나, 핵심 보완 칸(문제/지표)을 채워 주세요.');
      return;
    }
    if (!getAiSettings().apiKey) {
      setError('AI 설정에 API 키가 없습니다. 먼저 「초안 만들기」로 로컬 초안을 만들 수 있습니다.');
      return;
    }
    setAiBusy(true);
    setError('');
    try {
      const text = await fetchCharterFieldDraft({
        mode,
        keywords: analysis.keywords,
        groups: analysis.groups,
        fiveW2h,
        valueLevers,
        causalChain: analysis.causalChain,
        isIsNot,
        smart,
        projectTitle,
        industryName,
        methodology,
        relatedContext
      });
      setDraft(text);
    } catch (err) {
      setError(err.message || 'AI 초안 생성에 실패했습니다.');
    } finally {
      setAiBusy(false);
    }
  };

  const applyDraft = () => {
    if (!draft.trim()) return;
    if (currentValue.trim() && currentValue.trim() !== draft.trim()) {
      const ok = window.confirm(`현재 ${meta.label}을(를) 제안 초안으로 교체할까요?`);
      if (!ok) return;
    }
    onApply(draft.trim());
    setOpen(false);
  };

  const keywordPlaceholder = mode === 'goal'
    ? '예: 반복 클레임률, 현재 18%, 목표 9%, 6개월, CSAT, 재발 방지, 보상비 절감'
    : mode === 'problem'
      ? '예: 최근 3개월, 고객센터, 반복 클레임, 월 120건, 응답 지연, OEM 아님, 제품A만'
      : '예: 고객불만 증가, 반복 클레임, 응답 지연, 보상비, 재구매 저하,\nVOC 분류 미흡, 상담사, 월 120건, 브랜드 신뢰, 재발 방지';

  return (
    <div style={{ marginBottom: '0.75rem', border: `1px solid ${meta.border}`, borderRadius: 10, overflow: 'hidden' }}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        style={{
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          gap: 8, padding: '0.65rem 0.75rem', border: 0, cursor: 'pointer',
          background: meta.headerBg, color: meta.headerColor, fontWeight: 800, textAlign: 'left'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <Lightbulb size={16} /> {meta.title}
        </span>
        <ChevronDown size={16} style={{ transform: open ? 'rotate(180deg)' : undefined }} />
      </button>

      {open && (
        <div style={{ padding: '0.85rem', background: 'white' }}>
          <div style={{ fontSize: '0.78rem', color: '#475569', lineHeight: 1.55, marginBottom: '0.75rem' }}>
            {meta.hint}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 6, marginBottom: '0.8rem' }}>
            {meta.techniques.map((tech, idx) => {
              const Icon = TECH_ICONS[idx] || Lightbulb;
              return (
                <TechniqueBadge
                  key={tech.title}
                  icon={<Icon size={15} />}
                  title={tech.title}
                  text={tech.text}
                  color={meta.headerColor}
                />
              );
            })}
          </div>

          <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: 5 }}>
            1. 자유 키워드 ({keywords.length}개)
          </label>
          <textarea
            value={keywordText}
            onChange={(event) => setKeywordText(event.target.value)}
            placeholder={keywordPlaceholder}
            style={{ ...FIELD_STYLE, minHeight: 90, resize: 'vertical' }}
          />

          {keywords.length > 0 && (
            <div style={{ marginTop: '0.65rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: 5 }}>친화도 자동 그룹핑</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: 6 }}>
                {groupDefs.map((group) => {
                  const items = analysis.groups[group.id] || [];
                  if (!items.length) return null;
                  return (
                    <div key={group.id} style={{ border: `1px solid ${group.color}40`, borderRadius: 8, padding: '0.5rem', background: `${group.color}08` }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: group.color, marginBottom: 4 }}>{group.label}</div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {items.map((item) => (
                          <span key={item} style={{ fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: 999, background: 'white', color: '#334155', border: '1px solid #e2e8f0' }}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ marginTop: '0.85rem', fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>2. 5W2H로 빈칸 보완 (선택)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: 6, marginTop: 6 }}>
            {[
              ['who', '누가 영향을 받나요?', Users],
              ['what', '무슨 문제인가요?', AlertTriangle],
              ['when', '언제부터/얼마나 자주?', Target],
              ['where', '어느 제품·공정·채널?', GitBranch],
              ['evidence', '현재 수치·근거는?', ListChecks],
              ['how', mode === 'goal' ? '어떤 개선 경로인가요?' : '어떤 개선 기회인가요?', Sparkles]
            ].map(([key, placeholder, Icon]) => (
              <div key={key} style={{ position: 'relative' }}>
                <Icon size={13} color="#64748b" style={{ position: 'absolute', left: 8, top: 10 }} />
                <input
                  value={fiveW2h[key]}
                  onChange={(event) => setFiveW2h((prev) => ({ ...prev, [key]: event.target.value }))}
                  placeholder={placeholder}
                  style={{ ...FIELD_STYLE, paddingLeft: 27 }}
                />
              </div>
            ))}
          </div>

          {mode === 'problem' && (
            <>
              <div style={{ marginTop: '0.85rem', fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                3. Is / Is Not (문제 경계)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginTop: 6 }}>
                <textarea
                  value={isIsNot.is}
                  onChange={(e) => setIsIsNot((prev) => ({ ...prev, is: e.target.value }))}
                  placeholder="Is: 해당되는 현상·제품·기간·장소"
                  style={{ ...FIELD_STYLE, minHeight: 64, resize: 'vertical' }}
                />
                <textarea
                  value={isIsNot.isNot}
                  onChange={(e) => setIsIsNot((prev) => ({ ...prev, isNot: e.target.value }))}
                  placeholder="Is Not: 해당되지 않는 것(범위 밖)"
                  style={{ ...FIELD_STYLE, minHeight: 64, resize: 'vertical' }}
                />
              </div>
            </>
          )}

          {mode === 'goal' && (
            <>
              <div style={{
                marginTop: '0.85rem', padding: '0.6rem 0.7rem', borderRadius: 8,
                background: goalSeed?.found ? '#ecfdf5' : '#fffbeb',
                border: `1px solid ${goalSeed?.found ? '#a7f3d0' : '#fcd34d'}`,
                fontSize: '0.75rem', color: goalSeed?.found ? '#065f46' : '#92400e', lineHeight: 1.5
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, marginBottom: 3 }}>
                  <Link2 size={14} /> 문제기술서 연계
                </div>
                {goalSeed?.found ? (
                  <>
                    상속됨 — 지표: <strong>{goalSeed.metric || '(미검출)'}</strong>, 현재 수준: <strong>{goalSeed.baseline || '(미검출)'}</strong>
                    {goalSeed.scope ? <>, 범위: <strong>{goalSeed.scope}</strong></> : null}
                    <button
                      type="button"
                      onClick={reinheritFromProblem}
                      style={{
                        marginLeft: 8, border: '1px solid #10b981', background: 'white', color: '#047857',
                        borderRadius: 6, padding: '0.1rem 0.4rem', fontSize: '0.7rem', cursor: 'pointer'
                      }}
                    >
                      다시 가져오기
                    </button>
                  </>
                ) : (
                  '문제기술서에서 지표·현재 수준을 찾지 못했습니다. 문제기술서에 수치를 넣거나 아래에 직접 입력하세요.'
                )}
              </div>

              <div style={{ marginTop: '0.7rem', fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                3. SMART 입력 (지표·현재 수준은 자동 상속)
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(145px, 1fr))', gap: 6, marginTop: 6 }}>
                {[
                  ['metric', '측정 지표 Y (예: 클레임률)'],
                  ['baseline', '현재 수준 Baseline'],
                  ['target', '목표 수준 Target'],
                  ['deadline', '완료 기한 (예: 6개월 내)'],
                  ['relevant', '관련성 (전략·고객 가치)']
                ].map(([key, placeholder]) => {
                  const inherited = goalSeed?.found
                    && !smartTouched.current[key]
                    && (key === 'metric' || key === 'baseline')
                    && !!smart[key];
                  return (
                    <input
                      key={key}
                      value={smart[key]}
                      onChange={(e) => updateSmart(key, e.target.value)}
                      placeholder={placeholder}
                      title={inherited ? '문제기술서에서 상속됨 — 수정 가능' : undefined}
                      style={{
                        ...FIELD_STYLE,
                        background: inherited ? '#ecfdf5' : 'white',
                        borderColor: inherited ? '#a7f3d0' : '#cbd5e1'
                      }}
                    />
                  );
                })}
              </div>
            </>
          )}

          {(mode === 'business' || mode === 'goal') && (
            <>
              <div style={{ marginTop: '0.85rem', fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
                {mode === 'goal' ? '4. 중요 가치 선택 (복수 선택)' : '3. 중요 가치 선택 (복수 선택)'}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginTop: 6 }}>
                {VALUE_LEVERS.map((lever) => {
                  const selected = valueLevers.includes(lever);
                  return (
                    <button
                      key={lever}
                      type="button"
                      onClick={() => setValueLevers((prev) => selected ? prev.filter((item) => item !== lever) : [...prev, lever])}
                      style={{
                        border: selected ? `1px solid ${meta.headerColor}` : '1px solid #cbd5e1',
                        background: selected ? meta.headerBg : 'white',
                        color: selected ? meta.headerColor : '#475569',
                        borderRadius: 999, padding: '0.3rem 0.55rem', cursor: 'pointer', fontSize: '0.72rem'
                      }}
                    >
                      {lever}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {keywords.length > 0 && (
            <div style={{ marginTop: '0.85rem', padding: '0.65rem', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#334155', marginBottom: 5 }}>추정 인과사슬</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap', color: '#475569', fontSize: '0.72rem' }}>
                <span>{analysis.causalChain.cause}</span><ArrowRight size={13} />
                <span>{analysis.causalChain.problem}</span><ArrowRight size={13} />
                <span>{analysis.causalChain.impact}</span><ArrowRight size={13} />
                <span style={{ color: '#047857', fontWeight: 700 }}>{analysis.causalChain.opportunity}</span>
              </div>
            </div>
          )}

          {analysis.missing.length > 0 && (
            <div style={{ marginTop: '0.65rem', fontSize: '0.72rem', color: '#92400e', background: '#fffbeb', borderRadius: 7, padding: '0.5rem 0.65rem' }}>
              <strong>근거 보완 제안:</strong> {analysis.missing.join(', ')}
            </div>
          )}

          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: '0.85rem' }}>
            <button type="button" className="btn-primary" onClick={generateLocal}>
              <Lightbulb size={14} /> 초안 만들기
            </button>
            <button type="button" className="btn-secondary" onClick={generateAi} disabled={aiBusy}>
              {aiBusy ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}
              {aiBusy ? 'AI 정리 중…' : 'AI로 다듬기'}
            </button>
          </div>

          {error && <div style={{ marginTop: 7, color: '#dc2626', fontSize: '0.75rem' }}>{error}</div>}

          {draft && (
            <div style={{ marginTop: '0.85rem' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#334155', marginBottom: 5 }}>
                제안 초안 — 적용 전에 자유롭게 수정하세요
              </label>
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                style={{ ...FIELD_STYLE, minHeight: 150, resize: 'vertical', lineHeight: 1.6, background: '#f8fafc' }}
              />
              <button type="button" className="btn-primary" onClick={applyDraft} style={{ marginTop: 7 }}>
                <Target size={14} /> {meta.applyLabel}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BusinessCaseBuilder;
