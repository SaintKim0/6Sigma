/**
 * 교육용 데모 프로젝트 목록.
 * 시드 JSON은 public/ 아래에 두고, 불러오기는 이 카탈로그의 file 경로를 사용합니다.
 */
export const DEMO_PROJECTS = [
  {
    id: 'manufacturing',
    file: 'demo_project_seed.json',
    title: '스마트폰 케이스 사출 불량률 감소',
    domain: '제조 · 품질',
    summary: '사출기 #3 라인 불량률 15.2%를 5% 이하로 낮추는 현장 품질 과제입니다.',
    y: '최종검사 불량률 ≤ 5%',
    industry: 'manufacturing'
  },
  {
    id: 'finance',
    file: 'demo_finance_seed.json',
    title: '경제적 자립을 위한 자산 확대',
    domain: '개인 · 재테크',
    summary: '맞벌이 부부가 가계 현금흐름을 CTQ로 잡고 DMAIC를 한 바퀴 도는 개인 과제입니다. 팀원은 본인·배우자 둘뿐입니다.',
    y: '월 순저축 200만원 · 5년 순자산 10억',
    industry: 'service_office'
  }
];

export function getDemoById(id) {
  return DEMO_PROJECTS.find((d) => d.id === id) || DEMO_PROJECTS[0];
}
