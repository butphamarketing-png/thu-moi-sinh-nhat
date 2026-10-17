export const storyActions = [
  "memory-in",
  "memory-out",
  "angels-in",
  "frames-in",
  "together-in",
  "joy-in",
  "focus-in",
  "name-left",
  "name-right",
  "hero-in",
  "dress-label",
  "dress-value",
  "event-time",
  "event-place",
  "program-0",
  "program-1",
  "program-2",
  "program-3",
  "finale",
] as const;

export type StoryAction = (typeof storyActions)[number];

export type StoryPhase =
  | "intro"
  | "transition"
  | "playing"
  | "paused"
  | "completed"
  | "skipped";

export type SceneId =
  | "none"
  | "memory"
  | "angels"
  | "frames"
  | "together"
  | "joy"
  | "focus"
  | "names"
  | "page"
  | "done";

export type PortraitStage =
  | "hidden"
  | "silhouette"
  | "framed"
  | "focus"
  | "named-left"
  | "complete";

export type AudioMode = "file" | "speech";

export type StoryCue = {
  id: string;
  action: StoryAction;
  /** Giây trong file audio. Chỉ điền sau khi đã đo file thật. */
  at?: number;
  /** Khớp với một từ trong phụ đề hoặc với vị trí ký tự của lời đọc. */
  afterWord?: string;
  /** Tỷ lệ 0–1 trên thời lượng thật của file, dùng khi chưa có mốc từ. */
  atRatio?: number;
};

export type StorySegment = {
  id: string;
  text: string;
  audioSrc: string;
  enabled: boolean;
  skippable: boolean;
  onEnter: StoryAction[];
  onExit: StoryAction[];
  cues?: StoryCue[];
};

export type NarrationWord = {
  text: string;
  start: number;
  end: number;
};

export type NarrationTimingFile = {
  voice: string | null;
  segments: Array<{
    id: string;
    duration: number;
    words: NarrationWord[];
  }>;
};

export type NarrationEvent =
  | { type: "segment"; id: string; text: string }
  | { type: "action"; action: StoryAction; segmentId: string }
  | { type: "sync"; actions: StoryAction[] }
  | { type: "pause" }
  | { type: "resume" }
  | { type: "complete" }
  | { type: "error"; message: string }
  | { type: "mode"; mode: AudioMode; vietnamese: boolean };

export type NarrationProgress = {
  segmentId: string | null;
  currentTime: number;
  duration: number;
  mode: AudioMode;
};
