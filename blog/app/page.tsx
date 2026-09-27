'use client';

import React, { useState, useEffect, useCallback } from 'react';
import BlogMainHero from '../components/BlogMainHero';
import BeforeAfterGrid from '../components/BeforeAfterGrid';
import { 
  getStoredHeroData, 
  getStoredCards, 
  getCurrentUser, 
  fetchHeroData,
  fetchCards,
  syncCurrentAuthUser,
  getStoredAgePrograms,
  MainHeroData, 
  BeforeAfterCardData, 
  AuthUser,
  AgeProgramData,
  getAssetUrl,
  DEFAULT_HERO_DATA,
  DEFAULT_CARDS,
  DEFAULT_AGE_PROGRAMS
} from '../lib/store';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, ExternalLink } from 'lucide-react';

// 수업별 자료실 데이터 (시안 1:1)
const SUBJECT_ARCHIVES = [
  { id: 1, name: '그리기·드로잉', count: '48개 자료' },
  { id: 2, name: '소묘·관찰화', count: '36개 자료' },
  { id: 3, name: '수채화·아크릴', count: '52개 자료' },
  { id: 4, name: '기초디자인', count: '29개 자료' },
  { id: 5, name: '입체·만들기', count: '41개 자료' },
  { id: 6, name: '교과융합 미술', count: '34개 자료' },
];

// 이화미술의 교육철학 4개 카드 (시안 1:1)
const PHILOSOPHY_CARDS = [
  {
    title: '질문하는 수업',
    desc: '스스로 생각하고 표현하는 힘을 키웁니다.'
  },
  {
    title: '기초가 만드는 힘',
    desc: '관찰·소묘·기초디자인으로 탄탄한 표현력을 만듭니다.'
  },
  {
    title: '교과와 세상을 잇는 미술',
    desc: '독서, 인문, 과학, 사회와 융합한 깊이 있는 수업을 합니다.'
  },
  {
    title: '실패를 두려워하지 않는 마음',
    desc: '과정 속에서 성장하는 아이를 응원합니다.'
  }
];

