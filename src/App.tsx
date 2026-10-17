import { useEffect, useRef, useState } from "react";
import { MusicBed } from "./audio/MusicBed";
import { AudioController } from "./components/audio/AudioController";
import { BirthdayFooter } from "./components/birthday/BirthdayFooter";
import { BirthdayHero } from "./components/birthday/BirthdayHero";
import { DressCode } from "./components/birthday/DressCode";
import { EventDetails } from "./components/birthday/EventDetails";
import { EventTimeline } from "./components/birthday/EventTimeline";
import { RSVPSection } from "./components/birthday/RSVPSection";
import { IntroScreen } from "./components/intro/IntroScreen";
import { SparkleField } from "./components/intro/SparkleField";
import { Atmosphere } from "./components/story/Atmosphere";
import { FloralDivider } from "./components/story/Decorations";
import { CinematicStage } from "./components/story/CinematicStage";
import { spokenModeLabel } from "./components/story/SpokenLine";
import { scrollAnchor, useBirthdayStory } from "./hooks/useBirthdayStory";
import { useReducedMotion } from "./hooks/useReducedMotion";
import type { PortraitStage, StoryAction } from "./types/story";

const programActions = ["program-0", "program-1", "program-2", "program-3"] as const satisfies readonly StoryAction[];

function portraitStage(isRevealed: (action: StoryAction) => boolean): PortraitStage {
  if (isRevealed("name-right") || isRevealed("hero-in") || isRevealed("finale")) return "complete";
  if (isRevealed("name-left")) return "named-left";
  if (isRevealed("focus-in")) return "focus";
  if (isRevealed("frames-in") || isRevealed("together-in") || isRevealed("joy-in")) return "framed";
  if (isRevealed("angels-in")) return "silhouette";
  return "hidden";
}

export function App() {
  const story = useBirthdayStory();
  const reduced = useReducedMotion();
  const musicRef = useRef<MusicBed | null>(null);
  if (!musicRef.current) musicRef.current = new MusicBed();
  const [musicOn, setMusicOn] = useState(true);
  const [introMounted, setIntroMounted] = useState(true);
  const lastAnchor = useRef<string | null>(null);
  const stage = portraitStage(story.isRevealed);
  const pageOn = story.isRevealed("hero-in");
  const showIntro = introMounted && story.phase !== "skipped" && story.phase !== "completed";
  const showCinematic =
    (story.phase === "playing" || story.phase === "paused") &&
    !pageOn &&
    story.scene !== "none" &&
    story.scene !== "page" &&
    story.scene !== "done";
  const showEvent =
    story.isRevealed("dress-label") || story.isRevealed("event-time") || story.isRevealed("event-place");
  const programCount = programActions.filter((action) => story.isRevealed(action)).length;
  const controlsOn = story.phase === "playing" || story.phase === "paused" || story.phase === "completed" || story.phase === "skipped";
  const voiceNote = spokenModeLabel(story.audioMode, story.vietnameseVoice);

  useEffect(() => {
    const bed = musicRef.current;
    if (!bed) return;
    bed.setMuted(!musicOn);
    if (story.phase === "paused") bed.pause();
    else if (story.phase === "playing" || story.phase === "completed" || story.phase === "skipped") bed.resume();
  }, [musicOn, story.phase]);

  useEffect(() => () => musicRef.current?.dispose(), []);

  function startMusic() {
    musicRef.current?.start();
    setMusicOn(true);
  }

  useEffect(() => {
    const locked =
      story.phase === "intro" ||
      story.phase === "transition" ||
      ((story.phase === "playing" || story.phase === "paused") && !pageOn);
    document.body.classList.toggle("scroll-lock", locked);
    return () => document.body.classList.remove("scroll-lock");
  }, [pageOn, story.phase]);

  useEffect(() => {
    if (story.phase === "intro" || story.phase === "transition") lastAnchor.current = null;
    if (story.phase !== "playing") return;
    const anchor = scrollAnchor(story.revealed);
    if (!anchor || anchor === lastAnchor.current) return;
    lastAnchor.current = anchor;
    document.getElementById(anchor)?.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "start",
    });
  }, [reduced, story.phase, story.revealed]);

  return (
    <div className="experience" data-phase={story.phase} data-scene={story.scene} data-reduced={reduced ? "true" : "false"}>
      <Atmosphere reduced={reduced} finale={story.isRevealed("finale")} />
      <SparkleField scene={story.scene} paused={story.phase === "paused"} reduced={reduced} burst={story.isRevealed("finale")} />
      {showIntro && (
        <IntroScreen
          leaving={story.phase === "playing" || story.phase === "paused"}
          reduced={reduced}
          locked={story.phase !== "intro"}
          error={story.phase === "intro" || story.phase === "transition" ? story.error : null}
          onLeft={() => setIntroMounted(false)}
          onStart={() => {
            startMusic();
            story.begin();
          }}
          onSkip={() => {
            startMusic();
            story.skip();
          }}
          onRetry={() => {
            startMusic();
            story.begin();
          }}
        />
      )}
      {story.phase === "transition" && !showIntro && <p className="waiting">Đang mở lại câu chuyện…</p>}
      {showCinematic && (
        <CinematicStage
          scene={story.scene}
          caption={story.caption}
          segmentId={story.segmentId}
          dissolving={story.dissolving}
          stage={stage}
        />
      )}
      {pageOn && (
        <main className="page">
          <BirthdayHero stage="complete" />
          {showEvent && (
            <section className="section event-section" id="event" aria-labelledby="event-title">
              <div className="section-heading">
                <p className="eyebrow">Buổi tiệc</p>
                <h2 id="event-title">Thông tin gặp mặt</h2>
                <FloralDivider />
              </div>
              <div className="event-grid">
                <EventDetails showTime={story.isRevealed("event-time")} showPlace={story.isRevealed("event-place")} />
                <DressCode showLabel={story.isRevealed("dress-label")} showValue={story.isRevealed("dress-value")} />
              </div>
            </section>
          )}
          <EventTimeline visibleCount={programCount} />
          {story.isRevealed("finale") && (
            <>
              <RSVPSection />
              <BirthdayFooter />
            </>
          )}
        </main>
      )}
      <p className="sr-only" aria-live="polite">
        {story.caption}
      </p>
      {story.error && story.phase !== "intro" && story.phase !== "transition" && (
        <p className="audio-banner" role="alert">
          {story.error}
        </p>
      )}
      {controlsOn && (
        <AudioController
          phase={story.phase}
          note={voiceNote}
          onPause={story.pause}
          onResume={story.resume}
          onSkip={() => {
            startMusic();
            story.skip();
          }}
          onReplay={() => {
            startMusic();
            story.replay();
          }}
          musicOn={musicOn}
          onToggleMusic={() => {
            setMusicOn((on) => {
              if (!on) musicRef.current?.start();
              return !on;
            });
          }}
        />
      )}
    </div>
  );
}
