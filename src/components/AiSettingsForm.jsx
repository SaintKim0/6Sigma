import React, { useEffect, useState } from 'react';
import { KeyRound, Save, Trash2, CheckCircle2 } from 'lucide-react';
import { getAiSettings, saveAiSettings, clearAiApiKey } from '../utils/aiAdvice';

/**
 * OpenAI 호환 API 키 설정 (브라우저 localStorage)
 */
const AiSettingsForm = ({ compact = false, onSaved }) => {
  const [settings, setSettings] = useState(() => getAiSettings());
  const [savedMsg, setSavedMsg] = useState('');

  useEffect(() => {
    setSettings(getAiSettings());
  }, []);

  const save = () => {
    saveAiSettings(settings);
    setSavedMsg('저장됨 — 분석 결과의 「AI 심화 조언」에서 바로 사용됩니다.');
    onSaved?.(settings);
    setTimeout(() => setSavedMsg(''), 3500);
  };

  const clearKey = () => {
    clearAiApiKey();
    setSettings(s => ({ ...s, apiKey: '' }));
    setSavedMsg('API 키를 삭제했습니다.');
    onSaved?.({ ...settings, apiKey: '' });
    setTimeout(() => setSavedMsg(''), 2500);
  };

  return (
    <div className={compact ? '' : 'ai-settings-panel'}>
      {!compact && (
        <div style={{ marginBottom: 10 }}>
          <strong style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#0f172a' }}>
            <KeyRound size={18} color="#7c3aed" /> AI 조언 API 설정
          </strong>
          <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
            통계 결과는 <b>규칙 기반 해석·대응방안</b>이 기본입니다.
            API 키를 넣으면 같은 결과에 대해 AI가 현장형 조언을 추가로 생성합니다.
            키는 이 브라우저에만 저장되며, 지정한 API로만 전송됩니다.
          </p>
        </div>
      )}

      <div style={{ display: 'grid', gap: 8 }}>
        <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
          API Key
          <input
            type="password"
            autoComplete="off"
            placeholder="sk-..."
            value={settings.apiKey}
            onChange={e => setSettings(s => ({ ...s, apiKey: e.target.value }))}
            style={{
              display: 'block', width: '100%', marginTop: 4,
              padding: '0.5rem 0.65rem', borderRadius: 8, border: '1px solid #cbd5e1',
              fontFamily: 'inherit', boxSizing: 'border-box'
            }}
          />
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: compact ? '1fr' : '1.4fr 1fr', gap: 8 }}>
          <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
            Base URL
            <input
              value={settings.baseUrl}
              onChange={e => setSettings(s => ({ ...s, baseUrl: e.target.value }))}
              placeholder="https://api.openai.com/v1"
              style={{
                display: 'block', width: '100%', marginTop: 4,
                padding: '0.5rem 0.65rem', borderRadius: 8, border: '1px solid #cbd5e1',
                fontFamily: 'inherit', boxSizing: 'border-box'
              }}
            />
          </label>
          <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
            Model
            <input
              value={settings.model}
              onChange={e => setSettings(s => ({ ...s, model: e.target.value }))}
              placeholder="gpt-4o-mini"
              style={{
                display: 'block', width: '100%', marginTop: 4,
                padding: '0.5rem 0.65rem', borderRadius: 8, border: '1px solid #cbd5e1',
                fontFamily: 'inherit', boxSizing: 'border-box'
              }}
            />
          </label>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
        <button type="button" className="btn-primary" onClick={save}>
          <Save size={14} /> 설정 저장
        </button>
        <button type="button" className="btn-manual-link" onClick={clearKey}>
          <Trash2 size={14} /> 키 삭제
        </button>
        {settings.apiKey ? (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', color: '#059669', fontWeight: 600 }}>
            <CheckCircle2 size={14} /> 키 입력됨
          </span>
        ) : (
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>키 없음 — 규칙 기반 해석만 사용</span>
        )}
      </div>
      {savedMsg && (
        <div style={{ marginTop: 8, fontSize: '0.85rem', color: '#059669', fontWeight: 600 }}>{savedMsg}</div>
      )}
    </div>
  );
};

export default AiSettingsForm;
