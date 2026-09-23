'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  getStoredKidPhotos, 
  addKidPhoto, 
  getCurrentUser, 
  setCurrentUser,
  KidActivityPhoto, 
  AuthUser,
  DEFAULT_KID_PHOTOS
} from '../../lib/store';
import { 
  Heart, 
  PlusCircle, 
  Calendar, 
  Sparkles, 
  ArrowLeft, 
  Upload, 
  CheckCircle2, 
  Maximize2, 
  UserCheck 
} from 'lucide-react';

const DEFAULT_PARENT_USER: AuthUser = {
  id: 'parent_minji',
  email: 'minji_mom@gmail.com',
  name: '김민지 학부모님',
  role: 'parent',
  kidName: '김민지 (8세)'
};

export default function MyPage() {
  const [user, setUser] = useState<AuthUser>(DEFAULT_PARENT_USER);
  const [photos, setPhotos] = useState<KidActivityPhoto[]>(
    DEFAULT_KID_PHOTOS.filter(p => p.userId === 'parent_minji')
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<KidActivityPhoto | null>(null);

  // 새 사진 등록 폼 상태
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026.04.28');
  const [newComment, setNewComment] = useState('');
  const [newTag, setNewTag] = useState('자유표현');
  const [newPhotoUrl, setNewPhotoUrl] = useState('/img/1000082847.jpg');
  const [alertSuccess, setAlertSuccess] = useState(false);

  useEffect(() => {
    let currentUser = getCurrentUser();
    if (!currentUser) {
      currentUser = {
        id: 'parent_minji',
        email: 'minji_mom@gmail.com',
        name: '김민지 학부모님',
        role: 'parent',
        kidName: '김민지 (8세)'
      };
      setCurrentUser(currentUser);
    }
    setUser(currentUser);
    refreshPhotos(currentUser.id);
  }, []);

  const refreshPhotos = (userId: string) => {
    const list = getStoredKidPhotos(userId);
    setPhotos(list);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewPhotoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNewPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    addKidPhoto({
      userId: user.id,
      kidName: user.kidName || user.name,
      title: newTitle || '새로운 미술 작품',
      date: newDate,
      photoUrl: newPhotoUrl,
      teacherComment: newComment || '스스로 색채를 조합하고 끝까지 완성해낸 멋진 작품입니다!',
      tag: newTag
    });

    refreshPhotos(user.id);
    setShowAddModal(false);
    setAlertSuccess(true);
    setTimeout(() => setAlertSuccess(false), 3000);

    // 입력 폼 초기화
    setNewTitle('');
    setNewComment('');
  };

  return (
    <div className="mypage-wrap">
      <div className="container">
        {/* 상단 홈 바로가기 */}
        <div style={{ marginBottom: '16px' }}>
          <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0a4d3c', fontSize: '14px', fontWeight: 700 }}>
            <ArrowLeft size={16} />
            <span>블로그 홈(blogHome)으로 돌아가기</span>
          </Link>
        </div>

        {/* 상단 학부모 환영 웰컴 배너 */}
        <div className="mypage-banner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#7ce3cb' }}>
              <Heart size={18} fill="#7ce3cb" />
              <span style={{ fontSize: '14px', fontWeight: 800, letterSpacing: '0.5px' }}>
                MY CHILD ART ATELIER GALLERY
              </span>
            </div>
            <h1 style={{ fontSize: '30px', fontWeight: 900, marginBottom: '8px' }}>
              {user?.kidName || user?.name}의 아트 갤러리 🖼️
            </h1>
            <p style={{ color: '#d8eee6', fontSize: '15px' }}>
              이화미술공작소에서 스스로 관찰하고 표현한 아이의 성장 발자취가 액자에 담겨 보관됩니다.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
            <button 
              onClick={() => setShowAddModal(true)} 
              className="hero-btn" 
              style={{ background: '#ffffff', color: '#0a4d3c' }}
            >
              <PlusCircle size={18} />
              <span>새 활동 사진 등록</span>
            </button>
            <span style={{ fontSize: '12px', color: '#bce4d8' }}>
              사용자 ID: <strong>{user?.id}</strong>
            </span>
          </div>
        </div>

        {/* 성공 알림 토스트 */}
        {alertSuccess && (
          <div style={{ background: '#d1f4e9', border: '1px solid #7ed8bf', color: '#064d3c', padding: '14px 20px', borderRadius: '12px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700 }}>
            <CheckCircle2 size={20} color="#0a4d3c" />
            <span>새로운 미술 활동 액자가 갤러리에 안전하게 추가되었습니다!</span>
          </div>
        )}

        {/* =========================================================================
            액자식(Art Frame) 갤러리 그리드
            ========================================================================= */}
        <div className="frame-gallery-grid">
          {photos.map((item) => (
            <div key={item.id} className="art-frame-card">
              {/* 액자 속 사진 뷰 */}
              <div className="art-frame-photo" onClick={() => setSelectedPhoto(item)} style={{ cursor: 'pointer' }}>
                <Image 
                  src={item.photoUrl} 
                  alt={item.title} 
                  fill 
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <button 
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.5)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  title="크게 보기"
                >
                  <Maximize2 size={16} />
                </button>
              </div>

              {/* 하단 황동 명판 (Brass Plaque) */}
              <div className="frame-brass-plaque">
                <div className="plaque-title">{item.title}</div>
                <div className="plaque-meta">
                  <span>{item.date}</span> • <span>{item.tag || '미술활동'}</span>
                </div>
              </div>

              {/* 선생님의 피드백 코멘트 */}
              <div className="frame-feedback-note">
                <strong style={{ display: 'block', color: '#0a4d3c', fontSize: '11px', marginBottom: '3px' }}>
                  ✎ 원장선생님의 성장 피드백
                </strong>
                {item.teacherComment}
              </div>
            </div>
          ))}
        </div>

        {photos.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px', background: '#fff', borderRadius: '16px', border: '1px solid #e3ede8' }}>
            <Sparkles size={40} color="#0a4d3c" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#334841' }}>아직 등록된 활동 액자가 없습니다.</h3>
            <p style={{ color: '#7a8f87', fontSize: '14px', marginTop: '6px' }}>
              '새 활동 사진 등록' 버튼을 눌러 아이의 멋진 작품과 선생님의 코멘트를 기록해 보세요!
            </p>
          </div>
        )}
      </div>

      {/* =========================================================================
          새 사진 등록 모달 팝업
          ========================================================================= */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" style={{ maxWidth: '520px' }} onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            <div style={{ marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0a4d3c' }}>
                아이의 미술 활동 사진 등록
              </h2>
              <p style={{ fontSize: '13px', color: '#688077', marginTop: '2px' }}>
                사용자 ID({user?.id})의 전용 갤러리 액자에 등록됩니다.
              </p>
            </div>

            <form onSubmit={handleAddNewPhoto}>
              <div className="form-group">
                <label className="form-label">작품 제목</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="예: 바닷속 이야기와 반짝이는 물고기" 
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  required 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label className="form-label">수업 일자</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">수업 영역 / 태그</label>
                  <select 
                    className="form-input" 
                    value={newTag} 
                    onChange={(e) => setNewTag(e.target.value)}
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

              {/* 사진 업로드 */}
              <div className="form-group">
                <label className="form-label">작품 사진</label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={newPhotoUrl}
                    onChange={(e) => setNewPhotoUrl(e.target.value)}
                  />
                  <label className="nav-btn nav-btn-outline" style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}>
                    <Upload size={14} />
                    <span>내 사진 선택</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      style={{ display: 'none' }} 
                      onChange={handleFileUpload} 
                    />
                  </label>
                </div>
                <div className="img-preview-box" style={{ height: '140px' }}>
                  <Image src={newPhotoUrl} alt="새 작품 미리보기" fill style={{ objectFit: 'cover' }} />
                </div>
              </div>

              {/* 선생님 코멘트 */}
              <div className="form-group">
                <label className="form-label">원장 / 선생님의 지도 코멘트</label>
                <textarea 
                  rows={3} 
                  className="form-textarea" 
                  placeholder="예: 스스로 색을 배합하는 과정에서 놀라운 창의성을 보였습니다."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className="hero-btn" 
                style={{ width: '100%', justifyContent: 'center', background: '#0a4d3c', color: '#fff' }}
              >
                액자에 담아 저장하기
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          고화질 액자 확대 모달
          ========================================================================= */}
      {selectedPhoto && (
        <div className="modal-overlay" onClick={() => setSelectedPhoto(null)}>
          <div 
            style={{ 
              background: '#3d2b1f', 
              padding: '24px', 
              borderRadius: '12px', 
              maxWidth: '700px', 
              width: '90%', 
              boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
              border: '10px solid #2d1d13'
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: 'relative', width: '100%', height: '480px', borderRadius: '4px', overflow: 'hidden' }}>
              <Image src={selectedPhoto.photoUrl} alt={selectedPhoto.title} fill style={{ objectFit: 'contain' }} />
            </div>
            <div style={{ marginTop: '16px', background: '#f5eee1', padding: '14px 20px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#3d2616' }}>{selectedPhoto.title}</h3>
                <span style={{ fontSize: '12px', color: '#7a5a3a' }}>{selectedPhoto.date}</span>
              </div>
              <p style={{ marginTop: '6px', fontSize: '13px', color: '#4d3a2a', lineHeight: 1.5 }}>
                {selectedPhoto.teacherComment}
              </p>
            </div>
            <div style={{ textAlign: 'center', marginTop: '14px' }}>
              <button 
                onClick={() => setSelectedPhoto(null)} 
                style={{ background: '#f5eee1', color: '#3d2b1f', padding: '6px 20px', borderRadius: '20px', fontWeight: 700, fontSize: '13px' }}
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
