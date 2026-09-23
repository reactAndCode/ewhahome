# 이화미술공작소 블로그 & 학부모 포털 시스템 명세서 (06_blog_system.md)

## 1. 프로젝트 개요
이화미술공작소의 공식 블로그 및 학부모 전용 포털 시스템입니다.
아이들의 변화를 직관적으로 전달하는 **Before & After 메인 섹션**과 **하단 4개 비교 그리드**, 관리자가 자유롭게 이미지를 교체할 수 있는 **어드민(Admin) 대시보드**, 그리고 학부모 로그인 시 아이의 활동 사진을 미술관 액자 형식으로 보관/감상할 수 있는 **마이페이지(MyPage)**가 통합되어 있습니다.

---

## 2. 디렉토리 구조 및 역할

```text
blog/
├── img/                       # 블로그 에셋 및 기본 샘플 이미지
├── css/                       # 블로그 전용 글로벌 스타일시트 (blog.css)
│   └── blog.css               # 딥 포레스트 그린 테마 및 프리미엄 액자 프레임 CSS
├── admin/                     # 어드민 설정 및 설정 백업
│   └── config/                # 기본 설정 JSON (site_settings.json)
├── mypage/                    # 학부모 사용자 ID별 내아이 활동 데이터
│   ├── parent_minji/          # 학부모 ID: parent_minji 프로필 및 액자 데이터
│   └── parent_jun/            # 학부모 ID: parent_jun 프로필 및 액자 데이터
├── components/                # 재사용 가능한 UI 컴포넌트
│   ├── Header.tsx             # 엠블럼 로고 + 6개 메뉴 + 로그인/회원가입/내아이/어드민 버튼
│   ├── BlogMainHero.tsx       # 딥그린 Before & After 대형 히어로 섹션 (시안 1:1 완벽 구현)
│   └── BeforeAfterGrid.tsx    # 4개 Before & After 미니 카드 비교 그리드
├── lib/                       # 데이터 스토어 및 Supabase 클라이언트
│   ├── supabase.ts            # Supabase 인스턴스 및 설정 검증
│   └── store.ts               # 로컬스토리지 영속화 및 실시간 동기화 상태 관리자
├── app/                       # Next.js App Router
│   ├── layout.tsx             # 공통 레이아웃 및 폰트, 메타데이터
│   ├── page.tsx               # 블로그 홈 (blogHome)
│   ├── blogHome/page.tsx      # blogHome 경로 매핑
│   ├── admin/page.tsx         # 어드민 이미지 선택 및 설정 페이지
│   └── mypage/page.tsx        # 학부모 내아이 액자식 앨범 페이지
├── public/                    # 정적 파일 서빙 (/img/logo.svg 등)
├── supabase_schema.sql        # Supabase 테이블 및 RLS 생성 SQL 스크립트
├── .env.local.example         # Supabase 연동 환경변수 템플릿
└── package.json
```

---

## 3. 핵심 기능 설명

### 1) 헤더 및 메뉴 (Header & Navigation)
- **로고 및 타이틀**: Kids Atelier EWHA 왕관 엠블럼 로고 및 "이화미술공작소" 타이틀
- **6대 핵심 메뉴**:
  1. 아이의 변화 (`#before-after-hero`)
  2. 연령별 수업 (`#programs`)
  3. 수업별 자료실 (`#archive`)
  4. 원장 소개 (`#director`)
  5. 교육철학 (`#philosophy`)
  6. 지난 수업 (`#classes`)
- **로그인 및 권한**:
  - 우측에 로그인 / 회원가입 버튼 배치
  - 일반 학부모 로그인 시: 메뉴바에 `내아이 (My Child)` 뱃지 노출 → 클릭 시 마이페이지로 이동
  - 관리자 로그인 시: 메뉴바에 `어드민 설정 (Admin)` 뱃지 노출 → 클릭 시 어드민으로 이동
  - 편리한 테스트를 위해 상단 바에 `학부모 전환`, `어드민 전환` 원클릭 버튼 제공

### 2) 블로그 메인 섹션 (Hero Before & After)
- 첨부 시안 1:1 정밀 구현:
  - 딥 포레스트 그린 카드 컨테이너 (`#0a4d3c`, 큰 라운딩)
  - 좌측: "그림, 이렇게 달라집니다!", "BEFORE & AFTER", 철학 문구 및 "아이들의 변화 더보기 →" 버튼
  - 우측: 대형 Before & After 비교 사진 2장 배치
  - 관리자 로그인 시 우측 상단에 `메인 섹션 편집` 퀵 바로가기 버튼 표시

### 3) Before & After 4개 부분 (Mini 4 Grid)
- 메인 섹션 하단에 4개의 Before/After 미니 카드 배치
- 각 카드마다 좌측 Before 사진 + 우측 After 사진 분할
- 마우스 호버 시 인터랙티브 줌 효과
- 학생 이름, 나이, 상세 성장 피드백 표시

### 4) 어드민 이미지 및 문구 관리 (`blog/admin`)
- 메인 섹션 Before 이미지, After 이미지 및 카피 문구 실시간 변경
- 하단 4개 카드 각각의 Before 이미지, After 이미지 및 학생 정보 개별 변경
- 로컬 파일 업로드(내 파일) 지원 및 추천 사진 원클릭 선택기 탑재
- 저장 시 블로그 홈(`blogHome`)에 즉시 반영

### 5) 학부모 마이페이지 (`blog/mypage`) - 내아이 액자식 앨범
- 사용자 ID별 독립적인 활동 사진 저장 (`blog/mypage/[userId]`)
- **미술관 원목 액자 프레임(Museum Frame UI)**:
  - 깊이감 있는 원목 몰딩 프레임과 매트 마감
  - 황동 명판(Brass Plaque)에 작품명, 날짜, 미술 영역 표시
  - 원장선생님의 지도 코멘트 카드
  - 클릭 시 고화질 확대 뷰어 모달
  - 새 활동 사진 및 작품 등록 기능 탑재

### 6) Supabase 연동 및 하이브리드 지원
- `@supabase/supabase-js` 클라이언트 설정 완료
- `.env.local`에 Supabase URL/Key를 입력하면 실제 클라우드 DB & Storage와 연동
- 환경변수가 입력되지 않은 초기 상태에서도 LocalStorage 기반으로 모든 기능이 100% 정상 작동

---

## 4. 로컬 실행 방법

```bash
cd c:\work\mydev\ewhahome\blog
npm run dev
```

브라우저에서 `http://localhost:3000` 또는 `http://localhost:3000/blogHome` 접속
