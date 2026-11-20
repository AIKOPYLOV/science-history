import {fade} from '@remotion/transitions/fade';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {Fragment} from 'react';
import {AbsoluteFill, Audio, interpolate, Sequence, staticFile} from 'remotion';
import {Grain, LightLeakOverlay, SceneFadeDisabled, Vignette} from '../components/ui';
import {colors} from '../theme';
import {
	BarsScene,
	EndCardScene,
	FootageScene,
	STAT_REVEAL_FRAME,
	StatScene,
	StatsScene,
	statRevealFrame,
	TitleScene,
} from './scenes';
import type {SceneSpec, VideoConfig} from './types';

const LEAK_FRAMES = 36;

const xfade = (config: VideoConfig) => (config.cut === 'crossfade' ? (config.crossfadeFrames ?? 12) : 0);

/** Длина ролика с учётом наплывов. */
export const totalDuration = (config: VideoConfig) =>
	config.scenes.reduce((s, sc) => s + sc.durationInFrames, 0) - xfade(config) * (config.scenes.length - 1);

/** Кадр начала каждой сцены на общей шкале (с учётом наплывов — середина перехода не важна, берём начало). */
export const sceneStarts = (config: VideoConfig) => {
	const x = xfade(config);
	const starts: number[] = [];
	let acc = 0;
	for (const s of config.scenes) {
		starts.push(acc);
		acc += s.durationInFrames - x;
	}
	return starts;
};

const SceneSwitch: React.FC<{spec: SceneSpec}> = ({spec}) => {
	switch (spec.type) {
		case 'title':
			return <TitleScene spec={spec} />;
		case 'footage':
			return <FootageScene spec={spec} />;
		case 'stats':
			return <StatsScene spec={spec} />;
		case 'stat':
			return <StatScene spec={spec} />;
		case 'bars':
			return <BarsScene spec={spec} />;
		case 'endCard':
			return <EndCardScene spec={spec} />;
		case 'custom': {
			const Custom = spec.component;
			return <Custom />;
		}
	}
};

/**
 * Универсальный ролик из конфига. Два режима монтажа:
 *  - cut: 'leak' (по умолчанию) — вспышка на каждой склейке, сцены сами затемняются;
 *  - cut: 'crossfade' — плавные наплывы между планами (для смены кадра каждые 4 с), вспышки — только leakAt.
 */
export const TemplateVideo: React.FC<{config: VideoConfig}> = ({config}) => {
	const crossfade = config.cut === 'crossfade';
	const x = xfade(config);
	const starts = sceneStarts(config);
	const total = totalDuration(config);
	const leakScenes = crossfade ? (config.leakAt ?? []) : starts.map((_, i) => i).slice(1);
	const leakFrames = leakScenes.map((i) => starts[i] + (crossfade ? Math.round(x / 2) : 0));
	const hits = config.scenes.flatMap((s, i) => {
		if (s.type === 'stats') return s.stats.map((_, k) => starts[i] + statRevealFrame(s, k));
		if (s.type === 'stat') return [starts[i] + STAT_REVEAL_FRAME];
		return [];
	}).concat(config.extraHits ?? []);

	return (
		<AbsoluteFill style={{backgroundColor: colors.bg}}>
			<SceneFadeDisabled.Provider value={crossfade}>
				<TransitionSeries>
					{config.scenes.map((spec, i) => (
						<Fragment key={i}>
							<TransitionSeries.Sequence durationInFrames={spec.durationInFrames}>
								<SceneSwitch spec={spec} />
							</TransitionSeries.Sequence>
							{i < config.scenes.length - 1 && crossfade ? (
								<TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: x})} />
							) : null}
						</Fragment>
					))}
				</TransitionSeries>
			</SceneFadeDisabled.Provider>

			{leakFrames.map((f, k) => (
				<Sequence key={`leak${f}`} from={Math.max(0, f - LEAK_FRAMES / 2)} durationInFrames={LEAK_FRAMES}>
					<LightLeakOverlay seed={k * 3 + 1} />
				</Sequence>
			))}

			<Grain opacity={0.1} />
			<Vignette />

			{config.music ? (
				<Audio
					src={staticFile(config.music.src)}
					volume={(f) =>
						interpolate(f, [0, 30, total - 45, total], [0, config.music?.volume ?? 0.9, config.music?.volume ?? 0.9, 0], {
							extrapolateLeft: 'clamp',
							extrapolateRight: 'clamp',
						})
					}
				/>
			) : null}
			{config.voiceover ? <Audio src={staticFile(config.voiceover.src)} volume={config.voiceover.volume ?? 1} /> : null}
			{config.sfx?.whoosh
				? leakFrames.map((c) => (
						<Sequence key={`w${c}`} from={Math.max(0, c - 36)} durationInFrames={48}>
							<Audio src={staticFile(config.sfx!.whoosh!)} volume={0.55} />
						</Sequence>
					))
				: null}
			{config.sfx?.hit
				? hits.map((h) => (
						<Sequence key={`h${h}`} from={h} durationInFrames={90}>
							<Audio src={staticFile(config.sfx!.hit!)} volume={0.7} />
						</Sequence>
					))
				: null}
		</AbsoluteFill>
	);
};
