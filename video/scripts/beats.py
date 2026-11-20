#!/usr/bin/env python3
"""
Ритм музыки → длительности планов, чтобы склейки попадали в бит (librosa).

  python3 scripts/beats.py public/audio/music.mp3 --total 60 --max 4.0 --xfade 12   # ролик ровно 60 с
  python3 scripts/beats.py public/audio/music.mp3 --shots 15 --max 4.0 --xfade 12   # ровно 15 планов
  → печатает темп, сетку долей и массив durationInFrames для конфига ролика
    (каждая склейка на ближайшей доле, план не длиннее --max секунд — правило docs/07-shot-rules.md),
    а также кадры сильных долей для «ударов» (hits).

Результат также пишется в <music>.beats.json.
Установка: pip install -r requirements.txt   (librosa)
"""
import argparse
import json
import sys
from pathlib import Path

try:
    import librosa
    import numpy as np
except ImportError:  # pragma: no cover
    sys.exit('Нужен librosa: pip install -r requirements.txt')


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument('music')
    ap.add_argument('--shots', type=int, default=15, help='сколько планов нужно (если не задан --total)')
    ap.add_argument('--total', type=float, help='точная длина ролика, с (число планов посчитается само)')
    ap.add_argument('--max', type=float, default=4.0, help='макс. длина плана, с')
    ap.add_argument('--min', type=float, default=2.5, help='мин. длина плана, с')
    ap.add_argument('--fps', type=int, default=30)
    ap.add_argument('--xfade', type=int, default=12, help='кадров наплыва (cut: crossfade в конфиге)')
    ap.add_argument('--offset', type=float, default=0.0, help='с какой секунды музыки начинается ролик')
    a = ap.parse_args()

    y, sr = librosa.load(a.music, sr=22050, mono=True, offset=a.offset)
    tempo, beat_frames = librosa.beat.beat_track(y=y, sr=sr, units='frames')
    beats = librosa.frames_to_time(beat_frames, sr=sr)
    onset = librosa.onset.onset_strength(y=y, sr=sr)
    strength = onset[np.clip(beat_frames, 0, len(onset) - 1)] if len(beat_frames) else np.array([])
    tempo = float(np.atleast_1d(tempo)[0])

    # Склейки: идём от 0, на каждом шаге берём самую сильную долю в окне [t+min, t+max].
    cuts, t = [0.0], 0.0

    def next_cut(t: float) -> float:
        window = [(b, s) for b, s in zip(beats, strength) if t + a.min <= b <= t + a.max]
        return float(max(window, key=lambda x: x[1])[0]) if window else t + a.max

    if a.total:
        # Режим «ролик ровно N секунд»: режем по долям, пока остаток не влезет в последний план.
        while a.total - t > a.max:
            rest = a.total - t
            if rest < a.max + a.min:
                # Остаток не делится на «нормальный план + хвост ≥ min» — режем его пополам (на ближайшую долю ±0.25 с).
                mid = t + rest / 2
                near = [x for x in beats if abs(x - mid) <= 0.25]
                t = float(min(near, key=lambda x: abs(x - mid))) if near else mid
            else:
                t = next_cut(t)
                if a.total - t < a.min:
                    t = a.total - a.min
            cuts.append(round(t, 3))
        lengths_s = [round(cuts[i + 1] - cuts[i], 3) for i in range(len(cuts) - 1)]
        lengths_s.append(round(a.total - t, 3))
    else:
        for _ in range(a.shots - 1):
            t = next_cut(t)
            cuts.append(t)
        lengths_s = [round(cuts[i + 1] - cuts[i], 3) for i in range(len(cuts) - 1)]
        lengths_s.append(a.max)  # последний план
    frames = [int(round(s * a.fps)) for s in lengths_s]
    if a.total:  # округление: сумма кадров = total × fps
        frames[-1] += int(round(a.total * a.fps)) - sum(frames)
    # В режиме наплыва каждый план, кроме последнего, длиннее на xfade (перекрытие).
    durations = [f + a.xfade for f in frames[:-1]] + [frames[-1]]

    strong = [float(b) for b, s in zip(beats, strength) if len(strength) and s >= np.percentile(strength, 75)]
    report = {
        'music': a.music, 'offset_s': a.offset, 'tempo_bpm': round(tempo, 1),
        'beats_s': [round(float(b), 3) for b in beats],
        'cuts_s': [round(c, 3) for c in cuts],
        'shot_lengths_s': lengths_s,
        'durationInFrames': durations,
        'total_frames': sum(frames),
        'hit_frames': [int(round(b * a.fps)) for b in strong],
    }
    Path(a.music + '.beats.json').write_text(json.dumps(report, ensure_ascii=False, indent=2))
    print(f'Темп: {report["tempo_bpm"]} BPM, долей: {len(beats)}')
    print(f'Склейки (с): {report["cuts_s"]}')
    print(f'durationInFrames: {durations}  → всего {sum(frames)} кадров ({sum(frames) / a.fps:.2f} с)')
    print(f'Отчёт: {a.music}.beats.json')
    return 0


if __name__ == '__main__':
    sys.exit(main())
