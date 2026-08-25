/**
 * 프로젝트 DMAIC 스토리라인 요약 빌더
 */
export function buildProjectStoryline({ data, methodology, completedTools = [], industryName }) {
  const d = data || {};
  const define = d.define || {};
  const measure = d.measure || {};
  const analyze = d.analyze || {};
  const improve = d.improve || {};
  const control = d.control || {};
  const summary = measure.analysisSummary || {};

  const phases = [
    {
      id: 'define',
      title: 'Define',
      color: '#1e3a8a',
      bullets: [
        define.projectTitle && `과제: ${define.projectTitle}`,
        define.problemStatement && `문제: ${String(define.problemStatement).slice(0, 120)}`,
        define.goalStatement && `목표: ${String(define.goalStatement).slice(0, 120)}`,
        (define.vocCtq?.items?.length || define.ctq) && 'CTQ/VOC 정리됨'
      ].filter(Boolean),
      done: !!(define.projectTitle || define.problemStatement)
    },
    {
      id: 'measure',
      title: 'Measure',
      color: '#0369a1',
      bullets: [
        summary.n != null && `n=${summary.n}`,
        summary.cpk != null && `Cpk≈${Number(summary.cpk).toFixed(2)}`,
        summary.ppk != null && `Ppk≈${Number(summary.ppk).toFixed(2)}`,
        summary.isNormal != null && (summary.isNormal ? '정규성 OK' : '비정규 주의'),
        measure.defectCount != null && `불량 ${measure.defectCount}/${measure.unitCount || '?'}`,
        measure.msa && 'MSA 기록 있음'
      ].filter(Boolean),
      done: !!(summary.n || measure.unitCount || measure.chartData?.histogram?.data?.length)
    },
    {
      id: 'analyze',
      title: 'Analyze',
      color: '#0891b2',
      bullets: [
        analyze.hypothesis?.result && '가설검정 결과 있음',
        analyze.fishbone && 'Fishbone 작성',
        analyze.why5 && '5Why 작성',
        analyze.regression?.result && '회귀 결과 있음',
        analyze.pareto?.length && `Pareto ${analyze.pareto.length}항`,
        analyze.hypothesisLog?.length && `Y=f(X) 가설 ${analyze.hypothesisLog.length}건`
      ].filter(Boolean),
      done: !!(analyze.hypothesis?.result || analyze.fishbone || analyze.regression?.result || analyze.pareto?.length)
    },
    {
      id: methodology === 'dfss' ? 'design' : 'improve',
      title: methodology === 'dfss' ? 'Design' : 'Improve',
      color: '#0d9488',
      bullets: [
        improve.solutions?.length && `개선안 ${improve.solutions.length}건`,
        improve.doe && 'DOE 정의됨',
        improve.pilot && 'Pilot 계획/결과',
        improve.pokaYoke && 'Poka-Yoke',
        d.design?.designSpec && '설계 사양'
      ].filter(Boolean),
      done: !!(improve.solutions?.length || improve.doe || improve.pilot || d.design?.designSpec)
    },
    {
      id: 'control',
      title: methodology === 'dfss' ? 'Verify' : 'Control',
      color: '#059669',
      bullets: [
        control.controlPlan && '관리계획서',
        control.monitoring && '모니터링 KPI',
        control.beforeAfter && 'Before/After',
        control.resultSummary && '성과 요약',
        control.standardWork && '표준작업'
      ].filter(Boolean),
      done: !!(control.controlPlan || control.monitoring || control.resultSummary || control.beforeAfter)
    }
  ];

  const evidence = [
    analyze.hypothesis?.result && { label: '가설검정', text: String(analyze.hypothesis.result).slice(0, 200) },
    analyze.regression?.result && { label: '회귀', text: String(analyze.regression.result).slice(0, 200) },
    summary.cpk != null && { label: '공정능력', text: `Cpk=${Number(summary.cpk).toFixed(2)}, Ppk=${summary.ppk != null ? Number(summary.ppk).toFixed(2) : '—'}` },
    control.beforeAfter && {
      label: 'Before/After',
      text: `Cpk ${control.beforeAfter.before?.cpk} → ${control.beforeAfter.after?.cpk}`
    }
  ].filter(Boolean);

  const actions = [
    ...(improve.solutions || []).slice(0, 3).map(s => s.name || s.title || s.idea).filter(Boolean),
    control.controlPlan?.items?.[0] && `관리특성: ${control.controlPlan.items[0].characteristic || control.controlPlan.items[0].name || ''}`
  ].filter(Boolean);

  const progress = {
    completedTools: completedTools.length,
    phasesDone: phases.filter(p => p.done).length,
    phasesTotal: phases.length
  };

  return {
    title: define.projectTitle || '제목 없는 프로젝트',
    methodology: (methodology || 'dmaic').toUpperCase(),
    industryName: industryName || '',
    phases,
    evidence,
    actions,
    progress,
    oneLiner: [
      define.projectTitle || '프로젝트',
      summary.cpk != null ? `Cpk ${Number(summary.cpk).toFixed(2)}` : null,
      progress.phasesDone >= 4 ? '후반 단계 진행중' : '전반 단계 진행중'
    ].filter(Boolean).join(' · ')
  };
}
