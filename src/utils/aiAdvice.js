/**
 * 선택적 AI 조언 (OpenAI 호환 Chat Completions)
 * API 키는 브라우저 localStorage에만 저장 (서버로 전송하지 않음 — 사용자가 지정한 endpoint로만 호출)
 */

const KEY_STORAGE = 'sigma_ai_api_key';
const BASE_STORAGE = 'sigma_ai_base_url';
const MODEL_STORAGE = 'sigma_ai_model';

export function getAiSettings() {
  return {
    apiKey: localStorage.getItem(KEY_STORAGE) || '',
    baseUrl: localStorage.getItem(BASE_STORAGE) || 'https://api.openai.com/v1',
    model: localStorage.getItem(MODEL_STORAGE) || 'gpt-4o-mini'
  };
}

export function saveAiSettings({ apiKey, baseUrl, model }) {
  if (apiKey != null) {
    if (apiKey.trim()) localStorage.setItem(KEY_STORAGE, apiKey.trim());
    else localStorage.removeItem(KEY_STORAGE);
  }
  if (baseUrl != null) localStorage.setItem(BASE_STORAGE, (baseUrl || 'https://api.openai.com/v1').replace(/\/$/, ''));
  if (model != null) localStorage.setItem(MODEL_STORAGE, model || 'gpt-4o-mini');
}

export function clearAiApiKey() {
  localStorage.removeItem(KEY_STORAGE);
}

/**
 * @param {{ toolLabel: string, insight: object, result: object, context?: string }} opts
 */
export async function fetchAiAdvice({ toolLabel, insight, result, context = '' }) {
  const { apiKey, baseUrl, model } = getAiSettings();
  if (!apiKey) {
    throw new Error('API 키가 없습니다. 설정에서 OpenAI(또는 호환) API 키를 입력하세요.');
  }

  // 결과에서 함수 등 직제화 불가 필드 제거
  const safeResult = JSON.parse(JSON.stringify(result, (_, v) => (typeof v === 'function' ? undefined : v)));

  const system = `당신은 Six Sigma(DMAIC) 실무 코치입니다.
한국어로 간결하게 답하세요.
구조:
1) 한줄 요약
2) 결과 해석 (3문장 이내)
3) 즉시 대응방안 (불릿 3~5개, 실행 가능)
4) 주의/한계 (1~2문장)
과장하지 말고, p-value만으로 인과를 단정하지 마세요.
통계 용어는 쓰되 현장 엔지니어가 이해하게 설명하세요.`;

  const user = `도구: ${toolLabel}
프로젝트 맥락: ${context || '(없음)'}
규칙기반 요약: ${insight.summary}
규칙기반 해석: ${(insight.interpretation || []).join(' / ')}
규칙기반 조언: ${(insight.actions || []).join(' / ')}
원본 결과 JSON: ${JSON.stringify(safeResult).slice(0, 4000)}

위 분석을 바탕으로 조언과 대응방안을 제시하세요.`;

  const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user }
      ]
    })
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    let msg = `AI API 오류 (${res.status})`;
    try {
      const j = JSON.parse(errText);
      msg = j.error?.message || j.message || msg;
    } catch {
      if (errText) msg += `: ${errText.slice(0, 200)}`;
    }
    throw new Error(msg);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('AI 응답이 비어 있습니다.');
  return text;
}

