// 일본 등록부 — 이번에는 도쿄만.
//
// 스페인과 여행의 모양이 다르다. 스페인은 도시 사이를 옮겨 다니지만 도쿄는
// 한 곳에 묵고 지역을 돈다(최대 4박 5일). 그래서 스페인의 '도시' 에 해당하는
// 단위가 여기서는 '도쿄 안의 지역' 이고, 하코네·가마쿠라 같은 근교 도시는
// 스페인의 근교와 같은 층이다. 자세한 것은 docs/24-japan-data-plan.md.
//
//   tier: 'city'     — 잘 수 있는 곳. 도쿄, 하코네, 가마쿠라 …
//   tier: 'district' — 도쿄 안의 지역. 절대 독립 숙박지가 되지 않고 within
//                      도시(도쿄)의 숙소를 공유한다.
//
// 이동 시간은 전부 **역에서 역까지** 다(환승 도보 포함, 양 끝 도보·대기 제외).
// 지도 앱에서 역 이름으로 검색하면 나오는 그 값이다. 양 끝의 도보·대기는
// 앱이 COUNTRY.transfer 로 얹는다 — 도시 간 37분, 도시 안 20분.

const T = (city, transitMin, mode, note) => ({ city, transitMin, mode, note });

/** 지역들이 함께 쓰는 교통 안내. 도쿄 안은 어디나 지하철·전철이다. */
const inTokyo = (extra = []) => ({
  passes: [],
  apps: [{ name: 'Google Maps', note: '노선·플랫폼·요금까지 정확합니다. 일본에서는 이것 하나면 됩니다.' }],
  tips: ['역 안이 넓고 출구가 많습니다. 목적지에 가까운 출구 번호를 지도에서 먼저 확인하세요.', ...extra],
});

export const COUNTRY = {
  slug: 'japan', name: '일본', nameEn: 'Japan',
  /**
   * 문앞~문앞 오버헤드(분). 등록부의 역~역 시간에 앱이 얹는다.
   *   city 37     — 신칸센·특급은 시간표가 정해져 있어 놓치면 큰일이라 역에 25분 여유를 둔다.
   *   district 20 — 출발지→역 도보 8 + 개찰·플랫폼·대기 6 + 도착역→목적지 6.
   *                 지하철은 3분마다 오니 여유를 둘 이유가 없다.
   * 검산: 아사쿠사→우에노 6+20=26분(걸어도 25분), 신주쿠→시부야 7+20=27분.
   * 오사카는 도쿄보다 작아 나중에 줄일 수 있어야 해서 여기 둔다.
   */
  transfer: { city: 37, district: 20 },
  /** 식사 시간. 스페인(점심 14시·저녁 21시)보다 두 시간 가까이 이르다. */
  meals: { lunch: '12:00', dinner: '19:00' },
  currency: 'JPY',
};

