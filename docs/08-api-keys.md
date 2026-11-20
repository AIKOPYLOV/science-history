# 08. Ключи API и доступы

Ключи **никогда** не пишем в код, `.env`, конфиги и чат. В облачной среде Claude Code ключ сохраняется
как «network secret» окружения **Science History** (агент показывает защищённую форму, либо пользователь добавляет сам:
меню окружения → Edit → Network secrets). Прокси сам подставляет ключ в запросы к нужному хосту.

| Сервис | Для чего | Где взять | Как передаётся | Статус |
|---|---|---|---|---|
| **Gemini API** (Google AI Studio) | озвучка (Gemini TTS), ИИ-картинки (Imagen / Gemini Image), ИИ-видео (Veo) | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) → Create API key | заголовок `x-goog-api-key`, хост `generativelanguage.googleapis.com` | ⏳ нужен |
| **Pexels** | стоковые видео и фото (земные кадры) | [pexels.com/api](https://www.pexels.com/api/) → Your API Key (бесплатно) | заголовок `Authorization: <ключ>` **без** `Bearer`, хост `api.pexels.com` (+ `videos.pexels.com`, `images.pexels.com` для скачивания) | ⏳ нужен |
| Pixabay | стоки (дубль Pexels) | [pixabay.com/api/docs](https://pixabay.com/api/docs/) | ключ в URL (`?key=`) — прокси так не умеет, нужен был бы секрет в переменной окружения | ❌ не подключаем, Pexels + Openverse хватает |
| Google Custom Search | поиск по Google Images | — | — | ❌ API закрыт для новых пользователей (янв. 2026), отключается 01.01.2027 |
| Openverse | поиск CC-картинок (Flickr, Wikimedia, музеи) | ключ не нужен | — | ✅ работает |
| The Met / Cleveland / Art Institute of Chicago / LoC / Wikimedia / Openverse | артефакты, рукописи, карты (CC0/PD) | ключ не нужен | — | ✅ после настройки окружения |
| Smithsonian Open Access | артефакты CC0, 3D-модели | бесплатный ключ [api.data.gov](https://api.data.gov/signup/) | параметр `api_key` в URL — прокси так не умеет; добавлять как секрет окружения вручную | ⏳ по желанию |
| Europeana | рукописи и предметы из музеев Европы (фильтр PD/CC0/CC BY) | бесплатный ключ [pro.europeana.eu](https://pro.europeana.eu/pages/get-api) | заголовок `X-Api-Key`, хост `api.europeana.eu` | ⏳ по желанию |

## Google Images — как пользоваться без API
1. В Google Картинках: **Инструменты → Права на использование → Лицензии Creative Commons**.
2. Открыть картинку **на исходном сайте** и убедиться в лицензии (CC0 / CC BY / PD; не NC, не ND).
3. Передать агенту ссылку на страницу-источник → агент скачивает, записывает в манифест с `credit`.
Без подтверждённой лицензии картинку не используем, даже если «она у всех в интернете».
