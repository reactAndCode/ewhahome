'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { getCurrentUser, setCurrentUser, AuthUser, getAssetUrl } from '../lib/store';
import { LogIn, UserPlus, LogOut, Shield, Heart, Sparkles } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [roleInput, setRoleInput] = useState<'parent' | 'admin'>('parent');

  useEffect(() => {
    // 기본 로그인 유저가 없을 경우, 편리한 테스트를 위해 기본 학부모 계정 또는 상태 확인
    const currentUser = getCurrentUser();
    setUser(currentUser);
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

  const handleLogout = () => {
    setCurrentUser(null);
    setUser(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newUser: AuthUser = {
      id: 'user_' + Date.now(),
      email: emailInput || 'user@example.com',
      name: nameInput || (roleInput === 'admin' ? '관리자' : '학부모 회원'),
      role: roleInput,
      kidName: roleInput === 'parent' ? '내 아이' : undefined
    };
    setCurrentUser(newUser);
    setUser(newUser);
    setShowAuthModal(false);
    setEmailInput('');
    setNameInput('');
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

      {/* 로그인 / 회원가입 모달 팝업 */}
      {showAuthModal && (
        <div className="modal-overlay" onClick={() => setShowAuthModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAuthModal(false)}>✕</button>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ width: '48px', height: '48px', margin: '0 auto 8px', borderRadius: '50%', background: '#e3f7f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={24} color="#0a4d3c" />
              </div>
              <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0a4d3c' }}>
                {authMode === 'login' ? '이화미술공작소 로그인' : '학부모 & 회원가입'}
              </h2>
              <p style={{ fontSize: '13px', color: '#688077', marginTop: '4px' }}>
                아이의 특별한 성장과 그림 변화를 확인하세요
              </p>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label className="form-label">이메일 주소</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="parent@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  required
                />
              </div>

              {authMode === 'signup' && (
                <div className="form-group">
                  <label className="form-label">성함 / 학부모님 성함</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="김민지 어머님"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    required
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">계정 권한 선택</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    type="button"
                    onClick={() => setRoleInput('parent')}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: roleInput === 'parent' ? '2px solid #0a4d3c' : '1px solid #ddd',
                      background: roleInput === 'parent' ? '#eefbf7' : '#fff',
                      color: roleInput === 'parent' ? '#0a4d3c' : '#666',
                      fontWeight: 700,
                      fontSize: '13px'
                    }}
                  >
                    🎨 학부모 계정
                  </button>
                  <button
                    type="button"
                    onClick={() => setRoleInput('admin')}
                    style={{
                      padding: '10px',
                      borderRadius: '8px',
                      border: roleInput === 'admin' ? '2px solid #b86200' : '1px solid #ddd',
                      background: roleInput === 'admin' ? '#fff6e8' : '#fff',
                      color: roleInput === 'admin' ? '#b86200' : '#666',
                      fontWeight: 700,
                      fontSize: '13px'
                    }}
                  >
                    👑 관리자(어드민)
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="hero-btn"
                style={{ width: '100%', justifyContent: 'center', marginTop: '12px', background: '#0a4d3c', color: '#fff' }}
              >
                {authMode === 'login' ? '로그인 완료' : '가입하기'}
              </button>
            </form>

            <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: '#688077' }}>
              {authMode === 'login' ? (
                <span>계정이 없으신가요? <button onClick={() => setAuthMode('signup')} style={{ color: '#0a4d3c', fontWeight: 700, textDecoration: 'underline' }}>회원가입</button></span>
              ) : (
                <span>이미 계정이 있으신가요? <button onClick={() => setAuthMode('login')} style={{ color: '#0a4d3c', fontWeight: 700, textDecoration: 'underline' }}>로그인</button></span>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
