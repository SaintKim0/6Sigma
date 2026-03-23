// 브라우저 콘솔에서 실행할 샘플 데이터 입력 스크립트
// 사용법: 브라우저 개발자 도구(F12) > Console 탭에서 이 스크립트를 복사/붙여넣기

console.log('=== 6 Sigma 샘플 데이터 자동 입력 시작 ===');

// 1. 방법론 선택 (DMAIC)
function step1_selectMethodology() {
    localStorage.setItem('sigma_methodology', 'dmaic');
    localStorage.setItem('sigma_project_selected', 'true');
    localStorage.setItem('sigma_opportunity_analyzed', 'true');
    console.log('✅ Step 1: DMAIC 방법론 선택 완료');
}

// 2. Define 단계 데이터 입력
function step2_inputDefineData() {
    const currentData = JSON.parse(localStorage.getItem('sigma_project_data') || '{}');

    const defineData = {
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

    localStorage.setItem('sigma_project_data', JSON.stringify(defineData));
    console.log('✅ Step 2: Define 단계 데이터 입력 완료');
    return defineData;
}

// 3. Measure 단계 데이터 입력
function step3_inputMeasureData() {
    const currentData = JSON.parse(localStorage.getItem('sigma_project_data') || '{}');

    const measureData = {
        ...currentData,
        measure: {
            unitCount: 1000,
            defectCount: 152,
            opportunityPerUnit: 1,
            ctq: 'CTQ 항목:\n1. 표면 품질 (60%): 스크래치 깊이 < 0.1mm, 스크래치 개수 < 3개/제품\n2. 치수 정밀도 (30%): 길이 오차 ± 0.2mm, 폭 오차 ± 0.2mm, 두께 오차 ± 0.1mm\n3. 색상 균일도 (10%): 색차(ΔE) < 2.0',
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
                        { sample: 10, value: 4.9 }
                    ],
                    type: 'xbar'
                },
                histogram: {
                    rawData: [14.5, 15.2, 14.8, 15.5, 16.2, 14.9, 15.1, 15.8, 14.7, 15.3],
                    binCount: 10,
                    lsl: 0,
                    usl: 20
                },
                scatterPlot: {
                    data: [
                        { x: 242, y: 8.5 },
                        { x: 245, y: 5.1 },
                        { x: 250, y: 8.2 },
                        { x: 255, y: 13.2 },
                        { x: 260, y: 19.5 }
                    ],
                    xLabel: '사출 온도 (℃)',
                    yLabel: '불량률 (%)'
                },
                boxPlot: {
                    groups: [
                        { name: 'A조', values: [4.2, 4.5, 4.8, 5.0, 5.2] },
                        { name: 'B조', values: [4.5, 4.8, 5.1, 5.3, 5.5] },
                        { name: 'C조', values: [4.9, 5.2, 5.5, 5.8, 6.0] }
                    ]
                },
                runChart: {
                    data: [
                        { day: 1, value: 15.2 },
                        { day: 2, value: 15.0 },
                        { day: 3, value: 14.8 },
                        { day: 4, value: 15.1 },
                        { day: 5, value: 14.9 }
                    ]
                }
            }
        }
    };

    localStorage.setItem('sigma_project_data', JSON.stringify(measureData));
    console.log('✅ Step 3: Measure 단계 데이터 입력 완료');
    return measureData;
}

