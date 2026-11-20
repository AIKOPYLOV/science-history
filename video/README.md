# Science History Video — Remotion-проект

Правила работы — в [`../AGENTS.md`](../AGENTS.md) и [`../docs/`](../docs). Здесь только устройство проекта.

## Команды

```bash
npm install
npm run studio                          # предпросмотр с таймлайном
npm run typecheck                       # проверка типов (0 ошибок обязательно)
scripts/stills.sh <Composition> 90 400  # контрольные кадры → out/stills/
scripts/render.sh <Composition> <slug>  # рендер + мастеринг −14 LUFS + QC монтажа → out/<slug>.mp4
python3 scripts/find_media.py search "<запрос>" --source met         # артефакты The Met (CC0)
python3 scripts/find_media.py search "<запрос>" --source cleveland   # Cleveland Museum of Art (CC0)
python3 scripts/find_media.py search "<запрос>" --source artic       # Art Institute of Chicago (CC0)
python3 scripts/find_media.py search "<запрос>" --source openverse-audio   # музыка CC0/CC BY
python3 scripts/beats.py public/audio/<трек>.mp3 --total 60          # склейки в бит
```

## Структура

| Путь | Что там |
|---|---|
| `src/Root.tsx` | Регистрация всех роликов (`<Composition>`), 1920×1080, 30 fps |
| `src/theme.ts` | Палитра («пергамент, золото, камень»), локальные шрифты, кривые анимации |
| `src/components/ui.tsx` | `RevealText`, `Counter`, `Overline`, `Backdrop`, `SceneFade`, `Grain`, `Vignette`, `LightLeakOverlay` |
| `src/templates/` | Сцены-шаблоны `title`, `footage`, `stat`, `stats`, `bars`, `endCard`, `custom` и сборка ролика из конфига |
| `src/videos/_template/` | **Стартовый конфиг** нового ролика (с заглушками) |
| `public/footage`, `public/images`, `public/fonts`, `public/audio` | Ассеты (все локальные) |
| `scripts/` | `render.sh`, `stills.sh`, `qc_shots.py`, `beats.py`, `transcribe.py`, `find_media.py` |

## Ролики

| Composition | Длительность | Описание |
|---|---|---|
| `Template` | 60 с | Демонстрация сцен-шаблонов; материалы — заглушки |
