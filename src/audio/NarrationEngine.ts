import timingFile from "../config/narrationTiming.json";
import { activeSegments } from "../config/birthdayStory";
import type {
  AudioMode,
  NarrationEvent,
  NarrationProgress,
  NarrationTimingFile,
  NarrationWord,
  StoryAction,
  StoryCue,
  StorySegment,
} from "../types/story";

const timing = timingFile as NarrationTimingFile;

type Listener = (event: NarrationEvent) => void;
type ProgressListener = (progress: NarrationProgress) => void;

/**
 * Đồng hồ của câu chuyện là `HTMLAudioElement.currentTime`.
 * Nếu không có file audio, từng câu được đọc bằng speechSynthesis
 * và mốc xuất hiện bám `onstart` / `onboundary` / `onend`.
 * Không dùng setTimeout để đoán thời điểm đọc.
 */
export class NarrationEngine {
  private readonly audio = new Audio();
  private readonly listeners = new Set<Listener>();
  private readonly progressListeners = new Set<ProgressListener>();
  private playlist: StorySegment[] = [];
  private index = 0;
  private session = 0;
  private segmentToken = 0;
  private readonly finishedTokens = new Set<number>();
  private readonly fired = new Set<StoryAction>();
  private raf = 0;
  private running = false;
  private paused = false;
  private prepared = false;
  private fallingBack = false;
  private mode: AudioMode = "file";
  private voice: SpeechSynthesisVoice | null = null;
  private hasVietnameseVoice = false;
  private onVoices: (() => void) | null = null;
  private currentSegmentId: string | null = null;

  constructor(segments: StorySegment[]) {
    this.playlist = activeSegments(segments);
    this.audio.preload = "auto";
    this.audio.autoplay = false;
    this.audio.addEventListener("seeked", () => this.onSeeked());
  }

  prepare() {
    if (this.prepared || typeof window === "undefined") return;
    this.prepared = true;
    this.bindVoices();
    const first = this.playlist[0];
    if (!first) {
      this.setMode("speech");
      return;
    }
    void fetch(first.audioSrc, { method: "HEAD" })
      .then((response) => {
        if (this.running) return;
        this.setMode(response.ok ? "file" : "speech");
        if (response.ok) {
          this.audio.src = first.audioSrc;
          this.audio.load();
        }
      })
      .catch(() => {
        if (!this.running) this.setMode("speech");
      });
  }

