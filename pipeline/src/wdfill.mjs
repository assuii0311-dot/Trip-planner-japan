/**
 * 위키데이터 항목이 없는 볼거리에 이름으로 항목을 붙인다.
 *
 * Wikivoyage 리스팅의 절반 넘게 wikidata 인자가 비어 있다(일본 볼거리 129곳,
 * 스페인은 더 많다). 항목이 없으면 명성(언어판 수)을 못 재서 popularity 가
 * 기본값 2 로 떨어지고, 순위에서 '모르는 곳' 으로 남는다. 가미나리몬·호조몬
 * 같은 곳은 항목이 있는데 리스팅에 안 적혀 있을 뿐이다.
 *
 * 이름으로 찾되 두 가지를 확인한 것만 붙인다 — 좌표가 도시 반경 안인가,
 * 항목 이름(영어·현지어)이 찾던 이름과 같은가. 식당·술집·가게는 찾지 않는다.
 * 있어도 언어판이 1~2개라 재는 의미가 없고, 동명이인 가게를 붙일 위험이 크다.
 *
 * Wikidata 는 CC0 라 QID·좌표·언어판 수를 저장해도 된다.
 */
import { getJSON } from './wv.mjs';

const WD_API = 'https://www.wikidata.org/w/api.php';
const SKIP_THEMES = new Set(['food', 'nightlife', 'shopping']);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const norm = (s) => String(s ?? '').toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '')
  .replace(/[\s\-‐‑–—'’"“”.,()（）・]/g, '').replace(/髙/g, '高');

const km = (a, b) => {
  const r = Math.PI / 180;
  const h = Math.sin(((b.lat - a.lat) * r) / 2) ** 2
    + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(((b.lon - a.lon) * r) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
};

/** 항목 이름이 찾던 이름과 같은가. 앞뒤가 붙은 정도('Kaminarimon' ⊂ 'Kaminarimon Gate')는 허용. */
function sameName(labels, names) {
  const ls = labels.map(norm).filter((l) => l.length >= 3);
  const ns = names.map(norm).filter((n) => n.length >= 3);
  return ls.some((l) => ns.some((n) => l === n || l.includes(n) || n.includes(l)));
}

/**
 * @param items  도시의 리스팅. wikidata 가 비고 볼거리인 것만 본다.
 * @param city   { lat, lon, radiusKm?, within? }
 * @returns { [itemId]: { qid, sitelinks, lat, lon } }
 */
export async function fillWikidata(items, city, lang = 'en') {
  const out = {};
  const reach = city.within ? Math.max(2 * (city.radiusKm ?? 1), 2) : Math.max(2 * (city.radiusKm ?? 4), 8);
  const todo = items.filter((it) => !it.wikidata && !SKIP_THEMES.has(it.theme) && it.name);
  for (const it of todo) {
    const names = [it.name, it.nameLocal].filter(Boolean);
    let hit = null;
    for (const [q, l] of [[it.name, lang], [it.nameLocal, null]]) {
      if (!q) continue;
      const s = await getJSON(WD_API, { action: 'wbsearchentities', search: q, language: l ?? 'ja', limit: '5', type: 'item' });
      const ids = (s.search ?? []).map((h) => h.id);
      if (!ids.length) continue;
      const e = await getJSON(WD_API, { action: 'wbgetentities', ids: ids.join('|'), props: 'claims|labels|sitelinks', languages: 'en|ja|es|ko' });
      for (const id of ids) {
        const ent = e.entities?.[id];
        const c = ent?.claims?.P625?.[0]?.mainsnak?.datavalue?.value;
        if (!c) continue;
        if (km(city, { lat: c.latitude, lon: c.longitude }) > reach) continue;
        const labels = Object.values(ent.labels ?? {}).map((x) => x.value);
        if (!sameName(labels, names)) continue;
        hit = { qid: id, sitelinks: Object.keys(ent.sitelinks ?? {}).length, lat: +c.latitude.toFixed(5), lon: +c.longitude.toFixed(5) };
        break;
      }
      if (hit) break;
      await sleep(300);
    }
    if (hit) out[it.id] = hit;
    await sleep(300);
  }
  return out;
}

/**
 * 언어판 수 → popularity. enrich.popularityByWikidata 와 같은 눈금이되 바닥이 2 다.
 * 여기서 붙는 것은 Wikivoyage 에 실려 있고 도시 반경 안에서 이름이 맞은 볼거리다.
 * 언어판이 일본어·영어 둘뿐인 것(히쓰지야마 공원)을 1 로 두면 항목을 붙인 쪽이
 * 못 붙인 쪽(기본값 2)보다 낮아지는 역설이 생긴다.
 */
export const bucketOf = (n) => (n >= 40 ? 5 : n >= 18 ? 4 : n >= 7 ? 3 : 2);
