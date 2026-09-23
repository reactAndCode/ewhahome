# ==============================================================================
# 이화미술공작소 Supabase 데이터베이스 & 스토리지 테이블 스키마
# ==============================================================================

-- 1. 메인 히어로 Before & After 설정 테이블
CREATE TABLE IF NOT EXISTS public.blog_hero_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sub_title TEXT NOT NULL DEFAULT '그림, 이렇게 달라집니다!',
    title TEXT NOT NULL DEFAULT 'BEFORE & AFTER',
    description TEXT NOT NULL,
    button_text TEXT NOT NULL DEFAULT '아이들의 변화 더보기 →',
    button_link TEXT DEFAULT '#before-after-list',
    before_img_url TEXT NOT NULL,
    after_img_url TEXT NOT NULL,
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
    user_id TEXT NOT NULL, -- 학부모 사용자 고유 ID
    kid_name TEXT NOT NULL,
    title TEXT NOT NULL,
    activity_date TEXT NOT NULL,
    photo_url TEXT NOT NULL,
    teacher_comment TEXT,
    tag TEXT DEFAULT '자유표현',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Supabase Storage 버킷 생성 권장 목록:
-- 버킷 1: 'blog-images' (공개 버킷: 메인 및 Before/After 사진)
-- 버킷 2: 'kid-activity-frames' (보안 버킷 또는 학부모 공개 버킷)

-- RLS (Row Level Security) 설정 예시:
ALTER TABLE public.kid_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "학부모 본인 아이의 활동 사진만 조회" 
ON public.kid_activities FOR SELECT 
USING (auth.uid()::text = user_id OR user_id = current_setting('request.jwt.claims', true)::json->>'sub');

CREATE POLICY "관리자는 모든 설정 변경 가능" 
ON public.blog_hero_settings FOR ALL 
USING (true);
