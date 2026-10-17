import { useEffect, useMemo, useState } from "react";
import { collectActions } from "../config/birthdayStory";
import type { AudioMode, SceneId, StoryAction, StoryPhase } from "../types/story";
import { useNarrationEngine } from "./useNarration";

const sceneByAction: Partial<Record<StoryAction, SceneId>> = {
  "memory-in": "memory",
  "angels-in": "angels",
  "frames-in": "frames",
  "together-in": "together",
  "joy-in": "joy",
  "focus-in": "focus",
  "name-left": "names",
  "name-right": "names",
  "hero-in": "page",
  finale: "done",
};

const sceneOrder: StoryAction[] = [
  "memory-in",
  "angels-in",
  "frames-in",
  "together-in",
  "joy-in",
  "focus-in",
  "name-left",
  "name-right",
  "hero-in",
  "finale",
];

function sceneFrom(actions: Set<StoryAction>, fallback: SceneId): SceneId {
  let scene = fallback;
  for (const action of sceneOrder) {
    const next = sceneByAction[action];
    if (actions.has(action) && next) scene = next;
  }
  return scene;
}

export function scrollAnchor(actions: Set<StoryAction>) {
  if (actions.has("finale")) return "rsvp";
  if (actions.has("program-0")) return "program";
  if (actions.has("dress-label") || actions.has("event-time") || actions.has("event-place")) return "event";
  if (actions.has("hero-in")) return "hero";
  return null;
}

export function useBirthdayStory() {
  const engine = useNarrationEngine();
  const enabled = useMemo(() => collectActions(), []);
  const [phase, setPhase] = useState<StoryPhase>("intro");
  const [revealed, setRevealed] = useState<Set<StoryAction>>(() => new Set());
  const [scene, setScene] = useState<SceneId>("none");
  const [caption, setCaption] = useState("");
  const [segmentId, setSegmentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [audioMode, setAudioMode] = useState<AudioMode>("file");
  const [vietnameseVoice, setVietnameseVoice] = useState(true);
  const [dissolving, setDissolving] = useState(false);

  useEffect(() => {
    return engine.subscribe((event) => {
      if (event.type === "mode") {
        setAudioMode(event.mode);
        setVietnameseVoice(event.vietnamese);
      }
      if (event.type === "segment") {
        setCaption(event.text);
        setSegmentId(event.id);
        setDissolving(false);
        setPhase((current) => (current === "transition" ? "playing" : current));
      }
      if (event.type === "action") {
        setRevealed((current) => {
          if (current.has(event.action)) return current;
          const next = new Set(current);
          next.add(event.action);
          return next;
        });
        setDissolving(event.action === "memory-out");
        const nextScene = sceneByAction[event.action];
        if (nextScene) setScene(nextScene);
      }
      if (event.type === "sync") {
        const next = new Set(event.actions);
        setRevealed(next);
        setScene(sceneFrom(next, "none"));
        setDissolving(next.has("memory-out") && !next.has("angels-in"));
      }
      if (event.type === "pause") {
        setPhase((current) => (current === "playing" ? "paused" : current));
      }
      if (event.type === "resume") {
        setPhase((current) => (current === "paused" ? "playing" : current));
      }
      if (event.type === "complete") {
        setPhase((current) => (current === "skipped" ? current : "completed"));
        setScene("done");
        setCaption("");
        setSegmentId(null);
        setDissolving(false);
        setRevealed(new Set(enabled));
      }
      if (event.type === "error") setError(event.message);
    });
  }, [enabled, engine]);

  const isRevealed = (action: StoryAction) =>
    phase === "skipped" || phase === "completed" || revealed.has(action);

  function begin() {
    setError(null);
    setPhase("transition");
    engine.start();
  }

  function pause() {
    engine.pause();
  }

  function resume() {
    engine.resume();
  }

  function skip() {
    engine.stop();
    setRevealed(new Set(enabled));
    setScene("done");
    setPhase("skipped");
    setDissolving(false);
    setCaption("");
    setSegmentId(null);
    window.scrollTo({ top: 0, behavior: "auto" });
  }

  function replay() {
    setRevealed(new Set());
    setScene("none");
    setCaption("");
    setSegmentId(null);
    setError(null);
    setDissolving(false);
    setPhase("transition");
    window.scrollTo({ top: 0, behavior: "auto" });
    engine.start();
  }

  return {
    phase,
    scene,
    caption,
    segmentId,
    error,
    audioMode,
    vietnameseVoice,
    dissolving,
    isRevealed,
    revealed,
    begin,
    pause,
    resume,
    skip,
    replay,
  };
}
