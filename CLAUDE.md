@AGENTS.md

## Дополнительно для Claude Code

- Remotion skills лежат в `.claude/skills/` — перед написанием сцен загружай `remotion-best-practices`
  (или узкий skill: `remotion-markup`, `remotion-captions`, `remotion-render`, `remotion-maps` — карты древнего мира),
  перед анимацией — `motion-design`.
- В облачной сессии Claude Code браузер для рендера уже есть: `scripts/render.sh` и `scripts/stills.sh`
  сами подставляют путь к headless Chromium.
- Для репозитория создано облачное окружение **«Science History»** с открытыми сайтами музеев, библиотек и стоков
  (список — `docs/04-assets-and-licenses.md`, раздел «Сетевой доступ»). Запускай сессии в нём. Если материал не
  качается — проверь окружение или попроси пользователя разрешить хост, а не подменяй материал заглушкой.
