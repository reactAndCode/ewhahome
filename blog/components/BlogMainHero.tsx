'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MainHeroData, AuthUser, getAssetUrl } from '../lib/store';
import { Settings, ArrowRight } from 'lucide-react';

interface BlogMainHeroProps {
  data: MainHeroData;
  currentUser: AuthUser | null;
}

export default function BlogMainHero({ data, currentUser }: BlogMainHeroProps) {
  return (
    <section className="hero-section" id="before-after-hero">
      <div className="container">
        <div className="hero-card">
          {/* 어드민 로그인 시 즉시 수정 바로가기 버튼 */}
          {currentUser?.role === 'admin' && (
            <Link href="/admin" className="hero-edit-badge" title="어드민에서 메인 이미지 및 문구 수정">
              <Settings size={14} />
              <span>메인 섹션 편집</span>
            </Link>
          )}

          {/* 좌측 텍스트 & 카피 & 버튼 */}
          <div className="hero-content">
            <div className="hero-subtitle">{data.subTitle}</div>
            <h2 className="hero-title">{data.title}</h2>
            <p className="hero-desc">
              {data.description.split('관찰하고').length > 1 ? (
                <>
                  잘 그리는 법을 가르치기보다<br />
                  <strong>관찰하고, 생각하고,<br />자기 방식으로 표현하는 힘</strong>을 키웁니다.
                </>
              ) : (
                data.description
              )}
            </p>
            <a href={data.buttonLink || '#before-after-list'} className="hero-btn">
              <span>{data.buttonText}</span>
              <ArrowRight size={16} />
            </a>
          </div>

          {/* 우측 Before & After 듀얼 포토 프레임 */}
          <div className="hero-dual-preview">
            {/* Before 사진 영역 */}
            <div className="dual-pane">
              <div className="label-overlay">before</div>
              <Image 
                src={getAssetUrl(data.beforeImg)} 
                alt="이화미술공작소 수업 전 Before 스케치" 
                fill 
                className="dual-img"
                sizes="(max-width: 900px) 100vw, 50vw"
                priority
              />
            </div>

            {/* After 사진 영역 */}
            <div className="dual-pane">
              <div className="label-overlay">after</div>
              <Image 
                src={getAssetUrl(data.afterImg)} 
                alt="이화미술공작소 수업 후 After 완성작" 
                fill 
                className="dual-img"
                sizes="(max-width: 900px) 100vw, 50vw"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
