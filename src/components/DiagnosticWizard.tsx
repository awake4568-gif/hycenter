/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { DiagnosticInput, DiagnosticLead } from '../types';
import { getIndustryLabel, getYearsLabel, getRevenueLabel, evaluatePolicyFunding } from '../utils';
import { 
  CheckCircle2, 
  ShieldCheck, 
  LineChart, 
  Activity, 
  ChevronRight, 
  Clock, 
  FileCheck2, 
  Building2, 
  UserCheck 
} from 'lucide-react';

interface DiagnosticWizardProps {
  input: DiagnosticInput;
  onClose: () => void;
}

export default function DiagnosticWizard({ input, onClose }: DiagnosticWizardProps) {
  const [step, setStep] = useState<'analyzing' | 'completed'>('analyzing');
  const [analysisPhase, setAnalysisPhase] = useState(0);
  const [progress, setProgress] = useState(0);
  const [matchedResults, setMatchedResults] = useState<{ score: number; potentialFunds: string[] }>({ score: 0, potentialFunds: [] });

  const analysisKeywords = [
    { title: '기초 데이터 수집 완료', desc: '대표자명, 연락처 및 세부 업종 항목 로딩 완료' },
    { title: '기관별 적격성 매칭 분석', desc: '중소벤처기업진흥공단, 기술보증기금, 신용보증기금 가이드라인 매칭 중' },
    { title: '정량 조건 가필터링 단계', desc: '업력 단계 및 매출액 구간별 최적 융자한도 산출 필터작동' },
    { title: '예산 소진 상태 시뮬레이션', desc: '당해년도 2분기 기준 잔여 정책 자금 추정 매칭 알고리즘 가동' },
    { title: '결과값 생성 완료', desc: '기초 등급 매칭 완료 및 심층 분석 리포트 매칭 대기' }
  ];

  useEffect(() => {
    // Math matching early
    const results = evaluatePolicyFunding(input);
    setMatchedResults(results);

    // Dynamic progress bar loader
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setStep('completed');
          }, 400);
          return 100;
        }
        return prev + 1.25;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [input]);

  // Sync analysis phase transitions with progress bar range
  useEffect(() => {
    if (progress < 25) {
      setAnalysisPhase(0);
    } else if (progress < 50) {
      setAnalysisPhase(1);
    } else if (progress < 75) {
      setAnalysisPhase(2);
    } else if (progress < 95) {
      setAnalysisPhase(3);
    } else {
      setAnalysisPhase(4);
    }
  }, [progress]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md" id="diagnostic-wizard-popup">
      <AnimatePresence mode="wait">
        {step === 'analyzing' ? (
          <motion.div
            key="analyzing"
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-100 text-center font-sans"
          >
            {/* Visual Pulse Wave */}
            <div className="relative w-16 h-16 mx-auto mb-5 flex items-center justify-center bg-slate-100 rounded-full">
              <span className="absolute animate-ping inline-flex h-12 w-12 rounded-full bg-slate-900/10 opacity-75"></span>
              <Activity className="w-6 h-6 text-slate-800" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 tracking-tight">정책자금 최적 가조합 분석</h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">정부 산하 다분야 자금 규제 기준 대조 작업 진행 중</p>

            {/* Simulated Progress bar */}
            <div className="mt-6">
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <motion.div 
                  className="bg-slate-950 h-full rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono mt-1.5">
                <span>SYSTEM SCANNING</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>

            {/* Stepper Phase Feedback */}
            <div className="mt-6 border-t border-slate-100 pt-5 text-left space-y-4">
              {analysisKeywords.map((phase, idx) => {
                const isActive = analysisPhase === idx;
                const isPassed = analysisPhase > idx;
                return (
                  <div key={idx} className="flex gap-3 text-xs transition-opacity duration-300">
                    <div className="mt-0.5">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : isActive ? (
                        <div className="w-4 h-4 rounded-full border border-slate-800 border-t-transparent animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-200" />
                      )}
                    </div>
                    <div className={isActive ? 'opacity-100' : isPassed ? 'opacity-60' : 'opacity-30'}>
                      <span className="font-semibold text-slate-800 block leading-none">{phase.title}</span>
                      <span className="text-[10px] text-slate-500 mt-0.5 block">{phase.desc}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.96, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-lg bg-white rounded-2xl p-7 shadow-2xl border border-slate-200 font-sans"
          >
            {/* Visual Header Badge */}
            <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-700 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-medium">Auto-filtering System</p>
                <h4 className="text-base font-bold text-slate-900 tracking-tight leading-tight">신청이 정상적으로 접수되었습니다.</h4>
              </div>
            </div>

            {/* Diagnosis Core Info */}
            <div className="space-y-4 mb-6">
              <div>
                <span className="block text-xs font-semibold text-slate-400 mb-2">기업 기초 검토 제표</span>
                <div className="grid grid-cols-3 gap-2 bg-slate-50/75 border border-slate-200/80 p-3 rounded-xl text-center select-none">
                  <div>
                    <span className="block text-[10px] text-slate-400">신청 업종</span>
                    <span className="font-semibold text-slate-800 text-xs mt-0.5 block">{getIndustryLabel(input.industry)}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400">설립 업력</span>
                    <span className="font-semibold text-slate-800 text-xs mt-0.5 block">{getYearsLabel(input.businessYears)}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-400">연 매출 규모</span>
                    <span className="font-semibold text-slate-800 text-xs mt-0.5 block">{getRevenueLabel(input.revenue)}</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Score and Matcher results */}
              <div>
                <span className="block text-xs font-semibold text-slate-400 mb-1.5">예상 지원 가능 분야 분석 결과</span>
                <div className="bg-slate-900 text-white rounded-xl p-4 relative overflow-hidden">
                  
                  {/* Decorative faint grid lines */}
                  <div className="absolute inset-0 opacity-5 pointer-events-none">
                    <div className="w-full h-full bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:14px_24px]" />
                  </div>

                  <div className="flex items-center justify-between relative z-10">
                    <div>
                      <p className="text-[10px] text-slate-300 font-medium">대표 조건 매칭 가적정 등급</p>
                      <h5 className="text-2xl font-bold mt-1 font-mono text-blue-400">약 {matchedResults.score}% <span className="text-xs font-normal text-white">매치 검토군</span></h5>
                    </div>
                    <div className="bg-white/10 px-2.5 py-1.5 rounded-lg text-right font-mono">
                      <span className="block text-[8px] text-slate-300">CONFIDENCE LEVEL</span>
                      <span className="text-[10px] text-emerald-300 font-semibold">HIGH PROBABILITY</span>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="mt-4 border-t border-white/10 pt-3 space-y-2 relative z-10 text-xs">
                    <span className="text-[10px] text-blue-200 block font-medium">1차 추천 가능 자금 매칭군 ({matchedResults.potentialFunds.length}개):</span>
                    <div className="space-y-1.5 text-slate-200 text-[11px]">
                      {matchedResults.potentialFunds.map((fund, idx) => (
                        <div key={idx} className="flex gap-2 items-center leading-normal bg-white/5 px-2 py-1.5 rounded border border-white/5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{fund}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Statement */}
              <div className="bg-blue-50 border border-blue-100 text-slate-900 p-4 rounded-xl text-xs space-y-2 leading-relaxed">
                <div className="flex gap-2 items-center font-bold text-blue-900 mb-1">
                  <UserCheck className="w-4 h-4 text-blue-700" />
                  <span>컨설턴트 안심 검토 대기 중</span>
                </div>
                <p className="font-semibold select-text">
                  현재 기재해주신 기초 데이터를 기반으로 <strong>'예상 지원 자금 분석 및 필터링'</strong> 단계가 진행 중입니다.
                </p>
                <p className="text-slate-600">
                  보다 면밀한 분석과 매칭을 위해 담당 전문 컨설턴트가 검토 후 영업일 기준 1~2일 내로 연락을 드릴 예정입니다. 신뢰할 수 있는 기초 진단을 약속드립니다. 잠시만 기다려 주십시오. 감사합니다.
                </p>
              </div>
            </div>

            {/* Footer triggers */}
            <button
              onClick={onClose}
              className="w-full text-center py-3 bg-slate-900 hover:bg-slate-950 text-white rounded-xl text-sm font-semibold shadow-md transition-all cursor-pointer font-sans"
              id="confirm-close-btn"
            >
              확인 및 자가진단 닫기
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
