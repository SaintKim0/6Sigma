import React, { useId, useMemo, useRef, useState } from 'react';
import { Upload, ClipboardPaste, FileSpreadsheet, Download, CheckCircle2 } from 'lucide-react';
import {
  FORMAT_GUIDES,
  interpretImport,
  readFileAsText,
  parseTable
} from '../utils/dataImport';

/**
 * 통계 도구 공통: 엑셀 붙여넣기 + CSV/TXT/TSV 업로드
 *
 * mode: numbers | xy | namedGroups | table | grr | doe
 * onApply(result) — interpretImport 결과
 */
const DataPasteUpload = ({
  mode = 'numbers',
  onApply,
  label,
  compact = false
}) => {
  const guide = FORMAT_GUIDES[mode] || FORMAT_GUIDES.numbers;
  const inputId = useId();
  const fileRef = useRef(null);
  const [open, setOpen] = useState(!compact);
  const [paste, setPaste] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [columnIndex, setColumnIndex] = useState(0);
  const [xCol, setXCol] = useState(0);
  const [yCol, setYCol] = useState(1);
  const [fileName, setFileName] = useState('');

  const tablePreview = useMemo(() => {
    if (!paste.trim()) return null;
    try {
      return parseTable(paste);
    } catch {
      return null;
    }
  }, [paste]);

  const applyText = (text, fileLabel = '') => {
    const result = interpretImport(text, mode, { columnIndex, xCol, yCol });
    if (!result.ok) {
      setError(result.message);
      setInfo('');
      return;
    }
    setError('');
    setInfo(`${fileLabel ? `${fileLabel} · ` : ''}${result.preview} 적용됨`);
    setPaste(result.text || text);
    onApply?.(result);
  };

  const handleFile = async (file) => {
    if (!file) return;
    try {
      setError('');
      const text = await readFileAsText(file);
      setFileName(file.name);
      setPaste(text);
      // 다중 열이면 열 선택 후 적용을 유도
      const table = parseTable(text);
      if (mode === 'numbers' && table.headers.length > 1) {
        setInfo(`${file.name} 로드 · 열을 선택한 뒤 「데이터 적용」을 누르세요.`);
        return;
      }
      if (mode === 'xy' && table.headers.length > 2) {
        setInfo(`${file.name} 로드 · X/Y 열을 선택한 뒤 「데이터 적용」을 누르세요.`);
        return;
      }
      applyText(text, file.name);
    } catch (err) {
      setError(err.message || '파일 처리 실패');
    }
  };

  const loadSample = () => {
    setPaste(guide.sample);
    setError('');
    setInfo('예시 데이터를 불러왔습니다. 「데이터 적용」을 누르세요.');
  };

  const downloadTemplate = () => {
    const blob = new Blob([guide.sample], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `template_${mode}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="data-paste-upload">
      <div className="data-paste-header">
        <div>
          <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>
            {label || `데이터 가져오기 · ${guide.title}`}
          </strong>
          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: 2 }}>
            엑셀 복사→붙여넣기 · CSV/TXT/TSV 업로드 · 템플릿 다운로드
          </div>
        </div>
        {compact && (
          <button type="button" className="btn-manual-link" onClick={() => setOpen(o => !o)}>
            {open ? '접기' : '열기'}
          </button>
        )}
      </div>

      {open && (
        <>
          <p style={{ fontSize: '0.8rem', color: '#475569', margin: '0.65rem 0 0.5rem' }}>{guide.hint}</p>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files?.[0]);
            }}
            className={`data-paste-drop${dragOver ? ' over' : ''}`}
          >
            <Upload size={18} />
            <span>파일 드래그 또는 선택 (CSV/TXT/TSV)</span>
            <input
              id={inputId}
              ref={fileRef}
              type="file"
              accept={guide.accept}
              style={{ display: 'none' }}
              onChange={(e) => {
                handleFile(e.target.files?.[0]);
                e.target.value = '';
              }}
            />
            <label htmlFor={inputId} className="btn-manual-link" style={{ cursor: 'pointer' }}>
              <FileSpreadsheet size={14} /> 파일 선택
            </label>
            {fileName && <span style={{ fontSize: '0.75rem', color: '#059669' }}>{fileName}</span>}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '0.65rem 0 0.35rem' }}>
            <ClipboardPaste size={14} color="#64748b" />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
              엑셀/텍스트 붙여넣기
            </span>
          </div>
          <textarea
            className="data-paste-textarea"
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
            placeholder={guide.sample}
            rows={compact ? 4 : 6}
          />

          {mode === 'numbers' && tablePreview && tablePreview.headers.length > 1 && (
            <div style={{ marginTop: 8, fontSize: '0.85rem' }}>
              <label style={{ color: '#64748b', marginRight: 8 }}>사용할 열:</label>
              <select
                value={columnIndex}
                onChange={(e) => setColumnIndex(Number(e.target.value))}
                style={{ padding: '0.35rem 0.5rem', borderRadius: 8, border: '1px solid #cbd5e1' }}
              >
                {tablePreview.headers.map((h, i) => (
                  <option key={i} value={i}>{h}</option>
                ))}
              </select>
            </div>
          )}

          {mode === 'xy' && tablePreview && tablePreview.headers.length >= 2 && (
            <div style={{ marginTop: 8, display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: '0.85rem' }}>
              <label>
                <span style={{ color: '#64748b', marginRight: 6 }}>X 열</span>
                <select value={xCol} onChange={(e) => setXCol(Number(e.target.value))}
                  style={{ padding: '0.35rem 0.5rem', borderRadius: 8, border: '1px solid #cbd5e1' }}>
                  {tablePreview.headers.map((h, i) => <option key={i} value={i}>{h}</option>)}
                </select>
              </label>
              <label>
                <span style={{ color: '#64748b', marginRight: 6 }}>Y 열</span>
                <select value={yCol} onChange={(e) => setYCol(Number(e.target.value))}
                  style={{ padding: '0.35rem 0.5rem', borderRadius: 8, border: '1px solid #cbd5e1' }}>
                  {tablePreview.headers.map((h, i) => <option key={i} value={i}>{h}</option>)}
                </select>
              </label>
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 10 }}>
            <button type="button" className="btn-primary" style={{ padding: '0.4rem 0.85rem' }}
              onClick={() => applyText(paste, fileName)}>
              <CheckCircle2 size={14} /> 데이터 적용
            </button>
            <button type="button" className="btn-manual-link" onClick={loadSample}>
              예시 불러오기
            </button>
            <button type="button" className="btn-manual-link" onClick={downloadTemplate}>
              <Download size={14} /> 템플릿 저장
            </button>
          </div>

          {error && (
            <div style={{ marginTop: 8, color: '#dc2626', fontSize: '0.85rem' }}>{error}</div>
          )}
          {info && !error && (
            <div style={{ marginTop: 8, color: '#059669', fontSize: '0.85rem', fontWeight: 600 }}>{info}</div>
          )}
        </>
      )}
    </div>
  );
};

export default DataPasteUpload;
