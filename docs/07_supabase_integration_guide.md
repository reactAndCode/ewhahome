# Supabase 데이터베이스 및 인증(Auth) 연동 가이드

이화미술공작소 Next.js 블로그(`blog/`) 및 메인 웹사이트와 Supabase를 연동하여 데이터베이스 CRUD 및 인증 기능을 활용하는 통합 가이드입니다.

---

## 1. 연동 정보 및 환경 변수

현재 프로젝트의 `blog/.env.local`에 Supabase 연결 키가 성공적으로 설정되었습니다:

```env
NEXT_PUBLIC_SUPABASE_URL=https://uizoxtnvqisiicvcxgty.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 2. Supabase 대시보드에서 필수 1회 설정 (SQL 실행)

Supabase 프로젝트에 테이블 및 초기 시드 데이터, RLS 보안 정책을 생성해야 합니다.

1. **[Supabase 대시보드](https://supabase.com/dashboard/project/uizoxtnvqisiicvcxgty)**에 접속합니다.
2. 좌측 메뉴의 **SQL Editor**로 이동합니다.
3. **New query**를 클릭합니다.
4. 프로젝트 내 `blog/supabase_schema.sql` 전체 내용을 복사하여 붙여넣고 **[Run]** 버튼을 누릅니다.

### 생성되는 테이블 요약:
1. `blog_hero_settings`: 블로그 메인 Before & After 배너 정보 (제목, 설명, 사진 URL 등)
2. `before_after_cards`: 하단 4개 학생별 Before & After 성장 카드 정보
3. `kid_activities`: 학부모 마이페이지용 내 아이 활동 사진 및 선생님 코멘트

---

## 3. 구현된 기능 및 연동 구조

### 3.1 스마트 듀얼 스토리지 (Supabase 우선 + 로컬 Fallback)
- **Supabase 연결 시**: Supabase DB와 실시간으로 동기화(조회 및 저장)되며, 동시에 로컬 캐시에도 저장되어 초고속 로딩 보장
- **Supabase 미연동/오프라인 시**: LocalStorage Mock 모드로 자동 폴백(Fallback)되어 끊김 없이 작동

### 3.2 주요 연동 페이지
- **블로그 메인 (`blog/app/page.tsx`)**:
  - `fetchHeroData()`, `fetchCards()`를 통해 Supabase DB의 실시간 데이터를 화면에 반영
- **어드민 관리자 (`blog/app/admin/page.tsx`)**:
  - 원장선생님이 메인 배너 및 Before/After 카드를 수정하고 **[변경사항 저장하기]** 클릭 시 Supabase DB에 실시간 업데이트
  - 상단에 **Supabase 클라우드 실시간 연동 뱃지** 제공
- **학부모 마이페이지 (`blog/app/mypage/page.tsx`)**:
  - 학부모별 내 아이 활동 사진 목록 조회 (`fetchKidPhotos`)
  - 신규 사진 및 코멘트 등록 시 Supabase DB에 즉시 저장 (`createKidPhoto`)

### 3.3 Supabase Auth (로그인/회원가입)
- `blog/lib/store.ts`에 다음 인증 헬퍼 함수가 준비되어 있습니다:
  - `signInWithSupabase(email, password)`
  - `signUpWithSupabase(email, password, name, role, kidName)`
  - `signOutSupabase()`
  - `syncCurrentAuthUser()`

### 3.4 화면 중앙 고정 모달 최적화 (React Portal)
- 상단 헤더의 `position: sticky` 및 `backdrop-filter: blur()`로 인해 모달 팝업이 상단으로 잘려나가던 문제를 `createPortal(..., document.body)`을 적용하여 해결하였습니다.
- 화면 크기나 스크롤 위치에 상관없이 항상 뷰포트 정중앙에 위치하며, 작은 디바이스에서도 위아래 여백을 유지하고 내부 스크롤을 지원합니다.

### 3.5 Supabase Storage 파일 업로드 ('blog-images' 버킷)
- 어드민 페이지(`/admin`) 및 마이페이지(`/mypage`)에서 사진을 선택하면, **Supabase Storage 버킷('blog-images')에 직접 업로드**되어 고유한 공개 CDN URL을 받아와 DB에 저장됩니다.
- 스토리지 업로드 실패 시에도 기존 Base64 인코딩으로 안전하게 자동 전환(Fallback)됩니다.

---

## 4. 로컬 테스트 및 구동 방법

```bash
cd blog
npm run dev
```

브라우저에서 `http://localhost:3000` 접속:
- `/`: 블로그 홈 (Supabase DB 연동 배너 및 카드)
- `/admin`: 관리자 대시보드 (실시간 DB 저장 및 편집)
- `/mypage`: 학부모 마이페이지 (내 아이 활동 사진 갤러리)
