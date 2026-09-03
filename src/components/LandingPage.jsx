import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Target,
  Ruler,
  Search,
  TrendingUp,
  ShieldCheck,
  GraduationCap,
  RotateCcw,
  Sparkles,
  PenTool,
  CheckCircle2,
  Workflow,
  Brain,
  Layers,
  GitBranch,
  CreditCard
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import './LandingPage.css';

const PATHS = {
  dmaic: {
    id: 'dmaic',
    label: 'DMAIC',
    badge: '기존 프로세스 개선',
    tagline: '문제가 있는 현행 공정을 데이터로 고쳐 성과를 유지합니다.',
    steps: [
      { id: 'D', letter: 'D', name: 'Define', ko: '정의', icon: Target, text: '문제·CTQ·목표·범위' },
      { id: 'M', letter: 'M', name: 'Measure', ko: '측정', icon: Ruler, text: '현수준·측정시스템' },
      { id: 'A', letter: 'A', name: 'Analyze', ko: '분석', icon: Search, text: '근본원인 검증' },
      { id: 'I', letter: 'I', name: 'Improve', ko: '개선', icon: TrendingUp, text: '대책 실행·검증' },
      { id: 'C', letter: 'C', name: 'Control', ko: '관리', icon: ShieldCheck, text: '표준화·유지' }
    ]
  },
  dfss: {
    id: 'dfss',
    label: 'DFSS',
    badge: '신규 설계 · DMADV',
    tagline: '처음부터 고객 요구를 설계에 넣어, 출시 전 검증까지 이어갑니다.',
    steps: [
      { id: 'D', letter: 'D', name: 'Define', ko: '정의', icon: Target, text: '설계 목표·VOC' },
      { id: 'M', letter: 'M', name: 'Measure', ko: '측정', icon: Ruler, text: '요구·CTQ 정량화' },
      { id: 'A', letter: 'A', name: 'Analyze', ko: '분석', icon: Search, text: '개념·대안 탐색' },
      { id: 'Des', letter: 'D', name: 'Design', ko: '설계', icon: PenTool, text: '최적 설계·상세화' },
      { id: 'V', letter: 'V', name: 'Verify', ko: '검증', icon: CheckCircle2, text: '파일럿·성능 확인' }
    ]
  }
};

const TRENDS = [
  {
    icon: GitBranch,
    title: '방법론을 고르는 시대',
    text: 'DMAIC만 쓰지 않습니다. 개선이면 DMAIC, 신규·재설계면 DFSS(DMADV)로 경로를 나눕니다.'
  },
  {
    icon: Workflow,
    title: 'Lean Six Sigma',
    text: '낭비(Lean)와 산포·결함(Six Sigma)을 함께 다뤄 속도와 품질을 동시에 끌어올립니다.'
  },
  {
    icon: Brain,
    title: '데이터 · AI 보조 해석',
    text: '통계 결과 해석과 다음 액션을 AI가 보강하고, 최종 판단은 프로젝트 팀이 합니다.'
  },
  {
    icon: Layers,
    title: '현장 도구까지 연결',
    text: '차터·SIPOC·관리도·가설검정·FMEA까지 단계별 도구로 바로 실무에 들어갑니다.'
  }
];

/**
 * 앱 진입 랜딩 — 최신 6시그마(DMAIC·DFSS·Lean·AI) + 프로젝트 시작
 */