// 4. Analyze 단계 데이터 입력
function step4_inputAnalyzeData() {
    const currentData = JSON.parse(localStorage.getItem('sigma_project_data') || '{}');

    const analyzeData = {
        ...currentData,
        analyze: {
            causes: ['사출 온도 과다', '냉각 시간 부족', '금형 오염'],
            alternatives: '1. 사출 온도 최적화\n2. 냉각 시간 연장\n3. 금형 청소 주기 단축',
            paretoItems: [
                { category: '사출 온도 과다', count: 68 },
                { category: '냉각 시간 부족', count: 38 },
                { category: '금형 오염', count: 23 },
                { category: '원자재 품질', count: 15 },
                { category: '기타', count: 8 }
            ],
            fishbone: {
                man: ['작업자 교육 훈련 부족', '숙련도 편차 큼', '표준 작업 미준수'],
                machine: ['사출기 온도 센서 정밀도 부족', '냉각 시스템 노후화', '금형 청소 주기 미준수'],
                material: ['원자재 LOT별 품질 편차', '재생 원료 혼합 비율 불균일', ''],
                method: ['공정 표준서(SOP) 미비', '검사 기준 모호', '온도/압력 설정 기준 부재'],
                measurement: ['실시간 모니터링 부재', '검사 주기 불규칙', '측정 데이터 기록 미흡'],
                environment: ['작업장 온도 변화 큰 편', '습도 관리 미흡', '']
            },
            why5: [
                '불량률이 15.2%로 높다',
                '사출 온도가 과다하고 냉각 시간이 부족하다',
                '온도 센서 정밀도가 낮고 냉각 시스템이 노후화되었다',
                '정기 점검 및 교체 계획이 없었다',
                '예방 보전 시스템이 구축되지 않았다'
            ]
        }
    };

    localStorage.setItem('sigma_project_data', JSON.stringify(analyzeData));
    console.log('✅ Step 4: Analyze 단계 데이터 입력 완료');
    return analyzeData;
}

// 5. Improve 단계 데이터 입력
function step5_inputImproveData() {
    const currentData = JSON.parse(localStorage.getItem('sigma_project_data') || '{}');

    const improveData = {
        ...currentData,
        improve: {
            solutions: [
                '사출 온도 최적화 (245±3℃)',
                '냉각 시간 연장 (30초)',
                '금형 청소 주기 단축 (일 2회)',
                '작업자 교육 프로그램',
                '검사 기준서 작성'
            ]
        }
    };

    localStorage.setItem('sigma_project_data', JSON.stringify(improveData));
    console.log('✅ Step 5: Improve 단계 데이터 입력 완료');
    return improveData;
}

// 6. Control 단계 데이터 입력
function step6_inputControlData() {
    const currentData = JSON.parse(localStorage.getItem('sigma_project_data') || '{}');

    const controlData = {
        ...currentData,
        control: {
            monitoringPlan: '일일 불량률 모니터링, 주간 품질 회의, 월간 성과 리뷰',
            sop: '사출 공정 표준 작업 지침서 (SOP-001)',
            training: '전 작업자 대상 신규 공정 교육 (4시간)'
        }
    };

    localStorage.setItem('sigma_project_data', JSON.stringify(controlData));
    console.log('✅ Step 6: Control 단계 데이터 입력 완료');
    return controlData;
}

// 전체 실행
function runAll() {
    console.log('\n🚀 전체 샘플 데이터 입력 시작...\n');
    step1_selectMethodology();
    step2_inputDefineData();
    step3_inputMeasureData();
    step4_inputAnalyzeData();
    step5_inputImproveData();
    step6_inputControlData();
    console.log('\n✅ 모든 샘플 데이터 입력 완료!');
    console.log('페이지를 새로고침(F5)하여 확인하세요.\n');
}

// 사용 가능한 함수 안내
console.log('\n📋 사용 가능한 함수:');
console.log('- runAll() : 모든 단계 데이터 한 번에 입력');
console.log('- step1_selectMethodology() : 방법론 선택');
console.log('- step2_inputDefineData() : Define 데이터 입력');
console.log('- step3_inputMeasureData() : Measure 데이터 입력');
console.log('- step4_inputAnalyzeData() : Analyze 데이터 입력');
console.log('- step5_inputImproveData() : Improve 데이터 입력');
console.log('- step6_inputControlData() : Control 데이터 입력');
console.log('\n💡 추천: runAll() 실행 후 페이지 새로고침\n');
