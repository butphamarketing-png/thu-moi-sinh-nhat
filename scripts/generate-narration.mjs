import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { EdgeTTS } from "node-edge-tts";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const storyPath = path.join(root, "src", "config", "birthdayStory.ts");
const audioDir = path.join(root, "public", "audio");
const timingPath = path.join(root, "src", "config", "narrationTiming.json");
const voice = "vi-VN-HoaiMyNeural";

const source = await readFile(storyPath, "utf8");
const segments = [];
const pattern =
  /id:\s*"([^"]+)",\s*text:\s*"([^"]+)",\s*audioSrc:\s*"([^"]+)",\s*enabled:\s*(true|false)/g;
for (const match of source.matchAll(pattern)) {
  if (match[4] !== "true") continue;
  segments.push({ id: match[1], text: match[2], audioSrc: match[3] });
}

if (segments.length === 0) {
  throw new Error("Không đọc được phân đoạn trong birthdayStory.ts");
}

const tts = new EdgeTTS({
  voice,
  lang: "vi-VN",
  outputFormat: "audio-24khz-48kbitrate-mono-mp3",
  saveSubtitles: true,
  rate: "-8%",
  pitch: "+2Hz",
  timeout: 40000,
});

await mkdir(audioDir, { recursive: true });
const timing = [];

for (const segment of segments) {
  const filepath = path.join(audioDir, path.basename(segment.audioSrc));
  await tts.ttsPromise(segment.text, filepath);
  const sidecar = `${filepath}.json`;
  let words = [];
  try {
    const raw = JSON.parse(await readFile(sidecar, "utf8"));
    words = raw
      .map((item) => ({
        text: String(item.part ?? "").trim(),
        start: Number(item.start) / 1000,
        end: Number(item.end) / 1000,
      }))
      .filter((item) => item.text.length > 0);
    await unlink(sidecar);
  } catch {
    words = [];
  }
  const duration = words.length ? words[words.length - 1].end : 0;
  timing.push({ id: segment.id, duration, words });
  console.log(`${segment.id}: ${duration.toFixed(2)}s, ${words.length} từ`);
}

await writeFile(timingPath, JSON.stringify({ voice, segments: timing }, null, 2), "utf8");
console.log(`Đã ghi ${timingPath}`);
