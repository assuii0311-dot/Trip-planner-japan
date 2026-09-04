/**
 * 도쿄 — 손으로 넣는 항목과 빼는 항목.
 *
 * ## 왜 필요한가
 *
 * Wikivoyage 도쿄 문서는 구(區) 단위라 여행자가 실제로 찾는 '장소' 가 빠지거나
 * 흩어져 있다. 센소지는 가미나리몬·호조몬·관음당으로 쪼개져 있고, 오모이데
 * 요코초와 골든가이는 본문 산문에만 있으며, 지브리 미술관은 미타카 문서에
 * 있어 기치조지에 안 잡힌다. 하코네의 탈것(로프웨이·해적선·등산열차)은
 * 리스팅이 아니라 '가는 법' 절에 있다.
 *
 * ## 원칙
 *
 * 좌표와 Wikidata id 는 지어내지 않는다. `node pipeline/lookup-wd.mjs "이름"`
 * 으로 받아 넣었다. Wikidata 에 항목이 없는 몇 곳(오모이데요코초는 있다,
 * 하코네 유모토 온천가·고마치도리·오이시 공원·하모니카요코초)은 지도에서 직접
 * 확인한 좌표를 넣고 wikidata 를 null 로 두었다 — 그 표시가 곧 '사람이 확인한
 * 값' 이라는 뜻이다. 설명은 전부 사람이 쓴다.
 */

const P = (duration, price, extra = {}) => ({
  duration, price, booking: null, closed: null, busy: null, hours: null, ...extra,
});

