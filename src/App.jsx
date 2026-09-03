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
  ChevronLeft,
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
  Scale,
  Rocket,
  Workflow,
  Grid3X3,
  BookOpen,
  Sparkles,
  GraduationCap,
  LayoutDashboard,
  RotateCcw,
  Menu
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
import BusinessCaseBuilder from './components/BusinessCaseBuilder';
import SwimlaneBuilder from './components/SwimlaneBuilder';
import MeasureDashboard from './components/MeasureDashboard';
import { ControlPlanEditor, StandardWorkEditor } from './components/ControlTemplates';
import { DoeEditor, PilotEditor, PokaYokeEditor } from './components/ImproveTemplates';
import { VocCtqEditor, MsaEditor, SolutionsEditor } from './components/DefineMeasureTemplates';
import {
  CharterTemplatePicker,
  SipocTemplatePicker,
  FishboneTemplatePicker,
  Why5Editor,
  DesignSpecEditor
} from './components/DefineAnalyzeTemplates';
import {
  ParetoTemplatePicker,
  TeamTemplatePicker,
  SwimlaneTemplatePicker,
  MonitoringEditor,
  ResultEditor,
  AlternativesEditor,
  PilotVerifyEditor,
  CompleteChecklist,
  SelectionTemplateBar
} from './components/ExtraPhaseTemplates';
import {
  AuthModal,
  SaveDraftModal,
  MyProjectsModal,
  UserMenuBar
} from './components/AuthModals';
import { getSession, logoutUser } from './utils/authStore';
import {
  applySnapshotToWorkspace,
  getCurrentProjectId,
  saveUserProject,
  setCurrentProjectId
} from './utils/projectStore';
import { applyDerivedToMeasure } from './utils/measureAnalysis';
import { resolveToolId } from './utils/toolAliases';
import {
  NormalityEditor,
  CapabilityEditor,
  AnovaEditor,
  ChiSquareEditor,
  GageRndRCalculator,
  DoeEffectsEditor,
  CorrelationEditor,
  MultipleRegressionEditor
} from './components/AdvancedAnalysisTools';
import ToolGroupGrid from './components/ToolGroupGrid';
import {
  ProportionTestEditor,
  LeveneEditor,
  NonparametricEditor,
  ResidualDiagnosticsEditor,
  WeibullEditor,
  SampleSizeEditor,
  CauseEffectMatrixEditor,
  HypothesisLogEditor,
  BeforeAfterDashboard
} from './components/ExtraAnalysisTools';
import { ManualsBrowser, ManualModal, ManualLinkButton } from './components/ToolManuals';
import { getManualById } from './data/toolManuals';
import StatTemplatePanel from './components/StatTemplatePanel';
import ResultInsight from './components/ResultInsight';
import AiSettingsForm from './components/AiSettingsForm';
import { StatsLearningBrowser } from './components/StatsLearning';
import { PackageHub } from './components/PackageHub';
import EducationCurriculum from './components/EducationCurriculum';
import LandingPage from './components/LandingPage';
import BrandLogo from './components/BrandLogo';
import { getSampleById } from './data/sampleLibrary';
import {
  MAIN_SLOT_KEY,
  PRACTICE_SLOT_KEY,
  bundleToSnapshot,
  clearWorkspaceSlot,
  createPracticeBundle,
  getWorkspaceMode,
  loadWorkspaceSlot,
  saveWorkspaceSlot,
  setWorkspaceMode,
  snapshotToBundle,
  writeLiveWorkspace,
  readLiveWorkspace
} from './utils/workspaceMode';
import { formatMissingTools, getMissingGateTools } from './utils/stepGates';


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

const SETUP_STEPS = [
  { id: 'industry', name: '업종 선택', icon: Package, color: '#475569', desc: '산업군 맞춤 설정' },
  { id: 'diagnostic', name: '프로젝트 진단', icon: ClipboardList, color: '#0369a1', desc: '문제·데이터 파악' },
  { id: 'opportunity', name: '기회분석', icon: Search, color: '#0891b2', desc: 'Business 기회' },
  { id: 'project', name: '과제선정', icon: Target, color: '#0d9488', desc: '전략 연계 과제' },
  { id: 'methodology', name: '방법론 선택', icon: Scale, color: '#7c3aed', desc: 'DMAIC / DFSS' },
];

const STEP_TOOL_IDS = {
  selection: [],
  define: ['project_charter', 'voc_ctq', 'team', 'sipoc', 'process_map', 'swimlane_map'],
  measure: ['dpmo', 'msa_grr', 'normality', 'capability', 'sample_size', 'control', 'histogram', 'scatter', 'boxplot', 'run'],
  analyze: ['pareto', 'fishbone', 'ce_matrix', 'hypothesis_log', 'fmea', '5whys', 'hypothesis_test', 'proportion_test', 'levene', 'nonparametric', 'anova', 'chi_square', 'correlation', 'regression', 'multi_regression', 'residual_diag', 'weibull', 'alternatives'],
  improve: ['solutions', 'doe', 'doe_effects', 'piloting', 'poka_yoke'],
  design: ['design_spec'],
  control: ['control_plan', 'standard_work', 'monitoring', 'before_after', 'result', 'complete'],
  verify: ['pilot', 'complete']
};