export const CITIES = [
  // ── 도쿄 — 잘 수 있는 곳 ────────────────────────────────────────────
  //
  // 볼 것은 전부 지역에 있고 여기는 숙소의 자리다. 좌표는 도쿄역. 1단계
  // 목록에는 카드로 나오지 않는다 — 지역을 고르면 따라온다.
  {
    slug: 'tokyo', name: '도쿄', nameEn: 'Tokyo', tier: 'city',
    region: '도쿄', lat: 35.6812, lon: 139.7671, isHub: true,
    blurb: '지역마다 얼굴이 다른 도시. 한 곳에 묵고 지하철로 돈다.',
    /*
     * 근교. 시간은 도쿄역 기준의 역~역이다. 신주쿠에서 타는 로망스카는
     * 도쿄역에서 신주쿠까지 14분을 더한 값이다.
     */
    dayTrips: [
      T('yokohama', 25, 'JR 도카이도선', '미나토미라이 야경과 차이나타운. 반나절이면 충분합니다.'),
      T('kamakura', 55, 'JR 요코스카선', '대불과 절, 에노덴 전차. 도쿄에서 가장 흔한 당일치기입니다.'),
      T('kawagoe', 45, '도부 도조선 급행', '에도 시대 창고 거리. 반나절 근교입니다.'),
      T('hakone', 80, '오다큐 로망스카', '온천과 후지산 전망. 료칸에서 하룻밤 자는 것이 보통입니다.'),
      T('nikko', 110, '도부 특급 스페이시아', '도쇼구와 폭포·호수. 하루가 꽉 찹니다.'),
      T('kawaguchiko', 115, 'JR 특급 후지회유 · 고속버스', '후지산을 가장 가까이 보는 호수. 온천 숙소가 많습니다.'),
      T('kusatsu', 170, 'JR 특급 구사쓰·시마 + 버스', '일본 최고 수질로 꼽는 온천 마을. 이동이 길어 하룻밤은 자야 합니다.'),
    ],
    transitGuide: {
      passes: [
        { name: 'Welcome Suica / Pasmo', price: '충전식', note: '지하철·JR·버스·편의점까지 한 장. 아이폰은 지갑 앱에 넣어 충전할 수 있습니다.' },
        { name: 'Tokyo Subway Ticket', price: '24시간 ¥800 · 48시간 ¥1,200 · 72시간 ¥1,500', note: '도쿄메트로·도에이 지하철 무제한. 하루 4번 이상 타면 이득이고 JR(야마노테선)은 안 됩니다.' },
      ],
      apps: [
        { name: 'Google Maps', note: '노선·플랫폼·요금·출구까지 정확합니다.' },
        { name: 'Suica 앱 (Apple Wallet)', note: '카드 없이 폰으로 개찰을 지납니다.' },
      ],
      tips: [
        'JR 전국패스는 도쿄 4박 5일에는 대개 손해입니다. 지하철권과 스이카면 됩니다.',
        '지하철 막차는 0시 전후입니다. 놓치면 택시가 비쌉니다(기본요금 ¥500, 심야 할증).',
        '출퇴근 시간(7:30~9:00)의 야마노테선·주오선은 피하세요. 큰 짐이 있으면 특히.',
        '현금이 아직 필요한 가게가 있습니다. 라멘집 자판기, 작은 신사 등.',
      ],
    },
  },

  // ── 도쿄 안의 지역 — 자는 곳이 아니라 낮에 가는 곳 ──────────────────
  //
  // Wikivoyage 는 도쿄를 구(區) 단위 문서로 나눠 두었다. 여행자가 실제로
  // 묶어 다니는 단위로 다시 묶었다 — 긴자와 쓰키지, 시부야와 하라주쿠처럼.
  // titles 가 둘이면 두 문서의 리스팅을 합친다. radiusKm 은 Wikidata 로
  // 채울 때의 반경이다. 도쿄 지역은 서로 2~3km 라 넓게 잡으면 옆 지역의
  // 명소를 끌어온다.
  {
    slug: 'marunouchi', name: '도쿄역·황거', nameEn: 'Marunouchi', tier: 'district', within: 'tokyo',
    titles: ['Tokyo/Chiyoda'], radiusKm: 1.5,
    region: '도쿄', lat: 35.6812, lon: 139.7671,
    blurb: '붉은 벽돌 도쿄역과 황거 동어원, 마루노우치의 고층 빌딩 거리.',
    transitGuide: inTokyo(['황거 동어원은 월·금요일에 닫습니다.']),
  },
  {
    slug: 'ginza', name: '긴자·쓰키지', nameEn: 'Ginza', tier: 'district', within: 'tokyo',
    titles: ['Tokyo/Ginza', 'Tokyo/Chuo'], radiusKm: 1.5,
    region: '도쿄', lat: 35.6717, lon: 139.7650,
    blurb: '백화점과 명품 거리, 그리고 아침 일찍 가는 쓰키지 장외시장.',
    transitGuide: inTokyo(['쓰키지 장외시장은 오전에 가야 합니다. 14시면 대부분 닫습니다.', '긴자 주오도리는 주말 오후 보행자 천국이 됩니다.']),
  },
  {
    slug: 'asakusa', name: '아사쿠사·스카이트리', nameEn: 'Asakusa', tier: 'district', within: 'tokyo',
    titles: ['Tokyo/Asakusa', 'Tokyo/Sumida'], radiusKm: 1.8,
    region: '도쿄', lat: 35.7118, lon: 139.7966,
    blurb: '센소지와 나카미세 거리, 강 건너 스카이트리. 도쿄에서 가장 옛 동네.',
    transitGuide: inTokyo(['센소지 본당은 6시부터 엽니다. 8시 전에 가면 나카미세가 비어 있습니다.', '스카이트리 전망대는 온라인 예매가 현장보다 쌉니다.']),
  },
  {
    slug: 'ueno', name: '우에노·야나카', nameEn: 'Ueno', tier: 'district', within: 'tokyo',
    titles: ['Tokyo/Ueno', 'Tokyo/Taito'], radiusKm: 1.5,
    region: '도쿄', lat: 35.7141, lon: 139.7774,
    blurb: '박물관이 모인 공원과 아메요코 시장, 옛 정취가 남은 야나카.',
    transitGuide: inTokyo(['국립박물관·서양미술관은 월요일에 쉽니다.', '아사쿠사까지 긴자선 두 정거장(6분)입니다. 같은 날에 묶기 좋습니다.']),
  },
  {
    slug: 'akihabara', name: '아키하바라', nameEn: 'Akihabara', tier: 'district', within: 'tokyo',
    titles: ['Tokyo/Akihabara'], radiusKm: 1.0,
    region: '도쿄', lat: 35.6984, lon: 139.7731,
    blurb: '전자상가와 애니메이션·게임의 거리. 간다 신사가 옆에 있습니다.',
    transitGuide: inTokyo(['가게는 대개 10~11시에 엽니다. 오전보다 오후에 맞습니다.']),
  },
  {
    slug: 'shinjuku', name: '신주쿠', nameEn: 'Shinjuku', tier: 'district', within: 'tokyo',
    titles: ['Tokyo/Shinjuku'], radiusKm: 1.5,
    region: '도쿄', lat: 35.6896, lon: 139.7006,
    blurb: '세계에서 가장 붐비는 역, 고층 빌딩 전망대, 골목 술집과 교엔 정원.',
    transitGuide: inTokyo(['신주쿠역은 출구가 200개가 넘습니다. 동쪽·서쪽·남쪽 출구를 먼저 정하세요.', '도쿄도청 전망대는 무료이고 밤 늦게까지 엽니다.']),
  },
  {
    slug: 'shibuya', name: '시부야·하라주쿠', nameEn: 'Shibuya', tier: 'district', within: 'tokyo',
    titles: ['Tokyo/Shibuya', 'Tokyo/Harajuku'], radiusKm: 1.5,
    region: '도쿄', lat: 35.6595, lon: 139.7005,
    blurb: '스크램블 교차로와 메이지 신궁, 다케시타 거리와 오모테산도.',
    transitGuide: inTokyo(['메이지 신궁은 해 뜰 때 열고 해 질 때 닫습니다. 계절마다 다릅니다.', '시부야 스카이 전망대는 해 지기 한 시간 전 시간대가 가장 먼저 매진됩니다.']),
  },
  {
    slug: 'roppongi', name: '롯폰기·도쿄타워', nameEn: 'Roppongi', tier: 'district', within: 'tokyo',
    titles: ['Tokyo/Roppongi', 'Tokyo/Minato'], radiusKm: 1.5,
    region: '도쿄', lat: 35.6627, lon: 139.7314,
    blurb: '미술관 셋과 야경, 도쿄타워와 조조지. 밤이 긴 동네.',
    transitGuide: inTokyo(['모리 미술관은 22시까지 엽니다. 저녁 일정으로 넣기 좋습니다.']),
  },
  {
    slug: 'odaiba', name: '오다이바', nameEn: 'Odaiba', tier: 'district', within: 'tokyo',
    titles: ['Tokyo/Odaiba'], radiusKm: 2.0,
    region: '도쿄', lat: 35.6300, lon: 139.7770,
    blurb: '바다 위 매립지. 팀랩과 건담, 레인보우 브리지 야경.',
    transitGuide: inTokyo(['유리카모메는 신바시에서 탑니다. 맨 앞 칸에 앉으면 다리를 건너는 경치가 좋습니다.', '팀랩은 날짜·시간 지정 예매가 필수입니다.']),
  },
  {
    slug: 'ikebukuro', name: '이케부쿠로', nameEn: 'Ikebukuro', tier: 'district', within: 'tokyo',
    titles: ['Tokyo/Toshima'], radiusKm: 1.2,
    region: '도쿄', lat: 35.7295, lon: 139.7109,
    blurb: '선샤인시티와 오토메로드, 서민적인 먹자골목.',
    transitGuide: inTokyo(['가와고에로 가는 도부 도조선이 여기서 출발합니다.']),
  },
  {
    slug: 'kichijoji', name: '기치조지·지브리', nameEn: 'Kichijoji', tier: 'district', within: 'tokyo',
    titles: ['Kichijoji'], radiusKm: 1.5,
    region: '도쿄', lat: 35.7032, lon: 139.5797,
    blurb: '이노카시라 공원과 지브리 미술관, 살고 싶은 동네 1위의 골목.',
    transitGuide: inTokyo(['지브리 미술관은 매달 10일에 다음 달 표를 팝니다. 현장 판매가 없습니다.']),
  },

  // ── 근교 도시 — 스페인의 근교와 같은 층 ─────────────────────────────
  //
  // 숙박이냐 당일치기냐는 엔진이 판단한다. 온천을 담으면 거기서 자고,
  // 아니면 도쿄에서 다녀온다.
  {
    slug: 'yokohama', name: '요코하마', nameEn: 'Yokohama', titles: ['Yokohama'],
    region: '가나가와', lat: 35.4437, lon: 139.6380, isHub: false, hub: 'tokyo',
    blurb: '항구 도시. 미나토미라이 야경과 일본 최대 차이나타운.',
    transitGuide: inTokyo(['미나토미라이선은 도쿄의 후쿠토신선과 직통입니다. 시부야에서 갈아타지 않고 갑니다.']),
  },
  {
    slug: 'kamakura', name: '가마쿠라·에노시마', nameEn: 'Kamakura', titles: ['Kamakura', 'Enoshima'],
    region: '가나가와', lat: 35.3192, lon: 139.5467, isHub: false, hub: 'tokyo',
    blurb: '대불과 절, 바다를 따라 달리는 에노덴 전차.',
    transitGuide: { passes: [{ name: '에노덴 1일권', price: '¥800', note: '가마쿠라~에노시마 전차 무제한. 세 번 이상 타면 이득입니다.' }], apps: [{ name: 'Google Maps', note: '' }], tips: ['절은 대개 16~17시에 닫습니다. 대불부터 오전에 보세요.', '에노덴은 주말 오후에 매우 붐빕니다.'] },
  },
  {
    slug: 'kawagoe', name: '가와고에', nameEn: 'Kawagoe', titles: ['Kawagoe'],
    region: '사이타마', lat: 35.9251, lon: 139.4858, isHub: false, hub: 'tokyo',
    blurb: '에도 시대 창고 거리가 남은 작은 에도. 반나절 근교.',
    transitGuide: inTokyo(['창고 거리 가게들은 17시면 닫습니다. 오후 늦게 가면 볼 것이 없습니다.']),
  },
  {
    slug: 'hakone', name: '하코네', nameEn: 'Hakone', titles: ['Hakone'], radiusKm: 7, // 오다와라(12km)를 끌어오지 않게
    region: '가나가와', lat: 35.2323, lon: 139.1069, isHub: false, hub: 'tokyo',
    blurb: '온천과 후지산 전망, 등산열차·케이블카·해적선으로 도는 산.',
    transitGuide: { passes: [{ name: '하코네 프리패스', price: '2일 ¥6,100 (신주쿠 출발)', note: '오다큐 왕복 + 등산열차·케이블카·로프웨이·해적선·버스 무제한. 하룻밤 자면 거의 언제나 이득입니다.' }], apps: [{ name: 'Google Maps', note: '로프웨이 운휴(화산가스·강풍)는 하코네 공식 사이트에서 확인하세요.' }], tips: ['료칸은 저녁 식사 시각(18~19시)에 맞춰 체크인해야 합니다. 늦으면 식사가 취소됩니다.', '로프웨이는 강풍이면 멈춥니다. 대체 버스가 있습니다.'] },
  },
  {
    slug: 'nikko', name: '닛코', nameEn: 'Nikko', titles: ['Nikko'],
    region: '도치기', lat: 36.7198, lon: 139.6982, isHub: false, hub: 'tokyo',
    blurb: '도쇼구의 화려한 조각과 주젠지 호수, 게곤 폭포.',
    transitGuide: { passes: [{ name: '닛코 패스 (도부)', price: '2일 ¥2,120~', note: '아사쿠사 왕복 + 닛코 지역 버스. 특급 요금은 별도입니다.' }], apps: [{ name: 'Google Maps', note: '' }], tips: ['도쇼구는 오전에 단체가 몰립니다. 아침 첫 버스로 가거나 오후 늦게 가세요.', '주젠지 호수까지는 급커브 산길 버스 40분입니다. 멀미약을 챙기세요.'] },
  },
  {
    slug: 'kawaguchiko', name: '가와구치코', nameEn: 'Kawaguchiko', titles: ['Fuji Five Lakes'],
    region: '야마나시', lat: 35.5171, lon: 138.7510, isHub: false, hub: 'tokyo',
    blurb: '후지산을 가장 가까이 보는 호수. 온천 숙소와 로프웨이.',
    transitGuide: { passes: [], apps: [{ name: 'Google Maps', note: '' }], tips: ['후지산은 아침에 가장 잘 보입니다. 오후에는 구름이 낍니다.', '신주쿠발 고속버스는 예매하지 않으면 주말에 자리가 없습니다.'] },
  },
  {
    slug: 'kusatsu', name: '구사쓰 온천', nameEn: 'Kusatsu', titles: ['Kusatsu'],
    region: '군마', lat: 36.6208, lon: 138.5964, isHub: false, hub: 'tokyo',
    blurb: '유바타케를 중심으로 마을 전체가 온천. 일본에서 손꼽는 수질.',
    transitGuide: { passes: [], apps: [{ name: 'Google Maps', note: '' }], tips: ['이동이 왕복 6시간이라 당일치기는 무리입니다. 하룻밤은 자세요.', '유모미 공연은 하루 몇 회뿐입니다. 시각을 먼저 확인하세요.'] },
  },
];

