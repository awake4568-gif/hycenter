/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Image as ImageIcon, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Upload, 
  X, 
  Check, 
  Link2, 
  ArrowUp, 
  ArrowDown, 
  Save,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

// Import default hero preset images so we can fall back or reset easily
import heroGroup from '../assets/images/hy_hero_group_1780906118360.png';
import heroCafe from '../assets/images/hy_hero_cafe_1780910334373.png';
import heroPottery from '../assets/images/hy_hero_pottery_1780910349873.png';
import heroManufacturing from '../assets/images/hy_hero_manufacturing_1780910363887.png';
import heroRestaurant from '../assets/images/hy_hero_restaurant_1780910378961.png';

export interface GalleryItem {
  id: string;
  src: string;
  label: string;
}

export const DEFAULT_GALLERY_PRESETS: GalleryItem[] = [
  { id: '1', src: heroGroup, label: '전문 연구진 그룹' },
  { id: '2', src: heroCafe, label: '카페 소상공인' },
  { id: '3', src: heroPottery, label: '전통 도예 공방' },
  { id: '4', src: heroManufacturing, label: '정밀 제조 중소기업' },
  { id: '5', src: heroRestaurant, label: '한식당 식음료업' },
];

interface AdminGalleryModalProps {
  onClose: () => void;
  onGalleryUpdate: (items: GalleryItem[]) => void;
  initialItems: GalleryItem[];
}

