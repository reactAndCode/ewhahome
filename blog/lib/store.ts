import { supabase, isSupabaseConfigured } from './supabase';

export interface MainHeroData {
  id?: string;
  subTitle: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  beforeImg: string;
  afterImg: string;
}

export interface BeforeAfterCardData {
  id: number;
  title: string;
  student: string;
  age: string;
  beforeImg: string;
  afterImg: string;
  description: string;
}

export interface KidActivityPhoto {
  id: string;
  userId: string;
  kidName: string;
  title: string;
  date: string;
  photoUrl: string;
  teacherComment: string;
  tag?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'parent';
  kidName?: string;
}

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';

export function getAssetUrl(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  if (BASE_PATH && path.startsWith('/') && !path.startsWith(BASE_PATH)) {
    return `${BASE_PATH}${path}`;
  }
  return path;
}

// 첨부 시안 기본값
export const DEFAULT_HERO_DATA: MainHeroData = {
  subTitle: '그림, 이렇게 달라집니다!',
  title: 'BEFORE & AFTER',
  description: '잘 그리는 법을 가르치기보다 관찰하고, 생각하고, 자기 방식으로 표현하는 힘을 키웁니다.',
  buttonText: '아이들의 변화 더보기 →',
  buttonLink: '#before-after-list',
  beforeImg: '/img/1000075797.jpg', // 아이 스케치 원본
  afterImg: '/img/1000110839.png',  // 아이 완성작 원본
};

export const DEFAULT_CARDS: BeforeAfterCardData[] = [
  {
    id: 1,
    title: '형태 인지와 표정 드로잉',
    student: '김지우',
    age: '7세',
    beforeImg: '/img/1000025516.jpg',
    afterImg: '/img/1000082847.jpg',
    description: '단순 선 긋기에서 섬세한 표정과 입체적인 감정 표현으로 발전했습니다.'
  },
  {
    id: 2,
    title: '스토리텔링과 공간 구성',
    student: '박서준',
    age: '초등 2학년',
    beforeImg: '/img/1000026774.jpg',
    afterImg: '/img/1000026651.jpg',
    description: '평면적인 나열에서 원근감과 상황 스토리가 담긴 융합 미술로 변화했습니다.'
  },
  {
    id: 3,
    title: '생각을 입체로 꺼내는 조형',
    student: '이민아',
    age: '초등 1학년',
    beforeImg: '/img/1000103404.jpg',
    afterImg: '/img/1000085952.jpg',
    description: '망설이던 아이가 스스로 주제를 정하고 오브제를 결합하는 자신감을 얻었습니다.'
  },
  {
    id: 4,
    title: '자유로운 채색과 세밀한 관찰',
    student: '최도윤',
    age: '초등 3학년',
    beforeImg: '/img/1000110541.png',
    afterImg: '/img/1000056512.jpg',
    description: '색칠의 두려움을 극복하고 다양한 붓터치와 섬세한 명암을 완성했습니다.'
  }
];

// 기본 학부모 및 내아이 샘플 데이터
export const DEFAULT_KID_PHOTOS: KidActivityPhoto[] = [
  {
    id: 'photo-1',
    userId: 'parent_minji',
    kidName: '민지 (8세)',
    title: '봄꽃 정원과 나비의 비행',
    date: '2026.04.12',
    photoUrl: '/img/1000082847.jpg',
    teacherComment: '나비의 날개 대칭을 스스로 관찰하고 다양한 질감의 종이를 찢어 붙이며 창의적인 입체감을 살렸어요! 자신감이 돋보이는 작품입니다.',
    tag: '혼합재료'
  },
  {
    id: 'photo-2',
    userId: 'parent_minji',
    kidName: '민지 (8세)',
    title: '행복한 우리 가족의 주말 산책',
    date: '2026.04.19',
    photoUrl: '/img/1000026651.jpg',
    teacherComment: '가족들의 동작과 포즈를 세밀하게 드로잉하고, 따뜻한 파스텔 톤으로 온화한 분위기를 아주 잘 연출해주었습니다.',
    tag: '동작드로잉'
  },
  {
    id: 'photo-3',
    userId: 'parent_minji',
    kidName: '민지 (8세)',
    title: '도자기 오브제와 상상 속 비밀의 숲',
    date: '2026.04.26',
    photoUrl: '/img/1000085952.jpg',
    teacherComment: '책 속의 이야기를 자신의 경험과 연결하여 독창적인 오브제를 완성했어요. 색채 감각이 매우 풍부해졌습니다.',
    tag: '독서융합'
  },
  {
    id: 'photo-4',
    userId: 'parent_jun',
    kidName: '준우 (6세)',
    title: '공룡 나라의 신나는 자동차 레이싱',
    date: '2026.04.20',
    photoUrl: '/img/1000056512.jpg',
    teacherComment: '좋아하는 공룡의 형태를 관찰하여 다채로운 색감으로 표현했습니다. 미술에 대한 흥미가 부쩍 자라났어요!',
    tag: '관찰드로잉'
  }
];

