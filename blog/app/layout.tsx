import '../css/blog.css';
import Header from '../components/Header';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '이화미술공작소 블로그 | Before & After 아이의 변화',
  description: '잘 그리는 법을 가르치기보다 관찰하고 생각하고 자기 방식으로 표현하는 힘을 키웁니다. 이화미술공작소 공식 블로그',
  icons: {
    icon: '/img/logo.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <Header />
        <main>{children}</main>
        {/* 하단 푸터 브랜딩 (첨부 시안 3과 1:1 일치) */}
        <footer className="site-footer-branding">
          <div className="container">
            <div className="footer-brand-title">EWHA ART · 이화미술공작소</div>
            <div className="footer-brand-eng">Art for a brighter tomorrow · since 2011</div>
          </div>
        </footer>
      </body>
    </html>
  );
}
