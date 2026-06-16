/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DiagnosticInput, DiagnosticLead } from './types';

// Helper to convert technical codes to Korean human-readable labels
export function getIndustryLabel(code: string): string {
  switch (code) {
    case '제조': return '제조업';
    case '도소매': return '도소매업';
    case '서비스': return '서비스업';
    case 'IT_정보통신': return 'IT·정보통신업';
    case '기타': return '기타 업종';
    default: return code || '미정';
  }
}

export function getYearsLabel(code: string): string {
  switch (code) {
    case 'less_than_1y': return '1년 미만';
    case '1y_to_3y': return '1년 이상 ~ 3년 미만';
    case '3y_to_7y': return '3년 이상 ~ 7년 미만';
    case 'more_than_7y': return '7년 이상';
    default: return code || '미정';
  }
}

export function getRevenueLabel(code: string): string {
  switch (code) {
    case 'less_than_100m': return '1억 원 미만';
    case '100m_to_500m': return '1억 원 이상 ~ 5억 원 미만';
    case '500m_to_1b': return '5억 원 이상 ~ 10억 원 미만';
    case 'more_than_1b': return '10억 원 이상';
    default: return code || '미정';
  }
}

// Logic to calculate a realistic score and matched policy funds for the user
export function evaluatePolicyFunding(input: DiagnosticInput): { score: number; potentialFunds: string[] } {
  let score = 65; // Baseline trust score
  const funds: string[] = [];

  // 1. Analyze Industry
  if (input.industry === '제조') {
    score += 15;
    funds.push('기계 및 스마트 설비 도입 시설자금', '원자재 구입 운전자금 및 시설보증');
  } else if (input.industry === 'IT_정보통신') {
    score += 12;
    funds.push('연구개발(R&D) 기획 혁신기술자금', '지식재산권(IP) 담보부 특별보증');
  } else if (input.industry === '서비스') {
    score += 5;
    funds.push('소상공인시장진흥공단 소상공인특화자금');
  } else if (input.industry === '도소매') {
    score += 3;
    funds.push('수출입 및 글로벌 유통망 개척 운전자금');
  } else {
    funds.push('지역 경기 활성화 상생운전자금');
  }

  // 2. Analyze Business Years
  if (input.businessYears === 'less_than_1y') {
    score += 5;
    funds.push('초기 창업자 맞춤형 창업기업지원자금', '청년전용 창업자금 특별 우대적용');
  } else if (input.businessYears === '1y_to_3y') {
    score += 10;
    funds.push('창업도약패키지 연계 사업화자금');
  } else if (input.businessYears === '3y_to_7y') {
    score += 8;
    funds.push('중소벤처기업진흥공단 혁신성장형 정책자금');
  } else if (input.businessYears === 'more_than_7y') {
    // 7+ years usually focuses on scaleup, overseas, or facilities
    score += 2;
    funds.push('스케일업 경쟁력 강화 특별자금 및 장기저리 융자');
  }

  // 3. Analyze Revenue Scale
  if (input.revenue === 'less_than_100m') {
    funds.push('소규모 영세 임차료 및 미소금융 특별 특별보증');
  } else if (input.revenue === '100m_to_500m') {
    score += 8;
    funds.push('지역 신용보증재단 연계 시중은행 이차보전 대출');
  } else if (input.revenue === '500m_to_1b') {
    score += 12;
    funds.push('기술보증기금(KIBO) 주력산업 일자리매칭자금');
  } else if (input.revenue === 'more_than_1b') {
    score += 15;
    funds.push('신용보증기금(KODIT) 유망 중소기업 맞춤 보증지원');
  }

  // Cap score between 40 and 97
  score = Math.max(40, Math.min(97, score));

  // Remove duplicates and limit to top 3 matching funds to prevent clutter
  const uniqueFunds = Array.from(new Set(funds)).slice(0, 3);

  return {
    score,
    potentialFunds: uniqueFunds,
  };
}

// Simulated Database Storage Manager in browser's local storage
const LOG_PREFIX = '[PolicyFundingDS]';
const STORAGE_KEY = 'policy_funding_leads';

