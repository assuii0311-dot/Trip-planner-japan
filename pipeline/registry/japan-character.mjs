/**
 * 도쿄 지역·근교의 성격 프로필.
 *
 * 1단계에서 지역을 고르면 이 프로필로 취향을 역산한다. 수집된 아이템 수가
 * 아니라 사람이 판단한 값이다 — 신주쿠에 식당이 열일곱 개인 것은 문서가
 * 길어서지 신주쿠가 미식 동네라서가 아니다.
 *
 * profile: 테마별 0~3. 3 = 이 지역을 대표하는 성격, 0 = 사실상 없음.
 *          순서: 역사 · 예술 · 랜드마크 · 자연 · 미식 · 밤 · 액티비티 · 쇼핑 · 온천
 * nights:  [최소, 권장] 박수. 지역은 잘 수 없으니 [0, 0]. 근교는 0 이면 당일치기.
 * firstTimer: 도쿄가 처음인 사람에게 먼저 권할 만한 곳.
 */

export const MACRO_REGIONS = [
  { id: 'tokyo', name: '도쿄 시내 — 한 곳에 묵고 지하철로', regions: ['도쿄'] },
  { id: 'kanto', name: '도쿄 근교 — 당일치기와 온천', regions: ['가나가와', '사이타마', '도치기', '야마나시', '군마'] },
];

/** 일본에는 섬 단위 여행이 없다(이번에는). 비워 둔다. */
export const ISLANDS = [];
export const ISLAND_OF = {};

const p = (history, art, landmark, nature, food, nightlife, activity, shopping, onsen) =>
  ({ history, art, landmark, nature, food, nightlife, activity, shopping, onsen });

