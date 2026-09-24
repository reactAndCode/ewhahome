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
  fetchHeroData,
  fetchCards,
  updateHeroData,
  updateCards,
  uploadImageToSupabase,
  fetchKidPhotos,
  createKidPhoto,
  deleteKidPhoto,
  KidActivityPhoto,
  MainHeroData, 
  BeforeAfterCardData,
  AuthUser,
  DEFAULT_HERO_DATA,
  DEFAULT_CARDS
} from '../../lib/store';
import { isSupabaseConfigured } from '../../lib/supabase';
import { 
  ShieldCheck, 
  Save, 
  RotateCcw, 
  ArrowLeft, 
  Upload, 
  CheckCircle2, 
  Image as ImageIcon,
  Sparkles,
  Database,
  Palette,
  Trash2,
  PlusCircle,
  FolderHeart,
  Calendar,
  Tag
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

  // 어드민 대메뉴 탭 ('blog_settings' | 'kid_photos')
  const [adminTab, setAdminTab] = useState<'blog_settings' | 'kid_photos'>('blog_settings');

  // 블로그 메인 & 카드 상태
  const [heroData, setHeroData] = useState<MainHeroData>(DEFAULT_HERO_DATA);
  const [cards, setCards] = useState<BeforeAfterCardData[]>(DEFAULT_CARDS);
  const [activeCardTab, setActiveCardTab] = useState(1);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // 학부모 활동 사진 관리 상태
  const [kidPhotos, setKidPhotos] = useState<KidActivityPhoto[]>([]);
  const [newKidUserId, setNewKidUserId] = useState('parent_minji');
  const [newKidName, setNewKidName] = useState('김민지 (8세)');
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoDate, setNewPhotoDate] = useState('2026.05.02');
  const [newPhotoTag, setNewPhotoTag] = useState('자유표현');
  const [newPhotoUrl, setNewPhotoUrl] = useState('/img/1000082847.jpg');
  const [newTeacherComment, setNewTeacherComment] = useState('');
  const [kidPhotoSuccess, setKidPhotoSuccess] = useState(false);
  const [kidPhotoUploading, setKidPhotoUploading] = useState(false);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    // 1) 캐시 로드
    setHeroData(getStoredHeroData());
    setCards(getStoredCards());

    // 2) Supabase 최신 데이터 로드
    fetchHeroData().then(data => setHeroData(data));
    fetchCards().then(data => setCards(data));
    loadKidPhotos();
  }, []);

  const loadKidPhotos = async () => {
    const list = await fetchKidPhotos();
    if (list) {
      setKidPhotos(list);
    }
  };

  // 블로그 사진 업로드 핸들러 (Supabase Storage 버킷 우선 업로드 -> 실패시 Base64 Fallback)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const storageUrl = await uploadImageToSupabase(file, 'hero');
      if (storageUrl) {
        callback(storageUrl);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          callback(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.warn('스토리지 업로드 예외 발생, 로컬 Fallback:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          callback(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  // 학부모 활동 사진 전용 업로드 핸들러
  const handleKidPhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setKidPhotoUploading(true);
    try {
      const storageUrl = await uploadImageToSupabase(file, 'activities');
      if (storageUrl) {
        setNewPhotoUrl(storageUrl);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.warn('스토리지 업로드 예외:', err);
    } finally {
      setKidPhotoUploading(false);
    }
  };

  // 신규 학부모 활동사진 등록 (원장선생님 전용)
  const handleCreateKidPhoto = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoTitle) {
      alert('작품 제목을 입력해 주세요.');
      return;
    }

    setKidPhotoUploading(true);
    try {
      await createKidPhoto({
        userId: newKidUserId,
        kidName: newKidName,
        title: newPhotoTitle,
        date: newPhotoDate,
        photoUrl: newPhotoUrl,
        teacherComment: newTeacherComment || '자신만의 관찰과 독창적인 색채 표현이 돋보이는 작품입니다.',
        tag: newPhotoTag
      });

      await loadKidPhotos();
      setKidPhotoSuccess(true);
      setTimeout(() => setKidPhotoSuccess(false), 3500);

      // 폼 초기화
      setNewPhotoTitle('');
      setNewTeacherComment('');
    } catch (err) {
      console.error(err);
      alert('활동 사진 등록 중 오류가 발생했습니다.');
    } finally {
      setKidPhotoUploading(false);
    }
  };

  // 활동 사진 삭제
  const handleDeleteKidPhoto = async (id: string, title: string) => {
    if (confirm(`'${title}' 활동 사진을 정말 삭제하시겠습니까?`)) {
      await deleteKidPhoto(id);
      await loadKidPhotos();
    }
  };

  // 저장하기 (Supabase DB + Local Fallback 동시 저장)
  const handleSaveAll = async () => {
    setSaving(true);
    try {
      await Promise.all([
        updateHeroData(heroData),
        updateCards(cards)
      ]);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (e) {
      console.error('저장 실패:', e);
      alert('저장 중 일부 오류가 발생했습니다. 로컬 캐시에는 저장되었습니다.');
    } finally {
      setSaving(false);
    }
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
              블로그 메인 섹션, 4개 성장 카드 및 <strong>학부모 내아이 활동 사진</strong>을 실시간으로 등록·관리합니다.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {adminTab === 'blog_settings' && (
              <>
                <button onClick={handleResetToDefault} className="nav-btn nav-btn-outline" title="기본값 복원">
                  <RotateCcw size={15} />
                  <span>시안 기본값 복원</span>
                </button>
                <button 
                  onClick={handleSaveAll} 
                  disabled={saving}
                  className="nav-btn nav-btn-primary" 
                  style={{ background: '#0a4d3c', padding: '10px 22px', fontSize: '14px', opacity: saving ? 0.7 : 1 }}
                >
                  <Save size={16} />
                  <span>{saving ? 'Supabase DB 저장 중...' : '변경사항 저장하기'}</span>
                </button>
              </>
            )}
            <Link href="/mypage" className="nav-btn nav-btn-outline" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <FolderHeart size={15} />
              <span>학부모 마이페이지 뷰 확인</span>
            </Link>
          </div>
        </div>

        {/* Supabase 연결 안내 뱃지 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: isSupabaseConfigured ? '#e8f5e9' : '#fff3e0',
          border: `1px solid ${isSupabaseConfigured ? '#a5d6a7' : '#ffe082'}`,
          padding: '10px 16px',
          borderRadius: '10px',
          marginBottom: '20px',
          fontSize: '13px',
          color: isSupabaseConfigured ? '#1b5e20' : '#e65100'
        }}>
          <Database size={16} />
          <span>
            {isSupabaseConfigured 
              ? 'Supabase 클라우드 데이터베이스 & Storage 버킷("blog-images")에 실시간 연동 중입니다.' 
              : 'Supabase 미설정 모드 (브라우저 로컬 스토리지에 안전하게 저장됩니다.)'}
          </span>
        </div>

        {/* 대메뉴 탭 스위처 */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '2px solid #e1ebe7', paddingBottom: '4px' }}>
          <button
            onClick={() => setAdminTab('blog_settings')}
            style={{
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: 800,
              borderRadius: '10px 10px 0 0',
              border: 'none',
              background: adminTab === 'blog_settings' ? '#0a4d3c' : '#eaf2ee',
              color: adminTab === 'blog_settings' ? '#ffffff' : '#496057',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <Sparkles size={16} />
            <span>1. 메인 배너 & 성장 카드 4종 설정</span>
          </button>
          <button
            onClick={() => setAdminTab('kid_photos')}
            style={{
              padding: '12px 24px',
              fontSize: '15px',
              fontWeight: 800,
              borderRadius: '10px 10px 0 0',
              border: 'none',
              background: adminTab === 'kid_photos' ? '#0a4d3c' : '#eaf2ee',
              color: adminTab === 'kid_photos' ? '#ffffff' : '#496057',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s'
            }}
          >
            <Palette size={16} />
            <span>2. 학부모 내아이 활동 사진 등록/관리 (원장님 전용)</span>
            <span style={{ 
              background: adminTab === 'kid_photos' ? '#7ce3cb' : '#c3ded4', 
              color: '#063c2e', 
              fontSize: '11px', 
              padding: '2px 8px', 
              borderRadius: '12px',
              fontWeight: 900
            }}>
              {kidPhotos.length}
            </span>
          </button>
        </div>

        {/* 저장 완료 알림 토스트 */}
        {saveSuccess && (
          <div style={{ background: '#d1f4e9', border: '1px solid #7ed8bf', color: '#064d3c', padding: '14px 20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700 }}>
            <CheckCircle2 size={20} color="#0a4d3c" />
            <span>Supabase 클라우드 데이터베이스 및 브라우저 캐시에 성공적으로 저장되었습니다!</span>
          </div>
        )}

        {/* 활동사진 등록 성공 알림 */}
        {kidPhotoSuccess && (
          <div style={{ background: '#d1f4e9', border: '1px solid #7ed8bf', color: '#064d3c', padding: '14px 20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700 }}>
            <CheckCircle2 size={20} color="#0a4d3c" />
            <span>학부모 활동 사진이 Supabase Storage 및 DB에 성공적으로 등록되었습니다! 학부모 마이페이지에서 즉시 조회 가능합니다.</span>
          </div>
        )}

        {/* =========================================================================
            탭 1: 메인 배너 및 성장 카드 설정
            ========================================================================= */}
        {adminTab === 'blog_settings' && (
          <>
            {/* 섹션 1: 메인 히어로 배너 설정 */}
            <div className="admin-card">
              <div className="admin-card-title">
                <Sparkles size={20} color="#0a4d3c" />
                <span>메인 히어로 Before & After 배너 설정</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
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
              </div>

              <div className="form-group">
                <label className="form-label">설명 문구 (Description)</label>
                <textarea
                  rows={2}
                  className="form-textarea"
                  value={heroData.description}
                  onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
                />
              </div>

              {/* 히어로 Before & After 이미지 선택 */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '20px' }}>
                {/* Before 이미지 */}
                <div style={{ background: '#f9fbfb', padding: '16px', borderRadius: '12px', border: '1px solid #e2ebe6' }}>
                  <label className="form-label" style={{ color: '#0a4d3c', fontWeight: 800 }}>
                    1. Before 이미지 (스케치/과정)
                  </label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={heroData.beforeImg}
                      onChange={(e) => setHeroData({ ...heroData, beforeImg: e.target.value })}
                    />
                    <label className="nav-btn nav-btn-outline" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      <Upload size={14} />
                      <span>{uploadingImage ? '업로드 중...' : '내 사진 선택'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        onChange={(e) => handleFileUpload(e, (url) => setHeroData({ ...heroData, beforeImg: url }))} 
                      />
                    </label>
                  </div>
                  <div className="img-preview-box">
                    <Image src={heroData.beforeImg} alt="Before Preview" fill style={{ objectFit: 'contain' }} />
                  </div>
                </div>

                {/* After 이미지 */}
                <div style={{ background: '#f9fbfb', padding: '16px', borderRadius: '12px', border: '1px solid #e2ebe6' }}>
                  <label className="form-label" style={{ color: '#0a4d3c', fontWeight: 800 }}>
                    2. After 이미지 (완성작)
                  </label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={heroData.afterImg}
                      onChange={(e) => setHeroData({ ...heroData, afterImg: e.target.value })}
                    />
                    <label className="nav-btn nav-btn-outline" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      <Upload size={14} />
                      <span>{uploadingImage ? '업로드 중...' : '내 사진 선택'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                        onChange={(e) => handleFileUpload(e, (url) => setHeroData({ ...heroData, afterImg: url }))} 
                      />
                    </label>
                  </div>
                  <div className="img-preview-box">
                    <Image src={heroData.afterImg} alt="After Preview" fill style={{ objectFit: 'contain' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* 섹션 2: 하단 Before & After 카드 4종 설정 */}
            <div className="admin-card">
              <div className="admin-card-title">
                <ImageIcon size={20} color="#0a4d3c" />
                <span>하단 Before & After 학생 성장 카드 (4종) 설정</span>
              </div>

              {/* 카드 선택 탭 */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                {cards.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCardTab(c.id)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '8px',
                      border: activeCardTab === c.id ? '2px solid #0a4d3c' : '1px solid #ddd',
                      background: activeCardTab === c.id ? '#0a4d3c' : '#fff',
                      color: activeCardTab === c.id ? '#fff' : '#496057',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    카드 {c.id}: {c.student} ({c.age})
                  </button>
                ))}
              </div>

              {/* 현재 선택된 카드 수정 폼 */}
              <div style={{ background: '#fdfefe', padding: '20px', borderRadius: '12px', border: '1px solid #e2ebe6' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">카드 제목</label>
                    <input
                      type="text"
                      className="form-input"
                      value={currentEditCard.title}
                      onChange={(e) => updateCardField('title', e.target.value)}
                    />
                  </div>
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
                    <label className="form-label">나이 / 학년</label>
                    <input
                      type="text"
                      className="form-input"
                      value={currentEditCard.age}
                      onChange={(e) => updateCardField('age', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">변화 및 성장 설명</label>
                  <textarea
                    rows={2}
                    className="form-textarea"
                    value={currentEditCard.description}
                    onChange={(e) => updateCardField('description', e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '16px' }}>
                  {/* 카드 Before */}
                  <div>
                    <label className="form-label">Before 이미지 URL</label>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input
                        type="text"
                        className="form-input"
                        value={currentEditCard.beforeImg}
                        onChange={(e) => updateCardField('beforeImg', e.target.value)}
                      />
                      <label className="nav-btn nav-btn-outline" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        <Upload size={14} />
                        <span>선택</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handleFileUpload(e, (url) => updateCardField('beforeImg', url))}
                        />
                      </label>
                    </div>
                    <div className="img-preview-box" style={{ height: '160px' }}>
                      <Image src={currentEditCard.beforeImg} alt="Card Before" fill style={{ objectFit: 'contain' }} />
                    </div>
                  </div>

                  {/* 카드 After */}
                  <div>
                    <label className="form-label">After 이미지 URL</label>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                      <input
                        type="text"
                        className="form-input"
                        value={currentEditCard.afterImg}
                        onChange={(e) => updateCardField('afterImg', e.target.value)}
                      />
                      <label className="nav-btn nav-btn-outline" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        <Upload size={14} />
                        <span>선택</span>
                        <input
                          type="file"
                          accept="image/*"
                          style={{ display: 'none' }}
                          onChange={(e) => handleFileUpload(e, (url) => updateCardField('afterImg', url))}
                        />
                      </label>
                    </div>
                    <div className="img-preview-box" style={{ height: '160px' }}>
                      <Image src={currentEditCard.afterImg} alt="Card After" fill style={{ objectFit: 'contain' }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* =========================================================================
            탭 2: 학부모 내아이 활동 사진 등록/관리 (원장님 전담)
            ========================================================================= */}
        {adminTab === 'kid_photos' && (
          <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: '24px' }}>
            {/* 좌측: 신규 활동 사진 등록 폼 */}
            <div className="admin-card" style={{ height: 'fit-content' }}>
              <div className="admin-card-title">
                <PlusCircle size={20} color="#0a4d3c" />
                <span>새 활동 사진 등록</span>
              </div>
              <p style={{ fontSize: '13px', color: '#688077', marginTop: '-8px', marginBottom: '16px' }}>
                원장선생님이 사진과 피드백을 등록하면 해당 학부모 마이페이지에 액자로 즉시 전시됩니다.
              </p>

              <form onSubmit={handleCreateKidPhoto}>
                <div className="form-group">
                  <label className="form-label">대상 학부모 계정 ID</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="예: parent_minji"
                    value={newKidUserId}
                    onChange={(e) => setNewKidUserId(e.target.value)}
                    required
                  />
                  <span style={{ fontSize: '11px', color: '#778e85', marginTop: '2px', display: 'block' }}>
                    * 기본 데모 학부모: <code>parent_minji</code>
                  </span>
                </div>

                <div className="form-group">
                  <label className="form-label">원생 이름 / 나이</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="예: 김민지 (8세)"
                    value={newKidName}
                    onChange={(e) => setNewKidName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">작품 제목</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="예: 바닷속 이야기와 반짝이는 물고기"
                    value={newPhotoTitle}
                    onChange={(e) => setNewPhotoTitle(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">수업 일자</label>
                    <input
                      type="text"
                      className="form-input"
                      value={newPhotoDate}
                      onChange={(e) => setNewPhotoDate(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">수업 영역 / 태그</label>
                    <select
                      className="form-input"
                      value={newPhotoTag}
                      onChange={(e) => setNewPhotoTag(e.target.value)}
                    >
                      <option value="관찰드로잉">관찰드로잉</option>
                      <option value="동작드로잉">동작드로잉</option>
                      <option value="독서융합">독서융합</option>
                      <option value="혼합재료">혼합재료</option>
                      <option value="기초디자인">기초디자인</option>
                      <option value="자유표현">자유표현</option>
                    </select>
                  </div>
                </div>

                {/* 작품 사진 업로드 */}
                <div className="form-group">
                  <label className="form-label">작품 사진 (Supabase Storage 버킷 자동 업로드)</label>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    <input
                      type="text"
                      className="form-input"
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      required
                    />
                    <label className="nav-btn nav-btn-outline" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                      <Upload size={14} />
                      <span>{kidPhotoUploading ? '업로드중' : '사진 선택'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleKidPhotoUpload}
                      />
                    </label>
                  </div>
                  <div className="img-preview-box" style={{ height: '150px' }}>
                    <Image src={newPhotoUrl} alt="새 작품 미리보기" fill style={{ objectFit: 'contain' }} />
                  </div>
                </div>

                {/* 원장선생님 피드백 코멘트 */}
                <div className="form-group">
                  <label className="form-label">원장 / 선생님의 전문 지도 피드백 코멘트</label>
                  <textarea
                    rows={3}
                    className="form-textarea"
                    placeholder="예: 형태 관찰력이 부쩍 향상되었으며, 대칭과 비례를 스스로 생각하여 표현해낸 멋진 작품입니다."
                    value={newTeacherComment}
                    onChange={(e) => setNewTeacherComment(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={kidPhotoUploading}
                  className="hero-btn"
                  style={{
                    width: '100%',
                    justifyContent: 'center',
                    background: '#0a4d3c',
                    color: '#fff',
                    padding: '12px',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    opacity: kidPhotoUploading ? 0.7 : 1
                  }}
                >
                  <Palette size={16} />
                  <span>{kidPhotoUploading ? '클라우드 저장 중...' : '학부모 갤러리에 액자로 등록하기'}</span>
                </button>
              </form>
            </div>

            {/* 우측: 등록된 활동 사진 목록 */}
            <div className="admin-card">
              <div className="admin-card-title" style={{ justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FolderHeart size={20} color="#0a4d3c" />
                  <span>등록된 활동 사진 목록 ({kidPhotos.length}개)</span>
                </div>
                <button
                  onClick={loadKidPhotos}
                  className="nav-btn nav-btn-outline"
                  style={{ padding: '4px 10px', fontSize: '12px' }}
                >
                  새로고침
                </button>
              </div>

              {kidPhotos.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
                  <Palette size={40} style={{ opacity: 0.5, marginBottom: '8px' }} />
                  <p>아직 등록된 활동 사진이 없습니다. 좌측 폼에서 첫 사진을 등록해보세요!</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {kidPhotos.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: 'flex',
                        gap: '16px',
                        background: '#f9fbfb',
                        border: '1px solid #e1ece6',
                        borderRadius: '12px',
                        padding: '14px',
                        alignItems: 'center'
                      }}
                    >
                      {/* 사진 썸네일 */}
                      <div style={{ position: 'relative', width: '90px', height: '90px', borderRadius: '8px', overflow: 'hidden', flexShrink: 0, background: '#eee' }}>
                        <Image src={item.photoUrl} alt={item.title} fill style={{ objectFit: 'cover' }} />
                      </div>

                      {/* 정보 */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '11px', fontWeight: 800, background: '#0a4d3c', color: '#fff', padding: '2px 8px', borderRadius: '6px' }}>
                            {item.kidName}
                          </span>
                          <span style={{ fontSize: '11px', color: '#688077' }}>
                            학부모: <code>{item.userId}</code>
                          </span>
                          <span style={{ fontSize: '11px', color: '#888' }}>
                            • {item.date}
                          </span>
                          <span style={{ fontSize: '11px', background: '#e3f3ed', color: '#0a4d3c', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                            {item.tag || '미술활동'}
                          </span>
                        </div>

                        <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#1a332a', margin: '0 0 6px 0' }}>
                          {item.title}
                        </h4>

                        {item.teacherComment && (
                          <p style={{ fontSize: '12px', color: '#556a62', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            💬 "{item.teacherComment}"
                          </p>
                        )}
                      </div>

                      {/* 삭제 버튼 */}
                      <button
                        onClick={() => handleDeleteKidPhoto(item.id, item.title)}
                        style={{
                          background: '#fff0f0',
                          border: '1px solid #fecaca',
                          color: '#dc2626',
                          borderRadius: '8px',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                          fontSize: '12px',
                          fontWeight: 700,
                          flexShrink: 0
                        }}
                        title="활동 사진 삭제"
                      >
                        <Trash2 size={14} />
                        <span>삭제</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
