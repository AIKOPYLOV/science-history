#!/usr/bin/env bash
# Рендер ролика + мастеринг громкости под YouTube (-14 LUFS, true peak -1 dBTP).
# Использование: scripts/render.sh <CompositionId> [имя-файла]
#   scripts/render.sh Template template-demo
set -euo pipefail
cd "$(dirname "$0")/.."

COMP="${1:?Укажи id композиции, например Template}"
NAME="${2:-$(echo "$COMP" | sed -E 's/([a-z])([A-Z])/\1-\2/g' | tr '[:upper:]' '[:lower:]')}"
mkdir -p out

# В облачной среде Claude Code есть готовый headless Chromium — используем его.
CLOUD_SHELL=/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell
if [[ -z "${REMOTION_BROWSER:-}" && -x "$CLOUD_SHELL" ]]; then
	export REMOTION_BROWSER="$CLOUD_SHELL"
fi

npx tsc -p .
npx remotion render src/index.ts "$COMP" "out/$NAME.raw.mp4" --concurrency="${CONCURRENCY:-4}"

# Мастеринг звука: видео копируется без перекодирования.
# Двухпроходный loudnorm: сначала замер, потом точная нормализация (однопроходный ошибается на ±1–2 LU).
M=$(ffmpeg -hide_banner -i "out/$NAME.raw.mp4" -af "loudnorm=I=-14:TP=-1:LRA=11:print_format=json" -f null - 2>&1 | sed -n '/^{/,/^}/p')
mv_i=$(echo "$M" | python3 -c "import json,sys;d=json.load(sys.stdin);print(d['input_i'],d['input_tp'],d['input_lra'],d['input_thresh'],d['target_offset'])")
read -r II ITP ILRA ITH OFF <<< "$mv_i"
ffmpeg -v error -y -i "out/$NAME.raw.mp4" -c:v copy \
	-af "loudnorm=I=-14:TP=-1:LRA=11:measured_I=$II:measured_TP=$ITP:measured_LRA=$ILRA:measured_thresh=$ITH:offset=$OFF:linear=true" \
	-c:a aac -b:a 192k -ar 48000 -movflags +faststart "out/$NAME.mp4"
rm "out/$NAME.raw.mp4"

ffprobe -v error -show_entries format=duration,size:stream=codec_name,width,height,r_frame_rate -of compact "out/$NAME.mp4"
echo "Готово: out/$NAME.mp4"

# Контроль монтажа: смена кадра ≤ 4 с, сходство планов ≤ 90 % (docs/07-shot-rules.md).
# SKIP_QC=1 — только для черновиков; ролик без пройденного QC не сдаётся.
if [[ "${SKIP_QC:-0}" != "1" ]]; then
	python3 scripts/qc_shots.py "out/$NAME.mp4"
fi