/**
 * 지역 사이의 역~역 시간. 근교 후보 목록(dayTrips)에는 안 올리지만 실측값이다.
 * 없는 쌍은 앱이 거리로 어림한다(도심 지하철 실효 20km/h).
 * 도쿄(tokyo)는 도쿄역 기준이다.
 */
const L = (a, b, minutes, mode = '지하철') => ({ a, b, minutes, mode });
export const LINKS = [
  L('tokyo', 'marunouchi', 0), L('tokyo', 'ginza', 3), L('tokyo', 'ueno', 7), L('tokyo', 'akihabara', 4),
  L('tokyo', 'asakusa', 18), L('tokyo', 'shinjuku', 14, 'JR 주오선 쾌속'), L('tokyo', 'shibuya', 24, 'JR 야마노테선'),
  L('tokyo', 'roppongi', 20), L('tokyo', 'odaiba', 30, '유리카모메'), L('tokyo', 'ikebukuro', 25), L('tokyo', 'kichijoji', 28, 'JR 주오선 쾌속'),
  L('marunouchi', 'ginza', 3), L('marunouchi', 'akihabara', 4), L('marunouchi', 'ueno', 7), L('marunouchi', 'asakusa', 18),
  L('marunouchi', 'shinjuku', 14, 'JR 주오선 쾌속'), L('marunouchi', 'roppongi', 20), L('marunouchi', 'shibuya', 24, 'JR 야마노테선'),
  L('asakusa', 'ueno', 6, '긴자선'), L('asakusa', 'akihabara', 12), L('asakusa', 'ginza', 17, '긴자선'),
  L('asakusa', 'shinjuku', 35), L('asakusa', 'shibuya', 32, '긴자선'), L('asakusa', 'roppongi', 30), L('asakusa', 'ikebukuro', 30),
  L('ueno', 'akihabara', 4, 'JR 야마노테선'), L('ueno', 'ginza', 11, '긴자선'), L('ueno', 'shinjuku', 25, 'JR 야마노테선'),
  L('ueno', 'ikebukuro', 16, 'JR 야마노테선'), L('ueno', 'shibuya', 30, '긴자선'), L('ueno', 'roppongi', 25), L('ueno', 'odaiba', 35),
  L('akihabara', 'ginza', 10, '히비야선'), L('akihabara', 'shinjuku', 18, 'JR 주오·소부선'), L('akihabara', 'roppongi', 18, '히비야선'),
  L('ginza', 'shinjuku', 16, '마루노우치선'), L('ginza', 'shibuya', 16, '긴자선'), L('ginza', 'roppongi', 9, '히비야선'),
  L('ginza', 'odaiba', 20, '유리카모메'), L('ginza', 'ikebukuro', 25, '마루노우치선'),
  L('shinjuku', 'shibuya', 7, 'JR 야마노테선'), L('shinjuku', 'roppongi', 9, '오에도선'), L('shinjuku', 'ikebukuro', 9, 'JR 야마노테선'),
  L('shinjuku', 'kichijoji', 15, 'JR 주오선 쾌속'), L('shinjuku', 'odaiba', 35),
  L('shibuya', 'roppongi', 15), L('shibuya', 'kichijoji', 17, '게이오 이노카시라선 급행'), L('shibuya', 'ikebukuro', 12, '후쿠토신선'),
  L('shibuya', 'odaiba', 30), L('roppongi', 'odaiba', 25), L('ikebukuro', 'kichijoji', 25),
];

