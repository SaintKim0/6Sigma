import React, { useState, useEffect } from 'react';
import * as ss from 'simple-statistics';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Scatter } from 'react-chartjs-2';
import {
  Target,
  Ruler,
  Search,
  Zap,
  ShieldCheck,
  ChevronRight,
  PlusCircle,
  Calculator,
  ArrowRight,
  TrendingUp,
  BarChart2,
  Clock,
  GitBranch,
  AlertTriangle,
  HelpCircle,
  X,
  FileText,
  Users,
  Map,
  MessageSquare,
  ClipboardList,
  Activity,
  Package,
  Lightbulb,
  FlaskConical,
  ClipboardCheck,
  PenTool,
  Award,
  CheckCircle,
  Scale
} from 'lucide-react';
import './App.css';
import './ModalStyles.css';
import LogicTreeDiagram from './LogicTree';
import ControlChart from './components/charts/ControlChart';
import Histogram from './components/charts/Histogram';
import ScatterPlot from './components/charts/ScatterPlot';
import BoxPlot from './components/charts/BoxPlot';
import RunChart from './components/charts/RunChart';
import ChartDataInput from './components/charts/ChartDataInput';
import A3Report from './components/A3Report';
import FMEA from './components/FMEA';
import SwimlaneBuilder from './components/SwimlaneBuilder';


ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const DMAIC_STEPS = [
  { id: 'selection', name: 'Selection (선정)', icon: Target, color: '#475569', desc: '전략 연계 및 과제 선정' },
  { id: 'define', name: 'Define (정의)', icon: Target, color: '#1e3a8a', desc: '문제와 목표 정의' },
  { id: 'measure', name: 'Measure (측정)', icon: Ruler, color: '#0369a1', desc: '현재 상태 측정' },
  { id: 'analyze', name: 'Analyze (분석)', icon: Search, color: '#0891b2', desc: '원인 분석' },
  { id: 'improve', name: 'Improve (개선)', icon: Zap, color: '#0d9488', desc: '해결안 도출' },
  { id: 'control', name: 'Control (관리)', icon: ShieldCheck, color: '#059669', desc: '성과 유지' },
];

const DFSS_STEPS = [
  { id: 'selection', name: 'Selection (선정)', icon: Target, color: '#475569', desc: '전략 연계 및 과제 선정' },
  { id: 'define', name: 'Define (정의)', icon: Target, color: '#1e3a8a', desc: '설계 목표 정의' },
  { id: 'measure', name: 'Measure (측정)', icon: Ruler, color: '#0369a1', desc: '고객 요구사항 측정' },
  { id: 'analyze', name: 'Analyze (분석)', icon: Search, color: '#0891b2', desc: '설계 대안 분석' },
  { id: 'design', name: 'Design (설계)', icon: Zap, color: '#7c3aed', desc: '최적 설계 실시' },
  { id: 'verify', name: 'Verify (검증)', icon: ShieldCheck, color: '#059669', desc: '설계 성능 검증' },
];