const IS_BROWSER = typeof window !== 'undefined';

// ==============================================================================
// 1. 로컬 스토리지 Fallback 동기 함수들
// ==============================================================================

export function getStoredHeroData(): MainHeroData {
  if (!IS_BROWSER) return DEFAULT_HERO_DATA;
  try {
    const data = localStorage.getItem('ewha_blog_hero');
    return data ? JSON.parse(data) : DEFAULT_HERO_DATA;
  } catch {
    return DEFAULT_HERO_DATA;
  }
}

export function saveHeroData(data: MainHeroData): void {
  if (!IS_BROWSER) return;
  localStorage.setItem('ewha_blog_hero', JSON.stringify(data));
}

export function getStoredCards(): BeforeAfterCardData[] {
  if (!IS_BROWSER) return DEFAULT_CARDS;
  try {
    const data = localStorage.getItem('ewha_blog_cards');
    return data ? JSON.parse(data) : DEFAULT_CARDS;
  } catch {
    return DEFAULT_CARDS;
  }
}

export function saveCards(cards: BeforeAfterCardData[]): void {
  if (!IS_BROWSER) return;
  localStorage.setItem('ewha_blog_cards', JSON.stringify(cards));
}

export function getStoredKidPhotos(userId?: string): KidActivityPhoto[] {
  if (!IS_BROWSER) {
    if (userId) return DEFAULT_KID_PHOTOS.filter(p => p.userId === userId);
    return DEFAULT_KID_PHOTOS;
  }
  try {
    const data = localStorage.getItem('ewha_kid_photos');
    const photos: KidActivityPhoto[] = data ? JSON.parse(data) : DEFAULT_KID_PHOTOS;
    if (userId) return photos.filter(p => p.userId === userId);
    return photos;
  } catch {
    return DEFAULT_KID_PHOTOS;
  }
}

export function addKidPhoto(photo: Omit<KidActivityPhoto, 'id'>): KidActivityPhoto {
  const newPhoto: KidActivityPhoto = {
    ...photo,
    id: 'photo-' + Date.now()
  };
  if (IS_BROWSER) {
    try {
      const existing = getStoredKidPhotos();
      const updated = [newPhoto, ...existing];
      localStorage.setItem('ewha_kid_photos', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  }
  return newPhoto;
}

export function getCurrentUser(): AuthUser | null {
  if (!IS_BROWSER) return null;
  try {
    const user = localStorage.getItem('ewha_current_user');
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: AuthUser | null): void {
  if (!IS_BROWSER) return;
  if (user) {
    localStorage.setItem('ewha_current_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('ewha_current_user');
  }
}

// ==============================================================================
// 2. Supabase DB 비동기 연동 함수 (Supabase 우선, 실패시 LocalStorage 자동 Fallback)
// ==============================================================================

/** 메인 히어로 데이터 가져오기 */
export async function fetchHeroData(): Promise<MainHeroData> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('blog_hero_settings')
        .select('*')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        const hero: MainHeroData = {
          id: data.id,
          subTitle: data.sub_title,
          title: data.title,
          description: data.description,
          buttonText: data.button_text,
          buttonLink: data.button_link,
          beforeImg: data.before_img_url,
          afterImg: data.after_img_url
        };
        saveHeroData(hero);
        return hero;
      }
    } catch (err) {
      console.warn('Supabase fetchHeroData fallback to local storage:', err);
    }
  }
  return getStoredHeroData();
}

