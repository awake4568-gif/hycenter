/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UnderStandingSection, 
  CriteriaTable, 
  ProcessSection, 
  CaseStudies,
  PreperationSection 
} from './components/LandingSections';
import LeadBoard from './components/LeadBoard';
import DiagnosticWizard from './components/DiagnosticWizard';
import AdminGalleryModal, { GalleryItem } from './components/AdminGalleryModal';
import { DiagnosticInput } from './types';
import { saveLead } from './utils';
import { 
  Check, 
  ArrowRight, 
  HelpCircle, 
  Building, 
  Phone, 
  User, 
  Info, 
  ChevronDown, 
  Database, 
  ArrowUpRight, 
  ShieldCheck,
  AlertCircle,
  Sliders,
  Image as ImageIcon,
  X
} from 'lucide-react';

// Import carousel images statically so they are bundled correctly by Vite in production builds
import heroGroup from './assets/images/hy_hero_group_1780906118360.png';
import heroCafe from './assets/images/hy_hero_cafe_1780910334373.png';
import heroPottery from './assets/images/hy_hero_pottery_1780910349873.png';
import heroManufacturing from './assets/images/hy_hero_manufacturing_1780910363887.png';
import heroRestaurant from './assets/images/hy_hero_restaurant_1780910378961.png';

