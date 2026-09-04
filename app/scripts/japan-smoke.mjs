/**
 * 일본(도쿄) 5단계 통과 검사 — 스페인 smoke 와 같은 흐름, 도쿄 모델의 요점만 본다.
 *   npx tsx scripts/japan-smoke.mjs [base-url]
 */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';

const base = process.argv[2] ?? 'http://localhost:4300/0829_kos_basic_001/japan/';
const outDir = new URL('../../pipeline/out/shots/japan/', import.meta.url);
await mkdir(outDir, { recursive: true });
const executablePath = process.env.PLAYWRIGHT_CHROMIUM ?? '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const browser = await chromium.launch({ executablePath, args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const errors = [];
page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`));
page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) errors.push(`console: ${m.text()}`); });

let fail = 0;
const check = (ok, label, detail = '') => { console.log(`  ${ok ? '✓' : '✗'} ${label}${detail ? ` — ${detail}` : ''}`); if (!ok) fail++; };
const shot = async (name) => { await page.waitForTimeout(400); await page.screenshot({ path: new URL(`${name}.png`, outDir).pathname }); };
const next = async (n) => {
  await page.getByRole('button', { name: /^(다음|계획 세우기|이 계획으로 진행)$/ }).click();
  await page.waitForTimeout(800);
  const label = await page.locator('.step-label span').first().innerText();
  if (!label.startsWith(String(n))) throw new Error(`expected step ${n}, got "${label}"`);
};

console.log(`japan smoke → ${base}`);
await page.goto(base, { waitUntil: 'domcontentloaded' });
await page.waitForSelector('.theme-head', { timeout: 20000 });

// 1단계 — 도쿄 시내 지역 셋과 근교 하코네.
console.log('■ 1단계');
check(!(await page.locator('.city-main', { hasText: /^도쿄$/ }).count()), '껍데기 도시(도쿄) 카드가 없다');
/** 권역을 연다. 첫 권역은 기본으로 열려 있어 누르면 닫힌다. */
const openRegion = async (re) => {
  const b = page.getByRole('button', { name: re }).first();
  if ((await b.getAttribute('aria-expanded')) !== 'true') { await b.click(); await page.waitForTimeout(300); }
};
await openRegion(/도쿄 시내/);
for (const c of ['아사쿠사', '우에노', '신주쿠']) {
  await page.locator('.city-main', { hasText: c }).first().click();
  await page.waitForTimeout(200);
}
await openRegion(/도쿄 근교/);
await page.locator('.city-main', { hasText: '하코네' }).first().click();
await page.waitForSelector('.base-group', { timeout: 15000 });
const route = await page.locator('.route li').allInnerTexts();
console.log(`    ${route.map((r) => r.replace(/\s+/g, ' ')).join(' | ')}`);
check(route.some((r) => /도쿄/.test(r) && /박/.test(r)), '지역을 고르면 도쿄가 숙박지로 따라온다');
check(route.filter((r) => /(아사쿠사|우에노|신주쿠)/.test(r)).every((r) => /도쿄 안/.test(r)), '지역은 "도쿄 안" 으로 표시되고 숙박지가 아니다');
const label1 = await page.locator('main').innerText();
check(/일본 첫날/.test(label1) && !/스페인/.test(label1), '1단계 문구가 일본 기준이다');
check(/하네다|나리타/.test(label1), '도쿄 공항 목록이 나온다');
await shot('step1');
await next(2);

console.log('■ 2단계');
await page.waitForSelector('.theme-row');
const rows = await page.locator('.theme-row .name').allInnerTexts();
check(rows.some((r) => /온천/.test(r)), '하코네를 골랐으니 온천 관심도를 묻는다', rows.map((r) => r.trim()).join(', '));
await shot('step2');
await next(3);

console.log('■ 3단계');
await page.waitForSelector('.course', { timeout: 20000 });
const heads = await page.locator('main > .theme-group > .city-head > .theme-head').allInnerTexts();
check(!heads.some((h) => /^도쿄\b/.test(h.trim())), '3단계에 도쿄 껍데기 묶음이 없다', heads.map((h) => h.replace(/\s+/g, ' ').trim()).join(' / '));
check(heads.some((h) => /지하철로/.test(h)), '지역은 "지하철로" 표시');
await page.locator('.bulk-btn', { hasText: '보통' }).click();
await page.waitForTimeout(1500);
const sum = (await page.locator('main').innerText()).match(/(\d+)곳 선택 · 볼거리 ([\d.]+)일치[^\n]*일정 (\d+)일/);
check(!!sum && Number(sum[3]) <= 6, '지역 셋 + 하코네 보통 코스가 6일 안이다', sum?.[0] ?? '못 찾음');
await shot('step3');
await next(4);

console.log('■ 4단계');
await page.waitForSelector('.plan-tab', { timeout: 30000 });
const sleeps = await page.locator('.day-sleep').allInnerTexts();
check(sleeps.length > 0 && sleeps.every((s) => /도쿄|하코네/.test(s)), '자는 곳은 도쿄 아니면 하코네', [...new Set(sleeps.map((s) => s.trim()))].join(' / '));
check(!sleeps.some((s) => /(아사쿠사|우에노|신주쿠)/.test(s)), '지역에서 자는 날이 없다');
const segHeads = await page.locator('.seg-head').count();
check(segHeads > 0, '구간 머리줄이 선다', `${segHeads}개`);
const segMoves = await page.locator('.seg-head .seg-move').allInnerTexts();
check(segMoves.some((m) => /지하철/.test(m) && /문앞~문앞/.test(m)), '지역 간 이동이 머리줄에 지하철·문앞~문앞으로 적힌다', segMoves[0] ?? '');
const routes = await page.locator('.travel-route').allInnerTexts();
check(!routes.some((r) => /(아사쿠사|우에노|신주쿠)/.test(r)), '지역으로 가는 지하철에는 큰 이동 블록이 없다', routes.join(' | ') || '블록 없음');
check(routes.some((r) => /하코네/.test(r)), '도쿄→하코네에는 이동 블록이 있다');
const meta = (await page.locator('.travel-meta').allInnerTexts()).join(' ');
check(!/Renfe/.test(meta), '일본 화면에 Renfe 가 없다');
const dinners = await page.locator('.entry .slot', { hasText: '저녁 식사' }).count();
check(dinners > 0, '저녁 식사가 있다', `${dinners}끼`);
const times = await page.locator('.entry').filter({ has: page.locator('.slot', { hasText: '저녁 식사' }) }).locator('.time').allInnerTexts();
check(times.every((t) => Number(t.slice(0, 2)) < 21), '저녁이 21시 전이다(일본 식사 시간)', times.join(', '));
const itin = await page.locator('.itin-state').allInnerTexts();
check(itin.some((s) => /도쿄 안 · 숙소에서/.test(s)), '동선 바에서 지역은 "도쿄 안 · 숙소에서 N분"');
check((await page.locator('.itin-row', { hasText: '아사쿠사' }).locator('.itin-swap').count()) === 0, '지역에는 짐 옮기기 단추가 없다');
await shot('step4');
await next(5);

console.log('■ 5단계');
await page.waitForSelector('.trip-map', { timeout: 20000 });
const mapCities = await page.$$eval('.map-name', (els) => els.map((e) => e.textContent));
check(mapCities.length >= 2, '지도에 도시가 있다', mapCities.join(' · '));
check((await page.locator('.map-land path').count()) > 0, '일본 국경선이 그려진다');
const guide = await page.locator('main').innerText();
check(/일본 여행 공통 안내/.test(guide) && !/스페인 여행 공통 안내/.test(guide), '공통 안내가 일본 것이다');
await shot('step5');

await browser.close();
if (errors.length) { console.error(`\n브라우저 오류 ${errors.length}건:\n  ${errors.slice(0, 5).join('\n  ')}`); fail++; }
console.log(fail === 0 ? '\n✓ 일본 5단계 통과' : `\n✗ 실패 ${fail}건`);
process.exit(fail ? 1 : 0);
