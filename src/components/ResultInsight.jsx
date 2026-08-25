import React, { useMemo, useState } from 'react';
import { Lightbulb, ListChecks, Sparkles, ChevronDown, Loader2 } from 'lucide-react';
import { buildInsight, TOOL_INSIGHT_LABELS } from '../utils/resultInsights';
import { getAiSettings, fetchAiAdvice } from '../utils/aiAdvice';
import AiSettingsForm from './AiSettingsForm';

const severityStyle = {
  ok: { border: '#86efac', bg: '#f0fdf4', title: '#166534', badge: '#16a34a' },
  watch: { border: '#fcd34d', bg: '#fffbeb', title: '#92400e', badge: '#d97706' },
  alert: { border: '#fca5a5', bg: '#fef2f2', title: '#991b1b', badge: '#dc2626' },
  info: { border: '#93c5fd', bg: '#eff6ff', title: '#1e40af', badge: '#2563eb' }
};

/**
 * 분석 결과 해석 + 대응방안 (+ 선택적 AI 조언)
 */
const ResultInsight = ({ toolId, result, context = '' }) => {
  const insight = useMemo(() => buildInsight(toolId, result), [toolId, result]);
  const theme = severityStyle[insight.severity] || severityStyle.info;
  const label = TOOL_INSIGHT_LABELS[toolId] || toolId;

  const [showAi, setShowAi] = useState(false);
  const [hasKey, setHasKey] = useState(() => !!getAiSettings().apiKey);
  const [aiText, setAiText] = useState('');
  const [aiBusy, setAiBusy] = useState(false);
  const [aiError, setAiError] = useState('');

  const askAi = async () => {
    setAiBusy(true);
    setAiError('');
    try {
      const text = await fetchAiAdvice({
        toolLabel: label,
        insight,
        result,
        context
      });
      setAiText(text);
    } catch (err) {
      setAiError(err.message || 'AI 요청 실패');
    } finally {
      setAiBusy(false);
    }
  };

  if (!result) return null;

  return (
    <div
      className="result-insight"
      style={{
        marginTop: '0.85rem',
        border: `1px solid ${theme.border}`,
        background: theme.bg,
        borderRadius: 12,
        padding: '0.85rem 1rem'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: theme.title, fontWeight: 800 }}>
          <Lightbulb size={18} />
          결과 해석 · 조언
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 700,
            color: 'white',
            background: theme.badge,
            padding: '0.15rem 0.5rem',
            borderRadius: 999
          }}>
            {insight.severity === 'ok' ? '양호' : insight.severity === 'watch' ? '주의' : insight.severity === 'alert' ? '조치필요' : '참고'}
          </span>
        </div>
        <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{label}</span>
      </div>

      <div style={{ marginTop: 8, fontSize: '1rem', fontWeight: 700, color: theme.title }}>
        {insight.summary}
      </div>

      <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.1rem', color: '#334155', fontSize: '0.88rem', lineHeight: 1.55 }}>
        {insight.interpretation.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>

      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#0f172a', fontSize: '0.9rem' }}>
        <ListChecks size={16} color="#0369a1" /> 대응방안
      </div>
      <ol style={{ margin: '0.35rem 0 0', paddingLeft: '1.2rem', color: '#0f172a', fontSize: '0.88rem', lineHeight: 1.55 }}>
        {insight.actions.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ol>

      <div style={{ marginTop: 12, borderTop: '1px dashed #cbd5e1', paddingTop: 10 }}>
        <button
          type="button"
          className="btn-manual-link"
          onClick={() => setShowAi(o => !o)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <Sparkles size={14} />
          AI 심화 조언 {hasKey ? '(키 준비됨)' : '(API 키 선택)'}
          <ChevronDown size={14} style={{ transform: showAi ? 'rotate(180deg)' : undefined }} />
        </button>

        {showAi && (
          <div style={{ marginTop: 10, background: 'white', border: '1px solid #e2e8f0', borderRadius: 10, padding: '0.75rem' }}>
            <AiSettingsForm
              compact
              onSaved={(s) => setHasKey(!!s?.apiKey)}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
              <button type="button" className="btn-primary" disabled={aiBusy} onClick={askAi}>
                {aiBusy ? <Loader2 size={14} className="spin" /> : <Sparkles size={14} />}
                {aiBusy ? '생성 중…' : 'AI 조언 받기'}
              </button>
            </div>
            {aiError && <div style={{ marginTop: 8, color: '#dc2626', fontSize: '0.85rem' }}>{aiError}</div>}
            {aiText && (
              <div style={{
                marginTop: 10,
                whiteSpace: 'pre-wrap',
                fontSize: '0.88rem',
                lineHeight: 1.55,
                color: '#0f172a',
                background: '#f8fafc',
                borderRadius: 8,
                padding: '0.75rem',
                border: '1px solid #e2e8f0'
              }}>
                {aiText}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultInsight;
