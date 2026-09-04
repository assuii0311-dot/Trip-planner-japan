#!/usr/bin/env node
/**
 * 손으로 적은 표(pipeline/manual/<country>/*.csv)를 등록부 데이터로 바꾼다.
 *
 *   node pipeline/import-manual.mjs japan
 *
 * - districts.csv → 동네(지역·근교). 좌표가 비었으면 Wikidata 에서 찾는다.
 * - items.csv     → 장소. 좌표가 비었으면 Wikidata 에서 찾고, 못 찾으면 빼고 알린다.
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

const read = async (f) => parseCsv(await readFile(new URL(f, dir), 'utf8').catch(() => ''));
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
const I_HEAD = ['city', 'name', 'nameEn', 'nameLocal', 'theme', 'durationMin', 'priceJpy', 'summary', 'why', 'caution', 'booking', 'busy', 'closed', 'hours', 'tags', 'lat', 'lon', 'wikidata', 'popularity'];
const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 48);
const items = [];
for (const r of itemsRaw) {
  if (!r.city || !r.name) continue;
  if (!THEME_ORDER.includes(r.theme)) { problems.push(`장소 ${r.name}: theme 이 잘못됐습니다 (${r.theme})`); continue; }
  if (!r.lat || !r.lon) {
    const hit = (await locate(r.nameEn)) ?? (await locate(r.nameLocal, 'ja'));
    if (hit) {
      r.lat = String(hit.lat); r.lon = String(hit.lon); r.wikidata = r.wikidata || hit.qid;
      if (!r.popularity) r.popularity = String(hit.sitelinks >= 18 ? 4 : hit.sitelinks >= 7 ? 3 : 2);
      console.log(`  ${r.name}: 좌표 ← Wikidata ${hit.qid}`);
    } else { problems.push(`장소 ${r.name}: 좌표를 못 찾았습니다. 지도에서 lat/lon 을 읽어 적어 주세요`); continue; }
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
