#!/usr/bin/env node
/**
 * 손으로 적은 표(pipeline/manual/<country>/*.csv)를 등록부 데이터로 바꾼다.
 *
 *   node pipeline/import-manual.mjs japan
 *
 * - districts.csv → 동네(지역·근교). 좌표가 비었으면 Wikidata 에서 찾는다.
 * - items.csv     → 장소. 좌표가 비었으면 Wikidata 에서 찾고, 못 찾으면 빼고 알린다.
 * - 좌표 찾는 순서: Wikidata(영문 → 일문) → OpenStreetMap Nominatim(일문 → 영문).
 *   명소는 Wikidata 에, 식당·술집·가게는 OSM 에 있다. 둘 다 ODbL/CC0 라 저장할 수 있다.
 * - 결과는 registry/<country>-manual.json. collect.mjs 가 읽어 합친다.
 * - 찾은 좌표는 CSV 에 다시 써 둔다. 다음 실행에서는 조회하지 않는다.
 */
import { readFile, writeFile } from 'node:fs/promises';

const country = process.argv[2] ?? 'japan';
const dir = new URL(`./manual/${country}/`, import.meta.url);
const UA = 'trip-planner-pipeline/1.0 (https://github.com/assuii0311-dot/Trip-planner-japan)';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** RFC 4180 에 맞춘 CSV 읽기. 따옴표 안의 쉼표·줄바꿈을 살린다. BOM 은 뗀다. */
function parseCsv(text) {
  const rows = [];
  let row = [], cell = '', q = false;
  const s = text.replace(/^﻿/, '');
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (q) {
      if (c === '"' && s[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') q = false;
      else cell += c;
    } else if (c === '"') q = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && s[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  if (cell.length || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows.filter((r) => r.some((x) => x.trim() !== ''));
  return body.map((r) => Object.fromEntries(head.map((h, i) => [h.trim(), (r[i] ?? '').trim()])));
}
const esc = (v) => (/[",\n]/.test(v ?? '') ? `"${String(v).replace(/"/g, '""')}"` : (v ?? ''));
function toCsv(head, rows) {
  return `﻿${head.join(',')}\n${rows.map((r) => head.map((h) => esc(r[h] ?? '')).join(',')).join('\n')}\n`;
}

async function wd(params) {
  const url = `https://www.wikidata.org/w/api.php?${new URLSearchParams({ ...params, format: 'json' })}`;
  for (let i = 0; i < 5; i++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.ok) return res.json();
    await sleep(2000 * (i + 1));
  }
  throw new Error('wikidata');
}
/** 이름으로 Wikidata 좌표를 찾는다. 도쿄 근처(위도 34~37, 경도 138~141)가 아니면 버린다. */
async function locate(name, lang = 'en') {
  if (!name) return null;
  const s = await wd({ action: 'wbsearchentities', search: name, language: lang, limit: '5', type: 'item' });
  const ids = (s.search ?? []).map((h) => h.id);
  if (!ids.length) return null;
  const e = await wd({ action: 'wbgetentities', ids: ids.join('|'), props: 'claims|sitelinks' });
  for (const id of ids) {
    const c = e.entities[id]?.claims?.P625?.[0]?.mainsnak?.datavalue?.value;
    if (!c) continue;
    if (c.latitude < 34 || c.latitude > 37.5 || c.longitude < 137.5 || c.longitude > 141.5) continue;
    return { qid: id, lat: +c.latitude.toFixed(5), lon: +c.longitude.toFixed(5), sitelinks: Object.keys(e.entities[id].sitelinks ?? {}).length };
  }
  return null;
}

/**
 * OpenStreetMap Nominatim — 이름으로 가게·장소를 찾는다.
 *
 * 식당과 술집은 Wikidata 에 없다. OSM 에는 대개 있다(도쿄는 특히 촘촘하다).
 * 이용 정책: 초당 1회, 식별 가능한 User-Agent. 도쿄권(간토) 안으로 좁혀
 * 같은 이름의 다른 도시 가게를 잡지 않게 한다.
 */
const norm = (v) => String(v ?? '').toLowerCase().replace(/[\s　・･'’"]/g, '').replace(/髙/g, '高');
const PLACE_WORDS = ['蔵前', '恵比寿', '高円寺', '神楽坂', '清澄白河', '自由が丘', '三軒茶屋', '月島', '両国', '赤坂', '巣鴨', '谷中', '根津', '駒形', '広尾', '東京', 'tokyo', 'ebisu', 'kuramae', 'kagurazaka', 'jiyugaoka', 'koenji', 'sangenjaya', 'ryogoku', 'akasaka', 'sugamo', 'tsukishima', 'kiyosumi-shirakawa', 'kiyosumi', 'nezu', 'yanaka', 'hiroo', 'komagata',
  '軽井沢', '中軽井沢', '熱海', '秩父', '長瀞', '小田原', '高尾', '高尾山', '川崎', '佐原', 'karuizawa', 'atami', 'chichibu', 'nagatoro', 'odawara', 'takao', 'kawasaki', 'sawara'];
const GENERIC = new Set(['もんじゃ', 'monja', 'ちゃんこ', 'chanko', 'カフェ', 'cafe', 'café', 'coffee', '珈琲', '神社', '公園', '商店街', '寺', '横丁', 'bar', 'バー', '本店', '支店', '店', 'shop', 'store', 'house', 'tokyo']);
const stripShop = (v) => v.replace(/(本店|支店|店)$/u, '');
/** 이 낱말만으로는 어느 가게인지 모른다 — 동네 이름, 업종 이름. */
const vague = (v) => { const n = norm(stripShop(v)); return !n || n.length < 2 || GENERIC.has(n) || PLACE_WORDS.includes(n); };
/** 동네 이름·지점 표시를 뗀 이름 변형들. "大将 本店" → 大将, "AFURI 恵比寿" → afuri. */
function variants(name) {
  if (!name) return [];
  const PLACE = `(${PLACE_WORDS.join('|')})`;
  const base = name.replace(/\s*(本店|支店|[^\s]*店|フラッグシップカフェ|ファクトリー＆カフェ.*|in la kagu)\s*$/u, '').trim();
  const out = new Set([name, base]);
  for (const b of [name, base]) {
    out.add(b.replace(new RegExp(`^${PLACE}\\s+`, 'iu'), '').replace(new RegExp(`\\s+${PLACE}$`, 'iu'), '').trim());
    const toks = b.split(/\s+/).filter(Boolean);
    if (toks.length > 1) {
      out.add(toks.slice(0, 2).join(' '));
      const latin = /^[\x00-\x7f]+$/.test(b);
      if ((latin && toks[0].length >= 4) || (!latin && toks[0].length >= 3)) out.add(toks[0]);
      const last = toks[toks.length - 1];
      if ((latin && last.length >= 4) || (!latin && last.length >= 2)) out.add(last);
    }
  }
  return [...out].filter((v) => !vague(v));
}
/** OSM 결과의 이름이 찾던 이름과 같은 가게인지. 앞뒤가 붙은 정도는 허용, 딴 가게는 거른다. */
function sameName(label, names) {
  const ln = norm(label.split(',')[0]);
  if (!ln || vague(ln)) return false;
  for (const v of names.flatMap(variants).map(norm)) {
    if (ln.includes(v)) return true;
    if (v.includes(ln)) return true;
  }
  return false;
}
const km = (a, b) => {
  const r = Math.PI / 180;
  const h = Math.sin(((b.lat - a.lat) * r) / 2) ** 2
    + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(((b.lon - a.lon) * r) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};
/**
 * 동네 중심에서 너무 멀면 딴 곳이다.
 *
 * 지역은 반경 안이면 받고, 반경의 두 배까지는 주소에 동네 이름(match 낱말)이
 * 있을 때만 받는다 — 같은 이름의 다른 지점(だるま 新川)을 거르기 위해서다.
 * 근교 도시는 반경의 두 배(최소 6km).
 */
function nearEnough(home, hit) {
  if (!home || !Number.isFinite(+home.lat)) return true;
  const d = km({ lat: +home.lat, lon: +home.lon }, hit);
  if (!home.within) return d <= Math.max(2 * (home.radiusKm ?? 3), 6);
  const r = home.radiusKm ?? 1;
  if (d <= r) return true;
  if (d > 2 * r) return false;
  const words = (home.match ?? []).map((w) => w.toLowerCase());
  const label = (hit.label ?? '').toLowerCase();
  return !hit.label || words.some((w) => label.includes(w));
}

/**
 * 国土地理院 주소 검색 — 번지까지 있는 일본 주소를 좌표로.
 *
 * Nominatim 은 도쿄 주소를 丁目까지만 푼다(蔵前4-20-4 → 蔵前四丁目 한가운데).
 * 지리원 API 는 番地·号까지 풀어 준다. 출처 표기 조건으로 쓸 수 있다
 * (国土地理院 地理院地図 API, 政府標準利用規約).
 */
async function gsi(address) {
  if (!address) return null;
  const url = `https://msearch.gsi.go.jp/address-search/AddressSearch?q=${encodeURIComponent(address)}`;
  await sleep(500);
  const res = await fetch(url, { headers: { 'User-Agent': UA } }).catch(() => null);
  if (!res?.ok) return null;
  const list = await res.json().catch(() => []);
  // 丁目 뒤에 番까지 풀린 것만 받는다. 동네 이름만 맞춘 결과는 정확하지 않다.
  const hit = list.find((f) => /番/.test(f.properties?.title ?? '') && f.geometry?.coordinates);
  if (!hit) return null;
  const [lon, lat] = hit.geometry.coordinates;
  return { lat: +lat.toFixed(5), lon: +lon.toFixed(5), osm: 'gsi', label: hit.properties.title };
}

async function nominatimOnce(q, near) {
  const box = near ? `${near.lon - 0.05},${near.lat + 0.04},${near.lon + 0.05},${near.lat - 0.04}` : '137.5,37.5,141.5,34.0';
  const url = `https://nominatim.openstreetmap.org/search?${new URLSearchParams({
    q, format: 'jsonv2', limit: '5', countrycodes: 'jp', viewbox: box, bounded: near ? '1' : '0',
  })}`;
  await sleep(1100);
  const res = await fetch(url, { headers: { 'User-Agent': UA, 'Accept-Language': 'ja,en' } });
  if (!res.ok) return [];
  return (await res.json()).map((hit) => ({
    lat: +Number(hit.lat).toFixed(5), lon: +Number(hit.lon).toFixed(5), osm: `${hit.osm_type}/${hit.osm_id}`, label: hit.display_name,
  }));
}
/**
 * OpenStreetMap Nominatim — 이름으로 가게·장소를 찾는다.
 *
 * 식당과 술집은 Wikidata 에 없다. OSM 에는 대개 있다(도쿄는 특히 촘촘하다).
 * 이용 정책: 초당 1회, 식별 가능한 User-Agent. 동네 중심 근처로 좁히고,
 * 이름을 여러 모양(지점 표시를 뗀 것, 앞 두 낱말 …)으로 물어본다.
 * Nominatim 은 비슷한 이름을 아무거나 돌려주므로(大将 → 大醤, three →
 * スリーエフ) 이름이 같은 가게인지, 동네 안인지 확인한 것만 받는다.
 */
async function nominatim(names, near) {
  const qs = [...new Set(names.flatMap(variants))];
  for (const q of qs) {
    for (const hit of await nominatimOnce(q, near)) {
      if (sameName(hit.label, names) && nearEnough(near, hit)) return hit;
    }
  }
  if (names[0]) {
    for (const hit of await nominatimOnce(`${names[0]} 東京`, null)) {
      if (sameName(hit.label, names) && nearEnough(near, hit)) return hit;
    }
  }
  return null;
}

const read = async (f) => parseCsv(await readFile(new URL(f, dir), 'utf8').catch(() => ''));
const registry = await import(`./registry/${country}.mjs`).catch(() => ({ CITIES: [] }));
const districtsRaw = await read('districts.csv');
const itemsRaw = await read('items.csv');
const problems = [];

// ── 동네 ────────────────────────────────────────────────────────────
const D_HEAD = ['slug', 'name', 'nameEn', 'tier', 'within', 'region', 'lat', 'lon', 'blurb', 'firstTimer', 'tags', 'profile', 'wikivoyage', 'links'];
const THEME_ORDER = ['history', 'art', 'landmark', 'nature', 'food', 'nightlife', 'activity', 'shopping', 'onsen'];
const districts = [];
for (const r of districtsRaw) {
  if (!r.slug) continue;
  if (!/^[a-z0-9-]+$/.test(r.slug)) { problems.push(`동네 ${r.slug}: slug 는 로마자 소문자·숫자·하이픈만`); continue; }
  if (!r.lat || !r.lon) {
    const hit = await locate(r.nameEn);
    if (hit) { r.lat = String(hit.lat); r.lon = String(hit.lon); console.log(`  ${r.slug}: 좌표 ← Wikidata ${hit.qid}`); }
    else { problems.push(`동네 ${r.slug}: 좌표를 못 찾았습니다. lat/lon 을 적어 주세요`); continue; }
    await sleep(400);
  }
  const prof = r.profile ? r.profile.split(';').map((x) => Number(x.trim())) : null;
  if (prof && prof.length !== 9) problems.push(`동네 ${r.slug}: profile 은 아홉 개여야 합니다 (${prof.length}개)`);
  districts.push({
    slug: r.slug, name: r.name, nameEn: r.nameEn,
    tier: r.tier === 'city' ? 'city' : 'district',
    within: r.tier === 'city' ? null : (r.within || 'tokyo'),
    region: r.region || '도쿄',
    lat: Number(r.lat), lon: Number(r.lon),
    blurb: r.blurb, firstTimer: r.firstTimer === '1',
    tags: r.tags ? r.tags.split(';').map((x) => x.trim()).filter(Boolean) : [],
    profile: prof && prof.length === 9 ? Object.fromEntries(THEME_ORDER.map((t, i) => [t, prof[i]])) : null,
    titles: r.wikivoyage ? r.wikivoyage.split(';').map((x) => x.trim()).filter(Boolean) : [],
    links: r.links ? r.links.split(';').map((x) => x.trim()).filter(Boolean).map((x) => {
      const [to, min] = x.split(':'); return { to: to.trim(), minutes: Number(min) };
    }) : [],
  });
}

// ── 장소 ────────────────────────────────────────────────────────────
const I_HEAD = ['city', 'name', 'nameEn', 'nameLocal', 'theme', 'durationMin', 'priceJpy', 'summary', 'why', 'caution', 'booking', 'busy', 'closed', 'hours', 'tags', 'address', 'lat', 'lon', 'wikidata', 'popularity'];
const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 48);
const items = [];
for (const r of itemsRaw) {
  if (!r.city || !r.name) continue;
  if (!THEME_ORDER.includes(r.theme)) { problems.push(`장소 ${r.name}: theme 이 잘못됐습니다 (${r.theme})`); continue; }
  if (!r.lat || !r.lon) {
    const home = districts.find((d) => d.slug === r.city) ?? registry.CITIES.find((c) => c.slug === r.city) ?? null;
    let hit = (await locate(r.nameEn)) ?? (await locate(r.nameLocal, 'ja'));
    if (hit && !nearEnough(home, hit)) { console.log(`  ${r.name}: Wikidata ${hit.qid} 는 동네 밖(${km({ lat: +home.lat, lon: +home.lon }, hit).toFixed(1)}km) — 버림`); hit = null; }
    if (hit) {
      r.lat = String(hit.lat); r.lon = String(hit.lon); r.wikidata = r.wikidata || hit.qid;
      if (!r.popularity) r.popularity = String(hit.sitelinks >= 18 ? 4 : hit.sitelinks >= 7 ? 3 : 2);
      console.log(`  ${r.name}: 좌표 ← Wikidata ${hit.qid}`);
    } else {
      // 가게는 Wikidata 에 없다. OSM 에서 동네 중심 근처로 좁혀 찾는다.
      let osm = await nominatim([r.nameLocal, r.nameEn].filter(Boolean), home);
      if (osm) console.log(`  ${r.name}: 좌표 ← OSM ${osm.osm} (${osm.label.slice(0, 40)})`);
      /*
       * 이름으로 못 찾으면 주소로 찾는다. 가게 이름은 OSM 에 없어도 번지는
       * 있다. 주소는 사실이라 공식 사이트·안내 기사에서 옮겨 적어도 된다.
       * 이름 확인은 건너뛰고 동네 안인지만 본다.
       */
      if (!osm && r.address) {
        const g = await gsi(r.address);
        // Nominatim 은 주소를 丁目까지만 푼다. 걸어 도는 도쿄 지역에서는 그 정도로도
        // 쓸 만하지만(몇백 m), 근교 도시에서는 大字 한가운데가 되어 버려 받지 않는다.
        osm = (g && nearEnough(home, g) ? g : null)
          ?? (home?.within ? (await nominatimOnce(r.address, home)).find((h) => nearEnough(home, h)) : null) ?? null;
        if (osm) console.log(`  ${r.name}: 좌표 ← 주소 ${r.address} → ${osm.osm === 'gsi' ? '地理院' : `OSM ${osm.osm}`} (${osm.label.slice(0, 40)})`);
      }
      if (osm) {
        r.lat = String(osm.lat); r.lon = String(osm.lon);
      } else { problems.push(`장소 ${r.name}: Wikidata·OSM 어디에도 없습니다. address 열에 주소를 적거나 지도에서 lat/lon 을 읽어 적어 주세요`); continue; }
    }
    await sleep(400);
  }
  const dur = Number(r.durationMin) || 60;
  const themeSlots = {
    food: ['lunch', 'dinner'], nightlife: ['evening', 'night'], onsen: ['afternoon', 'evening', 'night'],
    shopping: ['morning', 'afternoon', 'evening'], nature: ['morning', 'afternoon', 'evening'],
  };
  const durationText = (m) => (m < 60 ? `약 ${m}분` : m % 60 ? `약 ${Math.floor(m / 60)}시간 ${m % 60}분` : `약 ${m / 60}시간`);
  const jpy = r.priceJpy === '' ? null : Number(r.priceJpy);
  items.push({
    id: `${r.city}-${slugify(r.nameEn || r.name)}`,
    wikidata: r.wikidata || null, lat: Number(r.lat), lon: Number(r.lon),
    name: r.name, nameEn: r.nameEn || r.name, nameLocal: r.nameLocal || null, city: r.city,
    theme: r.theme, durationMin: dur, priceJpy: jpy,
    energy: r.theme === 'nature' || r.theme === 'activity' ? 3 : 1,
    popularity: Number(r.popularity) || 3,
    bestSlots: themeSlots[r.theme] ?? ['morning', 'afternoon'],
    indoor: !['nature', 'landmark', 'activity'].includes(r.theme),
    tags: r.tags ? r.tags.split(';').map((x) => x.trim()).filter(Boolean) : [],
    summary: r.summary, why: r.why,
    practical: {
      duration: durationText(dur),
      price: jpy === null ? null : jpy === 0 ? '무료' : `¥${jpy.toLocaleString('en-US')}`,
      booking: r.booking || null, busy: r.busy || null, closed: r.closed || null, hours: r.hours || null,
    },
    caution: r.caution || null,
  });
}

// 찾은 좌표를 CSV 에 되써 둔다.
if (districtsRaw.length) await writeFile(new URL('districts.csv', dir), toCsv(D_HEAD, districtsRaw));
if (itemsRaw.length) await writeFile(new URL('items.csv', dir), toCsv(I_HEAD, itemsRaw));

await writeFile(new URL(`./registry/${country}-manual.json`, import.meta.url),
  `${JSON.stringify({ districts, items }, null, 1)}\n`);

console.log(`\n동네 ${districts.length}곳 · 장소 ${items.length}곳 → registry/${country}-manual.json`);
if (problems.length) {
  console.log(`\n확인이 필요한 것 ${problems.length}건:`);
  for (const p of problems) console.log(`  - ${p}`);
  process.exitCode = 1;
}