/** 워크스페이스 초기 프로젝트 데이터 */
const createEmptyProjectData = () => ({
  selection: {
    opportunity: {
      customerType: 'external',
      customerDefinition: '',
      customerNeeds: '',
      businessOpportunity: '',
      attachments: {
        customer: [],
        businessOpp: [],
        analysis3C: { customer: [], competitor: [], company: [] },
        analysisFAW: { field: [], application: [], whatsNew: [] }
      },
      analysis3C: { customer: '', competitor: '', company: '' },
      analysisFAW: { field: '', application: '', whatsNew: '' }
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
    financialBenefits: '',
    team: [{ name: '', role: 'Champion' }],
    timeline: { start: '', end: '' },
    sipoc: { supplier: '', input: '', process: '', output: '', customer: '' },
    vocCtq: null,
    processMap: { lanes: [] },
    swimlaneMap: { lanes: [] }
  },
  measure: {
    unitCount: 0,
    defectCount: 0,
    opportunityPerUnit: 1,
    ctq: '',
    msa: null,
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
    designAlternatives: null,
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
    why5: [
      { question: '', answer: '' },
      { question: '', answer: '' },
      { question: '', answer: '' },
      { question: '', answer: '' },
      { question: '', answer: '' }
    ],
    ceMatrix: null,
    hypothesisLog: [],
    hypothesis: { sample1: '', sample2: '', testType: 't-test', result: null },
    regression: { xData: '', yData: '', result: null }
  },
  improve: { solutions: [], DOE: null, pilot: null, pokaYoke: null },
  design: { designSpecs: '', title: '', requirements: '', ctqSpecs: '', constraints: '', verification: '', notes: '', spec: '' },
  control: {
    monitoringPlan: '',
    controlPlanSummary: '',
    sop: '',
    training: '',
    controlPlan: null,
    standardWork: null,
    monitoring: null,
    resultSummary: null,
    result: '',
    completeChecks: {}
  },
  verify: { verificationResults: '', result: '', pilotVerify: null }
});

const WORKSPACE_STORAGE_KEYS = [
  'sigma_industry',
  'sigma_diagnostic_completed',
  'sigma_diagnostic_responses',
  'sigma_diagnostic_index',
  'sigma_completed_tools',
  'sigma_project_selected',
  'sigma_opportunity_analyzed',
  'sigma_methodology',
  'sigma_active_step',
  'sigma_project_data',
  'sigma_version_history',
  'sigma_current_project_id'
];

const ToolRecommendationPanel = ({ tools, industryName, completedTools, onSelectTool }) => {
  const [hoveredTool, setHoveredTool] = React.useState(null);

  if (!tools || tools.length === 0) return null;

  return (
    <div className="charter-section tool-recommend" style={{ background: '#f8f9fa', border: 'none', marginBottom: '2rem', padding: '1.5rem' }}>
      <div className="tool-recommend-head">
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b' }}>🎯 AI 추천 도구</h3>
        {industryName && (
          <span style={{ fontSize: '0.8rem', color: '#4f46e5', background: '#eef2ff', padding: '0.3rem 0.8rem', borderRadius: '20px', fontWeight: '600' }}>
            {industryName} 맞춤
          </span>
        )}
      </div>

      <div className="tool-recommend-row">
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
  const [activeStep, setActiveStep] = useState(() => {
    const savedStep = localStorage.getItem('sigma_active_step');
    const savedMethod = localStorage.getItem('sigma_methodology');
    if (savedStep) return savedStep;
    return savedMethod ? 'define' : 'selection';
  });
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
        },
        vocCtq: null,
        processMap: { lanes: [] },
        swimlaneMap: { lanes: [] }
      },
      measure: {
        unitCount: 0,
        defectCount: 0,
        opportunityPerUnit: 1,
        ctq: '',
        msa: null,
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
        designAlternatives: null,
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
        why5: [
          { question: '', answer: '' },
          { question: '', answer: '' },
          { question: '', answer: '' },
          { question: '', answer: '' },
          { question: '', answer: '' }
        ],
        ceMatrix: null,
        hypothesisLog: [],
        hypothesis: { sample1: '', sample2: '', testType: 't-test', result: null },
        regression: { xData: '', yData: '', result: null }
      },
      improve: { solutions: [], DOE: null, pilot: null, pokaYoke: null },
      design: { designSpecs: '', title: '', requirements: '', ctqSpecs: '', constraints: '', verification: '', notes: '', spec: '' },
      control: {
        monitoringPlan: '',
        controlPlanSummary: '',
        sop: '',
        training: '',
        controlPlan: null,
        standardWork: null,
        monitoring: null,
        resultSummary: null,
        result: '',
        completeChecks: {}
      },
      verify: { verificationResults: '', result: '', pilotVerify: null }
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
  const [selectionSubView, setSelectionSubView] = useState(null); // 'opportunity' | 'project' | null
  const [session, setSession] = useState(() => getSession());
  const [authModal, setAuthModal] = useState(null); // 'login' | null
  const [showMyProjects, setShowMyProjects] = useState(false);
  const [showSaveDraft, setShowSaveDraft] = useState(false);
  const [currentProjectId, setCurrentProjectIdState] = useState(() => getCurrentProjectId());
  const [showManuals, setShowManuals] = useState(false);
  const [showAiSettings, setShowAiSettings] = useState(false);
  const [showLearning, setShowLearning] = useState(false);
  const [showPackageHub, setShowPackageHub] = useState(false);
  const [showCurriculum, setShowCurriculum] = useState(false);
  const [manualFocusId, setManualFocusId] = useState(null);
  const [learningFocusId, setLearningFocusId] = useState(null);
  const [manualModalId, setManualModalId] = useState(null);
  /** 화면 이동 히스토리 — 「이전으로」 복원용 */
  const [navHistory, setNavHistory] = useState([]);
  const [workspaceMode, setWorkspaceModeState] = useState(() => getWorkspaceMode());
  const isPracticeMode = workspaceMode === 'practice';
  /** 랜딩: 진행 중이 아니면 첫 화면으로 표시 */
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showLanding, setShowLanding] = useState(() => {
    try {
      const hasProgress = !!(
        localStorage.getItem('sigma_industry')
        || localStorage.getItem('sigma_methodology')
      );
      return !hasProgress;
    } catch {
      return true;
    }
  });
  /** 홈(랜딩) 이동: 'askSave' | 'askDelete' | null */
  const [homeExitStep, setHomeExitStep] = useState(null);

  const enterAppFromLanding = () => {
    setShowLanding(false);
    closeHelpPanels();
    setActiveTool(null);
    setSelectionSubView(null);
    if (!selectedIndustry) setActiveStep('selection');
  };

  const openCurriculumFromLanding = () => {
    setShowLanding(false);
    openCurriculumTab();
  };

  const collectWorkspaceBundle = () => ({
    industry: selectedIndustry,
    diagnosticCompleted,
    diagnosticResponses,
    diagnosticIndex: currentDiagnosticIndex,
    completedTools,
    projectSelected,
    opportunityAnalyzed,
    methodology,
    activeStep,
    data,
    versions,
    currentProjectId
  });

  const applyWorkspaceBundle = (bundle) => {
    setSelectedIndustry(bundle.industry || null);
    setDiagnosticCompleted(!!bundle.diagnosticCompleted);
    setDiagnosticResponses(bundle.diagnosticResponses || {});
    setCurrentDiagnosticIndex(bundle.diagnosticIndex ?? 0);
    setCompletedTools(Array.isArray(bundle.completedTools) ? bundle.completedTools : []);
    setProjectSelected(!!bundle.projectSelected);
    setOpportunityAnalyzed(!!bundle.opportunityAnalyzed);
    setMethodology(bundle.methodology || null);
    setActiveStep(bundle.activeStep || 'selection');
    setData(bundle.data || createEmptyProjectData());
    setVersions(Array.isArray(bundle.versions) ? bundle.versions : []);
    setCurrentProjectId(bundle.currentProjectId || null);
    setCurrentProjectIdState(bundle.currentProjectId || null);
    setSelectionSubView(null);
    setActiveTool(null);
    setShowManuals(false);
    setShowAiSettings(false);
    setShowLearning(false);
    setShowPackageHub(false);
    setShowCurriculum(false);
    setNavHistory([]);
    setShowLanding(false);
  };

  /** 교육 실습 샌드박스로 전환 (본 프로젝트는 슬롯에 보관) */
  const enterPracticeMode = (options = {}) => {
    // 이미 실습 중이면 본 프로젝트를 다시 덮지 않고 도구만 연다
    if (isPracticeMode && !options.fresh) {
      setShowManuals(false);
      setShowAiSettings(false);
      setShowLearning(false);
      setShowPackageHub(false);
      setShowCurriculum(false);
      if (options.methodology) setMethodology(options.methodology);
      if (options.phase) setActiveStep(options.phase);
      if (options.toolId) setActiveTool(options.toolId);
      else setActiveTool(null);
      return collectWorkspaceBundle();
    }

    const current = collectWorkspaceBundle();
    if (!isPracticeMode) {
      const mainSnap = bundleToSnapshot(current);
      saveWorkspaceSlot(MAIN_SLOT_KEY, mainSnap);
      writeLiveWorkspace(mainSnap);
    }

    let practiceBundle;
    if (options.fresh || !loadWorkspaceSlot(PRACTICE_SLOT_KEY)) {
      practiceBundle = createPracticeBundle(createEmptyProjectData, {
        industry: options.industry || selectedIndustry || 'manufacturing',
        methodology: options.methodology || 'dmaic',
        activeStep: options.phase || 'define',
        projectTitle: options.projectTitle
      });
    } else {
      practiceBundle = snapshotToBundle(loadWorkspaceSlot(PRACTICE_SLOT_KEY), createEmptyProjectData);
      if (options.phase) practiceBundle.activeStep = options.phase;
      if (options.methodology) practiceBundle.methodology = options.methodology;
    }

    const practiceSnap = bundleToSnapshot(practiceBundle);
    saveWorkspaceSlot(PRACTICE_SLOT_KEY, practiceSnap);
    writeLiveWorkspace(practiceSnap);
    setWorkspaceMode('practice');
    setWorkspaceModeState('practice');
    applyWorkspaceBundle(practiceBundle);

    if (options.toolId) {
      setTimeout(() => setActiveTool(options.toolId), 0);
    }
    return practiceBundle;
  };

  /** 본 프로젝트로 복귀 (실습 내용은 실습 슬롯에 보관) */
  const exitPracticeMode = () => {
    if (!isPracticeMode) return;
    const practiceSnap = bundleToSnapshot(collectWorkspaceBundle());
    saveWorkspaceSlot(PRACTICE_SLOT_KEY, practiceSnap);

    const mainSnap = loadWorkspaceSlot(MAIN_SLOT_KEY);
    const mainBundle = mainSnap
      ? snapshotToBundle(mainSnap, createEmptyProjectData)
      : {
          industry: null,
          diagnosticCompleted: false,
          diagnosticResponses: {},
          diagnosticIndex: 0,
          completedTools: [],
          projectSelected: false,
          opportunityAnalyzed: false,
          methodology: null,
          activeStep: 'selection',
          data: createEmptyProjectData(),
          versions: [],
          currentProjectId: null
        };

    writeLiveWorkspace(bundleToSnapshot(mainBundle));
    setWorkspaceMode('project');
    setWorkspaceModeState('project');
    applyWorkspaceBundle(mainBundle);
  };

  const resetPracticeSandbox = () => {
    if (!window.confirm('교육 실습 내용을 모두 지우고 빈 실습 프로젝트로 시작할까요?\n(본 프로젝트는 영향 없습니다)')) return;
    clearWorkspaceSlot(PRACTICE_SLOT_KEY);
    enterPracticeMode({ fresh: true, phase: 'define' });
  };

  const describeCurrentView = () => {
    if (showCurriculum) return '교육 과정';
    if (showLearning) return '통계 학습관';
    if (showManuals) return '사용설명서';
    if (showPackageHub) return '패키지 워크벤치';
    if (showAiSettings) return 'AI 설정';
    if (activeTool) return '도구 화면';
    if (selectionSubView === 'opportunity') return '개선기회 분석';
    if (selectionSubView === 'project') return '과제 선정';
    if (activeStep === 'selection') return 'Selection';
    const step = (methodology === 'dfss' ? DFSS_STEPS : DMAIC_STEPS).find(s => s.id === activeStep);
    return step?.name || '작업 화면';
  };

  const captureNavSnapshot = () => ({
    label: describeCurrentView(),
    showCurriculum,
    showLearning,
    showManuals,
    showPackageHub,
    showAiSettings,
    activeTool,
    activeStep,
    selectionSubView,
    learningFocusId,
    manualFocusId
  });

  const pushNavHistory = () => {
    setNavHistory((prev) => {
      const snap = captureNavSnapshot();
      const last = prev[prev.length - 1];
      // 동일 화면 연속 push 방지
      if (last
        && last.showCurriculum === snap.showCurriculum
        && last.showLearning === snap.showLearning
        && last.showManuals === snap.showManuals
        && last.showPackageHub === snap.showPackageHub
        && last.showAiSettings === snap.showAiSettings
        && last.activeTool === snap.activeTool
        && last.activeStep === snap.activeStep
        && last.selectionSubView === snap.selectionSubView) {
        return prev;
      }
      return [...prev.slice(-19), snap];
    });
  };

  const restoreNavSnapshot = (snap) => {
    if (!snap) return;
    setShowCurriculum(!!snap.showCurriculum);
    setShowLearning(!!snap.showLearning);
    setShowManuals(!!snap.showManuals);
    setShowPackageHub(!!snap.showPackageHub);
    setShowAiSettings(!!snap.showAiSettings);
    setActiveTool(snap.activeTool || null);
    if (snap.activeStep) setActiveStep(snap.activeStep);
    setSelectionSubView(snap.selectionSubView || null);
    setLearningFocusId(snap.learningFocusId || null);
    setManualFocusId(snap.manualFocusId || null);
  };

  const goBackView = () => {
    if (navHistory.length > 0) {
      const prev = navHistory[navHistory.length - 1];
      setNavHistory((h) => h.slice(0, -1));
      restoreNavSnapshot(prev);
      return;
    }
    // 히스토리 없이 도움말/도구만 열린 경우
    if (activeTool) {
      setActiveTool(null);
      return;
    }
    closeHelpPanels();
  };

  const canGoBackView = navHistory.length > 0
    || showCurriculum
    || showLearning
    || showManuals
    || showPackageHub
    || showAiSettings
    || !!activeTool;

  const backButtonLabel = navHistory.length > 0
    ? navHistory[navHistory.length - 1].label
    : activeTool
      ? '도구 목록'
      : '작업 화면';

  const closeHelpPanels = () => {
    setShowManuals(false);
    setShowAiSettings(false);
    setShowLearning(false);
    setShowPackageHub(false);
    setShowCurriculum(false);
  };

  const openManualModal = (toolId) => {
    if (getManualById(toolId)) setManualModalId(toolId);
  };

  const openToolFromPhase = (id) => {
    const toolId = resolveToolId(id);
    if (!toolId) return;
    if (!activeTool) pushNavHistory();
    setActiveTool(toolId);
  };

  const openManualsTab = (toolId = null) => {
    if (!showManuals) pushNavHistory();
    setActiveTool(null);
    setShowAiSettings(false);
    setShowLearning(false);
    setShowPackageHub(false);
    setShowCurriculum(false);
    setShowManuals(true);
    setManualFocusId(toolId);
    setManualModalId(null);
  };

  const openAiSettingsTab = () => {
    if (!showAiSettings) pushNavHistory();
    setActiveTool(null);
    setShowManuals(false);
    setShowLearning(false);
    setShowPackageHub(false);
    setShowCurriculum(false);
    setShowAiSettings(true);
    setManualModalId(null);
  };

  const openLearningTab = (lessonId = null) => {
    if (!showLearning) pushNavHistory();
    setActiveTool(null);
    setShowManuals(false);
    setShowAiSettings(false);
    setShowPackageHub(false);
    setShowCurriculum(false);
    setShowLearning(true);
    setLearningFocusId(lessonId);
    setManualModalId(null);
  };

  const openPackageHub = () => {
    if (!showPackageHub) pushNavHistory();
    setActiveTool(null);
    setShowManuals(false);
    setShowAiSettings(false);
    setShowLearning(false);
    setShowCurriculum(false);
    setShowPackageHub(true);
    setManualModalId(null);
  };

  const openCurriculumTab = () => {
    if (!showCurriculum) pushNavHistory();
    setActiveTool(null);
    setShowManuals(false);
    setShowAiSettings(false);
    setShowLearning(false);
    setShowPackageHub(false);
    setShowCurriculum(true);
    setManualModalId(null);
  };

  const handleCurriculumNavigate = (action) => {
    if (!action?.kind) return;
    if (action.kind === 'lesson') {
      openLearningTab(action.id);
      return;
    }
    if (action.kind === 'manual') {
      openManualsTab(action.id);
      return;
    }
    if (action.kind === 'hub') {
      openPackageHub();
      return;
    }
    if (action.kind === 'demo') {
      loadDemoProject({ asPractice: true });
      return;
    }
    if (action.kind === 'workspace') {
      // 오리엔테이션은 본 프로젝트 흐름
      if (isPracticeMode) exitPracticeMode();
      else pushNavHistory();
      closeHelpPanels();
      setSelectionSubView(null);
      setActiveStep(action.step || 'selection');
      return;
    }
    if (action.kind === 'lab') {
      const pack = getSampleById(action.id);
      if (!pack) {
        alert('샘플을 찾을 수 없습니다.');
        return;
      }
      enterPracticeMode({
        phase: pack.phase || 'measure',
        toolId: pack.toolId || null,
        projectTitle: `[교육실습] ${pack.name || '샘플 실습'}`
      });
      setTimeout(() => applySamplePack(pack), 50);
      return;
    }
    if (action.kind === 'tool') {
      enterPracticeMode({
        phase: action.phase || 'define',
        toolId: action.id,
        methodology: action.phase === 'design' || action.phase === 'verify' ? 'dfss' : 'dmaic',
        projectTitle: '[교육실습] 도구 실습'
      });
    }
  };

  /** 현재 작업 데이터 삭제(확인 없음). goLanding이면 홈으로 이동 */
  const clearCurrentWorkspace = ({ goLanding = false } = {}) => {
    if (isPracticeMode) {
      clearWorkspaceSlot(PRACTICE_SLOT_KEY);
      if (goLanding) {
        setWorkspaceMode('project');
        setWorkspaceModeState('project');
        WORKSPACE_STORAGE_KEYS.forEach((k) => localStorage.removeItem(k));
        try { sessionStorage.removeItem('sigma_last_sample'); } catch { /* ignore */ }
        setCurrentProjectId(null);
        setCurrentProjectIdState(null);
        setSelectedIndustry(null);
        setDiagnosticCompleted(false);
        setDiagnosticResponses({});
        setCurrentDiagnosticIndex(0);
        setExpandedProblemTypes(new Set());
        setCompletedTools([]);
        setQualityIssues([]);
        setProjectSelected(false);
        setOpportunityAnalyzed(false);
        setMethodology(null);
        setActiveStep('selection');
        setSelectionSubView(null);
        setActiveTool(null);
        setData(createEmptyProjectData());
        setVersions([]);
        closeHelpPanels();
        setNavHistory([]);
        setShowLanding(true);
        return;
      }
      enterPracticeMode({ fresh: true, phase: 'define' });
      return;
    }

    WORKSPACE_STORAGE_KEYS.forEach((k) => localStorage.removeItem(k));
    try { sessionStorage.removeItem('sigma_last_sample'); } catch { /* ignore */ }

    setCurrentProjectId(null);
    setCurrentProjectIdState(null);

    setSelectedIndustry(null);
    setDiagnosticCompleted(false);
    setDiagnosticResponses({});
    setCurrentDiagnosticIndex(0);
    setExpandedProblemTypes(new Set());
    setCompletedTools([]);
    setQualityIssues([]);
    setProjectSelected(false);
    setOpportunityAnalyzed(false);
    setMethodology(null);
    setActiveStep('selection');
    setSelectionSubView(null);
    setActiveTool(null);
    setData(createEmptyProjectData());
    setVersions([]);
    setShowVersionModal(false);
    setVersionDescription('');
    setShowReport(false);
    setShowLogicTree(false);
    setShowMyProjects(false);
    setShowSaveDraft(false);
    closeHelpPanels();
    setNavHistory([]);
    if (goLanding) setShowLanding(true);
  };

  /** 현재 작업공간을 맨 처음(업종 선택)으로 초기화. 로그인·저장된 프로젝트 목록은 유지 */
  const resetToStart = () => {
    const ok1 = window.confirm(
      isPracticeMode
        ? '작업을 초기화할까요?\n\n· 교육 실습 샌드박스만 지워집니다.\n· 본 프로젝트는 영향 없습니다.\n\n계속하려면 확인을 누르세요.'
        : (
          '작업을 초기화할까요?\n\n' +
          '· 현재 화면의 프로젝트·진단·방법론 데이터가 모두 지워집니다.\n' +
          '· 로그인 계정과 「내 프로젝트」에 저장된 항목은 유지됩니다.\n\n' +
          '계속하려면 확인을 누르세요.'
        )
    );
    if (!ok1) return;

    const ok2 = window.confirm(
      isPracticeMode
        ? '마지막 확인입니다.\n\n교육 실습 내용을 정말 삭제할까요?\n이 작업은 되돌릴 수 없습니다.'
        : (
          '마지막 확인입니다.\n\n' +
          '현재 작업을 정말 삭제할까요?\n이 작업은 되돌릴 수 없습니다.\n\n' +
          '확인을 누르면 초기화 후 랜딩 화면으로 이동합니다.'
        )
    );
    if (!ok2) return;

    clearCurrentWorkspace({ goLanding: !isPracticeMode });
  };

  const goHomeKeepWork = () => {
    closeHelpPanels();
    setActiveTool(null);
    setSelectionSubView(null);
    setHomeExitStep(null);
    setShowLanding(true);
  };

  const requestGoHome = () => {
    setHomeExitStep('askSave');
  };

  const handleHomeSaveYes = () => {
    // 로그인 상태면 「내 프로젝트」에도 저장. 미로그인이면 브라우저 작업 공간 유지.
    if (!isPracticeMode && session?.userId) {
      try {
        const title = data.define?.projectTitle || '제목 없는 프로젝트';
        const saved = saveUserProject(
          session.userId,
          buildProjectSnapshot(title),
          currentProjectId
        );
        setCurrentProjectIdState(saved.id);
        setCurrentProjectId(saved.id);
      } catch (err) {
        alert('저장에 실패했습니다: ' + (err.message || '알 수 없는 오류') + '\n작업은 이 브라우저에 유지한 채 홈으로 이동합니다.');
      }
    }
    goHomeKeepWork();
  };

  const handleHomeSaveNo = () => {
    setHomeExitStep('askDelete');
  };

  const handleHomeDeleteConfirm = () => {
    setHomeExitStep(null);
    clearCurrentWorkspace({ goLanding: true });
  };

  const handleHomeExitCancel = () => {
    setHomeExitStep(null);
  };

  const applySamplePack = (pack) => {
    if (!pack) return;
    if (methodology && pack.phase) {
      setActiveStep(pack.phase);
      setActiveTool(pack.toolId);
    }
    if (pack.mode === 'control_imr') {
      setData(prev => ({
        ...prev,
        measure: {
          ...prev.measure,
          chartData: {
            ...prev.measure.chartData,
            controlChart: { samples: pack.payload.samples, type: pack.payload.type || 'i-mr' }
          }
        }
      }));
    }
    if (pack.mode === 'numbers' && pack.payload?.numbers?.length) {
      const text = pack.payload.numbers.join(', ');
      const next = applyDerivedToMeasure(
        { ...data.measure },
        pack.payload.numbers,
        {
          lsl: pack.payload.lsl,
          usl: pack.payload.usl,
          rawText: text
        }
      );
      setData(prev => ({ ...prev, measure: { ...prev.measure, ...next, rawDataText: text } }));
    }
    if (pack.mode === 'xy') {
      setData(prev => ({
        ...prev,
        analyze: {
          ...prev.analyze,
          regression: {
            ...prev.analyze.regression,
            xData: pack.payload.xText,
            yData: pack.payload.yText
          },
          hypothesis: prev.analyze.hypothesis
        }
      }));
    }
    try {
      sessionStorage.setItem('sigma_last_sample', JSON.stringify(pack));
    } catch { /* ignore */ }
    closeHelpPanels();
    alert(`샘플 「${pack.title}」을 적용했습니다. 해당 도구에서 분석을 실행하세요.`);
  };

  const importSharedProject = (entry) => {
    if (!entry?.snapshot) return;
    if (!window.confirm(`공유 프로젝트 「${entry.title}」을(를) 현재 작업공간에 불러올까요?`)) return;
    applySnapshotToWorkspace(entry.snapshot);
    window.location.reload();
  };

  // Reset active tool when changing steps or methodology to prevent modal conflicts
  useEffect(() => {
    setActiveTool(null);
  }, [activeStep, methodology]);

  const buildProjectSnapshot = (title) => ({
    version: 1,
    title: title || data.define?.projectTitle || '제목 없는 프로젝트',
    status: 'in_progress',
    savedAt: new Date().toISOString(),
    methodology,
    industry: selectedIndustry,
    activeStep,
    diagnosticCompleted,
    diagnosticResponses,
    diagnosticIndex: currentDiagnosticIndex,
    completedTools,
    projectSelected,
    opportunityAnalyzed,
    versions,
    data
  });

  const handleSaveDraft = (title) => {
    if (isPracticeMode) {
      alert('지금은 교육 실습 모드입니다.\n실습 내용은 「내 프로젝트」에 저장되지 않습니다.\n본 프로젝트로 돌아간 뒤 저장하세요.');
      return;
    }
    if (!session?.userId) {
      setAuthModal('login');
      return;
    }
    try {
      const saved = saveUserProject(
        session.userId,
        buildProjectSnapshot(title),
        currentProjectId
      );
      setCurrentProjectIdState(saved.id);
      setCurrentProjectId(saved.id);
      alert(`"${saved.title}" 저장 완료`);
    } catch (err) {
      alert('저장 실패: ' + err.message);
    }
  };

  const handleOpenUserProject = (project) => {
    if (!project?.snapshot) {
      alert('프로젝트 데이터가 없습니다.');
      return;
    }
    if (isPracticeMode) {
      if (!window.confirm('교육 실습 모드입니다. 본 프로젝트로 전환한 뒤 선택한 프로젝트를 열까요?\n(실습 내용은 실습 슬롯에 보관됩니다)')) return;
      exitPracticeMode();
    }
    if (!window.confirm(`"${project.title}"을(를) 열까요?\n현재 화면의 작업 내용은 저장된 내용으로 대체됩니다.`)) return;
    try {
      applySnapshotToWorkspace(project.snapshot);
      setCurrentProjectId(project.id);
      window.location.reload();
    } catch (err) {
      alert('열기 실패: ' + err.message);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setSession(null);
    setShowMyProjects(false);
  };

  // Measure: 히스토그램 측정값이 있으면 전체 분석 차트/지표로 자동 동기화
  useEffect(() => {
    if (activeStep !== 'measure') return;
    const hist = data?.measure?.chartData?.histogram;
    const raw = hist?.rawData || [];
    if (raw.length === 0) return;
    const runLen = data?.measure?.chartData?.runChart?.data?.length || 0;
    const needsSync = !data?.measure?.analysisSummary || runLen === 0;
    if (!needsSync) return;
    setData(prev => ({
      ...prev,
      measure: applyDerivedToMeasure(prev.measure, raw, {
        lsl: hist.lsl,
        usl: hist.usl,
        binCount: hist.binCount || 10
      })
    }));
  }, [activeStep]); // eslint-disable-line react-hooks/exhaustive-deps

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

      if (activeStep) {
        localStorage.setItem('sigma_active_step', activeStep);
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
    completedTools,
    activeStep
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

  const loadDemoProject = async (opts = {}) => {
    try {
      if (opts.asPractice) {
        if (getWorkspaceMode() !== 'practice') {
          saveWorkspaceSlot(MAIN_SLOT_KEY, bundleToSnapshot(collectWorkspaceBundle()));
        }
        setWorkspaceMode('practice');
        setWorkspaceModeState('practice');
      }

      // GitHub Pages 배포는 base path(`/6Sigma/`) 아래에서 동작하므로,
      // 항상 Vite의 BASE_URL 기준으로 시드 파일을 읽습니다.
      const res = await fetch(`${import.meta.env.BASE_URL}demo_project_seed.json`);
      if (!res.ok) throw new Error('시드 파일을 불러오지 못했습니다.');
      const seed = await res.json();

      if (opts.asPractice) {
        seed.projectData = {
          ...seed.projectData,
          define: {
            ...seed.projectData.define,
            projectTitle: `[교육실습] ${seed.projectData.define?.projectTitle || '데모 프로젝트'}`
          }
        };
      }

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
        description: opts.asPractice ? '교육실습 데모 로드' : '가상 데모 프로젝트 전체 데이터 로드',
        projectTitle: seed.projectData.define.projectTitle,
        methodology: seed.meta.methodology,
        data: seed.projectData,
        auto: false
      }]));
      setCurrentProjectId(null);

      if (getWorkspaceMode() === 'practice') {
        saveWorkspaceSlot(PRACTICE_SLOT_KEY, readLiveWorkspace());
      }

      window.location.reload();
    } catch (err) {
      alert('데모 프로젝트 로드 실패: ' + err.message);
    }
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

    // Sort by score descending, then map AI IDs → UI activeTool IDs (alias 중복 제거)
    const resolved = scoredTools
      .sort((a, b) => b.score - a.score)
      .map(tool => ({ ...tool, id: resolveToolId(tool.id), _rawId: tool.id }));

    const seen = new Set();
    return resolved.filter(tool => {
      if (seen.has(tool.id)) return false;
      seen.add(tool.id);
      return true;
    });
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

  const steps = methodology === 'dfss' ? DFSS_STEPS : DMAIC_STEPS;

  const getSetupPhase = () => {
    if (!selectedIndustry) return 'industry';
    if (!diagnosticCompleted) return 'diagnostic';
    if (!opportunityAnalyzed) return 'opportunity';
    if (!projectSelected) return 'project';
    if (!methodology) return 'methodology';
    if (activeStep === 'selection' && selectionSubView === 'opportunity') return 'opportunity';
    if (activeStep === 'selection' && selectionSubView === 'project') return 'project';
    return null;
  };

  const navigateToSetup = (stepId) => {
    closeHelpPanels();
    if (stepId === 'industry') {
      if (methodology && !window.confirm('업종을 다시 선택하면 이후 설정이 초기화됩니다. 계속할까요?')) return;
      setSelectedIndustry(null);
      setDiagnosticCompleted(false);
      setDiagnosticResponses({});
      setCurrentDiagnosticIndex(0);
      setMethodology(null);
      setProjectSelected(false);
      setOpportunityAnalyzed(false);
      setSelectionSubView(null);
      setActiveStep('selection');
      setActiveTool(null);
      return;
    }
    if (stepId === 'diagnostic') {
      if (!selectedIndustry) return;
      if (methodology && !window.confirm('진단을 다시 하면 방법론 선택이 초기화됩니다. 계속할까요?')) return;
      setDiagnosticCompleted(false);
      setMethodology(null);
      setProjectSelected(false);
      setOpportunityAnalyzed(false);
      setSelectionSubView(null);
      setActiveStep('selection');
      setActiveTool(null);
      return;
    }
    if (stepId === 'opportunity') {
      if (!selectedIndustry || !diagnosticCompleted) return;
      setSelectionSubView('opportunity');
      setActiveStep('selection');
      setActiveTool(null);
      return;
    }
    if (stepId === 'project') {
      if (!selectedIndustry || !diagnosticCompleted || !opportunityAnalyzed) return;
      setSelectionSubView('project');
      setActiveStep('selection');
      setActiveTool(null);
      return;
    }
    if (stepId === 'methodology') {
      if (!selectedIndustry || !diagnosticCompleted) return;
      if (methodology && !window.confirm('방법론만 다시 선택합니다. (기회분석·과제는 유지) 계속할까요?')) return;
      setMethodology(null);
      setSelectionSubView(null);
      setActiveStep('selection');
      setActiveTool(null);
    }
  };

  const isSetupStepCompleted = (stepId) => {
    if (stepId === 'industry') return !!selectedIndustry;
    if (stepId === 'diagnostic') return !!diagnosticCompleted;
    if (stepId === 'opportunity') return !!opportunityAnalyzed;
    if (stepId === 'project') return !!projectSelected;
    if (stepId === 'methodology') return !!methodology;
    return false;
  };

  const isSetupStepReachable = (stepId) => {
    if (stepId === 'industry') return true;
    if (stepId === 'diagnostic') return !!selectedIndustry;
    if (stepId === 'opportunity') return !!selectedIndustry && !!diagnosticCompleted;
    if (stepId === 'project') return !!selectedIndustry && !!diagnosticCompleted && !!opportunityAnalyzed;
    if (stepId === 'methodology') return !!selectedIndustry && !!diagnosticCompleted && !!projectSelected;
    return false;
  };

  const markToolDone = (toolId) => {
    setCompletedTools(prev => Array.from(new Set([...prev, toolId])));
  };

  const tryGoToStep = (nextStepId) => {
    if (!methodology) return;
    // 현재 단계를 떠날 때만 게이트 검사 (뒤로 가기는 허용)
    const order = steps.map(s => s.id);
    const cur = order.indexOf(activeStep);
    const next = order.indexOf(nextStepId);
    if (next > cur && activeStep !== 'selection') {
      const missing = getMissingGateTools(activeStep, completedTools);
      if (missing.length) {
        const labels = formatMissingTools(missing);
        const ok = window.confirm(
          `아직 필수 도구가 남았습니다: ${labels}\n\n그래도 다음 단계로 이동할까요?\n(확인=이동 / 취소=현재 단계에 머무름)`
        );
        if (!ok) return;
      }
    }
    setSelectionSubView(null);
    setActiveStep(nextStepId);
    closeHelpPanels();
  };

  const isPhaseStepCompleted = (stepId, stepIndex, activeIndex) => {
    if (!methodology) return false;
    if (stepId === 'selection') return opportunityAnalyzed && projectSelected;
    const tools = STEP_TOOL_IDS[stepId] || [];
    const hasToolProgress = tools.some(t => completedTools.includes(t));
    return stepIndex < activeIndex || hasToolProgress;
  };

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

          <div className="industry-pick-grid">
            {sigmaData.industries.map(industry => (
              <motion.div
                key={industry.id}
                className="industry-pick-card"
                whileHover={{ scale: 1.02, boxShadow: '0 8px 24px rgba(0,0,0,0.15)' }}
                whileTap={{ scale: 0.98 }}
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

    // Phase 0-1: Business Opportunity Analysis
    if (selectionSubView === 'opportunity' || (!methodology && !opportunityAnalyzed && !projectSelected)) {
      return (
        <div className="fade-in">
          {(methodology || selectionSubView === 'opportunity') && (
            <button
              className="btn-text"
              style={{ marginBottom: '1rem' }}
              onClick={() => {
                setSelectionSubView(null);
                setOpportunityAnalyzed(true);
                setActiveStep('selection');
              }}
            >
              ← Selection 요약으로
            </button>
          )}
          <h2>0-1단계: Business 개선기회 분석</h2>
          <p className="subtitle">프로세스 개선의 첫걸음은 Business 개선기회를 명확히 하는 것입니다.</p>

          <SelectionTemplateBar
            industryId={selectedIndustry || 'manufacturing'}
            industryName={sigmaData?.industries?.find(i => i.id === selectedIndustry)?.name}
            onApply={(tpl) => {
              setData({
                ...data,
                selection: {
                  ...data.selection,
                  opportunity: {
                    ...data.selection.opportunity,
                    ...tpl.opportunity,
                    attachments: data.selection.opportunity.attachments
                  },
                  megaY: tpl.megaY,
                  bigY: tpl.bigY,
                  projectPool: tpl.projectPool.map(p => ({ ...p }))
                }
              });
            }}
          />

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
              onClick={() => {
                setOpportunityAnalyzed(true);
                if (methodology || selectionSubView === 'opportunity') {
                  setSelectionSubView(null);
                  setActiveStep('selection');
                }
              }}
            >
              {methodology || selectionSubView === 'opportunity' ? '저장하고 Selection으로' : '과제 선정 단계로 이동'} <ChevronRight />
            </button>
          </div>
        </div>
      );
    }

    // Phase 0-2: Project Selection
    if (selectionSubView === 'project' || (!methodology && !projectSelected && opportunityAnalyzed)) {
      return (
        <div className="fade-in">
          <button
            className="btn-text"
            style={{ marginBottom: '1rem' }}
            onClick={() => {
              if (methodology || selectionSubView === 'project') {
                setSelectionSubView(null);
                setActiveStep('selection');
              } else {
                setOpportunityAnalyzed(false);
              }
            }}
          >
            ← {(methodology || selectionSubView === 'project') ? 'Selection 요약으로' : 'Business 개선기회 분석으로'}
          </button>
          <h2>0-2단계: 과제 선정 (Project Selection)</h2>
          <p className="subtitle">조직의 전략과 연계하여 최적의 프로젝트를 선정합니다.</p>

          <SelectionTemplateBar
            industryId={selectedIndustry || 'manufacturing'}
            industryName={sigmaData?.industries?.find(i => i.id === selectedIndustry)?.name}
            onApply={(tpl) => {
              setData({
                ...data,
                selection: {
                  ...data.selection,
                  megaY: tpl.megaY,
                  bigY: tpl.bigY,
                  projectPool: tpl.projectPool.map(p => ({ ...p }))
                }
              });
            }}
          />

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
                if (methodology || selectionSubView === 'project') {
                  setSelectionSubView(null);
                  setActiveStep('selection');
                }
              }}
              title={!data.selection.projectPool.some(p => p.selected) ? "먼저 왼쪽 체크박스로 과제를 선택해주세요" : "다음 단계로 이동"}
            >
              {methodology || selectionSubView === 'project' ? '저장하고 Selection으로' : '방법론 선택하기'} <ChevronRight />
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
      case 'selection': {
        if (!methodology) return null;
        const selectedProjects = (data.selection?.projectPool || []).filter(p => p.selected);
        const opp = data.selection?.opportunity || {};
        return (
          <div className="fade-in">
            <h2>Selection (선정) 요약</h2>
            <p className="subtitle">기회분석·과제선정 내용을 확인하고 수정할 수 있습니다. 방법론은 유지됩니다.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.25rem', background: '#f8fafc' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>Business 기회</div>
                <div style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>
                  <div><strong>고객:</strong> {opp.customerDefinition || '-'}</div>
                  <div style={{ marginTop: 6 }}><strong>기회:</strong> {opp.businessOpportunity || '-'}</div>
                </div>
                <button className="btn-primary" style={{ marginTop: '1rem' }}
                  onClick={() => { setSelectionSubView('opportunity'); setActiveStep('selection'); }}>
                  기회분석 수정
                </button>
              </div>
              <div style={{ border: '1px solid #e2e8f0', borderRadius: 12, padding: '1.25rem', background: '#f8fafc' }}>
                <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#0f172a' }}>전략·과제</div>
                <div style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.5 }}>
                  <div><strong>Mega-Y:</strong> {data.selection?.megaY || '-'}</div>
                  <div style={{ marginTop: 6 }}><strong>Big-Y:</strong> {data.selection?.bigY || '-'}</div>
                  <div style={{ marginTop: 6 }}>
                    <strong>선정 과제:</strong>{' '}
                    {selectedProjects.length ? selectedProjects.map(p => p.name).join(', ') : '없음'}
                  </div>
                </div>
                <button className="btn-primary" style={{ marginTop: '1rem' }}
                  onClick={() => { setSelectionSubView('project'); setActiveStep('selection'); }}>
                  과제선정 수정
                </button>
              </div>
            </div>

            <div className="action-footer" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => { setSelectionSubView(null); setActiveStep('define'); }}>
                Define로 이동 <ChevronRight />
              </button>
              <button className="btn-text" onClick={() => {
                if (window.confirm('방법론만 다시 선택합니다. 기회분석·과제는 유지됩니다.')) {
                  setMethodology(null);
                  setSelectionSubView(null);
                }
              }}>
                방법론 재선택
              </button>
            </div>
          </div>
        );
      }
      case 'define':
        const defineTools = [
          { id: 'project_charter', title: 'Project Charter (프로젝트 헌장)', desc: '프로젝트의 목표, 범위, 문제 정의 및 비즈니스 케이스를 수립합니다.', icon: <FileText size={32} /> },
          { id: 'voc_ctq', title: 'VOC & CTQ', desc: '고객 요구사항을 수집하고 핵심 품질 특성을 정의합니다.', icon: <MessageSquare size={32} /> },
          { id: 'team', title: 'Team & Timeline (팀 및 일정)', desc: '프로젝트 팀원 구성과 전체 추진 일정을 계획합니다.', icon: <Users size={32} /> },
          { id: 'sipoc', title: 'SIPOC (사이폭)', desc: '공급자-입력-프로세스-출력-고객 흐름을 파악하여 범위를 명확히 합니다.', icon: <Map size={32} /> },
          { id: 'process_map', title: 'Process Map (프로세스맵)', desc: '업종별 템플릿으로 핵심 공정 흐름을 시각화합니다.', icon: <Workflow size={32} /> },
          { id: 'swimlane_map', title: 'Swimlane Map (스윔레인)', desc: '부서/역할별 업무 흐름과 핸드오프를 정리합니다.', icon: <GitBranch size={32} /> },
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
              onSelectTool={openToolFromPhase}
            />}

            <ToolGroupGrid
              stepId="define"
              tools={defineTools}
              completedTools={completedTools}
              onSelectTool={setActiveTool}
              onOpenManual={openManualModal}
            />

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
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <ManualLinkButton toolId={activeTool} onOpen={openManualModal} />
                      <button className="modal-close-btn" onClick={() => setActiveTool(null)}><X size={24} /></button>
                    </div>
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
                      <div>
                        <SwimlaneTemplatePicker
                          industryId={selectedIndustry || 'manufacturing'}
                          industryName={sigmaData?.industries?.find(i => i.id === selectedIndustry)?.name}
                          onApply={(mapData) => {
                            const key = activeTool === 'swimlane_map' ? 'swimlaneMap' : 'processMap';
                            setData({
                              ...data,
                              define: { ...data.define, [key]: mapData }
                            });
                            setCompletedTools(prev => Array.from(new Set([...prev, activeTool])));
                          }}
                        />
                        <SwimlaneBuilder
                          data={activeTool === 'swimlane_map' ? data.define.swimlaneMap : data.define.processMap}
                          onChange={(newData) => {
                            setData({
                              ...data,
                              define: {
                                ...data.define,
                                [activeTool === 'swimlane_map' ? 'swimlaneMap' : 'processMap']: newData
                              }
                            });
                            setCompletedTools(prev => Array.from(new Set([...prev, activeTool])));
                          }}
                        />
                      </div>
                    )}

                    {/* 1. Project Charter */}
                    {/* 1. Project Charter */}
                    {activeTool === 'project_charter' && (
                      <div className="charter-section" style={{ border: 'none', padding: 0 }}>
                        <CharterTemplatePicker
                          industryId={selectedIndustry || 'manufacturing'}
                          industryName={sigmaData?.industries?.find(i => i.id === selectedIndustry)?.name}
                          currentTitle={data.define.projectTitle}
                          problemTypes={
                            Array.isArray(diagnosticResponses?.q1_problem_type)
                              ? diagnosticResponses.q1_problem_type
                              : diagnosticResponses?.q1_problem_type
                                ? [diagnosticResponses.q1_problem_type]
                                : []
                          }
                          methodology={methodology}
                          onApply={(fields) => {
                            setData({ ...data, define: { ...data.define, ...fields } });
                            setCompletedTools(prev => Array.from(new Set([...prev, 'project_charter'])));
                          }}
                        />

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
                        <div className="charter-a3-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '1.5rem' }}>

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
                                <BusinessCaseBuilder
                                  mode="business"
                                  currentValue={data.define.businessCase}
                                  projectTitle={data.define.projectTitle}
                                  industryName={sigmaData?.industries?.find(i => i.id === selectedIndustry)?.name}
                                  methodology={methodology}
                                  opportunity={data.selection?.opportunity?.businessOpportunity || ''}
                                  relatedContext={[data.define.problemStatement, data.define.goal].filter(Boolean).join('\n')}
                                  onApply={(businessCase) => {
                                    setData({ ...data, define: { ...data.define, businessCase } });
                                    setCompletedTools(prev => Array.from(new Set([...prev, 'project_charter'])));
                                  }}
                                />
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
                                <BusinessCaseBuilder
                                  mode="problem"
                                  currentValue={data.define.problemStatement}
                                  projectTitle={data.define.projectTitle}
                                  industryName={sigmaData?.industries?.find(i => i.id === selectedIndustry)?.name}
                                  methodology={methodology}
                                  opportunity={data.define.businessCase || data.selection?.opportunity?.businessOpportunity || ''}
                                  relatedContext={data.define.businessCase || ''}
                                  onApply={(problemStatement) => {
                                    setData({ ...data, define: { ...data.define, problemStatement } });
                                    setCompletedTools(prev => Array.from(new Set([...prev, 'project_charter'])));
                                  }}
                                />
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
                                <BusinessCaseBuilder
                                  mode="goal"
                                  currentValue={data.define.goal}
                                  projectTitle={data.define.projectTitle}
                                  industryName={sigmaData?.industries?.find(i => i.id === selectedIndustry)?.name}
                                  methodology={methodology}
                                  opportunity={data.define.problemStatement || ''}
                                  problemStatement={data.define.problemStatement || ''}
                                  relatedContext={[data.define.businessCase, data.define.problemStatement].filter(Boolean).join('\n')}
                                  onApply={(goal) => {
                                    setData({ ...data, define: { ...data.define, goal } });
                                    setCompletedTools(prev => Array.from(new Set([...prev, 'project_charter'])));
                                  }}
                                />
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
                        <TeamTemplatePicker
                          industryId={selectedIndustry || 'manufacturing'}
                          industryName={sigmaData?.industries?.find(i => i.id === selectedIndustry)?.name}
                          onApply={({ team, timeline }) => {
                            setData({ ...data, define: { ...data.define, team, timeline } });
                            setCompletedTools(prev => Array.from(new Set([...prev, 'team'])));
                          }}
                        />
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
                                    setCompletedTools(prev => Array.from(new Set([...prev, 'team'])));
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
                                    setCompletedTools(prev => Array.from(new Set([...prev, 'team'])));
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
                        <SipocTemplatePicker
                          industryId={selectedIndustry || 'manufacturing'}
                          industryName={sigmaData?.industries?.find(i => i.id === selectedIndustry)?.name}
                          value={data.define.sipoc}
                          onApply={(sipoc) => {
                            setData({ ...data, define: { ...data.define, sipoc } });
                            setCompletedTools(prev => Array.from(new Set([...prev, 'sipoc'])));
                          }}
                        />
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
                      </div>
                    )}

                    {/* 4. VOC & CTQ */}
                    {activeTool === 'voc_ctq' && (
                      <VocCtqEditor
                        industryId={selectedIndustry || 'manufacturing'}
                        industryName={sigmaData?.industries?.find(i => i.id === selectedIndustry)?.name}
                        value={data.define?.vocCtq}
                        onChange={(vocCtq) => {
                          const ctqText = (vocCtq.ctqItems || [])
                            .map((c, i) => `${i + 1}. ${c.ctq} (가중치 ${c.weight}%): ${c.spec}`)
                            .join('\n');
                          setData({
                            ...data,
                            define: { ...data.define, vocCtq },
                            measure: { ...data.measure, ctq: ctqText || data.measure.ctq }
                          });
                          setCompletedTools(prev => Array.from(new Set([...prev, 'voc_ctq'])));
                        }}
                      />
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
          { id: 'msa_grr', title: 'MSA / GR&R', desc: '측정시스템 신뢰성을 평가하고 %GR&R를 계산합니다.', icon: <Ruler size={32} /> },
          { id: 'normality', title: 'Normality Test (정규성)', desc: 'Anderson-Darling로 정규분포 적합성을 검정합니다.', icon: <Activity size={32} /> },
          { id: 'capability', title: 'Process Capability (공정능력)', desc: 'Cp/Cpk·Pp/Ppk·%OOS·Z.bench를 산출합니다.', icon: <BarChart2 size={32} /> },
          { id: 'sample_size', title: 'Sample Size (샘플 크기)', desc: '평균/비율 검정을 위한 필요 표본 수를 계산합니다.', icon: <Calculator size={32} /> },
          { id: 'control', title: 'Control Chart (관리도)', desc: '공정의 이상 원인을 감지하고 안정 상태를 모니터링합니다.', icon: <Activity size={32} /> },
          { id: 'histogram', title: 'Histogram (히스토그램)', desc: '데이터 분포를 시각화하고 공정 능력(Cp, Cpk)을 분석합니다.', icon: <BarChart2 size={32} /> },
          { id: 'scatter', title: 'Scatter Plot (산점도)', desc: '변수 간의 상관관계를 파악하여 인과관계를 추론합니다.', icon: <Target size={32} /> },
          { id: 'boxplot', title: 'Box Plot (상자 그림)', desc: '데이터의 산포와 중앙값, 이상치를 시각적으로 분석합니다.', icon: <Package size={32} /> },
          { id: 'run', title: 'Run Chart (런 차트)', desc: '시간 흐름에 따른 데이터의 추세와 패턴을 분석합니다.', icon: <TrendingUp size={32} /> }
        ];

        const syncMeasureFromHistogram = (histogramPatch) => {
          const nextHist = { ...(data.measure.chartData?.histogram || {}), ...histogramPatch };
          const raw = nextHist.rawData || [];
          const updatedMeasure = applyDerivedToMeasure(data.measure, raw, {
            lsl: nextHist.lsl,
            usl: nextHist.usl,
            binCount: nextHist.binCount || 10
          });
          setData({ ...data, measure: updatedMeasure });
          if (raw.length > 0) {
            setCompletedTools(prev => {
              const ids = ['dpmo', 'control', 'histogram', 'scatter', 'boxplot', 'run', 'spc_control_chart', 'capability_analysis'];
              const merged = Array.from(new Set([...prev, ...ids]));
              return merged;
            });
          }
        };

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

            {/* 공통 측정 데이터 → 전체 분석 결과 */}
            {!activeTool && (
              <MeasureDashboard
                measure={data.measure}
                onMeasureChange={(updatedMeasure) => {
                  setData({ ...data, measure: updatedMeasure });
                  if ((updatedMeasure.chartData?.histogram?.rawData || []).length > 0) {
                    setCompletedTools(prev => {
                      const ids = ['dpmo', 'control', 'histogram', 'scatter', 'boxplot', 'run', 'spc_control_chart', 'capability_analysis'];
                      return Array.from(new Set([...prev, ...ids]));
                    });
                  }
                }}
              />
            )}

            {/* 도구 추천 패널 (모달이 없을 때만 표시) */}
            {!activeTool && <ToolRecommendationPanel
              tools={getToolRecommendations('measure').slice(0, 5)}
              industryName={sigmaData?.industries?.find(i => i.id === selectedIndustry)?.name}
              completedTools={completedTools}
              onSelectTool={openToolFromPhase}
            />}

            {!activeTool && (
              <ToolGroupGrid
                stepId="measure"
                tools={measureTools}
                completedTools={completedTools}
                onSelectTool={setActiveTool}
                onOpenManual={openManualModal}
                style={{ marginTop: '1.5rem' }}
              />
            )}

            {/* Modals — 상세 보기 (공통 데이터 기반) */}
            {activeTool && (
              <div className="modal-overlay" onClick={() => setActiveTool(null)}>
                <div className="modal-content-large" onClick={e => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>
                      {measureTools.find(t => t.id === activeTool)?.icon || '🛠️'}
                      {' '}
                      {measureTools.find(t => t.id === activeTool)?.title || sigmaData?.tools?.find(t => t.id === activeTool)?.name_ko || '도구 준비 중'}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <ManualLinkButton toolId={activeTool} onOpen={openManualModal} />
                      <button className="modal-close-btn" onClick={() => setActiveTool(null)}><X size={24} /></button>
                    </div>
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

                    {activeTool === 'dpmo' && (
                      <div className="card-inner" style={{ border: 'none', boxShadow: 'none', padding: 0 }}>
                        <p style={{ color: '#64748b', marginBottom: '1rem', fontSize: '0.9rem' }}>
                          공통 측정 데이터 + LSL/USL 기준으로 자동 집계된 값입니다. 필요 시 수동 수정할 수 있습니다.
                        </p>
                        <div className="form-row">
                          <div className="form-group flex-1">
                            <label>검사 단위 수 (Units)</label>
                            <input type="number" value={data.measure.unitCount} onChange={(e) => {
                              setData({ ...data, measure: { ...data.measure, unitCount: Number(e.target.value) } });
                              markToolDone('dpmo');
                            }} />
                          </div>
                          <div className="form-group flex-1">
                            <label>단위당 결함 기회 (OPU)</label>
                            <input type="number" value={data.measure.opportunityPerUnit} onChange={(e) => {
                              setData({ ...data, measure: { ...data.measure, opportunityPerUnit: Number(e.target.value) } });
                              markToolDone('dpmo');
                            }} />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>총 발견 결함 수</label>
                          <input type="number" value={data.measure.defectCount} onChange={(e) => {
                            setData({ ...data, measure: { ...data.measure, defectCount: Number(e.target.value) } });
                            markToolDone('dpmo');
                          }} />
                        </div>
                        <div className="result-badge primary">
                          <div className="res-label">DPMO 지표</div>
                          <div className="res-value">{dpmoValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                        </div>
                      </div>
                    )}

                    {activeTool === 'msa_grr' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <MsaEditor
                          industryId={selectedIndustry || 'manufacturing'}
                          industryName={sigmaData?.industries?.find(i => i.id === selectedIndustry)?.name}
                          value={data.measure?.msa}
                          onChange={(msa) => {
                            setData({ ...data, measure: { ...data.measure, msa } });
                            setCompletedTools(prev => Array.from(new Set([...prev, 'msa_grr'])));
                          }}
                        />
                        <GageRndRCalculator
                          onComplete={() => markToolDone('msa_grr')}
                        />
                      </div>
                    )}

                    {activeTool === 'normality' && (
                      <NormalityEditor
                        initialData={data.measure?.chartData?.histogram?.rawData || []}
                        onComplete={() => markToolDone('normality')}
                      />
                    )}

                    {activeTool === 'capability' && (
                      <CapabilityEditor
                        initialData={data.measure?.chartData?.histogram?.rawData || []}
                        initialLsl={data.measure?.chartData?.histogram?.lsl ?? ''}
                        initialUsl={data.measure?.chartData?.histogram?.usl ?? ''}
                        onComplete={(cap) => {
                          markToolDone('capability');
                          if (cap?.ok) {
                            setData(prev => ({
                              ...prev,
                              measure: {
                                ...prev.measure,
                                analysisSummary: {
                                  ...(prev.measure.analysisSummary || {}),
                                  cp: cap.cp,
                                  cpk: cap.cpk,
                                  pp: cap.pp,
                                  ppk: cap.ppk,
                                  zBench: cap.zBench,
                                  pctOosObserved: cap.pctOosObserved
                                }
                              }
                            }));
                          }
                        }}
                      />
                    )}

                    {activeTool === 'sample_size' && (
                      <SampleSizeEditor onComplete={() => markToolDone('sample_size')} />
                    )}

                    {['control', 'histogram', 'scatter', 'boxplot', 'run'].includes(activeTool) && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div style={{ padding: '1rem 1.25rem', background: '#eff6ff', borderRadius: '8px', border: '1px solid #bfdbfe', color: '#1e40af', fontSize: '0.9rem' }}>
                          공통 측정 데이터로 자동 생성된 결과입니다. 아래에서 수정하면 {activeTool === 'histogram' ? '모든 분석 도구에 다시 반영' : '해당 차트만 갱신'}됩니다.
                        </div>

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
                              if (activeTool === 'histogram') {
                                syncMeasureFromHistogram(chartData);
                                markToolDone('histogram');
                                return;
                              }
                              const chartKey =
                                activeTool === 'control' ? 'controlChart' :
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
                              markToolDone(activeTool);
                            }}
                          />
                        </div>

                        <div style={{ minHeight: '400px', background: 'white', padding: '1.5rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          {activeTool === 'control' && (
                            <ControlChart
                              data={data.measure.chartData?.controlChart?.samples || []}
                              type={data.measure.chartData?.controlChart?.type || 'i-mr'}
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
                              {data.measure.analysisSummary && (
                                <div style={{ marginTop: '1.5rem', padding: '1.5rem', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                  <h4 style={{ marginBottom: '1rem' }}>공정 능력 요약</h4>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem' }}>
                                    <div style={{ textAlign: 'center' }}><div style={{ color: '#64748b', fontSize: '0.8rem' }}>Mean</div><strong>{data.measure.analysisSummary.mean?.toFixed?.(2) ?? '—'}</strong></div>
                                    <div style={{ textAlign: 'center' }}><div style={{ color: '#64748b', fontSize: '0.8rem' }}>StdDev</div><strong>{data.measure.analysisSummary.stdDev?.toFixed?.(2) ?? '—'}</strong></div>
                                    <div style={{ textAlign: 'center' }}><div style={{ color: '#64748b', fontSize: '0.8rem' }}>Cp</div><strong>{data.measure.analysisSummary.cp?.toFixed?.(2) ?? '—'}</strong></div>
                                    <div style={{ textAlign: 'center' }}><div style={{ color: '#64748b', fontSize: '0.8rem' }}>Cpk</div><strong>{data.measure.analysisSummary.cpk?.toFixed?.(2) ?? '—'}</strong></div>
                                    <div style={{ textAlign: 'center' }}><div style={{ color: '#64748b', fontSize: '0.8rem' }}>Pp</div><strong>{data.measure.analysisSummary.pp?.toFixed?.(2) ?? '—'}</strong></div>
                                    <div style={{ textAlign: 'center' }}><div style={{ color: '#64748b', fontSize: '0.8rem' }}>Ppk</div><strong>{data.measure.analysisSummary.ppk?.toFixed?.(2) ?? '—'}</strong></div>
                                    <div style={{ textAlign: 'center' }}><div style={{ color: '#64748b', fontSize: '0.8rem' }}>Z.bench</div><strong>{data.measure.analysisSummary.zBench?.toFixed?.(2) ?? '—'}</strong></div>
                                  </div>
                                </div>
                              )}
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
          { id: 'ce_matrix', title: 'C&E Matrix', desc: 'Y 중요도×X 영향도로 원인 우선순위를 산출합니다.', icon: <Grid3X3 size={32} /> },
          { id: 'hypothesis_log', title: 'Y=f(X) 검증 로그', desc: '가설·검증방법·채택/기각을 체크리스트로 관리합니다.', icon: <ClipboardList size={32} /> },
          { id: 'hypothesis_test', title: 'Hypothesis Testing (가설검정)', desc: '데이터를 통해 가설을 통계적으로 검정합니다 (T-Test).', icon: <Scale size={32} /> },
          { id: 'proportion_test', title: 'Proportion Test (비율검정)', desc: '1비율·2비율 z검정으로 불량률 전후를 비교합니다.', icon: <Scale size={32} /> },
          { id: 'levene', title: 'Levene (등분산)', desc: '그룹 간 분산이 같은지 Brown-Forsythe로 검정합니다.', icon: <Activity size={32} /> },
          { id: 'nonparametric', title: 'Nonparametric (비모수)', desc: 'Mann-Whitney / Kruskal-Wallis로 중앙값을 비교합니다.', icon: <GitBranch size={32} /> },
          { id: 'anova', title: 'ANOVA (분산분석)', desc: '3개 이상 그룹 평균 차이를 F-검정으로 확인합니다.', icon: <Scale size={32} /> },
          { id: 'chi_square', title: 'Chi-Square (카이제곱)', desc: '분할표 기반 계수형 독립성/연관성을 검정합니다.', icon: <Grid3X3 size={32} /> },
          { id: 'correlation', title: 'Correlation (상관분석)', desc: 'Pearson r과 p-value로 변수 관계의 유의성을 검정합니다.', icon: <Target size={32} /> },
          { id: 'regression', title: 'Regression Analysis (단순회귀)', desc: '단순 선형 회귀식으로 관계를 설명합니다.', icon: <TrendingUp size={32} /> },
          { id: 'multi_regression', title: 'Multiple Regression (다중회귀)', desc: '여러 X로 Y를 예측하고 잔차를 요약합니다.', icon: <TrendingUp size={32} /> },
          { id: 'residual_diag', title: 'Residual Diagnostics (잔차진단)', desc: '잔차 정규성·등분산·잔차vs적합을 점검합니다.', icon: <Activity size={32} /> },
          { id: 'weibull', title: 'Weibull (신뢰성)', desc: '수명 데이터로 shape/scale·B10·MTTF를 추정합니다.', icon: <Clock size={32} /> },
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
              onSelectTool={openToolFromPhase}
            />}

            {methodology === 'dmaic' ? (
              <>
                <ToolGroupGrid
                  stepId="analyze"
                  tools={analyzeTools}
                  completedTools={completedTools}
                  onSelectTool={setActiveTool}
                  onOpenManual={openManualModal}
                />

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
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <ManualLinkButton toolId={activeTool} onOpen={openManualModal} />
                          <button className="modal-close-btn" onClick={() => setActiveTool(null)}><X size={24} /></button>
                        </div>
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
                            <ParetoTemplatePicker
                              industryId={selectedIndustry || 'manufacturing'}
                              industryName={sigmaData?.industries?.find(i => i.id === selectedIndustry)?.name}
                              onApply={(items) => {
                                setData({ ...data, analyze: { ...data.analyze, paretoItems: items } });
                                setCompletedTools(prev => Array.from(new Set([...prev, 'pareto'])));
                              }}
                            />
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
                                          setCompletedTools(prev => Array.from(new Set([...prev, 'pareto'])));
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
                                          setCompletedTools(prev => Array.from(new Set([...prev, 'pareto'])));
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
                                  <button className="btn-text" onClick={() => {
                                    setData({
                                      ...data,
                                      analyze: {
                                        ...data.analyze,
                                        paretoItems: [...data.analyze.paretoItems, { category: '새 항목', count: 0 }]
                                      }
                                    });
                                  }}>+ 항목 추가</button>
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
                            <FishboneTemplatePicker
                              industryId={selectedIndustry || 'manufacturing'}
                              industryName={sigmaData?.industries?.find(i => i.id === selectedIndustry)?.name}
                              onApply={(fishbone) => {
                                setData({ ...data, analyze: { ...data.analyze, fishbone } });
                                setCompletedTools(prev => Array.from(new Set([...prev, 'fishbone'])));
                              }}
                            />
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
                            industryId={selectedIndustry || 'manufacturing'}
                            industryName={sigmaData?.industries?.find(i => i.id === selectedIndustry)?.name}
                            onUpdate={(updatedItems) => {
                              setData({ ...data, analyze: { ...data.analyze, fmea: updatedItems } });
                              setCompletedTools(prev => Array.from(new Set([...prev, 'fmea'])));
                            }}
                          />
                        )}

                        {/* 4. 5-Why */}
                        {activeTool === '5whys' && (
                          <Why5Editor
                            industryId={selectedIndustry || 'manufacturing'}
                            industryName={sigmaData?.industries?.find(i => i.id === selectedIndustry)?.name}
                            value={data.analyze.why5}
                            onChange={(why5) => {
                              setData({ ...data, analyze: { ...data.analyze, why5 } });
                              setCompletedTools(prev => Array.from(new Set([...prev, '5whys'])));
                            }}
                          />
                        )}

                        {activeTool === 'anova' && (
                          <AnovaEditor onComplete={() => markToolDone('anova')} />
                        )}

                        {activeTool === 'chi_square' && (
                          <ChiSquareEditor onComplete={() => markToolDone('chi_square')} />
                        )}

                        {activeTool === 'proportion_test' && (
                          <ProportionTestEditor onComplete={() => markToolDone('proportion_test')} />
                        )}

                        {activeTool === 'levene' && (
                          <LeveneEditor onComplete={() => markToolDone('levene')} />
                        )}

                        {activeTool === 'nonparametric' && (
                          <NonparametricEditor onComplete={() => markToolDone('nonparametric')} />
                        )}

                        {activeTool === 'residual_diag' && (
                          <ResidualDiagnosticsEditor onComplete={() => markToolDone('residual_diag')} />
                        )}

                        {activeTool === 'weibull' && (
                          <WeibullEditor onComplete={() => markToolDone('weibull')} />
                        )}

                        {activeTool === 'ce_matrix' && (
                          <CauseEffectMatrixEditor
                            value={data.analyze?.ceMatrix}
                            onChange={(ceMatrix) => setData({ ...data, analyze: { ...data.analyze, ceMatrix } })}
                            onComplete={() => markToolDone('ce_matrix')}
                          />
                        )}

                        {activeTool === 'hypothesis_log' && (
                          <HypothesisLogEditor
                            value={data.analyze?.hypothesisLog || []}
                            onChange={(hypothesisLog) => setData({ ...data, analyze: { ...data.analyze, hypothesisLog } })}
                            onComplete={() => markToolDone('hypothesis_log')}
                          />
                        )}

                        {activeTool === 'correlation' && (
                          <CorrelationEditor
                            initialX={(data.measure?.chartData?.scatterPlot?.data || []).map(p => p.x)}
                            initialY={(data.measure?.chartData?.scatterPlot?.data || []).map(p => p.y)}
                            onComplete={() => markToolDone('correlation')}
                          />
                        )}

                        {activeTool === 'multi_regression' && (
                          <MultipleRegressionEditor onComplete={() => markToolDone('multi_regression')} />
                        )}

                        {/* 5. Hypothesis Testing */}
                        {activeTool === 'hypothesis_test' && (
                          <div className="card-inner" style={{ border: 'none', padding: 0 }}>
                            <h3>2-Sample T-Test (평균 비교)</h3>
                            <StatTemplatePanel
                              toolType="groups"
                              title="t-검정 데이터시트 (2그룹)"
                              initialConfig={{ groupCount: 2, groupNames: ['Dataset A', 'Dataset B'] }}
                              onAnalyze={(r) => {
                                if (!r.groups?.length) return;
                                const a = r.groups[0]?.valuesText || r.groups[0]?.values?.join(', ') || '';
                                const b = r.groups[1]?.valuesText || r.groups[1]?.values?.join(', ') || '';
                                const s1 = r.groups[0]?.values || [];
                                const s2 = r.groups[1]?.values || [];
                                let resultText = data.analyze.hypothesis?.result;
                                if (s1.length >= 2 && s2.length >= 2) {
                                  try {
                                    const tStat = ss.tTestTwoSample(s1, s2);
                                    const m1 = ss.mean(s1);
                                    const m2 = ss.mean(s2);
                                    const sd1 = ss.standardDeviation(s1);
                                    const sd2 = ss.standardDeviation(s2);
                                    const isSig = Math.abs(tStat) > 1.96;
                                    resultText = `분석 결과 (2-Sample T-Test):\n` +
                                      `--------------------------------\n` +
                                      `Group A: Mean=${m1.toFixed(3)}, SD=${sd1.toFixed(3)}, N=${s1.length}\n` +
                                      `Group B: Mean=${m2.toFixed(3)}, SD=${sd2.toFixed(3)}, N=${s2.length}\n` +
                                      `--------------------------------\n` +
                                      `T-Statistic: ${tStat.toFixed(4)}\n` +
                                      `결론: ${isSig ? '통계적으로 유의미한 차이가 있습니다.' : '통계적으로 유의미한 차이가 없습니다.'} (Alpha=0.05 추정)`;
                                    markToolDone('hypothesis_test');
                                  } catch (err) {
                                    resultText = '계산 중 오류: ' + err.message;
                                  }
                                }
                                setData({
                                  ...data,
                                  analyze: {
                                    ...data.analyze,
                                    hypothesis: {
                                      ...data.analyze.hypothesis,
                                      sample1: a,
                                      sample2: b || data.analyze.hypothesis?.sample2 || '',
                                      result: resultText
                                    }
                                  }
                                });
                              }}
                            />
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
                                    markToolDone('hypothesis_test');
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
                                {data.analyze.hypothesis?.result && (
                                  <ResultInsight
                                    toolId="hypothesis_test"
                                    result={{
                                      ok: true,
                                      conclusion: data.analyze.hypothesis.result,
                                      significant: /유의미한 차이가 있습니다/.test(data.analyze.hypothesis.result)
                                    }}
                                  />
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 6. Regression Analysis */}
                        {activeTool === 'regression' && (
                          <div className="card-inner" style={{ border: 'none', padding: 0 }}>
                            <h3>Simple Linear Regression (단순 회귀분석)</h3>
                            <StatTemplatePanel
                              toolType="xy"
                              title="단순회귀 데이터시트 (X·Y)"
                              initialConfig={{ xName: 'X', yName: 'Y' }}
                              onAnalyze={(r) => {
                                const x = r.x || [];
                                const y = r.y || [];
                                let resultText = data.analyze.regression?.result;
                                let nextReg = {
                                  ...data.analyze.regression,
                                  xData: r.xText,
                                  yData: r.yText
                                };
                                if (x.length >= 2 && y.length >= 2) {
                                  try {
                                    const n = Math.min(x.length, y.length);
                                    const xs = x.slice(0, n);
                                    const ys = y.slice(0, n);
                                    const lr = ss.linearRegression(xs.map((xi, i) => [xi, ys[i]]));
                                    const line = ss.linearRegressionLine(lr);
                                    const r2 = ss.rSquared(xs.map((xi, i) => [xi, ys[i]]), line);
                                    resultText = `단순 회귀분석 결과:\n` +
                                      `--------------------------------\n` +
                                      `Y = ${lr.m.toFixed(4)}X + ${lr.b.toFixed(4)}\n` +
                                      `R² = ${(r2 * 100).toFixed(2)}%\n` +
                                      `n = ${n}`;
                                    markToolDone('regression');
                                  } catch (err) {
                                    resultText = '계산 중 오류: ' + err.message;
                                  }
                                }
                                nextReg.result = resultText;
                                setData({
                                  ...data,
                                  analyze: {
                                    ...data.analyze,
                                    regression: nextReg
                                  }
                                });
                              }}
                            />
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
                                    markToolDone('regression');
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
                                {data.analyze.regression?.result && (
                                  <ResultInsight
                                    toolId="regression"
                                    result={{
                                      ok: true,
                                      conclusion: data.analyze.regression.result,
                                      r2: (() => {
                                        const m = String(data.analyze.regression.result).match(/R[²2]\s*=\s*([\d.]+)/i);
                                        return m ? Number(m[1]) / 100 : undefined;
                                      })()
                                    }}
                                  />
                                )}
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
                <AlternativesEditor
                  industryId={selectedIndustry || 'manufacturing'}
                  industryName={sigmaData?.industries?.find(i => i.id === selectedIndustry)?.name}
                  value={data.analyze.designAlternatives}
                  onChange={(designAlternatives) => {
                    const text = [
                      ...(designAlternatives.options || []).map(o =>
                        `${o.name}\n  장점: ${o.pros}\n  단점: ${o.cons}\n  점수: ${o.score}`
                      ),
                      '',
                      `결정: ${designAlternatives.decision || ''}`
                    ].join('\n');
                    setData({
                      ...data,
                      analyze: {
                        ...data.analyze,
                        designAlternatives,
                        alternatives: text
                      }
                    });
                    setCompletedTools(prev => Array.from(new Set([...prev, 'alternatives'])));
                  }}
                />
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
            { id: 'doe', title: 'DOE (실험계획법)', desc: '업종별 템플릿으로 실험 인자와 결과를 정리합니다.', icon: <FlaskConical size={32} /> },
            { id: 'doe_effects', title: 'DOE Effects (주효과·교호작용)', desc: '실험 런 데이터로 주효과와 2원 교호작용을 계산합니다.', icon: <Activity size={32} /> },
            { id: 'piloting', title: 'Piloting (파일롯 검증)', desc: '개선안을 소규모로 검증하는 파일럿 계획을 수립합니다.', icon: <Rocket size={32} /> },
            { id: 'poka_yoke', title: 'Poka-yoke (실수 방지)', desc: '재발을 막는 포카요케 장치를 정의합니다.', icon: <ShieldCheck size={32} /> }
          ]
          : [
            { id: 'design_spec', title: 'Final Design Spec (상세 설계)', desc: '최종 설계 사양을 상세히 기술합니다.', icon: <PenTool size={32} /> }
          ];

        const improveIndustry = sigmaData?.industries?.find(i => i.id === selectedIndustry);

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
              industryName={improveIndustry?.name}
              completedTools={completedTools}
              onSelectTool={openToolFromPhase}
            />}

            <ToolGroupGrid
              stepId={isDmaicImprove ? 'improve' : 'design'}
              tools={improveTools}
              completedTools={completedTools}
              onSelectTool={setActiveTool}
              onOpenManual={openManualModal}
            />

            {activeTool && (
              <div className="modal-overlay" onClick={() => setActiveTool(null)}>
                <div className="modal-content-large" onClick={e => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>
                      {improveTools.find(t => t.id === activeTool)?.icon || '🛠️'}
                      {' '}
                      {improveTools.find(t => t.id === activeTool)?.title || sigmaData?.tools?.find(t => t.id === activeTool)?.name_ko || '도구 준비 중'}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <ManualLinkButton toolId={activeTool} onOpen={openManualModal} />
                      <button className="modal-close-btn" onClick={() => setActiveTool(null)}><X size={24} /></button>
                    </div>
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
                      <SolutionsEditor
                        industryId={selectedIndustry || 'manufacturing'}
                        industryName={improveIndustry?.name}
                        value={data.improve?.solutions || []}
                        onChange={(solutions) => {
                          setData({ ...data, improve: { ...data.improve, solutions } });
                          setCompletedTools(prev => Array.from(new Set([...prev, 'solutions'])));
                        }}
                      />
                    )}

                    {activeTool === 'doe' && (
                      <DoeEditor
                        industryId={selectedIndustry || 'manufacturing'}
                        industryName={improveIndustry?.name}
                        value={(() => {
                          const doe = data.improve?.DOE;
                          if (!doe) return null;
                          // legacy: factors가 문자열 배열인 경우 객체로 정규화
                          const factors = Array.isArray(doe.factorDetails)
                            ? doe.factorDetails
                            : (doe.factors || []).map(f => (typeof f === 'string' ? { name: f, low: '', high: '' } : f));
                          return { ...doe, factors };
                        })()}
                        onChange={(DOE) => {
                          setData({
                            ...data,
                            improve: {
                              ...data.improve,
                              DOE: {
                                templateId: DOE.templateId,
                                templateName: DOE.templateName,
                                factors: DOE.factors,
                                factorDetails: DOE.factors,
                                response: DOE.response,
                                design: DOE.design,
                                result: DOE.result
                              }
                            }
                          });
                          setCompletedTools(prev => Array.from(new Set([...prev, 'doe'])));
                        }}
                      />
                    )}

                    {activeTool === 'doe_effects' && (
                      <DoeEffectsEditor
                        initialFactors={(data.improve?.DOE?.factors || []).map(f =>
                          typeof f === 'string' ? f : (f?.name || '')
                        ).filter(Boolean)}
                        onComplete={() => markToolDone('doe_effects')}
                      />
                    )}

                    {activeTool === 'piloting' && (
                      <PilotEditor
                        industryId={selectedIndustry || 'manufacturing'}
                        industryName={improveIndustry?.name}
                        value={data.improve?.pilot}
                        onChange={(pilot) => {
                          setData({ ...data, improve: { ...data.improve, pilot } });
                          setCompletedTools(prev => Array.from(new Set([...prev, 'piloting'])));
                        }}
                      />
                    )}

                    {activeTool === 'poka_yoke' && (
                      <PokaYokeEditor
                        industryId={selectedIndustry || 'manufacturing'}
                        industryName={improveIndustry?.name}
                        value={data.improve?.pokaYoke}
                        onChange={(pokaYoke) => {
                          setData({ ...data, improve: { ...data.improve, pokaYoke } });
                          setCompletedTools(prev => Array.from(new Set([...prev, 'poka_yoke'])));
                        }}
                      />
                    )}

                    {activeTool === 'design_spec' && (
                      <DesignSpecEditor
                        industryId={selectedIndustry || 'manufacturing'}
                        industryName={improveIndustry?.name}
                        value={data.design}
                        onChange={(design) => {
                          setData({
                            ...data,
                            design: {
                              ...data.design,
                              ...design,
                              designSpecs: design.spec || data.design?.designSpecs || ''
                            }
                          });
                          setCompletedTools(prev => Array.from(new Set([...prev, 'design_spec'])));
                        }}
                      />
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
            { id: 'control_plan', title: '관리계획서 (Control Plan)', desc: '업종별 템플릿으로 관리특성과 반응계획을 수립합니다.', icon: <ClipboardCheck size={32} /> },
            { id: 'standard_work', title: '표준작업 문서화 (SOP)', desc: '업종별 SOP 템플릿을 선택·수정하여 표준화합니다.', icon: <FileText size={32} /> },
            { id: 'monitoring', title: 'Monitoring Plan (관리 계획)', desc: '성과 유지를 위한 모니터링 절차를 수립합니다.', icon: <ClipboardCheck size={32} /> },
            { id: 'before_after', title: 'Before / After', desc: '개선 전후 불량률·DPMO·Cpk·Sigma를 비교합니다.', icon: <TrendingUp size={32} /> },
            { id: 'result', title: 'Final Result (최종 성과)', desc: '프로젝트의 최종 개선 성과를 요약합니다.', icon: <Award size={32} /> },
            { id: 'complete', title: 'Project Completion (완료)', desc: '프로젝트를 승인하고 종료합니다.', icon: <ShieldCheck size={32} /> }
          ]
          : [
            { id: 'pilot', title: 'Pilot Verification (시제품 검증)', desc: '시제품을 통해 설계 성능을 검증합니다.', icon: <CheckCircle size={32} /> },
            { id: 'complete', title: 'Project Completion (완료)', desc: '신제품 개발을 승인하고 종료합니다.', icon: <ShieldCheck size={32} /> }
          ];

        const industryMeta = sigmaData?.industries?.find(i => i.id === selectedIndustry);

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
              industryName={industryMeta?.name}
              completedTools={completedTools}
              onSelectTool={openToolFromPhase}
            />}

            <ToolGroupGrid
              stepId={isDmaicControl ? 'control' : 'verify'}
              tools={controlTools}
              completedTools={completedTools}
              onSelectTool={setActiveTool}
              onOpenManual={openManualModal}
            />

            {activeTool && (
              <div className="modal-overlay" onClick={() => setActiveTool(null)}>
                <div className="modal-content-large" onClick={e => e.stopPropagation()}>
                  <div className="modal-header">
                    <h2>
                      {controlTools.find(t => t.id === activeTool)?.icon || '🛠️'}
                      {' '}
                      {controlTools.find(t => t.id === activeTool)?.title || sigmaData?.tools?.find(t => t.id === activeTool)?.name_ko || '도구 준비 중'}
                    </h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <ManualLinkButton toolId={activeTool} onOpen={openManualModal} />
                      <button className="modal-close-btn" onClick={() => setActiveTool(null)}><X size={24} /></button>
                    </div>
                  </div>
                  <div className="modal-body">
                    {![...controlTools.map(t => t.id)].includes(activeTool) && activeTool !== 'control_plan' && activeTool !== 'standard_work' && (
                      <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚧</div>
                        <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>{sigmaData?.tools?.find(t => t.id === activeTool)?.name_ko || '도구'} 템플릿 준비 중</h3>
                        <p style={{ maxWidth: '400px', margin: '0 auto', lineHeight: '1.6' }}>
                          이 도구에 특화된 세부 입력 양식은 향후 업데이트될 예정입니다.<br /><br />
                          <b>도구 설명:</b> {sigmaData?.tools?.find(t => t.id === activeTool)?.description || '설명이 없습니다.'}
                        </p>
                      </div>
                    )}

                    {activeTool === 'control_plan' && (
                      <ControlPlanEditor
                        industryId={selectedIndustry || 'manufacturing'}
                        industryName={industryMeta?.name}
                        value={data.control?.controlPlan}
                        onChange={(controlPlan) => {
                          const summaryLines = (controlPlan.items || []).map(i =>
                            `· [${i.process}] ${i.characteristic} | ${i.spec} | ${i.sample} | 담당:${i.owner} | 대응:${i.reaction}`
                          );
                          setData({
                            ...data,
                            control: {
                              ...data.control,
                              controlPlan,
                              controlPlanSummary: [
                                `【관리계획서】 ${controlPlan.templateName || ''}`,
                                ...summaryLines
                              ].join('\n')
                            }
                          });
                          setCompletedTools(prev => Array.from(new Set([...prev, 'control_plan'])));
                        }}
                      />
                    )}

                    {activeTool === 'standard_work' && (
                      <StandardWorkEditor
                        industryId={selectedIndustry || 'manufacturing'}
                        industryName={industryMeta?.name}
                        value={data.control?.standardWork}
                        onChange={(standardWork) => {
                          setData({
                            ...data,
                            control: {
                              ...data.control,
                              standardWork,
                              sop: standardWork.title || data.control.sop,
                              training: standardWork.training || data.control.training
                            }
                          });
                          setCompletedTools(prev => Array.from(new Set([...prev, 'standard_work'])));
                        }}
                      />
                    )}

                    {activeTool === 'monitoring' && (
                      <MonitoringEditor
                        industryId={selectedIndustry || 'manufacturing'}
                        industryName={industryMeta?.name}
                        value={data.control?.monitoring}
                        onChange={(monitoring) => {
                          const lines = (monitoring.kpis || []).map(k =>
                            `· ${k.name} | 목표 ${k.target} | ${k.frequency} | 담당:${k.owner} | 에스컬레이션:${k.escalation}`
                          );
                          setData({
                            ...data,
                            control: {
                              ...data.control,
                              monitoring,
                              monitoringPlan: [
                                `【모니터링 KPI】 ${monitoring.templateName || ''}`,
                                ...lines
                              ].join('\n')
                            }
                          });
                          setCompletedTools(prev => Array.from(new Set([...prev, 'monitoring'])));
                        }}
                      />
                    )}

                    {activeTool === 'before_after' && (
                      <BeforeAfterDashboard
                        measure={data.measure}
                        value={data.control?.beforeAfter}
                        controlResult={data.control?.beforeAfter?.after}
                        onComplete={(payload) => {
                          setData({
                            ...data,
                            control: { ...data.control, beforeAfter: payload }
                          });
                          markToolDone('before_after');
                        }}
                      />
                    )}

                    {activeTool === 'result' && (
                      <ResultEditor
                        industryId={selectedIndustry || 'manufacturing'}
                        industryName={industryMeta?.name}
                        value={data.control?.resultSummary}
                        onChange={(resultSummary) => {
                          const lines = (resultSummary.metrics || []).map(m =>
                            `· ${m.name}: ${m.before} → ${m.after}${m.note ? ` (${m.note})` : ''}`
                          );
                          const text = [
                            `【최종 성과】 ${resultSummary.templateName || ''}`,
                            ...lines,
                            '',
                            resultSummary.summary || ''
                          ].join('\n');
                          setData({
                            ...data,
                            control: { ...data.control, resultSummary, result: text }
                          });
                          setCompletedTools(prev => Array.from(new Set([...prev, 'result'])));
                        }}
                      />
                    )}

                    {activeTool === 'pilot' && (
                      <PilotVerifyEditor
                        industryId={selectedIndustry || 'manufacturing'}
                        industryName={industryMeta?.name}
                        value={data.verify?.pilotVerify}
                        onChange={(pilotVerify) => {
                          const lines = (pilotVerify.items || []).map(i =>
                            `· ${i.ctq}: ${i.method} / 기준 ${i.criteria} → ${i.result}${i.note ? ` (${i.note})` : ''}`
                          );
                          const text = [
                            `【시제품 검증】 ${pilotVerify.templateName || ''}`,
                            ...lines,
                            '',
                            pilotVerify.conclusion || ''
                          ].join('\n');
                          setData({
                            ...data,
                            verify: {
                              ...data.verify,
                              pilotVerify,
                              result: text,
                              verificationResults: text
                            }
                          });
                          setCompletedTools(prev => Array.from(new Set([...prev, 'pilot'])));
                        }}
                      />
                    )}

                    {activeTool === 'complete' && (
                      <CompleteChecklist
                        isDmaic={isDmaicControl}
                        checks={data.control?.completeChecks || {}}
                        onToggle={(id) => {
                          setData({
                            ...data,
                            control: {
                              ...data.control,
                              completeChecks: {
                                ...(data.control.completeChecks || {}),
                                [id]: !data.control?.completeChecks?.[id]
                              }
                            }
                          });
                        }}
                        onComplete={() => {
                          setCompletedTools(prev => Array.from(new Set([...prev, 'complete'])));
                          alert(isDmaicControl ? 'DMAIC 프로젝트가 완료로 기록되었습니다.' : 'DFSS 프로젝트가 완료로 기록되었습니다.');
                          setActiveTool(null);
                        }}
                      />
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
      {showLanding && (
        <LandingPage
          hasResume={!!(selectedIndustry || methodology)}
          onStartProject={enterAppFromLanding}
          onResume={enterAppFromLanding}
          onOpenCurriculum={openCurriculumFromLanding}
          onResetWork={resetToStart}
        />
      )}

      {!showLanding && (
      <>
      {homeExitStep && (
        <div className="home-exit-overlay" role="dialog" aria-modal="true" aria-labelledby="home-exit-title">
          <div className="home-exit-modal">
            {homeExitStep === 'askSave' ? (
              <>
                <h3 id="home-exit-title">홈 화면으로 돌아갑니다</h3>
                <p>작업 내용을 저장할까요?</p>
                <div className="home-exit-actions">
                  <button type="button" className="home-exit-btn home-exit-btn-yes" onClick={handleHomeSaveYes}>
                    예
                  </button>
                  <button type="button" className="home-exit-btn home-exit-btn-no" onClick={handleHomeSaveNo}>
                    아니오
                  </button>
                </div>
                <button type="button" className="home-exit-cancel" onClick={handleHomeExitCancel}>
                  취소 (현재 화면 유지)
                </button>
              </>
            ) : (
              <>
                <h3 id="home-exit-title">작업한 내용이 삭제됩니다</h3>
                <p>삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.</p>
                <div className="home-exit-actions">
                  <button type="button" className="home-exit-btn home-exit-btn-danger" onClick={handleHomeDeleteConfirm}>
                    삭제
                  </button>
                  <button type="button" className="home-exit-btn home-exit-btn-no" onClick={handleHomeExitCancel}>
                    취소
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <header className="app-header">
        <div className="logo" onClick={requestGoHome} style={{ cursor: 'pointer' }} title="홈 화면으로 이동">
          <BrandLogo size={28} />
          <h1>SigmaLab</h1>
        </div>

        {/* Central Status Bar — flex/grid 흐름에 포함 (절대배치로 가리지 않음) */}
        {methodology ? (
          <div className="status-bar" title="현재 진행 단계">
            <span className={`status-bar-method ${methodology}`}>
              {methodology}
            </span>
            <ChevronRight size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
            <span className="status-bar-step">
              {steps.find(s => s.id === activeStep)?.name.split(' (')[0]}
            </span>
            <span className="status-bar-badge">진행중</span>
          </div>
        ) : (
          <div className="status-bar-spacer" aria-hidden="true" />
        )}
        <button
          type="button"
          className="header-menu-toggle"
          aria-expanded={mobileNavOpen}
          aria-controls="app-header-actions"
          aria-label={mobileNavOpen ? '메뉴 닫기' : '메뉴 열기'}
          onClick={() => setMobileNavOpen((open) => !open)}
        >
          {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
        {mobileNavOpen && (
          <button
            type="button"
            className="header-nav-backdrop"
            aria-label="메뉴 닫기"
            onClick={() => setMobileNavOpen(false)}
          />
        )}
        <div
          id="app-header-actions"
          className={`header-actions${mobileNavOpen ? ' is-open' : ''}`}
          onClick={(e) => {
            if (e.target.closest('button, a, label')) setMobileNavOpen(false);
          }}
        >
          <UserMenuBar
            session={session}
            onLogin={() => setAuthModal('login')}
            onLogout={handleLogout}
            onMyProjects={() => {
              if (!session?.userId) {
                setAuthModal('login');
                return;
              }
              setShowMyProjects(true);
            }}
            onSaveDraft={() => {
              if (!session?.userId) {
                setAuthModal('login');
                return;
              }
              setShowSaveDraft(true);
            }}
          />
          <button
            className="btn-reset"
            onClick={resetToStart}
            title="작업 초기화 — 현재 프로젝트 데이터를 지우고 처음부터 (저장된 내 프로젝트·로그인은 유지)"
          >
            <RotateCcw size={16} /> 작업 초기화
          </button>
          <button
            className="btn-demo"
            onClick={() => openPackageHub()}
            title="패키지 워크벤치"
          >
            <LayoutDashboard size={16} /> 워크벤치
          </button>
          <button
            className="btn-demo"
            onClick={() => openCurriculumTab()}
            title="교육 커리큘럼"
          >
            <GraduationCap size={16} /> 교육과정
          </button>
          <button
            className="btn-demo"
            onClick={() => openLearningTab()}
            title="기본 통계 학습관"
          >
            <Lightbulb size={16} /> 학습관
          </button>
          <button
            className="btn-demo"
            onClick={() => openManualsTab()}
            title="도구 사용설명서"
          >
            <BookOpen size={16} /> 설명서
          </button>
          <button
            className="btn-demo"
            onClick={() => openAiSettingsTab()}
            title="AI 조언 API 설정"
          >
            <Sparkles size={16} /> AI 설정
          </button>
          <button
            className="btn-demo"
            onClick={loadDemoProject}
            title="가상 데모 프로젝트 전체 데이터 불러오기"
          >
            <FlaskConical size={16} /> 데모 불러오기
          </button>
          <div className="project-info">
            {isPracticeMode && (
              <span style={{
                display: 'inline-block', marginRight: 8, fontSize: '0.72rem', fontWeight: 800,
                color: '#92400e', background: '#fef3c7', border: '1px solid #fcd34d',
                borderRadius: 999, padding: '0.15rem 0.55rem', verticalAlign: 'middle'
              }}>
                교육실습
              </span>
            )}
            {methodology ? `${methodology.toUpperCase()} | ` : ''}
            {data.define.projectTitle || (isPracticeMode ? '교육 실습 프로젝트' : '신규 프로젝트')}
            {currentProjectId && session && !isPracticeMode ? ' · 저장됨' : ''}
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
              <button
                className="btn-report"
                onClick={() => setShowReport(true)}
                title="A3 보고서 보기"
              >
                <TrendingUp size={18} /> A3 보고서
              </button>
            </>
          )}
        </div>
      </header>

      {authModal && (
        <AuthModal
          mode={authModal}
          onClose={() => setAuthModal(null)}
          onSuccess={(s) => setSession(s)}
        />
      )}
      {showSaveDraft && (
        <SaveDraftModal
          defaultTitle={data.define?.projectTitle || ''}
          isUpdate={!!currentProjectId}
          onClose={() => setShowSaveDraft(false)}
          onSave={handleSaveDraft}
        />
      )}
      {showMyProjects && session && (
        <MyProjectsModal
          userId={session.userId}
          session={session}
          currentProjectId={currentProjectId}
          onClose={() => setShowMyProjects(false)}
          onOpen={handleOpenUserProject}
          onDeleted={(id) => {
            if (id === currentProjectId) setCurrentProjectIdState(null);
          }}
        />
      )}

      {manualModalId && (
        <ManualModal
          toolId={manualModalId}
          onClose={() => setManualModalId(null)}
          onGoToBrowser={(id) => openManualsTab(id)}
        />
      )}

      <main className="app-main">

        <nav className="step-nav">
          <div className="nav-brand">
            <span className="nav-brand-label">{isPracticeMode ? '교육 실습' : '프로젝트 진행'}</span>
            <span className="nav-brand-method">
              {methodology ? methodology.toUpperCase() : '시작 설정'}
            </span>
          </div>

          <div className="nav-section">
            <div className="nav-section-title">설정</div>
            {SETUP_STEPS.map((step) => {
              const setupPhase = getSetupPhase();
              const isActive = setupPhase === step.id;
              const isCompleted = isSetupStepCompleted(step.id);
              const isReachable = isSetupStepReachable(step.id);

              return (
                <button
                  key={step.id}
                  className={`step-item ${isActive ? 'active' : ''} ${isCompleted && !isActive ? 'completed' : ''} ${!isReachable ? 'disabled' : ''}`}
                  onClick={() => isReachable && navigateToSetup(step.id)}
                  disabled={!isReachable}
                  title={!isReachable ? '이전 단계를 먼저 완료하세요' : step.desc}
                >
                  <div
                    className="icon-box"
                    style={{
                      backgroundColor: isActive
                        ? step.color
                        : isCompleted
                          ? '#10b981'
                          : '#e2e8f0'
                    }}
                  >
                    {isCompleted && !isActive
                      ? <CheckCircle size={20} color="white" />
                      : <step.icon size={20} color={isActive ? 'white' : '#64748b'} />}
                  </div>
                  <div className="step-text">
                    <span className="step-name">{step.name}</span>
                    <span className="step-desc">{step.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="nav-section">
            <div className="nav-section-title">
              {methodology === 'dfss' ? 'DFSS 단계' : 'DMAIC 단계'}
            </div>
            {steps.map((step) => {
              const isActive = !!methodology && activeStep === step.id && !selectionSubView && !showManuals && !showAiSettings && !showLearning && !showPackageHub && !showCurriculum;
              const stepIndex = steps.findIndex(s => s.id === step.id);
              const activeIndex = steps.findIndex(s => s.id === activeStep);
              const isCompleted = isPhaseStepCompleted(step.id, stepIndex, activeIndex);

              return (
                <button
                  key={step.id}
                  className={`step-item ${isActive ? 'active' : ''} ${isCompleted && !isActive ? 'completed' : ''} ${!methodology ? 'disabled' : ''}`}
                  onClick={() => {
                    if (!methodology) return;
                    tryGoToStep(step.id);
                  }}
                  disabled={!methodology}
                  title={!methodology ? '방법론 선택 후 이용 가능' : step.desc}
                >
                  <div
                    className="icon-box"
                    style={{
                      backgroundColor: isActive
                        ? step.color
                        : isCompleted
                          ? '#10b981'
                          : '#e2e8f0'
                    }}
                  >
                    {isCompleted && !isActive
                      ? <CheckCircle size={20} color="white" />
                      : <step.icon size={20} color={isActive ? 'white' : '#64748b'} />}
                  </div>
                  <div className="step-text">
                    <span className="step-name">{step.name}</span>
                    <span className="step-desc">{step.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="nav-section">
            <div className="nav-section-title">교육 · 도움말</div>
            <button
              className={`step-item ${showCurriculum ? 'active' : ''}`}
              onClick={() => openCurriculumTab()}
              title="교육 커리큘럼"
            >
              <div
                className="icon-box"
                style={{ backgroundColor: showCurriculum ? '#0f766e' : '#e2e8f0' }}
              >
                <GraduationCap size={20} color={showCurriculum ? 'white' : '#64748b'} />
              </div>
              <div className="step-text">
                <span className="step-name">교육 과정</span>
                <span className="step-desc">기초 · YB · GB · 통계</span>
              </div>
            </button>
            <button
              className={`step-item ${showPackageHub ? 'active' : ''}`}
              onClick={() => openPackageHub()}
              title="스토리라인 · 검증 · 샘플 · 협업"
            >
              <div
                className="icon-box"
                style={{ backgroundColor: showPackageHub ? '#1e40af' : '#e2e8f0' }}
              >
                <LayoutDashboard size={20} color={showPackageHub ? 'white' : '#64748b'} />
              </div>
              <div className="step-text">
                <span className="step-name">패키지 워크벤치</span>
                <span className="step-desc">요약·검증·샘플·협업</span>
              </div>
            </button>
            <button
              className={`step-item ${showLearning ? 'active' : ''}`}
              onClick={() => openLearningTab()}
              title="기본 통계 학습관"
            >
              <div
                className="icon-box"
                style={{ backgroundColor: showLearning ? '#0f766e' : '#e2e8f0' }}
              >
                <Lightbulb size={20} color={showLearning ? 'white' : '#64748b'} />
              </div>
              <div className="step-text">
                <span className="step-name">통계 학습관</span>
                <span className="step-desc">기초 통계 · 퀴즈</span>
              </div>
            </button>
            <button
              className={`step-item ${showManuals ? 'active' : ''}`}
              onClick={() => openManualsTab()}
              title="도구 사용설명서"
            >
              <div
                className="icon-box"
                style={{ backgroundColor: showManuals ? '#0369a1' : '#e2e8f0' }}
              >
                <BookOpen size={20} color={showManuals ? 'white' : '#64748b'} />
              </div>
              <div className="step-text">
                <span className="step-name">사용설명서</span>
                <span className="step-desc">도구별 가이드</span>
              </div>
            </button>
            <button
              className={`step-item ${showAiSettings ? 'active' : ''}`}
              onClick={() => openAiSettingsTab()}
              title="AI 조언 API 설정"
            >
              <div
                className="icon-box"
                style={{ backgroundColor: showAiSettings ? '#7c3aed' : '#e2e8f0' }}
              >
                <Sparkles size={20} color={showAiSettings ? 'white' : '#64748b'} />
              </div>
              <div className="step-text">
                <span className="step-name">AI 조언 설정</span>
                <span className="step-desc">API 키 · 해석 보강</span>
              </div>
            </button>
          </div>
        </nav>

        <section className="content-area">
          {isPracticeMode && (
            <div className="practice-mode-banner" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '0.75rem',
              flexWrap: 'wrap',
              padding: '0.65rem 1rem',
              marginBottom: '0.75rem',
              background: 'linear-gradient(90deg, #fffbeb 0%, #fef3c7 100%)',
              border: '1px solid #f59e0b',
              borderRadius: 10,
              color: '#92400e',
              fontSize: '0.86rem',
              lineHeight: 1.45
            }}>
              <div>
                <strong>교육 실습 모드</strong>
                <span style={{ marginLeft: 6 }}>
                  — 작성 내용은 실습용이며 본 프로젝트와 분리됩니다.
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.7rem', borderColor: '#f59e0b' }}
                  onClick={() => openCurriculumTab()}
                >
                  교육과정으로
                </button>
                <button
                  type="button"
                  className="btn-secondary"
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.7rem', borderColor: '#f59e0b' }}
                  onClick={resetPracticeSandbox}
                >
                  실습 초기화
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ fontSize: '0.8rem', padding: '0.35rem 0.7rem', background: '#b45309' }}
                  onClick={exitPracticeMode}
                >
                  본 프로젝트로
                </button>
              </div>
            </div>
          )}
          <div className={`card container-card${(activeStep === 'measure' || showManuals || showAiSettings || showLearning || showPackageHub || showCurriculum) ? ' container-card-wide' : ''}`}>
            {canGoBackView && (
              <div className="page-back-bar" style={{
                display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
                marginBottom: '0.85rem', paddingBottom: '0.75rem',
                borderBottom: '1px solid #e2e8f0'
              }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={goBackView}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: '0.88rem', padding: '0.45rem 0.85rem'
                  }}
                >
                  <ChevronLeft size={16} />
                  {backButtonLabel}으로
                </button>
                {navHistory.length > 1 && (
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                    이전 {navHistory.length}단계
                  </span>
                )}
              </div>
            )}
            <AnimatePresence mode="wait">
              <motion.div
                key={showCurriculum ? 'curriculum' : showPackageHub ? 'package-hub' : showLearning ? 'learning' : showAiSettings ? 'ai-settings' : showManuals ? 'manuals' : (methodology ? activeStep : 'selection')}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%', minHeight: 0, display: 'flex', flexDirection: 'column', flex: '1 1 auto' }}
              >
                {showCurriculum ? (
                  <EducationCurriculum
                    hasMethodology={!!methodology}
                    isPracticeMode={isPracticeMode}
                    onOpenLearning={() => openLearningTab()}
                    onOpenManuals={() => openManualsTab()}
                    onNavigate={handleCurriculumNavigate}
                    onEnterPractice={() => enterPracticeMode({ phase: 'define' })}
                    onExitPractice={exitPracticeMode}
                  />
                ) : showPackageHub ? (
                  <PackageHub
                    data={data}
                    methodology={methodology}
                    completedTools={completedTools}
                    industryId={selectedIndustry}
                    industryName={sigmaData?.industries?.find(i => i.id === selectedIndustry)?.name_ko || sigmaData?.industries?.find(i => i.id === selectedIndustry)?.name || ''}
                    session={session}
                    projectId={currentProjectId}
                    activeStep={activeStep}
                    snapshot={buildProjectSnapshot(data.define?.projectTitle)}
                    onApplySample={applySamplePack}
                    onImportShare={importSharedProject}
                  />
                ) : showLearning ? (
                  <StatsLearningBrowser
                    focusId={learningFocusId}
                    onFocusConsumed={() => setLearningFocusId(null)}
                    onOpenTool={(phase, toolId) => {
                      enterPracticeMode({
                        phase,
                        toolId,
                        projectTitle: '[교육실습] 통계 연계 실습'
                      });
                    }}
                  />
                ) : showAiSettings ? (
                  <div style={{ padding: '0.5rem 0 1.5rem', maxWidth: 640 }}>
                    <h2 style={{ margin: '0 0 0.35rem', color: '#0f172a' }}>AI 조언 · API 설정</h2>
                    <p style={{ margin: '0 0 1.25rem', color: '#64748b', fontSize: '0.95rem', lineHeight: 1.55 }}>
                      각 통계 도구 결과에는 <b>규칙 기반 해석과 대응방안</b>이 자동으로 붙습니다.
                      아래에 API 키를 저장하면 「AI 심화 조언」에서 같은 결과를 문장형으로 보강할 수 있습니다.
                    </p>
                    <div className="ai-settings-panel">
                      <AiSettingsForm />
                    </div>
                  </div>
                ) : showManuals ? (
                  <ManualsBrowser
                    focusId={manualFocusId}
                    onFocusConsumed={() => setManualFocusId(null)}
                    onOpenTool={(phase, toolId) => {
                      enterPracticeMode({
                        phase,
                        toolId,
                        projectTitle: '[교육실습] 도구 실습'
                      });
                    }}
                  />
                ) : (
                  renderContent()
                )}
              </motion.div>
            </AnimatePresence>
            {methodology && activeStep !== 'selection' && !showManuals && !showAiSettings && !showLearning && !showPackageHub && !showCurriculum && (
              <div className="action-footer">
                {(() => {
                  const currentIndex = steps.findIndex(s => s.id === activeStep);
                  const prevStep = currentIndex > 0 ? steps[currentIndex - 1] : null;
                  const missing = getMissingGateTools(activeStep, completedTools);
                  return (
                    <>
                      {prevStep ? (
                        <button
                          type="button"
                          className="btn-secondary"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: 6, marginRight: '0.5rem' }}
                          onClick={() => tryGoToStep(prevStep.id)}
                        >
                          <ChevronLeft size={18} /> 이전 단계
                        </button>
                      ) : null}
                      {missing.length > 0 ? (
                        <div style={{
                          flex: 1, textAlign: 'left', fontSize: '0.85rem', color: '#b45309',
                          background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 8,
                          padding: '0.55rem 0.85rem', marginRight: '0.75rem'
                        }}>
                          필수 미완료: {formatMissingTools(missing)}
                        </div>
                      ) : (
                        <div style={{ flex: 1 }} />
                      )}
                      <button className="btn btn-primary" onClick={() => {
                        if (currentIndex < steps.length - 1) {
                          tryGoToStep(steps[currentIndex + 1].id);
                        }
                      }}>
                        다음 단계로 <ArrowRight size={18} />
                      </button>
                    </>
                  );
                })()}
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
              className="no-print"
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
            <div className="no-print" style={{ textAlign: 'right', marginBottom: '1rem', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary"
                onClick={() => window.print()}
                style={{ padding: '0.75rem 2rem', fontSize: '1.1rem', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' }}
              >
                인쇄 / PDF 저장
              </button>
              <span style={{ alignSelf: 'center', fontSize: '0.85rem', color: '#cbd5e1' }}>
                인쇄 대화상자에서 「PDF로 저장」을 선택하세요
              </span>
            </div>

            <div className="a3-print-root">
              <A3Report data={data} methodology={methodology} />
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
}

export default App;
