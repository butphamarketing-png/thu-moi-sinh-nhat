import { useEffect } from "react";
import { IntroControls } from "./IntroControls";
import { HeartIcon } from "../icons";

type IntroScreenProps = {
  leaving: boolean;
  reduced: boolean;
  locked: boolean;
  error: string | null;
  onLeft: () => void;
  onStart: () => void;
  onSkip: () => void;
  onRetry: () => void;
};

export function IntroScreen({
  leaving,
  reduced,
  locked,
  error,
  onLeft,
  onStart,
  onSkip,
  onRetry,
}: IntroScreenProps) {
  useEffect(() => {
    if (leaving && reduced) onLeft();
  }, [leaving, onLeft, reduced]);

  return (
    <section
      className={leaving ? "intro is-leaving" : "intro"}
      aria-labelledby="intro-title"
      onAnimationEnd={(event) => {
        if (event.animationName === "intro-leave") onLeft();
      }}
    >
      <div className="intro-core">
        <div className="intro-heart" aria-hidden="true">
          <HeartIcon />
        </div>
        <p id="intro-title">Một câu chuyện đặc biệt sắp bắt đầu…</p>
        {error && (
          <p className="intro-error" role="alert">
            {error}
          </p>
        )}
        <IntroControls locked={locked} error={error} onStart={onStart} onSkip={onSkip} onRetry={onRetry} />
      </div>
    </section>
  );
}
