/**
 * 지역 등급(tier: 'district')과 도시 안 오버헤드가 도쿄 모델을 만드는가.
 *
 * 스페인은 도시 사이를 옮겨 다니지만 도쿄는 한 곳에 묵고 지역을 돈다.
 * 지역을 스페인의 도시로 넣고 돌리면 도쿄 안에서 호텔을 다섯 번 옮기거나,
 * 숙소를 고정해도 왕복이 부풀어 4박 5일이 6일이 됐다. 이 검사는 그 두 가지가
 * 다시 생기지 않는지, 그리고 이동 시간이 실제 감각(검산표)과 맞는지 본다.
 *
 * 데이터 파일이 없어도 돈다 — 도쿄 등록부가 생기기 전에 엔진부터 고쳐야
 * 했기 때문에, 여기서는 도쿄를 흉내 낸 작은 데이터를 직접 만든다.
 * 되돌려서(tier 를 지우거나 오버헤드를 37로) 걸리는지 확인했다.
 *
 *   npx tsx scripts/district-check.mjs
 */
const { buildItinerary } = await import('../src/lib/itinerary.ts');
const { buildPlans } = await import('../src/lib/planner.ts');
const { servicesBetween, setCountryTransit, fmtDur } = await import('../src/lib/routing.ts');
const { expandDistrictScope, pickableCities } = await import('../src/lib/district.ts');
const { inferThemes } = await import('../src/lib/taste.ts');

