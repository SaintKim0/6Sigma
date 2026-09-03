import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  GraduationCap,
  Minus,
  Sparkles,
  Users
} from 'lucide-react';
import BrandLogo from './BrandLogo';
import './LandingPage.css';
import './PricingPage.css';

const FEATURE_ROWS = [
  {
    feature: '프로젝트 수',
    free: '1개',
    pro: '무제한',
    edu: '좌석당 1~3개',
    team: '무제한 + 공유'
  },
  {
    feature: 'DMAIC / DFSS 도구',
    free: '핵심만',
    pro: '전체',
    edu: '전체',
    team: '전체'
  },
  {
    feature: 'PDF / PPT 내보내기',
    free: '워터마크',
    pro: '정식',
    edu: '정식',
    team: '정식 + 템플릿'
  },
  {
    feature: 'AI 해석 보조',
    free: '일 3회',
    pro: '넉넉한 한도',
    edu: '수업용 한도',
    team: '팀 풀 한도'
  },
  {
    feature: '클라우드 저장',
    free: '기기만 (로컬)',
    pro: '본인 계정',
    edu: '계정 + 학기 보관',
    team: '조직 워크스페이스'
  },
  {
    feature: '협업 / 권한',
    free: '—',
    pro: '—',
    edu: '강사 대시보드',
    team: '역할·감사 로그'
  }
];

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    badge: null,
    priceMonthly: 0,
    priceYearly: 0,
    period: '무료',
    blurb: '체험·학습용으로 바로 시작',
    audience: '개인 · 입문',
    cta: '무료로 시작',
    ctaTone: 'secondary',
    features: [
      '프로젝트 1개',
      '핵심 DMAIC / DFSS 도구',
      '내보내기 워터마크',
      'AI 해석 일 3회',
      '브라우저 로컬 저장'
    ]
  },
  {
    id: 'pro',
    name: 'Pro',
    badge: '추천',
    priceMonthly: 19000,
    priceYearly: 190800,
    period: '/ 월',
    blurb: '실무·컨설팅 산출물을 끝까지',
    audience: '실무자 · 컨설턴트',
    cta: 'Pro로 시작',
    ctaTone: 'primary',
    features: [
      '무제한 프로젝트',
      '전체 도구 이용',
      '정식 PDF / PPT 내보내기',
      '넉넉한 AI 해석 한도',
      '계정 클라우드 저장'
    ]
  },
  {
    id: 'edu',
    name: 'Edu',
    badge: null,
    priceMonthly: 12000,
    priceYearly: 120000,
    period: '/ 좌석·월',
    blurb: '대학·사내교육 실습 플랫폼',
    audience: '교육기관 · 강사',
    cta: '교육 문의',
    ctaTone: 'secondary',
    note: '10좌석 이상 연간 계약 권장',
    features: [
      '좌석당 프로젝트 1~3개',
      '전체 도구 + 수업용 AI',
      '정식 내보내기',
      '학기 단위 보관',
      '강사 대시보드'
    ]
  },
  {
    id: 'team',
    name: 'Team',
    badge: null,
    priceMonthly: 29000,
    priceYearly: 290000,
    period: '/ 좌석·월',
    blurb: '품질·운영 팀이 함께 쓰는 공간',
    audience: '팀 · 조직',
    cta: '팀 문의',
    ctaTone: 'secondary',
    note: '최소 3좌석',
    features: [
      '무제한 + 공유 프로젝트',
      '조직 워크스페이스',
      '정식 내보내기 + 템플릿',
      '팀 AI 풀 한도',
      '역할·감사 로그'
    ]
  }
];

const FAQ = [
  {
    q: '지금 바로 결제할 수 있나요?',
    a: '아직 결제 연동 전입니다. Free로 바로 실습할 수 있고, Pro·Edu·Team은 소프트 런칭 때 열립니다.'
  },
  {
    q: '연 결제는 얼마나 할인되나요?',
    a: 'Pro는 연 결제 시 약 2개월분 할인(월 환산 ₩15,900)을 기준으로 잡았습니다. 부가세는 별도입니다.'
  },
  {
    q: '교육기관은 어떻게 계약하나요?',
    a: 'Edu는 좌석 단위입니다. 10좌석 이상이면 연간 계약이 유리합니다. 문의 CTA로 요청을 남기면 됩니다.'
  },
  {
    q: '기존 작업은 유지되나요?',
    a: '기기 로컬 작업은 Free에서도 유지됩니다. Pro 계정으로 올리면 클라우드로 이전하는 흐름을 예정하고 있습니다.'
  }
];