export default function LandingPage({
  onStartProject,
  onOpenCurriculum,
  onOpenPricing,
  hasResume = false,
  onResume,
  onResetWork
}) {
  const [activePath, setActivePath] = useState('dmaic');
  const path = PATHS[activePath];

  return (
    <div className="landing-page">
      <section className="landing-hero" aria-label="소개">
        <div className="landing-hero-mesh" aria-hidden="true">
          <span className="landing-orb landing-orb-a" />
          <span className="landing-orb landing-orb-b" />
          <span className="landing-orb landing-orb-c" />
          <div className="landing-grid-fade" />
        </div>

        <div className="landing-hero-content">
          <div className="landing-hero-top">
            <motion.div
              className="landing-brand"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <BrandLogo size={40} className="landing-brand-mark" />
              <span className="landing-brand-name">SigmaLab</span>
              <span className="landing-brand-ko">시그마랩</span>
            </motion.div>
            <div className="landing-hero-actions">
              {onOpenPricing && (
                <button
                  type="button"
                  className="landing-plans-btn"
                  onClick={onOpenPricing}
                >
                  <CreditCard size={16} />
                  요금·플랜
                </button>
              )}
              {hasResume && onResetWork && (
                <button
                  type="button"
                  className="landing-reset-btn"
                  onClick={onResetWork}
                  title="현재 작업을 지우고 처음부터"
                >
                  <RotateCcw size={16} />
                  작업 초기화
                </button>
              )}
            </div>
          </div>

          <motion.p
            className="landing-pill"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
          >
            <Sparkles size={14} />
            DMAIC · DFSS · Lean · AI 인사이트
          </motion.p>

          <motion.h1
            className="landing-title"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            품질 개선의 다음 단계,{' '}
            <span className="landing-title-break">AI와 함께하는 6시그마</span>
          </motion.h1>

          <motion.p
            className="landing-lead"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 }}
          >
            산포를 줄이는 고전적 6시그마에, 신규 설계(DFSS)·린·데이터 해석까지 묶었습니다.
            진단으로 맞는 경로를 고르고, 프로젝트로 바로 실행하세요.
          </motion.p>

          <motion.div
            className="landing-cta-row"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.22 }}
          >
            <button type="button" className="landing-cta-primary" onClick={onStartProject}>
              프로젝트 시작
              <ArrowRight size={18} />
            </button>
            {hasResume && (
              <button type="button" className="landing-cta-ghost" onClick={onResume}>
                이어서 진행
              </button>
            )}
            {onOpenCurriculum && (
              <button type="button" className="landing-cta-secondary" onClick={onOpenCurriculum}>
                <GraduationCap size={18} />
                교육과정
              </button>
            )}
            {onOpenPricing && (
              <button type="button" className="landing-cta-ghost" onClick={onOpenPricing}>
                <CreditCard size={18} />
                요금·플랜
              </button>
            )}
          </motion.div>

          <motion.div
            className="landing-hero-chips"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            aria-hidden="true"
          >
            <span>개선 → DMAIC</span>
            <span>설계 → DFSS</span>
            <span>낭비 ↓ Lean</span>
            <span>해석 ↑ AI</span>
          </motion.div>
        </div>
      </section>

      <section className="landing-section landing-paths" aria-labelledby="landing-paths-heading">
        <div className="landing-section-inner">
          <p className="landing-section-kicker">Method paths</p>
          <h2 id="landing-paths-heading">한 가지 로드맵이 아닙니다</h2>
          <p className="landing-section-lead">
            최신 6시그마는 “어떤 문제를 푸느냐”에 따라 프로세스를 고릅니다.
            이 앱은 진단 후 DMAIC 또는 DFSS를 추천하고, 단계별 도구로 연결합니다.
          </p>

          <div className="landing-path-tabs" role="tablist" aria-label="방법론 경로">
            {Object.values(PATHS).map((p) => (
              <button
                key={p.id}
                type="button"
                role="tab"
                aria-selected={activePath === p.id}
                className={`landing-path-tab ${activePath === p.id ? 'is-active' : ''} is-${p.id}`}
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
              className={`landing-path-panel is-${path.id}`}
              role="tabpanel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28 }}
            >
              <p className="landing-path-tagline">{path.tagline}</p>
              <ol className="landing-flow">
                {path.steps.map((step, i) => (
                  <li key={step.id}>
                    <div className="landing-flow-step">
                      <span className="landing-flow-letter">{step.letter}</span>
                      <step.icon size={18} />
                      <div>
                        <strong>{step.name}</strong>
                        <em>{step.ko}</em>
                        <p>{step.text}</p>
                      </div>
                    </div>
                    {i < path.steps.length - 1 && <span className="landing-flow-arrow" aria-hidden="true">→</span>}
                  </li>
                ))}
              </ol>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="landing-section landing-trends" aria-labelledby="landing-trends-heading">
        <div className="landing-section-inner">
          <p className="landing-section-kicker">Modern Six Sigma</p>
          <h2 id="landing-trends-heading">지금 현장의 6시그마</h2>
          <p className="landing-section-lead">
            벨트 교육만의 시대를 넘어, 경로 선택·린 결합·디지털 해석이 기본이 되었습니다.
          </p>

          <div className="landing-trend-grid">
            {TRENDS.map((item, i) => (
              <motion.article
                key={item.title}
                className="landing-trend"
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ delay: i * 0.06, duration: 0.35 }}
              >
                <div className="landing-trend-icon">
                  <item.icon size={20} />
                </div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section landing-cta-band" aria-labelledby="landing-cta-heading">
        <div className="landing-section-inner landing-cta-band-inner">
          <div>
            <h2 id="landing-cta-heading">업종 맞춤 진단부터 시작</h2>
            <p>
              업종 선택 → 프로젝트 진단 → DMAIC / DFSS 추천 → 단계별 도구.
              교육과정으로 먼저 익힌 뒤 실습해도 됩니다.
            </p>
          </div>
          <div className="landing-cta-row">
            <button type="button" className="landing-cta-primary" onClick={onStartProject}>
              프로젝트 시작하기
              <ArrowRight size={18} />
            </button>
            {onOpenCurriculum && (
              <button type="button" className="landing-cta-secondary landing-cta-secondary-light" onClick={onOpenCurriculum}>
                <GraduationCap size={18} />
                교육과정 보기
              </button>
            )}
            {onOpenPricing && (
              <button type="button" className="landing-cta-secondary landing-cta-secondary-light" onClick={onOpenPricing}>
                <CreditCard size={18} />
                요금·플랜 보기
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
            <p>데이터 기반 품질 개선 · DMAIC · DFSS 실습 워크스페이스</p>
          </div>

          <nav className="landing-footer-nav" aria-label="푸터 메뉴">
            <button type="button" onClick={onStartProject}>프로젝트 시작</button>
            {hasResume && onResume && (
              <button type="button" onClick={onResume}>이어서 진행</button>
            )}
            {onOpenCurriculum && (
              <button type="button" onClick={onOpenCurriculum}>교육과정</button>
            )}
            {onOpenPricing && (
              <button type="button" onClick={onOpenPricing}>요금·플랜</button>
            )}
            {hasResume && onResetWork && (
              <button type="button" className="landing-footer-danger" onClick={onResetWork}>
                작업 초기화
              </button>
            )}
          </nav>

          <div className="landing-footer-meta">
            <span>© {new Date().getFullYear()} SigmaLab</span>
            <span>교육·실습용 · 브라우저에서 바로 사용</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
