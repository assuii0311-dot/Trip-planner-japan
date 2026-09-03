#!/usr/bin/env node
/**
 * 이름으로 Wikidata 항목을 찾아 QID·좌표·종류를 찍는다. 손으로 넣는 항목(extras)의
 * 좌표를 지어내지 않기 위한 도구다.  node pipeline/lookup-wd.mjs "Sensō-ji" "Ghibli Museum"
 */
const UA = 'trip-planner-pipeline/1.0 (https://github.com/assuii0311-dot/Trip-planner-japan)';
const API = 'https://www.wikidata.org/w/api.php';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(params) {
  const url = `${API}?${new URLSearchParams({ ...params, format: 'json' })}`;
  for (let i = 0; i < 5; i++) {
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    if (res.ok) return res.json();
    await sleep(2000 * (i + 1));
  }
  throw new Error('wikidata');
}
for (const q of process.argv.slice(2)) {
  const s = await get({ action: 'wbsearchentities', search: q, language: 'en', limit: '5', type: 'item' });
  const hits = s.search ?? [];
  const ids = hits.map((h) => h.id);
  if (!ids.length) { console.log(`${q}\tNOT FOUND`); continue; }
  const e = await get({ action: 'wbgetentities', ids: ids.join('|'), props: 'claims|labels|descriptions|sitelinks', languages: 'en|ko|ja' });
  for (const id of ids) {
    const ent = e.entities[id];
    const c = ent.claims?.P625?.[0]?.mainsnak?.datavalue?.value;
    if (!c) continue;
    const ko = ent.labels?.ko?.value ?? '';
    const ja = ent.labels?.ja?.value ?? '';
    const desc = ent.descriptions?.en?.value ?? '';
    const n = Object.keys(ent.sitelinks ?? {}).length;
    console.log(`${q}\t${id}\t${c.latitude.toFixed(5)}\t${c.longitude.toFixed(5)}\t${n}\t${ent.labels?.en?.value ?? ''}\t${ko}\t${ja}\t${desc}`);
    break;
  }
  await sleep(400);
}