/** 메인 히어로 데이터 저장하기 */
export async function updateHeroData(hero: MainHeroData): Promise<boolean> {
  saveHeroData(hero); // 로컬 캐싱 즉시 반영

  if (isSupabaseConfigured && supabase) {
    try {
      const payload = {
        sub_title: hero.subTitle,
        title: hero.title,
        description: hero.description,
        button_text: hero.buttonText,
        button_link: hero.buttonLink,
        before_img_url: hero.beforeImg,
        after_img_url: hero.afterImg,
        updated_at: new Date().toISOString()
      };

      // 기존 레코드 존재 여부 확인
      const { data: existing } = await supabase.from('blog_hero_settings').select('id').limit(1).maybeSingle();
      if (existing) {
        const { error } = await supabase.from('blog_hero_settings').update(payload).eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('blog_hero_settings').insert([payload]);
        if (error) throw error;
      }
      return true;
    } catch (err) {
      console.error('Supabase updateHeroData error:', err);
      return false;
    }
  }
  return true;
}

/** 비포&애프터 카드 목록 가져오기 */
export async function fetchCards(): Promise<BeforeAfterCardData[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('before_after_cards')
        .select('*')
        .order('order_index', { ascending: true });

      if (!error && data && data.length > 0) {
        const mapped: BeforeAfterCardData[] = data.map((item: any) => ({
          id: item.id,
          title: item.title,
          student: item.student_name,
          age: item.student_age,
          beforeImg: item.before_img_url,
          afterImg: item.after_img_url,
          description: item.description || ''
        }));
        saveCards(mapped);
        return mapped;
      }
    } catch (err) {
      console.warn('Supabase fetchCards fallback to local storage:', err);
    }
  }
  return getStoredCards();
}

/** 비포&애프터 카드 목록 저장하기 */
export async function updateCards(cards: BeforeAfterCardData[]): Promise<boolean> {
  saveCards(cards);

  if (isSupabaseConfigured && supabase) {
    try {
      for (const card of cards) {
        await supabase.from('before_after_cards').upsert({
          id: card.id,
          title: card.title,
          student_name: card.student,
          student_age: card.age,
          before_img_url: card.beforeImg,
          after_img_url: card.afterImg,
          description: card.description,
          order_index: card.id,
          updated_at: new Date().toISOString()
        });
      }
      return true;
    } catch (err) {
      console.error('Supabase updateCards error:', err);
      return false;
    }
  }
  return true;
}

/** 내아이 활동 사진 목록 가져오기 */
export async function fetchKidPhotos(userId?: string): Promise<KidActivityPhoto[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase.from('kid_activities').select('*').order('created_at', { ascending: false });
      if (userId) {
        query = query.eq('user_id', userId);
      }
      const { data, error } = await query;
      if (!error && data && data.length > 0) {
        const mapped: KidActivityPhoto[] = data.map((item: any) => ({
          id: item.id,
          userId: item.user_id,
          kidName: item.kid_name,
          title: item.title,
          date: item.activity_date,
          photoUrl: item.photo_url,
          teacherComment: item.teacher_comment || '',
          tag: item.tag || '자유표현'
        }));
        return mapped;
      }
    } catch (err) {
      console.warn('Supabase fetchKidPhotos fallback to local storage:', err);
    }
  }
  return getStoredKidPhotos(userId);
}

/** 내아이 활동 사진 등록하기 */
export async function createKidPhoto(photo: Omit<KidActivityPhoto, 'id'>): Promise<KidActivityPhoto> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('kid_activities').insert([{
        user_id: photo.userId,
        kid_name: photo.kidName,
        title: photo.title,
        activity_date: photo.date,
        photo_url: photo.photoUrl,
        teacher_comment: photo.teacherComment,
        tag: photo.tag || '자유표현'
      }]).select().single();

      if (!error && data) {
        return {
          id: data.id,
          userId: data.user_id,
          kidName: data.kid_name,
          title: data.title,
          date: data.activity_date,
          photoUrl: data.photo_url,
          teacherComment: data.teacher_comment || '',
          tag: data.tag
        };
      }
    } catch (err) {
      console.error('Supabase createKidPhoto error:', err);
    }
  }
  return addKidPhoto(photo);
}

