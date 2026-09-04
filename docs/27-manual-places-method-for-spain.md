# 손으로 넣는 장소 — 일본에서 쓴 방법을 스페인에 옮기기 위한 요청서

스페인 세션에 그대로 건네는 문서다. 일본(도쿄) 작업에서 재방문 동네를 채우려고
만든 "이름 → 좌표 → 설명" 방식이 무엇이고, 실제로 얼마나 됐고, 스페인에 옮기려면
무엇을 바꿔야 하는지 적는다. 코드는 이 저장소(`Trip-planner-japan`)의
`pipeline/import-manual.mjs`, `pipeline/manual/`, `pipeline/collect.mjs` 에 있다.

---

## 1. 왜 필요했나

자동 출처(Wikivoyage·Wikidata)는 대표 명소 위주다. 재방문자가 가는 동네
(도쿄의 에비스·가구라자카·산겐자야)는 Wikivoyage 문서가 없거나 구(區) 문서를
나눠 써서 3~6개밖에 안 나왔다. 그런데 현지 사람이 쓰는 맛집 사이트(食べログ 등)는
약관상 후기·설명을 저장할 수 없다.

스페인도 같은 구조다. 마드리드의 라바피에스·차마르틴, 바르셀로나의 그라시아·
포블레노우, 세비야의 트리아나 같은 동네는 Wikivoyage 가 얇고, 현지인 사이트
(El Tenedor/TheFork, Guía Repsol, Tripadvisor, 11870)는 저장할 수 없다.

## 2. 방법 — 두 단계

**1단계: 이름만 모은다 (사람 또는 나).** 현지 산책·맛집 기사와 상점가·구청
공식 사이트에서 **가게 이름과 주소만** 뽑아 CSV 한 줄씩 적는다. 기사 문장은
저장하지 않는다. 이름과 주소는 사실이라 옮겨 적어도 된다.

**2단계: 스크립트가 좌표를 찾고, 설명은 사람이 쓴다.** 좌표는 세 단계로 찾는다.

| 순서 | 출처 | 라이선스 | 무엇을 찾나 |
|---|---|---|---|
| ① | Wikidata (`wbsearchentities` → P625) | CC0 | 명소·신사·공원·미술관 |
| ② | OSM Nominatim (이름으로) | ODbL | 가게·바·카페 |
| ③ | 주소 지오코더 (주소로) | 일본: 国土地理院 | 이름이 OSM 에 없는 가게 |

못 찾으면 **넣지 않고 알려 준다.** 좌표를 지어내지 않는다. 설명(summary·why·
caution)은 사람이 직접 쓴다.

### ②에서 배운 것 — Nominatim 은 아무거나 돌려준다

이름으로 물으면 비슷한 이름을 아무거나 준다. 도쿄에서 실제로 나온 오탐:

- 大将(고엔지 야키토리) → 大醤(네리마의 다른 가게, 8km 밖)
- three(찻집) → スリーエフ(편의점)
- REN(가죽 가게) → 특별양호노인홈 蔵前
- カフェ マメヒコ → カフェ ザ サン リブズ ヒア ("カフェ"만 맞음)
- もんじゃ 蔵 → 기치조지의 "もんじゃ"

그래서 결과를 두 가지로 거른다. `import-manual.mjs` 의 `sameName()`·`nearEnough()`.

1. **이름이 같은 가게인가.** 결과 이름에 찾던 이름(지점 표시·동네 이름을 뗀 것)이
   들어 있어야 한다. 동네 이름(高円寺)·업종 이름(カフェ, もんじゃ, bar)만 맞는 것은
   거른다.
2. **동네 안인가.** 동네 중심에서 반경 안이면 받고, 반경의 두 배까지는 결과 주소에
   동네 이름이 있을 때만 받는다(같은 이름의 다른 지점을 거르기 위해).

이 두 규칙을 넣기 전 108곳 중 12곳이 엉뚱한 곳이었고, 넣은 뒤 0곳이었다.

### ③에서 배운 것 — 주소가 있으면 거의 다 찾는다

가게 이름이 OSM 에 없는 것이 26곳(24%)이었다. 공식 사이트·안내 기사에서 주소를
찾아 적으니 25곳이 풀렸다. 일본은 Nominatim 이 주소를 丁目(동)까지만 풀어
쓸모가 없었고, 国土地理院 API 가 番地까지 풀어 줬다.

**스페인은 더 쉽다.** 이 컨테이너에서 확인했다:

```
Nominatim "Calle de la Cava Baja 35, Madrid"
  → 40.41209, -3.70967  "Casa Lucio, 35, Calle de la Cava Baja, …"   (번지 단위)
Nominatim "Casa Lucio Madrid"
  → 같은 좌표                                                        (이름으로도 됨)
CartoCiudad (IGN) "Calle de la Cava Baja 35, Madrid"
  → 40.41207, -3.70967  type: portal, portalNumber 35
```

