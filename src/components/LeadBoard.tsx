/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  getStoredLeads, 
  updateLeadInStorage, 
  deleteLeadFromStorage, 
  getIndustryLabel, 
  getYearsLabel, 
  getRevenueLabel,
  getStoredMetaPixelId,
  setStoredMetaPixelId,
  getPixelLogs,
  clearPixelLogs,
  PixelLog,
  initMetaPixel
} from '../utils';
import { DiagnosticLead } from '../types';
import { 
  Users, 
  Search, 
  FileSpreadsheet, 
  Trash2, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  X, 
  FileText, 
  Save, 
  Filter,
  Settings,
  Zap,
  RefreshCw
} from 'lucide-react';

interface LeadBoardProps {
  onClose: () => void;
}

export default function LeadBoard({ onClose }: LeadBoardProps) {
  const [leads, setLeads] = useState<DiagnosticLead[]>([]);
  const [selectedLead, setSelectedLead] = useState<DiagnosticLead | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'reviewing' | 'completed'>('all');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const [memoText, setMemoText] = useState('');
  const [memoStatus, setMemoStatus] = useState<'pending' | 'reviewing' | 'completed'>('pending');
  const [stats, setStats] = useState({ total: 0, pending: 0, reviewing: 0, completed: 0 });

  // Meta Pixel state variables
  const [pixelId, setPixelId] = useState('');
  const [pixelLogs, setPixelLogs] = useState<PixelLog[]>([]);
  const [pixelSaveMessage, setPixelSaveMessage] = useState('');
  const [showPixelOnly, setShowPixelOnly] = useState(false);

  const reloadPixelData = () => {
    setPixelLogs(getPixelLogs());
  };

  // Load leads from storage
  const reloadLeads = () => {
    const list = getStoredLeads();
    setLeads(list);
    
    // Calculate statistics
    const total = list.length;
    const pending = list.filter(l => l.status === 'pending').length;
    const reviewing = list.filter(l => l.status === 'reviewing').length;
    const completed = list.filter(l => l.status === 'completed').length;
    
    setStats({ total, pending, reviewing, completed });
    reloadPixelData();
  };

  useEffect(() => {
    setPixelId(getStoredMetaPixelId());
    reloadLeads();
    // Setup listener for periodic updates
    const interval = setInterval(reloadLeads, 2000);

    window.addEventListener('storage', reloadPixelData);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', reloadPixelData);
    };
  }, []);

  // Update selected lead notes or status
  const handleSaveMemo = () => {
    if (!selectedLead) return;
    const updated: DiagnosticLead = {
      ...selectedLead,
      status: memoStatus,
      adminMemo: memoText
    };
    updateLeadInStorage(updated);
    setSelectedLead(updated);
    reloadLeads();
    
    // Simple temporary alert or indicators
    const btn = document.getElementById('memo-save-btn');
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = '저장되었습니다!';
      btn.classList.add('bg-emerald-600');
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('bg-emerald-600');
      }, 1500);
    }
  };

  const handleDeleteLead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('선택한 진단 신청 내역을 영구히 삭제하시겠습니까?')) {
      deleteLeadFromStorage(id);
      if (selectedLead?.id === id) {
        setSelectedLead(null);
      }
      reloadLeads();
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) {
      alert('내보낼 진단 리스트가 없습니다.');
      return;
    }
    
    // Create simple CSV string content
    const headers = ['신청일시', '성함', '연락처', '회사명', '업종', '업력', '연매출액', '자가점수', '매칭제안상품', '상태', '상담관리메모'];
    const rows = leads.map(l => [
      l.submittedAt,
      l.name,
      l.phone,
      l.companyName,
      getIndustryLabel(l.industry),
      getYearsLabel(l.businessYears),
      getRevenueLabel(l.revenue),
      `${l.score}점`,
      l.potentialFunds.join(' / '),
      l.status === 'pending' ? '접수대기' : l.status === 'reviewing' ? '검토중' : '상담완료',
      l.adminMemo.replace(/\n/g, ' ')
    ]);

    const csvContent = "\uFEFF" + [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `정책자금드림_자가진단_리스트_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter computations
  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.companyName.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search) ||
      (l.message && l.message.toLowerCase().includes(search.toLowerCase())) ||
      (l.adminMemo && l.adminMemo.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    const matchesIndustry = industryFilter === 'all' || l.industry === industryFilter;
    
    return matchesSearch && matchesStatus && matchesIndustry;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm" id="lead-board">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex flex-col w-full h-[90vh] max-w-6xl overflow-hidden bg-white rounded-2xl shadow-2xl border border-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg tracking-tight">실시간 신청 리드 관리 데스크</h3>
              <p className="text-xs text-slate-400 font-mono">Policy Funding Lead Management Panel (Local Cache DB)</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 transition-colors rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
            title="닫기"
            id="close-board-btn"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Dashboard Grid Container */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Main Left List Pane */}
          <div className="flex flex-col flex-1 border-r border-slate-200 bg-slate-50 overflow-hidden">
            
            {/* Quick Metrics */}
            <div className="grid grid-cols-4 gap-3 p-4 bg-white border-b border-slate-200">
              <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
                <span className="block text-xs font-medium text-slate-500">누적 신청건수</span>
                <span className="text-xl font-bold font-mono text-slate-900">{stats.total}건</span>
              </div>
              <div className="p-3 bg-sky-50 rounded-xl border border-sky-100">
                <span className="block text-xs font-medium text-sky-700">접수대기 (신규)</span>
                <span className="text-xl font-bold font-mono text-sky-800">{stats.pending}건</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <span className="block text-xs font-medium text-amber-700">심층검토중</span>
                <span className="text-xl font-bold font-mono text-amber-800">{stats.reviewing}건</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="block text-xs font-medium text-emerald-700">맞춤상담완료</span>
                <span className="text-xl font-bold font-mono text-emerald-800">{stats.completed}건</span>
              </div>
            </div>

            {/* Filter Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 border-b border-slate-200">
              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="신청자, 기업명, 연락처 검색"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 pr-4 py-1.5 w-52 md:w-64 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-950 focus:border-slate-950 transition-all font-sans"
                    id="search-input"
                  />
                </div>

                {/* Status Dropdown */}
                <div className="flex items-center gap-1.5">
                  <Filter className="w-3.5 h-3.5 text-slate-500" />
                  <select
                    value={statusFilter}
                    onChange={(e: any) => setStatusFilter(e.target.value)}
                    className="bg-white border border-slate-300 rounded-lg text-xs px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-950"
                  >
                    <option value="all">전체 상태</option>
                    <option value="pending">접수대기</option>
                    <option value="reviewing">검토중</option>
                    <option value="completed">상담완료</option>
                  </select>
                </div>

                {/* Industry Filter */}
                <select
                  value={industryFilter}
                  onChange={(e) => setIndustryFilter(e.target.value)}
                  className="bg-white border border-slate-300 rounded-lg text-xs px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-slate-950"
                >
                  <option value="all">전체 업종</option>
                  <option value="제조">제조업</option>
                  <option value="도소매">도소매업</option>
                  <option value="서비스">서비스업</option>
                  <option value="IT_정보통신">IT·정보통신업</option>
                  <option value="기타">기타 업종</option>
                </select>
              </div>

              {/* Controls Group */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium shadow-sm transition-colors cursor-pointer"
                  id="export-csv-btn"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>엑셀 파일 다운로드</span>
                </button>
                <button
                  onClick={() => {
                    setSelectedLead(null);
                    setShowPixelOnly(!showPixelOnly);
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-white rounded-lg text-xs font-medium shadow-sm transition-all cursor-pointer ${
                    showPixelOnly 
                      ? 'bg-blue-600 hover:bg-blue-700 ring-2 ring-blue-500/30' 
                      : 'bg-indigo-650 hover:bg-indigo-700'
                  }`}
                  id="pixel-settings-tab-btn"
                  title="메타 픽셀(Meta Pixel) 광고 전환 추적 연동 관리"
                >
                  <Settings className="w-4 h-4 text-white/90 animate-spin-slow" />
                  <span>메타 픽셀 연동 관리</span>
                </button>
              </div>
            </div>

            {/* List Table wrapper */}
            <div className="flex-1 overflow-y-auto">
              {filteredLeads.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                  <AlertCircle className="w-10 h-10 mb-2 stroke-1 text-slate-300" />
                  <p className="text-sm">조건에 일치하는 진단 신청 내역이 없습니다.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-200">
                  {filteredLeads.map((lead) => {
                    const isSelected = selectedLead?.id === lead.id;
                    return (
                      <div
                        key={lead.id}
                        onClick={() => {
                          setSelectedLead(lead);
                          setMemoText(lead.adminMemo);
                          setMemoStatus(lead.status);
                          setShowPixelOnly(false);
                        }}
                        className={`p-4 transition-colors cursor-pointer flex items-center justify-between hover:bg-slate-100 ${
                          isSelected ? 'bg-slate-200/80 border-l-4 border-slate-900' : 'bg-white'
                        }`}
                        id={`lead-item-${lead.id}`}
                      >
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="flex items-center gap-2 mb-1.5">
                            {lead.status === 'pending' && (
                              <span className="flex items-center gap-1 px-1.5 py-0.5 bg-sky-100 text-sky-800 text-[10px] font-semibold rounded-md">
                                <Clock className="w-2.5 h-2.5" /> 신규접수
                              </span>
                            )}
                            {lead.status === 'reviewing' && (
                              <span className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-semibold rounded-md">
                                <Clock className="w-2.5 h-2.5 animate-pulse" /> 검토중
                              </span>
                            )}
                            {lead.status === 'completed' && (
                              <span className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-semibold rounded-md">
                                <CheckCircle className="w-2.5 h-2.5" /> 상담완료
                              </span>
                            )}
                            <span className="text-xs font-mono text-slate-400 font-medium">{lead.submittedAt}</span>
                          </div>
                          
                          <div className="flex items-baseline gap-2">
                            <span className="font-semibold text-slate-900 text-sm">{lead.name} 대표님</span>
                            <span className="text-xs text-slate-500 font-medium max-w-[140px] truncate">{lead.companyName}</span>
                            <span className="text-[11px] px-1.5 py-0.2 bg-slate-100 text-slate-600 rounded font-medium border border-slate-200">
                              {getIndustryLabel(lead.industry)}
                            </span>
                          </div>

                          <div className="flex gap-x-3 gap-y-1 text-slate-500 text-xs mt-1 font-sans">
                            <span>연락처: <strong className="font-mono text-slate-700">{lead.phone}</strong></span>
                            <span>|</span>
                            <span>업력: <strong className="text-slate-700">{getYearsLabel(lead.businessYears)}</strong></span>
                          </div>
                        </div>

                        {/* Right quick stats */}
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <span className="block text-[10px] text-slate-400 font-medium">매치 진단율</span>
                            <span className="font-bold text-slate-900 text-sm font-mono">{lead.score}%</span>
                          </div>
                          <button
                            onClick={(e) => handleDeleteLead(lead.id, e)}
                            className="p-1.5 text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="삭제"
                            id={`delete-lead-btn-${lead.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Detail Inspect Pane */}
          <div className="w-full md:w-96 flex flex-col bg-white overflow-y-auto border-l border-slate-200 font-sans">
            {selectedLead && !showPixelOnly ? (
              <div className="flex-1 flex flex-col h-full">
                
                {/* Detail Section */}
                <div className="p-5 border-b border-slate-200 bg-slate-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] px-2 py-0.5 bg-slate-950 text-white rounded font-mono font-medium">
                      진단 분석표 # {selectedLead.id.replace('lead-', '')}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">Score: {selectedLead.score}/100</span>
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 leading-tight">{selectedLead.companyName}</h4>
                  <p className="text-sm text-slate-600 mt-1">{selectedLead.name} 대표자 | {selectedLead.phone}</p>
                </div>

                <div className="p-5 space-y-5 flex-1 select-text font-sans">
                  
                  {/* Company Profile Card */}
                  <div className="text-xs space-y-2">
                    <h5 className="font-semibold text-slate-700 text-xs uppercase tracking-wider mb-2">기업 기초 정보</h5>
                    <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                      <div>
                        <span className="block text-[10px] text-slate-400">업종</span>
                        <span className="font-medium text-slate-800">{getIndustryLabel(selectedLead.industry)}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400">업력</span>
                        <span className="font-medium text-slate-800">{getYearsLabel(selectedLead.businessYears)}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400">연 매출 규모</span>
                        <span className="font-medium text-slate-800">{getRevenueLabel(selectedLead.revenue)}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-slate-400">추천 매칭율</span>
                        <span className="font-bold text-emerald-600 font-mono text-xs">{selectedLead.score}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="text-xs">
                    <h5 className="font-semibold text-slate-700 text-xs uppercase tracking-wider mb-2">1차 자동 추천 정책자금</h5>
                    <div className="space-y-1.5">
                      {selectedLead.potentialFunds.map((fund, idx) => (
                        <div key={idx} className="flex gap-2 p-2 bg-emerald-50/70 border border-emerald-100 rounded-lg text-[11px] leading-snug font-medium text-slate-800">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>{fund}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Inquiry details */}
                  <div className="text-xs">
                    <h5 className="font-semibold text-slate-700 text-xs uppercase tracking-wider mb-1.5">문의 내용 주요 확인</h5>
                    <div className="p-3 bg-slate-50 rounded-lg leading-relaxed text-slate-700 whitespace-pre-wrap border border-slate-200 select-text font-sans">
                      {selectedLead.message || '(추가 기재 사항 없음)'}
                    </div>
                  </div>

                  {/* Consultant Memo Form */}
                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <h5 className="font-semibold text-slate-800 text-xs uppercase tracking-wider">컨설턴트 사후 관리 정보</h5>
                    
                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">진행 현황 업데이트</label>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          onClick={() => setMemoStatus('pending')}
                          className={`py-1 text-xs font-medium rounded-md border transition-all ${
                            memoStatus === 'pending'
                              ? 'bg-sky-50 text-sky-800 border-sky-300 shadow-sm font-semibold'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          접수대기
                        </button>
                        <button
                          onClick={() => setMemoStatus('reviewing')}
                          className={`py-1 text-xs font-medium rounded-md border transition-all ${
                            memoStatus === 'reviewing'
                              ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-sm font-semibold'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          검토중
                        </button>
                        <button
                          onClick={() => setMemoStatus('completed')}
                          className={`py-1 text-xs font-medium rounded-md border transition-all ${
                            memoStatus === 'completed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-sm font-semibold'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          상담완료
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] text-slate-400 mb-1">상담 요약 및 관리 메모</label>
                      <textarea
                        value={memoText}
                        onChange={(e) => setMemoText(e.target.value)}
                        placeholder="정밀 진단 후 기관 추천, 대표자 신용도 연계 특이사항, 연락 가능 전용 시간대 등을 기재하세요."
                        className="w-full p-2.5 h-24 bg-slate-50 border border-slate-300 rounded-lg text-xs font-sans text-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white resize-none"
                      />
                    </div>

                    <button
                      onClick={handleSaveMemo}
                      className="w-full flex items-center justify-center gap-1.5 py-2 bg-slate-900 hover:bg-slate-950 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors cursor-pointer font-sans"
                      id="memo-save-btn"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>메모 및 진행현황 업데이트 저장</span>
                    </button>
                  </div>

                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col p-5 space-y-6 select-text overflow-y-auto">
                {/* Pixel configuration form */}
                <div className="p-4 bg-slate-900 rounded-2xl text-white border border-slate-800 shadow-lg relative overflow-hidden font-sans">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                    <Zap className="w-24 h-24 text-blue-400" />
                  </div>
                  
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1 px-2 rounded-md bg-blue-600/90 text-white text-[10px] font-bold font-mono uppercase tracking-wider">Meta Pixel Config</div>
                    {pixelId ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800/60 animate-pulse">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                        실시간 작동 상태
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-400 font-bold bg-slate-850 px-2.5 py-0.5 rounded-full border border-slate-700">
                        비활성화됨
                      </span>
                    )}
                  </div>
                  
                  <h4 className="font-extrabold text-[13px] md:text-[14px]">메타 픽셀 광고 연동 센터</h4>
                  <p className="text-[11px] text-slate-300 mt-1 leading-normal">
                    페이스북(Meta) 광고를 진행하시는 경우, 고객들이 자가진단을 완료하고 디비를 남길 때 메타 픽셀의 <span className="font-semibold text-blue-400 font-mono">Standard Event (Lead)</span>를 연계 구동하여 광고 전환 성과를 추적할 수 있습니다.
                  </p>

                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-2 text-xs">
                    <label className="block text-[11px] font-bold text-slate-400">Meta Pixel ID (페이스북 픽셀 번호 입력)</label>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="픽셀 아이디 번호 입력..."
                        value={pixelId}
                        onChange={(e) => {
                          setPixelId(e.target.value.replace(/[^0-9]/g, ''));
                          setPixelSaveMessage('');
                        }}
                        maxLength={20}
                        className="flex-1 bg-slate-950 border border-slate-750 p-2 rounded-lg font-mono text-xs tracking-wider text-center text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        id="meta-pixel-id-input"
                      />
                      <button
                        onClick={() => {
                          setStoredMetaPixelId(pixelId);
                          initMetaPixel();
                          setPixelSaveMessage('설정이 정상 반영되었습니다!');
                          setTimeout(() => setPixelSaveMessage(''), 2500);
                        }}
                        className="px-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                        id="save-pixel-id-btn"
                      >
                        적용
                      </button>
                    </div>
                    {pixelSaveMessage && (
                      <p className="text-[10px] text-emerald-400 font-semibold text-center animate-pulse">{pixelSaveMessage}</p>
                    )}
                  </div>
                </div>

                {/* Pixel Live Logs Console */}
                <div className="flex-1 flex flex-col min-h-[180px] bg-slate-50 border border-slate-200 rounded-xl overflow-hidden font-sans">
                  <div className="px-3.5 py-2.5 bg-slate-100 border-b border-slate-200 flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-slate-600 animate-spin-slow" />
                      <span className="text-xs font-bold text-slate-700">픽셀 추적 이벤트 수집 로그 (최신)</span>
                    </div>
                    {pixelLogs.length > 0 && (
                      <button 
                        onClick={() => {
                          clearPixelLogs();
                          setPixelLogs([]);
                        }}
                        className="text-[10px] text-red-650 hover:underline font-bold"
                        id="clear-pixel-logs-btn"
                      >
                        로그 초기화
                      </button>
                    )}
                  </div>
                  
                  <div className="flex-1 p-3 overflow-y-auto max-h-[190px] space-y-1.5 font-mono text-[10px] bg-slate-900 border-t border-slate-200">
                    {pixelLogs.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 py-6">
                        <Zap className="w-5 h-5 text-slate-500 stroke-[1.5] mb-1 animate-pulse" />
                        <span className="text-[10px] leading-relaxed text-slate-400">수집된 픽셀 전송 로그가 없습니다.</span>
                        <span className="text-[9px] text-slate-500 mt-0.5 whitespace-nowrap">자가진단을 제출하여 실제 픽셀 이벤트를 테스트 해보세요.</span>
                      </div>
                    ) : (
                      pixelLogs.map((log) => (
                        <div key={log.id} className="p-2.5 bg-slate-950 text-slate-200 rounded-lg border border-slate-800 space-y-1 relative">
                          <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-1 flex-wrap gap-1">
                            <span className="text-blue-400 font-bold">fbq('track', '{log.eventName}')</span>
                            <span className="text-[9px] text-slate-500">{log.timestamp}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 block text-[9px] font-sans">전송 파라미터(Params):</span>
                            <pre className="text-[9px] text-emerald-400 whitespace-pre-wrap leading-tight mt-0.5 overflow-x-auto font-mono max-h-[80px]">
                              {JSON.stringify(log.params, null, 2)}
                            </pre>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Info guidance footer summary */}
                <div className="p-3.5 bg-blue-50/50 border border-blue-100 rounded-xl flex gap-2.5 items-start font-sans">
                  <AlertCircle className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                  <div className="text-[11px] leading-relaxed text-blue-900">
                    <strong className="block font-bold">💡 메타 픽셀 동작 검증 안내</strong>
                    1. 메타 픽셀 번호 입력 및 적용 후 사이트에서 리드를 남기면 브라우저 백그라운드 및 프론트에서 페이스북 공식 SDK로 픽셀 전송을 수행합니다.<br/>
                    2. 크롬 브라우저의 <span className="font-semibold">Pixel Helper 익스텐션</span>을 설치하여 실제 전송값 및 통화 규격을 손쉽게 테스트할 수 있습니다.
                  </div>
                </div>

                {/* Guide notice is still available at bottom */}
                <div className="pt-4 border-t border-slate-100 flex flex-col items-center justify-center text-center text-slate-400 font-sans">
                  <FileText className="w-8 h-8 mb-1.5 stroke-1 text-slate-300" />
                  <p className="text-xs font-semibold text-slate-500">진단 상세조회 가이드</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 max-w-[200px] leading-relaxed">
                    실시간 리드 리스트의 대표님 혹은 회사명을 선택하시면 세부 정책자금 맞춤 필터링 요약정보와 컨설턴트 기록 메모장 기능을 이용 수 있습니다.
                  </p>
                </div>

              </div>
            )}
          </div>

        </div>
      </motion.div>
    </div>
  );
}
