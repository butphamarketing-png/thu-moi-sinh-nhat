import { useEffect } from "react";
import { IntroControls } from "./IntroControls";

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
      <div className="intro-mist" aria-hidden="true" />
      <div className="intro-motes" aria-hidden="true">
        <i /><i /><i /><i /><i /><i /><i /><i />
      </div>
      <div className="intro-bloom" aria-hidden="true" />
      <div className="tale-doors" aria-hidden="true">
        <span />
        <span />
      </div>
      <div className="intro-core">
        <h1 id="intro-title" className="once-line">Once upon a birthday…</h1>
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
