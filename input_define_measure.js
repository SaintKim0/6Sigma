// 브라우저 콘솔에서 실행: Define + Measure 단계 샘플 데이터 입력

console.log('=== Define + Measure 단계 데이터 입력 시작 ===');

// 1. 방법론 설정 확인
const currentMethodology = localStorage.getItem('sigma_methodology');
console.log('현재 방법론:', currentMethodology);

if (!currentMethodology) {
    console.log('⚠️ 방법론이 선택되지 않았습니다. DMAIC를 선택합니다.');
    localStorage.setItem('sigma_methodology', 'dmaic');
}

// 2. Define 단계 데이터 입력
function inputDefineData() {
    const currentData = JSON.parse(localStorage.getItem('sigma_project_data') || '{}');

    const updatedData = {
        ...currentData,
        define: {
            projectTitle: '스마트폰 케이스 불량률 감소 프로젝트',
            businessCase: '프리미엄 시장 경쟁 심화 및 불량률 과다(15.2%)로 인한 연간 3.6억원의 손실 발생. 품질 확보를 통한 시장 점유율 유지 필수.',
            problemStatement: '사출 공정의 불량률이 최근 3개월 평균 15.2%를 기록하고 있으며, 이로 인해 폐기 비용 및 재작업 비용이 증가하고 있음.',
            goal: '사출 불량률을 6개월 이내에 15.2%에서 5% 이하로 낮추고, 연간 품질 비용 2.4억원을 절감함.',
            scopeIn: '사출기 #3 공정, 원자재 입고부터 최종 검사 단계까지',
            scopeOut: '금형 설계 변경, 사출 후가공(도장, 조립) 공정',
            team: [
                { name: '이영희', role: 'Champion' },
                { name: '김철수', role: 'BB' },
                { name: '박민수', role: '생산팀장' },
                { name: '정수진', role: '데이터 분석' }
            ],
            timeline: {
                start: '2026-01-15',
                end: '2026-07-15'
            },
            sipoc: {
                supplier: '완제품 제조사, 원자재 공급사',
                input: '사출용 펠렛, 금형, 이형제',
                process: '원료 투입 -> 가열/용융 -> 사출 -> 냉각 -> 취출',
                output: '스마트폰 케이스 사출물',
                customer: '스마트폰 제조사'
            }
        }
    };

    localStorage.setItem('sigma_project_data', JSON.stringify(updatedData));
    console.log('✅ Define 단계 데이터 입력 완료');
    return updatedData;
}

// 3. Measure 단계 데이터 입력
function inputMeasureData() {
    const currentData = JSON.parse(localStorage.getItem('sigma_project_data') || '{}');

    const updatedData = {
        ...currentData,
        measure: {
            unitCount: 1000,
            defectCount: 152,
            opportunityPerUnit: 1,
            ctq: `CTQ (Critical to Quality) 항목:

1. 표면 품질 (가중치: 60%)
   - 스크래치 깊이 < 0.1mm
   - 스크래치 개수 < 3개/제품

2. 치수 정밀도 (가중치: 30%)
   - 길이 오차 ± 0.2mm 이내
   - 폭 오차 ± 0.2mm 이내
   - 두께 오차 ± 0.1mm 이내

3. 색상 균일도 (가중치: 10%)
   - 색차(ΔE) < 2.0

현재 성능:
- 총 샘플: 1000개
- 불량 개수: 152개
- 불량률: 15.2%
- DPMO: 152,000
- 시그마 수준: 2.7
- 목표 시그마: 4.2`,
            chartData: {
                controlChart: {
                    samples: [
                        { sample: 1, value: 6.2 },
                        { sample: 2, value: 5.8 },
                        { sample: 3, value: 5.4 },
                        { sample: 4, value: 5.2 },
                        { sample: 5, value: 5.0 },
                        { sample: 6, value: 4.9 },
                        { sample: 7, value: 5.1 },
                        { sample: 8, value: 4.8 },
                        { sample: 9, value: 4.7 },
                        { sample: 10, value: 4.9 },
                        { sample: 11, value: 4.8 },
                        { sample: 12, value: 4.7 }
                    ],
                    type: 'xbar'
                },
                histogram: {
                    rawData: [14.5, 15.2, 14.8, 15.5, 16.2, 14.9, 15.1, 15.8, 14.7, 15.3,
                        15.0, 14.6, 15.4, 15.9, 14.4, 15.7, 15.2, 14.8, 15.6, 15.1],
                    binCount: 10,
                    lsl: 0,
                    usl: 20
                },
                scatterPlot: {
                    data: [
                        { x: 242, y: 8.5 },
                        { x: 244, y: 9.2 },
                        { x: 245, y: 5.1 },
                        { x: 246, y: 5.8 },
                        { x: 248, y: 6.5 },
                        { x: 250, y: 8.2 },
                        { x: 252, y: 10.5 },
                        { x: 255, y: 13.2 },
                        { x: 258, y: 16.8 },
                        { x: 260, y: 19.5 },
                        { x: 262, y: 22.1 }
                    ],
                    xLabel: '사출 온도 (℃)',
                    yLabel: '불량률 (%)'
                },
                boxPlot: {
                    groups: [
                        { name: 'A조 (아침)', values: [4.2, 4.5, 4.8, 5.0, 5.2] },
                        { name: 'B조 (오후)', values: [4.5, 4.8, 5.1, 5.3, 5.5, 6.2] },
                        { name: 'C조 (야간)', values: [4.9, 5.2, 5.5, 5.8, 6.0] },
                        { name: 'D조 (주말)', values: [4.8, 5.1, 5.4, 5.7, 5.8] }
                    ]
                },
                runChart: {
                    data: [
                        { day: 1, value: 15.2 },
                        { day: 2, value: 15.0 },
                        { day: 3, value: 14.8 },
                        { day: 4, value: 15.1 },
                        { day: 5, value: 14.9 },
                        { day: 6, value: 15.3 },
                        { day: 7, value: 14.7 },
                        { day: 8, value: 15.5 },
                        { day: 9, value: 14.6 },
                        { day: 10, value: 15.2 },
                        { day: 11, value: 14.8 },
                        { day: 12, value: 15.4 },
                        { day: 13, value: 15.0 },
                        { day: 14, value: 14.9 },
                        { day: 15, value: 15.1 }
                    ]
                }
            }
        }
    };

    localStorage.setItem('sigma_project_data', JSON.stringify(updatedData));
    console.log('✅ Measure 단계 데이터 입력 완료');
    return updatedData;
}

// 4. 전체 실행
function runDefineAndMeasure() {
    console.log('\n🚀 Define + Measure 데이터 입력 시작...\n');
    inputDefineData();
    inputMeasureData();
    console.log('\n✅ 모든 데이터 입력 완료!');
    console.log('페이지를 새로고침(F5)하여 확인하세요.\n');
}

// 사용 가능한 함수 안내
console.log('\n📋 사용 가능한 함수:');
console.log('- runDefineAndMeasure() : Define + Measure 데이터 한 번에 입력');
console.log('- inputDefineData() : Define 데이터만 입력');
console.log('- inputMeasureData() : Measure 데이터만 입력');
console.log('\n💡 추천: runDefineAndMeasure() 실행 후 페이지 새로고침\n');

// 자동 실행 (주석 해제하면 스크립트 로드 시 자동 실행)
// runDefineAndMeasure();