export default function App() {
  // Navigation scrolls to diagnosis form
  const formRef = useRef<HTMLDivElement | null>(null);
  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Form State
  const [formData, setFormData] = useState<DiagnosticInput>({
    name: '',
    phone: '',
    companyName: '',
    industry: '',
    businessYears: '',
    revenue: '',
    message: '',
    privacyConsent: false
  });

  // UI state managers
  const [errors, setErrors] = useState<Partial<Record<keyof DiagnosticInput, string>>>({});
  const [activeWizardInput, setActiveWizardInput] = useState<DiagnosticInput | null>(null);
  const [showLeadBoard, setShowLeadBoard] = useState(false);
  const [completedCounter, setCompletedCounter] = useState(3419);

  // Hero section image carousel state with localStorage dynamic cache
  const [carouselImages, setCarouselImages] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('hy_carousel_images');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cached carousel images:', e);
      }
    }
    return [
      { id: '1', src: heroGroup, label: '전문 연구진 그룹' },
      { id: '2', src: heroCafe, label: '카페 소상공인' },
      { id: '3', src: heroPottery, label: '전통 도예 공방' },
      { id: '4', src: heroManufacturing, label: '정밀 제조 중소기업' },
      { id: '5', src: heroRestaurant, label: '한식당 식음료업' },
    ];
  });
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showAdminGallery, setShowAdminGallery] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showLeadsPasswordPrompt, setShowLeadsPasswordPrompt] = useState(false);
  const [leadsPasswordInput, setLeadsPasswordInput] = useState('');
  const [leadsPasswordError, setLeadsPasswordError] = useState('');

  // Auto-play the image rolling every 4.5 seconds
  useEffect(() => {
    if (carouselImages.length === 0) return;
    const timer = setInterval(() => {
      setActiveImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  // Simulated live diagnostic updates
  useEffect(() => {
    const interval = setInterval(() => {
      setCompletedCounter((prev) => prev + (Math.random() > 0.7 ? 1 : 0));
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Format phone number utility as user types in real-time
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    let formatted = rawVal;
    if (rawVal.length > 3 && rawVal.length <= 7) {
      formatted = `${rawVal.slice(0, 3)}-${rawVal.slice(3)}`;
    } else if (rawVal.length > 7) {
      formatted = `${rawVal.slice(0, 3)}-${rawVal.slice(3, 7)}-${rawVal.slice(7, 11)}`;
    }
    setFormData(prev => ({ ...prev, phone: formatted }));
    if (formatted) {
      setErrors(prev => ({ ...prev, phone: undefined }));
    }
  };

  const handleInputChange = (key: keyof DiagnosticInput, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (value !== '') {
      setErrors(prev => ({ ...prev, [key]: undefined }));
    }
  };

  // Handle diagnostic request dispatch
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple Validation checks
    const tempErrors: Partial<Record<keyof DiagnosticInput, string>> = {};
    if (!formData.name.trim()) tempErrors.name = '대표자 혹은 담당자 성함을 기재해 주세요.';
    if (!formData.phone.trim() || formData.phone.length < 9) tempErrors.phone = '올바른 연락처를 기재해 주세요.';
    if (!formData.companyName.trim()) tempErrors.companyName = '회사명을 정확히 기재해 주세요.';
    if (!formData.industry) tempErrors.industry = '업종 분류를 지정해 주세요.';
    if (!formData.businessYears) tempErrors.businessYears = '업력을 선택해 주세요.';
    if (!formData.revenue) tempErrors.revenue = '연 매출 규모를 선택해 주세요.';
    if (!formData.privacyConsent) tempErrors.privacyConsent = '개인정보 보호법 저촉에 따른 수집 및 이용 동의가 필요합니다.';

    if (Object.keys(tempErrors).length > 0) {
      setErrors(tempErrors);
      // Scroll to first invalid field area
      formRef.current?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Save lead to local storage
    saveLead(formData);

    // Open dynamic diagnostics analyzer simulation
    setActiveWizardInput({ ...formData });

    // Toast completed increment
    setCompletedCounter(prev => prev + 1);

    // Reset Form to pristine
    setFormData({
      name: '',
      phone: '',
      companyName: '',
      industry: '',
      businessYears: '',
      revenue: '',
      message: '',
      privacyConsent: false
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white font-sans antialiased">
      
      {/* 1. Top Banner */}
      <div className="bg-slate-900 text-white py-2 px-4 md:px-8 text-[10px] uppercase font-bold border-b border-white/10 relative z-50 font-sans shadow-sm tracking-wide flex flex-col sm:flex-row justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="text-blue-400 font-extrabold">혜율정책자금지원센터</span>
          <span className="text-white/75 font-normal tracking-normal hidden md:inline">| 누적 3,400여 개 소상공인·중소기업 진단 매칭 지원</span>
        </div>
        
        {/* Real-time Contacts Panel in Top Bar */}
        <div className="flex items-center gap-2">
          <a 
            href="https://pf.kakao.com/_xbgxlxnn/friend" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] px-2.5 py-1 rounded text-[9px] font-black shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer normal-case"
          >
            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 3c-5.522 0-10 3.51-10 7.84 0 2.766 1.8 5.19 4.544 6.586-.184.673-.664 2.435-.76 2.802-.12.457.153.451.321.341.132-.087 2.096-1.424 2.935-1.996C10.05 18.847 11.01 18.9 12 18.9c5.522 0 10-3.51 10-7.84S17.522 3 12 3z" />
            </svg>
            <span>카카오톡 문의 바로가기</span>
          </a>
          
          <a 
            href="tel:1533-2094" 
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded text-[9px] font-black shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer normal-case"
          >
            <Phone className="w-2.5 h-2.5" />
            <span>상담전화 연결: 1533-2094</span>
          </a>
        </div>
      </div>

      {/* Primary Header Navbar */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/80 shadow-xs">
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-3 md:py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Logo & Mobile Action */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-2.5 cursor-pointer group shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm border border-blue-500 transition-transform group-hover:scale-105">
                <span className="font-extrabold text-sm font-sans tracking-tighter">HY</span>
              </div>
              <div className="shrink-0 text-left">
                <span className="font-extrabold text-slate-900 text-[13px] min-[370px]:text-sm md:text-base tracking-tight leading-none block whitespace-nowrap">혜율정책자금지원센터</span>
                <span className="text-[8px] min-[370px]:text-[9px] text-slate-450 tracking-wider font-semibold font-mono block mt-1 uppercase leading-none whitespace-nowrap">Corporate Support Center</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 min-[370px]:gap-1.5 md:hidden shrink-0">
              <a 
                href="https://pf.kakao.com/_xbgxlxnn/friend" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center w-7.5 h-7.5 min-[370px]:w-8 min-[370px]:h-8 rounded-lg bg-[#FEE500] text-[#191919] shadow-xs active:scale-95 transition-transform cursor-pointer shrink-0"
                title="카카오톡 문의"
              >
                <svg className="w-3.5 h-3.5 min-[370px]:w-4 min-[370px]:h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 3c-5.522 0-10 3.51-10 7.84 0 2.766 1.8 5.19 4.544 6.586-.184.673-.664 2.435-.76 2.802-.12.457.153.451.321.341.132-.087 2.096-1.424 2.935-1.996C10.05 18.847 11.01 18.9 12 18.9c5.522 0 10-3.51 10-7.84S17.522 3 12 3z" />
                </svg>
              </a>
              <a 
                href="tel:1533-2094" 
                className="flex items-center justify-center w-7.5 h-7.5 min-[370px]:w-8 min-[370px]:h-8 rounded-lg bg-blue-600 text-white shadow-xs active:scale-95 transition-transform cursor-pointer shrink-0"
                title="전화문의"
              >
                <Phone className="w-3 h-3 min-[370px]:w-3.5 min-[370px]:h-3.5" />
              </a>
              <button 
                id="nav-cta-btn"
                onClick={handleScrollToForm}
                className="text-[10px] min-[370px]:text-[11px] font-extrabold px-2 min-[370px]:px-2.5 py-1.5 bg-slate-900 text-white rounded-lg transition-transform active:scale-95 cursor-pointer shadow-xs whitespace-nowrap shrink-0"
              >
                자가진단
              </button>
            </div>
          </div>

          {/* Chapters Navigation Menu */}
          <nav className="flex items-center gap-1 md:gap-2.5 overflow-x-auto w-full md:w-auto py-1 px-4 -mx-5 md:mx-0 md:px-0 scrollbar-none border-t border-slate-100 md:border-t-0 justify-start md:justify-center">
            {[
              { id: 'section-understanding', label: '정책자금 이해' },
              { id: 'section-criteria', label: '지원 요건' },
              { id: 'section-process', label: '분석 프로세스' },
              { id: 'section-cases', label: '분석 사례' },
              { id: 'section-preperation', label: '사전 준비' },
              { id: 'section-diagnosis-form', label: '1분 자가진단' },
            ].map((ch) => (
              <button
                key={ch.id}
                onClick={() => {
                  const target = document.getElementById(ch.id);
                  if (target) {
                    const yOffset = -80; 
                    const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                  }
                }}
                className="px-2.5 py-1 text-slate-600 hover:text-blue-600 hover:bg-blue-50/60 rounded-lg font-bold text-[11px] md:text-xs transition-all cursor-pointer whitespace-nowrap shrink-0 border border-transparent hover:border-blue-100/50"
              >
                {ch.label}
              </button>
            ))}
          </nav>

          {/* Right Desktop CTA Action & Contact Buttons */}
          <div className="hidden lg:flex items-center gap-2">
            <a 
              href="https://pf.kakao.com/_xbgxlxnn/friend" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-[#FEE500] hover:bg-[#FADA0A] text-[#191919] px-3.5 py-2.5 rounded-xl text-xs font-extrabold shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 3c-5.522 0-10 3.51-10 7.84 0 2.766 1.8 5.19 4.544 6.586-.184.673-.664 2.435-.76 2.802-.12.457.153.451.321.341.132-.087 2.096-1.424 2.935-1.996C10.05 18.847 11.01 18.9 12 18.9c5.522 0 10-3.51 10-7.84S17.522 3 12 3z" />
              </svg>
              <span>카카오톡 문의</span>
            </a>
            
            <a 
              href="tel:1533-2094" 
              className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-3.5 py-2.5 rounded-xl text-xs font-extrabold shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5 text-blue-600 animate-pulse" />
              <span>전화 1533-2094</span>
            </a>

            <button 
              onClick={handleScrollToForm}
              className="text-xs font-extrabold px-4 py-2.5 bg-slate-900 hover:bg-blue-600 text-white rounded-xl transition-all cursor-pointer shadow-sm hover:scale-105"
              id="nav-cta-btn"
            >
              1분 자가진단 신청
            </button>
          </div>
        </div>
      </header>

      {/* Main Body Column */}
      <main>
        
        {/* TOP BRAND HERO BANNER - CRITICAL SPLIT GRID WITH OUTSTANDING LEGIbILITY */}
        <section className="bg-gradient-to-b from-slate-50 via-white to-blue-50/20 pt-12 pb-14 md:pt-16 md:pb-20 border-b border-blue-100 font-sans">
          <div className="max-w-5xl mx-auto px-5">
            
            {/* 1. TOP BLOCK: Generous headroom with the giant display slogan text */}
            <div className="text-left select-text mb-8 md:mb-12">
              <h1 className="text-[34px] md:text-[56px] font-black tracking-tight leading-[1.12] text-slate-950" id="slogan-heading">
                우리 회사도<br className="md:hidden" /> 정부 정책자금을<br />
                <span className="text-blue-700 underline decoration-blue-500/15">지원받을 수 있을까?</span>
              </h1>
            </div>

            {/* 2. SPLIT CONTENT GRID: Eliminates any overlap on faces and guarantees ultra-sharp rendering */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Guidance Cards and Call to Action */}
              <div className="md:col-span-5 space-y-5 order-2 md:order-1 select-text">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-[10px] md:text-xs font-bold rounded-full border border-blue-100 shadow-3xs w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  실시간 정책자금 매칭 가이드
                </div>
                
                <p className="text-slate-700 text-xs md:text-[13px] font-bold leading-relaxed font-sans bg-white border border-slate-150 p-4 rounded-2xl shadow-3xs">
                  매년 복잡해지는 정책자금 지원 요건, 혜율정책자금지원센터의 인공지능 기반 분석 프로세스로 가장 확실하고 빠른 매칭 경로를 디자인해 드립니다.
                </p>
                
                <div className="pt-2">
                  <button
                    onClick={handleScrollToForm}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-extrabold text-xs md:text-sm shadow-md shadow-blue-500/15 hover:scale-[1.01] transition-all cursor-pointer w-full sm:w-auto"
                  >
                    <span>1분 무료 자가진단</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Right Column: Beautiful rolling image slider representing diverse businesses, with no overlap or clipping */}
              <div className="md:col-span-7 order-1 md:order-2">
                <div className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-slate-200 shadow-lg bg-white aspect-[3/2] w-full flex flex-col justify-between p-2">

                  <div className="relative flex-1 overflow-hidden w-full flex items-center justify-center min-h-[220px] md:min-h-[300px]">
                    <AnimatePresence mode="wait">
                      {carouselImages.length > 0 ? (
                        <motion.img 
                          key={activeImageIndex >= carouselImages.length ? 0 : activeImageIndex}
                          src={(carouselImages[activeImageIndex >= carouselImages.length ? 0 : activeImageIndex] || carouselImages[0]).src}
                          alt={(carouselImages[activeImageIndex >= carouselImages.length ? 0 : activeImageIndex] || carouselImages[0]).label}
                          initial={{ opacity: 0, scale: 0.98, x: 10 }}
                          animate={{ opacity: 1, scale: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.98, x: -10 }}
                          transition={{ duration: 0.4, ease: "easeInOut" }}
                          className="w-full h-full object-contain filter-none"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="text-slate-400 text-xs flex flex-col items-center justify-center gap-1.5 p-4">
                          <ImageIcon className="w-8 h-8 text-slate-350 stroke-1" />
                          <span>등록된 갤러리 사진이 없습니다.</span>
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                  
                  {/* Indicator Dots indicating slider completion and active image index */}
                  <div className="flex justify-center gap-1.5 pb-1 pt-1 bg-white border-t border-slate-50/50 mt-1">
                    {carouselImages.map((img, idx) => {
                      const isActive = idx === (activeImageIndex >= carouselImages.length ? 0 : activeImageIndex);
                      return (
                        <button
                          key={img.id || idx}
                          onClick={() => setActiveImageIndex(idx)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            isActive 
                              ? 'w-6 bg-blue-600' 
                              : 'w-1.5 bg-slate-200 hover:bg-slate-300'
                          }`}
                          title={img.label}
                        />
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* SECTION 01: Hero Section */}
        <section className="bg-white py-16 md:py-24 border-b border-slate-200 font-sans relative overflow-hidden">
          {/* Decorative radial ambient shapes */}
          <div className="pointer-events-none absolute right-0 top-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -z-10" />
          <div className="pointer-events-none absolute left-0 bottom-0 w-80 h-80 bg-slate-50 rounded-full blur-3xl -z-10" />

          <div className="max-w-4xl mx-auto px-4">
            <div className="max-w-2xl">
              <span className="inline-block text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider mb-4 border border-blue-100">
                신속·정확한 정책자금 가이드
              </span>
              <h1 className="text-3xl md:text-4.5xl font-extrabold text-slate-950 tracking-tight leading-tight md:leading-[1.15]" id="hero-heading">
                "우리 회사도 정부 정책자금을<br />
                <span className="text-blue-600">지원받을 수 있을까?"</span>
              </h1>
              <p className="text-sm md:text-base text-slate-500 mt-5 leading-relaxed font-sans select-text">
                복잡한 자격 요건과 서류 준비 때문에 망설이고 계신가요? 개별 기업의 특성과 매출 구조를 체계적으로 분석하면 보이지 않던 기회가 보입니다.
              </p>
            </div>

            {/* Target persona grid layout */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-3.5 max-w-3xl">
              <div className="flex gap-2.5 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-200 transition-all">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="text-xs font-semibold text-slate-800">신용점수가 비교적 낮아 고민이신 대표님</span>
              </div>
              <div className="flex gap-2.5 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-200 transition-all">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="text-xs font-semibold text-slate-800">업력이 1년 미만으로 짧아 자격이 안 될까 걱정이신 분</span>
              </div>
              <div className="flex gap-2.5 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-200 transition-all">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="text-xs font-semibold text-slate-800">이미 기존 대출 채무를 보유하고 있어 신청이 망설여지시는 분</span>
              </div>
              <div className="flex gap-2.5 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-200 transition-all">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="text-xs font-semibold text-slate-800">수많은 자금 조력 상품 중 무엇을 신청해야 할지 갈피를 못 잡는 분</span>
              </div>
              <div className="flex gap-2.5 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:border-blue-200 transition-all md:col-span-2">
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 shrink-0 mt-0.5">
                  <Check className="w-3 h-3 stroke-[3]" />
                </div>
                <span className="text-xs font-semibold text-slate-800">준비할 공증 복잡 증빙 서류와 단계별 심사 절차가 무겁게만 느껴지시는 분</span>
              </div>
            </div>

            {/* Core Hero statement concluding */}
            <div className="mt-8 max-w-2xl bg-slate-50 border border-slate-200 p-5 rounded-xl text-xs md:text-sm text-slate-500 leading-relaxed font-sans">
              하지만 개별 기업의 상세상황(세부 업종 형태, 고유 특성, 매출 추이 구조 등)을 체계적으로 대입 및 분석하면, 당기 적합한 대 정부 지원 제도를 발견할 가능성이 존재합니다.
              <br />
              현재 약 1분의 기초 자가진단 간이 신청 접수만으로 대표자 기업에 어울리는 핵심 자금 요율 조건과 성공 가능성을 즉시 체크해 보세요.
            </div>

            {/* Hero Main Button */}
            <div className="mt-8">
              <button
                onClick={handleScrollToForm}
                className="inline-flex items-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100 transition-all sm:w-auto hover:translate-y-[-1px] cursor-pointer"
                id="hero-cta-btn"
              >
                <span>우리 회사 정책자금 가능성 무료로 확인하기</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 02: 정책자금 지원제도의 이해 */}
        <UnderStandingSection />

        {/* SECTION 03: 지원 검토 가능 요건 안내 Table */}
        <CriteriaTable />

        {/* SECTION 04: 정책자금 분석 프로세스 */}
        <ProcessSection />

        {/* SECTION 05: 기업별 사전 검토 및 분석 사례 */}
        <CaseStudies />

        {/* SECTION 06: 사전 준비와 분석이 중요한 이유 */}
        <PreperationSection />

        {/* SECTION 07: 1분 무료 자가진단 신청 Form Box */}
        <section className="py-16 bg-slate-900 text-white font-sans relative" ref={formRef} id="section-diagnosis-form">
          
          {/* Decorative faint grid canvas overlay */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="w-full h-full bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:24px_38px]" />
          </div>

          <div className="max-w-3xl mx-auto px-4 relative z-10">
            
            {/* Form Title Heading */}
            <div className="text-center max-w-xl mx-auto mb-10">
              <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full uppercase tracking-wider border border-blue-500/20">SECTION 07</span>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mt-3">1분 무료 자가진단</h2>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                정보를 입력하시면 전문가가 검토 후 1~2일 내로 결과를 안내해 드립니다.
              </p>
            </div>

            {/* Principal Form Container */}
            <div className="bg-white text-slate-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-700/30">
              <form onSubmit={handleFormSubmit} className="space-y-5">
                
                {/* Two Column items */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>성함 <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="text"
                      placeholder="성함 입력 (예: 홍길동)"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full p-3 bg-slate-50 border rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                        errors.name ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-slate-900/15'
                      }`}
                      id="input-name"
                    />
                    {errors.name && <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errors.name}</span>}
                  </div>

                  {/* Phone field */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      <span>연락처 <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="tel"
                      placeholder="숫자만 입력 (예: 010-1234-5678)"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className={`w-full p-3 bg-slate-50 border rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                        errors.phone ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-slate-900/15'
                      }`}
                      id="input-phone"
                    />
                    {errors.phone && <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errors.phone}</span>}
                  </div>

                  {/* Company Name field */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>회사명 <span className="text-red-500">*</span></span>
                    </label>
                    <input
                      type="text"
                      placeholder="정확한 회사명 혹은 형태 입력 (예: 우리유통 주식회사, 개인사업자 등)"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className={`w-full p-3 bg-slate-50 border rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                        errors.companyName ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-slate-900/15'
                      }`}
                      id="input-company-name"
                    />
                    {errors.companyName && <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errors.companyName}</span>}
                  </div>

                  {/* Industry select dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      업종 분류 <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.industry}
                        onChange={(e) => handleInputChange('industry', e.target.value)}
                        className={`w-full p-3 bg-slate-50 border rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:bg-white appearance-none transition-all ${
                          errors.industry ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-slate-900/15'
                        }`}
                        id="select-industry"
                      >
                        <option value="">업종을 선택하세요</option>
                        <option value="제조">제조업 (공장, 설비 및 생산포함)</option>
                        <option value="도소매">도소매업 (무역, 온라인유통 포함)</option>
                        <option value="서비스">서비스업 (음식점, 도매 및 일반서비스)</option>
                        <option value="IT_정보통신">IT·정보통신업 (소프트웨어 개발 등)</option>
                        <option value="기타">기타 업종</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                    </div>
                    {errors.industry && <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errors.industry}</span>}
                  </div>

                  {/* Years select dropdown */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      업력 (설립 연월 기준) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.businessYears}
                        onChange={(e) => handleInputChange('businessYears', e.target.value)}
                        className={`w-full p-3 bg-slate-50 border rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:bg-white appearance-none transition-all ${
                          errors.businessYears ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-slate-900/15'
                        }`}
                        id="select-business-years"
                      >
                        <option value="">설립연차 구간 선택</option>
                        <option value="less_than_1y">1년 미만 (창업 초기 기업)</option>
                        <option value="1y_to_3y">1년 이상 ~ 3년 미만</option>
                        <option value="3y_to_7y">3년 이상 ~ 7년 미만</option>
                        <option value="more_than_7y">7년 이상</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                    </div>
                    {errors.businessYears && <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errors.businessYears}</span>}
                  </div>

                  {/* Revenue scale dropdown */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      연 매출 규모 (최근 연장 실적기준) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formData.revenue}
                        onChange={(e) => handleInputChange('revenue', e.target.value)}
                        className={`w-full p-3 bg-slate-50 border rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:bg-white appearance-none transition-all ${
                          errors.revenue ? 'border-red-500 focus:ring-red-500/20' : 'border-slate-200 focus:ring-slate-900/15'
                        }`}
                        id="select-revenue"
                      >
                        <option value="">연 매출 외형 구간 선택</option>
                        <option value="less_than_100m">1억 원 미만 (영세 소상공인)</option>
                        <option value="100m_to_500m">1억 원 이상 ~ 5억 원 미만</option>
                        <option value="500m_to_1b">5억 원 이상 ~ 10억 원 미만</option>
                        <option value="more_than_1b">10억 원 이상 (중소 및 강소기업)</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5 pointer-events-none" />
                    </div>
                    {errors.revenue && <span className="text-[10px] text-red-500 font-semibold mt-1 block">{errors.revenue}</span>}
                  </div>

                  {/* Message field */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      주요 문의 사항
                    </label>
                    <textarea
                      placeholder="추가 희망 사항 및 기대 요건을 기재하시면 1차 분류 및 필터링에 큰 도움을 줍니다. (예: 저리 마케팅 대안대출 문의 등)"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="w-full p-3 h-24 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/15 focus:bg-white resize-none transition-all font-sans"
                      id="input-message"
                    />
                  </div>

                </div>

                {/* Privacy Consent Checkbox Box */}
                <div className="p-4 bg-slate-100 rounded-2xl border border-slate-200 mt-2">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="privacyConsent"
                      checked={formData.privacyConsent}
                      onChange={(e) => handleInputChange('privacyConsent', e.target.checked)}
                      className="mt-1 rounded text-blue-600 focus:ring-blue-500/20 w-4 h-4 accent-slate-950"
                    />
                    <div className="text-xs">
                      <label htmlFor="privacyConsent" className="font-extrabold text-slate-800 cursor-pointer flex items-center gap-1">
                        <span>개인정보 수집 및 이용 동의 (필수)</span>
                        <span className="text-red-500">*</span>
                      </label>
                      <p className="text-[10px] text-slate-500 mt-1.5 leading-relaxed font-sans">
                        귀사가 작성한 대표자 성함, 기업명, 연락처, 조세 정보 등의 일체 지표구조는 관계 법령에 의거하여 ‘정책자금 승인 요건 사전 타진 및 컨설팅 연락 매칭’ 목적 이외의 제3자 유출이나 상업 마케팅 수단으로 절대 유출 또는 남용되지 않으며, 상담 거절 시 안전하게 수치 삭제됩니다.
                      </p>
                    </div>
                  </div>
                  {errors.privacyConsent && (
                    <span className="text-[10px] text-red-500 font-semibold mt-2.5 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{errors.privacyConsent}</span>
                    </span>
                  )}
                </div>

                {/* Form Dispatch Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-100 transition-all cursor-pointer text-center"
                    id="submit-diagnostic-btn"
                  >
                    진단 결과 무료 신청하기
                  </button>
                </div>

              </form>
            </div>

            {/* Bottom auxiliary statement */}
            <div className="mt-10 p-5 bg-white/5 border border-white/10 rounded-2xl text-xs text-slate-400 leading-relaxed font-sans">
              <span className="font-bold text-slate-200 block mb-1">조건이 맞을 때, 예산이 소진되기 전에 확인하는 것이 필요합니다.</span>
              현재 우리 회사가 유효 대입 활용할 수 있는 정부 지원 자금 제도가 포지셔닝되어 있는지, 가시적인 객관 지표로 지체 없이 먼저 점검해 두는 요건을 적극 권면해 드립니다.
              <div className="mt-4 flex flex-wrap gap-2.5">
                <button
                  onClick={handleScrollToForm}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                  id="footer-inline-scroll-btn"
                >
                  <span>우리 회사 맞춤 자금 무료 진단 시작하기</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Primary Landing Page Footer */}
      <footer className="bg-slate-950 text-slate-400 text-xs pt-14 pb-24 sm:pb-14 border-t border-white/10 font-sans">
        <div className="max-w-5xl mx-auto px-4 space-y-8">
          
          {/* Logo & Callouts section */}
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-extrabold tracking-tighter">HY</div>
                <span className="font-bold text-white text-sm">혜율정책자금지원센터</span>
              </div>
              <p className="text-[11px] leading-relaxed max-w-sm text-slate-550">
                본 자가진단 사전 분석 시스템은 중소기업과 소상공인이 지원 가능한 정책 사업 조건들을 정밀 타진하고 기업 상황에 부합하는 솔루션을 탐색하도록 제공하는 대화형 자가진단 플랫폼입니다.
              </p>
            </div>

            {/* Simulated Live Admin Panels for demo testing */}
            <div className="flex flex-col sm:flex-row gap-4 w-full md:max-w-xl md:w-auto shrink-0">
              {/* 1. Leads Board Admin */}
              <div 
                onClick={() => setShowLeadsPasswordPrompt(true)}
                className="bg-white/5 border border-white/10 hover:border-blue-500/50 rounded-xl p-4 space-y-2.5 text-slate-300 flex-1 min-w-[245px] cursor-pointer transition-all hover:bg-white/10"
              >
                <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
                  <Database className="w-3.5 h-3.5 text-blue-400" />
                  <span>시연용 리드 확인 시스템</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal font-sans">
                  자가진단 신청 완료 후 제출된 대표님의 실시간 신청 리드가 어떻게 보존되고 축적관리되는지 리드 보드 데스크에서 확인해 보세요!
                </p>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLeadsPasswordPrompt(true);
                  }}
                  className="w-full py-1.5 bg-slate-800 hover:bg-slate-705 text-white rounded text-[11px] font-bold tracking-tight transition-colors cursor-pointer border border-slate-700"
                  id="footer-open-dashboard-btn"
                >
                  실시간 리드관리 모니터링 데스크 열기
                </button>
              </div>

              {/* 2. Hero Slider Admin Panel */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2.5 text-slate-300 flex-1 min-w-[245px]">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase tracking-wider">
                  <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                  <span>히어로 갤러리 관리 시스템</span>
                </div>
                <p className="text-[10px] text-slate-500 leading-normal font-sans">
                  메인 히어로 배너 영역의 이미지와 슬라이더 라벨을 업로드하고, 원복하거나, 노출 가짓수 및 슬라이딩 우선순위를 실시간 제정해 보세요!
                </p>
                <button
                  onClick={() => setShowPasswordPrompt(true)}
                  className="w-full py-1.5 bg-indigo-900/60 hover:bg-indigo-800 text-white rounded text-[11px] font-bold tracking-tight transition-colors cursor-pointer border border-indigo-750"
                  id="footer-open-gallery-btn"
                >
                  히어로 이미지 갤러리 관리 데스크 열기
                </button>
              </div>
            </div>
          </div>

          {/* Legal Business Information Disclosure */}
          <div className="border-t border-white/10 pt-6 text-[11px] text-slate-405 grid grid-cols-1 md:grid-cols-2 gap-4 leading-normal">
            <div className="space-y-1.5 font-sans">
              <div className="flex flex-wrap gap-x-4 gap-y-1">
                <span className="text-slate-300"><strong>회사이름:</strong> 혜율정책자금지원센터</span>
                <span><strong>대표자:</strong> 김민규</span>
                <span><strong>사업자번호:</strong> 576-54-00650</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-400">
                <span><strong>대표번호:</strong> 1533-2094</span>
                <span><strong>이메일:</strong> awake4568@gmail.com</span>
              </div>
              <div className="text-slate-450">
                <strong>주소:</strong> 경기도 동탄시 첨단산업1로27 펜테리움IX타워 A-1301호
              </div>
            </div>
            
            <div className="text-[10px] text-slate-500 space-y-1.5 md:text-right flex flex-col justify-end">
              <p>※ 정책 전용 자금 자가진단 모델은 대표가 입력한 정성정량 지표만을 대입하는 1차 간이 결과표로서, 실제 관계 기관(신용보증기금, 기술보증기금, 소상공인시장진흥공단, 중소벤처기업진흥공단 등)의 최종 정밀 종합 등급 및 심사 결과와 수반 부결 여부는 해당기관 고유 지침 예산에 따라 판이할 수 있습니다.</p>
              <p>© 2026 혜율정책자금지원센터. All Rights Reserved. (This is a persistent test environment simulation)</p>
            </div>
          </div>

        </div>
      </footer>

      {/* 2. Interactive Multi-Step Diagnostic Simulation modal popup */}
      <AnimatePresence>
        {activeWizardInput && (
          <DiagnosticWizard
            input={activeWizardInput}
            onClose={() => setActiveWizardInput(null)}
          />
        )}
      </AnimatePresence>

      {/* 3. Interactive Consultant Leads Board Desk */}
      <AnimatePresence>
        {showLeadBoard && (
          <LeadBoard 
            onClose={() => setShowLeadBoard(false)}
          />
        )}
      </AnimatePresence>

      {/* Leads Board Admin Password prompt */}
      <AnimatePresence>
        {showLeadsPasswordPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs font-sans">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl relative"
            >
              <button 
                onClick={() => {
                  setShowLeadsPasswordPrompt(false);
                  setLeadsPasswordInput('');
                  setLeadsPasswordError('');
                }}
                className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                title="닫기"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center space-y-3 pt-2">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
                  <Database className="w-6 h-6 stroke-[1.75]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm md:text-base">리드 관리 시스템 인증</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">
                    고객들이 등록한 자가진단 최신 신청 정보를 확인하려면 관리자 비밀번호를 입력해 주십시오.
                  </p>
                </div>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (leadsPasswordInput === '191435') {
                    setLeadsPasswordError('');
                    setLeadsPasswordInput('');
                    setShowLeadsPasswordPrompt(false);
                    setShowLeadBoard(true);
                  } else {
                    setLeadsPasswordError('비밀번호가 일치하지 않습니다. 다시 입력해 주세요.');
                  }
                }}
                className="mt-6 space-y-4"
              >
                <div className="space-y-1.5">
                  <input 
                    type="password"
                    placeholder="비밀번호 입력..."
                    value={leadsPasswordInput}
                    onChange={(e) => {
                      setLeadsPasswordInput(e.target.value);
                      if (leadsPasswordError) setLeadsPasswordError('');
                    }}
                    autoFocus
                    maxLength={15}
                    className="w-full text-center tracking-widest font-extrabold text-sm md:text-base p-3 bg-slate-50 border border-slate-250 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-950 focus:bg-white transition-all placeholder:tracking-normal placeholder:font-normal"
                  />
                  {leadsPasswordError && (
                    <p className="text-[11px] font-semibold text-red-650 text-center animate-pulse">{leadsPasswordError}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 cursor-pointer transition-colors"
                  >
                    본인 인증
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowLeadsPasswordPrompt(false);
                      setLeadsPasswordInput('');
                      setLeadsPasswordError('');
                    }}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold border border-slate-200 cursor-pointer transition-colors"
                  >
                    취소
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Gallery Admin Password prompt */}
      <AnimatePresence>
        {showPasswordPrompt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs font-sans">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-2xl border border-slate-200 p-6 max-w-sm w-full shadow-2xl relative"
            >
              <button 
                onClick={() => {
                  setShowPasswordPrompt(false);
                  setPasswordInput('');
                  setPasswordError('');
                }}
                className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                title="닫기"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center space-y-3 pt-2">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100">
                  <ShieldCheck className="w-6 h-6 stroke-[1.75]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-sm md:text-base">갤러리 관리자 인증</h4>
                  <p className="text-xs text-slate-500 mt-1 leading-normal">
                    히어로 영역 슬라이더 사진을 구성하기 위해 관리자 비밀번호를 입력해 주십시오.
                  </p>
                </div>
              </div>

              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  if (passwordInput === '1914') {
                    setPasswordError('');
                    setPasswordInput('');
                    setShowPasswordPrompt(false);
                    setShowAdminGallery(true);
                  } else {
                    setPasswordError('비밀번호가 일치하지 않습니다. 다시 입력해 주세요.');
                  }
                }}
                className="mt-6 space-y-4"
              >
                <div className="space-y-1.5">
                  <input 
                    type="password"
                    placeholder="비밀번호 4자리 입력..."
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (passwordError) setPasswordError('');
                    }}
                    autoFocus
                    maxLength={10}
                    className="w-full text-center tracking-widest font-extrabold text-sm md:text-base p-3 bg-slate-50 border border-slate-250 rounded-xl focus:outline-none focus:ring-1 focus:ring-slate-950 focus:bg-white transition-all placeholder:tracking-normal placeholder:font-normal"
                  />
                  {passwordError && (
                    <p className="text-[11px] font-semibold text-red-650 text-center animate-pulse">{passwordError}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/10 cursor-pointer transition-colors"
                  >
                    본인 인증
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordPrompt(false);
                      setPasswordInput('');
                      setPasswordError('');
                    }}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl text-xs font-bold border border-slate-200 cursor-pointer transition-colors"
                  >
                    취소
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. Interactive Hero Rolling Gallery Admin Desk */}
      <AnimatePresence>
        {showAdminGallery && (
          <AdminGalleryModal
            initialItems={carouselImages}
            onClose={() => setShowAdminGallery(false)}
            onGalleryUpdate={(updatedList) => {
              setCarouselImages(updatedList);
              setActiveImageIndex(0); // Reset sliding index to primary
            }}
          />
        )}
      </AnimatePresence>

      {/* 4. Mobile Sticky Bottom Quick-Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-slate-200 md:hidden flex items-center p-2.5 gap-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        <a
          href="https://pf.kakao.com/_xbgxlxnn/friend"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#FEE500] text-[#191919] py-3 rounded-xl text-xs font-black shadow-xs active:scale-[0.98] transition-transform cursor-pointer"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 3c-5.522 0-10 3.51-10 7.84 0 2.766 1.8 5.19 4.544 6.586-.184.673-.664 2.435-.76 2.802-.12.457.153.451.321.341.132-.087 2.096-1.424 2.935-1.996C10.05 18.847 11.01 18.9 12 18.9c5.522 0 10-3.51 10-7.84S17.522 3 12 3z" />
          </svg>
          <span>카톡 문의</span>
        </a>
        
        <a
          href="tel:1533-2094"
          className="flex-1 inline-flex items-center justify-center gap-1.5 bg-blue-600 text-white py-3 rounded-xl text-xs font-black shadow-xs active:scale-[0.98] transition-transform cursor-pointer"
        >
          <Phone className="w-3.5 h-3.5" />
          <span>전화상담 1533-2094</span>
        </a>
      </div>

    </div>
  );
}

