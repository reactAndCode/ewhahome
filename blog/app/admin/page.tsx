'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  getStoredHeroData, 
  saveHeroData, 
  getStoredCards, 
  saveCards, 
  getCurrentUser, 
  setCurrentUser,
  MainHeroData, 
  BeforeAfterCardData,
  AuthUser,
  DEFAULT_HERO_DATA,
  DEFAULT_CARDS
} from '../../lib/store';
import { 
  ShieldCheck, 
  Save, 
  RotateCcw, 
  ArrowLeft, 
  Upload, 
  CheckCircle2, 
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';

const PRESET_IMAGES = [
  { name: '스케치 수업 (Before 추천)', url: '/img/1000075797.jpg' },
  { name: '컬러 완성작 (After 추천)', url: '/img/1000110839.png' },
  { name: '도자기 & 혼합재료', url: '/img/1000082847.jpg' },
  { name: '종이접기 & 드로잉', url: '/img/1000026651.jpg' },
  { name: '역사 융합 미술', url: '/img/1000085952.jpg' },
  { name: '관찰 붓터치 회화', url: '/img/1000056512.jpg' },
  { name: '스케치 초기작 A', url: '/img/1000025516.jpg' },
  { name: '스케치 초기작 B', url: '/img/1000026774.jpg' },
  { name: '미술공작소 표지 포스터', url: '/img/1000110541.png' },
  { name: '동물 드로잉', url: '/img/1000103404.jpg' },
];

export default function AdminPage() {
  const [user, setUser] = useState<AuthUser | null>({
    id: 'admin_master',
    email: 'admin@ewha-art.com',
    name: '총괄 원장선생님',
    role: 'admin'
  });
  const [heroData, setHeroData] = useState<MainHeroData>(DEFAULT_HERO_DATA);
  const [cards, setCards] = useState<BeforeAfterCardData[]>(DEFAULT_CARDS);
  const [activeCardTab, setActiveCardTab] = useState(1);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setHeroData(getStoredHeroData());
    setCards(getStoredCards());
  }, []);

  const handleAdminLogin = () => {
    const adminUser = {
      id: 'admin_master',
      email: 'admin@ewha-art.com',
      name: '총괄 원장선생님',
      role: 'admin' as const
    };
    setCurrentUser(adminUser);
    setUser(adminUser);
  };

  // 로컬 파일 업로드 핸들러
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          callback(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // 저장하기
  const handleSaveAll = () => {
    saveHeroData(heroData);
    saveCards(cards);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3500);
  };

  // 기본값 초기화
  const handleResetToDefault = () => {
    if (confirm('기본 시안 데이터로 초기화하시겠습니까?')) {
      setHeroData(DEFAULT_HERO_DATA);
      setCards(DEFAULT_CARDS);
      saveHeroData(DEFAULT_HERO_DATA);
      saveCards(DEFAULT_CARDS);
      alert('기본 시안으로 복원되었습니다.');
    }
  };

  const currentEditCard = cards.find(c => c.id === activeCardTab) || cards[0];

  const updateCardField = (field: keyof BeforeAfterCardData, value: string) => {
    setCards(prev => prev.map(c => c.id === activeCardTab ? { ...c, [field]: value } : c));
  };

  return (
    <div className="admin-page-wrap">
      <div className="container">
        {/* 상단 네비게이션 & 권한 헤더 */}
        <div className="admin-header">
          <div>
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0a4d3c', fontSize: '14px', fontWeight: 700, marginBottom: '6px' }}>
              <ArrowLeft size={16} />
              <span>블로그 홈(blogHome)으로 돌아가기</span>
            </Link>
            <h1>어드민 관리자 대시보드</h1>
            <p style={{ color: '#5e736c', fontSize: '14px' }}>
              블로그 메인 섹션과 하단 Before & After 4개 카드의 이미지 및 텍스트를 실시간으로 설정합니다.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={handleResetToDefault} className="nav-btn nav-btn-outline" title="기본값 복원">
              <RotateCcw size={15} />
              <span>시안 기본값 복원</span>
            </button>
            <button 
              onClick={handleSaveAll} 
              className="nav-btn nav-btn-primary" 
              style={{ background: '#0a4d3c', padding: '10px 22px', fontSize: '14px' }}
            >
              <Save size={16} />
              <span>변경사항 저장하기</span>
            </button>
          </div>
        </div>

        {/* 저장 완료 알림 토스트 */}
        {saveSuccess && (
          <div style={{ background: '#d1f4e9', border: '1px solid #7ed8bf', color: '#064d3c', padding: '14px 20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700 }}>
            <CheckCircle2 size={20} color="#0a4d3c" />
            <span>설정이 성공적으로 저장되었습니다! 메인 블로그 화면에 즉시 적용되었습니다.</span>
            <Link href="/" style={{ marginLeft: 'auto', textDecoration: 'underline' }}>
              홈에서 확인하기 →
            </Link>
          </div>
        )}

        {/* 비관리자일 경우 관리자 로그인 전환 배너 */}
        {user?.role !== 'admin' && (
          <div style={{ background: '#fff5e6', border: '1px solid #fed8a7', padding: '16px 20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong style={{ color: '#b86200', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={18} />
                <span>현재 관리자 모드가 아닙니다.</span>
              </strong>
              <p style={{ fontSize: '13px', color: '#805018', marginTop: '2px' }}>
                원활한 이미지 수정 및 저장을 위해 원클릭 어드민 로그인을 진행하세요.
              </p>
            </div>
            <button 
              onClick={handleAdminLogin}
              style={{ background: '#b86200', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontWeight: 800, fontSize: '13px' }}
            >
              어드민으로 전환
            </button>
          </div>
        )}

        {/* =========================================================================
            1. 블로그 메인 섹션 이미지 & 문구 관리 패널
            ========================================================================= */}
        <div className="admin-panel">
          <div className="panel-title">
            <Sparkles size={20} color="#0a4d3c" />
            <span>1. 블로그 메인 섹션 이미지 & 카피 설정 (첨부 시안 상단)</span>
          </div>

          <div className="admin-grid-2">
            {/* 좌측: 텍스트 카피 설정 */}
            <div>
              <div className="form-group">
                <label className="form-label">서브 타이틀</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={heroData.subTitle} 
                  onChange={(e) => setHeroData({ ...heroData, subTitle: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">메인 타이틀</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={heroData.title} 
                  onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">교육철학 설명 문구</label>
                <textarea 
                  rows={4} 
                  className="form-textarea" 
                  value={heroData.description} 
                  onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">버튼 문구</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={heroData.buttonText} 
                  onChange={(e) => setHeroData({ ...heroData, buttonText: e.target.value })}
                />
              </div>
            </div>

            {/* 우측: 메인 Before & After 이미지 선택 */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Before 이미지 설정 */}
              <div>
                <label className="form-label" style={{ fontWeight: 800, color: '#0a4d3c' }}>
                  📸 메인 Before 이미지 (좌측)
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={heroData.beforeImg} 
                    onChange={(e) => setHeroData({ ...heroData, beforeImg: e.target.value })}
                    placeholder="/img/1000075797.jpg 또는 이미지 URL"
                  />
                  <label className="nav-btn nav-btn-outline" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    <Upload size={14} />
                    <span>내 파일</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={(e) => handleFileUpload(e, (url) => setHeroData({ ...heroData, beforeImg: url }))}
                    />
                  </label>
                </div>
                <div className="img-preview-box" style={{ height: '140px' }}>
                  <Image src={heroData.beforeImg} alt="메인 Before 미리보기" fill style={{ objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>Before</span>
                </div>
              </div>

              {/* After 이미지 설정 */}
              <div>
                <label className="form-label" style={{ fontWeight: 800, color: '#0a4d3c' }}>
                  ✨ 메인 After 이미지 (우측)
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={heroData.afterImg} 
                    onChange={(e) => setHeroData({ ...heroData, afterImg: e.target.value })}
                    placeholder="/img/1000110839.png 또는 이미지 URL"
                  />
                  <label className="nav-btn nav-btn-outline" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    <Upload size={14} />
                    <span>내 파일</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={(e) => handleFileUpload(e, (url) => setHeroData({ ...heroData, afterImg: url }))}
                    />
                  </label>
                </div>
                <div className="img-preview-box" style={{ height: '140px' }}>
                  <Image src={heroData.afterImg} alt="메인 After 미리보기" fill style={{ objectFit: 'cover' }} />
                  <span style={{ position: 'absolute', top: 6, left: 6, background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px' }}>After</span>
                </div>
              </div>
            </div>
          </div>

          {/* 원클릭 추천 프리셋 사진 선택기 */}
          <div style={{ marginTop: '24px', borderTop: '1px solid #eef3f0', paddingTop: '16px' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#4d635c', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <ImageIcon size={15} />
              <span>원클릭 추천 사진 선택 (클릭 시 메인 After 또는 Before에 즉시 적용)</span>
            </span>
            <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '6px' }}>
              {PRESET_IMAGES.map((preset, idx) => (
                <div 
                  key={idx} 
                  style={{ flexShrink: 0, width: '130px', textAlign: 'center', cursor: 'pointer', background: '#f8faf9', padding: '6px', borderRadius: '8px', border: '1px solid #e0eae5' }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '70px', borderRadius: '4px', overflow: 'hidden', marginBottom: '4px' }}>
                    <Image src={preset.url} alt={preset.name} fill style={{ objectFit: 'cover' }} />
                  </div>
                  <div style={{ fontSize: '11px', fontWeight: 600, color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{preset.name}</div>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                    <button 
                      onClick={() => setHeroData({ ...heroData, beforeImg: preset.url })} 
                      style={{ flex: 1, fontSize: '10px', background: '#e0f2ed', color: '#0a4d3c', borderRadius: '3px', padding: '2px 0' }}
                    >
                      Before
                    </button>
                    <button 
                      onClick={() => setHeroData({ ...heroData, afterImg: preset.url })} 
                      style={{ flex: 1, fontSize: '10px', background: '#0a4d3c', color: '#fff', borderRadius: '3px', padding: '2px 0' }}
                    >
                      After
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================================
            2. Before & After 4개 카드 이미지 및 내용 관리 패널
            ========================================================================= */}
        <div className="admin-panel" id="cards-editor">
          <div className="panel-title">
            <ImageIcon size={20} color="#0a4d3c" />
            <span>2. Before & After 4개 카드 설정 (하단 썸네일 그리드)</span>
          </div>

          {/* 1~4번 카드 선택 탭 */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            {cards.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCardTab(c.id)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '14px',
                  border: activeCardTab === c.id ? '2px solid #0a4d3c' : '1px solid #d4e2dc',
                  background: activeCardTab === c.id ? '#0a4d3c' : '#ffffff',
                  color: activeCardTab === c.id ? '#ffffff' : '#4b615a',
                  transition: 'all 0.2s ease'
                }}
              >
                카드 #{c.id} ({c.student || '학생 ' + c.id})
              </button>
            ))}
          </div>

          {/* 선택된 카드 편집 폼 */}
          <div className="admin-grid-2">
            <div>
              <div className="form-group">
                <label className="form-label">카드 제목 (변화 주제)</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={currentEditCard.title} 
                  onChange={(e) => updateCardField('title', e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">학생 이름</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={currentEditCard.student} 
                    onChange={(e) => updateCardField('student', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">연령 / 학년</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={currentEditCard.age} 
                    onChange={(e) => updateCardField('age', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">상세 변화 코멘트</label>
                <textarea 
                  rows={3} 
                  className="form-textarea" 
                  value={currentEditCard.description} 
                  onChange={(e) => updateCardField('description', e.target.value)}
                />
              </div>
            </div>

            {/* 카드 Before & After 이미지 선택 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {/* 카드 Before */}
              <div>
                <label className="form-label" style={{ fontWeight: 800, color: '#0a4d3c' }}>
                  카드 #{activeCardTab} Before 이미지
                </label>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={currentEditCard.beforeImg} 
                    onChange={(e) => updateCardField('beforeImg', e.target.value)}
                  />
                  <label className="nav-btn nav-btn-outline" style={{ cursor: 'pointer', padding: '6px 10px' }}>
                    <Upload size={13} />
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={(e) => handleFileUpload(e, (url) => updateCardField('beforeImg', url))}
                    />
                  </label>
                </div>
                <div className="img-preview-box" style={{ height: '150px' }}>
                  <Image src={currentEditCard.beforeImg} alt="카드 Before 미리보기" fill style={{ objectFit: 'cover' }} />
                </div>
              </div>

              {/* 카드 After */}
              <div>
                <label className="form-label" style={{ fontWeight: 800, color: '#0a4d3c' }}>
                  카드 #{activeCardTab} After 이미지
                </label>
                <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={currentEditCard.afterImg} 
                    onChange={(e) => updateCardField('afterImg', e.target.value)}
                  />
                  <label className="nav-btn nav-btn-outline" style={{ cursor: 'pointer', padding: '6px 10px' }}>
                    <Upload size={13} />
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={(e) => handleFileUpload(e, (url) => updateCardField('afterImg', url))}
                    />
                  </label>
                </div>
                <div className="img-preview-box" style={{ height: '150px' }}>
                  <Image src={currentEditCard.afterImg} alt="카드 After 미리보기" fill style={{ objectFit: 'cover' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 하단 저장 버튼 바 */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '24px' }}>
          <button 
            onClick={handleSaveAll} 
            className="hero-btn" 
            style={{ background: '#0a4d3c', color: '#fff', padding: '16px 44px', fontSize: '16px' }}
          >
            <Save size={18} />
            <span>모든 변경사항 블로그에 저장 & 적용하기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
