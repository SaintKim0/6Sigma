import React, { useEffect, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  HelpCircle,
  Lightbulb,
  ListChecks,
  XCircle
} from 'lucide-react';
import { FUNDAMENTALS_CHAPTERS, getFundamentalsChapter } from '../data/sixSigmaFundamentals';

const cardGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
  gap: 10,
  marginTop: 10
};

const InfographicBlock = ({ info }) => {
  if (!info) return null;
  if (info.type === 'image') {
    return (
      <figure style={{
        margin: '1rem 0 0.25rem',
        border: '1px solid #e2e8f0',
        borderRadius: 12,
        overflow: 'hidden',
        background: '#f8fafc'
      }}>
        <img
          src={info.src}
          alt={info.alt || ''}
          style={{ width: '100%', display: 'block', maxHeight: 420, objectFit: 'contain', background: '#fff' }}
        />
        {info.caption && (
          <figcaption style={{
            padding: '0.65rem 0.85rem',
            fontSize: '0.8rem',
            color: '#475569',
            lineHeight: 1.45,
            borderTop: '1px solid #e2e8f0'
          }}>
            {info.caption}
          </figcaption>
        )}
      </figure>
    );
  }
  return null;
};

const IcebergLegend = () => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '1fr 1.4fr',
    gap: 8,
    marginTop: 12
  }}
    className="iceberg-legend"
  >
    <div style={{
      borderRadius: 12, padding: '0.85rem',
      background: 'linear-gradient(180deg, #e0f2fe 0%, #bae6fd 100%)',
      border: '1px solid #7dd3fc'
    }}>
      <div style={{ fontWeight: 800, color: '#0369a1', fontSize: '0.82rem', marginBottom: 6 }}>수면 위 · 보이는 비용</div>
      <div style={{ fontSize: '0.75rem', color: '#0c4a6e', lineHeight: 1.55 }}>
        재작업 · 스크랩 · 보증 · 클레임
        <div style={{ marginTop: 6, opacity: 0.85 }}>상대적으로 집계하기 쉽지만, 전체의 일부입니다.</div>
      </div>
    </div>
    <div style={{
      borderRadius: 12, padding: '0.85rem',
      background: 'linear-gradient(180deg, #1e3a5f 0%, #0f172a 100%)',
      border: '1px solid #334155', color: '#e2e8f0'
    }}>
      <div style={{ fontWeight: 800, color: '#7dd3fc', fontSize: '0.82rem', marginBottom: 6 }}>바다 아래 · 숨은 비용</div>
      <div style={{ fontSize: '0.75rem', lineHeight: 1.55 }}>
        과잉검사 · 재고 · 특근 · 이탈 · 신뢰손실 · 기회손실
        <div style={{ marginTop: 6, color: '#94a3b8' }}>장부에 안 보여도 조직이 실제로 치르는 비용입니다.</div>
      </div>
    </div>
  </div>
);

const SigmaMeaningStrip = () => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 8,
    margin: '0.75rem 0 0.25rem'
  }}
    className="sigma-strip"
  >
    {[
      { s: '3σ', y: '수율 ~93.3%', d: 'DPMO ~66,807', tone: '#b45309' },
      { s: '4σ', y: '수율 ~99.4%', d: 'DPMO ~6,210', tone: '#0369a1' },
      { s: '6σ', y: '수율 ~99.9997%', d: 'DPMO ~3.4', tone: '#059669' }
    ].map((row) => (
      <div key={row.s} style={{
        borderRadius: 10, padding: '0.7rem 0.75rem',
        border: `1.5px solid ${row.tone}55`, background: `${row.tone}10`
      }}>
        <div style={{ fontWeight: 900, color: row.tone, fontSize: '1.1rem' }}>{row.s}</div>
        <div style={{ fontSize: '0.75rem', color: '#334155', marginTop: 4 }}>{row.y}</div>
        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{row.d}</div>
      </div>
    ))}
  </div>
);

