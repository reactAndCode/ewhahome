-- ==============================================================================
-- 이화미술공작소 Supabase 데이터베이스 & 스토리지 테이블 스키마
-- Supabase 대시보드 -> SQL Editor -> 'New query' 에 붙여넣고 [Run] 실행하세요.
-- ==============================================================================

-- 1. 메인 히어로 Before & After 설정 테이블
CREATE TABLE IF NOT EXISTS public.blog_hero_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sub_title TEXT NOT NULL DEFAULT '그림, 이렇게 달라집니다!',
    title TEXT NOT NULL DEFAULT 'BEFORE & AFTER',
    description TEXT NOT NULL DEFAULT '잘 그리는 법을 가르치기보다 관찰하고, 생각하고, 자기 방식으로 표현하는 힘을 키웁니다.',
    button_text TEXT NOT NULL DEFAULT '아이들의 변화 더보기 →',
    button_link TEXT DEFAULT '#before-after-list',
    before_img_url TEXT NOT NULL DEFAULT '/img/1000075797.jpg',
    after_img_url TEXT NOT NULL DEFAULT '/img/1000110839.png',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. 하단 4개 Before & After 카드 테이블
CREATE TABLE IF NOT EXISTS public.before_after_cards (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    student_name TEXT NOT NULL,
    student_age TEXT NOT NULL,
    before_img_url TEXT NOT NULL,
    after_img_url TEXT NOT NULL,
    description TEXT,
    order_index INT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. 내아이 활동 사진 (학부모 전용 갤러리)
CREATE TABLE IF NOT EXISTS public.kid_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL, -- 학부모 사용자 고유 ID (auth.users id 또는 이메일)
    kid_name TEXT NOT NULL,
    title TEXT NOT NULL,
    activity_date TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    teacher_comment TEXT,
    tag TEXT DEFAULT '자유표현',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 기본 초기 데이터 (테이블이 비어있는 경우에만 자동 삽입)
-- ==============================================================================

INSERT INTO public.blog_hero_settings (sub_title, title, description, button_text, button_link, before_img_url, after_img_url)
SELECT 
    '그림, 이렇게 달라집니다!',
    'BEFORE & AFTER',
    '잘 그리는 법을 가르치기보다 관찰하고, 생각하고, 자기 방식으로 표현하는 힘을 키웁니다.',
    '아이들의 변화 더보기 →',
    '#before-after-list',
    '/img/1000075797.jpg',
    '/img/1000110839.png'
WHERE NOT EXISTS (SELECT 1 FROM public.blog_hero_settings);

INSERT INTO public.before_after_cards (id, title, student_name, student_age, before_img_url, after_img_url, description, order_index)
VALUES 
    (1, '형태 인지와 표정 드로잉', '김지우', '7세', '/img/1000025516.jpg', '/img/1000082847.jpg', '단순 선 긋기에서 섬세한 표정과 입체적인 감정 표현으로 발전했습니다.', 1),
    (2, '스토리텔링과 공간 구성', '박서준', '초등 2학년', '/img/1000026774.jpg', '/img/1000026651.jpg', '평면적인 나열에서 원근감과 상황 스토리가 담긴 융합 미술로 변화했습니다.', 2),
    (3, '생각을 입체로 꺼내는 조형', '이민아', '초등 1학년', '/img/1000103404.jpg', '/img/1000085952.jpg', '망설이던 아이가 스스로 주제를 정하고 오브제를 결합하는 자신감을 얻었습니다.', 3),
    (4, '자유로운 채색과 세밀한 관찰', '최도윤', '초등 3학년', '/img/1000110541.png', '/img/1000056512.jpg', '색칠의 두려움을 극복하고 다양한 붓터치와 섬세한 명암을 완성했습니다.', 4)
ON CONFLICT (id) DO NOTHING;

-- 시퀀스 재설정
SELECT setval('before_after_cards_id_seq', (SELECT COALESCE(MAX(id), 1) FROM public.before_after_cards));

-- ==============================================================================
-- RLS (Row Level Security) 및 접근 권한 설정
-- 웹 프론트엔드(Next.js)에서 누구나 읽고(SELECT), 관리자/인증 사용자가 CUD 가능하도록 허용
-- ==============================================================================

ALTER TABLE public.blog_hero_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.before_after_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kid_activities ENABLE ROW LEVEL SECURITY;

-- 1) 메인 히어로 설정: 누구나 조회 가능, 모든 사용자/관리자 수정 가능
DROP POLICY IF EXISTS "누구나 히어로 설정 조회" ON public.blog_hero_settings;
CREATE POLICY "누구나 히어로 설정 조회" ON public.blog_hero_settings FOR SELECT USING (true);

DROP POLICY IF EXISTS "히어로 설정 수정 허용" ON public.blog_hero_settings;
CREATE POLICY "히어로 설정 수정 허용" ON public.blog_hero_settings FOR ALL USING (true) WITH CHECK (true);

-- 2) 비포&애프터 카드: 누구나 조회 가능, 모든 사용자/관리자 수정 가능
DROP POLICY IF EXISTS "누구나 카드 조회" ON public.before_after_cards;
CREATE POLICY "누구나 카드 조회" ON public.before_after_cards FOR SELECT USING (true);

DROP POLICY IF EXISTS "카드 수정 허용" ON public.before_after_cards;
CREATE POLICY "카드 수정 허용" ON public.before_after_cards FOR ALL USING (true) WITH CHECK (true);

-- 3) 내아이 활동 사진: 누구나 조회 및 작성 가능 (학부모/원장님 등록)
DROP POLICY IF EXISTS "활동 사진 조회" ON public.kid_activities;
CREATE POLICY "활동 사진 조회" ON public.kid_activities FOR SELECT USING (true);

DROP POLICY IF EXISTS "활동 사진 등록 및 수정 허용" ON public.kid_activities;
CREATE POLICY "활동 사진 등록 및 수정 허용" ON public.kid_activities FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- 4. Supabase Storage ('blog-images' 버킷) 권한 설정
-- 프론트엔드에서 사진을 직접 업로드하고 열람할 수 있도록 정책 부여
-- ==============================================================================

DROP POLICY IF EXISTS "Public Read blog-images" ON storage.objects;
CREATE POLICY "Public Read blog-images" ON storage.objects 
FOR SELECT USING (bucket_id = 'blog-images');

DROP POLICY IF EXISTS "Public Upload blog-images" ON storage.objects;
CREATE POLICY "Public Upload blog-images" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'blog-images');

DROP POLICY IF EXISTS "Public Update blog-images" ON storage.objects;
CREATE POLICY "Public Update blog-images" ON storage.objects 
FOR UPDATE USING (bucket_id = 'blog-images');