const CHARTER_DRAFT_PROMPTS = {
  business: {
    system: `당신은 Six Sigma 프로젝트 헌장을 지도하는 Master Black Belt입니다.
사용자가 브레인스토밍으로 입력한 단어를 근거 없는 사실로 확정하지 말고, 관계를 합리적으로 정리해 한국어 비즈니스 케이스 초안을 작성하세요.

작성 원칙:
- 3개 문단, 총 350~600자
- 1문단: 배경·현재 문제·영향받는 고객
- 2문단: 사업 영향·방치 리스크·추정 원인(검증 필요 표현)
- 3문단: 개선 기회·전략적 필요성·기대 가치
- 해결책을 미리 단정하지 말고, 목표 수치를 지어내지 마세요.
- 입력에 없는 수치는 "[확인 필요]"로 표시하세요.
- DFSS라면 VOC→CTQ→설계 검증 필요성을 반영하세요.
- 제목, 번호, 불릿, 해설 없이 본문만 출력하세요.`,
    task: '경영진과 프로젝트 승인자가 이해할 수 있는 비즈니스 케이스 초안을 작성하세요.'
  },
  problem: {
    system: `당신은 Six Sigma 프로젝트 헌장의 문제기술서(Problem Statement)를 지도하는 Master Black Belt입니다.
키워드와 5W2H·Is/Is Not 정보를 바탕으로 데이터 중심의 문제기술서 초안을 한국어로 작성하세요.

작성 원칙:
- 2~3개 문단, 총 250~450자
- 언제/어디서/무엇이/현재 수준을 명확히
- Is와 Is Not으로 범위를 구분
- 원인은 "추정/가설"로만 언급하고 단정하지 마세요
- 해결책·목표 수치를 지어내지 마세요
- 입력에 없는 수치는 "[확인 필요]"
- 제목, 번호, 불릿, 해설 없이 본문만 출력하세요.`,
    task: '데이터 기반 문제기술서 초안을 작성하세요.'
  },
  goal: {
    system: `당신은 Six Sigma 프로젝트 헌장의 목표기술서(Goal Statement)를 지도하는 Master Black Belt입니다.
키워드와 SMART 정보를 바탕으로 측정 가능한 목표기술서 초안을 한국어로 작성하세요.

작성 원칙:
- 2~3개 문단, 총 200~400자
- Baseline → Target → Deadline 구조를 포함
- SMART(구체·측정·달성가능·관련·기한)를 반영
- 입력에 없는 수치는 "[확인 필요]"로 표시하고 지어내지 마세요
- DFSS라면 CTQ 스펙·파일럿 검증을 자연스럽게 포함
- 제목, 번호, 불릿, 해설 없이 본문만 출력하세요.`,
    task: 'SMART 기준의 목표기술서 초안을 작성하세요.'
  }
};

/**
 * 헌장 필드(비즈니스케이스/문제기술서/목표기술서) 초안을 AI로 다듬습니다.
 */
export async function fetchCharterFieldDraft({
  mode = 'business',
  keywords,
  groups,
  fiveW2h,
  valueLevers,
  causalChain,
  isIsNot,
  smart,
  projectTitle,
  industryName,
  methodology,
  relatedContext = ''
}) {
  const { apiKey, baseUrl, model } = getAiSettings();
  if (!apiKey) {
    throw new Error('API 키가 없습니다. AI 설정에서 OpenAI(또는 호환) API 키를 입력하세요.');
  }

  const prompt = CHARTER_DRAFT_PROMPTS[mode] || CHARTER_DRAFT_PROMPTS.business;

  const user = `프로젝트명: ${projectTitle || '(미정)'}
업종: ${industryName || '(미정)'}
방법론: ${methodology || '(미정)'}
원본 키워드: ${(keywords || []).join(', ')}
그룹핑: ${JSON.stringify(groups || {})}
5W2H 보완정보: ${JSON.stringify(fiveW2h || {})}
가치 레버: ${(valueLevers || []).join(', ')}
추정 인과사슬: ${JSON.stringify(causalChain || {})}
Is/Is Not: ${JSON.stringify(isIsNot || {})}
SMART 입력: ${JSON.stringify(smart || {})}
관련 헌장 맥락: ${relatedContext || '(없음)'}

${prompt.task}`;

  const url = `${baseUrl.replace(/\/$/, '')}/chat/completions`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      messages: [
        { role: 'system', content: prompt.system },
        { role: 'user', content: user }
      ]
    })
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    let msg = `AI API 오류 (${res.status})`;
    try {
      const json = JSON.parse(errText);
      msg = json.error?.message || json.message || msg;
    } catch {
      if (errText) msg += `: ${errText.slice(0, 200)}`;
    }
    throw new Error(msg);
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content?.trim();
  if (!text) throw new Error('AI 응답이 비어 있습니다.');
  return text;
}

/** @deprecated fetchCharterFieldDraft 사용 권장 */
export async function fetchBusinessCaseDraft(opts) {
  return fetchCharterFieldDraft({ ...opts, mode: 'business' });
}
