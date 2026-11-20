import type {VideoConfig} from '../../templates/types';

/**
 * ШАБЛОН РОЛИКА «стоки + инфографика».
 * Скопируй папку `_template` в `src/videos/<slug>/`, поменяй id и сцены, зарегистрируй в src/Root.tsx.
 *
 * ⚠️ footage ниже — ЗАГЛУШКИ (звёздное небо из public/textures). В реальном ролике
 * заменить на скачанные клипы из public/footage/ и вписать их в footage.manifest.json.
 * 30 fps: 30 кадров = 1 секунда.
 */
const PLACEHOLDER = {src: 'images/placeholder.jpg', kind: 'image', credit: 'ЗАГЛУШКА — заменить на сток'} as const;

export const templateConfig: VideoConfig = {
	id: 'template-demo',
	music: {src: 'audio/ambient.mp3', volume: 0.9},
	sfx: {whoosh: 'audio/whoosh.wav', hit: 'audio/hit.wav'},
	scenes: [
		{
			type: 'title',
			durationInFrames: 210,
			overline: 'Рубрика · подзаголовок',
			lines: [{text: 'Первая строка заголовка,'}, {text: 'вторая — с акцентом', accent: true}],
			subtitle: 'Одно предложение, которое цепляет зрителя.',
		},
		{
			type: 'footage',
			durationInFrames: 270,
			footage: {...PLACEHOLDER, zoom: [1.05, 1.18], panX: -40},
			overline: 'Что мы видим',
			caption: 'Нижняя подпись к футажу: коротко, одна мысль, до двух строк.',
		},
		{
			type: 'stats',
			durationInFrames: 450,
			overline: 'Ключевые цифры',
			title: 'Заголовок блока с цифрами',
			background: {...PLACEHOLDER},
			stats: [
				{value: 2000, suffix: ' лет', caption: 'подпись к первой цифре — что она значит.'},
				{value: 972, caption: 'подпись ко второй цифре.'},
				{value: 11, suffix: ' пещер', caption: 'подпись к третьей цифре.'},
			],
		},
		{
			type: 'bars',
			durationInFrames: 390,
			overline: 'Сравнение',
			title: 'Заголовок сравнения',
			unit: ' г.',
			max: 2000,
			rows: [
				{label: 'Событие A', value: 1947, note: 'пояснение', tone: 'neutral'},
				{label: 'Событие B', value: 1956, note: 'пояснение', tone: 'hot', highlight: true},
				{label: 'Событие C', value: 1991, note: 'пояснение', tone: 'cold'},
			],
			footnote: 'Вывод из сравнения одной фразой.',
		},
		{
			type: 'endCard',
			durationInFrames: 480,
			overline: 'Новый выпуск',
			title: 'НАЗВАНИЕ ВЫПУСКА',
			accent: 'АКЦЕНТНАЯ ЧАСТЬ',
			cta: 'Скоро на канале',
			background: {...PLACEHOLDER, zoom: [1.0, 1.1]},
		},
	],
};
