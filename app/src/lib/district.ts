import type { City } from '../types';

/**
 * 도시 안의 지역.
 *
 * ## 왜 필요한가
 *
 * 스페인은 도시 사이를 옮겨 다닌다 — 마드리드에 묵고 세비야로 옮긴다.
 * 도쿄는 다르다. 4박 5일 내내 한 곳에 묵고 아사쿠사·우에노·신주쿠를
 * 돈다. 이 지역들을 스페인의 '도시' 로 넣고 돌려 보니 도쿄 안에서 호텔을
 * 다섯 번 옮기는 경로가 나왔고, 숙소를 억지로 고정하면 왕복이 부풀어
 * 4박 5일이 6일이 되었다(아사쿠사·우에노·긴자가 서로 6~17분 거리인데도
 * 각각 하루씩 먹었다).
 *
 * 그래서 등급을 둔다. `tier: 'district'` 는 **절대 독립 숙박지가 되지
 * 않고** `within` 도시의 숙소를 공유한다. 근교 도시(하코네·가마쿠라)는
 * 스페인의 근교와 같은 층이라 숙박이냐 당일치기냐를 엔진이 판단한다.
 *
 * 스페인 데이터에는 `tier` 가 없다 — 안 적으면 'city' 다.
 */

export const isDistrict = (c: City): boolean => c.tier === 'district' && !!c.within;

/** 이 도시의 숙소가 있는 도시. 지역이면 `within`, 아니면 자기 자신. */
export const homeOf = (c: City): string => (isDistrict(c) ? c.within! : c.slug);

/** 이 여행에 지역이 딸린 도시인가 — 그 도시는 지역들의 숙소이므로 언제나 거점이다. */
export const hasDistricts = (c: City, trip: City[]): boolean =>
  trip.some((d) => isDistrict(d) && d.within === c.slug);

/**
 * 지역을 골랐으면 그 지역이 속한 도시도 여행에 들어간다.
 *
 * 아사쿠사와 우에노만 골라도 자는 곳은 도쿄다. 사용자가 '도쿄' 카드를
 * 따로 고르게 하지 않는다 — 지역을 고르는 순간 도시가 따라온다.
 */
export function expandDistrictScope(slugs: string[], cities: City[]): string[] {
  const byslug = new Map(cities.map((c) => [c.slug, c]));
  const want = new Set(slugs);
  for (const s of slugs) {
    const c = byslug.get(s);
    if (c && isDistrict(c) && byslug.has(c.within!)) want.add(c.within!);
  }
  return [...want];
}

/**
 * 1단계 목록에서 지역의 껍데기 도시는 뺀다.
 *
 * 도쿄는 잘 수 있는 곳이지만 그 자체로는 볼 것이 없다 — 볼 것은 전부
 * 지역에 있다. 카드로 보여 주면 골라도 아무것도 담기지 않는 도시가 된다.
 */
export function pickableCities(cities: City[]): City[] {
  const shells = new Set(cities.filter(isDistrict).map((c) => c.within!));
  return cities.filter((c) => !shells.has(c.slug));
}