const ToolRecommendationPanel = ({ tools, industryName, completedTools, onSelectTool }) => {
  const [hoveredTool, setHoveredTool] = React.useState(null);

  if (!tools || tools.length === 0) return null;

  return (
    <div className="charter-section" style={{ background: '#f8f9fa', border: 'none', marginBottom: '2rem', padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.2rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>🎯 AI 추천 도구</h3>
        {industryName && (
          <span style={{ fontSize: '0.8rem', color: '#4f46e5', background: '#eef2ff', padding: '0.3rem 0.8rem', borderRadius: '20px', fontWeight: '600' }}>
            {industryName} 맞춤
          </span>
        )}
      </div>

      <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
        {tools.map(tool => {
          const isHovered = hoveredTool === tool.id;
          const isCompleted = completedTools.includes(tool.id);

          return (
            <div key={tool.id} style={{ position: 'relative' }}>
              <motion.button
                whileHover={{ y: -2, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                whileTap={{ scale: 0.95 }}
                onMouseEnter={() => setHoveredTool(tool.id)}
                onMouseLeave={() => setHoveredTool(null)}
                onClick={() => onSelectTool && onSelectTool(tool.id)}
                style={{
                  padding: '0.75rem 1.25rem',
                  border: isCompleted ? '2px solid #10b981' : '1px solid #e2e8f0',
                  borderRadius: '12px',
                  background: isCompleted ? '#f0fdf4' : 'white',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '600',
                  color: isCompleted ? '#059669' : '#334155',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  transition: 'all 0.2s ease',
                  minWidth: '120px',
                  justifyContent: 'center'
                }}
              >
                {isCompleted && <CheckCircle size={14} />}
                {tool.name_ko || tool.name}
              </motion.button>

              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      position: 'absolute',
                      top: '130%',
                      left: '0',
                      zIndex: 50,
                      background: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '1.25rem',
                      width: '320px',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      textAlign: 'left'
                    }}
                  >
                    <div className="popover-arrow" style={{
                      position: 'absolute', top: '-6px', left: '20px', width: '12px', height: '12px', background: 'white', borderLeft: '1px solid #e2e8f0', borderTop: '1px solid #e2e8f0', transform: 'rotate(45deg)'
                    }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>{tool.name_ko || tool.name}</h4>
                      <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '10px', background: tool.difficulty === 'easy' ? '#ecfdf5' : tool.difficulty === 'medium' ? '#fffbeb' : '#fef2f2', color: tool.difficulty === 'easy' ? '#059669' : tool.difficulty === 'medium' ? '#d97706' : '#dc2626' }}>
                        {tool.difficulty === 'easy' ? '쉬움' : tool.difficulty === 'medium' ? '보통' : '어려움'}
                      </span>
                    </div>

                    <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: '1.6', margin: '0 0 1rem 0' }}>
                      {tool.summary || tool.description}
                    </p>

                    {tool.when_to_use && (
                      <div style={{ fontSize: '0.8rem', background: '#f8fafc', padding: '0.75rem', borderRadius: '8px', color: '#475569' }}>
                        💡 {tool.when_to_use}
                      </div>
                    )}

                    <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', fontSize: '0.8rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> 예상 소요시간: {tool.time_estimate || '1-2시간'}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function App() {
  // Load sixsigma_data.json
  const [sigmaData, setSigmaData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Industry & Diagnostic
  const [selectedIndustry, setSelectedIndustry] = useState(() => {
    return localStorage.getItem('sigma_industry') || null;
  });
  const [diagnosticCompleted, setDiagnosticCompleted] = useState(() => {
    return localStorage.getItem('sigma_diagnostic_completed') === 'true' || false;
  });
  const [diagnosticResponses, setDiagnosticResponses] = useState(() => {
    const saved = localStorage.getItem('sigma_diagnostic_responses');
    return saved ? JSON.parse(saved) : {};
  });
  const [currentDiagnosticIndex, setCurrentDiagnosticIndex] = useState(() => {
    const saved = localStorage.getItem('sigma_diagnostic_index');
    return saved ? parseInt(saved, 10) : 0;
  });

  // Accordion UI state for problem types
  const [expandedProblemTypes, setExpandedProblemTypes] = useState(new Set());

  // Tool tracking
  const [completedTools, setCompletedTools] = useState(() => {
    const saved = localStorage.getItem('sigma_completed_tools');
    return saved ? JSON.parse(saved) : [];
  });

  // Quality checks
  const [qualityIssues, setQualityIssues] = useState([]);

  const [projectSelected, setProjectSelected] = useState(() => {
    return localStorage.getItem('sigma_project_selected') === 'true' || false;
  });
  const [opportunityAnalyzed, setOpportunityAnalyzed] = useState(() => {
    return localStorage.getItem('sigma_opportunity_analyzed') === 'true' || false;
  });
  const [methodology, setMethodology] = useState(() => {
    return localStorage.getItem('sigma_methodology') || null;
  });
  const [activeStep, setActiveStep] = useState('selection');
  const [showLogicTree, setShowLogicTree] = useState(false);
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('sigma_project_data');
    const parsedData = saved ? JSON.parse(saved) : null;

    // Data migration: add opportunity if it doesn't exist
    if (parsedData && parsedData.selection && !parsedData.selection.opportunity) {
      parsedData.selection.opportunity = {
        customerType: 'external',
        customerDefinition: '',
        customerNeeds: '',
        businessOpportunity: '',
        attachments: {
          customer: [],
          businessOpp: [],
          analysis3C: {
            customer: [],
            competitor: [],
            company: []
          },
          analysisFAW: {
            field: [],
            application: [],
            whatsNew: []
          }
        },
        analysis3C: {
          customer: '',
          competitor: '',
          company: ''
        },
        analysisFAW: {
          field: '',
          application: '',
          whatsNew: ''
        }
      };
    }

    // Migration: add attachments if opportunity exists but attachments don't
    if (parsedData && parsedData.selection && parsedData.selection.opportunity && !parsedData.selection.opportunity.attachments) {
      parsedData.selection.opportunity.attachments = {
        customer: [],
        businessOpp: [],
        analysis3C: {
          customer: [],
          competitor: [],
          company: []
        },
        analysisFAW: {
          field: [],
          application: [],
          whatsNew: []
        }
      };
    }

    // Migration: add fmea if it doesn't exist
    if (parsedData && parsedData.analyze && !parsedData.analyze.fmea) {
      parsedData.analyze.fmea = [];
    }

    return parsedData || {
      selection: {
        opportunity: {
          customerType: 'external',
          customerDefinition: '',
          customerNeeds: '',
          businessOpportunity: '',
          attachments: {
            customer: [],
            businessOpp: [],
            analysis3C: {
              customer: [],
              competitor: [],
              company: []
            },
            analysisFAW: {
              field: [],
              application: [],
              whatsNew: []
            }
          },
          analysis3C: {
            customer: '',
            competitor: '',
            company: ''
          },
          analysisFAW: {
            field: '',
            application: '',
            whatsNew: ''
          }
        },
        megaY: '',
        bigY: '',
        projectPool: [
          { name: '', currentLevel: '', goal: '', urgency: 3, impact: 3, total: 6, selected: false }
        ]
      },
      define: {
        projectTitle: '',
        businessCase: '',
        problemStatement: '',
        goal: '',
        scopeIn: '',
        scopeOut: '',
        financialBenefits: '', // Added for Project Charter
        team: [{ name: '', role: 'Champion' }],
        timeline: { start: '', end: '' },
        sipoc: {
          supplier: '',
          input: '',
          process: '',
          output: '',
          customer: ''
        }
      },
      measure: {
        unitCount: 0,
        defectCount: 0,
        opportunityPerUnit: 1,
        ctq: '',
        chartData: {
          controlChart: { samples: [], type: 'xbar' },
          histogram: { rawData: [], binCount: 10, lsl: null, usl: null },
          scatterPlot: { data: [], xLabel: 'X Variable', yLabel: 'Y Variable' },
          boxPlot: { groups: [] },
          runChart: { data: [] }
        }
      },
      analyze: {
        causes: [],
        alternatives: '',
        paretoItems: [
          { category: '기계 결함', count: 45 },
          { category: '작업 숙련도', count: 30 },
          { category: '자재 불량', count: 15 },
          { category: '환경 요인', count: 10 }
        ],
        fishbone: {
          man: ['', '', ''],
          machine: ['', '', ''],
          material: ['', '', ''],
          method: ['', '', ''],
          measurement: ['', '', ''],
          environment: ['', '', '']
        },
        fmea: [],
        why5: ['', '', '', '', ''],
        hypothesis: { sample1: '', sample2: '', testType: 't-test', result: null },
        regression: { xData: '', yData: '', result: null }
      },
      improve: { solutions: [] },
      design: { designSpecs: '' },
      control: {
        monitoringPlan: '',
        sop: '',
        training: ''
      },
      verify: { verificationResults: '' }
    };
  });

  // Version Control States
  const [versions, setVersions] = useState(() => {
    const saved = localStorage.getItem('sigma_version_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [versionDescription, setVersionDescription] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [activeTool, setActiveTool] = useState(null);

  // Reset active tool when changing steps or methodology to prevent modal conflicts
  useEffect(() => {
    setActiveTool(null);
  }, [activeStep, methodology]);

  // Load sixsigma_data.json on mount
  React.useEffect(() => {
    fetch('/sixsigma_data.json')
      .then(res => res.json())
      .then(data => {
        setSigmaData(data);
        setDataLoading(false);
      })
      .catch(err => {
        console.error('Failed to load sixsigma_data.json:', err);
        setDataLoading(false);
      });
  }, []);


  // Optimized: Sync to localStorage with debouncing
  React.useEffect(() => {
    const timer = setTimeout(() => {
      // Batch all localStorage writes together
      localStorage.setItem('sigma_project_data', JSON.stringify(data));
      localStorage.setItem('sigma_project_selected', projectSelected.toString());
      localStorage.setItem('sigma_opportunity_analyzed', opportunityAnalyzed.toString());
      localStorage.setItem('sigma_diagnostic_completed', diagnosticCompleted.toString());
      localStorage.setItem('sigma_diagnostic_responses', JSON.stringify(diagnosticResponses));
      localStorage.setItem('sigma_diagnostic_index', currentDiagnosticIndex.toString());
      localStorage.setItem('sigma_completed_tools', JSON.stringify(completedTools));

      if (methodology) {
        localStorage.setItem('sigma_methodology', methodology);
      } else {
        localStorage.removeItem('sigma_methodology');
      }

      if (selectedIndustry) {
        localStorage.setItem('sigma_industry', selectedIndustry);
      } else {
        localStorage.removeItem('sigma_industry');
      }
    }, 300); // 300ms debounce - waits for user to finish typing/clicking

    return () => clearTimeout(timer);
  }, [
    data,
    projectSelected,
    opportunityAnalyzed,
    methodology,
    selectedIndustry,
    diagnosticCompleted,
    diagnosticResponses,
    currentDiagnosticIndex,
    completedTools
  ]);


  // Auto-save on step progression - DISABLED (was causing navigation issues)
  // You can still manually save versions using the "버전" button
  /*
  React.useEffect(() => {
    const majorSteps = ['define', 'measure', 'analyze', 'improve', 'design', 'control', 'verify'];
    const isProgressingForward = majorSteps.indexOf(activeStep) > 0 && methodology;

    if (isProgressingForward && data.define.projectTitle) {
      const timer = setTimeout(() => {
        saveVersion(`${activeStep} 단계 진입`, true);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [activeStep]);
  */

  const handleExport = () => {
    const blob = new Blob([JSON.stringify({ methodology, data }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.define.projectTitle || '6sigma_project'}.json`;
    link.click();
  };

  // Version Management Functions
  const saveVersion = (description = versionDescription, auto = false) => {
    const timestamp = new Date().toISOString();
    const versionId = `v${versions.length + 1}_${Date.now()}`;

    const newVersion = {
      id: versionId,
      version: `1.${versions.length}.0`,
      timestamp,
      description: description || (auto ? '자동 저장' : '수동 저장'),
      methodology,
      projectTitle: data.define.projectTitle || '제목 없음',
      snapshot: JSON.parse(JSON.stringify(data)) // Deep copy
    };

    const updatedHistory = [...versions, newVersion];

    // 최대 20개 버전만 유지
    if (updatedHistory.length > 20) {
      updatedHistory.shift();
    }

    localStorage.setItem('sigma_version_history', JSON.stringify(updatedHistory));
    setVersions(updatedHistory);
    setVersionDescription('');

    return newVersion;
  };

  const restoreVersion = (versionId) => {
    const version = versions.find(v => v.id === versionId);
    if (version && window.confirm('이 버전으로 복원하시겠습니까? 현재 데이터는 저장되지 않습니다.')) {
      setData(version.snapshot);
      setMethodology(version.methodology);
      setShowVersionModal(false);
      alert('버전이 복원되었습니다.');
    }
  };

  const deleteVersion = (versionId) => {
    if (window.confirm('이 버전을 삭제하시겠습니까?')) {
      const updatedHistory = versions.filter(v => v.id !== versionId);
      localStorage.setItem('sigma_version_history', JSON.stringify(updatedHistory));
      setVersions(updatedHistory);
    }
  };

  // Tool Recommendation Engine
  const getToolRecommendations = (phase) => {
    if (!sigmaData || !selectedIndustry) return [];

    const industry = sigmaData.industries.find(ind => ind.id === selectedIndustry);
    if (!industry) return [];

    // Build context from diagnostic responses
    const rawProblemTypes = diagnosticResponses.q1_problem_type || [];
    const normalizedProblemTypes = rawProblemTypes.map(item =>
      typeof item === 'object' ? item.type : item
    );
    const problemSubtypes = rawProblemTypes
      .filter(item => typeof item === 'object' && item.subTypes)
      .flatMap(item => item.subTypes);

    const context = {
      industry: [selectedIndustry],
      problem_type: normalizedProblemTypes,
      problem_subtypes: problemSubtypes,
      data_type: diagnosticResponses.q2_data_type ? [diagnosticResponses.q2_data_type] : [],
      sample_size: diagnosticResponses.q3_sample_size ? [diagnosticResponses.q3_sample_size] : [],
      process_maturity: diagnosticResponses.q4_process_maturity ? [diagnosticResponses.q4_process_maturity] : [],
      scope: diagnosticResponses.q5_scope ? [diagnosticResponses.q5_scope] : []
    };

    // Get tools for this phase
    const phaseTools = sigmaData.tools.filter(tool => tool.phase === phase);

    // Score each tool
    const scoredTools = phaseTools.map(tool => {
      let score = 0;

      // Base score if in industry's preferred tools
      if (industry.preferred_tools && industry.preferred_tools.includes(tool.id)) {
        score += 10;
      }

      // Apply recommendation rules
      if (tool.recommendation_rules) {
        tool.recommendation_rules.forEach(rule => {
          const when = rule.when || {};
          let matches = true;

          // Check if all conditions match
          Object.keys(when).forEach(key => {
            const ruleValues = Array.isArray(when[key]) ? when[key] : [when[key]];
            const contextValues = Array.isArray(context[key]) ? context[key] : [context[key]];

            // Check if there's any overlap
            const hasMatch = ruleValues.some(rv => contextValues.includes(rv));
            if (!hasMatch) {
              matches = false;
            }
          });

          if (matches) {
            score += rule.score_add || 0;
          }
        });
      }

      return { ...tool, score };
    });

    // Sort by score descending
    return scoredTools.sort((a, b) => b.score - a.score);
  };

  // Quality Check Functions
  const runQualityChecks = (field, value) => {
    if (!sigmaData || !value) return [];

    const issues = [];
    const relevantRules = sigmaData.quality_rules.filter(rule => rule.field === field);

    relevantRules.forEach(rule => {
      let hasIssue = false;

      if (rule.type === 'keyword_blacklist') {
        const keywords = rule.keywords || [];
        const foundKeywords = keywords.filter(keyword =>
          value.toLowerCase().includes(keyword.toLowerCase())
        );
        if (foundKeywords.length > 0) {
          hasIssue = true;
        }
      } else if (rule.type === 'pattern_match') {
        const regex = new RegExp(rule.pattern);
        if (!regex.test(value)) {
          hasIssue = true;
        }
      }

      if (hasIssue) {
        issues.push({
          id: rule.id,
          severity: rule.severity,
          message: rule.message
        });
      }
    });

    return issues;
  };

  // Check if tool is completed
  const isToolCompleted = (toolId) => {
    return completedTools.includes(toolId);
  };

  // Mark tool as completed
  const markToolCompleted = (toolId) => {
    if (!completedTools.includes(toolId)) {
      setCompletedTools([...completedTools, toolId]);
    }
  };

  // Calculate Methodology Recommendation
  const calculateMethodologyRecommendation = (responses) => {
    if (!sigmaData || !responses) return null;

    let dmaicScore = 0;
    let dfssScore = 0;
    const reasons = [];

    const questions = sigmaData.diagnostic.questions;

    // Iterate through all responses
    Object.keys(responses).forEach(questionId => {
      const question = questions.find(q => q.id === questionId);
      if (!question) return;

      const response = responses[questionId];

      if (question.type === 'multi') {
        // Multiple choice - sum all selected options
        const selectedOptions = Array.isArray(response) ? response : [response];
        selectedOptions.forEach(optionId => {
          const option = question.options.find(opt => opt.id === optionId);
          if (option) {
            dmaicScore += option.dmaic_score || 0;
            dfssScore += option.dfss_score || 0;
          }
        });
      } else {
        // Single choice
        const option = question.options.find(opt => opt.id === response);
        if (option) {
          dmaicScore += option.dmaic_score || 0;
          dfssScore += option.dfss_score || 0;

          // Add reasoning based on key questions
          if (questionId === 'q6_project_nature') {
            if (response === 'existing_improve') {
              reasons.push('✓ 기존 프로세스 개선');
            } else if (response === 'new_design') {
              reasons.push('✓ 신규 설계 프로젝트');
            } else if (response === 'major_redesign') {
              reasons.push('✓ 전면 재설계 필요');
            }
          }

          if (questionId === 'q7_problem_clarity') {
            if (response === 'problem_clear') {
              reasons.push('✓ 문제가 명확히 정의됨');
            } else if (response === 'needs_analysis') {
              reasons.push('✓ 요구사항 분석부터 필요');
            }
          }

          if (questionId === 'q8_baseline_data') {
            if (response === 'data_exists') {
              reasons.push('✓ 현재 성능 데이터 확보');
            } else if (response === 'no_baseline') {
              reasons.push('✓ 베이스라인 데이터 없음 (신규)');
            }
          }
        }
      }
    });

    // Add reasons based on q9 goal types
    if (responses.q9_goal_type && Array.isArray(responses.q9_goal_type)) {
      if (responses.q9_goal_type.includes('innovation') || responses.q9_goal_type.includes('new_capability')) {
        reasons.push('✓ 혁신 및 신규 기능 목표');
      }
      if (responses.q9_goal_type.includes('reduce_defects') || responses.q9_goal_type.includes('cost_reduction')) {
        reasons.push('✓ 품질/비용 개선 목표');
      }
    }

    // Additional scoring based on process maturity
    if (responses.q4_process_maturity === 'ad_hoc') {
      dfssScore += 10;
      reasons.push('✓ 프로세스 비정형 (재설계 기회)');
    } else if (responses.q4_process_maturity === 'standard') {
      dmaicScore += 10;
    }

    return {
      dmaicScore,
      dfssScore,
      recommended: dmaicScore >= dfssScore ? 'dmaic' : 'dfss',
      reasons: reasons.length > 0 ? reasons : ['진단 결과를 바탕으로 한 추천입니다']
    };
  };

  // File Upload Component
  const FileUploadSection = ({ label, files, onFileAdd, onFileRemove }) => {
    const inputId = `file-input-${label.replace(/\s+/g, '-')}`;

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // 파일 크기 제한 (5MB)
        if (file.size > 5 * 1024 * 1024) {
          alert('파일 크기는 5MB를 초과할 수 없습니다.');
          e.target.value = '';
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          const fileData = {
            id: `file_${Date.now()}`,
            name: file.name,
            type: file.type,
            size: file.size,
            data: event.target.result,
            uploadedAt: new Date().toISOString()
          };
          onFileAdd(fileData);
          e.target.value = '';
        };
        reader.readAsDataURL(file);
      }
    };

    return (
      <div className="file-upload-section">
        <label className="file-upload-label">
          📎 {label} (선택사항)
        </label>
        <div className="file-upload-area">
          <input
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.xlsx,.xls,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
            style={{ display: 'none' }}
            id={inputId}
          />
          <label htmlFor={inputId} className="btn-upload">
            + 파일 첨부
          </label>

          {files && files.length > 0 && (
            <div className="file-list">
              {files.map((file) => (
                <div key={file.id} className="file-item">
                  <div className="file-info">
                    <span className="file-icon">📄</span>
                    <div>
                      <div className="file-name">{file.name}</div>
                      <div className="file-meta">
                        {(file.size / 1024).toFixed(1)} KB • {new Date(file.uploadedAt).toLocaleDateString('ko-KR')}
                      </div>
                    </div>
                  </div>
                  <div className="file-actions">
                    {file.type.startsWith('image/') && (
                      <button
                        className="btn-preview"
                        onClick={() => window.open(file.data, '_blank')}
                      >
                        보기
                      </button>
                    )}
                    <a
                      href={file.data}
                      download={file.name}
                      className="btn-download"
                    >
                      다운로드
                    </a>
                    <button
                      className="btn-delete-small"
                      onClick={() => onFileRemove(file.id)}
                      title="삭제"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Tool Recommendation Panel Removed (Moved outside)

  const steps = methodology === 'dmaic' ? DMAIC_STEPS : DFSS_STEPS;

  const renderContent = () => {
    // Loading state
    if (dataLoading) {
      return (
        <div className="fade-in" style={{ textAlign: 'center', padding: '4rem' }}>
          <h2>데이터 로딩 중...</h2>
          <p>잠시만 기다려주세요</p>
        </div>
      );
    }

    // Phase 0-0: Industry Selection (very first step)
    if (!selectedIndustry && sigmaData) {
      return (
        <div className="fade-in">
          <h2>🏢 업종 선택</h2>
          <p className="subtitle">프로젝트를 진행할 업종을 선택하세요. 업종에 맞는 맞춤형 도구와 템플릿이 제공됩니다.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
            {sigmaData.industries.map(industry => (
              <motion.div
                key={industry.id}
                whileHover={{ scale: 1.05, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '2rem',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  color: 'white',
                  textAlign: 'center'
                }}
                onClick={() => setSelectedIndustry(industry.id)}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{industry.icon}</div>
                <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>{industry.name}</h3>
                <p style={{ fontSize: '0.9rem', opacity: 0.9 }}>{industry.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      );
    }

    // Phase 0-0.5: Diagnostic Wizard
    if (selectedIndustry && !diagnosticCompleted && sigmaData) {
      const questions = sigmaData.diagnostic.questions;

      if (currentDiagnosticIndex < questions.length) {
        const currentQuestion = questions[currentDiagnosticIndex];

        return (
          <div className="fade-in">
            <h2>
              {selectedIndustry && sigmaData.industries && (
                <span style={{ color: '#667eea', marginRight: '0.5rem' }}>
                  {sigmaData.industries.find(i => i.id === selectedIndustry)?.icon}{' '}
                  {sigmaData.industries.find(i => i.id === selectedIndustry)?.name} ›{' '}
                </span>
              )}
              📋 진단 ({currentDiagnosticIndex + 1}/{questions.length})
            </h2>
            <p className="subtitle">{currentQuestion.title}</p>
            {currentQuestion.subtitle && <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '-0.5rem' }}>{currentQuestion.subtitle}</p>}

            <div className="charter-section" style={{ marginTop: '2rem' }}>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {currentQuestion.options
                  .filter(option => {
                    // Filter by industry if industries field exists
                    if (option.industries && option.industries.length > 0) {
                      return option.industries.includes(selectedIndustry);
                    }
                    // Show option for all industries if no industries field
                    return true;
                  })
                  .map(option => {
                    // Check if this is Q1 (problem types) and has subtypes
                    const hasSubTypes = currentQuestion.id === 'q1_problem_type' &&
                      option.subTypes &&
                      option.subTypes[selectedIndustry] &&
                      option.subTypes[selectedIndustry].length > 0;

                    const isExpanded = expandedProblemTypes.has(option.id);
                    const currentResponse = diagnosticResponses[currentQuestion.id] || (currentQuestion.type === 'multi' ? [] : '');

                    // Simplified selection logic: just check if ID is in array or equals value
                    const isMainTypeSelected = currentQuestion.type === 'multi'
                      ? Array.isArray(currentResponse) && currentResponse.includes(option.id)
                      : currentResponse === option.id;

                    const handleMainTypeClick = () => {
                      if (currentQuestion.type === 'multi') {
                        // Ensure it's an array
                        const currentArray = Array.isArray(currentResponse) ? currentResponse : [];
                        const updated = currentArray.includes(option.id)
                          ? currentArray.filter(id => id !== option.id)
                          : [...currentArray, option.id];

                        setDiagnosticResponses({ ...diagnosticResponses, [currentQuestion.id]: updated });

                        // Auto-expand to show examples when selecting (UX enhancement)
                        if (!currentArray.includes(option.id) && hasSubTypes && !isExpanded) {
                          const newExpanded = new Set(expandedProblemTypes);
                          newExpanded.add(option.id);
                          setExpandedProblemTypes(newExpanded);
                        }
                      } else {
                        setDiagnosticResponses({ ...diagnosticResponses, [currentQuestion.id]: option.id });
                      }
                    };

                    const toggleExpansion = (e) => {
                      e.stopPropagation();
                      const newExpanded = new Set(expandedProblemTypes);
                      if (isExpanded) {
                        newExpanded.delete(option.id);
                      } else {
                        newExpanded.add(option.id);
                      }
                      setExpandedProblemTypes(newExpanded);
                    };

                    return (
                      <div key={option.id} style={{ position: 'relative' }}>
                        <motion.div
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          onClick={handleMainTypeClick}
                          style={{
                            padding: '1.2rem',
                            border: `2px solid ${isMainTypeSelected ? '#667eea' : '#e0e0e0'}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            background: isMainTypeSelected ? 'rgba(102, 126, 234, 0.1)' : 'white',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            {option.icon && <span style={{ fontSize: '1.5rem' }}>{option.icon}</span>}
                            <div style={{ flex: 1 }}>
                              <strong>{option.label}</strong>
                              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                                {option.description}
                              </div>
                            </div>
                            {hasSubTypes && (
                              <button
                                onClick={toggleExpansion}
                                style={{
                                  background: 'none',
                                  border: 'none',
                                  cursor: 'pointer',
                                  fontSize: '1rem',
                                  padding: '0.25rem 0.5rem',
                                  color: '#667eea',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.25rem',
                                  fontWeight: '500'
                                }}
                              >
                                {isExpanded ? '접기 ▲' : '예시 보기 ▼'}
                              </button>
                            )}
                            {!hasSubTypes && currentQuestion.type === 'multi' && (
                              <input type="checkbox" checked={isMainTypeSelected} readOnly style={{ width: '1.25rem', height: '1.25rem' }} />
                            )}
                            {!hasSubTypes && currentQuestion.type === 'single' && (
                              <input type="radio" checked={isMainTypeSelected} readOnly style={{ width: '1.25rem', height: '1.25rem' }} />
                            )}
                            {/* Checkbox for subtypes items too (visual only for consistency) */}
                            {hasSubTypes && (
                              <input type="checkbox" checked={isMainTypeSelected} readOnly style={{ width: '1.25rem', height: '1.25rem' }} />
                            )}
                          </div>
                        </motion.div>

                        {/* Subtypes section - Reference Mode */}
                        {hasSubTypes && isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{
                              marginTop: '0.5rem',
                              marginLeft: '0.5rem',
                              marginRight: '0.5rem',
                              padding: '1rem',
                              background: '#f8f9fa',
                              borderRadius: '8px',
                              borderLeft: '4px solid #667eea'
                            }}
                          >
                            <div style={{ fontSize: '0.9rem', color: '#4a5568', marginBottom: '0.75rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              💡 구체적인 문제 사례 (참고용)
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
                              {option.subTypes[selectedIndustry].map(subType => (
                                <div
                                  key={subType.id}
                                  style={{
                                    padding: '0.75rem',
                                    background: 'white',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '6px',
                                    fontSize: '0.9rem'
                                  }}
                                >
                                  <div style={{ fontWeight: '600', color: '#2d3748', marginBottom: '0.25rem' }}>
                                    • {subType.label}
                                  </div>
                                  <div style={{ fontSize: '0.85rem', color: '#718096' }}>
                                    {subType.description}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    );
                  })}
              </div>

              <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'space-between' }}>
                {currentDiagnosticIndex === 0 ? (
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      if (window.confirm('업종 선택으로 돌아가시겠습니까? 진단 데이터가 초기화됩니다.')) {
                        setSelectedIndustry(null);
                        setDiagnosticCompleted(false);
                        setCurrentDiagnosticIndex(0);
                        setDiagnosticResponses({});
                      }
                    }}
                  >
                    ← 업종 변경
                  </button>
                ) : (
                  <button
                    className="btn-secondary"
                    onClick={() => {
                      let prevIndex = currentDiagnosticIndex - 1;
                      // Skip Q3 (Sample Size) if Q2 (Data Type) is 'none'
                      if (questions[prevIndex].id === 'q3_sample_size' && diagnosticResponses['q2_data_type'] === 'none') {
                        prevIndex--;
                      }
                      setCurrentDiagnosticIndex(prevIndex);
                    }}
                  >
                    ← 이전
                  </button>
                )}
                <button
                  className="btn-primary"
                  onClick={() => {
                    let nextIndex = currentDiagnosticIndex + 1;
                    // Skip Q3 (Sample Size) if Q2 (Data Type) is 'none'
                    if (questions[nextIndex] && questions[nextIndex].id === 'q3_sample_size' && diagnosticResponses['q2_data_type'] === 'none') {
                      nextIndex++;
                    }

                    if (nextIndex >= questions.length) {
                      setDiagnosticCompleted(true);
                      setCurrentDiagnosticIndex(0); // Reset for potential future use
                    } else {
                      setCurrentDiagnosticIndex(nextIndex);
                    }
                  }}
                  disabled={!diagnosticResponses[currentQuestion.id] || (currentQuestion.type === 'multi' && diagnosticResponses[currentQuestion.id].length === 0)}
                  style={{ marginLeft: 'auto' }}
                >
                  {currentDiagnosticIndex === questions.length - 1 ? '완료' : '다음 →'}
                </button>
              </div>
            </div>
          </div>
        );
      }
    }

    // Phase 0-0.75: Methodology Recommendation (after diagnostic, before selection)
    if (selectedIndustry && diagnosticCompleted && !methodology && sigmaData) {
      const recommendation = calculateMethodologyRecommendation(diagnosticResponses);

      if (!recommendation) {
        // Fallback if calculation fails
        return (
          <div className="fade-in">
            <h2>⚠️ 추천 계산 오류</h2>
            <p>방법론을 수동으로 선택해주세요.</p>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button className="btn-primary" onClick={() => { localStorage.setItem('sigma_methodology', 'dmaic'); setMethodology('dmaic'); setActiveStep('define'); }}>DMAIC 선택</button>
              <button className="btn-primary" onClick={() => { localStorage.setItem('sigma_methodology', 'dfss'); setMethodology('dfss'); setActiveStep('define'); }}>DFSS 선택</button>
            </div>
          </div>
        );
      }

      return (
        <div className="fade-in">
          <h2>🎯 방법론 추천 결과</h2>
          <p className="subtitle">진단 결과를 바탕으로 적합한 6시그마 방법론을 추천합니다</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
            {/* DMAIC Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              style={{
                padding: '2rem',
                borderRadius: '12px',
                border: recommendation.recommended === 'dmaic' ? '3px solid #667eea' : '2px solid #e0e0e0',
                background: recommendation.recommended === 'dmaic' ? 'linear-gradient(135deg, rgba(102,126,234,0.1) 0%, rgba(118,75,162,0.1) 100%)' : 'white',
                position: 'relative'
              }}
            >
              {recommendation.recommended === 'dmaic' && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: '#667eea',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 'bold'
                }}>
                  ⭐ 추천
                </div>
              )}

              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔧</div>
              <h3 style={{ marginBottom: '0.5rem' }}>DMAIC</h3>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>
                Define - Measure - Analyze - Improve - Control
              </p>

              <div style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>적합도 점수</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
                  {recommendation.dmaicScore}점
                </div>
              </div>

              <div style={{ fontSize: '0.9rem', color: '#555', marginBottom: '1.5rem' }}>
                <strong>적용 대상:</strong><br />
                • 기존 프로세스 개선<br />
                • 문제가 명확히 정의됨<br />
                • 성능 데이터 확보 가능<br />
                • 점진적 개선 목표
              </div>

              <button
                className="btn-primary"
                onClick={() => { localStorage.setItem('sigma_methodology', 'dmaic'); setMethodology('dmaic'); setActiveStep('define'); }}
                style={{ width: '100%' }}
              >
                DMAIC 선택
              </button>
            </motion.div>

            {/* DFSS Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              style={{
                padding: '2rem',
                borderRadius: '12px',
                border: recommendation.recommended === 'dfss' ? '3px solid #7c3aed' : '2px solid #e0e0e0',
                background: recommendation.recommended === 'dfss' ? 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, rgba(99,102,241,0.1) 100%)' : 'white',
                position: 'relative'
              }}
            >
              {recommendation.recommended === 'dfss' && (
                <div style={{
                  position: 'absolute',
                  top: '1rem',
                  right: '1rem',
                  background: '#7c3aed',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 'bold'
                }}>
                  ⭐ 추천
                </div>
              )}

              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
              <h3 style={{ marginBottom: '0.5rem' }}>DFSS</h3>
              <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1.5rem' }}>
                Design for Six Sigma (DMADV)
              </p>

              <div style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.5rem' }}>적합도 점수</div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#7c3aed' }}>
                  {recommendation.dfssScore}점
                </div>
              </div>

              <div style={{ fontSize: '0.9rem', color: '#555', marginBottom: '1.5rem' }}>
                <strong>적용 대상:</strong><br />
                • 신규 프로세스/제품 설계<br />
                • 요구사항부터 정의 필요<br />
                • 베이스라인 데이터 없음<br />
                • 혁신적 변화 추구
              </div>

              <button
                className="btn-primary"
                onClick={() => { localStorage.setItem('sigma_methodology', 'dfss'); setMethodology('dfss'); setActiveStep('define'); }}
                style={{ width: '100%', background: '#7c3aed' }}
              >
                DFSS 선택
              </button>
            </motion.div>
          </div>

          {/* Recommendation Reasoning */}
          <div className="charter-section" style={{ marginTop: '2rem', background: '#f8f9fa', border: '2px solid #667eea' }}>
            <h3 style={{ marginBottom: '1rem' }}>💡 추천 근거</h3>
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              {recommendation.reasons.map((reason, idx) => (
                <div key={idx} style={{ fontSize: '0.95rem', color: '#555' }}>
                  {reason}
                </div>
              ))}
            </div>
            <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '1rem', fontStyle: 'italic' }}>
              💡 추천은 참고용이며, 프로젝트 특성에 따라 다른 방법론을 선택하실 수 있습니다.
            </p>
          </div>
        </div>
      );
    }

    // Phase 0-1: Business Opportunity Analysis (first step)
    if (!opportunityAnalyzed && !projectSelected) {
      return (
        <div className="fade-in">
          <h2>0-1단계: Business 개선기회 분석</h2>
          <p className="subtitle">프로세스 개선의 첫걸음은 Business 개선기회를 명확히 하는 것입니다.</p>

          {/* 1. 고객 정의 */}
          <div className="charter-section">
            <h3>1. 고객 정의 (Customer Definition)</h3>
            <div className="form-group">
              <label>고객 유형</label>
              <div className="radio-group" style={{ display: 'flex', gap: '2rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value="external"
                    checked={data.selection.opportunity.customerType === 'external'}
                    onChange={(e) => setData({ ...data, selection: { ...data.selection, opportunity: { ...data.selection.opportunity, customerType: e.target.value } } })}
                    style={{ width: '1.25rem', height: '1.25rem' }}
                  />
                  <span>외부고객 (External Customer)</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    value="internal"
                    checked={data.selection.opportunity.customerType === 'internal'}
                    onChange={(e) => setData({ ...data, selection: { ...data.selection, opportunity: { ...data.selection.opportunity, customerType: e.target.value } } })}
                    style={{ width: '1.25rem', height: '1.25rem' }}
                  />
                  <span>내부고객 (Internal Customer)</span>
                </label>
              </div>
            </div>

            <div className="form-group">
              <label>고객 정의 및 특성</label>
              <textarea
                placeholder="예: 최종 소비자, 연령대 30-50대, B2B 고객사 등"
                value={data.selection.opportunity.customerDefinition}
                onChange={(e) => setData({ ...data, selection: { ...data.selection, opportunity: { ...data.selection.opportunity, customerDefinition: e.target.value } } })}
              />
            </div>

            <div className="form-group">
              <label>고객 니즈 및 요구사항 (Voice of Customer)</label>
              <textarea
                placeholder="고객이 원하는 것, 불만사항, 개선 요청사항 등"
                value={data.selection.opportunity.customerNeeds}
                onChange={(e) => setData({ ...data, selection: { ...data.selection, opportunity: { ...data.selection.opportunity, customerNeeds: e.target.value } } })}
              />
            </div>

            <FileUploadSection
              label="고객 관련 참고자료"
              files={data.selection.opportunity.attachments?.customer || []}
              onFileAdd={(file) => {
                const newAttachments = [...(data.selection.opportunity.attachments?.customer || []), file];
                setData({
                  ...data,
                  selection: {
                    ...data.selection,
                    opportunity: {
                      ...data.selection.opportunity,
                      attachments: {
                        ...data.selection.opportunity.attachments,
                        customer: newAttachments
                      }
                    }
                  }
                });
              }}
              onFileRemove={(fileId) => {
                const newAttachments = (data.selection.opportunity.attachments?.customer || []).filter(f => f.id !== fileId);
                setData({
                  ...data,
                  selection: {
                    ...data.selection,
                    opportunity: {
                      ...data.selection.opportunity,
                      attachments: {
                        ...data.selection.opportunity.attachments,
                        customer: newAttachments
                      }
                    }
                  }
                });
              }}
            />
          </div>

          {/* 2. 고객중심 Business 개선기회 */}
          <div className="charter-section mt-2">
            <h3>2. 고객중심 Business 개선기회</h3>
            <div className="tip-box">
              <strong>💡 작성 가이드</strong>
              <p>고객 니즈를 기반으로 우리가 개선해야 할 Business 영역을 명확히 하세요.</p>
            </div>
            <div className="form-group">
              <label>Business 개선기회</label>
              <textarea
                rows="4"
                placeholder="예: 고객 불만이 많은 배송 리드타임 단축으로 고객 만족도 향상"
                value={data.selection.opportunity.businessOpportunity}
                onChange={(e) => setData({ ...data, selection: { ...data.selection, opportunity: { ...data.selection.opportunity, businessOpportunity: e.target.value } } })}
              />
            </div>

            <FileUploadSection
              label="Business 개선기회 참고자료"
              files={data.selection.opportunity.attachments?.businessOpp || []}
              onFileAdd={(file) => {
                const newAttachments = [...(data.selection.opportunity.attachments?.businessOpp || []), file];
                setData({
                  ...data,
                  selection: {
                    ...data.selection,
                    opportunity: {
                      ...data.selection.opportunity,
                      attachments: {
                        ...data.selection.opportunity.attachments,
                        businessOpp: newAttachments
                      }
                    }
                  }
                });
              }}
              onFileRemove={(fileId) => {
                const newAttachments = (data.selection.opportunity.attachments?.businessOpp || []).filter(f => f.id !== fileId);
                setData({
                  ...data,
                  selection: {
                    ...data.selection,
                    opportunity: {
                      ...data.selection.opportunity,
                      attachments: {
                        ...data.selection.opportunity.attachments,
                        businessOpp: newAttachments
                      }
                    }
                  }
                });
              }}
            />
          </div>

          {/* 3. 3C 분석 */}
          <div className="charter-section mt-2">
            <h3>3. 3C 분석 (환경 분석)</h3>
            <div className="tip-box">
              <strong>📊 3C Framework</strong>
              <ul style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                <li><strong>Customer (고객):</strong> 고객의 니즈, 구매 패턴, 시장 동향</li>
                <li><strong>Competitor (경쟁사):</strong> 경쟁사의 강점/약점, 시장 점유율</li>
                <li><strong>Company (자사):</strong> 우리의 강점/약점, 핵심 역량</li>
              </ul>
            </div>

            <div className="form-group">
              <label>Customer (고객 분석)</label>
              <textarea
                placeholder="고객 세그먼트, 구매 패턴, 트렌드 등"
                value={data.selection.opportunity.analysis3C.customer}
                onChange={(e) => setData({ ...data, selection: { ...data.selection, opportunity: { ...data.selection.opportunity, analysis3C: { ...data.selection.opportunity.analysis3C, customer: e.target.value } } } })}
              />
            </div>

            <FileUploadSection
              label="고객 분석 자료"
              files={data.selection.opportunity.attachments?.analysis3C?.customer || []}
              onFileAdd={(file) => {
                const newAttachments = [...(data.selection.opportunity.attachments?.analysis3C?.customer || []), file];
                setData({
                  ...data,
                  selection: {
                    ...data.selection,
                    opportunity: {
                      ...data.selection.opportunity,
                      attachments: {
                        ...data.selection.opportunity.attachments,
                        analysis3C: {
                          ...data.selection.opportunity.attachments?.analysis3C,
                          customer: newAttachments
                        }
                      }
                    }
                  }
                });
              }}
              onFileRemove={(fileId) => {
                const newAttachments = (data.selection.opportunity.attachments?.analysis3C?.customer || []).filter(f => f.id !== fileId);
                setData({
                  ...data,
                  selection: {
                    ...data.selection,
                    opportunity: {
                      ...data.selection.opportunity,
                      attachments: {
                        ...data.selection.opportunity.attachments,
                        analysis3C: {
                          ...data.selection.opportunity.attachments?.analysis3C,
                          customer: newAttachments
                        }
                      }
                    }
                  }
                });
              }}
            />

            <div className="form-group">
              <label>Competitor (경쟁사 분석)</label>
              <textarea
                placeholder="주요 경쟁사, 그들의 강점/약점, 차별화 포인트"
                value={data.selection.opportunity.analysis3C.competitor}
                onChange={(e) => setData({ ...data, selection: { ...data.selection, opportunity: { ...data.selection.opportunity, analysis3C: { ...data.selection.opportunity.analysis3C, competitor: e.target.value } } } })}
              />
            </div>

            <FileUploadSection
              label="경쟁사 분석 자료"
              files={data.selection.opportunity.attachments?.analysis3C?.competitor || []}
              onFileAdd={(file) => {
                const newAttachments = [...(data.selection.opportunity.attachments?.analysis3C?.competitor || []), file];
                setData({
                  ...data,
                  selection: {
                    ...data.selection,
                    opportunity: {
                      ...data.selection.opportunity,
                      attachments: {
                        ...data.selection.opportunity.attachments,
                        analysis3C: {
                          ...data.selection.opportunity.attachments?.analysis3C,
                          competitor: newAttachments
                        }
                      }
                    }
                  }
                });
              }}
              onFileRemove={(fileId) => {
                const newAttachments = (data.selection.opportunity.attachments?.analysis3C?.competitor || []).filter(f => f.id !== fileId);
                setData({
                  ...data,
                  selection: {
                    ...data.selection,
                    opportunity: {
                      ...data.selection.opportunity,
                      attachments: {
                        ...data.selection.opportunity.attachments,
                        analysis3C: {
                          ...data.selection.opportunity.attachments?.analysis3C,
                          competitor: newAttachments
                        }
                      }
                    }
                  }
                });
              }}
            />

            <div className="form-group">
              <label>Company (자사 분석)</label>
              <textarea
                placeholder="우리의 강점, 약점, 핵심 역량, 개선 가능 영역"
                value={data.selection.opportunity.analysis3C.company}
                onChange={(e) => setData({ ...data, selection: { ...data.selection, opportunity: { ...data.selection.opportunity, analysis3C: { ...data.selection.opportunity.analysis3C, company: e.target.value } } } })}
              />
            </div>

            <FileUploadSection
              label="자사 분석 자료"
              files={data.selection.opportunity.attachments?.analysis3C?.company || []}
              onFileAdd={(file) => {
                const newAttachments = [...(data.selection.opportunity.attachments?.analysis3C?.company || []), file];
                setData({
                  ...data,
                  selection: {
                    ...data.selection,
                    opportunity: {
                      ...data.selection.opportunity,
                      attachments: {
                        ...data.selection.opportunity.attachments,
                        analysis3C: {
                          ...data.selection.opportunity.attachments?.analysis3C,
                          company: newAttachments
                        }
                      }
                    }
                  }
                });
              }}
              onFileRemove={(fileId) => {
                const newAttachments = (data.selection.opportunity.attachments?.analysis3C?.company || []).filter(f => f.id !== fileId);
                setData({
                  ...data,
                  selection: {
                    ...data.selection,
                    opportunity: {
                      ...data.selection.opportunity,
                      attachments: {
                        ...data.selection.opportunity.attachments,
                        analysis3C: {
                          ...data.selection.opportunity.attachments?.analysis3C,
                          company: newAttachments
                        }
                      }
                    }
                  }
                });
              }}
            />
          </div>

          {/* 4. FAW 분석 */}
          <div className="charter-section mt-2">
            <h3>4. FAW 분석 (시장 및 기술 동향)</h3>
            <div className="tip-box">
              <strong>🔍 FAW Framework</strong>
              <ul style={{ marginTop: '0.5rem', marginBottom: 0 }}>
                <li><strong>Field (시장/현장):</strong> 시장 규모, 성장성, 현장 이슈</li>
                <li><strong>Application (응용분야):</strong> 제품/서비스 응용 영역</li>
                <li><strong>What's New (신기술/트렌드):</strong> 최신 기술, 산업 트렌드</li>
              </ul>
            </div>

            <div className="form-group">
              <label>Field (시장/현장 분석)</label>
              <textarea
                placeholder="시장 규모, 성장률, 현장에서의 주요 이슈"
                value={data.selection.opportunity.analysisFAW.field}
                onChange={(e) => setData({ ...data, selection: { ...data.selection, opportunity: { ...data.selection.opportunity, analysisFAW: { ...data.selection.opportunity.analysisFAW, field: e.target.value } } } })}
              />
            </div>

            <FileUploadSection
              label="시장/현장 분석 자료"
              files={data.selection.opportunity.attachments?.analysisFAW?.field || []}
              onFileAdd={(file) => {
                const newAttachments = [...(data.selection.opportunity.attachments?.analysisFAW?.field || []), file];
                setData({
                  ...data,
                  selection: {
                    ...data.selection,
                    opportunity: {
                      ...data.selection.opportunity,
                      attachments: {
                        ...data.selection.opportunity.attachments,
                        analysisFAW: {
                          ...data.selection.opportunity.attachments?.analysisFAW,
                          field: newAttachments
                        }
                      }
                    }
                  }
                });
              }}
              onFileRemove={(fileId) => {
                const newAttachments = (data.selection.opportunity.attachments?.analysisFAW?.field || []).filter(f => f.id !== fileId);
                setData({
                  ...data,
                  selection: {
                    ...data.selection,
                    opportunity: {
                      ...data.selection.opportunity,
                      attachments: {
                        ...data.selection.opportunity.attachments,
                        analysisFAW: {
                          ...data.selection.opportunity.attachments?.analysisFAW,
                          field: newAttachments
                        }
                      }
                    }
                  }
                });
              }}
            />

            <div className="form-group">
              <label>Application (응용분야)</label>
              <textarea
                placeholder="우리 제품/서비스가 적용되는 분야, 확장 가능 영역"
                value={data.selection.opportunity.analysisFAW.application}
                onChange={(e) => setData({ ...data, selection: { ...data.selection, opportunity: { ...data.selection.opportunity, analysisFAW: { ...data.selection.opportunity.analysisFAW, application: e.target.value } } } })}
              />
            </div>

            <FileUploadSection
              label="응용분야 분석 자료"
              files={data.selection.opportunity.attachments?.analysisFAW?.application || []}
              onFileAdd={(file) => {
                const newAttachments = [...(data.selection.opportunity.attachments?.analysisFAW?.application || []), file];
                setData({
                  ...data,
                  selection: {
                    ...data.selection,
                    opportunity: {
                      ...data.selection.opportunity,
                      attachments: {
                        ...data.selection.opportunity.attachments,
                        analysisFAW: {
                          ...data.selection.opportunity.attachments?.analysisFAW,
                          application: newAttachments
                        }
                      }
                    }
                  }
                });
              }}
              onFileRemove={(fileId) => {
                const newAttachments = (data.selection.opportunity.attachments?.analysisFAW?.application || []).filter(f => f.id !== fileId);
                setData({
                  ...data,
                  selection: {
                    ...data.selection,
                    opportunity: {
                      ...data.selection.opportunity,
                      attachments: {
                        ...data.selection.opportunity.attachments,
                        analysisFAW: {
                          ...data.selection.opportunity.attachments?.analysisFAW,
                          application: newAttachments
                        }
                      }
                    }
                  }
                });
              }}
            />

            <div className="form-group">
              <label>What's New (신기술/트렌드)</label>
              <textarea
                placeholder="최신 기술 동향, 산업 트렌드, 디지털 전환 등"
                value={data.selection.opportunity.analysisFAW.whatsNew}
                onChange={(e) => setData({ ...data, selection: { ...data.selection, opportunity: { ...data.selection.opportunity, analysisFAW: { ...data.selection.opportunity.analysisFAW, whatsNew: e.target.value } } } })}
              />
            </div>

            <FileUploadSection
              label="신기술/트렌드 분석 자료"
              files={data.selection.opportunity.attachments?.analysisFAW?.whatsNew || []}
              onFileAdd={(file) => {
                const newAttachments = [...(data.selection.opportunity.attachments?.analysisFAW?.whatsNew || []), file];
                setData({
                  ...data,
                  selection: {
                    ...data.selection,
                    opportunity: {
                      ...data.selection.opportunity,
                      attachments: {
                        ...data.selection.opportunity.attachments,
                        analysisFAW: {
                          ...data.selection.opportunity.attachments?.analysisFAW,
                          whatsNew: newAttachments
                        }
                      }
                    }
                  }
                });
              }}
              onFileRemove={(fileId) => {
                const newAttachments = (data.selection.opportunity.attachments?.analysisFAW?.whatsNew || []).filter(f => f.id !== fileId);
                setData({
                  ...data,
                  selection: {
                    ...data.selection,
                    opportunity: {
                      ...data.selection.opportunity,
                      attachments: {
                        ...data.selection.opportunity.attachments,
                        analysisFAW: {
                          ...data.selection.opportunity.attachments?.analysisFAW,
                          whatsNew: newAttachments
                        }
                      }
                    }
                  }
                });
              }}
            />
          </div>

          <div className="action-footer">
            <button
              className="btn btn-primary"
              onClick={() => setOpportunityAnalyzed(true)}
            >
              과제 선정 단계로 이동 <ChevronRight />
            </button>
          </div>
        </div>
      );
    }

    // Phase 0-2: Project Selection (after opportunity analysis)
    if (!projectSelected && opportunityAnalyzed) {
      return (
        <div className="fade-in">
          <button
            className="btn-text"
            style={{ marginBottom: '1rem' }}
            onClick={() => setOpportunityAnalyzed(false)}
          >
            ← Business 개선기회 분석으로
          </button>
          <h2>0-2단계: 과제 선정 (Project Selection)</h2>
          <p className="subtitle">조직의 전략과 연계하여 최적의 프로젝트를 선정합니다.</p>

          <div className="charter-section">
            <h3>1. 전략 Cascading (전략 연계)</h3>
            <div className="form-row">
              <div className="form-group flex-1">
                <label>회사/단위조직 전략과제 (Mega-Y)</label>
                <input
                  type="text"
                  placeholder="예: 2026년 고객 만족도 1위 달성"
                  value={data.selection.megaY}
                  onChange={(e) => setData({ ...data, selection: { ...data.selection, megaY: e.target.value } })}
                />
              </div>
              <div className="form-group flex-1">
                <label>핵심 프로세스 성과 (Big-Y)</label>
                <input
                  type="text"
                  placeholder="예: 클레임 처리 리드타임 단축"
                  value={data.selection.bigY}
                  onChange={(e) => setData({ ...data, selection: { ...data.selection, bigY: e.target.value } })}
                />
              </div>
            </div>

            <div style={{ marginTop: '1rem', textAlign: 'right' }}>
              <button
                className="btn-secondary"
                onClick={() => setShowLogicTree(true)}
                style={{ fontSize: '0.9rem', padding: '0.4rem 0.8rem' }}
              >
                🌳 Logic Tree (CTQ) 도구 열기
              </button>
            </div>

            <AnimatePresence>
              {showLogicTree && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ marginTop: '1rem', overflow: 'hidden' }}
                >
                  <LogicTreeDiagram
                    data={data.selection.logicTree || {
                      id: 'root',
                      type: 'mega-y',
                      content: data.selection.megaY || 'Mega-Y',
                      children: []
                    }}
                    setData={(newTree) => setData(prev => ({
                      ...prev,
                      selection: { ...prev.selection, logicTree: newTree }
                    }))}
                    onNodeSelect={(node) => {
                      if (node.type === 'project' && node.content) {
                        setData(prev => ({
                          ...prev,
                          selection: {
                            ...prev.selection,
                            projectPool: [
                              ...prev.selection.projectPool,
                              {
                                id: Date.now(),
                                name: node.content,
                                currentLevel: 1,
                                targetLevel: 5,
                                urgency: 3,
                                impact: 3
                              }
                            ]
                          }
                        }));
                      }
                    }}
                    onClose={() => setShowLogicTree(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="charter-section mt-2">
            <h3>2. 과제 Pool (Project Pool)</h3>
            <div className="table-container">
              <table className="priority-table">
                <thead>
                  <tr>
                    <th style={{ width: '40px' }}>선정</th>
                    <th>과제명</th>
                    <th>현재 수준</th>
                    <th>목표 수준</th>
                    <th style={{ width: '90px' }}>시급성</th>
                    <th style={{ width: '90px' }}>파급효과</th>
                    <th style={{ width: '80px' }}>합계</th>
                    <th style={{ width: '60px' }}>삭제</th>
                  </tr>
                </thead>
                <tbody>
                  {data.selection.projectPool.map((item, idx) => (
                    <tr key={idx} className={item.selected ? 'row-selected' : ''}>
                      <td style={{ textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          checked={item.selected}
                          onChange={() => {
                            const newPool = data.selection.projectPool.map((p, i) => ({
                              ...p,
                              selected: i === idx ? !p.selected : false
                            }));
                            const selectedProject = newPool.find(p => p.selected);
                            setData({
                              ...data,
                              selection: { ...data.selection, projectPool: newPool },
                              define: {
                                ...data.define,
                                projectTitle: selectedProject ? selectedProject.name : data.define.projectTitle,
                                businessCase: selectedProject
                                  ? `[전략 연계 선정]\nMega-Y: ${data.selection.megaY}\nBig-Y: ${data.selection.bigY}\n\n상기 상위 전략 달성을 위해 시급성(${selectedProject.urgency})/파급효과(${selectedProject.impact})가 높은 과제로 선정됨.`
                                  : data.define.businessCase
                              }
                            });
                          }}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => {
                            const newPool = [...data.selection.projectPool];
                            newPool[idx].name = e.target.value;
                            setData({ ...data, selection: { ...data.selection, projectPool: newPool } });
                          }}
                          placeholder="과제명 입력"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={item.currentLevel}
                          onChange={(e) => {
                            const newPool = [...data.selection.projectPool];
                            newPool[idx].currentLevel = e.target.value;
                            setData({ ...data, selection: { ...data.selection, projectPool: newPool } });
                          }}
                          placeholder="현재"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={item.goal}
                          onChange={(e) => {
                            const newPool = [...data.selection.projectPool];
                            newPool[idx].goal = e.target.value;
                            setData({ ...data, selection: { ...data.selection, projectPool: newPool } });
                          }}
                          placeholder="목표"
                        />
                      </td>
                      <td>
                        <select
                          value={item.urgency}
                          onChange={(e) => {
                            const newPool = [...data.selection.projectPool];
                            newPool[idx].urgency = Number(e.target.value);
                            newPool[idx].total = newPool[idx].urgency + newPool[idx].impact;
                            setData({ ...data, selection: { ...data.selection, projectPool: newPool } });
                          }}
                        >
                          {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </td>
                      <td>
                        <select
                          value={item.impact}
                          onChange={(e) => {
                            const newPool = [...data.selection.projectPool];
                            newPool[idx].impact = Number(e.target.value);
                            newPool[idx].total = newPool[idx].urgency + newPool[idx].impact;
                            setData({ ...data, selection: { ...data.selection, projectPool: newPool } });
                          }}
                        >
                          {[1, 2, 3, 4, 5].map(v => <option key={v} value={v}>{v}</option>)}
                        </select>
                      </td>
                      <td style={{ textAlign: 'center', fontWeight: 'bold', color: '#2563eb' }}>
                        {item.total}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          className="btn-delete-small"
                          onClick={() => {
                            if (data.selection.projectPool.length > 1) {
                              const newPool = data.selection.projectPool.filter((_, i) => i !== idx);
                              setData({ ...data, selection: { ...data.selection, projectPool: newPool } });
                            } else {
                              alert('최소 1개의 과제는 유지해야 합니다.');
                            }
                          }}
                          title="삭제"
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              className="btn-text"
              style={{ marginTop: '1rem' }}
              onClick={() => {
                setData({
                  ...data,
                  selection: {
                    ...data.selection,
                    projectPool: [...data.selection.projectPool, { name: '', currentLevel: '', goal: '', urgency: 3, impact: 3, total: 6, selected: false }]
                  }
                });
              }}
            >
              + 과제 추가
            </button>
          </div>

          <div className="action-footer">
            <button
              className="btn btn-primary"
              onClick={() => {
                if (!data.selection.projectPool.some(p => p.selected)) {
                  alert("먼저 '과제 Pool' 표의 왼쪽 체크박스(선정)를 눌러 최적의 과제를 선택해주세요.");
                  return;
                }
                setProjectSelected(true);
              }}
              title={!data.selection.projectPool.some(p => p.selected) ? "먼저 왼쪽 체크박스로 과제를 선택해주세요" : "다음 단계로 이동"}
            >
              방법론 선택하기 <ChevronRight />
            </button>
          </div>
        </div>
      );
    }

    // Phase 2: Methodology Selection (after project is selected)
    if (!methodology) {
      return (
        <div className="fade-in selection-screen">
          <button
            className="btn-text"
            style={{ marginBottom: '2rem' }}
            onClick={() => {
              setProjectSelected(false);
              setMethodology(null);
            }}
          >
            ← 과제 재선정
          </button>
          <h2>방법론 선택</h2>
          <p className="subtitle">선정된 프로젝트의 특성에 맞는 방법론을 선택하세요.</p>
          <div className="selection-grid">
            <button className="selection-card" onClick={() => {
              localStorage.setItem('sigma_methodology', 'dmaic');
              setMethodology('dmaic');
              setActiveStep('define');
            }}>
              <div className="selection-icon dmaic"><Zap size={32} /></div>
              <div className="card-body">
                <h3>DMAIC</h3>
                <p>기존 프로세스의 결함을 개선하고 최적화하고 싶을 때 사용합니다.</p>
                <div className="selection-badge">기존 공정 개선</div>
              </div>
            </button>
            <button className="selection-card" onClick={() => {
              localStorage.setItem('sigma_methodology', 'dfss');
              setMethodology('dfss');
              setActiveStep('define');
            }}>
              <div className="selection-icon dfss"><PlusCircle size={32} /></div>
              <div className="card-body">
                <h3>DFSS (DMADV)</h3>
                <p>새로운 제품이나 공정을 처음부터 무결점으로 설계하고 싶을 때 사용합니다.</p>
                <div className="selection-badge">신규 설계/개발</div>
              </div>
            </button>
          </div>
        </div>
      );
    }

    // Phase 3: DMAIC/DFSS Steps (after methodology is selected)
    switch (activeStep) {
      case 'selection':
        // Special handling for Selection step - render appropriate selection phase
        // If methodology is already selected, reset to show selection screens
        if (methodology) {
          setMethodology(null);
          setActiveStep('selection');
          return null;
        }
        // Otherwise, let the normal flow handle it (will show opportunity/project/methodology selection)
        return null;
      case 'define':
        const defineTools = [
          { id: 'project_charter', title: 'Project Charter (프로젝트 헌장)', desc: '프로젝트의 목표, 범위, 문제 정의 및 비즈니스 케이스를 수립합니다.', icon: <FileText size={32} /> },
          { id: 'voc_ctq', title: 'VOC & CTQ', desc: '고객 요구사항을 수집하고 핵심 품질 특성을 정의합니다.', icon: <MessageSquare size={32} /> },
          { id: 'team', title: 'Team & Timeline (팀 및 일정)', desc: '프로젝트 팀원 구성과 전체 추진 일정을 계획합니다.', icon: <Users size={32} /> },
          { id: 'sipoc', title: 'SIPOC (사이폭)', desc: '공급자-입력-프로세스-출력-고객 흐름을 파악하여 범위를 명확히 합니다.', icon: <Map size={32} /> },
        ];

        return (
          <div className="fade-in">
            <button
              className="btn-text"
              style={{ marginBottom: '1rem' }}
              onClick={() => setMethodology(null)}
            >
              ← 방법론 재선택
            </button>
            <h2>1단계: Define (정의)</h2>
            <p className="subtitle">성공적인 6시그마 프로젝트를 위한 기반을 다집니다.</p>

            {/* 도구 추천 패널 (모달이 없을 때만 표시) */}
            {!activeTool && <ToolRecommendationPanel
              tools={getToolRecommendations('define').slice(0, 5)}
              industryName={sigmaData?.industries?.find(i => i.id === selectedIndustry)?.name}
              completedTools={completedTools}
              onSelectTool={setActiveTool}
            />}

            <div className="tool-grid">
              {defineTools.map(tool => (
                <div key={tool.id} className="tool-card" onClick={() => setActiveTool(tool.id)}>
                  <div className="tool-icon-box">{tool.icon}</div>
                  <div className="tool-title">{tool.title}</div>
                  <div className="tool-desc">{tool.desc}</div>
                </div>
              ))}
            </div>

            {/* Modals */}
            {activeTool && (
              <div className="modal-overlay" onClick={() => setActiveTool(null)}>
                <div className="modal-content-large" onClick={e => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>
                      {defineTools.find(t => t.id === activeTool)?.icon || '🛠️'}
                      {' '}
                      {defineTools.find(t => t.id === activeTool)?.title || sigmaData?.tools?.find(t => t.id === activeTool)?.name_ko || '도구 준비 중'}
                    </h2>
                    <button className="modal-close-btn" onClick={() => setActiveTool(null)}><X size={24} /></button>
                  </div>
                  <div className="modal-body">
                    {![...defineTools.map(t => t.id), 'swimlane_map', 'process_map'].includes(activeTool) && (
                      <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
                        <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>{sigmaData?.tools?.find(t => t.id === activeTool)?.name_ko || '도구'} 템플릿 준비 중</h3>
                        <p style={{ maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>
                          이 도구에 특화된 세부 입력 양식은 향후 업데이트될 예정입니다.<br /><br />
                          <b>도구 설명:</b> {sigmaData?.tools?.find(t => t.id === activeTool)?.description || '설명이 없습니다.'}
                        </p>
                      </div>
                    )}

                    {(activeTool === 'swimlane_map' || activeTool === 'process_map') && (
                      <SwimlaneBuilder 
                        data={activeTool === 'swimlane_map' ? data.define.swimlaneMap : data.define.processMap} 
                        onChange={(newData) => setData({
                          ...data,
                          define: {
                            ...data.define,
                            [activeTool === 'swimlane_map' ? 'swimlaneMap' : 'processMap']: newData
                          }
                        })}
                      />
                    )}

                    {/* 1. Project Charter */}
                    {/* 1. Project Charter */}
                    {activeTool === 'project_charter' && (
                      <div className="charter-section" style={{ border: 'none', padding: 0 }}>

                        {/* A3 Report Style Header */}
                        <div style={{
                          borderBottom: '3px solid #1e293b',
                          paddingBottom: '1rem',
                          marginBottom: '2rem',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#1e293b', margin: 0 }}>Project Charter</h2>
                            <p style={{ color: '#64748b', margin: '0.5rem 0 0 0' }}>Project Definition & Plan</p>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.9rem', color: '#475569' }}><strong>Project Leader:</strong> {data.define.team.find(m => m.role === 'Black Belt' || m.role === 'Green Belt')?.name || '미정'}</div>
                            <div style={{ fontSize: '0.9rem', color: '#475569' }}><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
                          </div>
                        </div>

                        {/* Title Section */}
                        <div className="form-group">
                          <label style={{ fontSize: '1.1rem', color: '#334155' }}>Project Title</label>
                          <input
                            type="text"
                            placeholder="프로젝트 명칭을 입력하세요"
                            value={data.define.projectTitle}
                            onChange={(e) => setData({ ...data, define: { ...data.define, projectTitle: e.target.value } })}
                            style={{ fontSize: '1.2rem', fontWeight: 'bold', padding: '0.75rem', border: '2px solid #e2e8f0' }}
                          />
                        </div>

                        {/* A3 2-Column Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1.5rem' }}>

                          {/* Left Column: Background & Definition */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                            {/* Section 1: Business Case */}
                            <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                              <div style={{ background: '#f8fafc', padding: '0.6rem 1rem', fontWeight: 'bold', borderBottom: '1px solid #cbd5e1', color: '#0f172a' }}>
                                1. Business Case (배경 및 필요성)
                              </div>
                              <div style={{ padding: '1rem' }}>
                                {data.selection?.opportunity?.businessOpportunity && !data.define.businessCase && (
                                  <button
                                    className="btn-text"
                                    style={{ fontSize: '0.8rem', marginBottom: '0.5rem', color: '#3b82f6' }}
                                    onClick={() => {
                                      if (window.confirm('Business Opportunity 내용을 가져오시겠습니까?')) {
                                        setData({ ...data, define: { ...data.define, businessCase: data.selection.opportunity.businessOpportunity } });
                                      }
                                    }}
                                  >
                                    ✨ Selection 단계 데이터 가져오기
                                  </button>
                                )}
                                <textarea
                                  placeholder="왜 이 프로젝트를 해야 합니까? 비즈니스 임팩트는 무엇입니까?"
                                  value={data.define.businessCase}
                                  onChange={(e) => setData({ ...data, define: { ...data.define, businessCase: e.target.value } })}
                                  style={{ minHeight: '100px', border: 'none', padding: 0, resize: 'vertical', width: '100%', outline: 'none' }}
                                />
                              </div>
                            </div>

                            {/* Section 2: Problem Statement */}
                            <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                              <div style={{ background: '#f8fafc', padding: '0.6rem 1rem', fontWeight: 'bold', borderBottom: '1px solid #cbd5e1', color: '#0f172a' }}>
                                2. Problem Statement (문제 기술)
                              </div>
                              <div style={{ padding: '1rem' }}>
                                <textarea
                                  placeholder="언제, 어디서, 어떤 문제가 발생하고 있습니까? (데이터 기반)"
                                  value={data.define.problemStatement}
                                  onChange={(e) => setData({ ...data, define: { ...data.define, problemStatement: e.target.value } })}
                                  style={{ minHeight: '100px', border: 'none', padding: 0, resize: 'vertical', width: '100%', outline: 'none' }}
                                />
                              </div>
                            </div>

                            {/* Section 3: Goal Statement */}
                            <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                              <div style={{ background: '#f8fafc', padding: '0.6rem 1rem', fontWeight: 'bold', borderBottom: '1px solid #cbd5e1', color: '#0f172a' }}>
                                3. Goal Statement (목표 기술)
                              </div>
                              <div style={{ padding: '1rem' }}>
                                <textarea
                                  placeholder="SMART 목표 (구체적, 측정가능, 달성가능, 관련성, 시간)"
                                  value={data.define.goal}
                                  onChange={(e) => setData({ ...data, define: { ...data.define, goal: e.target.value } })}
                                  style={{ minHeight: '80px', border: 'none', padding: 0, resize: 'vertical', width: '100%', outline: 'none' }}
                                />
                              </div>
                            </div>

                            {/* Section 4: Expected Benefits */}
                            <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                              <div style={{ background: '#eff6ff', padding: '0.6rem 1rem', fontWeight: 'bold', borderBottom: '1px solid #bfdbfe', color: '#1e40af' }}>
                                4. Expected Financial Benefits (재무 효과)
                              </div>
                              <div style={{ padding: '1rem' }}>
                                <textarea
                                  placeholder="비용 절감액, 매출 증대액 등 정량적 효과"
                                  value={data.define.financialBenefits || ''}
                                  onChange={(e) => setData({ ...data, define: { ...data.define, financialBenefits: e.target.value } })}
                                  style={{ minHeight: '60px', border: 'none', padding: 0, resize: 'vertical', width: '100%', outline: 'none', fontWeight: '500', color: '#1e40af' }}
                                />
                              </div>
                            </div>

                          </div>

                          {/* Right Column: Scope & Plan */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                            {/* Section 5: Scope */}
                            <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                              <div style={{ background: '#f8fafc', padding: '0.6rem 1rem', fontWeight: 'bold', borderBottom: '1px solid #cbd5e1', color: '#0f172a' }}>
                                5. Scope (범위)
                              </div>
                              <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div>
                                  <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>In Scope (포함)</label>
                                  <input
                                    type="text"
                                    value={data.define.scopeIn}
                                    onChange={(e) => setData({ ...data, define: { ...data.define, scopeIn: e.target.value } })}
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', marginTop: '0.25rem' }}
                                  />
                                </div>
                                <div>
                                  <label style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Out of Scope (제외)</label>
                                  <input
                                    type="text"
                                    value={data.define.scopeOut}
                                    onChange={(e) => setData({ ...data, define: { ...data.define, scopeOut: e.target.value } })}
                                    style={{ width: '100%', padding: '0.5rem', border: '1px solid #e2e8f0', borderRadius: '4px', marginTop: '0.25rem' }}
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Section 6: Team */}
                            <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                              <div style={{ background: '#f8fafc', padding: '0.6rem 1rem', fontWeight: 'bold', borderBottom: '1px solid #cbd5e1', color: '#0f172a' }}>
                                6. Team Members (팀 구성)
                              </div>
                              <div style={{ padding: '1rem' }}>
                                <div className="team-grid" style={{ gap: '0.5rem' }}>
                                  {data.define.team.map((member, idx) => (
                                    <div key={idx} className="team-member-row" style={{ marginBottom: '0.5rem' }}>
                                      <select
                                        value={member.role}
                                        onChange={(e) => {
                                          const newTeam = [...data.define.team];
                                          newTeam[idx].role = e.target.value;
                                          setData({ ...data, define: { ...data.define, team: newTeam } });
                                        }}
                                        style={{ padding: '0.4rem', fontSize: '0.9rem' }}
                                      >
                                        <option>Champion</option>
                                        <option>Black Belt</option>
                                        <option>Green Belt</option>
                                        <option>SME</option>
                                      </select>
                                      <input
                                        type="text"
                                        placeholder="이름"
                                        value={member.name}
                                        onChange={(e) => {
                                          const newTeam = [...data.define.team];
                                          newTeam[idx].name = e.target.value;
                                          setData({ ...data, define: { ...data.define, team: newTeam } });
                                        }}
                                        style={{ padding: '0.4rem', fontSize: '0.9rem' }}
                                      />
                                      <button
                                        className="btn-delete-small"
                                        onClick={() => {
                                          if (data.define.team.length > 1) {
                                            const newTeam = data.define.team.filter((_, i) => i !== idx);
                                            setData({ ...data, define: { ...data.define, team: newTeam } });
                                          } else {
                                            alert('최소 1명 유지');
                                          }
                                        }}
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                  <button className="btn-text" style={{ fontSize: '0.85rem' }} onClick={() => {
                                    setData({ ...data, define: { ...data.define, team: [...data.define.team, { name: '', role: 'Green Belt' }] } });
                                  }}>+ 팀원 추가</button>
                                </div>
                              </div>
                            </div>

                            {/* Section 7: Timeline */}
                            <div style={{ border: '1px solid #cbd5e1', borderRadius: '8px', overflow: 'hidden' }}>
                              <div style={{ background: '#f8fafc', padding: '0.6rem 1rem', fontWeight: 'bold', borderBottom: '1px solid #cbd5e1', color: '#0f172a' }}>
                                7. Timeline (일정)
                              </div>
                              <div style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b' }}>Start Date</label>
                                  <input type="date" value={data.define.timeline.start} onChange={(e) => setData({ ...data, define: { ...data.define, timeline: { ...data.define.timeline, start: e.target.value } } })} style={{ width: '100%', marginTop: '0.25rem', padding: '0.4rem' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                  <label style={{ display: 'block', fontSize: '0.85rem', color: '#64748b' }}>End Date</label>
                                  <input type="date" value={data.define.timeline.end} onChange={(e) => setData({ ...data, define: { ...data.define, timeline: { ...data.define.timeline, end: e.target.value } } })} style={{ width: '100%', marginTop: '0.25rem', padding: '0.4rem' }} />
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    )}

                    {/* 2. Team & Timeline */}
                    {activeTool === 'team' && (
                      <div className="charter-section" style={{ border: 'none', padding: 0 }}>
                        <div className="form-group">
                          <label>6. 팀 구성 (Team Members)</label>
                          <div className="team-grid">
                            {data.define.team.map((member, idx) => (
                              <div key={idx} className="team-member-row">
                                <select
                                  value={member.role}
                                  onChange={(e) => {
                                    const newTeam = [...data.define.team];
                                    newTeam[idx].role = e.target.value;
                                    setData({ ...data, define: { ...data.define, team: newTeam } });
                                  }}
                                >
                                  <option>Champion</option>
                                  <option>Black Belt</option>
                                  <option>Green Belt</option>
                                  <option>SME</option>
                                </select>
                                <input
                                  type="text"
                                  placeholder="이름 입력"
                                  value={member.name}
                                  onChange={(e) => {
                                    const newTeam = [...data.define.team];
                                    newTeam[idx].name = e.target.value;
                                    setData({ ...data, define: { ...data.define, team: newTeam } });
                                  }}
                                />
                                <button
                                  className="btn-delete-small"
                                  onClick={() => {
                                    if (data.define.team.length > 1) {
                                      const newTeam = data.define.team.filter((_, i) => i !== idx);
                                      setData({ ...data, define: { ...data.define, team: newTeam } });
                                    } else {
                                      alert('최소 1명의 팀원은 유지해야 합니다.');
                                    }
                                  }}
                                  title="삭제"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                            <button className="btn-text" onClick={() => {
                              setData({ ...data, define: { ...data.define, team: [...data.define.team, { name: '', role: 'Green Belt' }] } });
                            }}>+ 팀원 추가</button>
                          </div>
                        </div>

                        <div className="form-group">
                          <label>7. 프로젝트 일정 (Timeline)</label>
                          <div className="form-row">
                            <div className="form-group flex-1">
                              <label>프로젝트 시작</label>
                              <input type="date" value={data.define.timeline.start} onChange={(e) => setData({ ...data, define: { ...data.define, timeline: { ...data.define.timeline, start: e.target.value } } })} />
                            </div>
                            <div className="form-group flex-1">
                              <label>프로젝트 종료</label>
                              <input type="date" value={data.define.timeline.end} onChange={(e) => setData({ ...data, define: { ...data.define, timeline: { ...data.define.timeline, end: e.target.value } } })} />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 3. SIPOC */}
                    {activeTool === 'sipoc' && (
                      <div className="charter-section" style={{ border: 'none', padding: 0 }}>
                        <p className="subtitle" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>공정의 공급자부터 고객까지의 전체 흐름을 시각화합니다.</p>
                        <div className="sipoc-container">
                          <div className="sipoc-box">
                            <div className="sipoc-label">S</div>
                            <textarea placeholder="공급자" value={data.define.sipoc.supplier} onChange={(e) => setData({ ...data, define: { ...data.define, sipoc: { ...data.define.sipoc, supplier: e.target.value } } })} />
                          </div>
                          <div className="sipoc-arrow"><ArrowRight size={20} /></div>
                          <div className="sipoc-box">
                            <div className="sipoc-label">I</div>
                            <textarea placeholder="입력물" value={data.define.sipoc.input} onChange={(e) => setData({ ...data, define: { ...data.define, sipoc: { ...data.define.sipoc, input: e.target.value } } })} />
                          </div>
                          <div className="sipoc-arrow"><ArrowRight size={20} /></div>
                          <div className="sipoc-box highlight">
                            <div className="sipoc-label">P</div>
                            <textarea placeholder="프로세스" value={data.define.sipoc.process} onChange={(e) => setData({ ...data, define: { ...data.define, sipoc: { ...data.define.sipoc, process: e.target.value } } })} />
                          </div>
                          <div className="sipoc-arrow"><ArrowRight size={20} /></div>
                          <div className="sipoc-box">
                            <div className="sipoc-label">O</div>
                            <textarea placeholder="출력물" value={data.define.sipoc.output} onChange={(e) => setData({ ...data, define: { ...data.define, sipoc: { ...data.define.sipoc, output: e.target.value } } })} />
                          </div>
                          <div className="sipoc-arrow"><ArrowRight size={20} /></div>
                          <div className="sipoc-box">
                            <div className="sipoc-label">C</div>
                            <textarea placeholder="고객" value={data.define.sipoc.customer} onChange={(e) => setData({ ...data, define: { ...data.define, sipoc: { ...data.define.sipoc, customer: e.target.value } } })} />
                          </div>
                        </div>

                        <div className="tip-box" style={{ marginTop: '1.5rem', background: '#f0f9ff', borderColor: '#0284c7' }}>
                          <strong>📌 SIPOC 작성 예시 (제조 공정)</strong>
                          <div style={{ marginTop: '0.75rem', fontSize: '0.9rem', lineHeight: '1.6' }}>
                            <div><strong>S (Supplier):</strong> 부품 공급업체, 원자재 업체</div>
                            <div><strong>I (Input):</strong> 원자재, 부품, 도면, 작업지시서</div>
                            <div><strong>P (Process):</strong> 조립 → 검사 → 포장</div>
                            <div><strong>O (Output):</strong> 완성품, 검사성적서, 포장제품</div>
                            <div><strong>C (Customer):</strong> 최종고객, 유통업체</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 4. VOC & CTQ */}
                    {activeTool === 'voc_ctq' && (
                      <div className="card-inner" style={{ border: 'none', boxShadow: 'none', padding: 0 }}>
                        <div className="form-group">
                          <label>고객 요구사항 (VOC)</label>
                          <textarea placeholder="고객이 원하는 바를 자유롭게 적어보세요." />
                        </div>
                        <div className="form-group">
                          <label>핵심 품질 특성 (CTQ)</label>
                          <input type="text" placeholder="예: 응답 시간 1초 미만, 내구성 5년 이상" />
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 'measure':
        const isDmaicMeasure = methodology === 'dmaic';
        const dpmoValue = data.measure.unitCount > 0
          ? (data.measure.defectCount / (data.measure.unitCount * data.measure.opportunityPerUnit)) * 1000000
          : 0;

        const measureTools = [
          ...(isDmaicMeasure ? [{ id: 'dpmo', title: 'DPMO Calculator', desc: '결함 기회당 결함 수를 계산하여 현재 수준을 진단합니다.', icon: <Calculator size={32} /> }] : []),
          { id: 'control', title: 'Control Chart (관리도)', desc: '공정의 이상 원인을 감지하고 안정 상태를 모니터링합니다.', icon: <Activity size={32} /> },
          { id: 'histogram', title: 'Histogram (히스토그램)', desc: '데이터 분포를 시각화하고 공정 능력(Cp, Cpk)을 분석합니다.', icon: <BarChart2 size={32} /> },
          { id: 'scatter', title: 'Scatter Plot (산점도)', desc: '변수 간의 상관관계를 파악하여 인과관계를 추론합니다.', icon: <Target size={32} /> },
          { id: 'boxplot', title: 'Box Plot (상자 그림)', desc: '데이터의 산포와 중앙값, 이상치를 시각적으로 분석합니다.', icon: <Package size={32} /> },
          { id: 'run', title: 'Run Chart (런 차트)', desc: '시간 흐름에 따른 데이터의 추세와 패턴을 분석합니다.', icon: <TrendingUp size={32} /> }
        ];

        return (
          <div className="fade-in">
            <button
              className="btn-text"
              style={{ marginBottom: '1rem' }}
              onClick={() => setActiveStep('define')}
            >
              ← 이전 단계 (Define)
            </button>
            <h2>2단계: Measure (측정)</h2>
            <p className="subtitle">{isDmaicMeasure ? '현재의 프로세스 능력을 데이터로 정량화합니다.' : '고객의 목소리(VOC)를 수집하고 핵심 품질 특성(CTQ)을 도출합니다.'}</p>

            {/* 도구 추천 패널 (모달이 없을 때만 표시) */}
            {!activeTool && <ToolRecommendationPanel
              tools={getToolRecommendations('measure').slice(0, 5)}
              industryName={sigmaData?.industries?.find(i => i.id === selectedIndustry)?.name}
              completedTools={completedTools}
              onSelectTool={setActiveTool}
            />}

            <div className="tool-grid">
              {measureTools.map(tool => (
                <div key={tool.id} className="tool-card" onClick={() => setActiveTool(tool.id)}>
                  <div className="tool-icon-box">{tool.icon}</div>
                  <div className="tool-title">{tool.title}</div>
                  <div className="tool-desc">{tool.desc}</div>
                </div>
              ))}
            </div>

            {/* Modals */}
            {activeTool && (
              <div className="modal-overlay" onClick={() => setActiveTool(null)}>
                <div className="modal-content-large" onClick={e => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>
                      {measureTools.find(t => t.id === activeTool)?.icon || '🛠️'}
                      {' '}
                      {measureTools.find(t => t.id === activeTool)?.title || sigmaData?.tools?.find(t => t.id === activeTool)?.name_ko || '도구 준비 중'}
                    </h2>
                    <button className="modal-close-btn" onClick={() => setActiveTool(null)}><X size={24} /></button>
                  </div>
                  <div className="modal-body">
                    {![...measureTools.map(t => t.id)].includes(activeTool) && (
                      <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
                        <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>{sigmaData?.tools?.find(t => t.id === activeTool)?.name_ko || '도구'} 템플릿 준비 중</h3>
                        <p style={{ maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>
                          이 도구에 특화된 세부 입력 양식은 향후 업데이트될 예정입니다.<br /><br />
                          <b>도구 설명:</b> {sigmaData?.tools?.find(t => t.id === activeTool)?.description || '설명이 없습니다.'}
                        </p>
                      </div>
                    )}

                    {/* 1. DPMO Calculator */}
                    {activeTool === 'dpmo' && (
                      <div className="card-inner" style={{ border: 'none', boxShadow: 'none', padding: 0 }}>
                        <div className="form-row">
                          <div className="form-group flex-1">
                            <label>검사 단위 수 (Units)</label>
                            <input type="number" value={data.measure.unitCount} onChange={(e) => setData({ ...data, measure: { ...data.measure, unitCount: Number(e.target.value) } })} />
                          </div>
                          <div className="form-group flex-1">
                            <label>단위당 결함 기회 (OPU)</label>
                            <input type="number" value={data.measure.opportunityPerUnit} onChange={(e) => setData({ ...data, measure: { ...data.measure, opportunityPerUnit: Number(e.target.value) } })} />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>총 발견 결함 수</label>
                          <input type="number" value={data.measure.defectCount} onChange={(e) => setData({ ...data, measure: { ...data.measure, defectCount: Number(e.target.value) } })} />
                        </div>
                        <div className="result-badge primary">
                          <div className="res-label">DPMO 지표</div>
                          <div className="res-value">{dpmoValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                        </div>
                      </div>
                    )}



                    {/* 3. Charts */}
                    {['control', 'histogram', 'scatter', 'boxplot', 'run'].includes(activeTool) && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Data Input Section */}
                        <div style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <h4 style={{ marginBottom: '1rem', color: '#475569' }}>📊 데이터 입력</h4>
                          <ChartDataInput
                            chartType={activeTool}
                            initialData={data.measure.chartData?.[
                              activeTool === 'control' ? 'controlChart' :
                                activeTool === 'histogram' ? 'histogram' :
                                  activeTool === 'scatter' ? 'scatterPlot' :
                                    activeTool === 'boxplot' ? 'boxPlot' :
                                      'runChart'
                            ]}
                            onDataChange={(chartData) => {
                              const chartKey =
                                activeTool === 'control' ? 'controlChart' :
                                  activeTool === 'histogram' ? 'histogram' :
                                    activeTool === 'scatter' ? 'scatterPlot' :
                                      activeTool === 'boxplot' ? 'boxPlot' :
                                        'runChart';

                              setData({
                                ...data,
                                measure: {
                                  ...data.measure,
                                  chartData: {
                                    ...data.measure.chartData,
                                    [chartKey]: chartData
                                  }
                                }
                              });
                            }}
                          />
                        </div>

                        {/* Chart Visualization Section */}
                        <div style={{ minHeight: '400px', background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          {activeTool === 'control' && (
                            <ControlChart
                              data={data.measure.chartData?.controlChart?.samples || []}
                              type={data.measure.chartData?.controlChart?.type || 'xbar'}
                              title="Control Chart (관리도)"
                            />
                          )}
                          {activeTool === 'histogram' && (
                            <>
                              <Histogram
                                data={data.measure.chartData?.histogram?.rawData || []}
                                binCount={data.measure.chartData?.histogram?.binCount || 10}
                                lsl={data.measure.chartData?.histogram?.lsl}
                                usl={data.measure.chartData?.histogram?.usl}
                                title="Histogram (히스토그램)"
                              />
                              {/* Process Capability Analysis Logic */}
                              {(() => {
                                const rawData = data.measure.chartData?.histogram?.rawData || [];
                                const lsl = data.measure.chartData?.histogram?.lsl;
                                const usl = data.measure.chartData?.histogram?.usl;

                                if (rawData.length > 1 && (lsl !== undefined && usl !== undefined)) {
                                  const n = rawData.length;
                                  const mean = rawData.reduce((a, b) => a + b, 0) / n;
                                  const variance = rawData.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1);
                                  const stdDev = Math.sqrt(variance);

                                  let cp = null;
                                  let cpk = null;
                                  let sigmaLevel = null;

                                  if (lsl !== undefined && usl !== undefined) {
                                    cp = (usl - lsl) / (6 * stdDev);
                                    const cpu = (usl - mean) / (3 * stdDev);
                                    const cpl = (mean - lsl) / (3 * stdDev);
                                    cpk = Math.min(cpu, cpl);
                                    sigmaLevel = cpk * 3;
                                  }

                                  return (
                                    <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                      <h4 style={{ marginBottom: '1rem', color: '#1e293b', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.5rem' }}>
                                        📊 공정 능력 분석 (Process Capability Analysis)
                                      </h4>
                                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                                        <div style={{ background: 'white', padding: '1rem', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                          <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Mean (평균)</div>
                                          <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{mean.toFixed(2)}</div>
                                        </div>
                                        <div style={{ background: 'white', padding: '1rem', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                          <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Std Dev (표준편차)</div>
                                          <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{stdDev.toFixed(2)}</div>
                                        </div>
                                        {cp !== null && (
                                          <div style={{ background: 'white', padding: '1rem', borderRadius: '6px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                                            <div style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Cp (잠재 능력)</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem', color: cp >= 1.33 ? '#166534' : '#b91c1c' }}>{cp.toFixed(2)}</div>
                                          </div>
                                        )}
                                        {cpk !== null && (
                                          <div style={{ background: '#f0f9ff', padding: '1rem', borderRadius: '6px', border: '1px solid #bae6fd', textAlign: 'center' }}>
                                            <div style={{ color: '#0369a1', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Cpk (공정 능력)</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.3rem', color: '#0284c7' }}>{cpk.toFixed(2)}</div>
                                          </div>
                                        )}
                                        {sigmaLevel !== null && (
                                          <div style={{ background: '#7c3aed', padding: '1rem', borderRadius: '6px', border: '1px solid #6d28d9', textAlign: 'center', color: 'white' }}>
                                            <div style={{ fontSize: '0.85rem', marginBottom: '0.25rem', opacity: 0.9 }}>Sigma Level</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.3rem' }}>{sigmaLevel.toFixed(1)}σ</div>
                                          </div>
                                        )}
                                      </div>
                                      {cpk < 1.0 && <div style={{ marginTop: '1rem', color: '#dc2626', fontSize: '0.9rem', fontWeight: '500' }}>⚠️ Cpk가 1.0 미만입니다. 공정 개선이 시급합니다.</div>}
                                      {cpk >= 1.0 && cpk < 1.33 && <div style={{ marginTop: '1rem', color: '#d97706', fontSize: '0.9rem', fontWeight: '500' }}>⚠️ Cpk가 1.33 미만입니다. 지속적인 모니터링이 필요합니다.</div>}
                                      {cpk >= 1.33 && <div style={{ marginTop: '1rem', color: '#16a34a', fontSize: '0.9rem', fontWeight: '500' }}>✅ 공정 능력이 우수합니다 (Cpk ≥ 1.33).</div>}
                                    </div>
                                  );
                                } else {
                                  return (
                                    <div style={{ marginTop: '1rem', padding: '1rem', textAlign: 'center', background: '#f8fafc', color: '#94a3b8', fontSize: '0.9rem', borderRadius: '8px' }}>
                                      데이터와 규격(LSL, USL)을 모두 입력하면 Cp, Cpk가 자동 계산됩니다.
                                    </div>
                                  );
                                }
                              })()}
                            </>
                          )}
                          {activeTool === 'scatter' && (
                            <ScatterPlot
                              data={data.measure.chartData?.scatterPlot?.data || []}
                              xLabel={data.measure.chartData?.scatterPlot?.xLabel || 'X Variable'}
                              yLabel={data.measure.chartData?.scatterPlot?.yLabel || 'Y Variable'}
                              title="Scatter Plot (산점도)"
                            />
                          )}
                          {activeTool === 'boxplot' && (
                            <BoxPlot
                              groups={data.measure.chartData?.boxPlot?.groups || []}
                              title="Box Plot (상자 그림)"
                            />
                          )}
                          {activeTool === 'run' && (
                            <RunChart
                              data={data.measure.chartData?.runChart?.data || []}
                              title="Run Chart (런 차트)"
                            />
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'analyze':
        const analyzeTools = [
          { id: 'pareto', title: 'Pareto Chart (파레토 차트)', desc: '주요 결함 요인을 파악하고 우선순위를 도출합니다.', icon: <BarChart2 size={32} /> },
          { id: 'fishbone', title: 'Fishbone Diagram (특성요인도)', desc: '문제의 잠재적 원인을 4M1E 관점에서 브레인스토밍합니다.', icon: <GitBranch size={32} /> },
          { id: 'hypothesis_test', title: 'Hypothesis Testing (가설검정)', desc: '데이터를 통해 가설을 통계적으로 검정합니다 (T-Test).', icon: <Scale size={32} /> },
          { id: 'regression', title: 'Regression Analysis (회귀분석)', desc: '변수 간의 상관관계와 회귀식을 도출합니다.', icon: <TrendingUp size={32} /> },
          { id: 'fmea', title: 'FMEA (고장 유형 및 영향 분석)', desc: '공정의 위험 요소를 분석하고 RPN을 계산하여 대책을 수립합니다.', icon: <AlertTriangle size={32} /> },
          { id: '5whys', title: '5-Why Analysis', desc: '근본 원인을 찾을 때까지 "왜?"를 반복하여 질문합니다.', icon: <HelpCircle size={32} /> },
        ];

        return (
          <div className="fade-in">
            <button
              className="btn-text"
              style={{ marginBottom: '1rem' }}
              onClick={() => setActiveStep('measure')}
            >
              ← 이전 단계 (Measure)
            </button>
            <h2>3단계: Analyze (분석)</h2>
            <p className="subtitle">{methodology === 'dmaic' ? '문제의 근본 원인을 파악합니다.' : '설계 대안들을 비교 분석합니다.'}</p>

            {/* 도구 추천 패널 (모달이 없을 때만 표시) */}
            {!activeTool && <ToolRecommendationPanel
              tools={getToolRecommendations('analyze').slice(0, 5)}
              industryName={sigmaData?.industries?.find(i => i.id === selectedIndustry)?.name}
              completedTools={completedTools}
              onSelectTool={setActiveTool}
            />}

            {methodology === 'dmaic' ? (
              <>
                <div className="tool-grid">
                  {analyzeTools.map(tool => (
                    <div key={tool.id} className="tool-card" onClick={() => setActiveTool(tool.id)}>
                      <div className="tool-icon-box">{tool.icon}</div>
                      <div className="tool-title">{tool.title}</div>
                      <div className="tool-desc">{tool.desc}</div>
                    </div>
                  ))}
                </div>

                {/* Modals */}
                {activeTool && (
                  <div className="modal-overlay" onClick={() => setActiveTool(null)}>
                    <div className="modal-content-large" onClick={e => e.stopPropagation()}>
                      <div className="modal-header">
                        <h2>
                          {analyzeTools.find(t => t.id === activeTool)?.icon || '🛠️'}
                          {' '}
                          {analyzeTools.find(t => t.id === activeTool)?.title || sigmaData?.tools?.find(t => t.id === activeTool)?.name_ko || '도구 준비 중'}
                        </h2>
                        <button className="modal-close-btn" onClick={() => setActiveTool(null)}><X size={24} /></button>
                      </div>
                      <div className="modal-body">
                        {![...analyzeTools.map(t => t.id)].includes(activeTool) && (
                          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
                            <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>{sigmaData?.tools?.find(t => t.id === activeTool)?.name_ko || '도구'} 템플릿 준비 중</h3>
                            <p style={{ maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>
                              이 도구에 특화된 세부 입력 양식은 향후 업데이트될 예정입니다.<br /><br />
                              <b>도구 설명:</b> {sigmaData?.tools?.find(t => t.id === activeTool)?.description || '설명이 없습니다.'}
                            </p>
                          </div>
                        )}

                        {/* 1. Pareto */}
                        {activeTool === 'pareto' && (
                          <div className="charter-section" style={{ border: 'none', padding: 0 }}>
                            <h3>주요 결함 요인 분석</h3>
                            <div className="form-row">
                              <div className="flex-1">
                                <div className="team-grid">
                                  {data.analyze.paretoItems.map((item, idx) => (
                                    <div key={idx} className="team-member-row">
                                      <input
                                        type="text"
                                        className="flex-1"
                                        value={item.category}
                                        onChange={(e) => {
                                          const newItems = [...data.analyze.paretoItems];
                                          newItems[idx].category = e.target.value;
                                          setData({ ...data, analyze: { ...data.analyze, paretoItems: newItems } });
                                        }}
                                      />
                                      <input
                                        type="number"
                                        style={{ width: '80px' }}
                                        value={item.count}
                                        onChange={(e) => {
                                          const newItems = [...data.analyze.paretoItems];
                                          newItems[idx].count = Number(e.target.value);
                                          setData({ ...data, analyze: { ...data.analyze, paretoItems: newItems } });
                                        }}
                                      />
                                      <button
                                        className="btn-delete-small"
                                        onClick={() => {
                                          if (data.analyze.paretoItems.length > 1) {
                                            const newItems = data.analyze.paretoItems.filter((_, i) => i !== idx);
                                            setData({ ...data, analyze: { ...data.analyze, paretoItems: newItems } });
                                          } else {
                                            alert('최소 1개의 항목은 유지해야 합니다.');
                                          }
                                        }}
                                        title="삭제"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="flex-1" style={{ minHeight: '400px', background: 'white', padding: '1rem', borderRadius: '1rem', border: '1px solid var(--border)' }}>
                                <Bar
                                  data={{
                                    labels: data.analyze.paretoItems.map(i => i.category),
                                    datasets: [
                                      { type: 'bar', label: '결함 수', data: data.analyze.paretoItems.map(i => i.count), backgroundColor: 'rgba(37, 99, 235, 0.7)', order: 2 },
                                      {
                                        type: 'line', label: '누적 %', data: (() => {
                                          const total = data.analyze.paretoItems.reduce((acc, curr) => acc + curr.count, 0);
                                          let sum = 0;
                                          return data.analyze.paretoItems.map(i => { sum += i.count; return (sum / (total || 1) * 100).toFixed(1); });
                                        })(), borderColor: '#fbbf24', borderWidth: 3, fill: false, yAxisID: 'y1', order: 1
                                      }
                                    ]
                                  }}
                                  options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true }, y1: { position: 'right', max: 100, min: 0, grid: { drawOnChartArea: false } } } }}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 2. Fishbone */}
                        {activeTool === 'fishbone' && (
                          <div className="charter-section" style={{ border: 'none', padding: 0 }}>
                            <h3>특성요인도 (4M1E)</h3>
                            <div className="fishbone-scroll">
                              <div className="fishbone-container">
                                <div className="fishbone-main-line"></div>
                                <div className="fishbone-head">문제</div>

                                <div className="fishbone-row top">
                                  {['Man', 'Machine', 'Material'].map((cat) => (
                                    <div key={cat} className="fishbone-branch-box">
                                      <div className="branch-label">{cat}</div>
                                      <div className="branch-line"></div>
                                      <div className="branch-inputs">
                                        {(data.analyze.fishbone?.[cat.toLowerCase()] || []).map((val, idx) => (
                                          <input key={idx} type="text" value={val} onChange={(e) => {
                                            const next = { ...data.analyze.fishbone };
                                            next[cat.toLowerCase()][idx] = e.target.value;
                                            setData({ ...data, analyze: { ...data.analyze, fishbone: next } });
                                          }} />
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <div className="fishbone-row bottom">
                                  {['Method', 'Measurement', 'Environment'].map((cat) => (
                                    <div key={cat} className="fishbone-branch-box">
                                      <div className="branch-inputs">
                                        {(data.analyze.fishbone?.[cat.toLowerCase()] || []).map((val, idx) => (
                                          <input key={idx} type="text" value={val} onChange={(e) => {
                                            const next = { ...data.analyze.fishbone };
                                            next[cat.toLowerCase()][idx] = e.target.value;
                                            setData({ ...data, analyze: { ...data.analyze, fishbone: next } });
                                          }} />
                                        ))}
                                      </div>
                                      <div className="branch-line"></div>
                                      <div className="branch-label">{cat}</div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 3. FMEA */}
                        {activeTool === 'fmea' && (
                          <FMEA
                            data={data.analyze.fmea}
                            onUpdate={(updatedItems) => setData({ ...data, analyze: { ...data.analyze, fmea: updatedItems } })}
                          />
                        )}

                        {/* 4. 5-Why */}
                        {activeTool === '5whys' && (
                          <div className="charter-section" style={{ border: 'none', padding: 0 }}>
                            <h3>5-Why 근본 원인 도출</h3>
                            <div className="why-chain" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              {data.analyze.why5.map((whyItem, i) => (
                                <div key={i} className="why-item" style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                                  <span className="why-num" style={{ fontWeight: 'bold', color: '#3b82f6', minWidth: '40px' }}>
                                    {i + 1}Why
                                  </span>
                                  <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '5px' }}>
                                    <input
                                      type="text"
                                      placeholder="질문 (Question)"
                                      value={whyItem.question || ''}
                                      style={{ padding: '5px', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '0.9rem' }}
                                      onChange={(e) => {
                                        const nextWhy = [...data.analyze.why5];
                                        nextWhy[i] = { ...nextWhy[i], question: e.target.value };
                                        setData({ ...data, analyze: { ...data.analyze, why5: nextWhy } });
                                      }}
                                    />
                                    <input
                                      type="text"
                                      placeholder="답변 (Answer)"
                                      value={whyItem.answer || ''}
                                      style={{ padding: '5px', border: '1px solid #cbd5e1', borderRadius: '4px', fontWeight: '500' }}
                                      onChange={(e) => {
                                        const nextWhy = [...data.analyze.why5];
                                        nextWhy[i] = { ...nextWhy[i], answer: e.target.value };
                                        setData({ ...data, analyze: { ...data.analyze, why5: nextWhy } });
                                      }}
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 5. Hypothesis Testing */}
                        {activeTool === 'hypothesis_test' && (
                          <div className="card-inner" style={{ border: 'none', padding: 0 }}>
                            <h3>2-Sample T-Test (평균 비교)</h3>
                            <div className="flex-row mobile-col" style={{ gap: '2rem' }}>
                              <div className="flex-1">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Dataset A (쉼표로 구분)</label>
                                <textarea
                                  placeholder="예: 10.5, 11.2, 9.8, 10.1..."
                                  value={data.analyze.hypothesis?.sample1 || ''}
                                  onChange={(e) => setData({ ...data, analyze: { ...data.analyze, hypothesis: { ...data.analyze.hypothesis, sample1: e.target.value } } })}
                                  style={{ width: '100%', height: '120px', padding: '0.5rem', marginBottom: '1rem' }}
                                />
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Dataset B (쉼표로 구분)</label>
                                <textarea
                                  placeholder="예: 12.1, 11.8, 12.5, 11.9..."
                                  value={data.analyze.hypothesis?.sample2 || ''}
                                  onChange={(e) => setData({ ...data, analyze: { ...data.analyze, hypothesis: { ...data.analyze.hypothesis, sample2: e.target.value } } })}
                                  style={{ width: '100%', height: '120px', padding: '0.5rem' }}
                                />
                                <button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }} onClick={() => {
                                  try {
                                    const s1 = (data.analyze.hypothesis?.sample1 || '').split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
                                    const s2 = (data.analyze.hypothesis?.sample2 || '').split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));

                                    if (s1.length < 2 || s2.length < 2) {
                                      alert('각 그룹당 최소 2개 이상의 데이터가 필요합니다.');
                                      return;
                                    }

                                    const tStat = ss.tTestTwoSample(s1, s2);
                                    const m1 = ss.mean(s1);
                                    const m2 = ss.mean(s2);
                                    const sd1 = ss.standardDeviation(s1);
                                    const sd2 = ss.standardDeviation(s2);

                                    // Basic significance check (Alpha 0.05 for 2-tailed large N, Crit ~ 1.96)
                                    const isSig = Math.abs(tStat) > 1.96;

                                    const result = `분석 결과 (2-Sample T-Test):\n` +
                                      `--------------------------------\n` +
                                      `Group A: Mean=${m1.toFixed(3)}, SD=${sd1.toFixed(3)}, N=${s1.length}\n` +
                                      `Group B: Mean=${m2.toFixed(3)}, SD=${sd2.toFixed(3)}, N=${s2.length}\n` +
                                      `--------------------------------\n` +
                                      `T-Statistic: ${tStat.toFixed(4)}\n` +
                                      `결론: ${isSig ? '통계적으로 유의미한 차이가 있습니다.' : '통계적으로 유의미한 차이가 없습니다.'} (Alpha=0.05 추정)`;

                                    setData({ ...data, analyze: { ...data.analyze, hypothesis: { ...data.analyze.hypothesis, result } } });
                                  } catch (err) {
                                    alert('계산 중 오류가 발생했습니다: ' + err.message);
                                  }
                                }}>
                                  <Calculator size={18} style={{ marginRight: '8px' }} /> 검정 실행
                                </button>
                              </div>
                              <div className="flex-1">
                                <div style={{ background: '#f1f5f9', padding: '1.5rem', borderRadius: '8px', minHeight: '300px', whiteSpace: 'pre-wrap', fontFamily: 'monospace', lineHeight: '1.5' }}>
                                  {data.analyze.hypothesis?.result || '데이터를 입력하고 검정 실행 버튼을 누르세요.'}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 6. Regression Analysis */}
                        {activeTool === 'regression' && (
                          <div className="card-inner" style={{ border: 'none', padding: 0 }}>
                            <h3>Simple Linear Regression (단순 회귀분석)</h3>
                            <div className="flex-row mobile-col" style={{ gap: '2rem' }}>
                              <div className="flex-1">
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>X 변수 (독립변수)</label>
                                <textarea
                                  placeholder="예: 10, 20, 30, 40, 50"
                                  value={data.analyze.regression?.xData || ''}
                                  onChange={(e) => setData({ ...data, analyze: { ...data.analyze, regression: { ...data.analyze.regression, xData: e.target.value } } })}
                                  style={{ width: '100%', height: '100px', padding: '0.5rem', marginBottom: '1rem' }}
                                />
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Y 변수 (종속변수)</label>
                                <textarea
                                  placeholder="예: 15, 25, 35, 48, 55"
                                  value={data.analyze.regression?.yData || ''}
                                  onChange={(e) => setData({ ...data, analyze: { ...data.analyze, regression: { ...data.analyze.regression, yData: e.target.value } } })}
                                  style={{ width: '100%', height: '100px', padding: '0.5rem' }}
                                />
                                <button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }} onClick={() => {
                                  try {
                                    const x = (data.analyze.regression?.xData || '').split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
                                    const y = (data.analyze.regression?.yData || '').split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));

                                    if (x.length !== y.length || x.length < 2) {
                                      alert('X와 Y의 데이터 개수가 정확히 일치해야 하며, 최소 2개 이상이어야 합니다.');
                                      return;
                                    }

                                    const points = x.map((v, i) => [v, y[i]]);
                                    const lr = ss.linearRegression(points); // m, b
                                    const lineFunc = ss.linearRegressionLine(lr);
                                    const r2 = ss.rSquared(points, lineFunc);

                                    const result = `분석 결과 (Regression):\n` +
                                      `--------------------------------\n` +
                                      `회귀식: Y = ${lr.m.toFixed(4)} * X + ${lr.b.toFixed(4)}\n` +
                                      `설명력 (R²): ${(r2 * 100).toFixed(2)}%\n` +
                                      `상관계수 (r): ${Math.sqrt(r2).toFixed(4)}\n`;

                                    setData({ ...data, analyze: { ...data.analyze, regression: { ...data.analyze.regression, result } } });
                                  } catch (err) {
                                    alert('오류 발생: ' + err.message);
                                  }
                                }}>
                                  <TrendingUp size={18} style={{ marginRight: '8px' }} /> 분석 실행
                                </button>
                              </div>
                              <div className="flex-1">
                                <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: '8px', marginBottom: '1rem', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                                  {data.analyze.regression?.result || '데이터 입력 후 분석을 실행하세요.'}
                                </div>
                                <div style={{ height: '300px', background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', padding: '1rem' }}>
                                  <Scatter
                                    data={{
                                      datasets: [
                                        {
                                          label: '데이터 포인트',
                                          data: (data.analyze.regression?.xData && data.analyze.regression?.yData)
                                            ? (data.analyze.regression.xData.split(',').map((v, i) => ({ x: parseFloat(v), y: parseFloat(data.analyze.regression.yData.split(',')[i]) })).filter(p => !isNaN(p.x) && !isNaN(p.y)))
                                            : [],
                                          backgroundColor: 'rgba(255, 99, 132, 1)',
                                        }
                                      ]
                                    }}
                                    options={{
                                      responsive: true,
                                      maintainAspectRatio: false,
                                      scales: {
                                        x: { type: 'linear', position: 'bottom' }
                                      }
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="card-inner">
                <h3>설계 옵션 비교</h3>
                <textarea placeholder="A안, B안, C안의 장단점을 비교 분석하세요." style={{ minHeight: '200px' }} value={data.analyze.alternatives} onChange={(e) => setData({ ...data, analyze: { ...data.analyze, alternatives: e.target.value } })} />
              </div>
            )}
          </div>
        );
      case 'improve':
      case 'design':
        const isDmaicImprove = methodology === 'dmaic';
        const phaseName = isDmaicImprove ? 'Improve (개선)' : 'Design (설계)';
        const phaseDesc = isDmaicImprove
          ? '최적의 개선안을 도출하고 검증합니다 (Solution & DOE).'
          : '최종 선정된 설계안을 구체화합니다.';

        const improveTools = isDmaicImprove
          ? [
            { id: 'solutions', title: 'Solution Selection (해결안 선정)', desc: '도출된 개선안들을 평가하고 최적안을 선정합니다.', icon: <Lightbulb size={32} /> },
            { id: 'doe', title: 'DOE (실험계획법)', desc: '실험을 통해 핵심 인자의 최적 조건을 찾습니다.', icon: <FlaskConical size={32} /> }
          ]
          : [
            { id: 'design_spec', title: 'Final Design Spec (상세 설계)', desc: '최종 설계 사양을 상세히 기술합니다.', icon: <PenTool size={32} /> }
          ];

        return (
          <div className="fade-in">
            <button
              className="btn-text"
              style={{ marginBottom: '1rem' }}
              onClick={() => setActiveStep('analyze')}
            >
              ← 이전 단계 (Analyze)
            </button>
            <h2>4단계: {phaseName}</h2>
            <p className="subtitle">{phaseDesc}</p>

            {!activeTool && <ToolRecommendationPanel
              tools={getToolRecommendations(isDmaicImprove ? 'improve' : 'design').slice(0, 5)}
              industryName={sigmaData?.industries?.find(i => i.id === selectedIndustry)?.name}
              completedTools={completedTools}
              onSelectTool={setActiveTool}
            />}

            <div className="tool-grid">
              {improveTools.map(tool => (
                <div key={tool.id} className="tool-card" onClick={() => setActiveTool(tool.id)}>
                  <div className="tool-icon-box">{tool.icon}</div>
                  <div className="tool-title">{tool.title}</div>
                  <div className="tool-desc">{tool.desc}</div>
                </div>
              ))}
            </div>

            {activeTool && (
              <div className="modal-overlay" onClick={() => setActiveTool(null)}>
                <div className="modal-content-large" onClick={e => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>
                      {improveTools.find(t => t.id === activeTool)?.icon || '🛠️'}
                      {' '}
                      {improveTools.find(t => t.id === activeTool)?.title || sigmaData?.tools?.find(t => t.id === activeTool)?.name_ko || '도구 준비 중'}
                    </h2>
                    <button className="modal-close-btn" onClick={() => setActiveTool(null)}><X size={24} /></button>
                  </div>
                  <div className="modal-body">
                    {![...improveTools.map(t => t.id)].includes(activeTool) && (
                      <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
                        <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>{sigmaData?.tools?.find(t => t.id === activeTool)?.name_ko || '도구'} 템플릿 준비 중</h3>
                        <p style={{ maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>
                          이 도구에 특화된 세부 입력 양식은 향후 업데이트될 예정입니다.<br /><br />
                          <b>도구 설명:</b> {sigmaData?.tools?.find(t => t.id === activeTool)?.description || '설명이 없습니다.'}
                        </p>
                      </div>
                    )}
                    {activeTool === 'solutions' && (
                      <div className="card-inner" style={{ border: 'none', boxShadow: 'none', padding: 0 }}>
                        <div className="solution-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          {(data.improve.solutions || []).length > 0 ? (
                            data.improve.solutions.map((sol, idx) => (
                              <div key={idx} style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.5rem', background: sol.isSelected ? '#f0f9ff' : 'white', borderColor: sol.isSelected ? '#bae6fd' : '#e2e8f0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                  <span style={{ fontWeight: 'bold', color: '#64748b', fontSize: '0.9rem' }}>원인: {sol.cause}</span>
                                  <span style={{ background: sol.isSelected ? '#0ea5e9' : '#94a3b8', color: 'white', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem' }}>
                                    {sol.isSelected ? '채택됨' : '보류'}
                                  </span>
                                </div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }}>
                                  {sol.solution}
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.9rem', color: '#475569' }}>
                                  <span>유형: {sol.type}</span>
                                  <span>비용: {sol.cost}</span>
                                  <span>기간: {sol.period}</span>
                                  <span>평가점수: {sol.score}점</span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderRadius: '8px' }}>
                              등록된 개선안이 없습니다. Analyze 단계에서 개선안을 도출해주세요.
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTool === 'doe' && (
                      <div className="card-inner" style={{ border: 'none', boxShadow: 'none', padding: 0 }}>
                        {data.improve.DOE ? (
                          <div style={{ background: '#f0fdf4', padding: '1.5rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                            <div style={{ fontWeight: 'bold', color: '#166534', marginBottom: '0.5rem' }}>
                              🧪 실험 인자: {data.improve.DOE.factors.join(', ')}
                            </div>
                            <div style={{ fontSize: '1.1rem', color: '#15803d' }}>
                              {data.improve.DOE.result}
                            </div>
                          </div>
                        ) : (
                          <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8', background: '#f8fafc', borderRadius: '8px' }}>
                            등록된 DOE 데이터가 없습니다.
                          </div>
                        )}
                      </div>
                    )}

                    {activeTool === 'design_spec' && (
                      <div className="card-inner" style={{ border: 'none', boxShadow: 'none', padding: 0 }}>
                        <textarea
                          placeholder="구체적인 설계 사양을 입력하세요."
                          value={data.design?.spec || ''}
                          onChange={(e) => setData({ ...data, design: { ...data.design, spec: e.target.value } })}
                          style={{ width: '100%', minHeight: '300px', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#f8fafc', lineHeight: '1.6', fontSize: '1rem' }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'control':
      case 'verify':
        const isDmaicControl = methodology === 'dmaic';
        const phaseNameK = isDmaicControl ? 'Control (관리)' : 'Verify (검증)';
        const phaseDescK = isDmaicControl
          ? '개선 성과를 유지하기 위한 관리 계획을 수립합니다.'
          : '설계 결과가 목표 성능을 만족하는지 검증합니다.';

        const controlTools = isDmaicControl
          ? [
            { id: 'monitoring', title: 'Monitoring Plan (관리 계획)', desc: '성과 유지를 위한 모니터링 절차를 수립합니다.', icon: <ClipboardCheck size={32} /> },
            { id: 'result', title: 'Final Result (최종 성과)', desc: '프로젝트의 최종 개선 성과를 요약합니다.', icon: <Award size={32} /> },
            { id: 'complete', title: 'Project Completion (완료)', desc: '프로젝트를 승인하고 종료합니다.', icon: <ShieldCheck size={32} /> }
          ]
          : [
            { id: 'pilot', title: 'Pilot Verification (시제품 검증)', desc: '시제품을 통해 설계 성능을 검증합니다.', icon: <CheckCircle size={32} /> },
            { id: 'complete', title: 'Project Completion (완료)', desc: '신제품 개발을 승인하고 종료합니다.', icon: <ShieldCheck size={32} /> }
          ];

        return (
          <div className="fade-in">
            <button
              className="btn-text"
              style={{ marginBottom: '1rem' }}
              onClick={() => setActiveStep(isDmaicControl ? 'improve' : 'design')}
            >
              ← 이전 단계 ({isDmaicControl ? 'Improve' : 'Design'})
            </button>
            <h2>5단계: {phaseNameK}</h2>
            <p className="subtitle">{phaseDescK}</p>

            {!activeTool && <ToolRecommendationPanel
              tools={getToolRecommendations(isDmaicControl ? 'control' : 'verify').slice(0, 5)}
              industryName={sigmaData?.industries?.find(i => i.id === selectedIndustry)?.name}
              completedTools={completedTools}
              onSelectTool={setActiveTool}
            />}

            <div className="tool-grid">
              {controlTools.map(tool => (
                <div key={tool.id} className="tool-card" onClick={() => setActiveTool(tool.id)}>
                  <div className="tool-icon-box">{tool.icon}</div>
                  <div className="tool-title">{tool.title}</div>
                  <div className="tool-desc">{tool.desc}</div>
                </div>
              ))}
            </div>

            {activeTool && (
              <div className="modal-overlay" onClick={() => setActiveTool(null)}>
                <div className="modal-content-large" onClick={e => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>
                      {controlTools.find(t => t.id === activeTool)?.icon || '🛠️'}
                      {' '}
                      {controlTools.find(t => t.id === activeTool)?.title || sigmaData?.tools?.find(t => t.id === activeTool)?.name_ko || '도구 준비 중'}
                    </h2>
                    <button className="modal-close-btn" onClick={() => setActiveTool(null)}><X size={24} /></button>
                  </div>
                  <div className="modal-body">
                    {![...controlTools.map(t => t.id)].includes(activeTool) && (
                      <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
                        <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>{sigmaData?.tools?.find(t => t.id === activeTool)?.name_ko || '도구'} 템플릿 준비 중</h3>
                        <p style={{ maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>
                          이 도구에 특화된 세부 입력 양식은 향후 업데이트될 예정입니다.<br /><br />
                          <b>도구 설명:</b> {sigmaData?.tools?.find(t => t.id === activeTool)?.description || '설명이 없습니다.'}
                        </p>
                      </div>
                    )}
                    {activeTool === 'monitoring' && (
                      <div className="card-inner" style={{ border: 'none', boxShadow: 'none', padding: 0 }}>
                        <textarea
                          placeholder="모니터링 계획 및 관리 항목을 입력하세요."
                          value={data.control.monitoringPlan || ''}
                          onChange={(e) => setData({ ...data, control: { ...data.control, monitoringPlan: e.target.value } })}
                          style={{ width: '100%', minHeight: '300px', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#f8fafc', lineHeight: '1.6', fontSize: '1rem' }}
                        />
                      </div>
                    )}

                    {activeTool === 'result' && (
                      <div className="card-inner" style={{ border: 'none', boxShadow: 'none', padding: 0 }}>
                        <textarea
                          placeholder="최종 개선 성과 및 정량적 효과를 입력하세요."
                          value={data.control.result || ''}
                          onChange={(e) => setData({ ...data, control: { ...data.control, result: e.target.value } })}
                          style={{ width: '100%', minHeight: '300px', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#f0fdf4', lineHeight: '1.6', fontSize: '1rem' }}
                        />
                      </div>
                    )}

                    {activeTool === 'pilot' && (
                      <div className="card-inner" style={{ border: 'none', boxShadow: 'none', padding: 0 }}>
                        <textarea
                          value={data.verify?.result || ''}
                          onChange={(e) => setData({ ...data, verify: { ...data.verify, result: e.target.value } })}
                          placeholder="시제품 검증 결과를 입력하세요."
                          style={{ width: '100%', minHeight: '300px', padding: '1rem', border: '1px solid #cbd5e1', borderRadius: '8px', background: '#f0fdf4', lineHeight: '1.6', fontSize: '1rem' }}
                        />
                      </div>
                    )}

                    {activeTool === 'complete' && (
                      <div className="card-inner status-complete" style={{ border: 'none', boxShadow: 'none', padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', height: '400px' }}>
                        <div className="complete-msg" style={{ textAlign: 'center' }}>
                          <ShieldCheck size={80} color="#10b981" style={{ marginBottom: '1.5rem' }} />
                          <h3 style={{ fontSize: '2rem', color: '#064e3b', marginBottom: '1rem' }}>{isDmaicControl ? 'DMAIC 프로세스 완료!' : 'DFSS 프로세스 완료!'}</h3>
                          <p style={{ fontSize: '1.2rem', color: '#065f46' }}>{isDmaicControl ? '표준화된 프로세스가 성공적으로 정착되었습니다.' : '성공적인 신제품 개발이 승인되었습니다.'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="app-container">
      {/* 🔄 [New] DFSS Setup Button */}

      <header className="app-header">
        <div className="logo" onClick={() => { setProjectSelected(false); setMethodology(null); setActiveStep('define'); }} style={{ cursor: 'pointer' }}>
          <Zap size={24} color="#f59e0b" fill="#f59e0b" />
          <h1>6-SIGMA MASTER</h1>
        </div>

        {/* Central Status Bar */}
        {methodology && (
          <div className="status-bar" style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            background: 'white',
            padding: '8px 24px',
            borderRadius: '20px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e2e8f0'
          }}>
            <span style={{
              fontWeight: '900',
              color: methodology === 'dmaic' ? '#2563eb' : '#7c3aed',
              textTransform: 'uppercase',
              fontSize: '1.1rem'
            }}>
              {methodology}
            </span>
            <ChevronRight size={16} color="#94a3b8" />
            <span style={{
              fontWeight: 'bold',
              color: '#1e293b',
              fontSize: '1rem'
            }}>
              {steps.find(s => s.id === activeStep)?.name.split(' (')[0]}
            </span>
            <span style={{
              fontSize: '0.8rem',
              color: '#64748b',
              background: '#f1f5f9',
              padding: '2px 8px',
              borderRadius: '4px'
            }}>
              진행중
            </span>
          </div>
        )}
        <div className="header-actions">
          <div className="project-info">
            {methodology ? `${methodology.toUpperCase()} | ` : ''}
            {data.define.projectTitle || '신규 프로젝트'}
          </div>
          {methodology && (
            <>
              <button
                className="btn-version"
                onClick={() => setShowVersionModal(true)}
                title="버전 관리"
              >
                <Clock size={18} /> 버전 ({versions.length})
              </button>
              <button className="btn-export" onClick={handleExport} title="프로젝트 저장 (JSON)">
                <ShieldCheck size={18} /> 보고서 저장
              </button>
              <button
                className="btn-report"
                onClick={() => setShowReport(true)}
                title="A3 보고서 보기"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  cursor: 'pointer',
                  fontWeight: 600,
                  marginLeft: '0.5rem'
                }}
              >
                <TrendingUp size={18} /> A3 보고서
              </button>
            </>
          )}
        </div>
      </header>

      <main className="app-main">

        {methodology && (
          <nav className="step-nav">
            {steps.map((step) => (
              <button
                key={step.id}
                className={`step-item ${activeStep === step.id ? 'active' : ''}`}
                onClick={() => setActiveStep(step.id)}
              >
                <div className="icon-box" style={{ backgroundColor: activeStep === step.id ? step.color : '#e2e8f0' }}>
                  <step.icon size={20} color={activeStep === step.id ? 'white' : '#64748b'} />
                </div>
                <div className="step-text">
                  <span className="step-name">{step.name}</span>
                  <span className="step-desc">{step.desc}</span>
                </div>
              </button>
            ))}
          </nav>
        )}

        <section className={`content-area ${!methodology ? 'centered' : ''}`}>
          <div className="card container-card">
            <AnimatePresence mode="wait">
              <motion.div
                key={methodology ? activeStep : 'selection'}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
            {methodology && activeStep !== 'selection' && (
              <div className="action-footer">
                <button className="btn btn-primary" onClick={() => {
                  const currentIndex = steps.findIndex(s => s.id === activeStep);
                  if (currentIndex < steps.length - 1) {
                    setActiveStep(steps[currentIndex + 1].id);
                  }
                }}>
                  다음 단계로 <ArrowRight size={18} />
                </button>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Version Modal */}
      {showVersionModal && (
        <div className="modal-overlay" onClick={() => setShowVersionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>버전 관리</h2>
              <button className="btn-close" onClick={() => setShowVersionModal(false)}>×</button>
            </div>

            {/* Save New Version Section */}
            <div className="version-save-section">
              <h3>현재 상태 저장</h3>
              <div className="save-form">
                <input
                  type="text"
                  placeholder="변경 내용 설명 (선택)"
                  value={versionDescription}
                  onChange={(e) => setVersionDescription(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      saveVersion();
                      alert('버전이 저장되었습니다!');
                    }
                  }}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    saveVersion();
                    alert('버전이 저장되었습니다!');
                  }}
                >
                  저장하기
                </button>
              </div>
            </div>

            {/* Version History */}
            <div className="version-history">
              <h3>저장된 버전 ({versions.length}/20)</h3>
              {versions.length === 0 ? (
                <p className="no-versions">저장된 버전이 없습니다.</p>
              ) : (
                <div className="version-list">
                  {versions.slice().reverse().map((version) => (
                    <div key={version.id} className="version-item">
                      <div className="version-info">
                        <div className="version-header">
                          <span className="version-number">{version.version}</span>
                          <span className="version-date">
                            {new Date(version.timestamp).toLocaleString('ko-KR', {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="version-details">
                          <strong>{version.projectTitle}</strong>
                          {version.description && <p>{version.description}</p>}
                          <span className="version-method">{version.methodology?.toUpperCase()}</span>
                        </div>
                      </div>
                      <div className="version-actions">
                        <button
                          className="btn-restore"
                          onClick={() => restoreVersion(version.id)}
                        >
                          복원
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => deleteVersion(version.id)}
                        >
                          삭제
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* A3 Report Overlay */}
      {showReport && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.85)',
          zIndex: 10000,
          overflowY: 'auto',
          padding: '2rem'
        }}>
          <div style={{ position: 'relative', maxWidth: '1400px', margin: '0 auto' }}>
            <button
              onClick={() => setShowReport(false)}
              style={{
                position: 'fixed',
                top: '2rem',
                right: '2rem',
                background: '#ef4444',
                border: 'none',
                color: 'white',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                fontSize: '1.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
                zIndex: 10001
              }}
            >
              ×
            </button>
            <div style={{ textAlign: 'right', marginBottom: '1rem' }}>
              <button
                className="btn btn-primary"
                onClick={() => window.print()}
                style={{ padding: '0.75rem 2rem', fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' }}
              >
                🖨️ 인쇄 / PDF 저장
              </button>
            </div>

            <A3Report data={data} methodology={methodology} />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