export const EXTRAS = [
  // ── 아사쿠사·스카이트리 ────────────────────────────────────────────
  {
    id: 'asakusa-sensoji', wikidata: 'Q615183', lat: 35.71456, lon: 139.79664,
    name: '센소지', nameEn: 'Sensō-ji', nameLocal: '浅草寺', city: 'asakusa',
    theme: 'history', durationMin: 75, priceJpy: 0, energy: 2, popularity: 5,
    bestSlots: ['morning', 'afternoon', 'evening'], indoor: false, tags: ['unesco-없음', '무료', '대표'],
    summary: '도쿄에서 가장 오래된 절. 가미나리몬에서 본당까지 한 줄',
    why: '628년에 세워진 도쿄 최고(最古)의 절입니다. 큰 등롱이 걸린 가미나리몬, 250m 의 나카미세 상점가, 호조몬, 그리고 본당과 오층탑이 한 줄로 이어집니다. 도쿄 여행이 처음이면 대개 여기서 시작합니다.',
    practical: P('약 1시간 15분', '무료', { busy: '10~16시는 나카미세가 사람으로 꽉 찹니다. 8시 전이나 해 진 뒤 조명이 켜졌을 때가 한산하고 예쁩니다.', hours: '본당 6:00~17:00 (10~3월은 6:30부터). 경내는 24시간' }),
    caution: '오미쿠지(제비)에 흉(凶)이 많기로 유명합니다. 흉이 나오면 옆 철사에 묶고 갑니다.',
  },
  {
    id: 'asakusa-hanayashiki', wikidata: 'Q863180', lat: 35.71550, lon: 139.79469,
    name: '하나야시키', nameEn: 'Hanayashiki', nameLocal: '浅草花やしき', city: 'asakusa',
    theme: 'activity', durationMin: 90, priceJpy: 1200, energy: 3, popularity: 3,
    bestSlots: ['morning', 'afternoon'], indoor: false, tags: ['가족'],
    summary: '1853년에 문 연 일본에서 가장 오래된 유원지',
    why: '센소지 바로 뒤에 있는 작은 유원지입니다. 일본에서 가장 오래된 롤러코스터가 민가 지붕 사이를 스치듯 지나갑니다. 규모는 작아도 옛 도쿄의 정취가 있어 아이와 함께면 한 시간 반이 금방 갑니다.',
    practical: P('약 1시간 30분', '입장 ¥1,200 + 탈것별 요금', { closed: '화요일 휴무(계절에 따라 다름)' }),
    caution: null,
  },
  {
    id: 'asakusa-sumida-park', wikidata: 'Q6630114', lat: 35.71514, lon: 139.80286,
    name: '스미다 공원', nameEn: 'Sumida Park', nameLocal: '隅田公園', city: 'asakusa',
    theme: 'nature', durationMin: 40, priceJpy: 0, energy: 2, popularity: 3,
    bestSlots: ['morning', 'afternoon', 'evening'], indoor: false, tags: ['무료', '벚꽃', '야경'],
    summary: '강변에서 스카이트리와 아사히 빌딩을 한 장에',
    why: '아즈마바시 다리 옆 강변 공원입니다. 강 건너 스카이트리와 아사히 맥주 본사의 황금 조형물이 한 화면에 들어오는 자리라, 아사쿠사에서 가장 흔한 사진 배경입니다. 봄에는 벚꽃길이 되고 7월 말에는 불꽃놀이 자리입니다.',
    practical: P('약 40분', '무료'),
    caution: null,
  },

  // ── 우에노·야나카 ──────────────────────────────────────────────────
  {
    id: 'ueno-ueno-park', wikidata: 'Q746216', lat: 35.71222, lon: 139.77111,
    name: '우에노 공원', nameEn: 'Ueno Park', nameLocal: '上野恩賜公園', city: 'ueno',
    theme: 'nature', durationMin: 60, priceJpy: 0, energy: 2, popularity: 5,
    bestSlots: ['morning', 'afternoon', 'evening'], indoor: false, tags: ['무료', '벚꽃', '대표'],
    summary: '박물관 다섯 곳이 모인 도쿄의 대표 공원',
    why: '국립박물관·서양미술관·과학박물관·도쿄도미술관·동물원이 한 공원 안에 있습니다. 벚꽃 철에는 도쿄에서 사람이 가장 많은 곳이고, 그 밖의 계절에는 박물관 사이를 걷는 산책로가 됩니다. 시노바즈 연못의 연꽃은 7~8월입니다.',
    practical: P('약 1시간', '무료'),
    caution: null,
  },
  {
    id: 'nippori-yanaka-ginza', wikidata: null, lat: 35.72790, lon: 139.76560,
    name: '야나카 긴자', nameEn: 'Yanaka Ginza', nameLocal: '谷中銀座', city: 'nippori',
    theme: 'shopping', durationMin: 60, priceJpy: 0, energy: 2, popularity: 4,
    bestSlots: ['afternoon', 'evening'], indoor: false, tags: ['골목', '먹거리', 'street'],
    summary: '전쟁을 피해 살아남은 옛 동네의 상점가. 고양이의 동네',
    why: '닛포리역에서 내려오는 계단(유야케 단단) 아래로 170m 남짓 이어지는 상점가입니다. 크로켓·멘치카츠를 사 먹으며 걷는 곳이고, 골목마다 고양이 조형물이 있습니다. 우에노 공원에서 야나카 묘지를 지나 걸어와도 되고, 닛포리역에서 내려와도 됩니다.',
    practical: P('약 1시간', '무료', { busy: '주말 오후가 가장 붐빕니다. 가게는 대개 10~18시입니다.' }),
    caution: '좌표는 지도에서 직접 확인한 값입니다.',
  },
  {
    id: 'nippori-nezu-shrine', wikidata: 'Q335612', lat: 35.72023, lon: 139.76072,
    name: '네즈 신사', nameEn: 'Nezu Shrine', nameLocal: '根津神社', city: 'nippori',
    theme: 'history', durationMin: 45, priceJpy: 0, energy: 2, popularity: 3,
    bestSlots: ['morning', 'afternoon'], indoor: false, tags: ['무료', '철쭉'],
    summary: '붉은 도리이가 터널처럼 이어지는 1900년 된 신사',
    why: '도쿄에서 가장 오래된 신사 중 하나로, 1706년의 본전이 전쟁을 피해 그대로 남았습니다. 작은 도리이가 줄지어 선 언덕길이 교토 후시미이나리의 축소판 같습니다. 4월 중순~5월 초 철쭉 축제 때는 언덕 전체가 꽃입니다.',
    practical: P('약 45분', '무료'),
    caution: null,
  },
  {
    id: 'ueno-ueno-toshogu', wikidata: 'Q708550', lat: 35.71536, lon: 139.77058,
    name: '우에노 도쇼구', nameEn: 'Ueno Tōshō-gū', nameLocal: '上野東照宮', city: 'ueno',
    theme: 'history', durationMin: 40, priceJpy: 500, energy: 1, popularity: 3,
    bestSlots: ['morning', 'afternoon'], indoor: false, tags: [],
    summary: '닛코까지 안 가도 보는 금박 도쇼구',
    why: '1651년에 지은 도쿠가와 이에야스의 사당으로, 금박을 입힌 본전과 조각이 닛코 도쇼구의 축소판입니다. 우에노 공원 안에 있어 박물관 사이에 40분이면 봅니다. 참배길의 돌등롱 200기와 겨울 모란 정원도 있습니다.',
    practical: P('약 40분', '본전 ¥500 (경내 무료)'),
    caution: null,
  },
  {
    id: 'ueno-tokyo-metropolitan-art-museum', wikidata: 'Q864957', lat: 35.71720, lon: 139.77300,
    name: '도쿄도 미술관', nameEn: 'Tokyo Metropolitan Art Museum', nameLocal: '東京都美術館', city: 'ueno',
    theme: 'art', durationMin: 90, priceJpy: 0, energy: 1, popularity: 3,
    bestSlots: ['morning', 'afternoon'], indoor: true, tags: [],
    summary: '기획전으로 도는 미술관. 무엇을 하는지 먼저 보고',
    why: '상설전이 없고 기획전이 전부라, 지금 무엇을 하는지에 따라 갈지 말지가 정해집니다. 인상파·고흐 같은 큰 전시가 자주 열리고 그때는 몇 시간씩 줄이 섭니다. 입장은 무료이고 전시별로 요금이 다릅니다.',
    practical: P('약 1시간 30분', '입장 무료 · 기획전 별도', { closed: '첫째·셋째 월요일 휴관', booking: '큰 기획전은 날짜 지정 예매' }),
    caution: null,
  },

  // ── 신주쿠 ───────────────────────────────────────────────────────
  {
    id: 'shinjuku-omoide-yokocho', wikidata: 'Q11501868', lat: 35.69307, lon: 139.69950,
    name: '오모이데요코초', nameEn: 'Omoide Yokocho', nameLocal: '思い出横丁', city: 'shinjuku',
    theme: 'nightlife', durationMin: 75, priceJpy: 3000, energy: 1, popularity: 5,
    bestSlots: ['evening', 'night'], indoor: false, tags: ['이자카야', '꼬치', '대표', 'izakaya', 'street'],
    summary: '전후 암시장에서 시작한 꼬치 골목. 연기 속 두 평 가게들',
    why: '신주쿠 서쪽 출구 바로 옆, 폭 1m 골목에 꼬치구이집 60여 곳이 어깨를 맞대고 있습니다. 여섯 명 앉으면 꽉 차는 가게에서 연기를 마시며 맥주와 야키토리를 먹는 것이 신주쿠 저녁의 정석입니다. 사진 배경으로도 도쿄에서 손꼽힙니다.',
    practical: P('약 1시간 15분', '1인 ¥2,500~4,000', { busy: '19~21시에 자리가 없습니다. 17시 반 전후에 가면 앉습니다.' }),
    caution: '자릿세(오토시) ¥300~500 이 붙고, 카드가 안 되는 집이 많습니다. 사진은 가게 안쪽을 찍기 전에 물어보세요.',
  },
  {
    id: 'shinjuku-golden-gai', wikidata: 'Q5363705', lat: 35.69390, lon: 139.70500,
    name: '골든가이', nameEn: 'Golden Gai', nameLocal: '新宿ゴールデン街', city: 'shinjuku',
    theme: 'nightlife', durationMin: 90, priceJpy: 2000, energy: 1, popularity: 4,
    bestSlots: ['night'], indoor: true, tags: ['바', '대표', 'bar'],
    summary: '여섯 골목에 바 200곳. 한 집에 여섯 자리',
    why: '가부키초 옆 좁은 골목 여섯 개에 카운터 여섯 자리짜리 바가 200곳 넘게 모여 있습니다. 주인 취향대로 영화·재즈·문학 바가 갈리고, 손님끼리 말을 트게 되는 크기입니다. 21시 전에는 문 연 집이 적습니다.',
    practical: P('약 1시간 30분', '1인 ¥1,500~3,000 (한 잔 + 자릿세)', { busy: '22시 이후가 본편입니다.' }),
    caution: '단골 전용(一見さんお断り) 집이 있습니다. 문 앞에 영어 안내나 요금표가 있는 집에 들어가면 됩니다. 자릿세 ¥500~1,000.',
  },
  {
    id: 'shinjuku-kabukicho', wikidata: 'Q665216', lat: 35.69545, lon: 139.70256,
    name: '가부키초', nameEn: 'Kabukichō', nameLocal: '歌舞伎町', city: 'shinjuku',
    theme: 'landmark', durationMin: 45, priceJpy: 0, energy: 2, popularity: 5,
    bestSlots: ['evening', 'night'], indoor: false, tags: ['네온', '야경', '대표'],
    summary: '네온 간판이 벽을 이루는 일본 최대 환락가',
    why: '동쪽 출구에서 길을 건너면 네온 간판이 사방을 채우는 거리가 시작됩니다. 고질라 머리가 얹힌 호텔, 새로 생긴 가부키초 타워, 게임센터와 극장이 섞여 있고, 밤 사진의 배경으로는 도쿄에서 첫손입니다. 큰길만 걸으면 위험하지 않습니다.',
    practical: P('약 45분', '무료'),
    caution: '호객(캬치)을 따라 들어가면 안 됩니다. 말을 걸어오면 대답하지 않고 지나가세요. 골목 안쪽 술집은 요금 시비가 잦습니다.',
  },

  // ── 시부야·하라주쿠 ───────────────────────────────────────────────
  {
    id: 'shibuya-shibuya-sky', wikidata: 'Q64026922', lat: 35.65828, lon: 139.70161,
    name: '시부야 스카이', nameEn: 'Shibuya Sky', nameLocal: '渋谷スカイ', city: 'shibuya',
    theme: 'landmark', durationMin: 75, priceJpy: 2500, energy: 1, popularity: 5,
    bestSlots: ['afternoon', 'evening', 'night'], indoor: false, tags: ['전망대', '야경', '대표'],
    summary: '229m 옥상에서 스크램블 교차로를 내려다보는 전망대',
    why: '스크램블 스퀘어 옥상 전망대입니다. 난간 없이 트인 옥상에서 교차로가 발아래로 보이고, 맑은 날에는 후지산까지 보입니다. 해 지기 한 시간 전에 올라가 낮·노을·야경을 한 번에 보는 것이 정석이라 그 시간대가 가장 먼저 매진됩니다.',
    practical: P('약 1시간 15분', '¥2,500 (온라인) · 현장 ¥2,700', { booking: '날짜·시간 지정 온라인 예매. 노을 시간대는 2주 전에 끝납니다', busy: '해 지기 전후 한 시간' }),
    caution: '바람이 강하면 옥상이 닫히고 실내층만 엽니다. 삼각대와 큰 가방은 사물함에 넣어야 합니다.',
  },
  {
    id: 'shibuya-takeshita-street', wikidata: 'Q3179287', lat: 35.67125, lon: 139.70481,
    name: '다케시타 거리', nameEn: 'Takeshita Street', nameLocal: '竹下通り', city: 'shibuya',
    theme: 'shopping', durationMin: 45, priceJpy: 0, energy: 2, popularity: 5,
    bestSlots: ['morning', 'afternoon'], indoor: false, tags: ['크레이프', '10대', 'street', 'select'],
    summary: '하라주쿠역 앞 350m. 크레이프와 10대 패션의 거리',
    why: '하라주쿠역 다케시타 출구 바로 앞에서 시작하는 보행자 거리입니다. 크레이프 가게, 100엔 숍, 아이돌 굿즈, 원색 옷가게가 이어지고 주말 오후에는 걷기 힘들 만큼 붐빕니다. 메이지 신궁과 오모테산도 사이에 있어 셋을 묶어 반나절이 됩니다.',
    practical: P('약 45분', '무료', { busy: '주말 13~17시는 인파에 밀려 걷습니다. 오전 11시 전이 편합니다.' }),
    caution: null,
  },
  {
    id: 'shibuya-omotesando', wikidata: 'Q1205090', lat: 35.66513, lon: 139.71248,
    name: '오모테산도', nameEn: 'Omotesandō', nameLocal: '表参道', city: 'shibuya',
    theme: 'landmark', durationMin: 60, priceJpy: 0, energy: 2, popularity: 4,
    bestSlots: ['morning', 'afternoon', 'evening'], indoor: false, tags: ['건축', '느티나무길', 'select'],
    summary: '느티나무 가로수 아래 세계 건축가들의 매장이 늘어선 길',
    why: '메이지 신궁 참배길로 낸 1km 의 느티나무 길입니다. 안도 다다오의 오모테산도 힐즈, 프라다·디올·토즈 매장처럼 유명 건축가가 지은 건물이 줄지어 있어 쇼핑을 안 해도 걷는 값을 합니다. 뒷골목(캣스트리트)로 빠지면 편집숍과 카페입니다.',
    practical: P('약 1시간', '무료'),
    caution: null,
  },
  {
    id: 'shibuya-miyashita-park', wikidata: 'Q6884419', lat: 35.66120, lon: 139.70170,
    name: '미야시타 파크', nameEn: 'Miyashita Park', nameLocal: '宮下公園', city: 'shibuya',
    theme: 'shopping', durationMin: 60, priceJpy: 0, energy: 1, popularity: 3,
    bestSlots: ['afternoon', 'evening', 'night'], indoor: false, tags: ['옥상공원', '요코초', 'department', 'izakaya'],
    summary: '쇼핑몰 옥상이 공원. 아래층은 시부야 요코초',
    why: '2020년 새로 지은 복합 시설로 옥상 전체가 잔디 공원입니다. 1층의 시부야 요코초는 일본 각 지방 요리를 파는 이자카야 골목을 실내에 재현해 늦은 밤까지 엽니다. 시부야역에서 하라주쿠 쪽으로 걸어가는 길목에 있습니다.',
    practical: P('약 1시간', '무료'),
    caution: null,
  },

  // ── 롯폰기·도쿄타워 ───────────────────────────────────────────────
  {
    id: 'roppongi-tokyo-midtown', wikidata: 'Q1364393', lat: 35.66583, lon: 139.73111,
    name: '도쿄 미드타운', nameEn: 'Tokyo Midtown', nameLocal: '東京ミッドタウン', city: 'roppongi',
    theme: 'shopping', durationMin: 60, priceJpy: 0, energy: 1, popularity: 3,
    bestSlots: ['afternoon', 'evening'], indoor: true, tags: ['복합시설', '정원', 'department'],
    summary: '산토리 미술관과 21_21, 뒤편 정원까지 한 단지',
    why: '롯폰기 힐즈와 마주 보는 복합 단지입니다. 산토리 미술관, 안도 다다오의 21_21 디자인 사이트, 뒤편의 잔디 정원이 붙어 있어 미술관 셋을 도는 롯폰기 일정의 중간 지점이 됩니다. 겨울 일루미네이션이 도쿄에서 손꼽힙니다.',
    practical: P('약 1시간', '무료 (미술관 별도)'),
    caution: null,
  },
  {
    id: 'roppongi-21-21-design-sight', wikidata: 'Q863044', lat: 35.66750, lon: 139.73027,
    name: '21_21 디자인 사이트', nameEn: '21_21 Design Sight', nameLocal: '21_21 DESIGN SIGHT', city: 'roppongi',
    theme: 'art', durationMin: 60, priceJpy: 1400, energy: 1, popularity: 3,
    bestSlots: ['morning', 'afternoon'], indoor: true, tags: ['디자인', '안도다다오'],
    summary: '이세이 미야케와 안도 다다오가 만든 디자인 전시관',
    why: '철판 한 장을 접은 듯한 안도 다다오의 건물 안에서 디자인 기획전을 엽니다. 전시가 작고 밀도가 높아 한 시간이면 충분하고, 미드타운 정원에 붙어 있어 오가는 길에 들르기 좋습니다.',
    practical: P('약 1시간', '¥1,400', { closed: '화요일 휴관' }),
    caution: null,
  },
  {
    id: 'roppongi-azabudai-hills', wikidata: 'Q97189958', lat: 35.66088, lon: 139.74066,
    name: '아자부다이 힐즈', nameEn: 'Azabudai Hills', nameLocal: '麻布台ヒルズ', city: 'roppongi',
    theme: 'landmark', durationMin: 60, priceJpy: 0, energy: 1, popularity: 4,
    bestSlots: ['afternoon', 'evening'], indoor: true, tags: ['신축', '팀랩'],
    summary: '2023년 문 연 일본 최고층 빌딩 단지. 팀랩 보더리스가 여기',
    why: '도쿄타워 바로 옆에 2023년 말 문을 연 단지로, 일본에서 가장 높은 빌딩(330m)과 헤더윅의 곡선 건물들이 있습니다. 오다이바에서 옮겨 온 팀랩 보더리스가 지하에 있고, 도쿄타워를 가까이서 올려다보는 자리이기도 합니다.',
    practical: P('약 1시간', '무료 (팀랩 별도)'),
    caution: null,
  },
  {
    id: 'roppongi-teamlab-borderless', wikidata: null, lat: 35.66040, lon: 139.74180,
    name: '팀랩 보더리스', nameEn: 'teamLab Borderless', nameLocal: 'チームラボボーダレス', city: 'roppongi',
    theme: 'art', durationMin: 150, priceJpy: 3800, energy: 2, popularity: 5,
    bestSlots: ['morning', 'afternoon', 'evening'], indoor: true, tags: ['디지털아트', '대표'],
    practical: P('약 2시간 30분', '¥3,800~4,800 (날짜별)', { booking: '날짜·시간 지정 예매 필수. 주말은 2~3주 전에 끝납니다', busy: '오전 첫 회가 가장 한산합니다' }),
    summary: '경계 없이 방을 넘나드는 빛의 작품. 아자부다이 힐즈 지하',
    why: '오다이바에 있던 팀랩 보더리스가 2024년 아자부다이 힐즈로 옮겨 다시 열었습니다. 작품이 방 경계를 넘어 흘러 다니고 지도가 없어 헤매는 것이 설계입니다. 도요스의 팀랩 플래닛(물속을 걷는 쪽)과는 다른 곳이니 하나만 고른다면 취향으로 정하세요.',
    caution: '좌표는 아자부다이 힐즈 가든플라자 B 기준으로 직접 확인한 값입니다. 흰 옷이나 치마는 바닥 거울에 비칩니다.',
  },
  {
    id: 'roppongi-shiba-park', wikidata: 'Q42311591', lat: 35.65611, lon: 139.74833,
    name: '시바 공원', nameEn: 'Shiba Park', nameLocal: '芝公園', city: 'roppongi',
    theme: 'nature', durationMin: 40, priceJpy: 0, energy: 2, popularity: 3,
    bestSlots: ['morning', 'afternoon', 'evening'], indoor: false, tags: ['무료', '도쿄타워뷰'],
    summary: '조조지 옆 잔디밭. 도쿄타워를 가장 크게 담는 자리',
    why: '조조지와 도쿄타워 사이의 공원입니다. 잔디밭에 앉으면 절 지붕 위로 타워가 통째로 보여, 도쿄타워 사진은 전망대보다 여기서 더 잘 나옵니다. 밤에 조명이 켜진 뒤가 특히 좋습니다.',
    practical: P('약 40분', '무료'),
    caution: null,
  },

  // ── 긴자·쓰키지 / 도쿄역·황거 ───────────────────────────────────────
  {
    id: 'ginza-ginza-six', wikidata: 'Q28685888', lat: 35.66957, lon: 139.76408,
    name: '긴자 식스', nameEn: 'Ginza Six', nameLocal: 'GINZA SIX', city: 'ginza',
    theme: 'shopping', durationMin: 60, priceJpy: 0, energy: 1, popularity: 4,
    bestSlots: ['morning', 'afternoon', 'evening'], indoor: true, tags: ['백화점', '옥상정원', '쓰타야', 'department'],
    summary: '긴자 최대 백화점. 쓰타야 서점과 옥상 정원은 안 사도 좋다',
    why: '2017년 문 연 긴자에서 가장 큰 상업 시설입니다. 6층 쓰타야 서점의 미술 서가와 옥상 정원은 무료이고, 지하 식품관은 선물 사기에 도쿄에서 가장 편한 곳 중 하나입니다. 중앙 홀에 걸리는 설치 작품이 계절마다 바뀝니다.',
    practical: P('약 1시간', '무료'),
    caution: null,
  },
  {
    id: 'marunouchi-tokyo-station', wikidata: 'Q283196', lat: 35.68083, lon: 139.76694,
    name: '도쿄역', nameEn: 'Tokyo Station', nameLocal: '東京駅', city: 'marunouchi',
    theme: 'landmark', durationMin: 45, priceJpy: 0, energy: 1, popularity: 5,
    bestSlots: ['morning', 'afternoon', 'evening', 'night'], indoor: false, tags: ['건축', '야경', '대표'],
    summary: '1914년의 붉은 벽돌 역사. 밤 조명과 지하 라멘 거리',
    why: '1914년에 지어 2012년 복원한 붉은 벽돌 역사입니다. 마루노우치 쪽 광장에서 보는 정면이 가장 좋고, 맞은편 KITTE 옥상 정원에서는 역 전체가 내려다보입니다. 역 지하의 라멘 거리와 도쿄 캐릭터 스트리트는 비 오는 날의 대안입니다.',
    practical: P('약 45분', '무료'),
    caution: '역 안이 넓어 마루노우치 출구와 야에스 출구를 헷갈리면 10분을 잃습니다. 붉은 벽돌은 마루노우치 쪽입니다.',
  },
  {
    id: 'marunouchi-hibiya-park', wikidata: 'Q1378533', lat: 35.67148, lon: 139.75539,
    name: '히비야 공원', nameEn: 'Hibiya Park', nameLocal: '日比谷公園', city: 'marunouchi',
    theme: 'nature', durationMin: 40, priceJpy: 0, energy: 2, popularity: 3,
    bestSlots: ['morning', 'afternoon'], indoor: false, tags: ['무료'],
    summary: '1903년 일본 최초의 서양식 공원. 황거와 긴자 사이 쉼표',
    why: '황거 남쪽, 긴자로 걸어가는 길에 있는 서양식 공원입니다. 분수와 장미원, 오래된 은행나무가 있고 옆의 히비야 미드타운 옥상에서 공원과 황거 숲이 내려다보입니다. 황거 동어원에서 긴자까지 걷는 일정의 중간 쉼터입니다.',
    practical: P('약 40분', '무료'),
    caution: null,
  },
  {
    id: 'marunouchi-jimbocho', wikidata: null, lat: 35.69580, lon: 139.75700,
    name: '진보초 고서점 거리', nameEn: 'Jimbōchō Book Town', nameLocal: '神保町古書店街', city: 'marunouchi',
    theme: 'shopping', durationMin: 60, priceJpy: 0, energy: 2, popularity: 3,
    bestSlots: ['afternoon'], indoor: false, tags: ['책', '카레', 'select', 'craft'],
    summary: '고서점 130곳이 한 길에. 카레집도 유명하다',
    why: '세계에서 가장 큰 고서점 거리로, 야스쿠니도리를 따라 헌책방 130여 곳이 이어집니다. 우키요에·옛 지도·영화 포스터 전문점이 있어 책을 안 사도 구경이 됩니다. 이 동네는 카레집이 많기로도 유명해 점심을 여기서 먹기 좋습니다.',
    practical: P('약 1시간', '무료', { closed: '일요일에 닫는 서점이 많습니다.' }),
    caution: '좌표는 진보초역 교차로 기준으로 직접 확인한 값입니다.',
  },

  // ── 아키하바라 ─────────────────────────────────────────────────────
  {
    id: 'akihabara-kanda-myojin', wikidata: 'Q717682', lat: 35.70194, lon: 139.76778,
    name: '간다 묘진', nameEn: 'Kanda Myōjin', nameLocal: '神田明神', city: 'akihabara',
    theme: 'history', durationMin: 40, priceJpy: 0, energy: 2, popularity: 4,
    bestSlots: ['morning', 'afternoon'], indoor: false, tags: ['무료', 'IT부적'],
    summary: '1300년 된 신사. 아키하바라답게 IT 부적을 판다',
    why: '730년에 세워진 도쿄의 대표 신사로 에도의 총진수(수호신)였습니다. 아키하바라 언덕 위에 있어 전자상가와 붙어 있고, 그래서 컴퓨터·스마트폰 보호 부적을 파는 것으로 유명합니다. 5월 홀수 해의 간다 마쓰리는 도쿄 3대 축제입니다.',
    practical: P('약 40분', '무료'),
    caution: null,
  },
  {
    id: 'akihabara-electric-town', wikidata: null, lat: 35.69880, lon: 139.77170,
    name: '아키하바라 전자상가 거리', nameEn: 'Akihabara Electric Town', nameLocal: '秋葉原電気街', city: 'akihabara',
    theme: 'landmark', durationMin: 60, priceJpy: 0, energy: 2, popularity: 5,
    bestSlots: ['afternoon', 'evening'], indoor: false, tags: ['네온', '대표'],
    summary: '주오도리를 따라 간판이 벽을 이루는 전자·애니메이션 거리',
    why: '역 전기가 출구에서 주오도리로 나가면 애니메이션 간판이 건물을 덮은 거리가 시작됩니다. 라디오회관·요도바시·아니메이트·만다라케를 순서 없이 돌게 되고, 일요일 낮에는 큰길이 보행자 천국이 됩니다. 저녁에 네온이 켜진 뒤가 사진에 좋습니다.',
    practical: P('약 1시간', '무료', { busy: '가게는 대개 10~11시에 엽니다.' }),
    caution: '좌표는 전기가 출구 앞 교차로 기준으로 직접 확인한 값입니다.',
  },
  {
    id: 'akihabara-radio-kaikan', wikidata: 'Q5363328', lat: 35.69778, lon: 139.77167,
    name: '아키하바라 라디오회관', nameEn: 'Akihabara Radio Kaikan', nameLocal: '秋葉原ラジオ会館', city: 'akihabara',
    theme: 'shopping', durationMin: 60, priceJpy: 0, energy: 1, popularity: 4,
    bestSlots: ['afternoon', 'evening'], indoor: true, tags: ['피규어', '트레이딩카드', 'otaku'],
    summary: '10층 전부 피규어·카드·프라모델. 아키하바라의 상징 건물',
    why: '역 앞의 10층 건물 전체가 피규어, 트레이딩 카드, 프라모델, 동인지 가게입니다. 2014년 새로 지어 깨끗하고 층마다 분야가 갈려 있어 처음 온 사람이 아키하바라를 한 건물로 훑기에 가장 낫습니다.',
    practical: P('약 1시간', '무료'),
    caution: null,
  },

  // ── 오다이바 ─────────────────────────────────────────────────────
  {
    id: 'odaiba-teamlab-planets', wikidata: 'Q97613610', lat: 35.64920, lon: 139.78970,
    name: '팀랩 플래닛', nameEn: 'teamLab Planets', nameLocal: 'チームラボプラネッツ', city: 'odaiba',
    theme: 'art', durationMin: 120, priceJpy: 3800, energy: 2, popularity: 5,
    bestSlots: ['morning', 'afternoon', 'evening'], indoor: true, tags: ['디지털아트', '맨발', '대표'],
    summary: '맨발로 물속을 걷는 디지털 아트. 도요스, 오다이바 옆',
    why: '신발을 벗고 무릎까지 오는 물속을 걸으며 빛의 잉어가 발에 부딪히는 작품으로 유명합니다. 오다이바 옆 도요스에 있고 유리카모메 신토요스역에서 1분입니다. 아자부다이의 보더리스보다 동선이 정해져 있어 두 시간이면 다 봅니다.',
    practical: P('약 2시간', '¥3,800~4,600 (날짜별)', { booking: '날짜·시간 지정 예매 필수', busy: '오전 첫 회와 평일이 한산합니다' }),
    caution: '무릎까지 젖으니 걷어 올릴 수 있는 바지를 입으세요. 반바지는 빌려줍니다.',
  },
  {
    id: 'odaiba-toyosu-market', wikidata: 'Q11633916', lat: 35.64417, lon: 139.78361,
    name: '도요스 시장', nameEn: 'Toyosu Market', nameLocal: '豊洲市場', city: 'odaiba',
    theme: 'food', durationMin: 90, priceJpy: 3000, energy: 2, popularity: 4,
    bestSlots: ['morning', 'lunch'], indoor: true, tags: ['스시', '참치경매', '아침', 'sushi', 'seafood', 'street'],
    summary: '쓰키지에서 옮겨 온 도매시장. 새벽 참치 경매와 아침 스시',
    why: '2018년 쓰키지의 도매 기능이 옮겨 온 곳입니다. 참치 경매는 유리 너머 견학 통로에서 5시 반부터 보고(추첨 신청), 시장 안 스시집은 아침 6시부터 줄이 섭니다. 2024년 문 연 센카쿠반라이(千客万来)에는 노천탕과 먹거리 거리가 생겼습니다.',
    practical: P('약 1시간 30분', '스시 ¥3,000~5,000', { closed: '일요일·수요일 대부분 휴장. 시장 달력을 확인하세요', busy: '스시집은 7~9시가 가장 깁니다', booking: '경매 견학 데크는 사전 추첨' }),
    caution: '점심 무렵이면 스시집이 재료를 마감합니다. 오전에 가는 곳입니다.',
  },
  {
    id: 'odaiba-rainbow-bridge', wikidata: null, lat: 35.63650, lon: 139.76330,
    name: '레인보우 브리지', nameEn: 'Rainbow Bridge', nameLocal: 'レインボーブリッジ', city: 'odaiba',
    theme: 'landmark', durationMin: 45, priceJpy: 0, energy: 2, popularity: 4,
    bestSlots: ['afternoon', 'evening', 'night'], indoor: false, tags: ['야경', '무료'],
    summary: '오다이바로 건너가는 798m 현수교. 걸어서도 건넌다',
    why: '1993년 완공된 도쿄만의 현수교로 오다이바의 관문입니다. 유리카모메 맨 앞 칸에서 건너는 경치가 좋고, 양쪽 보도로 걸어서도 건널 수 있어(약 30분) 오다이바 해변에서 보는 야경과 세트가 됩니다. 밤에는 계절색 조명이 켜집니다.',
    practical: P('약 45분', '무료', { hours: '보도는 10:00~21:00 (11~3월은 18:00까지)' }),
    caution: '좌표는 다리 중앙 기준으로 직접 확인한 값입니다. 보도는 셋째 월요일에 닫습니다.',
  },

  // ── 이케부쿠로 ─────────────────────────────────────────────────────
  {
    id: 'ikebukuro-sunshine-aquarium', wikidata: 'Q11250698', lat: 35.72858, lon: 139.71975,
    name: '선샤인 수족관', nameEn: 'Sunshine Aquarium', nameLocal: 'サンシャイン水族館', city: 'ikebukuro',
    theme: 'activity', durationMin: 90, priceJpy: 2800, energy: 1, popularity: 4,
    bestSlots: ['morning', 'afternoon'], indoor: true, tags: ['가족', '옥상'],
    summary: '빌딩 옥상의 수족관. 머리 위로 펭귄이 난다',
    why: '선샤인시티 옥상에 있는 수족관으로, 하늘을 배경으로 펭귄이 헤엄치는 수조 "하늘의 펭귄" 이 대표작입니다. 규모는 작지만 전시가 잘 짜여 있고 실내라 비 오는 날의 대안이 됩니다. 옆에 전망대와 플라네타리움이 붙어 있습니다.',
    practical: P('약 1시간 30분', '¥2,600~2,800', { booking: '주말은 날짜 지정 예매' }),
    caution: null,
  },
  {
    id: 'ikebukuro-otome-road', wikidata: 'Q7108976', lat: 35.73061, lon: 139.71822,
    name: '오토메로드', nameEn: 'Otome Road', nameLocal: '乙女ロード', city: 'ikebukuro',
    theme: 'shopping', durationMin: 60, priceJpy: 0, energy: 1, popularity: 3,
    bestSlots: ['afternoon', 'evening'], indoor: false, tags: ['애니메이션', '여성향', 'otaku'],
    summary: '여성 팬 취향의 애니메이션 굿즈 거리. 아키하바라의 반대편',
    why: '선샤인시티 옆 200m 남짓한 길에 아니메이트 본점, K-BOOKS, 집사 카페가 모여 있습니다. 아키하바라가 남성 취향이라면 여기는 여성향 작품과 굿즈가 중심이라 분위기가 다릅니다.',
    practical: P('약 1시간', '무료'),
    caution: null,
  },

  // ── 기치조지·지브리 ───────────────────────────────────────────────
  {
    id: 'kichijoji-ghibli-museum', wikidata: 'Q947907', lat: 35.69623, lon: 139.57043,
    name: '지브리 미술관', nameEn: 'Ghibli Museum', nameLocal: '三鷹の森ジブリ美術館', city: 'kichijoji',
    theme: 'art', durationMin: 120, priceJpy: 1000, energy: 1, popularity: 5,
    bestSlots: ['morning', 'afternoon'], indoor: true, tags: ['지브리', '가족', '대표'],
    summary: '미야자키 하야오가 설계한 미술관. 표는 매달 10일에 다음 달 것을',
    why: '이노카시라 공원 끝에 있는 지브리 스튜디오의 미술관입니다. 애니메이션 원리를 보여 주는 전시, 여기서만 트는 단편 영화, 옥상의 라퓨타 로봇 병사가 있습니다. 미야자키가 직접 설계해 건물 자체가 작품입니다. 현장 판매가 없어 표를 먼저 구해야 갑니다.',
    practical: P('약 2시간', '¥1,000', { booking: '매달 10일 10시(일본 시각)에 다음 달 표를 로손 티켓에서 팝니다. 주말은 몇 분 안에 끝납니다', closed: '화요일 휴관' }),
    caution: '내부 사진 촬영이 금지입니다. 표에 적힌 입장 시각을 30분 넘기면 못 들어갑니다.',
  },
  {
    id: 'kichijoji-inokashira-park', wikidata: 'Q1200884', lat: 35.69829, lon: 139.57147,
    name: '이노카시라 공원', nameEn: 'Inokashira Park', nameLocal: '井の頭恩賜公園', city: 'kichijoji',
    theme: 'nature', durationMin: 60, priceJpy: 0, energy: 2, popularity: 4,
    bestSlots: ['morning', 'afternoon', 'evening'], indoor: false, tags: ['무료', '벚꽃', '보트'],
    summary: '연못을 둘러싼 공원. 백조 보트와 벚꽃, 지브리로 가는 길',
    why: '기치조지역에서 5분, 연못을 가운데 둔 공원입니다. 백조 보트를 타고, 주말에는 거리 공연과 벼룩시장이 섭니다. 연못 끝까지 걸으면 지브리 미술관이 나와 둘을 묶는 것이 기치조지 일정의 기본입니다. 봄 벚꽃이 연못에 비치는 풍경으로 유명합니다.',
    practical: P('약 1시간', '무료 (보트 30분 ¥700~)'),
    caution: '연인이 보트를 타면 헤어진다는 도시 전설이 있습니다. 믿거나 말거나.',
  },
  {
    id: 'kichijoji-harmonica-yokocho', wikidata: null, lat: 35.70400, lon: 139.57990,
    name: '하모니카 요코초', nameEn: 'Harmonica Yokocho', nameLocal: 'ハモニカ横丁', city: 'kichijoji',
    theme: 'nightlife', durationMin: 75, priceJpy: 2500, energy: 1, popularity: 4,
    bestSlots: ['evening', 'night'], indoor: false, tags: ['이자카야', '골목', 'izakaya', 'street'],
    summary: '역 앞 100채 골목. 낮에는 시장, 밤에는 선술집',
    why: '기치조지역 북쪽 출구 앞, 하모니카 구멍처럼 가게가 촘촘히 박힌 골목입니다. 낮에는 반찬 가게와 생선 가게, 저녁부터는 서서 마시는 술집과 이자카야로 바뀝니다. 오모이데요코초보다 관광객이 적어 동네 술집 분위기가 남아 있습니다.',
    practical: P('약 1시간 15분', '1인 ¥2,000~3,500', { busy: '18~21시' }),
    caution: '좌표는 골목 입구 기준으로 직접 확인한 값입니다.',
  },

  // ── 재방문 동네 — 시모키타자와 / 나카메구로·다이칸야마 ─────────────
  {
    id: 'shimokitazawa-vintage-streets', wikidata: null, lat: 35.66090, lon: 139.66760,
    name: '시모키타자와 빈티지 골목', nameEn: 'Shimokitazawa vintage streets', nameLocal: '下北沢 古着屋街', city: 'shimokitazawa',
    theme: 'shopping', durationMin: 90, priceJpy: 0, energy: 2, popularity: 4,
    bestSlots: ['afternoon', 'evening'], indoor: false, tags: ['select', 'street', '재방문'],
    summary: '역 남쪽 골목마다 빈티지 옷가게. 도쿄 중고 패션의 중심',
    why: '시모키타자와역 남쪽 출구 일대의 골목에 빈티지·중고 옷가게 100여 곳이 모여 있습니다. 미국 구제부터 일본 브랜드 아카이브까지 폭이 넓고 값이 하라주쿠보다 낮습니다. 사이사이 카레집과 커피집이 있어 쇼핑과 골목 산책이 하나가 됩니다.',
    practical: P('약 1시간 30분', '무료', { busy: '주말 오후. 가게는 대개 12시에 엽니다', hours: '12:00~20:00 안팎' }),
    caution: '좌표는 남쪽 출구 상점가 기준으로 직접 확인한 값입니다.',
  },
  {
    id: 'shimokitazawa-reload', wikidata: null, lat: 35.66330, lon: 139.67060,
    name: '리로드 (reload)', nameEn: 'reload Shimokitazawa', nameLocal: 'reload 下北沢', city: 'shimokitazawa',
    theme: 'shopping', durationMin: 45, priceJpy: 0, energy: 1, popularity: 3,
    bestSlots: ['morning', 'afternoon', 'evening'], indoor: false, tags: ['select', 'cafe', '재방문'],
    summary: '철길 자리에 낮게 지은 하얀 상점 단지. 커피·문구·편집숍',
    why: '2021년 오다큐선 지하화로 생긴 철길 자리에 지은 2층짜리 하얀 상점 단지입니다. 오가와 커피, 문구점, 작은 편집숍 20여 곳이 골목처럼 이어지고, 시모키타자와의 새 얼굴로 꼽힙니다. 역에서 히가시키타자와 쪽으로 걸어 3분입니다.',
    practical: P('약 45분', '무료'),
    caution: '좌표는 지도에서 직접 확인한 값입니다.',
  },
  {
    id: 'nakameguro-meguro-river', wikidata: null, lat: 35.64400, lon: 139.69750,
    name: '메구로강 벚꽃길', nameEn: 'Meguro River (Nakameguro)', nameLocal: '目黒川 桜並木', city: 'nakameguro',
    theme: 'nature', durationMin: 60, priceJpy: 0, energy: 2, popularity: 5,
    bestSlots: ['morning', 'afternoon', 'evening'], indoor: false, tags: ['벚꽃', '무료', '재방문'],
    summary: '강 양쪽 4km 벚꽃 터널. 철이 아니어도 카페 산책길',
    why: '나카메구로역 옆을 흐르는 메구로강 양쪽에 벚꽃 800그루가 4km 이어집니다. 3월 말 밤 조명이 켜지면 도쿄에서 사진이 가장 많은 자리이고, 그 밖의 계절에는 강변 카페와 편집숍을 따라 걷는 길입니다. 다이칸야마까지 걸어 15분입니다.',
    practical: P('약 1시간', '무료', { busy: '벚꽃 철(3월 말~4월 초) 주말 저녁은 통제됩니다' }),
    caution: '좌표는 나카메구로역 옆 강변 기준으로 직접 확인한 값입니다. Wikidata 의 메구로강 항목은 하구 좌표라 쓰지 않았습니다.',
  },
  {
    id: 'nakameguro-daikanyama-tsite', wikidata: 'Q125555885', lat: 35.64928, lon: 139.69982,
    name: '다이칸야마 T-SITE', nameEn: 'Daikanyama T-Site', nameLocal: '代官山T-SITE', city: 'nakameguro',
    theme: 'shopping', durationMin: 60, priceJpy: 0, energy: 1, popularity: 4,
    bestSlots: ['morning', 'afternoon', 'evening'], indoor: true, tags: ['select', 'cafe', '재방문'],
    summary: '세계에서 가장 아름다운 서점으로 꼽힌 츠타야. 나무 사이 세 동',
    why: '나무 사이에 낮게 앉은 세 동의 츠타야 서점으로, 잡지 아카이브와 여행·요리·건축 서가, 2층 라운지 안진(Anjin)이 있습니다. 책을 안 사도 한 시간이 가고, 다이칸야마의 편집숍 거리와 이어집니다. 나카메구로역에서 걸어 10분입니다.',
    practical: P('약 1시간', '무료', { hours: '9:00~22:00' }),
    caution: null,
  },
  {
    id: 'nakameguro-starbucks-roastery', wikidata: 'Q65665536', lat: 35.64917, lon: 139.69267,
    name: '스타벅스 리저브 로스터리 도쿄', nameEn: 'Starbucks Reserve Roastery Tokyo', nameLocal: 'スターバックス リザーブ ロースタリー 東京', city: 'nakameguro',
    theme: 'food', durationMin: 60, priceJpy: 1500, energy: 1, popularity: 4,
    bestSlots: ['morning', 'afternoon', 'evening'], indoor: true, tags: ['cafe', 'bar', '재방문'],
    summary: '구마 겐고가 지은 4층 로스터리. 강변 테라스에서 벚꽃',
    why: '세계 여섯 곳뿐인 스타벅스 로스터리의 도쿄점으로 구마 겐고가 설계했습니다. 4층 높이의 구리 캐스크와 층마다 다른 바(차·칵테일·빵)가 있고, 메구로강 쪽 테라스가 벚꽃 철 명당입니다. 주말은 입장 대기표를 받습니다.',
    practical: P('약 1시간', '커피 ¥800~1,500', { busy: '주말 오전부터 대기. 온라인 대기표를 받으세요' }),
    caution: null,
  },

  // ── 하코네 ──────────────────────────────────────────────────────
  {
    id: 'hakone-hakone-ropeway', wikidata: null, lat: 35.24020, lon: 139.02000,
    name: '하코네 로프웨이', nameEn: 'Hakone Ropeway', nameLocal: '箱根ロープウェイ', city: 'hakone',
    theme: 'activity', durationMin: 60, priceJpy: 1500, energy: 1, popularity: 5,
    bestSlots: ['morning', 'afternoon'], indoor: false, tags: ['후지산뷰', '대표'],
    summary: '소운잔에서 오와쿠다니를 지나 아시노코까지 30분 공중 산책',
    why: '등산열차·케이블카를 갈아타고 소운잔에서 타는 곤돌라입니다. 화산 연기가 오르는 오와쿠다니 위를 지나고, 맑은 날에는 후지산이 정면에 보입니다. 도겐다이에서 내리면 아시노코 해적선으로 이어져, 하코네를 한 바퀴 도는 코스의 핵심입니다.',
    practical: P('약 1시간', '편도 ¥1,500 · 프리패스 포함', { busy: '주말 10~14시 소운잔역에서 30~60분 대기' }),
    caution: '강풍이나 화산 가스 농도가 높으면 운휴하고 대체 버스가 다닙니다. 좌표는 오와쿠다니역 기준으로 직접 확인한 값입니다.',
  },
  {
    id: 'hakone-hakone-yumoto', wikidata: null, lat: 35.23230, lon: 139.10690,
    name: '하코네유모토 온천가', nameEn: 'Hakone-Yumoto Onsen', nameLocal: '箱根湯本温泉', city: 'hakone',
    theme: 'onsen', durationMin: 120, priceJpy: 1500, energy: 1, popularity: 5,
    bestSlots: ['afternoon', 'evening', 'night'], indoor: true, tags: ['온천', '대표'],
    summary: '로망스카가 닿는 하코네의 현관. 당일 온천과 온천 만주 거리',
    why: '신주쿠에서 온 로망스카가 닿는 하코네의 입구이자 가장 큰 온천가입니다. 역 앞 상점가에 온천 만주와 어묵 가게가 이어지고, 걸어갈 수 있는 당일 온천(히가에리)이 여럿이라 묵지 않아도 탕에 들어갈 수 있습니다. 료칸에 묵는다면 저녁 식사 전 한 번, 자기 전 한 번이 정석입니다.',
    practical: P('약 2시간', '당일 온천 ¥1,300~2,500', { hours: '당일 온천은 대개 10:00~21:00' }),
    caution: '문신이 있으면 못 들어가는 곳이 있습니다. 수건은 대개 유료 대여입니다. 좌표는 하코네유모토역 기준으로 직접 확인한 값입니다.',
  },
  {
    id: 'hakone-lake-ashi-cruise', wikidata: null, lat: 35.20500, lon: 139.02700,
    name: '아시노코 해적선', nameEn: 'Hakone Sightseeing Cruise', nameLocal: '箱根海賊船', city: 'hakone',
    theme: 'activity', durationMin: 60, priceJpy: 1200, energy: 1, popularity: 4,
    bestSlots: ['morning', 'afternoon'], indoor: false, tags: ['호수', '후지산뷰'],
    summary: '도겐다이에서 하코네마치·모토하코네까지 호수 위 30분',
    why: '로프웨이 종점 도겐다이에서 타는 관광선입니다. 호수 위에서 하코네 신사의 붉은 도리이와 맑은 날의 후지산을 보며 30분을 건너 하코네마치·모토하코네에 닿습니다. 거기서 하코네 관문과 신사를 보고 버스로 유모토에 돌아오는 것이 하코네 한 바퀴의 마지막 구간입니다.',
    practical: P('약 1시간', '편도 ¥1,200 · 프리패스 포함', { hours: '대략 9:30~17:00, 30~40분 간격' }),
    caution: '겨울 오후에는 마지막 배가 이릅니다. 좌표는 도겐다이 선착장 기준으로 직접 확인한 값입니다.',
  },
  {
    id: 'hakone-hakone-checkpoint', wikidata: 'Q11603393', lat: 35.19236, lon: 139.02614,
    name: '하코네 관문', nameEn: 'Hakone Checkpoint', nameLocal: '箱根関所', city: 'hakone',
    theme: 'history', durationMin: 45, priceJpy: 500, energy: 1, popularity: 3,
    bestSlots: ['morning', 'afternoon'], indoor: false, tags: [],
    summary: '에도 시대 여행자를 검문하던 관소를 복원한 곳',
    why: '에도로 들어오는 여행자와 총기를 검문하던 도카이도의 관소를 2007년에 옛 자료대로 복원했습니다. 해적선에서 내려 하코네 신사로 가는 호숫가 삼나무길 중간에 있어 잠깐 들르기 좋습니다.',
    practical: P('약 45분', '¥500'),
    caution: null,
  },
  {
    id: 'hakone-gora-park', wikidata: 'Q11487751', lat: 35.24861, lon: 139.04514,
    name: '고라 공원', nameEn: 'Gōra Park', nameLocal: '強羅公園', city: 'hakone',
    theme: 'nature', durationMin: 45, priceJpy: 650, energy: 2, popularity: 3,
    bestSlots: ['morning', 'afternoon'], indoor: false, tags: ['정원'],
    summary: '1914년의 프랑스식 정원. 등산열차 종점 고라에서 케이블카 한 정거장',
    why: '고라역 위 언덕에 있는 일본 최초의 프랑스식 정원입니다. 분수를 중심으로 장미원과 온실이 있고, 유리공예·도자기 체험 공방이 있습니다. 조각의 숲 미술관과 가까워 오전에 둘을 묶기 좋습니다.',
    practical: P('약 45분', '¥650 (프리패스 무료)'),
    caution: null,
  },

  // ── 가마쿠라·에노시마 ─────────────────────────────────────────────
  {
    id: 'kamakura-komachi-dori', wikidata: null, lat: 35.32070, lon: 139.55180,
    name: '고마치도리', nameEn: 'Komachi-dōri', nameLocal: '小町通り', city: 'kamakura',
    theme: 'shopping', durationMin: 45, priceJpy: 0, energy: 2, popularity: 4,
    bestSlots: ['morning', 'afternoon'], indoor: false, tags: ['먹거리', '기념품', 'street'],
    summary: '가마쿠라역에서 하치만구까지 먹거리 상점가 360m',
    why: '가마쿠라역 동쪽 출구에서 쓰루가오카 하치만구로 이어지는 상점가입니다. 시라스(멸치) 덮밥, 말차 소프트, 자색고구마 과자를 먹으며 걷는 길이고, 신사에 가는 길이 자연히 이 길이 됩니다.',
    practical: P('약 45분', '무료', { busy: '주말 12~15시' }),
    caution: '좌표는 상점가 입구 기준으로 직접 확인한 값입니다.',
  },
  {
    id: 'kamakura-enoden', wikidata: null, lat: 35.30960, lon: 139.53300,
    name: '에노덴 전차', nameEn: 'Enoden (Enoshima Electric Railway)', nameLocal: '江ノ電', city: 'kamakura',
    theme: 'activity', durationMin: 40, priceJpy: 800, energy: 1, popularity: 5,
    bestSlots: ['morning', 'afternoon', 'evening'], indoor: false, tags: ['전차', '바다', '대표'],
    summary: '가마쿠라와 에노시마를 잇는 바닷가 전차. 슬램덩크 건널목',
    why: '가마쿠라에서 후지사와까지 10km 를 34분에 달리는 작은 전차입니다. 민가 사이를 스치다 갑자기 바다가 열리는 구간이 있고, 가마쿠라고교마에역 앞 건널목은 만화 슬램덩크의 그 장면입니다. 대불(하세역)과 에노시마를 잇는 교통수단이자 그 자체가 볼거리입니다.',
    practical: P('약 40분', '1일권 ¥800 · 편도 ¥200~310', { busy: '주말 오후에는 한 대를 보내야 탑니다' }),
    caution: '가마쿠라고교마에 건널목에서 찻길로 나가 사진 찍는 사람이 많아 단속합니다. 인도에서 찍으세요. 좌표는 하세역 기준으로 직접 확인한 값입니다.',
  },

  // ── 닛코 ───────────────────────────────────────────────────────
  {
    id: 'nikko-nikko-toshogu', wikidata: 'Q696641', lat: 36.75917, lon: 139.59861,
    name: '닛코 도쇼구', nameEn: 'Nikkō Tōshō-gū', nameLocal: '日光東照宮', city: 'nikko',
    theme: 'history', durationMin: 120, priceJpy: 1600, energy: 3, popularity: 5,
    bestSlots: ['morning', 'afternoon'], indoor: false, tags: ['유네스코', '대표'],
    summary: '도쿠가와 이에야스의 사당. 조각 5천 개의 요메이몬',
    why: '1617년 도쿠가와 이에야스를 모신 사당으로 유네스코 세계유산입니다. 조각 500여 개가 덮인 요메이몬(하루 종일 봐도 질리지 않는다는 문), 세 원숭이와 잠자는 고양이 조각, 삼나무 숲 속 207개 돌계단 위의 묘소까지 두 시간은 잡아야 합니다. 닛코에 오는 이유 그 자체입니다.',
    practical: P('약 2시간', '¥1,600', { busy: '10~14시 단체 관광. 8시 개문 직후나 15시 이후가 낫습니다', hours: '9:00~17:00 (11~3월 16:00)' }),
    caution: '경내가 계단과 오르막입니다. 린노지·후타라산 신사와 세트권(¥1,000)이 있습니다.',
  },
  {
    id: 'nikko-lake-chuzenji', wikidata: 'Q117923', lat: 36.74056, lon: 139.46222,
    name: '주젠지 호수', nameEn: 'Lake Chūzenji', nameLocal: '中禅寺湖', city: 'nikko',
    theme: 'nature', durationMin: 90, priceJpy: 0, energy: 2, popularity: 4,
    bestSlots: ['morning', 'afternoon'], indoor: false, tags: ['호수', '단풍'],
    summary: '해발 1,269m 의 화산 호수. 게곤 폭포가 여기서 떨어진다',
    why: '난타이산 화산이 만든 호수로, 닛코 시내에서 이로하자카 고갯길을 버스로 40분 올라갑니다. 호숫가 산책과 유람선이 있고, 물이 넘쳐 떨어지는 것이 게곤 폭포라 둘을 묶어 오후를 씁니다. 10월 중순 단풍이 절정입니다.',
    practical: P('약 1시간 30분', '무료 (유람선 별도)'),
    caution: '단풍 철 이로하자카는 버스가 몇 시간씩 막힙니다. 아침 첫 버스로 올라가세요.',
  },
  {
    id: 'nikko-kinugawa-onsen', wikidata: 'Q5363719', lat: 36.82472, lon: 139.71639,
    name: '기누가와 온천', nameEn: 'Kinugawa Onsen', nameLocal: '鬼怒川温泉', city: 'nikko',
    theme: 'onsen', durationMin: 120, priceJpy: 1000, energy: 1, popularity: 3,
    bestSlots: ['afternoon', 'evening', 'night'], indoor: true, tags: ['온천', '협곡'],
    summary: '협곡을 따라 대형 온천 호텔이 늘어선 닛코의 온천가',
    why: '닛코역에서 도부선으로 30분, 기누강 협곡 양쪽에 온천 호텔이 늘어선 곳입니다. 닛코를 당일치기가 아니라 하룻밤으로 만들고 싶을 때 자는 곳으로, 무료 족탕과 협곡 유람선이 있습니다. 화려한 신사를 보고 온천에서 자는 조합이 됩니다.',
    practical: P('약 2시간', '당일 온천 ¥1,000~1,500'),
    caution: '거품 경제기 호텔이 많아 외관이 낡은 곳이 있습니다. 예약 전에 최근 후기를 보세요.',
  },

  // ── 가와고에 / 가와구치코 ──────────────────────────────────────────
  {
    id: 'kawagoe-kurazukuri-street', wikidata: null, lat: 35.92200, lon: 139.48300,
    name: '구라즈쿠리 거리', nameEn: 'Kurazukuri Street (Ichibangai)', nameLocal: '蔵造りの町並み', city: 'kawagoe',
    theme: 'history', durationMin: 75, priceJpy: 0, energy: 2, popularity: 5,
    bestSlots: ['morning', 'afternoon'], indoor: false, tags: ['옛거리', '대표', 'street', 'craft'],
    summary: '검은 흙벽 창고 30채가 남은 400m. 작은 에도의 본편',
    why: '1893년 대화재 뒤 상인들이 불에 강한 흙벽 창고(구라)로 지은 상점 거리입니다. 검은 벽과 기와가 이어지고 중간에 시간의 종(도키노카네)이 서 있습니다. 고구마 과자를 먹으며 걷고, 옆의 과자 골목(가시야요코초)까지 묶으면 반나절입니다.',
    practical: P('약 1시간 15분', '무료', { busy: '주말 11~15시. 가게는 17시면 닫습니다' }),
    caution: '좌표는 거리 중간의 시간의 종 앞 기준으로 직접 확인한 값입니다.',
  },
  {
    id: 'kawaguchiko-oishi-park', wikidata: null, lat: 35.52050, lon: 138.73650,
    name: '오이시 공원', nameEn: 'Oishi Park', nameLocal: '大石公園', city: 'kawaguchiko',
    theme: 'nature', durationMin: 45, priceJpy: 0, energy: 1, popularity: 4,
    bestSlots: ['morning', 'afternoon'], indoor: false, tags: ['후지산뷰', '라벤더', '무료'],
    summary: '호수 너머 후지산을 정면으로. 6월 라벤더, 가을 코키아',
    why: '가와구치코 북쪽 호숫가 공원으로, 호수와 후지산이 가리는 것 없이 정면에 놓이는 자리입니다. 6월 말 라벤더, 10월 붉은 코키아가 앞에 깔려 계절 사진의 정석이고, 후지산이 보이는 오전에 가야 합니다.',
    practical: P('약 45분', '무료', { busy: '주말 오전, 라벤더 철' }),
    caution: '오후에는 구름이 끼어 후지산이 안 보이는 날이 많습니다. 좌표는 지도에서 직접 확인한 값입니다.',
  },
  {
    id: 'kawaguchiko-oshino-hakkai', wikidata: 'Q11072216', lat: 35.46111, lon: 138.83333,
    name: '오시노 핫카이', nameEn: 'Oshino Hakkai', nameLocal: '忍野八海', city: 'kawaguchiko',
    theme: 'nature', durationMin: 60, priceJpy: 0, energy: 2, popularity: 4,
    bestSlots: ['morning', 'afternoon'], indoor: false, tags: ['샘', '후지산뷰'],
    summary: '후지산 눈이 80년을 걸러 솟는 여덟 개의 샘',
    why: '후지산에 내린 눈이 지하로 스며 수십 년 뒤 솟아오르는 샘 여덟 곳이 초가지붕 마을 사이에 있습니다. 물이 파랗게 비칠 만큼 맑고, 뒤로 후지산이 보입니다. 가와구치코에서 버스로 25분이라 반나절 곁들이기 좋습니다.',
    practical: P('약 1시간', '무료 (일부 샘은 ¥300)', { busy: '단체 관광이 오전에 몰립니다' }),
    caution: null,
  },

  // ── 요코하마 ─────────────────────────────────────────────────────
  {
    id: 'yokohama-red-brick-warehouse', wikidata: 'Q5363823', lat: 35.45220, lon: 139.64300,
    name: '아카렌가 창고', nameEn: 'Yokohama Red Brick Warehouse', nameLocal: '横浜赤レンガ倉庫', city: 'yokohama',
    theme: 'landmark', durationMin: 60, priceJpy: 0, energy: 1, popularity: 5,
    bestSlots: ['afternoon', 'evening', 'night'], indoor: true, tags: ['야경', '대표'],
    summary: '1911년의 붉은 벽돌 세관 창고. 지금은 상점과 광장',
    why: '항구의 옛 보세 창고 두 동을 상점과 카페로 바꾼 곳입니다. 앞 광장에서 계절마다 옥토버페스트·크리스마스 마켓·스케이트장이 열리고, 해 진 뒤 조명이 켜진 창고와 미나토미라이 야경이 요코하마의 대표 장면입니다. 오산바시 부두·야마시타 공원과 걸어서 이어집니다.',
    practical: P('약 1시간', '무료'),
    caution: null,
  },
  {
    id: 'yokohama-motomachi', wikidata: 'Q11387978', lat: 35.44042, lon: 139.64969,
    name: '모토마치 상점가', nameEn: 'Motomachi', nameLocal: '元町', city: 'yokohama',
    theme: 'shopping', durationMin: 45, priceJpy: 0, energy: 2, popularity: 3,
    bestSlots: ['morning', 'afternoon'], indoor: false, tags: ['상점가', 'select'],
    summary: '개항기 외국인 거류지 옆에서 자란 서양풍 상점가',
    why: '차이나타운 옆 600m 의 상점가로, 개항 때 외국인 거류지에 물건을 대던 가게들에서 시작했습니다. 가방·구두·양과자의 요코하마 브랜드 본점이 여기 있고, 언덕 위 야마테의 서양관 거리로 이어집니다.',
    practical: P('약 45분', '무료'),
    caution: null,
  },
];