/** 내아이 활동 사진 삭제하기 */
export async function deleteKidPhoto(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('kid_activities').delete().eq('id', id);
      if (error) throw error;
    } catch (err) {
      console.error('Supabase deleteKidPhoto error:', err);
    }
  }
  if (IS_BROWSER) {
    try {
      const existing = getStoredKidPhotos();
      const updated = existing.filter(p => p.id !== id);
      localStorage.setItem('ewha_kid_photos', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  }
  return true;
}

// ==============================================================================
// 3. Supabase Auth (로그인 / 회원가입 / 세션 관리)
// ==============================================================================

/** 이메일/비밀번호 로그인 */
export async function signInWithSupabase(email: string, password: string):Promise<{ user: AuthUser | null; error: string | null }> {
  if (!isSupabaseConfigured || !supabase) {
    // Supabase 미연동시 Mock 로그인 허용
    if (email.includes('admin')) {
      const adminUser: AuthUser = { id: 'admin_master', email, name: '총괄 원장선생님', role: 'admin' };
      setCurrentUser(adminUser);
      return { user: adminUser, error: null };
    }
    const parentUser: AuthUser = { id: 'parent_user', email, name: '학부모 회원', role: 'parent', kidName: '민지 (8세)' };
    setCurrentUser(parentUser);
    return { user: parentUser, error: null };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { user: null, error: error.message };

    const sbUser = data.user;
    const metadata = sbUser.user_metadata || {};
    const role: 'admin' | 'parent' = email.includes('admin') || metadata.role === 'admin' ? 'admin' : 'parent';

    const authUser: AuthUser = {
      id: sbUser.id,
      email: sbUser.email || email,
      name: metadata.name || (role === 'admin' ? '총괄 원장선생님' : '학부모 회원'),
      role,
      kidName: metadata.kidName || (role === 'parent' ? '우리 아이' : undefined)
    };

    setCurrentUser(authUser);
    return { user: authUser, error: null };
  } catch (err: any) {
    return { user: null, error: err.message || '로그인 중 오류가 발생했습니다.' };
  }
}

/** 이메일 회원가입 */
export async function signUpWithSupabase(
  email: string, 
  password: string, 
  name: string, 
  role: 'admin' | 'parent' = 'parent',
  kidName?: string
): Promise<{ user: AuthUser | null; error: string | null }> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
      options: {
        data: { name: name.trim(), role, kidName: kidName || (role === 'parent' ? `${name.trim()}의 자녀` : undefined) }
      }
    });

    if (error) {
      console.error('Supabase auth.signUp 에러:', error);
      return { user: null, error: error.message };
    }

    const sbUser = data.user;
    if (!sbUser) {
      return { user: null, error: '회원가입 요청이 완료되지 않았습니다. 이메일을 확인해 주세요.' };
    }

    const authUser: AuthUser = {
      id: sbUser.id,
      email: sbUser.email || email,
      name: name.trim(),
      role,
      kidName: kidName || (role === 'parent' ? `${name.trim()}의 자녀` : undefined)
    };

    setCurrentUser(authUser);
    return { user: authUser, error: null };
  } catch (err: any) {
    console.error('signUpWithSupabase 예외 발생:', err);
    return { user: null, error: err.message || '회원가입 중 오류가 발생했습니다.' };
  }
}

/** 로그아웃 */
export async function signOutSupabase(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
  }
  setCurrentUser(null);
}

/** 현재 Supabase 세션 사용자 동기화 */
export async function syncCurrentAuthUser(): Promise<AuthUser | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const metadata = user.user_metadata || {};
        const role: 'admin' | 'parent' = (user.email?.includes('admin') || metadata.role === 'admin') ? 'admin' : 'parent';
        const authUser: AuthUser = {
          id: user.id,
          email: user.email || '',
          name: metadata.name || (role === 'admin' ? '총괄 원장선생님' : '학부모 회원'),
          role,
          kidName: metadata.kidName
        };
        setCurrentUser(authUser);
        return authUser;
      }
    } catch (e) {
      console.warn('Supabase auth session sync failed:', e);
    }
  }
  return getCurrentUser();
}

// ==============================================================================
// 4. Supabase Storage 파일 업로드 함수
// ==============================================================================

/**
 * 이미지 파일을 Supabase Storage 버킷('blog-images')에 직접 업로드하고 공개 CDN URL을 반환합니다.
 * 업로드 실패 시 null을 반환하며, 호출부에서 Base64로 Fallback 처리할 수 있습니다.
 */
export async function uploadImageToSupabase(file: File, folder = 'uploads'): Promise<string | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  try {
    const fileExt = file.name.split('.').pop() || 'jpg';
    const cleanExt = fileExt.toLowerCase().replace(/[^a-z0-9]/g, '');
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${cleanExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from('blog-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) {
      console.warn('Supabase Storage upload warning (falling back to base64):', error.message);
      return null;
    }

    const { data: publicUrlData } = supabase.storage
      .from('blog-images')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  } catch (err) {
    console.warn('Supabase Storage exception (falling back to base64):', err);
    return null;
  }
}

