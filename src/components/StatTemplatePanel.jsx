import React, { useEffect, useId, useMemo, useState } from 'react';
import {
  Download, Upload, Settings2, Play, FileSpreadsheet, Info
} from 'lucide-react';
import {
  TOOL_TEMPLATE_TYPES,
  normalizeConfig,
  buildTemplateCsv,
  buildTemplateGuide,
  downloadBlob,
  parseUploadAgainstConfig,
  getTemplateHeaders,
  DEFAULT_EMPTY_ROWS
} from '../utils/statTemplates';
import { readFileAsText } from '../utils/dataImport';

/**
 * 분석방향 설정 → 맞춤 템플릿(확장 가능) → 업로드 → 자동 분석
 *
 * toolType: numbers | xy | groups | regression | grr | doe | contingency
 * onAnalyze(payload) — 파싱 성공 시 호출 (부모에서 상태 반영 + 분석 실행)
 */
const StatTemplatePanel = ({
  toolType = 'numbers',
  title,
  initialConfig,
  onAnalyze,
  autoAnalyze = true
}) => {
  const fileId = useId();
  const meta = TOOL_TEMPLATE_TYPES[toolType];
  const [config, setConfig] = useState(() => normalizeConfig(toolType, initialConfig));
  const [openSetup, setOpenSetup] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [paste, setPaste] = useState('');

  useEffect(() => {
    setConfig(normalizeConfig(toolType, initialConfig));
  }, [toolType]); // eslint-disable-line react-hooks/exhaustive-deps

  const headers = useMemo(() => getTemplateHeaders(config), [config]);

  const patch = (partial) => setConfig(prev => normalizeConfig(toolType, { ...prev, ...partial }));

  const handleDownload = () => {
    const csv = buildTemplateCsv(config);
    const guide = buildTemplateGuide(config);
    downloadBlob(`6sigma_${toolType}_template.csv`, csv);
    downloadBlob(`6sigma_${toolType}_안내.txt`, guide, 'text/plain;charset=utf-8');
    setInfo('템플릿 CSV와 안내 TXT를 저장했습니다. 엑셀에서 CSV를 열고 행을 늘려 데이터를 붙여넣으세요.');
    setError('');
  };

  const runParse = (text, label = '') => {
    const result = parseUploadAgainstConfig(text, config);
    if (!result.ok) {
      setError(result.message);
      setInfo('');
      return null;
    }
    setError('');
    setInfo(`${label ? label + ' · ' : ''}${result.preview} 반영${autoAnalyze ? ' · 분석 실행' : ''}`);
    onAnalyze?.(result);
    return result;
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setBusy(true);
    try {
      const text = await readFileAsText(file);
      setPaste(text);
      runParse(text, file.name);
    } catch (err) {
      setError(err.message || '업로드 실패');
    } finally {
      setBusy(false);
    }
  };

  const handlePasteApply = () => {
    if (!paste.trim()) {
      setError('붙여넣을 데이터가 없습니다.');
      return;
    }
    runParse(paste, '붙여넣기');
  };

  return (
    <div className="stat-template-panel">
      <div className="stat-template-head">
        <div>
          <strong style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FileSpreadsheet size={16} color="#0369a1" />
            {title || `데이터시트 · ${meta?.label || toolType}`}
          </strong>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 3 }}>
            분석방향 설정 → 템플릿 받기 → 엑셀에서 행 확장·붙여넣기 → 업로드 시 자동 분석
          </div>
        </div>
        <button type="button" className="btn-manual-link" onClick={() => setOpenSetup(o => !o)}>
          <Settings2 size={14} /> {openSetup ? '설정 접기' : '분석방향 설정'}
        </button>
      </div>

      {openSetup && (
        <div className="stat-template-setup">
          <div style={{ fontSize: '0.8rem', color: '#475569', marginBottom: 8 }}>
            <Info size={13} style={{ verticalAlign: -2, marginRight: 4 }} />
            {meta?.desc}. 템플릿 행 수는 기본값이며, 엑셀에서 <b>행을 더 추가</b>해도 됩니다.
          </div>

          {toolType === 'numbers' && (
            <div className="stat-setup-grid">
              <label>측정 열 이름
                <input value={config.columnName} onChange={e => patch({ columnName: e.target.value })} />
              </label>
              <label>빈 행 수 (확장 전)
                <input type="number" min={5} max={500} value={config.emptyRows}
                  onChange={e => patch({ emptyRows: Number(e.target.value) })} />
              </label>
            </div>
          )}

          {toolType === 'xy' && (
            <div className="stat-setup-grid">
              <label>독립변수 X 이름
                <input value={config.xName} onChange={e => patch({ xName: e.target.value })} />
              </label>
              <label>종속변수 Y 이름
                <input value={config.yName} onChange={e => patch({ yName: e.target.value })} />
              </label>
              <label>빈 행 수
                <input type="number" min={5} max={500} value={config.emptyRows}
                  onChange={e => patch({ emptyRows: Number(e.target.value) })} />
              </label>
            </div>
          )}

          {toolType === 'groups' && (
            <div>
              <div className="stat-setup-grid">
                <label>그룹(변수) 개수
                  <input type="number" min={2} max={12} value={config.groupCount}
                    onChange={e => patch({
                      groupCount: Number(e.target.value),
                      groupNames: Array.from({ length: Number(e.target.value) || 2 }, (_, i) =>
                        config.groupNames?.[i] || `그룹${String.fromCharCode(65 + i)}`
                      )
                    })} />
                </label>
                <label>그룹당 빈 행 수
                  <input type="number" min={5} max={500} value={config.emptyRows}
                    onChange={e => patch({ emptyRows: Number(e.target.value) })} />
                </label>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: 6, marginTop: 8 }}>
                {config.groupNames?.map((n, i) => (
                  <input key={i} value={n} placeholder={`그룹${i + 1}`}
                    onChange={e => {
                      const next = [...config.groupNames];
                      next[i] = e.target.value;
                      patch({ groupNames: next });
                    }} />
                ))}
              </div>
            </div>
          )}

          {toolType === 'regression' && (
            <div>
              <div className="stat-setup-grid">
                <label>독립변수(X) 개수
                  <input type="number" min={1} max={10} value={config.xCount}
                    onChange={e => patch({
                      xCount: Number(e.target.value),
                      xNames: Array.from({ length: Number(e.target.value) || 1 }, (_, i) =>
                        config.xNames?.[i] || `X${i + 1}`
                      )
                    })} />
                </label>
                <label>종속변수 Y 이름
                  <input value={config.yName} onChange={e => patch({ yName: e.target.value })} />
                </label>
                <label>빈 행 수
                  <input type="number" min={5} max={500} value={config.emptyRows}
                    onChange={e => patch({ emptyRows: Number(e.target.value) })} />
                </label>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', margin: '6px 0' }}>X 변수 이름</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: 6 }}>
                {config.xNames?.map((n, i) => (
                  <input key={i} value={n}
                    onChange={e => {
                      const next = [...config.xNames];
                      next[i] = e.target.value;
                      patch({ xNames: next });
                    }} />
                ))}
              </div>
            </div>
          )}

          {toolType === 'grr' && (
            <div className="stat-setup-grid">
              <label>빈 행 수 (부품×평가자×반복)
                <input type="number" min={10} max={500} value={config.emptyRows}
                  onChange={e => patch({ emptyRows: Number(e.target.value) })} />
              </label>
              <div style={{ fontSize: '0.8rem', color: '#64748b', alignSelf: 'end' }}>
                고정 열: 부품, 평가자, 측정값
              </div>
            </div>
          )}

          {toolType === 'doe' && (
            <div>
              <div className="stat-setup-grid">
                <label>인자 개수
                  <input type="number" min={2} max={6} value={config.factorCount}
                    onChange={e => patch({
                      factorCount: Number(e.target.value),
                      factorNames: Array.from({ length: Number(e.target.value) || 2 }, (_, i) =>
                        config.factorNames?.[i] || `인자${i + 1}`
                      )
                    })} />
                </label>
                <label>빈 run 행 수
                  <input type="number" min={4} max={128} value={config.emptyRows}
                    onChange={e => patch({ emptyRows: Number(e.target.value) })} />
                </label>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(120px,1fr))', gap: 6, marginTop: 8 }}>
                {config.factorNames?.map((n, i) => (
                  <input key={i} value={n}
                    onChange={e => {
                      const next = [...config.factorNames];
                      next[i] = e.target.value;
                      patch({ factorNames: next });
                    }} />
                ))}
              </div>
            </div>
          )}

          {toolType === 'contingency' && (
            <div>
              <div className="stat-setup-grid">
                <label>행 수
                  <input type="number" min={2} max={10} value={config.rowCount}
                    onChange={e => patch({
                      rowCount: Number(e.target.value),
                      rowLabels: Array.from({ length: Number(e.target.value) || 2 }, (_, i) =>
                        config.rowLabels?.[i] || `행${i + 1}`
                      )
                    })} />
                </label>
                <label>열 수
                  <input type="number" min={2} max={10} value={config.colCount}
                    onChange={e => patch({
                      colCount: Number(e.target.value),
                      colLabels: Array.from({ length: Number(e.target.value) || 2 }, (_, i) =>
                        config.colLabels?.[i] || `열${i + 1}`
                      )
                    })} />
                </label>
              </div>
              <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>행 라벨</div>
                  {config.rowLabels?.map((n, i) => (
                    <input key={i} style={{ display: 'block', marginTop: 4, width: 120 }} value={n}
                      onChange={e => {
                        const next = [...config.rowLabels]; next[i] = e.target.value; patch({ rowLabels: next });
                      }} />
                  ))}
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>열 라벨</div>
                  {config.colLabels?.map((n, i) => (
                    <input key={i} style={{ display: 'block', marginTop: 4, width: 120 }} value={n}
                      onChange={e => {
                        const next = [...config.colLabels]; next[i] = e.target.value; patch({ colLabels: next });
                      }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="stat-template-preview">
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>현재 템플릿 열</span>
            <div style={{ fontFamily: 'monospace', fontSize: '0.85rem', fontWeight: 600, color: '#0f172a' }}>
              {headers.join(' , ')}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
              기본 {config.emptyRows || config.rowCount || DEFAULT_EMPTY_ROWS}행 · 엑셀에서 행 추가 가능
            </div>
          </div>
        </div>
      )}

      <div className="stat-template-actions">
        <button type="button" className="btn-primary" onClick={handleDownload}>
          <Download size={14} /> 템플릿 받기
        </button>
        <label className="btn-manual-link" style={{ cursor: busy ? 'wait' : 'pointer' }}>
          <Upload size={14} /> 템플릿 업로드·분석
          <input
            id={fileId}
            type="file"
            accept=".csv,.txt,.tsv"
            style={{ display: 'none' }}
            disabled={busy}
            onChange={(e) => {
              handleUpload(e.target.files?.[0]);
              e.target.value = '';
            }}
          />
        </label>
      </div>

      <details style={{ marginTop: 10 }}>
        <summary style={{ cursor: 'pointer', fontSize: '0.85rem', color: '#0369a1', fontWeight: 600 }}>
          또는 엑셀 복사본 붙여넣기
        </summary>
        <textarea
          className="data-paste-textarea"
          style={{ marginTop: 8 }}
          rows={5}
          value={paste}
          onChange={e => setPaste(e.target.value)}
          placeholder="템플릿과 같은 열 구성으로 붙여넣으세요"
        />
        <button type="button" className="btn-primary" style={{ marginTop: 8 }} onClick={handlePasteApply}>
          <Play size={14} /> 붙여넣기 적용·분석
        </button>
      </details>

      {error && <div style={{ marginTop: 8, color: '#dc2626', fontSize: '0.85rem' }}>{error}</div>}
      {info && !error && <div style={{ marginTop: 8, color: '#059669', fontSize: '0.85rem', fontWeight: 600 }}>{info}</div>}
    </div>
  );
};

export default StatTemplatePanel;
