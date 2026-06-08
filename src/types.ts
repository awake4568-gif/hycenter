/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DiagnosticInput {
  name: string;
  phone: string;
  companyName: string;
  industry: '제조' | '도소매' | '서비스' | 'IT_정보통신' | '기타' | '';
  businessYears: 'less_than_1y' | '1y_to_3y' | '3y_to_7y' | 'more_than_7y' | '';
  revenue: 'less_than_100m' | '100m_to_500m' | '500m_to_1b' | 'more_than_1b' | '';
  message: string;
  privacyConsent: boolean;
}

export interface DiagnosticLead extends DiagnosticInput {
  id: string;
  submittedAt: string;
  score: number;
  potentialFunds: string[];
  status: 'pending' | 'reviewing' | 'completed';
  adminMemo: string;
}

export type IndustryType = '제조' | '도소매' | '서비스' | 'IT·정보통신' | '기타';
export type BusinessYearsType = '1년 미만' | '1년 이상 ~ 3년 미만' | '3년 이상 ~ 7년 미만' | '7년 이상';
export type RevenueType = '1억 미만' | '1억 ~ 5억' | '5억 ~ 10억' | '10억 이상';
