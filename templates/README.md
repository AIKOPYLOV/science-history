# Шаблоны

| Файл | Для чего | Куда копировать |
|---|---|---|
| `script.template.md` | Сценарий выпуска (front matter + сцены `## ММ:СС — …`) | `scripts/<тема>/<slug>.md` |
| `storyboard.template.md` | Раскадровка: сцена → тип → текст → футаж → данные → звук | `scripts/<тема>/<slug>.storyboard.md` |
| `footage.manifest.template.json` | Реестр всех внешних файлов с лицензиями | `video/src/videos/<slug>/footage.manifest.json` |
| `credits.template.md` | Титры источников для описания YouTube | `video/src/videos/<slug>/CREDITS.md` |
| `delivery-report.template.md` | Формат отчёта пользователю при сдаче | в ответ пользователю |

Шаблоны **кода** сцен лежат в `video/src/templates/` (title, footage, stats, bars, endCard),
стартовый конфиг ролика — `video/src/videos/_template/video.config.ts`.
