# 이화미술 카드뉴스 웹페이지 생성 안내

## 1. 개요
SNS(카카오톡, 인스타그램 등) 및 모바일/PC 웹에서 부드럽게 넘겨볼 수 있는 카드뉴스 전용 뷰어 페이지가 생성되었습니다.

---

## 2. 생성 및 구성 파일
- [261002.html](file:///c:/work/mydev/ewhahome/blog/cardNews/261002.html) : 기본 카드뉴스 HTML 파일
- [261022/index.html](file:///c:/work/mydev/ewhahome/blog/cardNews/261022/index.html) : `/cardNews/261022` 접속 대응
- [261002/index.html](file:///c:/work/mydev/ewhahome/blog/cardNews/261002/index.html) : `/cardNews/261002` 접속 대응
- [img](file:///c:/work/mydev/ewhahome/blog/cardNews/img) : 카드뉴스 이미지 7장
- `blog/public/cardNews/` : Next.js 정적 빌드 자동 연동을 위해 public 폴더에도 동기화 완료

---

## 3. 지원 접속 URL
- `https://www.ewhaart.co.kr/blog/cardNews/261022`
- `https://www.ewhaart.co.kr/blog/cardNews/261002`
- `https://www.ewhaart.co.kr/blog/cardNews/261002.html`

---

## 4. 주요 기능
1. **터치/마우스 스와이프 뷰어**: Swiper 라이브러리를 적용하여 모바일/PC에서 좌우 스와이프로 부드럽게 감상 가능
2. **페이지네이션/인디케이터**: 현재 장수 표시 (`1 / 7`) 및 불릿 인디케이터
3. **카카오톡/SNS 최적화 (Open Graph)**: 링크 전달 시 첫 번째 커버 이미지(`01_cover.png`)와 미리보기가 자동 표출
4. **공유하기/링크 복사**: 모바일 Web Share API 및 클립보드 복사 토스트 지원
5. **하단 바로가기**: 공식 홈페이지 및 블로그 링크 버튼 탑재
