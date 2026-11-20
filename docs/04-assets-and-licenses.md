# 04. Официальные источники и лицензии (научная история)

**Правило:** ни одного файла без известной лицензии. Каждый внешний файл → запись в
`video/src/videos/<slug>/footage.manifest.json` + подпись `credit` в кадре (музей, номер предмета) + строка в титрах.

**Порядок поиска:** видео со стоков → изображения из музеев/библиотек/архивов → Wikimedia/Openverse/стоки →
Google (вручную, CC) → собственная генерация (карты, схемы, 3D, ИИ с пометкой).

## 1. Видео
| Источник | Что брать | Лицензия |
|---|---|---|
| [Pexels Videos](https://www.pexels.com/videos/) | руины, пустыни, храмы, музейные залы, свитки, свечи, раскопки (общие планы) | Pexels License: коммерция, подпись не обязательна |
| [Pixabay Videos](https://pixabay.com/videos/) | то же | Pixabay Content License |
| [Wikimedia Commons](https://commons.wikimedia.org) (видео) | раскопки, памятники, музейные съёмки | у каждого файла (PD / CC BY / CC BY-SA) |
| [Internet Archive](https://archive.org) — Prelinger и public domain фильмы | архивная хроника XX века (экспедиции, открытия) | только помеченные Public Domain; проверять карточку |
| [NARA](https://catalog.archives.gov) (Национальный архив США) | архивная хроника, фото | работы федерального правительства США — public domain |

## 2. Изображения — музеи открытого доступа (основной источник артефактов)
| Музей | Лицензия | Как | Подпись |
|---|---|---|---|
| [The Met](https://www.metmuseum.org/art/collection) (Нью-Йорк) | **CC0** для Open Access (≈ 400 тыс. изображений) | `find_media.py --source met` (API без ключа) | «The Metropolitan Museum of Art, <номер>» |
| [Cleveland Museum of Art](https://www.clevelandart.org/open-access) | **CC0** для работ со статусом CC0 | `--source cleveland` (API без ключа) | «Cleveland Museum of Art, <номер>» |
| [Art Institute of Chicago](https://www.artic.edu/open-access) | **CC0** для public-domain работ | `--source artic` (API без ключа) | «Art Institute of Chicago, <номер>» |
| [Smithsonian Open Access](https://www.si.edu/openaccess) | **CC0** для помеченных CC0 | API (нужен бесплатный ключ api.data.gov) | «Smithsonian, <номер>» |
| [Rijksmuseum](https://www.rijksmuseum.nl/en/research/conduct-research/data) | public domain / CC0 | API (ключ) | «Rijksmuseum» |
| [Getty Open Content](https://www.getty.edu/projects/open-content-program/) | свободно (public domain) | вручную | «Getty Museum» |

## 3. Изображения — библиотеки и архивы (рукописи, книги, карты)
| Источник | Лицензия | Комментарий |
|---|---|---|
| [Library of Congress](https://www.loc.gov/free-to-use/) | «Free to Use and Reuse»: PD / нет известных прав | рукописи, карты, фото раскопок; права — по карточке |
| [Wikimedia Commons](https://commons.wikimedia.org) | PD / CC0 / CC BY (SA — с осторожностью) | огромный фонд фото артефактов и рукописей; `--source wikimedia` |
| [Openverse](https://openverse.org) | CC0 / CC BY | `--source openverse` |
| [Europeana](https://www.europeana.eu) | по полю `rights` каждого объекта: брать только PD / CC0 / CC BY | API с ключом; фильтр «Free re-use» |
| [Internet Archive](https://archive.org) — книги | только Public Domain (старые издания) | гравюры, старые карты, иллюстрации |

## ⚠️ Нельзя использовать в монетизируемых роликах (только по платной лицензии)
| Источник | Почему |
|---|---|
| **British Museum** | изображения CC BY-NC-SA — некоммерческая лицензия |
| **Gallica (BnF)** | коммерческое использование — по платной лицензии BnF |
| **Bodleian, e-codices, Vatican Library (DigiVatLib)** | как правило, некоммерческие условия |
| **Leon Levy Dead Sea Scrolls Digital Library** | собственные условия, коммерция — по запросу |
| Фотобанки (Getty Images, Alamy, Shutterstock) без покупки | водяные знаки, права не переданы |
Если нужен именно такой предмет — ищем его же на Wikimedia (часто есть PD-фото музея или CC-фото посетителя)
или рисуем схему/реконструкцию сами.

## 4. Данные и карты (для своей графики)
- Контуры материков, рек — [Natural Earth](https://www.naturalearthdata.com) (public domain).
- Древние места и координаты — [Pleiades](https://pleiades.stoa.org) (CC BY).
- Даты, атрибуции — музейные карточки предметов, научные статьи, энциклопедии (Britannica, Encyclopaedia Iranica,
  Oxford Classical Dictionary и т. п. — только как источник фактов, не картинок).

## 5. Google Картинки
Только вручную: Инструменты → Права на использование → **Лицензии Creative Commons**; открыть исходную страницу и
проверить лицензию (CC0 / CC BY / PD). Google API для поиска недоступен (`docs/08-api-keys.md`).

## 6. Собственная генерация
- Карты, хронологии, схемы, стратиграфия, «родословная текста» — своя графика (Remotion).
- 3D: монеты, сосуды, таблички, панорамы — `@remotion/three`; модели — только с лицензией (Sketchfab CC BY/CC0, Smithsonian 3D CC0).
- ИИ-иллюстрации (Gemini / Imagen / Veo, ключ — `docs/08-api-keys.md`): только реконструкции того, что нельзя
  сфотографировать (вид древнего города, процесс письма). В кадре — «Иллюстрация · ИИ»; нельзя генерировать
  «подлинные» артефакты, документы и портреты реальных людей «как будто фото».

## 7. Музыка и звуки
- `find_media.py search "…" --source openverse-audio` — уже отфильтровано на **CC0 / CC BY**.
- Приоритет: Freesound CC0 → CC BY → Jamendo CC BY (проверить Content ID перед публикацией).

## Что уже лежит в проекте
| Файл | Источник | Лицензия |
|---|---|---|
| `public/fonts/*` | Unbounded, Manrope — Google Fonts | SIL OFL |
| `public/audio/ambient.mp3`, `whoosh.wav`, `hit.wav` | синтезированы ffmpeg (`docs/05-tools.md`) | свои |
| `public/images/placeholder.jpg` | сгенерирован ffmpeg | свой (заглушка) |

## Сетевой доступ (облачная среда Claude Code)
Окружение **«Science History»** — открытые хосты:
```
collectionapi.metmuseum.org  images.metmuseum.org
openaccess-api.clevelandart.org  openaccess-cdn.clevelandart.org
api.artic.edu  www.artic.edu
www.loc.gov  tile.loc.gov
api.openverse.org  live.staticflickr.com  commons.wikimedia.org  upload.wikimedia.org
archive.org  cdn.freesound.org  prod-1.storage.jamendo.com
```
Pexels / Smithsonian / Europeana / Rijksmuseum — через ключи (`docs/08-api-keys.md`).