OSM 이 스페인 도시의 번지를 대부분 갖고 있어 Nominatim 만으로 ③까지 된다.
IGN 의 CartoCiudad(`https://www.cartociudad.es/geocoder/api/geocoder/findJsonp`,
CC BY 4.0)를 예비로 두면 된다. 国土地理院 자리에 그것을 넣는다.

## 3. 결과 (일본, 이번 주)

| | 수 |
|---|---|
| 1단계에서 적은 이름 | 170 (동네 12곳 108 + 근교 7곳 62) |
| Wikidata 로 좌표 | 43 |
| Nominatim 이름으로 좌표 | 88 |
| 주소로 좌표 (国土地理院) | 36 |
| 못 찾음 | 3 (시골 주소) |
| 엉뚱한 곳에 찍힘 (거른 뒤) | 0 |

이름 하나에 좌표 찾기 2~5초, 170곳에 10분쯤. 설명 쓰기가 시간의 대부분이다.

## 4. 스페인에 옮기려면 바꿀 것

코드는 `--country` 로 나뉘어 있지만(`pipeline/manual/<country>/`,
`registry/<country>-manual.json`) 일본 값이 박힌 곳이 넷이다. `import-manual.mjs`:

| 줄 | 지금 | 스페인 |
|---|---|---|
| `locate()` 좌표 범위 `34~37.5N, 137.5~141.5E` (간토) | 일본만 | 나라별 bbox 로 (스페인 본토 `36~44N, -9.5~3.5E`, 발레아레스·카나리아 포함 여부는 등록부에 따라) |
| `nominatimOnce()` `countrycodes: 'jp'` | 일본만 | `'es'` |
| `PLACE_WORDS` (동네 이름 목록, 일본어·로마자) | 도쿄·근교 하드코딩 | 등록부 CITIES 의 slug·name·nameEn 과 `match` 낱말에서 자동으로 만들면 나라별 하드코딩이 없어진다 |
| `gsi()` 国土地理院 주소 검색 | 일본만 | 스페인은 Nominatim 주소 검색이 번지까지 되므로 `home.within` 제한을 풀고, 예비로 CartoCiudad |

`GENERIC` (업종 낱말: カフェ, bar, 神社 …)에 스페인 낱말을 더한다:
`bar, café, cafetería, restaurante, taberna, bodega, mercado, plaza, calle, iglesia, museo`.

등록부에는 동네마다 `radiusKm` 과 `match` (그 동네 이름의 스페인어·영어 표기)가
있어야 `nearEnough()` 가 일한다. 예: `{ slug: 'lavapies', radiusKm: 0.8,
match: ['Lavapiés', 'Lavapies', 'Embajadores'] }`.

CSV 열은 그대로 쓴다(`pipeline/manual/README.md`). `address` 열에는
"Calle de la Cava Baja 35, Madrid" 처럼 거리·번지·도시를 적는다.

## 5. 스페인의 1단계 출처 — 저장 가능 여부

| 출처 | 쓸 수 있나 | 비고 |
|---|---|---|
| Guía Repsol, TheFork, Tripadvisor, 11870, Google | 이름·주소만 | 후기·설명·평점 저장 불가 |
| Time Out Madrid/Barcelona, El País "Madrid" 섹션, Traveler.es 산책 기사 | 이름·주소만 | 일본의 さんたつ·るるぶ 에 해당 |
| 구청·시 관광청 (esmadrid.com, barcelonaturisme.com, visitasevilla.es) | 이름·주소·시간 | 공식 안내라 사실 정보는 옮겨도 된다 |
| Mercado 공식 사이트 (Mercado de San Miguel, La Boqueria) | 가게 목록 | 恵比寿横丁 공식 사이트처럼 점포 목록이 있다 |
| Wikidata, OSM, datos.madrid.es / opendata-ajuntament.barcelona.cat | 저장 가능 | CC0 / ODbL / CC BY |

## 6. 요청

스페인 세션에 이렇게 요청하면 된다:

> `Trip-planner-japan` 저장소의 `docs/27-manual-places-method-for-spain.md` 를 읽고,
> `pipeline/import-manual.mjs` 의 일본 고정값 네 곳(4절 표)을 나라별로 빼서
> 스페인에서 돌게 해 줘. 그 다음 마드리드·바르셀로나·세비야의 재방문 동네
> 두세 곳을 골라 1단계 이름 10개씩으로 시험해 보고, 오탐(엉뚱한 좌표)이
> 있는지 지도에서 확인해서 알려 줘. 설명은 직접 쓰고, 기사 문장은 옮기지 마.

먼저 확인할 것: 스페인 등록부에 `within`(도시 안의 동네)·`radiusKm`·`match` 가
있는지. 없으면 일본 등록부(`registry/japan.mjs` 의 nippori·ebisu 항목)를 본떠
동네 두세 개부터 넣는다.
