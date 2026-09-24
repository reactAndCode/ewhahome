'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  getStoredKidPhotos, 
  getCurrentUser, 
  setCurrentUser,
  fetchKidPhotos,
  syncCurrentAuthUser,
  KidActivityPhoto, 
  AuthUser,
  DEFAULT_KID_PHOTOS
} from '../../lib/store';
import { isSupabaseConfigured } from '../../lib/supabase';
import { 
  Heart, 
  Calendar, 
  Sparkles, 
  ArrowLeft, 
  Maximize2, 
  UserCheck,
  Database,
  Palette,
  ShieldCheck
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
  const [photos, setPhotos] = useState<KidActivityPhoto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<KidActivityPhoto | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let currentUser = getCurrentUser();
    if (!currentUser) {
      currentUser = DEFAULT_PARENT_USER;
      setCurrentUser(currentUser);
    }
    setUser(currentUser);
    refreshPhotos(currentUser.id);

    // Supabase Auth 세션 동기화
    syncCurrentAuthUser().then(syncedUser => {
      if (syncedUser) {
        setUser(syncedUser);
        refreshPhotos(syncedUser.id);
      }
    });
  }, []);

  const refreshPhotos = async (userId: string) => {
    setLoading(true);
    try {
      // 1) 캐시 로드
      const cached = getStoredKidPhotos(userId);
      setPhotos(cached);

      // 2) Supabase 비동기 로드
      const remote = await fetchKidPhotos(userId);
      if (remote && remote.length > 0) {
        setPhotos(remote);
      }
    } finally {
      setLoading(false);
    }
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
              이화미술공작소에서 스스로 관찰하고 표현한 아이의 성장 발자취가 전용 액자에 담겨 전시됩니다.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
            <div style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              background: 'rgba(255, 255, 255, 0.15)', 
              backdropFilter: 'blur(8px)',
              padding: '8px 16px', 
              borderRadius: '20px', 
              color: '#ffffff', 
              fontSize: '13px', 
              fontWeight: 700,
              border: '1px solid rgba(255, 255, 255, 0.25)'
            }}>
              <ShieldCheck size={16} color="#7ce3cb" />
              <span>원장/선생님 전담 아카이브</span>
            </div>
            <span style={{ fontSize: '12px', color: '#bce4d8' }}>
              학부모 ID: <strong>{user?.id}</strong>
            </span>
          </div>
        </div>

        {/* =========================================================================
            액자식(Art Frame) 갤러리 그리드 (조회 전용)
            ========================================================================= */}
        {photos.length === 0 ? (
          <div style={{ 
            background: '#ffffff', 
            borderRadius: '16px', 
            padding: '60px 20px', 
            textAlign: 'center',
            border: '1px dashed #c0d4cc',
            marginTop: '20px'
          }}>
            <Palette size={48} color="#0a4d3c" style={{ margin: '0 auto 16px', opacity: 0.7 }} />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0a4d3c', marginBottom: '8px' }}>
              아직 등록된 활동 액자가 없습니다
            </h3>
            <p style={{ fontSize: '14px', color: '#688077', margin: 0 }}>
              원장선생님께서 수업 후 아이의 활동 사진과 따뜻한 피드백을 이곳에 등록해 주십니다.
            </p>
          </div>
        ) : (
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
                      justifyContent: 'center',
                      border: 'none',
                      cursor: 'pointer'
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
                {item.teacherComment && (
                  <div className="frame-comment-box">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                      <Sparkles size={14} color="#0a4d3c" />
                      <span className="teacher-badge">선생님의 성장 피드백</span>
                    </div>
                    <p className="comment-text">"{item.teacherComment}"</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 하단 미술관 갤러리 안내 문구 */}
        <div style={{
          marginTop: '40px',
          padding: '24px',
          background: '#f4fbf8',
          border: '1px solid #d3ece2',
          borderRadius: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: '#0a4d3c',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Sparkles size={22} color="#ffffff" />
          </div>
          <div>
            <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0a4d3c', marginBottom: '4px' }}>
              이화미술공작소 아이 성장 아카이브 안내
            </h4>
            <p style={{ fontSize: '13px', color: '#556a62', margin: 0, lineHeight: 1.6 }}>
              학부모 마이페이지의 모든 작품 사진 및 수업 피드백은 <strong>원장선생님께서 수업 후 정성껏 촬영하여 직접 등록</strong>해 드립니다.  
              수업 문의나 상담이 필요하신 경우 메인 화면의 카카오톡 1:1 상담 채널을 이용해 주시기 바랍니다.
            </p>
          </div>
        </div>
      </div>

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
              border: '10px solid #2d1d13',
              position: 'relative'
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="modal-close" 
              onClick={() => setSelectedPhoto(null)}
              style={{
                position: 'absolute',
                top: '-15px',
                right: '-15px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 700
              }}
            >
              ✕
            </button>
            <div style={{ position: 'relative', width: '100%', height: '480px', borderRadius: '4px', overflow: 'hidden' }}>
              <Image src={selectedPhoto.photoUrl} alt={selectedPhoto.title} fill style={{ objectFit: 'contain' }} />
            </div>
            <div style={{ marginTop: '16px', background: '#f5eee1', padding: '14px 20px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#3d2616' }}>{selectedPhoto.title}</h3>
                <span style={{ fontSize: '13px', color: '#7a5a40', fontWeight: 600 }}>{selectedPhoto.date}</span>
              </div>
              {selectedPhoto.teacherComment && (
                <p style={{ marginTop: '8px', fontSize: '14px', color: '#4a382c', lineHeight: 1.6 }}>
                  "{selectedPhoto.teacherComment}"
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
