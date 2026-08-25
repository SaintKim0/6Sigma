// 브라우저 콘솔에서 실행하거나, 앱 헤더의 [데모 불러오기] 버튼을 사용하세요.
// 시드 원본: /public/demo_project_seed.json

async function runAll() {
  const res = await fetch('/demo_project_seed.json');
  if (!res.ok) throw new Error('demo_project_seed.json 로드 실패');
  const seed = await res.json();

  localStorage.setItem('sigma_industry', seed.meta.industry);
  localStorage.setItem('sigma_methodology', seed.meta.methodology);
  localStorage.setItem('sigma_active_step', seed.meta.activeStep || 'define');
  localStorage.setItem('sigma_diagnostic_completed', 'true');
  localStorage.setItem('sigma_diagnostic_responses', JSON.stringify(seed.diagnosticResponses));
  localStorage.setItem('sigma_diagnostic_index', '0');
  localStorage.setItem('sigma_project_selected', 'true');
  localStorage.setItem('sigma_opportunity_analyzed', 'true');
  localStorage.setItem('sigma_completed_tools', JSON.stringify(seed.completedTools));
  localStorage.setItem('sigma_project_data', JSON.stringify(seed.projectData));
  localStorage.setItem('sigma_version_history', JSON.stringify([{
    id: `v1_demo_${Date.now()}`,
    version: 'v1',
    timestamp: new Date().toISOString(),
    description: '가상 데모 프로젝트 전체 데이터 로드',
    projectTitle: seed.projectData.define.projectTitle,
    methodology: seed.meta.methodology,
    data: seed.projectData,
    auto: false
  }]));

  console.log('✅ 데모 프로젝트 로드 완료:', seed.projectData.define.projectTitle);
  console.log('페이지를 새로고침합니다...');
  location.reload();
}

console.log('💡 runAll() 실행 또는 앱 헤더 [데모 불러오기] 버튼 사용');
