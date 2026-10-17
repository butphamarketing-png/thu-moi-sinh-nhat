import type { StoryPhase } from "../../types/story";
import { MusicIcon, PauseIcon, PlayIcon, ReplayIcon, SkipIcon } from "../icons";

type AudioControllerProps = {
  phase: StoryPhase;
  note: string | null;
  musicOn: boolean;
  onPause: () => void;
  onResume: () => void;
  onSkip: () => void;
  onReplay: () => void;
  onToggleMusic: () => void;
};

export function AudioController({
  phase,
  note,
  musicOn,
  onPause,
  onResume,
  onSkip,
  onReplay,
  onToggleMusic,
}: AudioControllerProps) {
  const finished = phase === "completed" || phase === "skipped";
  const paused = phase === "paused";

  return (
    <div className="dock" role="toolbar" aria-label="Điều khiển lời dẫn">
      {!finished &&
        (paused ? (
          <button type="button" onClick={onResume}>
            <PlayIcon />
            <span>Tiếp tục</span>
          </button>
        ) : (
          <button type="button" onClick={onPause} disabled={phase !== "playing"}>
            <PauseIcon />
            <span>Tạm dừng</span>
          </button>
        ))}
      {!finished && (
        <button type="button" onClick={onSkip}>
          <SkipIcon />
          <span>Bỏ qua</span>
        </button>
      )}
      <button type="button" onClick={onReplay}>
        <ReplayIcon />
        <span>Phát lại</span>
      </button>
      <button type="button" className="music-btn" aria-pressed={musicOn} onClick={onToggleMusic}>
        <MusicIcon />
        <span>{musicOn ? "Tắt nhạc" : "Bật nhạc"}</span>
      </button>
      {note && <p className="dock-note">{note}</p>}
    </div>
  );
}
