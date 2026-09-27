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

// 연령별 수업 블로그 카드 (Zone 2)
export interface AgeBlogCard {
  id: string;
  image: string;      // 수업 이미지 URL
  title: string;      // 카드 제목
  date: string;       // '2026.09'
  excerpt: string;    // 2-3줄 미리보기
  tag: string;        // 카테고리 배지
  linkUrl?: string;   // 클릭 시 이동할 링크 (새 창)
}

// 연령별 수업 불릿 항목 (Zone 3)
export interface AgeBulletItem {
  id: string;
  kidPhoto: string;   // 원형 아이 사진 URL
  headline: string;   // 짧은 제목
  desc: string;       // 2-3줄 설명
  linkUrl?: string;   // 클릭 시 이동할 링크 (새 창)
}

// 연령별 수업 전체 데이터
export interface AgeProgramData {
  id: number;
  icon: string;           // 탭 이모지 아이콘
  title: string;          // '초등 1·2학년'
  sub: string;            // '독서미술과 그림일기'
  detail: string;         // 상세 설명
  color: string;          // 탭 포인트 컬러
  blogCards: AgeBlogCard[];   // Zone 2 블로그 카드 2개
  bulletItems: AgeBulletItem[]; // Zone 3 불릿 목록
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

// 연령별 수업 기본 데이터
export const DEFAULT_AGE_PROGRAMS: AgeProgramData[] = [
  {
    id: 1,
    icon: '🌱',
    title: '6·7세 유아미술',
    sub: '놀이로 만나는 첫 미술',
    detail: '재료와 친해지고 오감을 자극하는 다양한 매체 탐색 및 표현의 첫걸음',
    color: '#f59e0b',
    blogCards: [
      {
        id: 'ag1-card1',
        image: '/img/1000082847.jpg',
        title: '손끝으로 만나는 첫 번째 색깔 이야기',
        date: '2026.09',
        excerpt: '핑거페인팅과 다양한 재료를 탐색하며 색깔의 혼합과 질감을 온몸으로 느끼는 수업이에요.',
        tag: '감각 탐색',
        linkUrl: ''
      },
      {
        id: 'ag1-card2',
        image: '/img/1000026651.jpg',
        title: '나뭇잎으로 만든 우리 가족 도장 그림',
        date: '2026.08',
        excerpt: '자연물 프린팅으로 형태를 인식하고, 가족을 주제로 나만의 이야기를 담아보았어요.',
        tag: '자연 미술',
        linkUrl: ''
      }
    ],
    bulletItems: [
      {
        id: 'ag1-b1',
        kidPhoto: '/img/1000103404.jpg',
        headline: '"와, 색이 섞여요!" 를 처음 경험합니다.',
        desc: '파랑과 노랑이 만나 초록이 되는 순간, 아이의 눈이 반짝입니다. 재료를 두려워하지 않는 첫 걸음.',
        linkUrl: ''
      },
      {
        id: 'ag1-b2',
        kidPhoto: '/img/1000085952.jpg',
        headline: '손으로 직접 빚고, 찢고, 붙입니다.',
        desc: '가위 없이 손으로 찢어 붙이는 콜라주로 소근육을 발달시키고 조형 감각을 키워요.',
        linkUrl: ''
      },
      {
        id: 'ag1-b3',
        kidPhoto: '/img/1000056512.jpg',
        headline: '"나도 그릴 수 있어요!" 자신감이 생깁니다.',
        desc: '완성도보다 과정을 칭찬하며 미술에 대한 긍정적 경험을 쌓아요.',
        linkUrl: ''
      }
    ]
  },
  {
    id: 2,
    icon: '📖',
    title: '초등 1·2학년',
    sub: '독서미술과 그림일기',
    detail: '이야기를 시각화하고 관찰을 통해 형태를 자연스럽게 담아내는 표현 훈련',
    color: '#10b981',
    blogCards: [
      {
        id: 'ag2-card1',
        image: '/img/1000026651.jpg',
        title: '「강아지똥」을 읽고 그린 봄꽃 수채화',
        date: '2026.09',
        excerpt: '권정생 작가의 그림책을 함께 읽고, 민들레꽃이 피어나는 장면을 수채화로 표현했어요.',
        tag: '독서미술',
        linkUrl: ''
      },
      {
        id: 'ag2-card2',
        image: '/img/1000085952.jpg',
        title: '오늘 하루를 그림으로 쓰는 그림일기',
        date: '2026.08',
        excerpt: '학교에서 있었던 가장 기억에 남는 순간을 그림과 짧은 글로 기록하는 감성 수업.',
        tag: '그림일기',
        linkUrl: ''
      }
    ],
    bulletItems: [
      {
        id: 'ag2-b1',
        kidPhoto: '/img/1000082847.jpg',
        headline: '책 속 장면을 머릿속에 그립니다.',
        desc: '이야기를 듣고 상상력으로 장면을 구성하는 힘이 생겨요. 독해력과 표현력이 동시에 자랍니다.',
        linkUrl: ''
      },
      {
        id: 'ag2-b2',
        kidPhoto: '/img/1000026774.jpg',
        headline: '"오늘 있었던 일" 을 색과 선으로 담습니다.',
        desc: '그림일기를 통해 하루를 정리하는 습관이 생기고, 감정 표현 어휘도 풍부해져요.',
        linkUrl: ''
      },
      {
        id: 'ag2-b3',
        kidPhoto: '/img/1000103404.jpg',
        headline: '형태를 보고 따라 그리는 관찰력이 생깁니다.',
        desc: '사물을 천천히 관찰하여 선으로 옮기는 연습으로 집중력이 눈에 띄게 향상돼요.',
        linkUrl: ''
      }
    ]
  },
  {
    id: 3,
    icon: '👁️',
    title: '초등 3·4학년',
    sub: '관찰하고 표현하는 힘',
    detail: '사물의 비례와 원근, 인체 동작을 스스로 관찰하여 자기만의 화풍으로 완성',
    color: '#0a4d3c',
    blogCards: [
      {
        id: 'ag3-card1',
        image: '/img/1000056512.jpg',
        title: '정물 관찰 소묘 — 과일 바구니의 빛과 그림자',
        date: '2026.09',
        excerpt: '사과와 레몬의 입체감을 명암으로 표현하며, 관찰의 깊이가 한 단계 성장했습니다.',
        tag: '소묘·관찰화',
        linkUrl: ''
      },
      {
        id: 'ag3-card2',
        image: '/img/1000025516.jpg',
        title: '나의 손 동작 드로잉 — 인체 비례 기초',
        date: '2026.08',
        excerpt: '자신의 손을 관찰하며 비례와 관절의 움직임을 드로잉하는 관찰 훈련 수업이에요.',
        tag: '동작드로잉',
        linkUrl: ''
      }
    ],
    bulletItems: [
      {
        id: 'ag3-b1',
        kidPhoto: '/img/1000025516.jpg',
        headline: '"왜 그렇게 생겼을까?" 를 스스로 묻습니다.',
        desc: '대상을 그냥 그리는 것이 아니라 형태의 이유를 탐구하며 관찰력이 비약적으로 성장해요.',
        linkUrl: ''
      },
      {
        id: 'ag3-b2',
        kidPhoto: '/img/1000056512.jpg',
        headline: '명암으로 입체감을 만들어냅니다.',
        desc: '빛의 방향을 이해하고 명암 단계를 조절하며 평면 위에 3D를 표현하는 감각이 생겨요.',
        linkUrl: ''
      },
      {
        id: 'ag3-b3',
        kidPhoto: '/img/1000082847.jpg',
        headline: '자기만의 화풍이 조금씩 보이기 시작합니다.',
        desc: '선의 강약, 채색 방식, 구도 선택에서 아이만의 개성이 자연스럽게 묻어나기 시작해요.',
        linkUrl: ''
      }
    ]
  },
  {
    id: 4,
    icon: '🎨',
    title: '초등 5·6학년',
    sub: '기초디자인으로 넓어지는 시야',
    detail: '명암과 입체감, 정교한 화면 구성을 통해 완성도 높은 포트폴리오 구축',
    color: '#7c3aed',
    blogCards: [
      {
        id: 'ag4-card1',
        image: '/img/1000110541.png',
        title: '기초디자인 — 반복과 리듬으로 만드는 패턴',
        date: '2026.09',
        excerpt: '동일한 형태의 반복과 색의 배열로 시각적 리듬감을 만들어내는 기초 디자인 수업.',
        tag: '기초디자인',
        linkUrl: ''
      },
      {
        id: 'ag4-card2',
        image: '/img/1000085952.jpg',
        title: '포트폴리오 구성 — 나의 작품 세계 소개하기',
        date: '2026.08',
        excerpt: '1년간의 작품을 선별하고 배치하여 나만의 포트폴리오를 구성하는 특별 수업이에요.',
        tag: '포트폴리오',
        linkUrl: ''
      }
    ],
    bulletItems: [
      {
        id: 'ag4-b1',
        kidPhoto: '/img/1000110541.png',
        headline: '"색을 고르는 것도 공부예요." 를 깨닫습니다.',
        desc: '색채 이론과 배색 원리를 배우며 의도적으로 색을 선택하는 능력이 생겨요.',
        linkUrl: ''
      },
      {
        id: 'ag4-b2',
        kidPhoto: '/img/1000026774.jpg',
        headline: '화면을 스스로 구성하고 연출합니다.',
        desc: '구도, 여백, 강조점을 직접 결정하며 시각 편집 감각이 자연스럽게 길러져요.',
        linkUrl: ''
      },
      {
        id: 'ag4-b3',
        kidPhoto: '/img/1000082847.jpg',
        headline: '작품에 대해 스스로 설명할 수 있게 됩니다.',
        desc: '"왜 이렇게 했어요?" 라는 질문에 자신 있게 의도와 감정을 설명하는 표현력이 생겨요.',
        linkUrl: ''
      }
    ]
  },
  {
    id: 5,
    icon: '🖼️',
    title: '중등 미술',
    sub: '더 깊은 탐구와 표현',
    detail: '소묘, 디자인, 융합미술을 바탕으로 깊이 있는 조형 감각과 창의적 시각 탐구',
    color: '#dc2626',
    blogCards: [
      {
        id: 'ag5-card1',
        image: '/img/1000026774.jpg',
        title: '인물 소묘 — 자화상으로 완성하는 나',
        date: '2026.09',
        excerpt: '거울을 보고 자화상을 그리며 자신을 깊이 탐구하는 감성적인 미술 수업이에요.',
        tag: '소묘',
        linkUrl: ''
      },
      {
        id: 'ag5-card2',
        image: '/img/1000103404.jpg',
        title: '미술사와 함께하는 모작과 재해석',
        date: '2026.08',
        excerpt: '고흐, 클림트의 작품을 분석하고 자신만의 시선으로 재해석하는 창의적 모작 수업.',
        tag: '미술사·모작',
        linkUrl: ''
      }
    ],
    bulletItems: [
      {
        id: 'ag5-b1',
        kidPhoto: '/img/1000026774.jpg',
        headline: '미술이 "공부" 임을 받아들이게 됩니다.',
        desc: '체계적인 소묘와 색채 이론 학습을 통해 미술을 깊이 있게 탐구하는 자세가 생겨요.',
        linkUrl: ''
      },
      {
        id: 'ag5-b2',
        kidPhoto: '/img/1000103404.jpg',
        headline: '자신만의 작품 언어를 찾아갑니다.',
        desc: '여러 사조와 기법을 경험하면서 자신이 끌리는 스타일과 주제가 선명해져요.',
        linkUrl: ''
      },
      {
        id: 'ag5-b3',
        kidPhoto: '/img/1000025516.jpg',
        headline: '입시·포트폴리오까지 탄탄히 준비합니다.',
        desc: '기초부터 체계적으로 쌓아온 실력이 입시 미술과 전문 포트폴리오의 기반이 돼요.',
        linkUrl: ''
      }
    ]
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

export function getStoredAgePrograms(): AgeProgramData[] {
  if (!IS_BROWSER) return DEFAULT_AGE_PROGRAMS;
  try {
    const data = localStorage.getItem('ewha_age_programs');
    return data ? JSON.parse(data) : DEFAULT_AGE_PROGRAMS;
  } catch {
    return DEFAULT_AGE_PROGRAMS;
  }
}

export function saveAgePrograms(programs: AgeProgramData[]): void {
  if (!IS_BROWSER) return;
  localStorage.setItem('ewha_age_programs', JSON.stringify(programs));
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
  const normalizedEmail = email.trim().toLowerCase();
  const isAdminEmail = normalizedEmail === 'admin@ewhaart.co.kr' || normalizedEmail === 'admin@ewha-art.com' || normalizedEmail.startsWith('admin@');

  if (!isSupabaseConfigured || !supabase) {
    // Supabase 미연동시 Mock 로그인 허용
    if (isAdminEmail) {
      const adminUser: AuthUser = { id: 'admin_master', email: normalizedEmail, name: '총괄 원장선생님', role: 'admin' };
      setCurrentUser(adminUser);
      return { user: adminUser, error: null };
    }
    const parentUser: AuthUser = { id: 'parent_user', email: normalizedEmail, name: '학부모 회원', role: 'parent', kidName: '민지 (8세)' };
    setCurrentUser(parentUser);
    return { user: parentUser, error: null };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email: normalizedEmail, password });
    if (error) return { user: null, error: error.message };

    const sbUser = data.user;
    const metadata = sbUser.user_metadata || {};
    const role: 'admin' | 'parent' = isAdminEmail || metadata.role === 'admin' ? 'admin' : 'parent';

    const authUser: AuthUser = {
      id: sbUser.id,
      email: sbUser.email || normalizedEmail,
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
  role?: 'admin' | 'parent',
  kidName?: string
): Promise<{ user: AuthUser | null; error: string | null }> {
  const normalizedEmail = email.trim().toLowerCase();
  const isAdminEmail = normalizedEmail === 'admin@ewhaart.co.kr' || normalizedEmail === 'admin@ewha-art.com' || normalizedEmail.startsWith('admin@');
  const finalRole: 'admin' | 'parent' = role || (isAdminEmail ? 'admin' : 'parent');

  try {
    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password: password,
      options: {
        data: { name: name.trim(), role: finalRole, kidName: kidName || (finalRole === 'parent' ? `${name.trim()}의 자녀` : undefined) }
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
      email: sbUser.email || normalizedEmail,
      name: name.trim(),
      role: finalRole,
      kidName: kidName || (finalRole === 'parent' ? `${name.trim()}의 자녀` : undefined)
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
        const normalizedEmail = (user.email || '').trim().toLowerCase();
        const isAdminEmail = normalizedEmail === 'admin@ewhaart.co.kr' || normalizedEmail === 'admin@ewha-art.com' || normalizedEmail.startsWith('admin@');
        const role: 'admin' | 'parent' = isAdminEmail || metadata.role === 'admin' ? 'admin' : 'parent';
        const authUser: AuthUser = {
          id: user.id,
          email: normalizedEmail,
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

