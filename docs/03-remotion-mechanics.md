# 03. Механика Remotion: технические правила и грабли

Версии: Remotion **4.0.545** (все пакеты `@remotion/*` — строго одной версии), React 19, three 0.187,
@react-three/fiber 9. Официальные правила — в `.claude/skills/remotion-*` (загружай перед работой).

## Детерминизм
- Всё анимируется **только** от `useCurrentFrame()` (+ `interpolate`, `spring`). Кадр N должен рендериться
  одинаково в любом порядке — Remotion рендерит кадры параллельно в нескольких вкладках.
- Запрещено: `useFrame()` из R3F, CSS `transition`/`animation`, `setTimeout`, `Math.random()` без сида,
  `Date.now()`. Шум/зерно — с сидом от номера кадра (`seed={frame % 97}`).
- Шейдеры получают время через uniform (`uTime = frame / fps`), сами не анимируются.

## Загрузка ресурсов
- Всё из `public/` через `staticFile('path')`.
- Любая асинхронная загрузка — внутри `delayRender()` / `continueRender()`.
- **Текстуры Three.js (если используешь 3D):** грузить ДО монтирования `<ThreeCanvas>` и рендерить канвас только
  когда текстура готова — иначе первый кадр снимается без текстуры (грабля из проекта Kosmos, см. его `Planets.tsx`).
- **Шрифты:** только локальные woff2 + `FontFace` в `theme.ts`. `@remotion/google-fonts` не используем:
  в облачной среде Chromium не доверяет сертификату прокси, шрифты не грузятся, рендер падает по таймауту.
- Футаж: `<OffthreadVideo muted>` (точный покадровый рендер), начало исходника — `trimBefore` (в кадрах).

## Three.js в Remotion (`@remotion/three`)
- 3D только внутри `<ThreeCanvas width height camera>`; у `<Sequence>` внутри канваса — `layout="none"`.
- Освещение задаём явно (`directionalLight` + слабый `ambientLight`).
- 3D в этом канале — для монет, сосудов, табличек и глобуса с картой (модели — только с лицензией). Образец кода — `Planets.tsx` в Kosmos.
  Атмосфера — задние грани оболочки ×1.09 с аддитивным смешиванием, яркость падает к внешнему краю.
- Пересчёт 3D → экран для подписей: `halfW = tan(fov/2) · z · (16/9)`, `x_px = 960 + x/halfW · 960`.

## Композиция
- Сцены идут в `<TransitionSeries>`; вспышки — `<TransitionSeries.Overlay>` (не съедают длительность,
  поэтому длина ролика = сумма длительностей сцен).
- Звук: `<Audio>` из `remotion`, эффекты — в `<Sequence from=… durationInFrames=…>`.
- Внутри `AbsoluteFill` нельзя задавать `left/right` для отступов (он растянут на 100%) — используй обычный
  `div` с `position: absolute` или `padding`. (Ещё одна грабля: колонка уезжала за край кадра.)
- Длинные строки заголовков разбивай на несколько `RevealText` вручную — автоперенос может оставить висячее слово.

## Эффекты (`@remotion/effects`)
- `lightLeak()` на `<Solid>` — для склеек. Требует WebGL: в `remotion.config.ts` стоит
  `Config.setChromiumOpenGlRenderer('angle')`.
- Другие полезные: `vignette`, `noise`, `chromaticAberration`, `zoomBlur`, `glow`, `lut` (см. skill `remotion-markup/effects.md`).

## Рендер
- Облачная среда Claude Code: браузер `/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell`
  (скрипты `scripts/*.sh` подставляют его сами через `REMOTION_BROWSER`).
- Локально Remotion сам скачает свой Chromium — переменная не нужна.
- Кодек H.264, CRF 18, yuv420p, JPEG-кадры качества 92 (`remotion.config.ts`).
- `--concurrency=4` на 4 ядрах; 1800 кадров ≈ 5–7 мин.

## Чек-лист перед коммитом кода
- [ ] `npx tsc -p .` — 0 ошибок
- [ ] Нет `useFrame`, `Math.random`, CSS-анимаций
- [ ] Все ассеты локальные и есть в манифесте
- [ ] Контрольные кадры просмотрены
