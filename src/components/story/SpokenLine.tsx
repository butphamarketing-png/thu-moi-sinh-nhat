import { useEffect, useState } from "react";
import { useNarrationEngine } from "../../hooks/useNarration";
import type { AudioMode } from "../../types/story";
import timingFile from "../../config/narrationTiming.json";
import type { NarrationTimingFile } from "../../types/story";

const timing = timingFile as NarrationTimingFile;

type SpokenLineProps = {
  text: string;
  segmentId: string | null;
  dissolving: boolean;
};

export function SpokenLine({ text, segmentId, dissolving }: SpokenLineProps) {
  const engine = useNarrationEngine();
  const [count, setCount] = useState(1);
  const tokens = text.split(/(\s+)/).filter((token) => token.length > 0);

  useEffect(() => {
    setCount(1);
    return engine.subscribeProgress((progress) => {
      if (!segmentId || progress.segmentId !== segmentId) return;
      const content = text.split(/(\s+)/).filter((token) => token.trim());
      if (progress.mode === "speech") {
        setCount(content.length);
        return;
      }
      const words = timing.segments.find((segment) => segment.id === segmentId)?.words ?? [];
      let next = 1;
      if (words.length > 0) {
        const heard = words.filter((word) => progress.currentTime + 0.04 >= word.start).length;
        next = Math.ceil((heard / words.length) * content.length);
      } else if (progress.duration > 0) {
        next = Math.ceil((progress.currentTime / progress.duration) * content.length);
      }
      next = Math.min(content.length, Math.max(1, next));
      setCount((current) => (current === next ? current : next));
    });
  }, [engine, segmentId, text]);

  let remaining = count;
  return (
    <p className={dissolving ? "spoken-line is-dissolving" : "spoken-line"} aria-hidden="true">
      {tokens.map((token, index) => {
        if (!token.trim()) return <span key={`${token}-${index}`}>{token}</span>;
        const visible = remaining > 0;
        remaining -= 1;
        return (
          <span key={`${token}-${index}`} className={visible ? "word is-on" : "word"}>
            {token}
          </span>
        );
      })}
    </p>
  );
}

export function spokenModeLabel(mode: AudioMode, vietnamese: boolean) {
  if (mode === "file") return null;
  if (!vietnamese) return "Máy này chưa có giọng tiếng Việt. Bạn vẫn có thể bỏ qua lời dẫn.";
  return "Đang dùng giọng đọc của trình duyệt.";
}