function formatWon(n) {
  if (n === 0) return '₩0';
  return `₩${n.toLocaleString('ko-KR')}`;
}

/**
 * 요금·플랜 안내 페이지 (결제 연동 전 소프트 런칭용)
 */
export default function PricingPage({
  onBack,
  onStartProject,
  onOpenCurriculum,
  hasResume = false,
  onResume
}) {
  const [billing, setBilling] = useState('monthly');

  const priceLabel = (plan) => {
    if (plan.id === 'free') return { main: '₩0', sub: '영원히 무료로 시작' };
    if (billing === 'yearly') {
      const monthly = Math.round(plan.priceYearly / 12);
      return {
        main: formatWon(monthly),
        sub: `연 ${formatWon(plan.priceYearly)} · 월 환산`
      };
    }
    return { main: formatWon(plan.priceMonthly), sub: plan.period };
  };

  const handlePlanCta = (planId) => {
    if (planId === 'free' || planId === 'pro') {
      onStartProject?.();
      return;
    }
    onOpenCurriculum?.();
  };

  return (
    <div className="landing-page pricing-page">
      <header className="pricing-topbar">
        <div className="pricing-topbar-inner">
          <button type="button" className="pricing-back" onClick={onBack}>
            <ArrowLeft size={18} />
            랜딩으로
          </button>
          <div className="landing-brand pricing-top-brand">
            <BrandLogo size={28} className="landing-brand-mark" />
            <span className="landing-brand-name">SigmaLab</span>
            <span className="landing-brand-ko">시그마랩</span>
          </div>
          <div className="pricing-top-actions">
            {hasResume && onResume && (
              <button type="button" className="landing-cta-ghost pricing-top-btn" onClick={onResume}>
                이어서 진행
              </button>
            )}
            <button type="button" className="landing-cta-primary pricing-top-btn" onClick={onStartProject}>
              무료로 시작
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </header>

      <section className="pricing-hero" aria-label="요금 소개">
        <div className="landing-hero-mesh" aria-hidden="true">
          <span className="landing-orb landing-orb-a" />
          <span className="landing-orb landing-orb-b" />
          <div className="landing-grid-fade" />
        </div>
        <div className="pricing-hero-content">
          <motion.p
            className="landing-pill"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <Sparkles size={14} />
            Plans · Free → Pro → Edu → Team
          </motion.p>
          <motion.h1
            className="landing-title pricing-title"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05 }}
          >
            프로젝트에 맞는 플랜을 고르세요
          </motion.h1>
          <motion.p
            className="landing-lead"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1 }}
          >
            개인 실무는 Pro, 수업은 Edu, 팀 협업은 Team.
            지금은 Free로 바로 시작할 수 있고, 유료 결제는 곧 연결됩니다.
          </motion.p>

          <div className="pricing-billing" role="group" aria-label="결제 주기">
            <button
              type="button"
              className={billing === 'monthly' ? 'is-active' : ''}
              onClick={() => setBilling('monthly')}
            >
              월간
            </button>
            <button
              type="button"
              className={billing === 'yearly' ? 'is-active' : ''}
              onClick={() => setBilling('yearly')}
            >
              연간
              <span className="pricing-billing-save">약 2개월 할인</span>
            </button>
          </div>
        </div>
      </section>

      <section className="landing-section pricing-cards-section" aria-labelledby="pricing-plans-heading">
        <div className="landing-section-inner">
          <h2 id="pricing-plans-heading" className="visually-hidden">
            플랜 목록
          </h2>
          <div className="pricing-grid">
            {PLANS.map((plan, i) => {
              const price = priceLabel(plan);
              const featured = plan.id === 'pro';
              return (
                <motion.article
                  key={plan.id}
                  className={`pricing-card ${featured ? 'is-featured' : ''}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.35 }}
                >
                  <div className="pricing-card-head">
                    <div className="pricing-card-name-row">
                      <h3>{plan.name}</h3>
                      {plan.badge && <span className="pricing-badge">{plan.badge}</span>}
                    </div>
                    <p className="pricing-card-audience">{plan.audience}</p>
                    <p className="pricing-card-blurb">{plan.blurb}</p>
                  </div>

                  <div className="pricing-card-price">
                    <strong>{price.main}</strong>
                    <span>{price.sub}</span>
                  </div>
                  {plan.note && <p className="pricing-card-note">{plan.note}</p>}

                  <ul className="pricing-feature-list">
                    {plan.features.map((f) => (
                      <li key={f}>
                        <Check size={16} aria-hidden="true" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className={
                      plan.ctaTone === 'primary'
                        ? 'landing-cta-primary pricing-card-cta'
                        : 'landing-cta-secondary pricing-card-cta'
                    }
                    onClick={() => handlePlanCta(plan.id)}
                  >
                    {plan.id === 'edu' && <GraduationCap size={18} />}
                    {plan.id === 'team' && <Users size={18} />}
                    {plan.cta}
                    {(plan.id === 'free' || plan.id === 'pro') && <ArrowRight size={18} />}
                  </button>
                </motion.article>
              );
            })}
          </div>
          <p className="pricing-tax-note">표시 금액은 부가세 별도 · 초안이며 확정 전 조정될 수 있습니다.</p>
        </div>
      </section>

      <section className="landing-section pricing-compare-section" aria-labelledby="pricing-compare-heading">
        <div className="landing-section-inner">
          <p className="landing-section-kicker">Compare</p>
          <h2 id="pricing-compare-heading">기능 비교</h2>
          <p className="landing-section-lead">플랜별로 어디까지 열리는지 한눈에 보세요.</p>

          <div className="pricing-table-wrap">
            <table className="pricing-table">
              <thead>
                <tr>
                  <th scope="col">기능</th>
                  <th scope="col">Free</th>
                  <th scope="col">Pro</th>
                  <th scope="col">Edu</th>
                  <th scope="col">Team</th>
                </tr>
              </thead>
              <tbody>
                {FEATURE_ROWS.map((row) => (
                  <tr key={row.feature}>
                    <th scope="row">{row.feature}</th>
                    <td>{row.free === '—' ? <Minus size={16} className="pricing-dash" /> : row.free}</td>
                    <td>{row.pro === '—' ? <Minus size={16} className="pricing-dash" /> : row.pro}</td>
                    <td>{row.edu}</td>
                    <td>{row.team}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="landing-section pricing-faq-section" aria-labelledby="pricing-faq-heading">
        <div className="landing-section-inner">
          <p className="landing-section-kicker">FAQ</p>
          <h2 id="pricing-faq-heading">자주 묻는 질문</h2>
          <div className="pricing-faq-list">
            {FAQ.map((item) => (
              <details key={item.q} className="pricing-faq-item">
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section landing-cta-band" aria-labelledby="pricing-cta-heading">
        <div className="landing-section-inner landing-cta-band-inner">
          <div>
            <h2 id="pricing-cta-heading">먼저 Free로 실습해 보세요</h2>
            <p>
              업종 진단부터 DMAIC / DFSS 도구까지 바로 써볼 수 있습니다.
              유료 플랜은 결제 연동 후 같은 화면에서 업그레이드됩니다.
            </p>
          </div>
          <div className="landing-cta-row">
            <button type="button" className="landing-cta-primary" onClick={onStartProject}>
              프로젝트 시작하기
              <ArrowRight size={18} />
            </button>
            <button type="button" className="landing-cta-secondary landing-cta-secondary-light" onClick={onBack}>
              랜딩으로 돌아가기
            </button>
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
            <button type="button" onClick={onBack}>랜딩</button>
            <button type="button" onClick={onStartProject}>프로젝트 시작</button>
            {onOpenCurriculum && (
              <button type="button" onClick={onOpenCurriculum}>교육과정</button>
            )}
          </nav>
          <div className="landing-footer-meta">
            <span>© {new Date().getFullYear()} SigmaLab</span>
            <span>요금 초안 · 결제 연동 전</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
