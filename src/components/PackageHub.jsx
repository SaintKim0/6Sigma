import React, { useMemo, useState } from 'react';
import {
  Map, Download, FileSpreadsheet, ShieldCheck, MessageSquare,
  FlaskConical, CheckCircle2, XCircle, Play, Share2, Copy, Send
} from 'lucide-react';
import { buildProjectStoryline } from '../utils/projectStoryline';
import { runAllValidations } from '../utils/statsValidation';
import { exportProjectPdf, exportProjectPptOutline } from '../utils/exportReport';
import { SAMPLE_PACKS, searchSamples, getSamplesByIndustry } from '../data/sampleLibrary';
import {
  listComments, addComment, createShareLink, redeemShareCode, getProjectRole
} from '../utils/collabStore';

/** 3) 프로젝트 스토리라인 */
export const ProjectStorylinePanel = ({
  data, methodology, completedTools, industryName, onExportReady
}) => {
  const story = useMemo(
    () => buildProjectStoryline({ data, methodology, completedTools, industryName }),
    [data, methodology, completedTools, industryName]
  );
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const doPdf = async () => {
    setBusy(true); setMsg('');
    try {
      await exportProjectPdf({
        data, methodology, completedTools, industryName,
        elementId: 'project-storyline-export'
      });
      setMsg('PDF를 저장했습니다.');
      onExportReady?.();
    } catch (e) {
      setMsg(e.message || 'PDF 실패');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div id="project-storyline-export" className="package-panel">
      <div className="package-panel-head">
        <Map size={18} color="#0369a1" />
        <div>
          <strong>프로젝트 스토리라인</strong>
          <div className="package-sub">{story.oneLiner}</div>
        </div>
      </div>
      <div className="story-phases">
        {story.phases.map(ph => (
          <div key={ph.id} className={`story-phase${ph.done ? ' done' : ''}`}>
            <div className="story-phase-title" style={{ borderColor: ph.color }}>
              {ph.done ? <CheckCircle2 size={14} color="#059669" /> : <span className="dot" style={{ background: ph.color }} />}
              {ph.title}
            </div>
            <ul>
              {ph.bullets.length ? ph.bullets.map((b, i) => <li key={i}>{b}</li>) : <li className="muted">아직 기록 없음</li>}
            </ul>
          </div>
        ))}
      </div>
      {(story.evidence.length > 0 || story.actions.length > 0) && (
        <div className="story-extra">
          {story.evidence.length > 0 && (
            <div>
              <b>핵심 증거</b>
              <ul>{story.evidence.map((e, i) => <li key={i}><b>{e.label}:</b> {e.text}</li>)}</ul>
            </div>
          )}
          {story.actions.length > 0 && (
            <div>
              <b>조치</b>
              <ul>{story.actions.map((a, i) => <li key={i}>{a}</li>)}</ul>
            </div>
          )}
        </div>
      )}
      <div className="package-actions">
        <button type="button" className="btn-primary" disabled={busy} onClick={doPdf}>
          <Download size={14} /> {busy ? '생성 중…' : 'PDF 내보내기'}
        </button>
        <button type="button" className="btn-manual-link" onClick={() => {
          exportProjectPptOutline({ data, methodology, completedTools, industryName });
          setMsg('PPT용 마크다운 개요를 다운로드했습니다.');
        }}>
          <FileSpreadsheet size={14} /> PPT 개요(.md)
        </button>
      </div>
      {msg && <div className="package-msg">{msg}</div>}
    </div>
  );
};

/** 4) 수치 검증 */
export const ValidationPanel = () => {
  const [rows, setRows] = useState(null);

  return (
    <div className="package-panel">
      <div className="package-panel-head">
        <ShieldCheck size={18} color="#059669" />
        <div>
          <strong>통계 엔진 검증</strong>
          <div className="package-sub">내장 벤치마크로 ANOVA·상관·공정능력·정규성 결과를 점검합니다.</div>
        </div>
      </div>
      <button type="button" className="btn-primary" onClick={() => setRows(runAllValidations())}>
        <Play size={14} /> 검증 실행
      </button>
      {rows && (
        <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {rows.map(r => (
            <div key={r.id} style={{
              border: `1px solid ${r.allPass ? '#86efac' : '#fca5a5'}`,
              background: r.allPass ? '#f0fdf4' : '#fef2f2',
              borderRadius: 10, padding: '0.75rem 0.9rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                <b>{r.name}</b>
                <span style={{ fontWeight: 700, color: r.allPass ? '#059669' : '#dc2626', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  {r.allPass ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  {r.allPass ? 'PASS' : 'CHECK'}
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: 4 }}>{r.description}</div>
              <ul style={{ margin: '6px 0 0', paddingLeft: '1.1rem', fontSize: '0.85rem' }}>
                {r.checks.map((c, i) => (
                  <li key={i} style={{ color: c.pass ? '#047857' : '#b91c1c' }}>
                    {c.key}: got={Number(c.got).toPrecision?.(4) ?? c.got} / exp≈{c.expected} (±{c.tol}) {c.note ? `· ${c.note}` : ''}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/** 6) 샘플 라이브러리 */
export const SampleLibraryPanel = ({ industryId, onApplySample }) => {
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const base = industryId ? getSamplesByIndustry(industryId) : SAMPLE_PACKS;
    if (!q.trim()) return base;
    const s = searchSamples(q);
    return s.filter(p => base.some(b => b.id === p.id));
  }, [industryId, q]);

  return (
    <div className="package-panel">
      <div className="package-panel-head">
        <FlaskConical size={18} color="#c2410c" />
        <div>
          <strong>샘플 데이터 라이브러리</strong>
          <div className="package-sub">업종·도구별 예제를 불러와 바로 분석하세요.</div>
        </div>
      </div>
      <input
        value={q}
        onChange={e => setQ(e.target.value)}
        placeholder="검색: ANOVA, GR&R, 냉각…"
        style={{ width: '100%', padding: '0.5rem 0.7rem', borderRadius: 8, border: '1px solid #cbd5e1', marginBottom: 10, boxSizing: 'border-box' }}
      />
      <div style={{ display: 'grid', gap: 8 }}>
        {list.map(p => (
          <div key={p.id} style={{
            display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center',
            border: '1px solid #e2e8f0', borderRadius: 10, padding: '0.7rem 0.85rem', background: '#fff'
          }}>
            <div>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.title}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                {p.industryLabel} · {p.phase} · {p.toolId} — {p.description}
              </div>
            </div>
            <button type="button" className="btn-primary" style={{ flexShrink: 0 }} onClick={() => onApplySample?.(p)}>
              적용
            </button>
          </div>
        ))}
        {list.length === 0 && <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>검색 결과 없음</div>}
      </div>
    </div>
  );
};

/** 7) 협업: 코멘트 + 공유 코드 */
export const CollaborationPanel = ({
  session, projectId, snapshot, activeStep, onImportShare
}) => {
  const [text, setText] = useState('');
  const [comments, setComments] = useState(() => listComments(projectId));
  const [shareCode, setShareCode] = useState('');
  const [redeem, setRedeem] = useState('');
  const [info, setInfo] = useState('');
  const role = getProjectRole(projectId, session?.userId);

  const refresh = () => setComments(listComments(projectId));

  const submit = () => {
    try {
      addComment(projectId, {
        author: session?.name || session?.email || '사용자',
        text,
        phase: activeStep
      });
      setText('');
      refresh();
      setInfo('코멘트를 추가했습니다.');
    } catch (e) {
      setInfo(e.message);
    }
  };

  const makeShare = () => {
    try {
      if (!session?.userId) throw new Error('로그인 후 공유할 수 있습니다.');
      const entry = createShareLink(session.userId, snapshot);
      setShareCode(entry.code);
      setInfo(`공유 코드: ${entry.code} (같은 브라우저/공유 PC에서 코드로 불러오기)`);
    } catch (e) {
      setInfo(e.message);
    }
  };

  const doRedeem = () => {
    try {
      const entry = redeemShareCode(redeem);
      onImportShare?.(entry);
      setInfo(`「${entry.title}」을(를) 불러올 준비가 되었습니다.`);
    } catch (e) {
      setInfo(e.message);
    }
  };

  return (
    <div className="package-panel">
      <div className="package-panel-head">
        <MessageSquare size={18} color="#7c3aed" />
        <div>
          <strong>협업 · 공유</strong>
          <div className="package-sub">
            역할: <b>{role}</b> · 프로젝트 코멘트와 공유 코드(로컬). 클라우드 동기와 함께 쓰면 팀 배포에 유리합니다.
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <b style={{ fontSize: '0.9rem' }}>코멘트</b>
          {!projectId && <div style={{ fontSize: '0.8rem', color: '#b45309', marginTop: 4 }}>프로젝트를 저장하면 코멘트가 활성화됩니다.</div>}
          <div style={{ maxHeight: 180, overflow: 'auto', marginTop: 8, border: '1px solid #e2e8f0', borderRadius: 8, padding: 8, background: '#f8fafc' }}>
            {comments.length === 0 && <div style={{ color: '#94a3b8', fontSize: '0.85rem' }}>아직 코멘트 없음</div>}
            {comments.map(c => (
              <div key={c.id} style={{ marginBottom: 8, fontSize: '0.85rem' }}>
                <b>{c.author}</b>
                <span style={{ color: '#94a3b8' }}> · {c.phase} · {new Date(c.createdAt).toLocaleString()}</span>
                <div>{c.text}</div>
              </div>
            ))}
          </div>
          <textarea
            rows={2}
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="피드백을 남기세요"
            style={{ width: '100%', marginTop: 8, padding: 8, borderRadius: 8, border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
            disabled={!projectId}
          />
          <button type="button" className="btn-primary" style={{ marginTop: 6 }} onClick={submit} disabled={!projectId}>
            <Send size={14} /> 등록
          </button>
        </div>
        <div>
          <b style={{ fontSize: '0.9rem' }}>공유 코드</b>
          <div style={{ marginTop: 8, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button type="button" className="btn-primary" onClick={makeShare}>
              <Share2 size={14} /> 코드 발급
            </button>
            {shareCode && (
              <button type="button" className="btn-manual-link" onClick={() => {
                navigator.clipboard?.writeText(shareCode);
                setInfo('코드를 복사했습니다.');
              }}>
                <Copy size={14} /> {shareCode}
              </button>
            )}
          </div>
          <div style={{ marginTop: 12, fontSize: '0.85rem', color: '#64748b' }}>코드로 불러오기</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <input
              value={redeem}
              onChange={e => setRedeem(e.target.value.toUpperCase())}
              placeholder="예: A1B2C3"
              style={{ flex: 1, padding: '0.45rem 0.6rem', borderRadius: 8, border: '1px solid #cbd5e1' }}
            />
            <button type="button" className="btn-manual-link" onClick={doRedeem}>불러오기</button>
          </div>
        </div>
      </div>
      {info && <div className="package-msg">{info}</div>}
    </div>
  );
};

/** 패키지 보완 허브 (스토리라인·검증·샘플·협업) */
export const PackageHub = (props) => {
  const [tab, setTab] = useState('story');
  return (
    <div className="fade-in">
      <h2 style={{ margin: '0 0 0.35rem', color: '#0f172a' }}>패키지 워크벤치</h2>
      <p style={{ margin: '0 0 1rem', color: '#64748b', fontSize: '0.95rem' }}>
        스토리라인 · 엔진 검증 · 샘플 데이터 · PDF 내보내기 · 협업을 한곳에서 사용합니다.
      </p>
      <div className="tool-group-tabs" style={{ marginBottom: 14 }}>
        {[
          { id: 'story', label: '스토리라인·내보내기' },
          { id: 'validate', label: '엔진 검증' },
          { id: 'samples', label: '샘플 라이브러리' },
          { id: 'collab', label: '협업·공유' }
        ].map(t => (
          <button
            key={t.id}
            type="button"
            className={`tool-group-tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'story' && <ProjectStorylinePanel {...props} />}
      {tab === 'validate' && <ValidationPanel />}
      {tab === 'samples' && (
        <SampleLibraryPanel industryId={props.industryId} onApplySample={props.onApplySample} />
      )}
      {tab === 'collab' && (
        <CollaborationPanel
          session={props.session}
          projectId={props.projectId}
          snapshot={props.snapshot}
          activeStep={props.activeStep}
          onImportShare={props.onImportShare}
        />
      )}
    </div>
  );
};

export default PackageHub;