const INITIAL_DEMO_LEADS: DiagnosticLead[] = [
  {
    id: 'demo-lead-1',
    name: '김태호',
    phone: '010-3482-9901',
    companyName: '태호정밀 테크',
    industry: '제조',
    businessYears: '1y_to_3y',
    revenue: '500m_to_1b',
    message: '인건비와 원자재 비용 보조가 가능한 운전자금을 기보나 중진공을 통해 연계받고 싶습니다.',
    privacyConsent: true,
    submittedAt: '2026-06-07 14:32',
    score: 87,
    potentialFunds: ['기계 및 스마트 설비 도입 시설자금', '원자재 구입 운전자금 및 시설보증', '창업도약패키지 연계 사업화자금'],
    status: 'reviewing',
    adminMemo: '6/8 통화 예정. 기술성 평점 검토 필요하며, 기보 보증 연계 가능성이 큼.',
  },
  {
    id: 'demo-lead-2',
    name: '최소연',
    phone: '010-8821-4921',
    companyName: '루나소프트',
    industry: 'IT_정보통신',
    businessYears: 'less_than_1y',
    revenue: 'less_than_100m',
    message: '설립한 지 6개월 된 청년창업 기업입니다. 디자이너 채용용 중진공 청년창업자금 요건에 대해 상세 진단 희망합니다.',
    privacyConsent: true,
    submittedAt: '2026-06-08 09:15',
    score: 82,
    potentialFunds: ['연구개발(R&D) 기획 혁신기술자금', '초기 창업자 맞춤형 창업기업지원자금', '청년전용 창업자금 특별 우대적용'],
    status: 'pending',
    adminMemo: '신규 접수. 청년창업 특별 우대 조건에 정확히 부합함. 메일로 1차 질의 서류 송부 필요.',
  },
  {
    id: 'demo-lead-3',
    name: '박윤배',
    phone: '010-2210-9080',
    companyName: '우리푸드 유통',
    industry: '도소매',
    businessYears: 'more_than_7y',
    revenue: 'more_than_1b',
    message: '창고 이전 비용 일부와 시설 투자를 시중 은행 대출보다 한도가 큰 공공 시설자금으로 찾아보고자 합니다.',
    privacyConsent: true,
    submittedAt: '2026-06-05 17:41',
    score: 82,
    potentialFunds: ['수출입 및 글로벌 유통망 개척 운전자금', '스케일업 경쟁력 강화 특별자금 및 장기저리 융자', '신용보증기금(KODIT) 유망 중소기업 맞춤 보증지원'],
    status: 'completed',
    adminMemo: '상담 완료. 시설자금 5억 매칭 플랜 안내 완료 및 신보 사전심사 리스트 확인 유도함.',
  }
];

export function getStoredLeads(): DiagnosticLead[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_DEMO_LEADS));
      return INITIAL_DEMO_LEADS;
    }
    return JSON.parse(data);
  } catch (error) {
    console.error(`${LOG_PREFIX} Error reading stored leads:`, error);
    return INITIAL_DEMO_LEADS;
  }
}

export function saveLead(input: DiagnosticInput): DiagnosticLead {
  const { score, potentialFunds } = evaluatePolicyFunding(input);
  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  
  const newLead: DiagnosticLead = {
    ...input,
    id: `lead-${Date.now()}`,
    submittedAt: formattedDate,
    score,
    potentialFunds,
    status: 'pending',
    adminMemo: '',
  };

  try {
    const currentList = getStoredLeads();
    const updatedList = [newLead, ...currentList];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    return newLead;
  } catch (error) {
    console.error(`${LOG_PREFIX} Error saving lead:`, error);
    return newLead;
  }
}

export function updateLeadInStorage(updatedLead: DiagnosticLead): void {
  try {
    const currentList = getStoredLeads();
    const updatedList = currentList.map(lead => lead.id === updatedLead.id ? updatedLead : lead);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  } catch (error) {
    console.error(`${LOG_PREFIX} Error updating lead:`, error);
  }
}

