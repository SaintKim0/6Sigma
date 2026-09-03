import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, LayoutList, Layers } from 'lucide-react';
import './SectionStepper.css';

function readStoredPage(storageKey, maxIndex) {
  if (!storageKey) return 0;
  try {
    const n = Number(sessionStorage.getItem(storageKey));
    if (!Number.isFinite(n)) return 0;
    return Math.min(Math.max(0, n), maxIndex);
  } catch {
    return 0;
  }
}

export default function SectionStepper({
  steps,
  children,
  onFinish,
  finishLabel = '다음 단계로',
  storageKey
}) {
  const panels = React.Children.toArray(children).filter(Boolean);
  const lastIndex = Math.max(0, panels.length - 1);
  const [page, setPage] = useState(() => readStoredPage(storageKey, lastIndex));
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    setPage((p) => Math.min(Math.max(0, p), lastIndex));
  }, [lastIndex]);

  useEffect(() => {
    if (!storageKey) return;
    try {
      sessionStorage.setItem(storageKey, String(page));
    } catch {
      /* ignore */
    }
  }, [page, storageKey]);

  useEffect(() => {
    const area = document.querySelector('.content-area');
    if (area) area.scrollTo({ top: 0, behavior: 'smooth' });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, showAll]);

  const go = (next) => setPage(Math.min(Math.max(0, next), lastIndex));
  const isLast = page >= lastIndex;

  return (
    <div className="section-stepper">
      <div className="section-stepper-bar">
        <ol className="section-stepper-track" aria-label="섹션 진행">
          {steps.map((step, i) => {
            const active = !showAll && i === page;
            const done = !showAll && i < page;
            return (
              <li key={step.id || i}>
                {i > 0 && <span className="section-stepper-line" aria-hidden="true" />}
                <button
                  type="button"
                  className={`section-stepper-item${active ? ' is-active' : ''}${done ? ' is-done' : ''}${showAll ? ' is-all' : ''}`}
                  onClick={() => {
                    setShowAll(false);
                    go(i);
                  }}
                  aria-current={active ? 'step' : undefined}
                >
                  <span className="section-stepper-num">{i + 1}</span>
                  <span className="section-stepper-label">{step.label}</span>
                </button>
              </li>
            );
          })}
        </ol>
        <button
          type="button"
          className={`section-stepper-all${showAll ? ' is-on' : ''}`}
          onClick={() => setShowAll((v) => !v)}
        >
          {showAll ? <Layers size={16} /> : <LayoutList size={16} />}
          {showAll ? '단계별 보기' : '전체 보기'}
        </button>
      </div>

      <p className="section-stepper-status">
        {showAll
          ? `전체 ${panels.length}개 항목`
          : `${page + 1} / ${panels.length} · ${steps[page]?.label || ''}`}
      </p>

      <div className="section-stepper-panels">
        {showAll
          ? panels.map((panel, i) => (
              <div key={steps[i]?.id || i} className="section-stepper-panel">
                {panel}
              </div>
            ))
          : (
            <div className="section-stepper-panel" key={steps[page]?.id || page}>
              {panels[page]}
            </div>
          )}
      </div>

      <div className="section-stepper-footer">
        {!showAll && (
          <button
            type="button"
            className="btn-secondary"
            disabled={page === 0}
            onClick={() => go(page - 1)}
          >
            <ChevronLeft size={18} /> 이전
          </button>
        )}
        {showAll ? (
          <button type="button" className="btn btn-primary" onClick={onFinish}>
            {finishLabel} <ChevronRight size={18} />
          </button>
        ) : isLast ? (
          <button type="button" className="btn btn-primary" onClick={onFinish}>
            {finishLabel} <ChevronRight size={18} />
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={() => go(page + 1)}>
            다음 <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
