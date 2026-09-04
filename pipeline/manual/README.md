# 손으로 넣는 동네와 장소

자동으로 긁어 올 수 있는 출처(Wikivoyage·Wikidata)는 대표 명소 위주다.
닛포리·에비스처럼 재방문자가 가는 동네는 문서가 없거나 얇다. 그런 곳은
사람이 표에 적고, 스크립트가 데이터로 바꾼다.

```
pipeline/manual/japan/districts.csv   동네(지역·근교 도시) 한 줄씩
pipeline/manual/japan/items.csv       장소 한 줄씩
node pipeline/import-manual.mjs japan # 좌표 확인 → registry/japan-manual.json
node pipeline/collect.mjs japan       # 데이터 생성 (수동 항목이 합쳐진다)
```

`_example-*.csv` 에 채운 예가 있다. 첫 줄(머리)은 지우지 않는다. 엑셀·구글
시트에서 열어 쓰고 CSV(UTF-8)로 저장하면 된다.

## districts.csv

| 열 | 뜻 | 예 |
|---|---|---|
| slug | 로마자·소문자·하이픈. 한 번 정하면 바꾸기 번거롭다 | `nippori` |
| name / nameEn | 한국어 이름 / 영어 이름 | `닛포리·야네센` / `Nippori` |
| tier | `district`(도쿄 안의 지역) 또는 `city`(근교 도시) | `district` |
| within | 지역이면 속한 도시 slug. 근교면 비운다 | `tokyo` |
| region | 지역은 `도쿄`. 근교는 현 이름(가나가와·사이타마 …) | `도쿄` |
| lat / lon | 중심 좌표(역 앞). 비우면 nameEn 으로 Wikidata 에서 찾는다 | `35.7278` / `139.7708` |
| blurb | 카드 한 줄 소개 | |
| firstTimer | 처음 온 사람에게 권할 곳이면 1, 재방문용이면 0 | `0` |
| tags | 세미콜론으로 구분 | `재방문;골목` |
| profile | 테마 성격 0~3 아홉 개, 세미콜론. 순서: 역사;예술;랜드마크;자연;미식;밤;액티비티;쇼핑;온천 | `1;1;0;1;2;1;0;2;0` |
| wikivoyage | Wikivoyage 문서 제목이 있으면 세미콜론으로. 없으면 비운다 | `Tokyo/Sumida` |
| links | 다른 곳까지 **역~역** 분. `slug:분` 을 세미콜론으로 | `ueno:4;tokyo:11` |

## items.csv

| 열 | 뜻 |
|---|---|
| city | 어느 동네 slug 인가 (districts.csv 또는 기존 등록부의 slug) |
| name / nameEn / nameLocal | 한국어 / 영어 / 일본어 이름 |
| theme | history · art · landmark · nature · food · nightlife · activity · shopping · onsen |
| durationMin | 머무는 시간(분) |
| priceJpy | 1인 요금(엔). 무료 0, 모르면 비운다 |
| summary | 목록에서 보이는 한 줄(40자 안팎) |
| why | 왜 가는가. 두세 문장 |
| caution / booking / busy / closed / hours | 있을 때만 |
| tags | 2단계 취향과 맞추는 태그. 음식: sushi noodle izakaya comfort fine street cafe bar local seafood vegetarian · 쇼핑: department variety otaku select craft street · 그 밖에 자유(재방문, 벚꽃 …) |
| lat / lon | 비우면 nameEn(없으면 nameLocal)으로 Wikidata 에서 찾는다. **못 찾으면 넣지 않고 알려 준다** — 좌표를 지어내지 않는다 |
| wikidata | 알면 QID. 비우면 찾는다 |
| popularity | 1(숨은 곳)~5(누구나 아는 곳). 비우면 3 |

## 원칙

- 좌표 없는 장소는 데이터에 들어가지 않는다. 찾지 못했다고 나오면 지도에서
  좌표를 읽어 lat/lon 에 적는다. 그 표시(wikidata 비움)가 곧 '사람이 확인한 값' 이다.
- OSM 결과는 이름이 같은 가게이고 동네 반경 안일 때만 받는다. 비슷한 이름의
  딴 가게(大将 → 大醤)나 동네 이름만 맞는 것(高円寺)은 거른다. 그래서
  nameLocal 은 간판 그대로 적는 것이 좋다 — 지점 표시(本店·恵比寿店)는 떼고 찾는다.
- 설명은 사람이 쓴다. 타베로그·블로그·유튜브를 읽고 옮기는 것은 되지만
  문장을 그대로 베끼면 안 된다.
- `import-manual.mjs` 는 몇 번 돌려도 같다. 좌표를 찾은 것은 CSV 에 다시 써 두므로 다음에는 조회하지 않는다.
