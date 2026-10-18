import { useEffect, useRef, useState } from "react";
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
  const [opening, setOpening] = useState(false);
  const startRef = useRef(onStart);
  startRef.current = onStart;

  useEffect(() => {
    if (leaving && reduced) onLeft();
  }, [leaving, onLeft, reduced]);

  useEffect(() => {
    if (!opening) return;
    const timer = window.setTimeout(() => startRef.current(), 1700);
    return () => window.clearTimeout(timer);
  }, [opening]);

  return (
    <section
      className={["intro", opening ? "is-opening" : "", leaving ? "is-leaving" : ""].filter(Boolean).join(" ")}
      aria-labelledby="intro-title"
      onAnimationEnd={(event) => {
        if (event.animationName === "intro-leave") onLeft();
      }}
    >
      <div className="intro-mist" aria-hidden="true" />
      <div className="intro-motes" aria-hidden="true">
        <i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
      </div>
      <div className="intro-drift" aria-hidden="true">
        <span /><span /><span /><span /><span /><span /><span /><span />
      </div>
      <div className="intro-petals" aria-hidden="true">
        <i /><i /><i /><i /><i /><i />
      </div>
      <div className="intro-glint" aria-hidden="true">
        <i /><i /><i /><i /><i />
      </div>
      <div className="intro-wash" aria-hidden="true" />
      <div className="intro-core">
        <div className="envelope-float">
          <div className="envelope-orbit" aria-hidden="true">
            <i /><i /><i /><i /><i /><i /><i /><i />
          </div>
          <div className={opening ? "envelope is-opening" : "envelope"} aria-hidden="true">
            <div className="envelope-letter" />
            <div className="envelope-body" />
            <div className="envelope-flap" />
            <span className="wax-seal">
              <HeartIcon />
            </span>
          </div>
        </div>
        <h1 id="intro-title" className="invite-line">Bạn vừa nhận được một lời mời đặc biệt…</h1>
        {error && (
          <p className="intro-error" role="alert">
            {error}
          </p>
        )}
        <IntroControls locked={locked || opening} error={error} onStart={() => (reduced ? onStart() : setOpening(true))} onSkip={onSkip} onRetry={onRetry} />
      </div>
    </section>
  );
}
