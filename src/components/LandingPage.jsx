import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Target,
  Ruler,
  Search,
  TrendingUp,
  ShieldCheck,
  RotateCcw,
  PenTool,
  CheckCircle2,
  X
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import './LandingPage.css';

const PATHS = {
  dmaic: {
    id: 'dmaic',
    label: 'DMAIC',
    badge: '기존 프로세스 개선',
    tagline: '이미 돌아가는 일의 오류와 산포를 줄이고, 관리 상태로 유지할 때 씁니다.',
    steps: [
      { id: 'D', letter: 'D', name: 'Define', ko: '정의', icon: Target, text: '문제, CTQ, 목표, 범위' },
      { id: 'M', letter: 'M', name: 'Measure', ko: '측정', icon: Ruler, text: '현수준, 측정시스템' },
      { id: 'A', letter: 'A', name: 'Analyze', ko: '분석', icon: Search, text: '근본원인 검증' },
      { id: 'I', letter: 'I', name: 'Improve', ko: '개선', icon: TrendingUp, text: '대책 실행, 검증' },
      { id: 'C', letter: 'C', name: 'Control', ko: '관리', icon: ShieldCheck, text: '표준화, 유지' }
    ]
  },
  dfss: {
    id: 'dfss',
    label: 'DFSS',
    badge: '신규 설계 (DMADV)',
    tagline: '새 제품이나 서비스를 CTQ에 맞춰 설계하고, 본격 운영 전에 검증할 때 씁니다.',
    steps: [
      { id: 'D', letter: 'D', name: 'Define', ko: '정의', icon: Target, text: '설계 목표, VOC' },
      { id: 'M', letter: 'M', name: 'Measure', ko: '측정', icon: Ruler, text: '요구, CTQ 정량화' },
      { id: 'A', letter: 'A', name: 'Analyze', ko: '분석', icon: Search, text: '개념, 대안 탐색' },
      { id: 'Des', letter: 'D', name: 'Design', ko: '설계', icon: PenTool, text: '최적 설계, 상세화' },
      { id: 'V', letter: 'V', name: 'Verify', ko: '검증', icon: CheckCircle2, text: '파일럿, 성능 확인' }
    ]
  }
};

const DOMAINS = [
  { title: '제조', text: '불량, 산포, 수율, 설비' },
  { title: '영업·서비스', text: '대기, 핸드오프, 재작업, 응대 오류' },
  { title: 'IT', text: '장애, 배포 실패, 변경, 가용성' },
  { title: '물류', text: '오배송, 정시율, 피킹 정확도' },
  { title: '의료', text: '대기, 투약 오류, 환자안전' }
];

const FLOW = [
  {
    n: '1',
    title: '업종 선택',
    text: '제조, 영업·서비스, IT, 물류, 의료 가운데 자기 현장을 고릅니다. 문항과 템플릿이 그 기준으로 맞춰집니다.'
  },
  {
    n: '2',
    title: '진단',
    text: '짧은 질문에 답하면, 이미 돌아가는 일을 고칠 과제인지 새로 설계할 과제인지가 갈립니다.'
  },
  {
    n: '3',
    title: '방법 추천',
    text: '결과에 따라 DMAIC 또는 DFSS를 권합니다. 다른 쪽을 골라도 됩니다.'
  },
  {
    n: '4',
    title: '단계 실습',
    text: '선택한 경로의 각 단계에서 헌장, SIPOC, 관리도, FMEA 같은 도구를 씁니다.'
  }
];

const HELP = [
  {
    title: '왼쪽 메뉴',
    text: '업종·진단·과제 선정이 끝나면 DMAIC 또는 DFSS 단계가 열립니다. 단계 안에서 도구를 고르면 됩니다.'
  },
  {
    title: '사용설명서',
    text: '각 도구의 쓰는 시점과 결과 해석은 왼쪽 「교육 · 도움말」의 사용설명서에 있습니다.'
  },
  {
    title: '교육과정',
    text: '기초·벨트 과정은 실습 모드로 열리며, 본 프로젝트 작성과 섞이지 않습니다.'
  },
  {
    title: '저장',
    text: '현재 작업은 이 브라우저에 남습니다. 프로젝트마다 이름을 정해 PC에 .sigma 파일로 두면, 그 파일을 열어 이어서 할 수 있습니다. 처음부터면 「작업 초기화」입니다.'
  }
];

