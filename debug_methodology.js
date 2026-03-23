// 브라우저 콘솔에서 실행할 스크립트
// 방법론 선택 문제 디버깅 및 수동 설정

console.log('=== 6 Sigma 방법론 선택 디버깅 ===');

// 1. 현재 상태 확인
console.log('현재 methodology:', localStorage.getItem('sigma_methodology'));
console.log('현재 projectSelected:', localStorage.getItem('sigma_project_selected'));

// 2. DMAIC 방법론 수동 선택
function selectDMAIC() {
    localStorage.setItem('sigma_methodology', 'dmaic');
    console.log('✅ DMAIC 방법론이 선택되었습니다');
    console.log('페이지를 새로고침하세요 (F5)');
}

// 3. DFSS 방법론 수동 선택
function selectDFSS() {
    localStorage.setItem('sigma_methodology', 'dfss');
    console.log('✅ DFSS 방법론이 선택되었습니다');
    console.log('페이지를 새로고침하세요 (F5)');
}

// 4. 프로젝트 선택 상태 확인 및 설정
function ensureProjectSelected() {
    const projectData = JSON.parse(localStorage.getItem('sigma_project_data') || '{}');
    const hasSelectedProject = projectData.selection?.projectPool?.some(p => p.selected);

    if (!hasSelectedProject) {
        console.warn('⚠️ 선택된 프로젝트가 없습니다!');
        console.log('프로젝트를 먼저 선택해야 합니다.');
        return false;
    }

    localStorage.setItem('sigma_project_selected', 'true');
    console.log('✅ 프로젝트 선택 상태가 확인되었습니다');
    return true;
}

// 5. 전체 리셋 (처음부터 다시 시작)
function resetAll() {
    if (confirm('모든 데이터를 초기화하시겠습니까?')) {
        localStorage.removeItem('sigma_methodology');
        localStorage.removeItem('sigma_project_selected');
        localStorage.removeItem('sigma_opportunity_analyzed');
        console.log('✅ 모든 상태가 초기화되었습니다');
        console.log('페이지를 새로고침하세요 (F5)');
    }
}

console.log('\n사용 가능한 함수:');
console.log('- selectDMAIC() : DMAIC 방법론 선택');
console.log('- selectDFSS() : DFSS 방법론 선택');
console.log('- ensureProjectSelected() : 프로젝트 선택 상태 확인');
console.log('- resetAll() : 전체 초기화');

// 자동 진단
console.log('\n=== 자동 진단 시작 ===');
const methodology = localStorage.getItem('sigma_methodology');
const projectSelected = localStorage.getItem('sigma_project_selected');
const projectData = JSON.parse(localStorage.getItem('sigma_project_data') || '{}');
const hasSelectedProject = projectData.selection?.projectPool?.some(p => p.selected);

if (!hasSelectedProject) {
    console.error('❌ 문제: 선택된 프로젝트가 없습니다');
    console.log('해결: 먼저 프로젝트를 선택해주세요');
} else if (projectSelected !== 'true') {
    console.warn('⚠️ 문제: 프로젝트는 선택되었지만 상태가 저장되지 않았습니다');
    console.log('해결: ensureProjectSelected() 실행 후 새로고침');
} else if (!methodology) {
    console.log('✅ 프로젝트 선택 완료. 방법론을 선택할 준비가 되었습니다');
    console.log('DMAIC를 선택하려면: selectDMAIC()');
    console.log('DFSS를 선택하려면: selectDFSS()');
} else {
    console.log(`✅ 모든 설정 완료. 현재 방법론: ${methodology}`);
}