/**
 * 식당이 모자란 도시에 넣는 '구역' 안내. 스페인의 오늘의 메뉴 대신 일본의 방식이다.
 * 존재하지 않는 가게를 지어내지 않고, 어디서 먹으면 되는지만 말한다.
 */
export const DINING = (city) => [
  {
    key: 'station',
    name: `${city.name} 역 주변 식당가`,
    summary: '역 건물과 지하 식당가에서 한 끼',
    desc: '일본은 역 건물(에키비루)과 백화점 지하에 식당이 모여 있습니다. 줄이 선 집이 대개 맞고, 자판기 식권집은 혼자 먹기 편합니다.',
    busy: '점심은 12시 정각에 줄이 가장 깁니다. 11시 반이나 13시 반이 편합니다',
    slots: ['lunch'],
  },
  {
    key: 'izakaya',
    name: `${city.name} 이자카야 골목`,
    summary: '저녁은 골목 이자카야에서 꼬치와 맥주',
    desc: '역 근처 골목의 이자카야는 메뉴에 사진이 있고 한 접시가 작아 여러 가지를 시켜 나눠 먹기 좋습니다. 자릿세(오토시) ¥300~500이 붙는 것이 보통입니다.',
    busy: '18~20시에 가장 붐빕니다. 예약 없이 가려면 17시 반 전후가 편합니다',
    slots: ['dinner'],
  },
  {
    key: 'ramen',
    name: `${city.name} 라멘·소바`,
    summary: '가볍게 한 그릇. 자판기에서 식권을 산다',
    desc: '라멘·소바·우동집은 자판기에서 식권을 사서 건넵니다. 혼자여도, 늦은 밤이어도 부담이 없습니다.',
    busy: '점심 피크는 짧습니다. 13시가 넘으면 대개 바로 앉습니다',
    slots: ['lunch', 'dinner'],
  },
];

export const ATTRIBUTION = [
  'Wikivoyage (CC BY-SA 4.0)',
  'Wikidata (CC0)',
  'OpenStreetMap contributors (ODbL)',
];