const GUIDE_TABS = [
  { id: 'usage', label: '사용 방법' },
  { id: 'help', label: '도움말' },
  { id: 'data', label: '데이터와 로그인' }
];

const isCloudSyncOn = Boolean(String(import.meta.env.VITE_API_URL || '').trim());

export default function LandingPage({
  onStartProject,
  onOpenCurriculum,
  onOpenPricing,
  hasResume = false,
  onResume,
  onResetWork
}) {
  const [activePath, setActivePath] = useState('dmaic');
  const [guideOpen, setGuideOpen] = useState(false);
  const [guideTab, setGuideTab] = useState('usage');
  const path = PATHS[activePath];
  const heroSteps = PATHS.dmaic.steps;

  const openGuide = (tab = 'usage') => {
    setGuideTab(tab);
    setGuideOpen(true);
  };

  useEffect(() => {
    if (!guideOpen) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setGuideOpen(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey);
    };
  }, [guideOpen]);

  return (
    <div className="landing-page">
      <header className="landing-nav">
        <div className="landing-brand">
          <BrandLogo size={28} className="landing-brand-mark" />
          <span className="landing-brand-name">SigmaLab</span>
          <span className="landing-brand-ko">시그마랩</span>
        </div>
        <nav className="landing-nav-links" aria-label="주요 메뉴">
          <button type="button" onClick={() => openGuide('usage')}>
            사용 방법
          </button>
          <button type="button" onClick={() => openGuide('data')}>
            데이터 보관
          </button>
          {onOpenCurriculum && (
            <button type="button" onClick={onOpenCurriculum}>
              교육
            </button>
          )}
          {onOpenPricing && (
            <button type="button" onClick={onOpenPricing}>
              요금
            </button>
          )}
          {hasResume && onResetWork && (
            <button type="button" className="landing-reset-btn" onClick={onResetWork} title="현재 작업을 지우고 처음부터">
              <RotateCcw size={14} />
              작업 초기화
            </button>
          )}
        </nav>
      </header>

      <section className="landing-hero" aria-label="소개">
        <img
          className="landing-hero-photo"
          src={`${import.meta.env.BASE_URL}images/hero-quality-lab.jpg`}
          alt="품질 검사 작업대 위의 마이크로미터와 금속 부품"
        />
        <div className="landing-hero-scrim" aria-hidden="true" />
        <div className="landing-hero-content">
          <div className="landing-hero-copy">
            <h1>6시그마 실습 플랫폼</h1>
            <p>
              업종을 고르고 진단을 마치면 결과에 따라 DMAIC 또는 DFSS 도구를 추천합니다.
              제조뿐 아니라 영업·서비스, IT에도 같은 절차를 씁니다.
            </p>
            <div className="landing-cta-row">
              <button type="button" className="landing-cta-primary" onClick={onStartProject}>
                프로젝트 시작
              </button>
              {hasResume && (
                <button type="button" className="landing-cta-ghost" onClick={onResume}>
                  이어서 진행
                </button>
              )}
              {onOpenCurriculum && (
                <button type="button" className="landing-cta-secondary" onClick={onOpenCurriculum}>
                  교육과정
                </button>
              )}
            </div>
          </div>
          <aside className="landing-rail" aria-label="DMAIC 단계">
            <ol>
              {heroSteps.map((step, index) => (
                <li key={step.id} className={index === 0 ? 'is-now' : undefined}>
                  <b>{step.letter}</b>
                  <span>{step.ko}</span>
                  <small>{step.text}</small>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </section>

      <section className="landing-section landing-domains" aria-labelledby="landing-domains-heading">
        <div className="landing-section-inner">
          <h2 id="landing-domains-heading">적용 범위</h2>
          <p className="landing-section-lead">
            제조, 영업·서비스, IT, 물류, 의료 등에도 적용 가능합니다. 제품 품질만이 아니라 영업 프로세스, 서비스 처리, 시스템 운영의 과제도 6시그마 기법으로 해결 방법을 찾아보세요.
          </p>
          <div className="landing-domain-grid">
            {DOMAINS.map((item) => (
              <article key={item.title} className="landing-domain">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section landing-paths" aria-labelledby="landing-paths-heading">
        <div className="landing-section-inner landing-paths-layout">
          <div>
          <h2 id="landing-paths-heading">DMAIC와 DFSS</h2>
          <p className="landing-section-lead">
            이미 돌아가는 일을 고칠 것인지, 새로 설계할 것인지에 따라 절차가 갈립니다. 진단 후 하나를 권합니다.
          </p>

          <div className="landing-path-tabs" role="tablist" aria-label="방법론 경로">
            {Object.values(PATHS).map((p) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={activePath === p.id}
                className={`landing-path-tab ${activePath === p.id ? 'is-active' : ''}`}
                onClick={() => setActivePath(p.id)}
              >
                <strong>{p.label}</strong>
                <span>{p.badge}</span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={path.id}
              className="landing-path-panel"
              role="tabpanel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <p className="landing-path-tagline">{path.tagline}</p>
              <ol className="landing-flow">
                {path.steps.map((step) => (
                  <li key={step.id}>
                    <div className="landing-flow-step">
                      <span className="landing-flow-letter">{step.letter}</span>
                      <div>
                        <strong>{step.name}</strong>
                        <em>{step.ko}</em>
                        <p>{step.text}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </motion.div>
          </AnimatePresence>
          </div>
          <figure className="landing-figure">
            <img
              src={`${import.meta.env.BASE_URL}images/measure-control-desk.jpg`}
              alt="캘리퍼스와 금속 시료가 놓인 측정 작업대"
            />
          </figure>
        </div>
      </section>

      <section className="landing-section landing-privacy" aria-labelledby="landing-privacy-heading">
        <div className="landing-section-inner">
          <h2 id="landing-privacy-heading">데이터는 이 기기에 남습니다</h2>
          <p className="landing-section-lead">
            작성한 프로젝트와 로그인 계정은 우리 서버로 보내지 않습니다. 브라우저도 쓰지만, 「내 프로젝트」에서 PC 폴더를 지정하면 그 폴더에 파일로 남길 수 있습니다.
          </p>
          <div className="landing-cta-row">
            <button type="button" className="landing-cta-secondary" onClick={() => openGuide('data')}>
              데이터와 로그인 안내
            </button>
            <button type="button" className="landing-cta-ghost" onClick={() => openGuide('usage')}>
              사용 방법
            </button>
          </div>
        </div>
      </section>

      <section className="landing-cta-band" aria-labelledby="landing-cta-heading">
        <img
          className="landing-cta-photo"
          src={`${import.meta.env.BASE_URL}images/field-process-line.jpg`}
          alt=""
        />
        <div className="landing-cta-scrim" aria-hidden="true" />
        <div className="landing-section-inner landing-cta-band-inner">
          <div>
            <h2 id="landing-cta-heading">업종을 먼저 고르세요</h2>
            <p>제조, 영업·서비스, IT 가운데 자기 현장을 고르면 진단부터 시작합니다.</p>
          </div>
          <div className="landing-cta-row">
            <button type="button" className="landing-cta-primary" onClick={onStartProject}>
              프로젝트 시작
            </button>
            {onOpenCurriculum && (
              <button type="button" className="landing-cta-secondary" onClick={onOpenCurriculum}>
                교육과정
              </button>
            )}
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <div className="landing-footer-logo">
              <BrandLogo size={22} />
              <strong>SigmaLab</strong>
              <span className="landing-footer-ko">시그마랩</span>
            </div>
            <p>6시그마 실습 플랫폼. 작성 내용은 이 기기에서만 보관합니다.</p>
          </div>

          <nav className="landing-footer-nav" aria-label="푸터 메뉴">
            <button type="button" onClick={() => openGuide('usage')}>사용 방법</button>
            <button type="button" onClick={() => openGuide('data')}>데이터 보관</button>
            <button type="button" onClick={onStartProject}>프로젝트 시작</button>
            {hasResume && onResume && (
              <button type="button" onClick={onResume}>이어서 진행</button>
            )}
            {onOpenCurriculum && (
              <button type="button" onClick={onOpenCurriculum}>교육과정</button>
            )}
            {onOpenPricing && (
              <button type="button" onClick={onOpenPricing}>요금</button>
            )}
            {hasResume && onResetWork && (
              <button type="button" className="landing-footer-danger" onClick={onResetWork}>
                작업 초기화
              </button>
            )}
          </nav>

          <div className="landing-footer-meta">
            <span>© {new Date().getFullYear()} SigmaLab</span>
            <span>교육·실습용</span>
          </div>
        </div>
      </footer>

      {guideOpen && (
        <div
          className="landing-modal-overlay"
          onClick={() => setGuideOpen(false)}
        >
          <div
            className="landing-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="landing-guide-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="landing-modal-header">
              <strong id="landing-guide-title">안내</strong>
              <button
                type="button"
                className="landing-modal-close"
                onClick={() => setGuideOpen(false)}
                aria-label="닫기"
              >
                <X size={18} />
              </button>
            </div>
            <div className="landing-modal-tabs" role="tablist" aria-label="안내 구분">
              {GUIDE_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  role="tab"
                  aria-selected={guideTab === tab.id}
                  className={guideTab === tab.id ? 'is-active' : ''}
                  onClick={() => setGuideTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="landing-modal-body">
              {guideTab === 'usage' && (
                <>
                  <p className="landing-modal-lead">
                    설치는 필요 없습니다. 프로젝트 시작을 누르면 아래 순서로 들어갑니다.
                  </p>
                  <div className="landing-help-list">
                    {FLOW.map((item) => (
                      <article key={item.title} className="landing-trend">
                        <span className="landing-trend-step" aria-hidden="true">{item.n}</span>
                        <div>
                          <h4>{item.title}</h4>
                          <p>{item.text}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                </>
              )}
              {guideTab === 'help' && (
                <>
                  <p className="landing-modal-lead">
                    작업대에 들어간 뒤 이렇게 쓰면 됩니다.
                  </p>
                  <div className="landing-help-list">
                    {HELP.map((item) => (
                      <article key={item.title} className="landing-help-note">
                        <h4>{item.title}</h4>
                        <p>{item.text}</p>
                      </article>
                    ))}
                  </div>
                </>
              )}
              {guideTab === 'data' && (
                <div className="landing-data-copy">
                  <h4>어디에 저장되나</h4>
                  <p>
                    진단, 헌장, 데이터, 분석 결과는 우리 서버로 올라가지 않습니다.
                    작업 중에는 이 브라우저에도 둡니다. 「내 프로젝트」에서 PC 폴더를 지정하면
                    프로젝트마다 짧은 이름.sigma 파일로 저장합니다. 그 파일을 열면 이어서 진행합니다.
                    폴더 지정은 Chrome, Edge, Opera에서 됩니다. Safari와 Firefox는 폴더를 열어 두지 못하므로,
                    .sigma 파일을 받아 두었다가 「파일 열기」로 이어서 하면 됩니다.
                  </p>
                  <h4>로그인을 하는 이유</h4>
                  <p>
                    클라우드 계정이 아닙니다. 같은 브라우저에서 프로젝트를 이름 붙여 여러 개 보관하고,
                    「내 프로젝트」에서 다시 열기 위해서입니다. 이메일과 비밀번호도 이 기기에만 저장됩니다.
                    PC 폴더나 백업 파일이 있으면 다른 브라우저에서도 불러올 수 있습니다.
                  </p>
                  <h4>밖으로 나가는 경우</h4>
                  <p>
                    AI 조언은 기본값이 꺼져 있습니다. 설정에서 API 키를 넣고 조언을 요청하면,
                    그 분석 내용이 지정한 AI 서버로 갑니다. 회사 기밀이면 켜지 마세요.
                  </p>
                  <p>
                    {isCloudSyncOn
                      ? '클라우드 업로드는 「내 프로젝트」에서 직접 눌렀을 때만 서버로 갑니다. 누르지 않으면 나가지 않습니다.'
                      : '이 배포에는 클라우드 업로드가 꺼져 있습니다. 업로드 버튼을 눌러도 서버로 가지 않습니다.'}
                  </p>
                  <h4>이 컴퓨터에서 주의할 점</h4>
                  <p>
                    브라우저만 쓰면 사이트 데이터를 지울 때 작업도 사라집니다. PC 폴더에 저장해 두면 그 파일로 되돌릴 수 있습니다.
                    공용 PC를 썼다면 끝난 뒤 「작업 초기화」를 하세요.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