const ChapterQuiz = ({ quiz, onPassed }) => {
  const [picked, setPicked] = useState(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setPicked(null);
    setRevealed(false);
  }, [quiz?.q]);

  const correct = !!(quiz && revealed && picked === quiz.answer);

  useEffect(() => {
    if (correct) onPassed?.(true);
  }, [correct, onPassed]);

  if (!quiz) return null;

  return (
    <section className="learn-section learn-quiz" style={{
      marginTop: '1.15rem',
      padding: '1rem 1.05rem',
      border: '1px solid #bfdbfe',
      borderRadius: 12,
      background: '#eff6ff'
    }}>
      <h3 style={{
        margin: '0 0 0.5rem', fontSize: '1.02rem', color: '#1e40af',
        display: 'flex', alignItems: 'center', gap: 6
      }}>
        <HelpCircle size={16} /> 이해 확인
      </h3>
      <p style={{ fontWeight: 600, marginBottom: 10, color: '#0f172a' }}>{quiz.q}</p>
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
        {revealed && !correct && (
          <button
            type="button"
            className="btn-secondary"
            style={{ fontSize: '0.8rem' }}
            onClick={() => { setPicked(null); setRevealed(false); onPassed?.(false); }}
          >
            다시 풀기
          </button>
        )}
      </div>
      {revealed && (
        <p style={{ marginTop: 10, fontSize: '0.88rem', color: '#334155', lineHeight: 1.55 }}>
          {quiz.explain}
        </p>
      )}
    </section>
  );
};