/**
 * 뺄 것. Wikidata 근접 검색이 반경 안이라는 이유로 끌어온, 여행 대상이 아닌 것들.
 */
export const DROP = new Set([
  // ── 재방문 동네 2차 — 장소가 아니거나, 옆 동네가 이미 가진 것 ──
  'nippori-wd-pine-trees',                  // 병풍 그림. 장소가 아니다
  'nippori-wd-haniwa-armored-man',          // 하니와 유물
  'koenji-koen-ji',                         // 동네 자체를 절로 적은 것
  'koenji-wd-japanese-society-for-preservation-of-birds', // 단체
  'akasaka-tokyo-midtown',                  // = roppongi-tokyo-midtown
  'akasaka-21-21-design-sight',             // = roppongi-21-21-design-sight
  'akasaka-suntory-museum-of-art',          // 미드타운 안. 롯폰기 것
  'akasaka-fujifilm-square',                // 미드타운 안
  'akasaka-preece-premium',                 // 슈퍼마켓
  'akasaka-wd-new-otani-art-museum',        // 2014 폐관
  'sugamo-sugamo',                          // 동네 자체
  'tsukishima-ramen-cooking-tokyo',         // 요리 교실 광고
  'atami-atami-hihokan',                    // 성인 박물관
  'atami-maxvalu-express',                  // 슈퍼마켓
  'kawasaki-wd-toshiba-science-museum',     // 2024 폐관
  'kawasaki-hub-kawasaki',                  // 체인 펍
  'asakusa-wd-japanese-sword-museum',       // 료고쿠 것(ryogoku-japanese-sword-museum)
  'marunouchi-wd-tokugawa-shogunate',       // 정권. 장소가 아니다
  'marunouchi-wd-eirin',                    // 영화 심의 기구
  'marunouchi-wd-mitsui-memorial-museum',   // = ginza-mitsui-memorial-museum
  'akihabara-wd-sumitomo-fudosan-akihabara-building', // 오피스 빌딩
  'akihabara-wd-akiba-tolim',               // 평범한 쇼핑센터
  'hakone-wd-ishigakiyama-castle',          // 오다와라 뒤편 성터. 하코네 일정에 안 들어간다
  'hakone-wd-odawara-blueway-bridge',
  'hakone-wd-odawara-literature-museum',
  'hakone-wd-kanagawa-prefectural-museum-of-natural-history',
  'hakone-wd-hotoku-ninomiya-shrine',
  'hakone-wd-soun-ji-temple',
  'hakone-hiking',                          // 장소가 아니라 '등산' 이라는 활동
  'roppongi-rainbow-bridge',                // 오다이바 것으로 옮겼다
  'roppongi-tokyo-island',                  // 안테나숍
  'roppongi-aquapark-shinagawa',            // 시나가와. 롯폰기 일정에서 멀다
  'roppongi-institute-for-nature-study',    // 메구로
  'roppongi-tokyo-metropolitan-teien-art-museum', // 메구로
  'roppongi-sengaku-ji',                    // 시나가와
  'odaiba-wd-animejapan',                   // 행사
  'odaiba-wd-ariake-urban-sports-park',
  'odaiba-wd-teleport-bridge',
  'odaiba-wd-venusfort',                    // 2022년 폐점
  'odaiba-museum-of-maritime-science',      // 장기 휴관
  'shinjuku-japan-national-stadium',        // 경기 없는 날 볼 것이 없다
  'shinjuku-meiji-jingu-stadium',
  'shinjuku-west-exit-square-event-space',
  'shinjuku-shinjuku-sanchome-and-related-red-light-district',
  'shinjuku-cinem-rt-shinjuku', 'shinjuku-wald-9', 'shinjuku-shinjuku-piccadilly', // 영화관
  'shibuya-virgo',                          // 미용실
  'shibuya-0101',                           // 2022년 폐점
  'shibuya-ntt-docomo-building',            // 올라갈 수 없는 빌딩
  'ueno-scai-the-bathhouse',                // 옛 목욕탕을 쓴 갤러리. 온천이 아니다 (이름 때문에 온천으로 분류됐다)
  'ueno-yoshinoya', 'akihabara-yoshinoya',  // 체인 규동
  'ueno-cigars-cafe-lwan',
  'ikebukuro-shakey-s-pizza', 'ikebukuro-al-flah',
  'ikebukuro-myoko-ji-temple', 'ikebukuro-honmyoji-temple',
  'ikebukuro-wd-tobu-department-store',
  'kawagoe-kasumigaseki-country-club',      // 골프장
  'kawagoe-kawagoe-history-museum',         // 설명이 없다
  'kawagoe-fujidana-udon-kawagoe',
  'kawagoe-wd-miyoshino-shrine', 'kawagoe-wd-tomyo-ji-temple', 'kawagoe-wd-renkei-ji-temple', 'kawagoe-wd-naka-in-temple',
  'kamakura-fueda-park',                    // 동네 운동장
  'kamakura-roastbeef-kamakurayama',
  'nikko-nikko-kirifuri-ice-arena', 'nikko-nikko-yumoto-onsen-ski-park', 'nikko-woodsman-s-village',
  'kusatsu-kusatsu-international-ski-area', 'kusatsu-tropical-zoo-kusatsu-nettaiken', 'kusatsu-asama-volcano-museum',
  'kusatsu-kusatsu-visitor-center', 'kusatsu-kusatsu-hot-spring-hall', 'kusatsu-kusatsu-big-bath',
  'kawaguchiko-wd-unoshima', 'kawaguchiko-aokigahara', 'kawaguchiko-hike-to-mt-mitsutoge',
  'yokohama-kamoi-sugiyama-shrine', 'yokohama-kikuna-sakurayama-park', 'yokohama-sun-road', 'yokohama-okurayama-memorial-hall',
  'yokohama-hiyoshi-tunnels', 'yokohama-anniversaire-hills-yokohama', 'yokohama-equine-museum-of-japan',
  'yokohama-negishi-forest-park', 'yokohama-yokohama-arena', 'yokohama-nissan-stadium', 'yokohama-yokohama-stadium',
  'yokohama-shomyo-temple', 'yokohama-shinyokohama-ramen-museum', // 신요코하마. 시내에서 멀다
  'ginza-tokyo-stock-exchange',             // 니혼바시. 평일 견학뿐
  'ginza-ginza-blossom', 'ginza-san-ai-building', 'ginza-sony-building', // 공사 중·행사장
  'marunouchi-maach-ecute-kanda-manseibashi',
  'kichijoji-kichijoji-theatre', 'kichijoji-baobab-world-kitchen-y-musica', 'kichijoji-kichijoji-art-museum',
  'kichijoji-yodobashi-camera', 'kichijoji-hub',
  'ikebukuro-ikefukuro', 'ikebukuro-k-books', 'ikebukuro-mandarake', 'ikebukuro-animate', // 오토메로드 항목으로 묶었다
  'asakusa-ryogoku-fireworks-museum', 'asakusa-tobu-museum', 'asakusa-asakusa-naniwaya',
  // 시모키타자와·나카메구로 — 좌표가 없어 반경 필터를 지나온 먼 곳들(후타코타마가와·지유가오카)
  'shimokitazawa-tamagawa-takashimaya-s-c', 'shimokitazawa-futako-tamagawa-rise', 'shimokitazawa-jiyugaoka-sweets-forest',
  'shimokitazawa-jiyugaoka-burger', 'shimokitazawa-okuraland', 'shimokitazawa-starbucks', 'shimokitazawa-setagaya-boro-ichi',
  'nakameguro-jiyugaoka-burger', 'nakameguro-sweets-forest', 'nakameguro-kochoo', // 시모키타자와 것과 같은 가게
  'asakusa-kannondo',                       // 센소지(EXTRAS) 와 같은 곳. 본당만 따로 두면 두 번 나온다
]);
