/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  PlusCircle, 
  HelpCircle, 
  Settings, 
  ShieldCheck, 
  Users, 
  CheckCircle,
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  DollarSign, 
  Cpu, 
  Award,
  ChevronRight,
  BookOpenCheck
} from 'lucide-react';

/* ==========================================
   1. SECTION 02: 정책자금 지원제도의 이해
   ========================================== */
export function UnderStandingSection() {
  const funds = [
    {
      title: '창업자금 / 청년창업자금',
      tag: '초기성장',
      purpose: '초기 사업 기반 조성 및 안정화 지원',
      desc: '업력 7년 미만의 창업기업을 대상으로 초기 시설 인프라 및 운영 자금을 융자 및 저리로 연계 지원합니다. 특히 만 39세 이하 청년 가산점이 부여됩니다.',
      icon: FlameKindlingIcon
    },
    {
      title: '운전자금 / 경영안정자금',
      tag: '유동성확보',
      purpose: '원자재 구매, 인건비 등 운영 경비 확보',
      desc: '제품 생산이나 마케팅, 재고 확보 등 일상적인 기업 운영에 필요한 단기 운전자금 유통을 보조하여 유동성 정체를 신속히 해소합니다.',
      icon: ScaleCoinsIcon
    },
    {
      title: '시설자금 / 스마트기술 도입자금',
      tag: '인프라투자',
      purpose: '기계 설비 도입, 공장 확보 등 시설 투자',
      desc: '자가 공장 매입, 생산 기계 구입, 스마트 테크 자동화 솔루션 도입 등 규모 증대 및 공정 개선을 위한 장기적 대규모 투자를 저리로 조달하도록 돕습니다.',
      icon: CpuIcon
    },
    {
      title: '혁신성장자금',
      tag: '성장동력',
      purpose: '기술력 및 성장 잠재력을 보유한 기업 육성',
      desc: '원천 기술이나 지식재산권(IP)을 보유하고 있거나 탄탄한 미래 도약 잠재력을 자체 입증할 실마리가 있는 기술 혁신형 우수 벤처 기업을 집중 지원합니다.',
      icon: AwardIcon
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-blue-50/60 via-white to-indigo-50/20 border-b border-slate-200 font-sans" id="section-understanding">
      <div className="max-w-5xl mx-auto px-4">
        
        {/* Core Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <span className="text-xs font-bold text-blue-750 tracking-wider uppercase px-3 py-1 bg-blue-100/70 rounded-full border border-blue-200">SECTION 02</span>
          <h2 className="text-2xl md:text-3.5xl font-extrabold tracking-tight text-slate-900 mt-3">정부가 소상공인과 중소기업을 지원하는 이유</h2>
          <p className="text-sm text-slate-550 mt-3 leading-relaxed">
            정부는 매년 중소기업 육성과 지역 경제 활성화를 위해 상당한 규모의 예산을 편성하여 정책자금을 지원하고 있습니다. 다만, 자금 종류가 다양하고 세부 조건이 매년 변동되어 적절한 시기를 놓치게 됩니다.
          </p>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 mx-auto mt-6 rounded-full" />
        </motion.div>

        <motion.p 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-center text-xs md:text-sm font-semibold text-blue-900 bg-blue-50/80 p-3.5 rounded-xl border border-blue-100 mb-10 max-w-lg mx-auto shadow-xs"
        >
          💡 대표님의 사업 형태와 목적에 맞는 자금을 선별하는 것이 첫걸음입니다.
        </motion.p>

        {/* Funds Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {funds.map((fund, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-85px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ y: -6, scale: 1.012 }}
              className="group p-6 bg-white border border-slate-200/80 rounded-2xl hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-400 hover:bg-slate-50/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <motion.div 
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  whileInView={{ rotate: [0, -5, 5, 0] }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 + 0.2 }}
                  className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:text-white transition-all shadow-xs"
                >
                  <fund.icon className="w-6 h-6" />
                </motion.div>
                <span className="text-[10px] font-bold tracking-wider text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded uppercase font-mono">
                  {fund.tag}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-4 font-sans">{fund.title}</h3>
              <p className="text-xs font-bold text-blue-600 mt-1.5 leading-none">{fund.purpose}</p>
              <p className="text-xs text-slate-550 mt-3.5 leading-relaxed font-sans">{fund.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ==========================================
   2. SECTION 03: 지원 검토 가능 요건 안내
   ========================================== */
export function CriteriaTable() {
  const checkableItems = [
    {
      field: '업력 1년 미만',
      status: '검토 가능',
      desc: '창업 초기 기업 맞춤형 자금 매칭',
      details: '창업 6개월, 1년 미만 소기업이라도 청년창업전용 및 영세소상공인 융자로 초기 자금 확보가 능동적으로 가능합니다.'
    },
    {
      field: '중·저신용 점수',
      status: '검토 가능',
      desc: '담보력이 부족한 기업을 위한 보증 지원 연계',
      details: '담보력이 부족하여 시중 금융권 접근이 어려운 한계를 신용보증재단이나 보증 지원 제도가 우회 매개하여 드립니다.'
    },
    {
      field: '기존 대출 보유',
      status: '검토 가능',
      desc: '부채 비율 및 추가 한도 분석을 통한 접근',
      details: '현재 영위 중인 부채의 비율, 대환 적정성 및 유효 기술성 등급을 분석하여 가용한 잔여 가용한도를 설계합니다.'
    },
    {
      field: '최근 매출 감소',
      status: '검토 가능',
      desc: '일시적 경영 애로 기업 대상 특별 자금 검토',
      details: '경기 성향 변화나 비용 상승으로 한시적인 경영난 여파를 극복할 수 있는 긴급안정자금 및 위기 극복 플랜을 섭렵합니다.'
    },
    {
      field: '개인 및 법인 사업자',
      status: '검토 가능',
      desc: '사업자 유형별 지원 기준 맞춤 적용',
      details: '개인 간이과세부터 일반 법인 사업자까지 규모와 과세 유형의 형태에 따른 부합적 조세 매칭 기준을 선별 적용합니다.'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 via-indigo-50/30 to-blue-50/40 border-b border-slate-200 font-sans" id="section-criteria">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-xl mx-auto mb-10"
        >
          <span className="text-xs font-bold text-indigo-700 tracking-wider uppercase px-3 py-1 bg-indigo-50 rounded-full border border-indigo-100">SECTION 03</span>
          <h2 className="text-2xl md:text-3.5xl font-extrabold tracking-tight text-slate-900 mt-3">지원 검토 가능 요건 안내</h2>
          <p className="text-xs md:text-sm text-slate-500 mt-2.5 leading-relaxed">
            아래 일반 요건에 수반되더라도 체계적인 세부 매치 분석을 통해 지원 가능성을 정교하게 조사해 볼 수 있습니다.
          </p>
        </motion.div>

        {/* Table representation */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl shadow-blue-900/5 hover:border-slate-300 transition-all"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white text-xs uppercase tracking-widest font-bold">
                  <th className="px-6 py-4.5 font-sans">구분 요건</th>
                  <th className="px-4 py-4.5 text-center font-sans">검토 대상 여부</th>
                  <th className="px-6 py-4.5 font-sans text-blue-200">비고 설명</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {checkableItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-blue-50/40 transition-all duration-200">
                    <td className="px-6 py-4.5 font-extrabold text-slate-950 whitespace-nowrap">{item.field}</td>
                    <td className="px-4 py-4.5 text-center">
                      <motion.span 
                        whileHover={{ scale: 1.05 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100/60 text-blue-800 border border-blue-200/50 text-[11px] font-bold rounded-lg shadow-2xs"
                      >
                        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" />
                        {item.status}
                      </motion.span>
                    </td>
                    <td className="px-6 py-4.5 text-slate-650">
                      <p className="font-bold text-slate-800">{item.desc}</p>
                      <p className="text-[10px] text-slate-450 mt-1 leading-relaxed">{item.details}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Accent warning message */}
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[11px] md:text-xs text-slate-600 font-medium leading-relaxed mt-6 bg-gradient-to-r from-blue-50 to-indigo-50/50 border border-blue-100 p-4 border-l-4 border-blue-600 rounded-xl shadow-xs"
        >
          ※ 정확한 분석 결과는 기업의 세부 업종, 매출 구조, 부채 현황, 신용 상태 및 정부 기관의 당해 연도 예산 소진 상황 등에 따라 달라질 수 있으므로 정밀 진단이 필요합니다.
        </motion.p>

      </div>
    </section>
  );
}


/* ==========================================
   3. SECTION 04: 정책자금 분석 프로세스
   ========================================== */
export function ProcessSection() {
  const steps = [
    {
      step: 'STEP 01',
      title: '무료 자격 진단 신청',
      desc: '간단한 기업 기초 정보 작성 (소요 시간 약 1분)'
    },
    {
      step: 'STEP 02',
      title: '기초 데이터 검토',
      desc: '입력된 정보를 바탕으로 현시점 지원 가능한 정책 제도군 기준 1차 분류 및 필터링'
    },
    {
      step: 'STEP 03',
      title: '가능성 분석 및 분류',
      desc: '유관 지원 기관(기보, 신보, 중진공 등) 고유 심사 규칙과 매칭 자격 검토분류'
    },
    {
      step: 'STEP 04',
      title: '맞춤 제안 및 상담',
      desc: '해당 기업 유형에 가장 타당한 자금 형태 제안 및 구체적인 서증 자료 준비 안내'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-50/20 via-slate-50 to-blue-50/45 border-b border-slate-200 font-sans" id="section-process">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-xl mx-auto mb-12"
        >
          <span className="text-xs font-bold text-blue-700 tracking-wider uppercase px-3 py-1 bg-blue-50 rounded-full border border-blue-100">SECTION 04</span>
          <h2 className="text-2xl md:text-3.5xl font-extrabold tracking-tight text-slate-900 mt-3">체계적인 정책자금 분석 프로세스</h2>
          <p className="text-xs md:text-sm text-slate-550 mt-2.5 leading-relaxed">
            접수부터 실증 제안까지, 객관적인 4단계 프로세스를 통해 빠르고 정확한 지표를 송부합니다.
          </p>
        </motion.div>
 
        {/* Flow visual design */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 relative">
          {/* Connecting arrow background on desktop split */}
          <div className="hidden md:block absolute top-[2.5rem] left-[12%] right-[12%] h-[3px] bg-gradient-to-r from-blue-300 via-blue-500 to-indigo-500 z-0 opacity-40 rounded-full" />
 
          {steps.map((item, idx) => {
            const isFirst = idx === 0;
            return (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, scale: 0.92, y: 30 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: idx * 0.12 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`p-5 rounded-2xl relative z-10 transition-all duration-300 border transform ${
                  isFirst 
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-700 border-blue-600 text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-white border-slate-200 text-slate-900 hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <motion.span 
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                    className={`text-[11px] font-mono font-extrabold tracking-wider ${isFirst ? 'text-blue-200' : 'text-blue-600'}`}
                  >
                    {item.step}
                  </motion.span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${
                    isFirst ? 'bg-white/10 border-white/20 text-white' : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}>STAGE 0{idx+1}</span>
                </div>
                <h4 className="font-extrabold text-sm leading-snug">{item.title}</h4>
                <p className={`text-[11px] mt-2.5 leading-relaxed font-sans ${isFirst ? 'text-blue-100' : 'text-slate-500'}`}>{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


/* ==========================================
   4. SECTION 05: 기업별 사전 검토 및 분석 사례
   ========================================== */
export function CaseStudies() {
  const [activeTab, setActiveTab] = useState(0);

  const cases = [
    {
      id: 'case-a',
      type: '외식 소상공인 창업사례',
      title: '사례 A (외식업 운영)',
      current: '업력 8개월, 한시 일시적 소액 대출 보유',
      proposal: '초기 창업자 및 지역특화 미소 자금 분류 검토 후 상세 안내 완료',
      details: '대표자 개인 보증 한도 및 지역 내 점포 시설 유동성 배점 기준을 상기하여 설립 1년 미만 소상공인 특화지원 자금을 제안하여 한도를 타진했습니다.'
    },
    {
      id: 'case-b',
      type: '기술제조 기술보증 연계',
      title: '사례 B (제조업 영위)',
      current: '신용평점 600점대 후반 (중점관리 구간)',
      proposal: '기술성 특성 평가 및 정책기관 보증서 연계 가능성 정충 분석',
      details: '보유 공장의 담보 여력이 전무한 불리함 속에서 특허 기술의 정량 가치 평가 모형을 발굴, 기술보증기금 스마트 설비자금과 연계 검토를 유도했습니다.'
    },
    {
      id: 'case-c',
      type: '도소매 긴급 유동성 자금',
      title: '사례 C (도소매업 영위)',
      current: '최근 원자재 수급 변동으로 인한 한시 매출 하락 정체',
      proposal: '긴급 경영애로 경영안정 지원 자금 요건 확인 대립 진단',
      details: '일시적 납품 단가 불균형으로 매출액이 하락했으나 향후 수주 확약서 등을 보증 근거로 삼아 긴급 경영안정 및 외환 운전자금 대출 매칭 요율을 진단했습니다.'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white via-slate-50 to-blue-50/40 border-b border-slate-200 font-sans" id="section-cases">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-xl mx-auto mb-10"
        >
          <span className="text-xs font-bold text-blue-700 tracking-wider uppercase px-3 py-1 bg-blue-100/60 rounded-full border border-blue-200">SECTION 05</span>
          <h2 className="text-2xl md:text-3.5xl font-extrabold tracking-tight text-slate-900 mt-3">맞춤 정책자금 추천 및 해소 사례</h2>
          <p className="text-xs md:text-sm text-slate-550 mt-2.5 leading-relaxed">
            각 개별 기업의 재무적 성향에 대입하여 적합한 지원 제도를 분류하여 드린 실제 현장의 실증 사례들입니다.
          </p>
        </motion.div>

        {/* Tab interactive display */}
        <div className="flex flex-col md:flex-row gap-6 items-stretch">
          {/* Left selectors buttons */}
          <div className="flex flex-row md:flex-col gap-2.5 overflow-x-auto md:overflow-visible shrink-0 w-full md:w-56 pb-2 md:pb-0">
            {cases.map((c, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTab(idx)}
                className={`flex-1 text-left px-4 py-3.5 text-xs font-bold rounded-2xl border transition-all whitespace-nowrap md:whitespace-normal cursor-pointer transform active:scale-95 ${
                  activeTab === idx 
                    ? 'bg-gradient-to-r from-blue-700 to-indigo-850 text-white border-blue-700 shadow-md shadow-blue-500/10' 
                    : 'bg-white text-slate-600 border-slate-200/80 hover:bg-slate-50/80 hover:border-slate-300'
                }`}
              >
                <span className={`block text-[9px] font-bold mb-1 leading-none ${activeTab === idx ? 'text-blue-200' : 'text-blue-600'}`}>{c.type}</span>
                {c.title}
              </button>
            ))}
          </div>

          {/* Right Case Display Card */}
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-lg shadow-blue-900/5 relative overflow-hidden flex flex-col justify-between border-l-4 border-l-blue-600"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h4 className="text-sm md:text-md font-extrabold text-slate-950">{cases[activeTab].title}</h4>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg">진단 매칭사례</span>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-extrabold block tracking-wider uppercase">현재 당면 여건</span>
                <p className="text-xs md:text-sm font-bold text-slate-800 mt-1">{cases[activeTab].current}</p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400 font-extrabold block tracking-wider uppercase">자가진단 검토 내역</span>
                <p className="text-xs md:text-sm font-bold text-blue-600 mt-1">{cases[activeTab].proposal}</p>
              </div>

              <div className="pt-2">
                <span className="text-[10px] text-slate-400 font-extrabold block tracking-wider uppercase">세부 조력 가이드</span>
                <p className="text-xs text-slate-650 leading-relaxed mt-1.5 font-sans whitespace-pre-line">{cases[activeTab].details}</p>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 mt-6 leading-relaxed border-t border-slate-100 pt-3 font-sans">
              ※ 위 사례는 해당 기업의 당시 재무·비재무적 환경에 맞춤 설정된 특수 가이드이며, 개별 자가진단 항목에 기초하여 결과 제안 범위는 탄력적으로 변경될 수 있습니다.
            </p>
          </motion.div>
        </div>

      </div>
    </section>
  );
}


/* ==========================================
   5. SECTION 06: 사전 준비와 분석이 중요한 이유
   ========================================== */
export function PreperationSection() {
  const values = [
    {
      title: '올바른 자금 상품 최적화 매칭',
      desc: '기관별로 심사 기준이 고유하며 상이하므로, 기업 유형에 가장 실질적으로 부합하고 유리한 정책 제도를 가려내는 통찰이 선행되어야 자격 승인이 순탄합니다.',
      icon: CheckCircle
    },
    {
      title: '무분별 부결 시 재신청 제한 예방',
      desc: '일부 자금 및 재단 산하 특별 프로그램은 신청 부적격으로 원장 부결 처리 시 최장 6개월간 서류 재접수가 제한될 수 있으므로 첫 진단 단계가 매우 엄격해야 합니다.',
      icon: AlertTriangle
    },
    {
      title: '필수 기본 증빙 서증 자료 점검',
      desc: '경영 평가 재무제표의 약식 추이성 평가, 공인 특허 및 사업계획서 요약 정비 등 접수 기관이 집중 요구하는 핵심 지표를 안전하게 사전 진단합니다.',
      icon: BookOpenCheck
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white border-b border-indigo-950 font-sans relative overflow-hidden" id="section-preperation">
      {/* Decorative vector background */}
      <div className="absolute inset-x-0 bottom-0 top-1/2 opacity-20 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
      <div className="pointer-events-none absolute right-0 bottom-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="max-w-4xl mx-auto px-4 relative z-10">
        
        {/* Core Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-xl mx-auto mb-12"
        >
          <span className="text-xs font-bold text-blue-400 bg-blue-500/15 px-3 py-1 rounded-full uppercase tracking-wider border border-blue-500/20">SECTION 06</span>
          <h2 className="text-2xl md:text-3.5xl font-extrabold tracking-tight text-white mt-3">사전 준비와 정교한 분석이 왜 중요할까요?</h2>
          <p className="text-xs md:text-sm text-slate-350 mt-2.5 leading-relaxed">
            정책자금은 선착순 한정 예산 모형 내에서 핵심 요건을 정연하게 가준비한 우량 대상군을 선발식으로 분배하여 공정 지원하는 한계 구조를 띱니다.
          </p>
        </motion.div>

        {/* Features Split */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((v, idx) => (
            <motion.div 
              key={idx} 
              initial={{ opacity: 0, scale: 0.94, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="p-6 bg-white/5 border border-white/10 rounded-3xl flex flex-col justify-between hover:border-blue-400/45 hover:bg-white/10 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 transform"
            >
              <div>
                <motion.div 
                  whileHover={{ rotate: 12, scale: 1.1 }}
                  className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mb-5 shadow-lg shadow-blue-550/20"
                >
                  <v.icon className={`w-5 h-5 ${idx === 1 ? 'text-amber-300 animate-pulse' : 'text-cyan-200'}`} />
                </motion.div>
                <h4 className="font-extrabold text-white text-sm tracking-tight leading-snug">{v.title}</h4>
                <p className="text-slate-300 text-[11px] leading-relaxed mt-3 font-sans font-medium">{v.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ==========================================
   Simple custom icon vectors for local usage
   ========================================== */
function FlameKindlingIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}

function ScaleCoinsIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="8" cy="8" r="6" />
      <circle cx="18" cy="18" r="4" />
      <path d="M12 18h.01" />
    </svg>
  );
}

function CpuIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M9 9h6v6H9z" />
      <path d="M9 1v3" />
      <path d="M15 1v3" />
      <path d="M9 20v3" />
      <path d="M15 20v3" />
      <path d="M20 9h3" />
      <path d="M20 15h3" />
      <path d="M1 9h3" />
      <path d="M1 15h3" />
    </svg>
  );
}

function AwardIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="8" r="7" />
      <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
    </svg>
  );
}