export const FundamentalsChapterView = ({ chapterId, onBack, onMarkDone }) => {
  const chapter = getFundamentalsChapter(chapterId);
  const [quizPassed, setQuizPassed] = useState(false);

  useEffect(() => {
    setQuizPassed(false);
  }, [chapterId]);

  if (!chapter) {
    return (
      <div style={{ padding: '1rem', color: '#64748b' }}>
        챕터를 찾을 수 없습니다.
        <button type="button" className="btn-secondary" style={{ marginLeft: 8 }} onClick={onBack}>뒤로</button>
      </div>
    );
  }

  const canComplete = !chapter.quiz || quizPassed;

  return (
    <article className="fundamentals-chapter" style={{ maxWidth: 820 }}>
      <button
        type="button"
        className="btn-secondary"
        onClick={onBack}
        style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 12, fontSize: '0.85rem' }}
      >
        <ArrowLeft size={15} /> 기초 목록으로
      </button>

      <header style={{ marginBottom: '1.1rem' }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
          <span style={{
            fontSize: '0.7rem', fontWeight: 800, color: '#1d4ed8', background: '#dbeafe',
            padding: '0.15rem 0.5rem', borderRadius: 999
          }}>기초</span>
          <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Clock size={13} /> 약 {chapter.minutes}분
          </span>
        </div>
        <h2 style={{ margin: '0 0 0.4rem', color: '#0f172a' }}>{chapter.title}</h2>
        <p style={{ margin: 0, color: '#475569', lineHeight: 1.55 }}>{chapter.summary}</p>
      </header>

      {chapter.id === 'what_is' && <SigmaMeaningStrip />}

      {chapter.keyTakeaways?.length > 0 && (
        <section style={{
          marginBottom: '0.25rem',
          padding: '0.9rem 1rem',
          borderRadius: 12,
          border: '1px solid #a7f3d0',
          background: '#ecfdf5'
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontWeight: 800, color: '#065f46', fontSize: '0.88rem', marginBottom: 8
          }}>
            <ListChecks size={16} /> 이 챕터 한눈에
          </div>
          <ul style={{ margin: 0, paddingLeft: '1.1rem', color: '#134e4a', fontSize: '0.86rem', lineHeight: 1.55 }}>
            {chapter.keyTakeaways.map((t, i) => <li key={i}>{t}</li>)}
          </ul>
        </section>
      )}

      {chapter.sections.map((section, idx) => (
        <section key={idx} style={{
          marginTop: '1.15rem',
          padding: '1rem 1.05rem',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
          background: '#fff'
        }}>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.02rem', color: '#0f172a' }}>{section.heading}</h3>
          {section.body && (
            <p style={{ margin: 0, color: '#334155', lineHeight: 1.65, fontSize: '0.92rem' }}>{section.body}</p>
          )}
          {section.bullets && (
            <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.15rem', color: '#334155', lineHeight: 1.6, fontSize: '0.9rem' }}>
              {section.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          )}
          {section.cards && (
            <div style={cardGrid}>
              {section.cards.map((card) => (
                <div key={card.title} style={{
                  border: '1px solid #e2e8f0', borderRadius: 10, padding: '0.75rem',
                  background: '#f8fafc'
                }}>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>{card.title}</div>
                  <div style={{ fontSize: '0.7rem', color: '#0369a1', fontWeight: 700, marginTop: 2 }}>{card.role}</div>
                  <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: 6, lineHeight: 1.45 }}>{card.text}</div>
                </div>
              ))}
            </div>
          )}
          <InfographicBlock info={section.infographic} />
          {chapter.id === 'iceberg' && section.infographic?.src?.includes('iceberg') && <IcebergLegend />}
          {section.callout && (
            <div style={{
              marginTop: 10, display: 'flex', gap: 8, alignItems: 'flex-start',
              background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 8,
              padding: '0.65rem 0.75rem', fontSize: '0.82rem', color: '#92400e', lineHeight: 1.5
            }}>
              <Lightbulb size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <span>{section.callout}</span>
            </div>
          )}
        </section>
      ))}

      <ChapterQuiz quiz={chapter.quiz} onPassed={setQuizPassed} />

      {onMarkDone && (
        <div style={{ marginTop: '1.25rem' }}>
          <button
            type="button"
            className="btn-primary"
            disabled={!canComplete}
            title={!canComplete ? '퀴즈를 맞춘 뒤 완료할 수 있습니다' : undefined}
            onClick={onMarkDone}
            style={{ opacity: canComplete ? 1 : 0.5 }}
          >
            이 챕터 학습 완료로 표시
          </button>
          {!canComplete && (
            <div style={{ marginTop: 6, fontSize: '0.78rem', color: '#b45309' }}>
              아래 이해 확인 퀴즈를 맞추면 완료 표시가 활성화됩니다.
            </div>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .iceberg-legend, .sigma-strip { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </article>
  );
};

export const FundamentalsHub = ({ onOpenChapter }) => (
  <div>
    <p style={{ margin: '0 0 0.85rem', color: '#475569', fontSize: '0.88rem', lineHeight: 1.55 }}>
      도구를 만지기 전에, 6시그마가 <b>어디서 왔고</b> <b>왜 필요한지</b>를 먼저 잡습니다.
      각 챕터 끝의 <b>이해 확인 퀴즈</b>를 맞추면 학습 완료로 표시할 수 있습니다.
    </p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {FUNDAMENTALS_CHAPTERS.map((ch, idx) => (
        <button
          key={ch.id}
          type="button"
          onClick={() => onOpenChapter(ch.id)}
          style={{
            textAlign: 'left', padding: '0.85rem 0.95rem', borderRadius: 12, cursor: 'pointer',
            border: '1px solid #e2e8f0', background: '#fff'
          }}
        >
          <div style={{ fontSize: '0.68rem', color: '#94a3b8', fontWeight: 700 }}>
            CHAPTER {idx + 1} · {ch.minutes}분 · 퀴즈 1문항
          </div>
          <div style={{ fontWeight: 800, color: '#0f172a', marginTop: 2 }}>{ch.title}</div>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 4, lineHeight: 1.45 }}>{ch.summary}</div>
        </button>
      ))}
    </div>
  </div>
);

export default FundamentalsChapterView;
