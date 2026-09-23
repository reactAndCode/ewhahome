'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { BeforeAfterCardData, AuthUser, getAssetUrl } from '../lib/store';
import { Sparkles, Edit3 } from 'lucide-react';

interface BeforeAfterGridProps {
  cards: BeforeAfterCardData[];
  currentUser: AuthUser | null;
}

export default function BeforeAfterGrid({ cards, currentUser }: BeforeAfterGridProps) {
  return (
    <section className="before-after-section" id="before-after-list">
      <div className="container">
        <div className="section-head-bar">
          <h3 className="section-heading-sm">
            <Sparkles size={18} color="#0a4d3c" />
            <span>생각이 깊어지는 아이들의 성장 기록 (Before & After)</span>
          </h3>
          {currentUser?.role === 'admin' && (
            <Link 
              href="/admin#cards-editor" 
              style={{ fontSize: '13px', color: '#b86200', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}
            >
              <Edit3 size={14} />
              <span>4개 카드 이미지 수정하기</span>
            </Link>
          )}
        </div>

        <div className="ba-grid-4">
          {cards.map((card) => (
            <div key={card.id} className="ba-card">
              {/* 상단 듀얼 분할 Before & After */}
              <div className="ba-card-dual">
                <div className="pane">
                  <span className="mini-label">before</span>
                  <Image 
                    src={getAssetUrl(card.beforeImg)} 
                    alt={`${card.title} - Before`} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>
                <div className="pane">
                  <span className="mini-label">after</span>
                  <Image 
                    src={getAssetUrl(card.afterImg)} 
                    alt={`${card.title} - After`} 
                    fill 
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                </div>
              </div>

              {/* 하단 설명 정보 */}
              <div className="ba-card-body">
                <div className="ba-card-title">{card.title}</div>
                <div className="ba-card-sub">
                  <span>{card.student} ({card.age})</span>
                  <span style={{ color: '#0a4d3c', fontWeight: 700 }}>이화미술</span>
                </div>
                <p style={{ fontSize: '12px', color: '#688077', marginTop: '4px', lineHeight: 1.4 }}>
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