export default function AdminGalleryModal({ onClose, onGalleryUpdate, initialItems }: AdminGalleryModalProps) {
  const [items, setItems] = useState<GalleryItem[]>(initialItems);
  
  // Form input states
  const [newLabel, setNewLabel] = useState('');
  const [newSrcUrl, setNewSrcUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState<'idle' | 'reading' | 'compressing' | 'completed' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if initialItems changes
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // Handle local save & dispatch
  const handleSaveAll = () => {
    if (items.length === 0) {
      alert('최소 1개 이상의 갤러리 이미지가 등록되어 있어야 롤링이 가능합니다.');
      return;
    }
    localStorage.setItem('hy_carousel_images', JSON.stringify(items));
    onGalleryUpdate(items);
    
    // Smooth auto-dismiss toast or animation on target button
    const btn = document.getElementById('gallery-save-btn');
    if (btn) {
      const originalText = btn.innerHTML;
      btn.innerHTML = '성공적으로 저장되었습니다! ✓';
      btn.classList.remove('bg-blue-600');
      btn.classList.add('bg-emerald-600');
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.classList.remove('bg-emerald-600');
        btn.classList.add('bg-blue-600');
        onClose();
      }, 1000);
    }
  };

  // Move item up/down in the rolling index list
  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= items.length) return;
    
    const nextList = [...items];
    const temp = nextList[index];
    nextList[index] = nextList[newIndex];
    nextList[newIndex] = temp;
    
    setItems(nextList);
  };

  // Remove image item from the carousel list
  const handleRemoveItem = (id: string) => {
    if (items.length <= 1) {
      alert('메인 히어로 영역의 슬라이더에는 최하 1개 이상의 작동 이미지가 포함되어야 합니다.');
      return;
    }
    const filtered = items.filter(item => item.id !== id);
    setItems(filtered);
  };

  // Reset to robust high-resolution default preset images
  const handleResetToPresets = () => {
    if (window.confirm('히어로 갤러리 롤링 목록을 최초의 비즈케어정책자금연구소 전문가 및 업종 대표 프리셋 5종으로 원복하시겠습니까?')) {
      setItems(DEFAULT_GALLERY_PRESETS);
    }
  };

  // Smart Canvas Image Resize and Compress to avoid LocalStorage quota limit
  const processImageFile = (file: File) => {
    setUploadProgress('reading');
    setErrorMessage('');
    
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        setUploadProgress('error');
        setErrorMessage('파일 읽기에 실패했습니다.');
        return;
      }

      setUploadProgress('compressing');
      
      const img = new Image();
      img.onload = () => {
        try {
          // Offscreen Canvas setup
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Downscale threshold to maintain high quality yet tiny footprints in LocalStorage
          const MAX_WIDTH = 900;
          const MAX_HEIGHT = 600;

          if (width > MAX_WIDTH || height > MAX_HEIGHT) {
            const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            throw new Error('Canvas 2D context retrieval failed');
          }

          // Use white background in case of transparent png images
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // Highly optimized JPEG at 78% compression quality
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.78);
          
          setNewSrcUrl(compressedDataUrl);
          setUploadProgress('completed');
        } catch (err) {
          console.error(err);
          setUploadProgress('error');
          setErrorMessage('이미지 변환 중 장애가 발생했습니다.');
        }
      };

      img.onerror = () => {
        setUploadProgress('error');
        setErrorMessage('올바른 이미지 파일이 아닙니다.');
      };

      img.src = result;
    };

    fileReader.onerror = () => {
      setUploadProgress('error');
      setErrorMessage('파일을 여는 도중 오류가 생겼습니다.');
    };

    fileReader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  // Add Item Action
  const handleAddNewItem = () => {
    const label = newLabel.trim();
    const src = newSrcUrl.trim();

    if (!label) {
      alert('업종 및 사진 이름(라벨)을 기재해 주세요.');
      return;
    }
    if (!src) {
      alert('사진 파일을 업로드하거나 혹은 이미지 주소(URL)를 입력해 주세요.');
      return;
    }

    const newItem: GalleryItem = {
      id: `img-${Date.now()}`,
      src: src,
      label: label
    };

    setItems(prev => [...prev, newItem]);
    
    // Clear Form for next inputs
    setNewLabel('');
    setNewSrcUrl('');
    setUploadProgress('idle');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm" id="admin-gallery-modal">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="flex flex-col w-full h-[90vh] max-w-5xl overflow-hidden bg-white rounded-2xl shadow-2xl border border-slate-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600">
              <ImageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-lg tracking-tight">메인 롤링 갤러리 관리자 페이지</h3>
              <p className="text-xs text-slate-400 font-mono">Hero Carousel dynamic image settings (Vite Asset Pipeline + LocalCache)</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 transition-colors rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
            title="닫기"
            id="close-gallery-btn"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Dynamic Split Manager layout */}
        <div className="flex flex-1 overflow-hidden flex-col md:flex-row">
          
          {/* Left panel: Registered images listing & order control */}
          <div className="flex flex-col flex-1 border-r border-slate-250 bg-slate-50 overflow-hidden">
            
            {/* Quick Helper Notice */}
            <div className="p-4 bg-blue-50/50 border-b border-blue-105/50 flex gap-2.5 text-xs text-blue-800 leading-relaxed">
              <HelpCircle className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">원하는 이미지를 등록해 내 마음대로 꾸며보세요!</p>
                <p className="text-slate-550 text-[11px] mt-0.5">상단 히어로 롤링 배너에 표시될 항목들의 노출 순서와 텍스트 라벨을 직접 편재할 수 있습니다. 3:2 가로 비율 사진이 가장 깔끔하게 보여집니다.</p>
              </div>
            </div>

            {/* List scroll container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <div className="flex justify-between items-center text-xs font-bold text-slate-500 pb-1">
                <span>현재 등록된 이미지 목록 ({items.length}개)</span>
                <button
                  onClick={handleResetToPresets}
                  className="inline-flex items-center gap-1.5 text-[11px] text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100/80 px-2.5 py-1 rounded-md transition-colors font-semibold"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>기본 제공 프리셋 숲으로 초기화</span>
                </button>
              </div>

              {items.map((item, index) => (
                <div 
                  key={item.id}
                  className="flex items-center gap-4 p-3 bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all font-sans"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-14 rounded-lg overflow-hidden bg-slate-100 border border-slate-250 shrink-0 flex items-center justify-center">
                    <img 
                      src={item.src} 
                      alt={item.label}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Info and action */}
                  <div className="flex-1 min-w-0">
                    <span className="font-extrabold text-slate-800 text-sm block truncate">{item.label}</span>
                    <span className="text-[10px] text-slate-400 font-mono block truncate max-w-[250px] mt-0.5">
                      {item.src.startsWith('data:') ? '사용자 직접 업로드 파일 [Base64 데이터]' : item.src}
                    </span>
                  </div>

                  {/* Ordering & delete actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleMove(index, 'up')}
                      disabled={index === 0}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                      title="위로 이동"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleMove(index, 'down')}
                      disabled={index === items.length - 1}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                      title="아래로 이동"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <div className="w-px h-5 bg-slate-200 mx-1" />
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-1.5 text-slate-300 hover:text-red-650 hover:bg-red-50 rounded"
                      title="삭제"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Save trigger bottom footer bar */}
            <div className="p-4 bg-white border-t border-slate-200/90 flex gap-3">
              <button
                onClick={handleSaveAll}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 cursor-pointer transition-all"
                id="gallery-save-btn"
              >
                <Save className="w-4 h-4" />
                <span>선택된 설정 최종 저장 및 적용</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-3 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-bold border border-slate-200 cursor-pointer transition-colors"
              >
                취소
              </button>
            </div>

          </div>

          {/* Right panel: Add new gallery items (File upload or direct URL) */}
          <div className="w-full md:w-[420px] flex flex-col bg-white overflow-y-auto p-6 font-sans">
            <h4 className="text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              <span>새로운 롤링 이미지 추가인쇄</span>
            </h4>

            <div className="space-y-5">
              
              {/* 1. Label Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  대표인 또는 대표업종명 라벨 <span className="text-red-500">*</span>
                </label>
                <input 
                  type="text"
                  placeholder="예: 금속 절삭 가공업, 플라워 공방 소상공인"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-slate-950 focus:bg-white transition-all"
                />
              </div>

              {/* 2. File Upload Box with Compression Status */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700 flex justify-between items-center">
                  <span>로컬 사진 파일 업로드</span>
                  <span className="text-[10px] text-slate-450 font-normal">자동 압축 지원 (LocalStorage 안심)</span>
                </label>
                
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50/65 hover:bg-blue-50/10 rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px]"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  
                  {uploadProgress === 'idle' && (
                    <>
                      <Upload className="w-8 h-8 text-slate-400 mb-2 stroke-1" />
                      <p className="text-xs font-bold text-slate-700">이곳을 클릭해 파일 열기</p>
                      <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, JPEG 등 이미지 규격 지원</p>
                    </>
                  )}

                  {uploadProgress === 'reading' && (
                    <div className="space-y-2 text-center text-xs text-slate-500">
                      <div className="w-5 h-5 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin mx-auto" />
                      <p>로컬 파일을 읽어들이는 중...</p>
                    </div>
                  )}

                  {uploadProgress === 'compressing' && (
                    <div className="space-y-2 text-center text-xs text-blue-600">
                      <div className="w-5 h-5 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
                      <p className="font-medium animate-pulse">이미지 고품질 최장축 백그라운드 압축 및 크롭 중...</p>
                    </div>
                  )}

                  {uploadProgress === 'completed' && (
                    <div className="text-center space-y-1">
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-1.5">
                        <Check className="w-5 h-5 stroke-[2.5]" />
                      </div>
                      <p className="text-xs font-bold text-emerald-700">사진 등록 준비 완료!</p>
                      <p className="text-[10.5px] text-slate-500">정밀 이미지 경량 가공 처리가 끝났습니다.</p>
                    </div>
                  )}

                  {uploadProgress === 'error' && (
                    <div className="text-center space-y-1.5 text-red-650 p-2">
                      <AlertCircle className="w-6 h-6 mx-auto mb-1 stroke-1" />
                      <p className="text-xs font-bold">진단 수용 오류</p>
                      <p className="text-[10px] text-slate-500">{errorMessage}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* 3. Divider OR */}
              <div className="flex items-center gap-2 text-[11px] font-bold text-slate-400">
                <div className="h-px bg-slate-200 flex-1" />
                <span>또는 이미지 절대 URL 주소 사용</span>
                <div className="h-px bg-slate-200 flex-1" />
              </div>

              {/* 4. URL Input Field */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Link2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>웹 이미지 주소 링크</span>
                </div>
                <input 
                  type="url"
                  placeholder="https://images.unsplash.com/... 또는 기타 주소"
                  value={newSrcUrl}
                  onChange={(e) => {
                    setNewSrcUrl(e.target.value);
                    if (e.target.value && uploadProgress === 'completed') {
                      setUploadProgress('idle');
                    }
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-slate-950 focus:bg-white font-mono break-all transition-all"
                />
              </div>

              {/* 5. Live preview of adding item before dispatch */}
              {newSrcUrl && (
                <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-150">
                  <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">추가될 사진 미리보기</span>
                  <div className="aspect-[3/2] w-full rounded-lg overflow-hidden bg-white border border-slate-200 flex items-center justify-center">
                    <img 
                      src={newSrcUrl} 
                      alt="새 이미지 대기"
                      className="w-full h-full object-contain filter-none"
                      onError={() => {
                        // Soft warning fallback for dead URLs
                        console.warn('Image failed to load');
                      }}
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </div>
              )}

              {/* 6. Save trigger for adding */}
              <button
                onClick={handleAddNewItem}
                className="w-full py-3 bg-slate-900 hover:bg-slate-950 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>현재 이미지를 슬라이더 목록에 조립 추가</span>
              </button>

            </div>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