export default function BlogHomePage() {
  const [heroData, setHeroData] = useState<MainHeroData>(DEFAULT_HERO_DATA);
  const [cards, setCards] = useState<BeforeAfterCardData[]>(DEFAULT_CARDS);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [agePrograms, setAgePrograms] = useState<AgeProgramData[]>(DEFAULT_AGE_PROGRAMS);

  // 시안 인터랙션 상태
  const [activeAgeTab, setActiveAgeTab] = useState<number>(1);  // 연령별 탭 현재 선택 (1번 기본)
  const [contentVisible, setContentVisible] = useState(true);  // 애니메이션 트리거
  const [selectedSubject, setSelectedSubject] = useState<number | null>(null);
  const [activeModalInfo, setActiveModalInfo] = useState<{ title: string; content: string } | null>(null);

  // 탭 전환 핸들러 — 콘텐츠 fadeOut → 데이터 업데이트 → fadeIn
  const handleTabChange = useCallback((id: number) => {
    if (id === activeAgeTab) return;
    setContentVisible(false);
    setTimeout(() => {
      setActiveAgeTab(id);
      setContentVisible(true);
    }, 220);
  }, [activeAgeTab]);

  useEffect(() => {
    // 1) 빠른 초기 렌더링을 위해 로컀 캐시 우선 반영
    setHeroData(getStoredHeroData());
    setCards(getStoredCards());
    setCurrentUser(getCurrentUser());
    setAgePrograms(getStoredAgePrograms());

    // 2) Supabase 최신 데이터 및 Auth 세션 비동기 동기화
    fetchHeroData().then(data => setHeroData(data));
    fetchCards().then(data => setCards(data));
    syncCurrentAuthUser().then(user => setCurrentUser(user));

    const handleStorageChange = () => {
      setHeroData(getStoredHeroData());
      setCards(getStoredCards());
      setCurrentUser(getCurrentUser());
      setAgePrograms(getStoredAgePrograms());
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <div>
      {/* =========================================================================
          1. 헤더 메뉴 1: 아이의 변화 (시안 1: 딥그린 BEFORE & AFTER 대형 히어로)
          ========================================================================= */}
      <BlogMainHero data={heroData} currentUser={currentUser} />

      {/* 2. Before & After 4개 미니 카드 비교 그리드 */}
      <BeforeAfterGrid cards={cards} currentUser={currentUser} />

      {/* =========================================================================
          첨부 시안 2 반영 영역: 연령별 수업, 수업별 자료실, 원장소개, 교육철학, 지난수업
          ========================================================================= */}
      <section className="sub-sections-wrap">
        <div className="container">

          {/* 3. 헤더 메뉴 2: 연령별 수업 — 3-Zone 리디자인 */}
          <div id="programs" style={{ scrollMarginTop: '100px' }}>
            <div className="age-section-header">
              <h2 className="sub-section-title" style={{ marginBottom: 0 }}>연령별 수업</h2>
              <p className="age-section-caption">성장 단계마다, 딱 맞는 미술 이야기</p>
            </div>

            {/* Zone 1: 연령 탭 */}
            <div className="age-tabs-wrap">
              {agePrograms.map((prog, idx) => (
                <button
                  key={prog.id}
                  className={`age-tab-btn ${activeAgeTab === prog.id ? 'active' : ''}`}
                  style={{ '--tab-color': prog.color } as React.CSSProperties}
                  onClick={() => handleTabChange(prog.id)}
                  id={`age-tab-${prog.id}`}
                >
                  <span className="age-tab-icon">{prog.icon}</span>
                  <span className="age-tab-title">{prog.title}</span>
                  <span className="age-tab-sub">{prog.sub}</span>
                </button>
              ))}
              {/* 성장 타임라인 바 */}
              <div className="age-progress-bar">
                <div
                  className="age-progress-fill"
                  style={{ width: `${(activeAgeTab / agePrograms.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Zone 2 + Zone 3: 콘텐츠 영역 */}
            {(() => {
              const prog = agePrograms.find(p => p.id === activeAgeTab) || agePrograms[0];
              if (!prog) return null;
              return (
                <div
                  className="age-content-wrap"
                  style={{ opacity: contentVisible ? 1 : 0, transition: 'opacity 0.22s ease' }}
                >
                  {/* Zone 2: 블로그 이미지 카드 2개 */}
                  <div className="age-blog-cards">
                    {prog.blogCards.map((card, ci) => (
                      <div
                        key={card.id}
                        className="age-blog-card"
                        style={{ animationDelay: `${ci * 0.08}s` }}
                        onClick={() => {
                          if (card.linkUrl) {
                            window.open(card.linkUrl, '_blank', 'noopener,noreferrer');
                          }
                        }}
                      >
                        <div className="age-blog-card-img-wrap">
                          <Image
                            src={getAssetUrl(card.image)}
                            alt={card.title}
                            fill
                            style={{ objectFit: 'cover' }}
                          />
                          {/* 연령 배지 */}
                          <span className="age-blog-badge" style={{ background: prog.color }}>{prog.title}</span>
                          {/* 날짜 스탬프 */}
                          <span className="age-blog-date">{card.date}</span>
                        </div>
                        <div className="age-blog-card-body">
                          <span className="age-blog-tag">{card.tag}</span>
                          <h3 className="age-blog-title">{card.title}</h3>
                          <p className="age-blog-excerpt">{card.excerpt}</p>
                          {card.linkUrl ? (
                            <span className="age-blog-more">자세히 보기 <ExternalLink size={12} style={{ display: 'inline', verticalAlign: 'middle' }} /></span>
                          ) : (
                            <span className="age-blog-more">수업 보기 →</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Zone 3: 불릿 수업 내역 목록 */}
                  <div className="age-bullet-panel">
                    <div className="age-bullet-header">
                      <span className="age-bullet-icon">{prog.icon}</span>
                      <div>
                        <div className="age-bullet-panel-title">{prog.title} 수업에서 배우는 것들</div>
                        <div className="age-bullet-panel-sub">{prog.detail}</div>
                      </div>
                    </div>
                    <div className="age-bullet-list">
                      {prog.bulletItems.map((item, bi) => (
                        <div
                          key={item.id}
                          className={`age-bullet-item ${item.linkUrl ? 'clickable' : ''}`}
                          style={{ animationDelay: `${bi * 0.1}s` }}
                          onClick={() => {
                            if (item.linkUrl) {
                              window.open(item.linkUrl, '_blank', 'noopener,noreferrer');
                            }
                          }}
                        >
                          <div className="age-bullet-photo-wrap">
                            <Image
                              src={getAssetUrl(item.kidPhoto)}
                              alt={item.headline}
                              fill
                              style={{ objectFit: 'cover' }}
                            />
                          </div>
                          <div className="age-bullet-text">
                            <div className="age-bullet-headline">{item.headline}</div>
                            <div className="age-bullet-desc">{item.desc}</div>
                          </div>
                          {item.linkUrl && (
                            <ExternalLink size={14} className="age-bullet-ext-icon" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* 4. 헤더 메뉴 3: 수업별 자료실 */}
          <div id="archive" style={{ scrollMarginTop: '100px' }}>
            <h2 className="sub-section-title">수업별 자료실</h2>
            <div className="subject-cards-grid">
              {SUBJECT_ARCHIVES.map((sub) => (
                <div 
                  key={sub.id} 
                  className={`subject-card ${selectedSubject === sub.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedSubject(sub.id);
                    setActiveModalInfo({
                      title: `[수업별 자료실] ${sub.name}`,
                      content: `이화미술공작소에서 진행된 ${sub.name}의 ${sub.count} 포트폴리오 아카이브가 준비되어 있습니다.`
                    });
                  }}
                >
                  {sub.name}
                </div>
              ))}
            </div>
          </div>

          {/* 5. 헤더 메뉴 4 & 5: 원장 소개 & 이화미술의 교육철학 2단 그리드 */}
          <div className="director-philosophy-grid">
            {/* 좌측: 원장 소개 */}
            <div className="director-intro-panel" id="director" style={{ scrollMarginTop: '100px' }}>
              <h2 className="sub-section-title" style={{ marginBottom: '24px' }}>원장 소개</h2>
              
              <div className="director-card-body">
                {/* 원장님 사진 */}
                <div className="director-photo-circle">
                  <Image 
                    src={getAssetUrl('/img/director.jpg')} 
                    alt="이화미술공작소 원장 정소담" 
                    fill 
                    style={{ objectFit: 'cover' }}
                  />
                </div>

                {/* 원장님 프로필 정보 */}
                <div>
                  <h3 className="director-info-title">이화미술공작소 원장 정소담</h3>
                  <ul className="director-bullet-list">
                    <li className="director-bullet-item">이화여대 미술 전공</li>
                    <li className="director-bullet-item">디자인 · 교육학 · 미술심리치료 전공</li>
                    <li className="director-bullet-item">중등 정교사 자격</li>
                    <li className="director-bullet-item">미술심리치료사 · 특수아동지도사 · 언어발달지도사</li>
                    <li className="director-bullet-item">디자이너 경력</li>
                    <li className="director-bullet-item">2011 ㅡ 현재, 이화미술공작소</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 우측: 이화미술의 교육철학 */}
            <div className="philosophy-panel" id="philosophy" style={{ scrollMarginTop: '100px' }}>
              <h2 className="sub-section-title" style={{ marginBottom: '24px' }}>이화미술의 교육철학</h2>
              
              <div className="philosophy-2x2-grid">
                {PHILOSOPHY_CARDS.map((card, idx) => (
                  <div key={idx} className="philosophy-white-card">
                    <div className="philosophy-card-title">{card.title}</div>
                    <div className="philosophy-card-desc">{card.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 6. 헤더 메뉴 6 및 하단 링크 3종: 학부모 브리핑 / 교육 이야기 / 지난 수업 아카이브 (시안 1:1) */}
          <div className="bottom-links-grid" id="classes" style={{ scrollMarginTop: '100px' }}>
            <div 
              className="bottom-link-card" 
              onClick={() => setActiveModalInfo({
                title: '학부모 브리핑',
                content: '이화미술공작소의 수업 가치를 전하는 학부모 브리핑 및 월별 공지입니다.'
              })}
            >
              <div className="bottom-link-head">
                <span>학부모 브리핑</span>
                <span className="arrow">→</span>
              </div>
              <div className="bottom-link-sub">수업의 가치를 전하는 이야기</div>
            </div>

            <div 
              className="bottom-link-card" 
              onClick={() => setActiveModalInfo({
                title: '교육 이야기',
                content: '미술로 키우는 아이의 내일: 생각의 깊이를 더하는 교육 칼럼입니다.'
              })}
            >
              <div className="bottom-link-head">
                <span>교육 이야기</span>
                <span className="arrow">→</span>
              </div>
              <div className="bottom-link-sub">미술로 키우는 아이의 내일</div>
            </div>

            <div 
              className="bottom-link-card" 
              onClick={() => setActiveModalInfo({
                title: '지난 수업 아카이브',
                content: '2011년부터 이어온 소중한 기록: 아이들의 작품과 수업 현장 포트폴리오입니다.'
              })}
            >
              <div className="bottom-link-head">
                <span>지난 수업 아카이브</span>
                <span className="arrow">→</span>
              </div>
              <div className="bottom-link-sub">2011년부터 이어온 소중한 기록</div>
            </div>
          </div>

        </div>
      </section>

      {/* 안내 팝업 모달 */}
      {activeModalInfo && (
        <div className="modal-overlay" onClick={() => setActiveModalInfo(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setActiveModalInfo(null)}>✕</button>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <div style={{ width: '44px', height: '44px', margin: '0 auto 8px', borderRadius: '50%', background: '#e3f7f1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={22} color="#0a4d3c" />
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0a4d3c' }}>{activeModalInfo.title}</h3>
            </div>
            <p style={{ fontSize: '14px', color: '#4a6058', lineHeight: 1.7, textAlign: 'center', marginBottom: '24px' }}>
              {activeModalInfo.content}
            </p>
            <button 
              onClick={() => setActiveModalInfo(null)}
              className="hero-btn" 
              style={{ width: '100%', justifyContent: 'center', background: '#0a4d3c', color: '#fff' }}
            >
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