let fail = 0;
const check = (ok, label, detail = '') => {
  console.log(`  ${ok ? '✓' : '✗'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!ok) fail++;
};

/* ── 도쿄를 흉내 낸 데이터 ─────────────────────────────────────────────── */
const guide = { passes: [], apps: [], tips: [] };
const city = (o) => ({
  region: '도쿄', macroRegion: 'tokyo', island: null, isHub: false, hub: null, dayTrips: [],
  itemCount: 0, themes: {}, transitGuide: guide, tagline: '', suitedFor: null, highlights: [],
  season: null, profile: null, nights: [0, 0], firstTimer: true, tags: [], photo: null,
  photoCredit: null, wikidata: null, ...o,
});
const T = (c, transitMin, mode) => ({ city: c, transitMin, mode, note: '' });

const CITIES = [
  // 도쿄 — 잘 수 있는 곳. 좌표는 도쿄역. 볼 것은 전부 지역에 있다.
  city({ slug: 'tokyo', name: '도쿄', nameEn: 'Tokyo', lat: 35.6812, lon: 139.7671, isHub: true,
    nights: [3, 5], tags: ['대도시', '교통중심'],
    dayTrips: [T('hakone', 80, '오다큐 로망스카'), T('kamakura', 55, 'JR 요코스카선')] }),
  // 지역 — 자는 곳이 아니라 낮에 가는 곳.
  city({ slug: 'shinjuku', name: '신주쿠', nameEn: 'Shinjuku', tier: 'district', within: 'tokyo', lat: 35.6938, lon: 139.7034,
    themes: { food: 3, nightlife: 2, landmark: 1 }, itemCount: 6, profile: { food: 3, nightlife: 3, shopping: 3, landmark: 2 } }),
  city({ slug: 'shibuya', name: '시부야', nameEn: 'Shibuya', tier: 'district', within: 'tokyo', lat: 35.6580, lon: 139.7016,
    themes: { food: 2, landmark: 2, shopping: 2 }, itemCount: 6 }),
  city({ slug: 'ginza', name: '긴자', nameEn: 'Ginza', tier: 'district', within: 'tokyo', lat: 35.6717, lon: 139.7650,
    themes: { food: 2, shopping: 2, art: 2 }, itemCount: 6 }),
  city({ slug: 'ueno', name: '우에노', nameEn: 'Ueno', tier: 'district', within: 'tokyo', lat: 35.7141, lon: 139.7774,
    themes: { art: 3, nature: 1, food: 2 }, itemCount: 6 }),
  city({ slug: 'asakusa', name: '아사쿠사', nameEn: 'Asakusa', tier: 'district', within: 'tokyo', lat: 35.7148, lon: 139.7967,
    themes: { history: 3, shopping: 1, food: 2 }, itemCount: 6 }),
  // 근교 — 스페인의 근교와 같은 층. 숙박이냐 당일치기냐는 엔진이 판단한다.
  city({ slug: 'hakone', name: '하코네', nameEn: 'Hakone', hub: 'tokyo', lat: 35.2323, lon: 139.1069,
    nights: [1, 2], tags: ['온천'], themes: { onsen: 3, nature: 3, art: 1, food: 2 }, itemCount: 9,
    profile: { onsen: 3, nature: 3, art: 2, food: 1 } }),
  city({ slug: 'kamakura', name: '가마쿠라', nameEn: 'Kamakura', hub: 'tokyo', lat: 35.3192, lon: 139.5467,
    nights: [0, 1], tags: ['당일치기'], themes: { history: 5, nature: 2, food: 2 }, itemCount: 9 }),
];
const C = (s) => CITIES.find((c) => c.slug === s);

/* 등록부의 역~역 시간. 지도 앱에서 역 이름으로 검색하면 나오는 값이다. */
const LINKS = [
  ['tokyo', 'shinjuku', 15], ['tokyo', 'shibuya', 25], ['tokyo', 'ginza', 5], ['tokyo', 'ueno', 8], ['tokyo', 'asakusa', 20],
  ['shinjuku', 'shibuya', 7], ['shinjuku', 'ginza', 16], ['shinjuku', 'ueno', 25], ['shinjuku', 'asakusa', 35],
  ['shibuya', 'ginza', 17], ['shibuya', 'ueno', 30], ['shibuya', 'asakusa', 35],
  ['ginza', 'ueno', 12], ['ginza', 'asakusa', 18], ['ueno', 'asakusa', 6],
].map(([a, b, minutes]) => ({ a, b, minutes, mode: '지하철' }));
setCountryTransit({ city: 37, district: 20 }, LINKS);

let n = 0;
const item = (c, theme, dur, extra = {}) => {
  const home = C(c);
  n += 1;
  return {
    id: `${c}-${theme}-${n}`, name: `${home.name} ${theme} ${n}`, nameEn: `${c} ${theme}`, nameLocal: null,
    city: c, district: null, theme, summary: '', why: '', caution: null,
    practical: { booking: null, closed: null, busy: null, duration: '', price: null, hours: null },
    lat: home.lat + (n % 3) * 0.002, lon: home.lon + (n % 2) * 0.002,
    durationMin: dur, priceEur: 0, hours: null,
    bestSlots: theme === 'food' ? ['lunch', 'dinner'] : theme === 'nightlife' ? ['evening', 'night']
      : theme === 'onsen' ? ['afternoon', 'evening', 'night'] : ['morning', 'afternoon'],
    indoor: theme !== 'nature', popularity: 4, energy: 2, tags: [], url: null, photo: null, wikidata: null,
    source: 'manual', attribution: '검사용', ...extra,
  };
};
/* 지역 하나는 볼거리 둘(75분씩)과 식당 둘 — 문서의 예(센소지·나카미세, 우에노 공원·박물관)와 같은 크기다. */
const districtItems = (c, themes, night = false) => [
  ...themes.map((t) => item(c, t, 75)),
  item(c, 'food', 60), item(c, 'food', 60), ...(night ? [item(c, 'nightlife', 60)] : []),
];
const ITEMS = [
  ...districtItems('shinjuku', ['landmark', 'shopping'], true),
  ...districtItems('shibuya', ['landmark', 'shopping'], true),
  ...districtItems('ginza', ['art', 'shopping']),
  ...districtItems('ueno', ['art', 'nature']),
  ...districtItems('asakusa', ['history', 'shopping']),
  item('hakone', 'nature', 120), item('hakone', 'art', 90), item('hakone', 'nature', 60),
  item('hakone', 'onsen', 120), item('hakone', 'food', 60), item('hakone', 'food', 60),
  item('kamakura', 'history', 90), item('kamakura', 'history', 60), item('kamakura', 'nature', 60),
  item('kamakura', 'food', 60), item('kamakura', 'food', 60),
];
const prefs = {
  themes: { history: 2, art: 2, landmark: 2, nature: 2, food: 2, nightlife: 1, activity: 1, shopping: 2, onsen: 2 },
  pace: 3, budget: 'mid', dayStart: 'normal', nightlife: 1, discovery: 2, walkTolerance: 3,
  companion: 'couple', foodStyles: [], mobility: 'normal', photo: 2, transport: ['walk', 'metro'], dayTripAppetite: 2,
};
const pri = (items) => Object.fromEntries(items.map((i) => [i.id, 2]));
const trip = (slugs) => {
  const scope = expandDistrictScope(slugs, CITIES);
  return CITIES.filter((c) => scope.includes(c.slug));
};

/* ── 1. 문앞~문앞 검산표 ─────────────────────────────────────────────── */
console.log('■ 도시 안 이동 — 검산표 (등록부 역~역 + 20분)');
for (const [a, b, want, feel] of [
  ['asakusa', 'ueno', 26, '걸어도 25분'], ['shinjuku', 'shibuya', 27, '20~30분'],
  ['shibuya', 'ginza', 37, '30~40분'], ['shinjuku', 'asakusa', 55, '45~60분'],
]) {
  const list = servicesBetween(C(a), C(b));
  check(list.length === 1 && list[0].mode === 'metro' && list[0].totalMin === want,
    `${C(a).name}→${C(b).name} 문앞~문앞 ${want}분 (실제 감각 ${feel})`,
    list.map((s) => `${s.label} ${s.totalMin}분`).join(', '));
}
{
  const list = servicesBetween(C('tokyo'), C('hakone'), { minutes: 80, mode: '오다큐 로망스카' });
  const train = list.find((s) => s.mode === 'train');
  check(train?.totalMin === 80 + 37, '도시 간(도쿄→하코네)에는 그대로 37분이 붙는다', `${train?.label} ${train?.totalMin}분`);
  const est = servicesBetween(C('ueno'), C('shibuya'));
  check(est.length === 1 && est[0].mode === 'metro', '구간표에 없는 지역 사이도 지하철 하나로 어림한다',
    est.map((s) => `${s.label} ${s.totalMin}분${s.estimated ? ' 추정' : ''}`).join(', '));
}

/* ── 2. 지역은 절대 숙박지가 되지 않는다 ────────────────────────────── */
console.log('\n■ 지역은 절대 숙박지가 되지 않는다');
{
  const sel = trip(['shinjuku', 'shibuya', 'ginza', 'ueno', 'asakusa']);
  check(sel.some((c) => c.slug === 'tokyo'), '지역을 고르면 그 도시(도쿄)가 여행에 따라온다', sel.map((c) => c.name).join('·'));
  check(!pickableCities(CITIES).some((c) => c.slug === 'tokyo'), '1단계 목록에는 껍데기 도시(도쿄)가 없다');
  const picked = ITEMS.filter((i) => sel.some((c) => c.slug === i.city));
  const it = buildItinerary(sel, picked, prefs, 'tokyo', 'tokyo', CITIES);
  const bases = it.stops.filter((s) => s.sleep).map((s) => s.city.slug);
  check(bases.length === 1 && bases[0] === 'tokyo', '거점은 도쿄 하나다', bases.join('·'));
  check(it.stops.filter((s) => !s.sleep).every((s) => s.base === 'tokyo'), '지역은 모두 도쿄에 붙는다');
  check(it.hops.length === 0, '도쿄 안에서 짐을 옮기는 구간이 없다', `${it.hops.length}구간`);
  const tokyo = it.stops.find((s) => s.sleep);
  check(tokyo.nights <= 5, '지역 다섯 곳이 밤 수를 부풀리지 않는다', `도쿄 ${tokyo.nights}박`);

  // 사용자가 '여기서 자기' 로 지정해도 지역은 숙박지가 되지 않는다.
  const forced = buildItinerary(sel, picked, prefs, 'tokyo', 'tokyo', CITIES, { lodging: { asakusa: 'sleep' } });
  check(!forced.stops.find((s) => s.city.slug === 'asakusa').sleep, "'여기서 자기' 로 지정해도 지역은 숙박지가 안 된다");

  // 하루에 지역 둘 이상 — 4박 5일이 6일이 되지 않는가.
  const { plans, needDays } = buildPlans({
    items: picked, itinerary: it, startDate: '2026-05-01', days: 5, prefs, priorities: pri(picked),
  });
  const plan = plans[1];
  const multi = plan.days.filter((d) => new Set((d.segments ?? []).map((s) => s.city)).size >= 2);
  check(multi.length >= 1, '한 날에 지역 둘 이상이 들어간다',
    plan.days.map((d) => (d.segments ?? []).map((s) => C(s.city).name).join('+')).join(' / '));
  check(needDays <= 3, '지역 다섯 곳(볼거리 열 곳)이 사흘 안에 들어간다 — 하루씩 먹지 않는다', `일정 ${needDays}일`);
  check(plan.days.every((d) => d.sleepAt === 'tokyo'), '매일 밤 도쿄에서 잔다');
  for (const d of plan.days) {
    const segs = d.segments ?? [];
    const second = segs[1];
    if (!second) continue;
    const link = LINKS.find((l) => (l.a === segs[0].city && l.b === second.city) || (l.b === segs[0].city && l.a === second.city));
    if (link) {
      check(second.inboundMin === link.minutes + 20,
        `${C(segs[0].city).name}→${C(second.city).name} 는 바로 간다(도쿄로 돌아왔다 다시 나가지 않는다)`,
        `${second.inboundMin}분`);
      break;
    }
  }
  const dinnerDays = plan.days.filter((d) => d.entries.some((e) => e.slot === 'dinner'));
  check(dinnerDays.length >= 3, '저녁은 그 지역에서 먹는다(도쿄 자체에는 식당이 없다)', `${dinnerDays.length}일에 저녁 있음`);
  check(plan.days.every((d) => !d.entries.some((e) => e.returnLeg)), '지역에서는 저녁 먹으러 거점으로 돌아오는 구간이 없다');
  const withSeg = plan.days.flatMap((d) => d.entries).filter((e) => e.seg !== undefined);
  check(withSeg.length === plan.days.flatMap((d) => d.entries).length, '모든 일정에 구간 번호가 찍혀 있다');
  console.log(`    (${plan.days.map((d) => `${d.dayIndex}일 ${(d.segments ?? []).map((s) => `${C(s.city).name}${s.minutes}`).join('+')}`).join(' · ')})`);
}

/* ── 3. 근교 — 온천은 숙박, 그 밖에는 당일치기 ──────────────────────── */
console.log('\n■ 근교 — 온천을 담으면 숙박, 아니면 당일치기');
{
  const sel = trip(['shinjuku', 'asakusa', 'hakone', 'kamakura']);
  const all = ITEMS.filter((i) => sel.some((c) => c.slug === i.city));
  const withOnsen = buildItinerary(sel, all, prefs, 'tokyo', 'tokyo', CITIES);
  const hk = withOnsen.stops.find((s) => s.city.slug === 'hakone');
  const km = withOnsen.stops.find((s) => s.city.slug === 'kamakura');
  check(hk.sleep, '온천을 담은 하코네는 거기서 잔다', hk.why);
  check(!km.sleep && km.base === 'tokyo', '가마쿠라는 도쿄에서 당일치기', `왕복 ${fmtDur(km.dayTripMin)}`);

  const noOnsen = buildItinerary(sel, all.filter((i) => i.theme !== 'onsen'), prefs, 'tokyo', 'tokyo', CITIES);
  const hk2 = noOnsen.stops.find((s) => s.city.slug === 'hakone');
  check(!hk2.sleep && hk2.base === 'tokyo', '온천을 안 담으면 하코네도 당일치기(편도 80+37=117분 ≤ 120)', hk2.why);

  const inferred = inferThemes(sel.filter((c) => c.profile));
  check(inferred.onsen > 0, '하코네를 고르면 온천 관심도가 역산된다', `onsen:${inferred.onsen}`);
}

/* ── 4. 실제 도쿄 데이터 — 있을 때만 ────────────────────────────────── */
{
  const { readFile } = await import('node:fs/promises');
  const { existsSync } = await import('node:fs');
  const root = new URL('../public/data/japan/', import.meta.url);
  if (existsSync(root)) {
    console.log('\n■ 실제 도쿄 데이터 — 4박 5일');
    const idx = JSON.parse(await readFile(new URL('index.json', root), 'utf8'));
    setCountryTransit(idx.transfer ?? {}, idx.links ?? []);
    const { coursesFor, defaultCityDays } = await import('../src/lib/course.ts');
    const R = (s) => idx.cities.find((c) => c.slug === s);
    const slugs = ['asakusa', 'ueno', 'shinjuku', 'shibuya', 'ginza', 'hakone', 'kamakura'];
    const sel = idx.cities.filter((c) => expandDistrictScope(slugs, idx.cities).includes(c.slug));
    check(sel.some((c) => c.slug === 'tokyo'), '지역을 고르면 도쿄가 따라온다', sel.map((c) => c.name).join('·'));
    const themes = inferThemes(sel.filter((c) => c.profile));
    const p = { ...prefs, themes };
    // 앱과 같게: 후보는 불러온 아이템 전부, 담은 것(별)은 보통 코스.
    const picked = [];
    const all = [];
    for (const c of sel) {
      if (c.itemCount === 0) continue;
      const items = JSON.parse(await readFile(new URL(`cities/${c.slug}.json`, root), 'utf8'));
      all.push(...items);
      const cs = coursesFor(c, items, p, sel);
      const course = cs.find((x) => x.id === 'normal') ?? cs[0];
      if (course) picked.push(...course.items);
    }
    check(picked.length > 20, '보통 코스로 담긴 것이 있다', `${picked.length}곳`);
    const it = buildItinerary(sel, picked, p, 'tokyo', 'tokyo', idx.cities);
    const line = it.stops.map((s) => `${s.city.name}${s.sleep ? `🛏${s.nights}` : ''}`).join(' → ');
    console.log(`    ${line}`);
    check(it.stops.filter((s) => s.sleep && s.city.tier === 'district').length === 0, '지역은 숙박지가 아니다');
    const hk = it.stops.find((s) => s.city.slug === 'hakone');
    check(!!hk && hk.sleep, '온천을 담은 하코네는 거기서 잔다', hk?.why ?? '');
    const km = it.stops.find((s) => s.city.slug === 'kamakura');
    check(!!km && !km.sleep, '가마쿠라는 당일치기', km?.why ?? '');
    const { plans, needDays, overflow } = buildPlans({
      items: all, itinerary: it, startDate: '2026-10-01', days: 5, prefs: p, priorities: pri(picked),
    });
    const plan = plans[1];
    for (const d of plan.days) {
      const segs = (d.segments ?? []).map((s) => `${R(s.city)?.name}${s.minutes ? s.minutes : ''}`).join('+');
      const names = d.entries.map((e) => `${e.startMin >= 0 ? '' : ''}${e.item.name}`).slice(0, 6).join(', ');
      console.log(`    ${d.dayIndex}일 [${segs || d.city}] 🛏${R(d.sleepAt ?? '')?.name ?? '-'} · ${d.entries.length}곳: ${names}`);
    }
    check(needDays <= 6, '4박 5일이 6일로 부풀지 않는다', `일정 ${needDays}일 · 넘침 ${overflow.length}`);
    const multi = plan.days.filter((d) => new Set((d.segments ?? []).map((s) => s.city)).size >= 2).length;
    check(multi >= 1, '한 날에 지역 둘 이상이 들어간다', `${multi}일`);
    check(plan.days.every((d) => d.entries.length > 0), '빈 날이 없다');
    check(plan.days.some((d) => d.entries.some((e) => e.slot === 'dinner')), '저녁이 있다');
    const korean = picked.filter((i) => /[가-힣]/.test(i.name)).length;
    check(korean / picked.length > 0.8, '담긴 것의 이름이 대부분 한국어다', `${korean}/${picked.length}`);
  }
}

console.log(fail === 0 ? '\n✓ 지역 등급 정상' : `\n✗ 실패 ${fail}건`);
process.exit(fail === 0 ? 0 : 1);