export function deleteLeadFromStorage(id: string): void {
  try {
    const currentList = getStoredLeads();
    const updatedList = currentList.filter(lead => lead.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
  } catch (error) {
    console.error(`${LOG_PREFIX} Error deleting lead:`, error);
  }
}

// Meta Pixel Config and Event Tracking
const PIXEL_ID_KEY = 'meta_pixel_id';
const DEFAULT_PIXEL_ID = '921384019481235'; // Default mock/demo Pixel ID
const PIXEL_LOGS_KEY = 'meta_pixel_logs';

export function getStoredMetaPixelId(): string {
  if (typeof window === 'undefined') return '';
  const saved = localStorage.getItem(PIXEL_ID_KEY);
  if (saved === null) {
    // Initialize default ID
    localStorage.setItem(PIXEL_ID_KEY, DEFAULT_PIXEL_ID);
    return DEFAULT_PIXEL_ID;
  }
  return saved;
}

export function setStoredMetaPixelId(pixelId: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PIXEL_ID_KEY, pixelId.trim());
}

export interface PixelLog {
  id: string;
  timestamp: string;
  eventName: string;
  params: any;
}

export function getPixelLogs(): PixelLog[] {
  if (typeof window === 'undefined') return [];
  try {
    const saved = localStorage.getItem(PIXEL_LOGS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function clearPixelLogs(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PIXEL_LOGS_KEY);
}

function addPixelLog(eventName: string, params: any) {
  if (typeof window === 'undefined') return;
  try {
    const logs = getPixelLogs();
    const now = new Date();
    const timestamp = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const newLog: PixelLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp,
      eventName,
      params
    };
    localStorage.setItem(PIXEL_LOGS_KEY, JSON.stringify([newLog, ...logs].slice(0, 30)));
    // Dispatch standard storage event to trigger reactive reload on LeadBoard if open
    window.dispatchEvent(new Event('storage'));
  } catch (e) {
    console.error('[MetaPixel] Log write error:', e);
  }
}

interface FbWindow extends Window {
  fbq?: any;
  _fbq?: any;
}

export function initMetaPixel(): void {
  if (typeof window === 'undefined') return;
  const pixelId = getStoredMetaPixelId();
  if (!pixelId) {
    console.log('[MetaPixel] Empty pixel ID. Loading is deferred.');
    return;
  }

  const w = window as unknown as FbWindow;
  if (!w.fbq) {
    w.fbq = function (...args: any[]) {
      if (w.fbq.callMethod) {
        w.fbq.callMethod(...args);
      } else {
        w.fbq.queue.push(args);
      }
    };
    w.fbq.push = w.fbq;
    w.fbq.loaded = true;
    w.fbq.version = '2.0';
    w.fbq.queue = [];
    
    // Create script element
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://connect.facebook.net/en_US/fbevents.js';
    const firstScript = document.getElementsByTagName('script')[0];
    if (firstScript && firstScript.parentNode) {
      firstScript.parentNode.insertBefore(script, firstScript);
    } else {
      document.head.appendChild(script);
    }
  }

  // Initialize
  try {
    w.fbq('init', pixelId);
    w.fbq('track', 'PageView');
    addPixelLog('PageView', { initializedPixelId: pixelId });
    console.log(`[MetaPixel] Initialized successfully with ID: ${pixelId}`);
  } catch (e) {
    console.error('[MetaPixel] Initialization error:', e);
  }
}

export function trackMetaPixelLead(lead: DiagnosticInput & { score?: number }): void {
  if (typeof window === 'undefined') return;
  const pixelId = getStoredMetaPixelId();
  if (!pixelId) return;

  const w = window as unknown as FbWindow;
  const eventParams = {
    content_name: '비즈케어정책자금 자가진단 신청',
    content_category: lead.industry,
    value: lead.revenue === 'more_than_1b' ? 1000000 : 300000,
    currency: 'KRW',
    predicted_score: lead.score || 85
  };

  // Re-verify initialization if fbq is not present
  if (!w.fbq) {
    initMetaPixel();
  }

  if (w.fbq) {
    try {
      w.fbq('track', 'Lead', eventParams);
      addPixelLog('Lead', { ...eventParams, name: lead.name, companyName: lead.companyName });
      console.log(`[MetaPixel] Tracked 'Lead' event successfully for ${lead.name}`);
    } catch (e) {
      console.error('[MetaPixel] Tracking Lead error:', e);
    }
  } else {
    // Fallback log even if connection fails (e.g. adblocker)
    addPixelLog('Lead (Fired via Proxy)', { ...eventParams, name: lead.name, companyName: lead.companyName, note: 'fbq script was blocked by browser, tracked locally' });
    console.warn('[MetaPixel] fbq window object is not resolved yet, local logs updated.');
  }
}

