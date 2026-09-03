import type { City, ThemeId } from '../types';

export interface ThemeDef {
  id: ThemeId;
  label: string;
  icon: string;
  hint: string;
  /**
   * 나라에 따라 있을 수도 없을 수도 있는 테마.
   *
   * 2단계에서는 고른 도시에 실제로 그 테마가 있을 때만 묻는다 — 스페인
   * 여행자에게 온천 관심도를 묻는 것은 없는 것을 묻는 일이다.
   */
  optional?: boolean;
  /**
   * 그 자리에서 자야 하는 테마.
   *
   * 온천은 저녁에 탕에 들어가고 그대로 자는 것이라 당일치기로는 볼 수 없다.
   * 거점 판정이 이 값을 본다 — 온천을 담은 도시는 짐을 옮길 값어치가 있다.
   */
  stay?: boolean;
}

export const THEMES: ThemeDef[] = [
  { id: 'history',   label: '역사·유적',     icon: '🏛️', hint: '성당, 궁전, 로마 유적, 옛 시가지' },
  { id: 'art',       label: '예술·박물관',   icon: '🎨', hint: '미술관, 박물관, 공연' },
  { id: 'landmark',  label: '랜드마크·건축', icon: '🗼', hint: '전망대, 상징 건축물, 광장' },
  { id: 'nature',    label: '자연경관',      icon: '🌿', hint: '공원, 해변, 전망 포인트, 정원' },
  { id: 'food',      label: '미식',          icon: '🍽️', hint: '식당, 타파스, 시장 먹거리, 카페' },
  { id: 'nightlife', label: '나이트라이프',  icon: '🍷', hint: '바, 플라멩코, 라이브 음악' },
  { id: 'activity',  label: '액티비티',      icon: '🚴', hint: '투어, 하이킹, 해양 스포츠' },
  { id: 'shopping',  label: '쇼핑·시장',     icon: '🛍️', hint: '재래시장, 공예품, 편집숍' },
  { id: 'onsen',     label: '온천',          icon: '♨️', hint: '온천 마을, 료칸의 탕, 노천탕, 족욕', optional: true, stay: true },
];

export const THEME_LABEL = Object.fromEntries(THEMES.map((t) => [t.id, t.label])) as Record<ThemeId, string>;
export const THEME_ICON = Object.fromEntries(THEMES.map((t) => [t.id, t.icon])) as Record<ThemeId, string>;

/** 그 자리에서 자야 하는 테마들. */
export const STAY_THEMES = new Set<ThemeId>(THEMES.filter((t) => t.stay).map((t) => t.id));

/**
 * 이 도시들에게 물어볼 만한 테마.
 *
 * 기본 여덟은 언제나 묻고, 선택적인 테마(온천)는 고른 도시 중 한 곳이라도
 * 그 테마를 성격이나 아이템으로 갖고 있을 때만 묻는다.
 */
export function themesFor(cities: City[]): ThemeDef[] {
  return THEMES.filter((t) => !t.optional
    || cities.some((c) => (c.profile?.[t.id] ?? 0) > 0 || (c.themes?.[t.id] ?? 0) > 0));
}
