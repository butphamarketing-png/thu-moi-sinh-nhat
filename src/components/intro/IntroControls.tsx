import { useState } from "react";
import { HeartIcon } from "../icons";

type IntroControlsProps = {
  locked: boolean;
  error: string | null;
  onStart: () => void;
  onSkip: () => void;
  onRetry: () => void;
};

export function IntroControls({ locked, error, onStart, onSkip, onRetry }: IntroControlsProps) {
  const [pressed, setPressed] = useState(false);

  return (
    <div className="intro-actions">
      <button
        type="button"
        className="start-btn"
        onClick={() => {
          setPressed(true);
          onStart();
        }}
        disabled={locked || pressed}
      >
        <HeartIcon />
        <span>{locked ? "Đang mở câu chuyện…" : "Mở thiệp"}</span>
      </button>
      {error && (
        <button type="button" className="text-btn" onClick={onRetry}>
          Thử lại giọng đọc
        </button>
      )}
      <button type="button" className="text-btn" onClick={onSkip}>
        Bỏ qua giới thiệu
      </button>
    </div>
  );
}
