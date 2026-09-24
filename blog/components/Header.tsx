'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  getCurrentUser, 
  setCurrentUser, 
  signInWithSupabase, 
  signUpWithSupabase, 
  signOutSupabase, 
  syncCurrentAuthUser,
  AuthUser, 
  getAssetUrl 
} from '../lib/store';
import { LogIn, UserPlus, LogOut, Shield, Heart, Sparkles, AlertCircle } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [roleInput, setRoleInput] = useState<'parent' | 'admin'>('parent');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const currentUser = getCurrentUser();
    setUser(currentUser);

    // Supabase Auth 세션 동기화
    syncCurrentAuthUser().then(sbUser => {
      if (sbUser) setUser(sbUser);
    });
  }, []);

  const handleQuickLogin = (role: 'parent' | 'admin') => {
    const demoUser: AuthUser = role === 'admin'
      ? {
        id: 'admin_master',
        email: 'admin@ewha-art.com',
        name: '총괄 원장선생님',
        role: 'admin'
      }
      : {
        id: 'parent_minji',
        email: 'minji_mom@gmail.com',
        name: '김민지 학부모님',
        role: 'parent',
        kidName: '김민지 (8세)'
      };
    setCurrentUser(demoUser);
    setUser(demoUser);
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    await signOutSupabase();
    setUser(null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    const pwd = passwordInput || '123456';

    try {
      if (authMode === 'login') {
        const res = await signInWithSupabase(emailInput, pwd);
        if (res.error) {
          setAuthError(res.error);
        } else if (res.user) {
          setUser(res.user);
          setShowAuthModal(false);
          setEmailInput('');
          setPasswordInput('');
        }
      } else {
        const res = await signUpWithSupabase(
          emailInput, 
          pwd, 
          nameInput || (roleInput === 'admin' ? '관리자' : '학부모 회원'), 
          roleInput,
          roleInput === 'parent' ? '내 아이' : undefined
        );
        if (res.error) {
          setAuthError(res.error);
        } else if (res.user) {
          setUser(res.user);
          setShowAuthModal(false);
          setEmailInput('');
          setPasswordInput('');
          setNameInput('');
        }
      }
    } catch (err: any) {
      setAuthError(err.message || '인증 처리 중 오류가 발생했습니다.');
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <header className="site-header">
      {/* 최상단 관리자/데모 상태 알림 & 빠른 테스트 바 */}
      <div style={{ background: '#f2f8f5', padding: '6px 0', borderBottom: '1px solid #e2ebe6', fontSize: '12px' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0a4d3c' }}>
            <Sparkles size={14} color="#009688" />
            <span><strong>이화미술공작소 공식 블로그 포털</strong> | 관찰하고 표현하는 힘</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#688077' }}>계정 상태:</span>
            {user ? (
              <span style={{ fontWeight: 800, color: user.role === 'admin' ? '#b86200' : '#0a4d3c' }}>
                {user.role === 'admin' ? '👑 관리자(' + user.name + ')' : '🎨 학부모(' + user.name + ')'}
              </span>
            ) : (
              <span style={{ color: '#999' }}>비로그인</span>
            )}
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                onClick={() => handleQuickLogin('parent')}
                style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: '#d7f3ea', color: '#084d3c', fontWeight: 700 }}
              >
                학부모 전환
              </button>
              <button
                onClick={() => handleQuickLogin('admin')}
                style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: '#fff0d9', color: '#b86200', fontWeight: 700 }}
              >
                어드민 전환
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        {/* 중앙 상단: 브랜드 로고 및 타이틀 */}
        {/*
        <div className="brand-section">
          <Link href="/" className="brand-logo-wrap" title="이화미술공작소 홈">
            <Image 
              src={getAssetUrl('/img/logo.svg')} 
              alt="Kids Atelier EWHA Logo" 
              width={76} 
              height={76} 
              className="brand-logo-img"
              priority
            />
          </Link>
          <Link href="/">
            <h1 className="brand-title">이화미술공작소</h1>
          </Link>
        </div>
        */}

        {/* 네비게이션 메뉴바 */}
        <div className="nav-bar-container">
          <ul className="nav-menu-list">
            {/* 메뉴 젤 앞 브랜드 로고 (첨부 시안 반영) */}
            <li className="menu-brand-lead">
              <Link href="/" title="이화미술공작소 홈" style={{ display: 'inline-flex', alignItems: 'center', marginRight: '8px' }}>
                <Image
                  src={getAssetUrl('/img/ewha-art-brand.svg')}
                  alt="EWHA ART KIDS ATELIER"
                  width={160}
                  height={38}
                  priority
                  style={{ objectFit: 'contain' }}
                />
              </Link>
            </li>
            <li>
              <Link href="/#before-after-hero" className={`nav-link ${pathname === '/' ? 'active' : ''}`}>
                아이의 변화
              </Link>
            </li>
            <li>
              <Link href="/#programs" className="nav-link">
                연령별 수업
              </Link>
            </li>
            <li>
              <Link href="/#archive" className="nav-link">
                수업별 자료실
              </Link>
            </li>
            <li>
              <Link href="/#director" className="nav-link">
                원장 소개
              </Link>
            </li>
            <li>
              <Link href="/#philosophy" className="nav-link">
                교육철학
              </Link>
            </li>

            {/* 학부모 로그인 시 나타나는 '내아이' 메뉴 */}
            {user && (
              <li>
                <Link href="/mypage" className={`mykid-badge ${pathname === '/mypage' ? 'active' : ''}`}>
                  <Heart size={15} color="#e0486c" fill="#e0486c" />
                  <span>내아이</span>
                </Link>
              </li>
            )}

            {/* 관리자 로그인 시 나타나는 '어드민 설정' 메뉴 */}
            {user?.role === 'admin' && (
              <li>
                <Link href="/admin" className={`admin-badge ${pathname === '/admin' ? 'active' : ''}`}>
                  <Shield size={14} />
                  <span>어드민 설정</span>
                </Link>
              </li>
            )}
          </ul>

          {/* 우측 로그인 / 회원가입 액션 */}
          <div className="nav-actions">
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#334841' }}>
                  <strong>{user.name}</strong> 님
                </span>
                <button onClick={handleLogout} className="nav-btn nav-btn-outline" title="로그아웃">
                  <LogOut size={14} />
                  <span>로그아웃</span>
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
                  className="nav-btn nav-btn-outline"
                >
                  <LogIn size={15} />
                  <span>로그인</span>
                </button>
                <button
                  onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}
                  className="nav-btn nav-btn-primary"
                >
                  <UserPlus size={15} />
                  <span>회원가입</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 로그인 / 회원가입 모달 팝업 (createPortal을 사용하여 document.body에 직접 마운트) */}
      {mounted && showAuthModal && createPortal(
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button 
              type="button" 
              className="modal-close" 
              onClick={() => setShowAuthModal(false)}
              aria-label="닫기"
            >
              ✕
            </button>

            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ width: '44px', height: '44px', margin: '0 auto 8px', borderRadius: '50%', background: '#e3f7f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={22} color="#0a4d3c" />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0a4d3c', margin: 0 }}>
                {authMode === 'login' ? '이화미술공작소 로그인' : '학부모 & 회원가입'}
              </h2>
              <p style={{ fontSize: '13px', color: '#688077', marginTop: '4px', marginBottom: 0 }}>
                아이의 특별한 성장과 그림 변화를 확인하세요
              </p>
            </div>

            {authError && (
              <div style={{
                background: '#fee2e2',
                border: '1px solid #fca5a5',
                color: '#b91c1c',
                fontSize: '12px',
                padding: '8px 12px',
                borderRadius: '8px',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <AlertCircle size={15} />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit}>
              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label" style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#2d413b', marginBottom: '4px' }}>
                  이메일 주소
                </label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="parent@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1ded8', fontSize: '14px' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '12px' }}>
                <label className="form-label" style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#2d413b', marginBottom: '4px' }}>
                  비밀번호
                </label>
                <input
                  type="password"
                  className="form-input"
                  placeholder="6자리 이상 비밀번호 입력"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  minLength={6}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1ded8', fontSize: '14px' }}
                />
              </div>

              {authMode === 'signup' && (
                <div className="form-group" style={{ marginBottom: '12px' }}>
                  <label className="form-label" style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#2d413b', marginBottom: '4px' }}>
                    성함 / 학부모님 성함
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="김민지 어머님"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #d1ded8', fontSize: '14px' }}
                  />
                </div>
              )}

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label className="form-label" style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#2d413b', marginBottom: '6px' }}>
                  계정 권한 선택
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setRoleInput('parent')}
                    style={{
                      padding: '9px',
                      borderRadius: '8px',
                      border: roleInput === 'parent' ? '2px solid #0a4d3c' : '1px solid #ddd',
                      background: roleInput === 'parent' ? '#eefbf7' : '#fff',
                      color: roleInput === 'parent' ? '#0a4d3c' : '#666',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    🎨 학부모 계정
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleInput('admin')}
                    style={{
                      padding: '9px',
                      borderRadius: '8px',
                      border: roleInput === 'admin' ? '2px solid #b86200' : '1px solid #ddd',
                      background: roleInput === 'admin' ? '#fff6e8' : '#fff',
                      color: roleInput === 'admin' ? '#b86200' : '#666',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    👑 관리자(어드민)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="hero-btn"
                style={{ 
                  width: '100%', 
                  justifyContent: 'center', 
                  marginTop: '4px', 
                  background: '#0a4d3c', 
                  color: '#fff',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '14px',
                  border: 'none',
                  cursor: 'pointer',
                  opacity: authLoading ? 0.7 : 1
                }}
              >
                {authLoading ? '처리 중...' : (authMode === 'login' ? '로그인 완료' : '가입하기')}
              </button>
            </form>

            <div style={{ marginTop: '16px', textAlign: 'center', fontSize: '13px', color: '#688077' }}>
              {authMode === 'login' ? (
                <span>계정이 없으신가요? <button onClick={() => { setAuthMode('signup'); setAuthError(null); }} style={{ color: '#0a4d3c', fontWeight: 700, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>회원가입</button></span>
              ) : (
                <span>이미 계정이 있으신가요? <button onClick={() => { setAuthMode('login'); setAuthError(null); }} style={{ color: '#0a4d3c', fontWeight: 700, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>로그인</button></span>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}