export const CHARACTER = {
  tokyo: {
    profile: p(2, 3, 3, 1, 3, 3, 2, 3, 0), nights: [3, 5], firstTimer: true,
    tagline: '지역마다 얼굴이 다른 도시. 한 곳에 묵고 지하철로 돈다',
    suitedFor: '짐을 한 번만 풀고 매일 다른 동네를 보고 싶은 분',
    highlights: ['센소지', '시부야 교차로', '신주쿠'],
    season: { best: '3월 말~4월 초(벚꽃) · 10~11월', note: '7~8월은 습하고 덥습니다. 벚꽃 철은 숙박비가 두 배 가까이 오릅니다.' },
    tags: ['대도시', '교통중심', '나이트라이프', '미식'],
  },

  // ── 도쿄 안의 지역 ────────────────────────────────────────────────
  marunouchi: {
    profile: p(2, 2, 3, 2, 2, 1, 0, 2, 0), nights: [0, 0], firstTimer: true,
    tagline: '붉은 벽돌 도쿄역과 황거의 정원',
    suitedFor: '도쿄의 중심이 어디인지 먼저 보고 싶은 분',
    highlights: ['도쿄역', '황거 동어원', '마루노우치 나카도리'],
    season: null,
    tags: ['도보많음'],
  },
  ginza: {
    profile: p(0, 1, 2, 0, 3, 2, 0, 3, 0), nights: [0, 0], firstTimer: true,
    tagline: '백화점 거리와 새벽의 쓰키지 장외시장',
    suitedFor: '쇼핑과 먹거리, 깔끔한 거리를 좋아하는 분',
    highlights: ['쓰키지 장외시장', '긴자 식스', '가부키자'],
    season: null,
    tags: ['미식', '쇼핑'],
  },
  asakusa: {
    profile: p(3, 1, 3, 1, 2, 1, 1, 2, 0), nights: [0, 0], firstTimer: true,
    tagline: '센소지와 나카미세, 강 건너 스카이트리',
    suitedFor: '도쿄에서 옛 일본을 먼저 보고 싶은 분',
    highlights: ['센소지', '나카미세 거리', '도쿄 스카이트리'],
    season: { best: '5월 산자 마쓰리 · 7월 말 불꽃놀이', note: '스미다강 불꽃놀이 날은 온 동네가 막힙니다.' },
    tags: ['역사', '도보많음'],
  },
  ueno: {
    profile: p(2, 3, 1, 2, 2, 1, 0, 2, 0), nights: [0, 0], firstTimer: true,
    tagline: '박물관이 모인 공원과 아메요코 시장',
    suitedFor: '박물관을 하루 종일 돌아도 좋은 분',
    highlights: ['도쿄국립박물관', '우에노 공원', '아메요코'],
    season: { best: '3월 말~4월 초', note: '우에노 공원은 도쿄에서 벚꽃 사람이 가장 많은 곳입니다.' },
    tags: ['박물관', '시장'],
  },
  akihabara: {
    profile: p(1, 0, 1, 0, 2, 1, 1, 3, 0), nights: [0, 0],
    tagline: '전자상가와 애니메이션의 거리',
    suitedFor: '게임·애니메이션·피규어에 관심이 있는 분',
    highlights: ['전자상가 거리', '간다 신사', '라디오 회관'],
    season: null,
    tags: ['쇼핑'],
  },
  shinjuku: {
    profile: p(0, 1, 3, 2, 3, 3, 1, 3, 0), nights: [0, 0], firstTimer: true,
    tagline: '고층 전망대와 골목 술집, 그리고 교엔의 정원',
    suitedFor: '밤이 늦어도 갈 곳이 있는 동네를 원하는 분',
    highlights: ['도쿄도청 전망대', '신주쿠 교엔', '오모이데요코초'],
    season: null,
    tags: ['나이트라이프', '대도시', '미식'],
  },
  shibuya: {
    profile: p(1, 1, 3, 2, 2, 3, 1, 3, 0), nights: [0, 0], firstTimer: true,
    tagline: '스크램블 교차로와 메이지 신궁의 숲',
    suitedFor: '지금의 도쿄, 젊은 거리를 보고 싶은 분',
    highlights: ['시부야 스크램블', '메이지 신궁', '다케시타 거리'],
    season: null,
    tags: ['나이트라이프', '쇼핑'],
  },
  roppongi: {
    profile: p(1, 3, 3, 1, 3, 3, 0, 2, 0), nights: [0, 0],
    tagline: '미술관 셋과 도쿄타워 야경',
    suitedFor: '현대미술과 야경, 늦은 저녁을 좋아하는 분',
    highlights: ['모리 미술관', '도쿄타워', '국립신미술관'],
    season: null,
    tags: ['나이트라이프', '예술'],
  },
  odaiba: {
    profile: p(0, 2, 3, 1, 1, 1, 3, 2, 1), nights: [0, 0],
    tagline: '바다 위 매립지의 팀랩과 건담',
    suitedFor: '아이와 함께이거나 체험형 볼거리를 원하는 분',
    highlights: ['팀랩 플래닛', '실물 크기 건담', '레인보우 브리지'],
    season: null,
    tags: ['가족'],
  },
  ikebukuro: {
    profile: p(0, 1, 1, 0, 2, 2, 2, 3, 0), nights: [0, 0],
    tagline: '선샤인시티와 서민적인 먹자골목',
    suitedFor: '관광지보다 사람 사는 동네를 좋아하는 분',
    highlights: ['선샤인 60 전망대', '선샤인 수족관', '오토메로드'],
    season: null,
    tags: ['쇼핑'],
  },
  kichijoji: {
    profile: p(0, 2, 0, 3, 2, 1, 1, 2, 0), nights: [0, 0],
    tagline: '이노카시라 공원과 지브리 미술관',
    suitedFor: '공원 산책과 작은 가게 골목을 좋아하는 분',
    highlights: ['지브리 미술관', '이노카시라 공원', '하모니카 요코초'],
    season: { best: '3월 말~4월 초', note: '이노카시라 연못의 벚꽃이 유명합니다.' },
    tags: ['공원'],
  },

  // ── 근교 ──────────────────────────────────────────────────────────
  yokohama: {
    profile: p(1, 1, 3, 1, 3, 2, 1, 2, 0), nights: [0, 1],
    tagline: '미나토미라이 야경과 차이나타운',
    suitedFor: '항구의 야경과 중화요리를 좋아하는 분',
    highlights: ['미나토미라이', '요코하마 차이나타운', '컵누들 뮤지엄'],
    season: null,
    tags: ['당일치기', '야경', '미식'],
  },
  kamakura: {
    profile: p(3, 1, 2, 3, 2, 0, 2, 1, 0), nights: [0, 1], firstTimer: true,
    tagline: '대불과 절, 바다를 따라 달리는 에노덴',
    suitedFor: '절과 바다를 하루에 보고 싶은 분',
    highlights: ['가마쿠라 대불', '하세데라', '에노시마'],
    season: { best: '6월(수국) · 11월 말(단풍)', note: '수국 철의 메이게쓰인은 입장에 한 시간을 기다립니다.' },
    tags: ['당일치기', '역사', '도보많음'],
  },
  kawagoe: {
    profile: p(3, 0, 2, 0, 2, 0, 0, 2, 0), nights: [0, 0],
    tagline: '에도 시대 창고 거리가 남은 작은 에도',
    suitedFor: '반나절 가볍게 옛 거리를 걷고 싶은 분',
    highlights: ['구라즈쿠리 거리', '시간의 종', '과자 골목'],
    season: null,
    tags: ['당일치기', '역사'],
  },
  hakone: {
    profile: p(1, 2, 2, 3, 2, 0, 2, 0, 3), nights: [1, 2], firstTimer: true,
    tagline: '온천과 후지산 전망, 산을 도는 탈것들',
    suitedFor: '료칸에서 하룻밤 자며 온천을 하고 싶은 분',
    highlights: ['하코네 조각의 숲', '오와쿠다니', '아시노코 해적선'],
    season: { best: '11월(단풍) · 5~6월', note: '겨울 맑은 날 후지산이 가장 잘 보입니다. 주말 로프웨이는 오래 기다립니다.' },
    tags: ['온천', '자연', '리조트'],
  },
  nikko: {
    profile: p(3, 1, 2, 3, 1, 0, 1, 0, 2), nights: [0, 1],
    tagline: '도쇼구의 조각과 주젠지 호수, 게곤 폭포',
    suitedFor: '화려한 신사 건축과 산의 풍경을 좋아하는 분',
    highlights: ['닛코 도쇼구', '게곤 폭포', '주젠지 호수'],
    season: { best: '10월 중순~11월 초(단풍)', note: '단풍 철 이로하자카 고개는 몇 시간씩 막힙니다.' },
    tags: ['역사', '자연', '온천'],
  },
  kawaguchiko: {
    profile: p(0, 1, 3, 3, 1, 0, 2, 0, 2), nights: [0, 1],
    tagline: '후지산을 가장 가까이 보는 호수',
    suitedFor: '후지산 사진 한 장을 위해 가는 분',
    highlights: ['가와구치코 로프웨이', '오이시 공원', '아라쿠라 센겐 신사'],
    season: { best: '4월(벚꽃+후지) · 11월(단풍)', note: '여름은 후지산이 구름에 가려 안 보이는 날이 많습니다.' },
    tags: ['자연', '온천', '사진'],
  },
  kusatsu: {
    profile: p(0, 0, 2, 2, 1, 0, 1, 1, 3), nights: [1, 2],
    tagline: '마을 전체가 온천인 유바타케의 마을',
    suitedFor: '온천 그 자체가 목적인 분',
    highlights: ['유바타케', '유모미 공연', '사이노카와라 노천탕'],
    season: { best: '연중 · 겨울 눈 속 온천', note: '왕복 6시간이라 당일치기는 무리입니다.' },
    tags: ['온천', '리조트'],
  },
};
