import { supabase, isSupabaseConfigured } from './supabase';

export interface MainHeroData {
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

// 로컬 스토리지 헬퍼
const IS_BROWSER = typeof window !== 'undefined';

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
    if (userId) {
      return DEFAULT_KID_PHOTOS.filter(p => p.userId === userId);
    }
    return DEFAULT_KID_PHOTOS;
  }
  try {
    const data = localStorage.getItem('ewha_kid_photos');
    const photos: KidActivityPhoto[] = data ? JSON.parse(data) : DEFAULT_KID_PHOTOS;
    if (userId) {
      return photos.filter(p => p.userId === userId);
    }
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

// 현재 로그인 유저
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
