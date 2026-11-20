import {continueRender, delayRender, staticFile} from 'remotion';

// Шрифты лежат в public/fonts (Google Fonts, лицензия SIL OFL), чтобы рендер не зависел от сети.
const LATIN =
	'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD';
const CYRILLIC = 'U+0301, U+0400-045F, U+0490-0491, U+04B0-04B1, U+2116';

const FACES = [
	{family: 'Unbounded', file: 'unbounded-latin', weight: '300 700', range: LATIN},
	{family: 'Unbounded', file: 'unbounded-cyrillic', weight: '300 700', range: CYRILLIC},
	{family: 'Manrope', file: 'manrope-latin', weight: '400 800', range: LATIN},
	{family: 'Manrope', file: 'manrope-cyrillic', weight: '400 800', range: CYRILLIC},
];

if (typeof document !== 'undefined') {
	const handle = delayRender('Loading local fonts');
	Promise.all(
		FACES.map(async ({family, file, weight, range}) => {
			const face = new FontFace(family, `url(${staticFile(`fonts/${file}.woff2`)}) format('woff2')`, {
				weight,
				unicodeRange: range,
				display: 'block',
			});
			await face.load();
			document.fonts.add(face);
		}),
	)
		.then(() => continueRender(handle))
		.catch((err) => {
			console.error(err);
			continueRender(handle);
		});
}

export const fonts = {
	display: "'Unbounded', sans-serif",
	body: "'Manrope', sans-serif",
};

export const colors = {
	bg: '#0e0b08', // тёмный музейный зал
	text: '#f2eadb', // пергамент
	muted: 'rgba(242, 234, 219, 0.64)',
	accent: '#d6a84e', // золото: акцент, ключевая дата
	hot: '#b5482e', // киноварь/охра: важное, утрата, конфликт
	cool: '#7d9aa6', // лазурит: нейтральное сравнение
	green: '#8b9a5b', // бронзовая патина: территории на карте
	neutral: '#a39a8b', // камень
	line: 'rgba(242, 234, 219, 0.18)',
};

// Кривая в стиле «моушн-дизайна»: быстрый старт, длинное мягкое торможение.
export const easeOutExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
export const easeInOutCubic = (t: number) =>
	t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