  dispose() {
    this.stop();
    this.prepared = false;
    if (this.onVoices && typeof window !== "undefined") {
      window.speechSynthesis.removeEventListener("voiceschanged", this.onVoices);
      this.onVoices = null;
    }
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  subscribeProgress(listener: ProgressListener) {
    this.progressListeners.add(listener);
    return () => {
      this.progressListeners.delete(listener);
    };
  }

  get modeNow() {
    return this.mode;
  }

  start() {
    this.stop();
    const session = this.session;
    this.index = 0;
    this.fired.clear();
    this.finishedTokens.clear();
    this.paused = false;
    this.running = true;
    this.fallingBack = false;
    this.currentSegmentId = null;
    this.begin(session);
  }

  pause() {
    if (!this.running || this.paused) return;
    this.paused = true;
    cancelAnimationFrame(this.raf);
    if (this.mode === "file") this.audio.pause();
    else window.speechSynthesis.pause();
    this.emit({ type: "pause" });
  }

  resume() {
    if (!this.running || !this.paused) return;
    this.paused = false;
    if (this.mode === "file") {
      void this.audio.play().catch(() => {
        this.emit({
          type: "error",
          message: "Không tiếp tục được giọng đọc. Bạn có thể bỏ qua để xem thư mời.",
        });
      });
      this.kick();
    } else {
      window.speechSynthesis.resume();
    }
    this.emit({ type: "resume" });
  }

  stop() {
    this.session += 1;
    this.segmentToken += 1;
    this.running = false;
    this.paused = false;
    cancelAnimationFrame(this.raf);
    this.audio.onended = null;
    this.audio.onerror = null;
    this.audio.pause();
    this.audio.removeAttribute("src");
    this.audio.load();
    if (typeof window !== "undefined") window.speechSynthesis.cancel();
  }

  private setMode(mode: AudioMode) {
    this.mode = mode;
    this.emit({ type: "mode", mode, vietnamese: this.hasVietnameseVoice });
  }

  private bindVoices() {
    const pick = () => {
      const voices = window.speechSynthesis.getVoices();
      const vietnamese = voices.filter((voice) => voice.lang.toLowerCase().replace("_", "-").startsWith("vi"));
      const female =
        vietnamese.find((voice) => /female|nữ|hoai|my|mai/i.test(voice.name)) ?? vietnamese[0] ?? null;
      this.voice = female;
      this.hasVietnameseVoice = Boolean(female);
      this.emit({ type: "mode", mode: this.mode, vietnamese: this.hasVietnameseVoice });
    };
    this.onVoices = pick;
    pick();
    window.speechSynthesis.addEventListener("voiceschanged", pick);
  }

  private begin(session: number) {
    if (session !== this.session) return;
    const segment = this.playlist[this.index];
    if (!segment) {
      this.running = false;
      cancelAnimationFrame(this.raf);
      this.emit({ type: "complete" });
      return;
    }

    this.segmentToken += 1;
    const token = this.segmentToken;
    this.currentSegmentId = segment.id;

    if (this.mode === "speech" || !segment.audioSrc) {
      this.speak(segment, session, token);
      return;
    }

    const onPlaying = () => {
      if (session !== this.session || token !== this.segmentToken) return;
      this.openSegment(segment);
      this.kick();
    };

    this.audio.onended = () => {
      if (session !== this.session || token !== this.segmentToken || this.paused) return;
      this.finish(session, token);
    };
    this.audio.onerror = () => {
      if (session !== this.session || token !== this.segmentToken) return;
      if (this.audio.error?.code === MediaError.MEDIA_ERR_ABORTED) return;
      this.fallbackToSpeech(segment, session, token);
    };

    this.audio.src = segment.audioSrc;
    this.audio.addEventListener("playing", onPlaying, { once: true });
    const played = this.audio.play();
    played?.catch(() => {
      this.audio.removeEventListener("playing", onPlaying);
      if (session !== this.session || token !== this.segmentToken) return;
      this.fallbackToSpeech(segment, session, token);
    });
  }

  private speak(segment: StorySegment, session: number, token: number) {
    const synth = window.speechSynthesis;
    if (synth.speaking) synth.cancel();
    const utterance = new SpeechSynthesisUtterance(segment.text);
    utterance.lang = "vi-VN";
    utterance.rate = 0.9;
    utterance.pitch = 1.04;
    if (this.voice) utterance.voice = this.voice;

    utterance.onstart = () => {
      if (session !== this.session || token !== this.segmentToken) return;
      this.openSegment(segment);
    };
    utterance.onboundary = (event) => {
      if (session !== this.session || token !== this.segmentToken || this.paused) return;
      const charIndex = event.charIndex ?? 0;
      this.applyBoundary(segment, charIndex);
      this.emitProgress(segment, charIndex, segment.text.length || 1);
    };
    utterance.onend = () => {
      if (session !== this.session || token !== this.segmentToken || this.paused) return;
      this.finish(session, token);
    };
    utterance.onerror = (event) => {
      if (session !== this.session || token !== this.segmentToken) return;
      if (event.error === "interrupted" || event.error === "canceled") return;
      this.emit({
        type: "error",
        message: "Không phát được giọng đọc. Bạn có thể bỏ qua để xem thư mời.",
      });
    };

    synth.resume();
    synth.speak(utterance);
  }

  private fallbackToSpeech(segment: StorySegment, session: number, token: number) {
    if (this.fallingBack) return;
    this.fallingBack = true;
    if (this.mode === "speech") {
      this.emit({
        type: "error",
        message: "Không phát được giọng đọc. Bạn có thể bỏ qua để xem thư mời.",
      });
      return;
    }
    this.audio.onerror = null;
    this.audio.onended = null;
    this.audio.pause();
    this.setMode("speech");
    this.speak(segment, session, token);
  }

  private openSegment(segment: StorySegment) {
    this.emit({ type: "segment", id: segment.id, text: segment.text });
    for (const action of segment.onEnter) this.fire(action);
    this.emitProgress(segment, this.mode === "file" ? this.audio.currentTime : 0, this.durationOf(segment));
  }

  private finish(session: number, token: number) {
    if (this.finishedTokens.has(token)) return;
    this.finishedTokens.add(token);
    const segment = this.playlist[this.index];
    if (!segment) return;
    for (const cue of segment.cues ?? []) this.fire(cue.action);
    for (const action of segment.onExit) this.fire(action);
    this.index += 1;
    this.begin(session);
  }

  private kick() {
    cancelAnimationFrame(this.raf);
    const loop = () => {
      if (!this.running || this.paused || this.mode !== "file") return;
      const segment = this.playlist[this.index];
      if (segment && !this.audio.paused && !this.audio.ended) {
        this.syncCues(segment);
        this.emitProgress(segment, this.audio.currentTime, this.audio.duration || 0);
      }
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  private syncCues(segment: StorySegment) {
    const time = this.audio.currentTime;
    const duration = this.audio.duration;
    for (const cue of segment.cues ?? []) {
      const at = this.resolveCue(segment, cue, duration);
      if (at != null && time + 0.03 >= at) this.fire(cue.action);
    }
  }

  private applyBoundary(segment: StorySegment, charIndex: number) {
    const length = segment.text.length || 1;
    const lower = segment.text.toLocaleLowerCase("vi");
    for (const cue of segment.cues ?? []) {
      if (cue.afterWord) {
        const at = lower.indexOf(cue.afterWord.toLocaleLowerCase("vi"));
        if (at >= 0 && charIndex >= at) this.fire(cue.action);
        continue;
      }
      if (typeof cue.atRatio === "number" && charIndex / length >= cue.atRatio) {
        this.fire(cue.action);
      }
    }
  }

  private resolveCue(segment: StorySegment, cue: StoryCue, duration: number) {
    if (typeof cue.at === "number") return cue.at;
    if (cue.afterWord) {
      const target = cue.afterWord.toLocaleLowerCase("vi");
      const found = this.wordsFor(segment.id).find((word) => {
        const value = word.text.toLocaleLowerCase("vi").trim();
        const pieces = value.split(/\s+/);
        return pieces.length <= 4 && (value === target || value.includes(target));
      });
      if (found) return found.start;
    }
    if (typeof cue.atRatio === "number" && Number.isFinite(duration) && duration > 0) {
      return cue.atRatio * duration;
    }
    return null;
  }

  private wordsFor(id: string): NarrationWord[] {
    return timing.segments.find((segment) => segment.id === id)?.words ?? [];
  }

  private durationOf(segment: StorySegment) {
    if (this.mode === "file") return this.audio.duration || 0;
    return segment.text.length || 1;
  }

  private onSeeked() {
    if (!this.running || this.paused || this.mode !== "file") return;
    const actions = this.actionsUntilNow();
    const active = new Set(actions);
    const current = this.playlist[this.index];
    if (current) {
      const owned = [
        ...current.onEnter,
        ...(current.cues?.map((cue) => cue.action) ?? []),
        ...current.onExit,
      ];
      for (const action of owned) {
        if (!active.has(action)) this.fired.delete(action);
      }
    }
    for (const action of actions) this.fired.add(action);
    this.emit({ type: "sync", actions });
  }

  private actionsUntilNow() {
    const actions: StoryAction[] = [];
    const push = (action: StoryAction) => {
      if (!actions.includes(action)) actions.push(action);
    };
    for (let index = 0; index < this.index; index += 1) {
      const segment = this.playlist[index];
      segment.onEnter.forEach(push);
      segment.cues?.forEach((cue) => push(cue.action));
      segment.onExit.forEach(push);
    }
    const segment = this.playlist[this.index];
    if (!segment) return actions;
    segment.onEnter.forEach(push);
    for (const cue of segment.cues ?? []) {
      const at = this.resolveCue(segment, cue, this.audio.duration);
      if (at != null && this.audio.currentTime >= at) push(cue.action);
    }
    return actions;
  }

  private fire(action: StoryAction) {
    if (this.fired.has(action)) return;
    this.fired.add(action);
    this.emit({ type: "action", action, segmentId: this.currentSegmentId ?? "" });
  }

  private emitProgress(segment: StorySegment, currentTime: number, duration: number) {
    const progress: NarrationProgress = {
      segmentId: segment.id,
      currentTime: Number.isFinite(currentTime) ? currentTime : 0,
      duration: Number.isFinite(duration) ? duration : 0,
      mode: this.mode,
    };
    for (const listener of [...this.progressListeners]) listener(progress);
  }

  private emit(event: NarrationEvent) {
    for (const listener of [...this.listeners]) listener(event);
  }
}
